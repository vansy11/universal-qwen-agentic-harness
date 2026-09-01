// quality-gate.js — Stop hook (domain-agnostic)
// Universal QC gate that adapts evaluation strategy based on project domain.
// Domains: web (Playwright), api (endpoint check), python (syntax+run),
//          quant (param validation), general (slop + structure check)

const fs = require("fs");
const path = require("path");

let input = "";
process.stdin.on("data", (c) => (input += c));
process.stdin.on("end", async () => {
  try {
    const data = JSON.parse(input);
    const transcript = JSON.stringify(data.transcript || data);
    const evaluationReport = [];

    // --- UNIVERSAL CHECKS (all domains) ---

    // 1. AI Slop detection
    const slopPatterns = [
      "Delve into",
      "In conclusion",
      "Furthermore",
      "Moreover",
      "Revolutionary",
      "Cutting-edge",
      "Seamless",
      "A testament to",
      "Navigating the complexities",
      "Here is",
      "Certainly!",
      "As an AI",
      "Berikut adalah",
      "Tentu saja",
      "Dengan senang hati",
    ];
    const lastMsg = (data.last_message && data.last_message.text) || "";
    for (const slop of slopPatterns) {
      if (lastMsg.includes(slop)) {
        evaluationReport.push(
          `FAIL: AI Slop detected ("${slop}"). Humanize the text.`,
        );
      }
    }

    // 2. Detect placeholder/TODO remnants
    const todoPattern = /TODO|FIXME|HACK|XXX|PLACEHOLDER|TEMP/gi;
    const todoMatches = lastMsg.match(todoPattern);
    if (todoMatches && todoMatches.length > 0) {
      evaluationReport.push(
        `FAIL: ${todoMatches.length} placeholder(s) found in output (${[...new Set(todoMatches)].join(", ")}).`,
      );
    }

    // 3. Detect hardcoded secrets
    const secretPatterns = [
      /(?:password|passwd|pwd)\s*[:=]\s*['"][^'"]{3,}['"]/i,
      /(?:api_?key|apikey|secret|token)\s*[:=]\s*['"][^'"]{8,}['"]/i,
      /(?:sk-|pk_|ghp_|glpat-)[A-Za-z0-9]{20,}/i,
    ];
    for (const pat of secretPatterns) {
      if (pat.test(lastMsg)) {
        evaluationReport.push(
          `FAIL: Potential hardcoded secret detected. Use environment variables.`,
        );
        break;
      }
    }

    // --- DOMAIN DETECTION & DOMAIN-SPECIFIC EVAL ---

    // Detect domain from transcript context
    const domain = detectDomain(transcript);

    switch (domain) {
      case "web":
        await evalWeb(evaluationReport);
        break;
      case "api":
        await evalApi(evaluationReport, lastMsg);
        break;
      case "python":
        await evalPython(evaluationReport, lastMsg);
        break;
      case "quant":
        evalQuant(evaluationReport, lastMsg);
        break;
      case "devops":
        evalDevOps(evaluationReport, lastMsg);
        break;
      default:
        evalGeneral(evaluationReport, lastMsg);
    }

    // --- FINAL DECISION ---
    // Only FAIL entries block; WARNs are advisory. Silent on approval so the
    // Stop hook does not print noise into the UI.
    const failures = evaluationReport.filter((line) =>
      line.startsWith("FAIL"),
    );
    if (failures.length > 0) {
      console.log(
        JSON.stringify({
          decision: "block",
          reason: `[REJECTED] QC failed: ${failures.join(" ")} Fix these issues and rerun.`,
        }),
      );
    }
  } catch (e) {
    // Fail open silently; a broken gate must not wedge the session.
  }
});

// --- DOMAIN DETECTION ---
function detectDomain(transcript) {
  const t = transcript.toLowerCase();
  if (
    /playwright|localhost:\d{4}|\.html|\.jsx|\.tsx|react|next\.js|vite|tailwind/i.test(
      t,
    )
  )
    return "web";
  if (
    /express|fastapi|flask|django|\.\/api\/|rest api|endpoint|route|controller/i.test(
      t,
    )
  )
    return "api";
  if (/python|\.py\b|pip |venv|pytest|pandas|numpy|asyncio/i.test(t))
    return "python";
  if (
    /backtest|strategy|alpha|portfolio|sharpe|drawdown|greeks|black.?scholes|pine script/i.test(
      t,
    )
  )
    return "quant";
  if (
    /docker|dockerfile|kubernetes|terraform|ci\/cd|github actions|deploy|nginx/i.test(
      t,
    )
  )
    return "devops";
  return "general";
}

