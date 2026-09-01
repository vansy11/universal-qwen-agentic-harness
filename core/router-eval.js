#!/usr/bin/env node
// core/router-eval.js — routing-precision regression evaluator.
// Loads evals/cases.json, runs each prompt through the prompt-router,
// and reports per-case pass/fail plus overall precision percentage.
// Usage: node core/router-eval.js   (or `/eval`)

const fs = require("fs");
const path = require("path");

const CASES_FILE = path.join(__dirname, "..", "evals", "cases.json");
const ROUTER = require(path.join(__dirname, "..", "hooks", "prompt-router.js"));

function expectedInAgents(expectedAgent, injectedAgents) {
  // injectedAgents are full paths like "agents/backend-engineer.md".
  return injectedAgents.some(
    (p) => path.basename(p, path.extname(p)) === expectedAgent,
  );
}

function main() {
  if (!fs.existsSync(CASES_FILE)) {
    console.error(`Cases file not found: ${CASES_FILE}`);
    process.exit(1);
  }

  const cases = JSON.parse(fs.readFileSync(CASES_FILE, "utf8"));
  let pass = 0;

  for (const c of cases) {
    const result = ROUTER(c.prompt);
    const agents = result.injectedAgents
      .map((p) => path.basename(p, ".md"))
      .join(", ");
    const ok = expectedInAgents(c.expect, result.injectedAgents);
    if (ok) pass++;
    console.log(
      `${ok ? "PASS" : "FAIL"} | "${c.prompt}" -> expected [${c.expect}], got [${agents}]`,
    );
  }

  const precision = ((pass / cases.length) * 100).toFixed(1);
  console.log(`\nPrecision: ${pass}/${cases.length} (${precision}%)`);
  process.exit(pass === cases.length ? 0 : 1);
}

main();
