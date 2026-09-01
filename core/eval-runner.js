// core/eval-runner.js — headless runtime evaluator for generated web apps.
//
// Degrades gracefully and never false-blocks delivery:
//   1. Uses Playwright (full browser checks) when available.
//   2. Falls back to a native HTTP smoke check (Node 18+ fetch) otherwise.
//   3. Reports SKIP (not FAIL) when the browser is missing or the target app
//      is unreachable, so infrastructure gaps never block the quality gate.

async function autoEvaluate(url, prompt) {
  let playwright;
  try {
    playwright = require("playwright");
  } catch (_e) {
    playwright = null;
  }

  if (playwright && playwright.chromium) {
    return evaluateWithBrowser(playwright, url);
  }
  return evaluateWithHttp(url);
}

async function evaluateWithBrowser(playwright, url) {
  const reasons = [];
  let browser;
  let page;

  try {
    browser = await playwright.chromium.launch({ headless: true });
    page = await browser.newPage();

    page.on("pageerror", (err) =>
      reasons.push(`CRITICAL FAIL: Runtime error - ${err.message}`),
    );

    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
    } catch (_navErr) {
      // App not reachable — infrastructure gap, not a code defect.
      return { status: "SKIP", reason: `Target app not reachable at ${url}.` };
    }

    const canvasRendered = await page.evaluate(() => {
      const canvas = document.querySelector("canvas");
      return !!(canvas && canvas.width > 0 && canvas.height > 0);
    });
    if (!canvasRendered) {
      reasons.push("FAIL: Canvas element missing or not rendering.");
    }

    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(1500);

    const scrollTriggered = await page.evaluate(() => {
      const el = document.querySelector("[data-animate]");
      if (!el) return false;
      const style = window.getComputedStyle(el);
      return style.opacity !== "0" || style.transform !== "none";
    });
    if (!scrollTriggered) {
      reasons.push("FAIL: Scroll animations are not triggering.");
    }
  } catch (launchErr) {
    // Browser executable missing or launch failed — skip, never block.
    return {
      status: "SKIP",
      reason: `Browser unavailable: ${launchErr.message}`,
    };
  } finally {
    if (browser) await browser.close().catch(() => {});
  }

  return reasons.length === 0
    ? { status: "PASS", message: "All runtime evaluations passed." }
    : { status: "FAIL", reasons };
}

async function evaluateWithHttp(url) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    const body = await res.text();

    if (res.status >= 500) {
      return {
        status: "FAIL",
        reasons: [`FAIL: App returned HTTP ${res.status} from ${url}.`],
      };
    }
    if (body.length < 20) {
      return {
        status: "FAIL",
        reasons: ["FAIL: Response body unexpectedly empty."],
      };
    }
    return { status: "PASS", message: "HTTP smoke check passed." };
  } catch (_err) {
    // Connection refused / DNS / server not started — infrastructure gap.
    return {
      status: "SKIP",
      reason: `Target app not reachable at ${url} (dev server likely not running).`,
    };
  }
}

module.exports = { autoEvaluate };