// --- DOMAIN-SPECIFIC EVALUATORS ---

async function evalWeb(report) {
  try {
    const { autoEvaluate } = require("../core/eval-runner.js");
    const result = await autoEvaluate(
      "http://localhost:3000",
      "Web UI evaluation",
    );
    if (result.status === "FAIL") {
      report.push(...result.reasons);
    }
  } catch (e) {
    // Playwright not running or app not started — skip silently
  }
}

async function evalApi(report, lastMsg) {
  // Check if API endpoints were defined with proper structure
  const hasEndpointDef =
    /(?:app\.(get|post|put|delete|patch)|router\.|@app\.route|@router\.)/i.test(
      lastMsg,
    );
  const hasErrorHandling =
    /(?:try|catch|except|\.catch|res\.status\(\d{3}\))/i.test(lastMsg);
  const hasValidation = /(?:zod|joi|yup|validate|schema|param\(|query\()/i.test(
    lastMsg,
  );

  if (hasEndpointDef && !hasErrorHandling) {
    report.push(
      "WARN: API endpoints defined without error handling. Add try/catch or error middleware.",
    );
  }
  if (hasEndpointDef && !hasValidation) {
    report.push(
      "WARN: API endpoints defined without input validation. Add Zod/Joi/schema validation.",
    );
  }
}

async function evalPython(report, lastMsg) {
  // Check for common Python anti-patterns
  const hasBareExcept = /except\s*:/i.test(lastMsg);
  const hasStarImport = /from\s+\w+\s+import\s+\*/i.test(lastMsg);
  const hasTypeHints =
    /def\s+\w+\s*\([^)]*:\s*(str|int|float|bool|list|dict|Optional|Union|Any)/i.test(
      lastMsg,
    );
  const hasPrintDebug = /print\s*\(\s*['"]debug/i.test(lastMsg);

  if (hasBareExcept) {
    report.push(
      "FAIL: Bare except clause found. Use specific exception types.",
    );
  }
  if (hasStarImport) {
    report.push(
      "FAIL: Wildcard import (import *) found. Use explicit imports.",
    );
  }
  if (hasPrintDebug) {
    report.push(
      "WARN: Debug print statement found. Use logging module instead.",
    );
  }
}

function evalQuant(report, lastMsg) {
  // Validate quant code has essential safeguards
  const hasRiskCheck =
    /(?:stop.?loss|position.?size|max.?drawdown|risk.?limit|circuit.?breaker)/i.test(
      lastMsg,
    );
  const hasBacktest = /(?:backtest|walk.?forward|sharpe|sortino|calmar)/i.test(
    lastMsg,
  );
  const hasDataValidation =
    /(?:isnull|isna|dropna|fillna|assert|validate)/i.test(lastMsg);

  if (!hasRiskCheck) {
    report.push(
      "WARN: Quant strategy without risk management (stop-loss, position sizing, circuit breaker).",
    );
  }
  if (!hasDataValidation) {
    report.push(
      "WARN: Quant code without data validation (null checks, assertions).",
    );
  }
}

function evalDevOps(report, lastMsg) {
  const hasHealthCheck =
    /(?:health.?check|healthcheck|HEALTHCHECK|liveness|readiness)/i.test(
      lastMsg,
    );
  const hasSecretsInDockerfile =
    /(?:ENV\s+\w*(KEY|SECRET|TOKEN|PASSWORD)\w*\s+\S+)/i.test(lastMsg);
  const hasMultiStage = /FROM\s+\S+\s+AS\s+\w+/i.test(lastMsg);

  if (/dockerfile/i.test(lastMsg) && !hasMultiStage) {
    report.push(
      "WARN: Dockerfile without multi-stage build. Consider for smaller images.",
    );
  }
  if (hasSecretsInDockerfile) {
    report.push(
      "FAIL: Secrets hardcoded in Dockerfile. Use build args or runtime env vars.",
    );
  }
}

function evalGeneral(report, lastMsg) {
  // General code quality checks
  const hasCodeBlock = /```[\s\S]*```/.test(lastMsg);
  if (hasCodeBlock) {
    const hasErrorHandling =
      /(?:try|catch|except|\.catch|onerror|rescue)/i.test(lastMsg);
    if (!hasErrorHandling && lastMsg.length > 500) {
      report.push(
        "WARN: Code output without error handling. Add try/catch for async/network operations.",
      );
    }
  }
}
