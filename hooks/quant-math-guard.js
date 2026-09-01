const fs = require('fs');
const path = require('path');

module.exports = async function (hookData) {
    const { command } = hookData;
    
    // If AI tries to run a custom python script that contains forbidden math
    if (command && command.includes('python') && command.includes('.py')) {
        try {
            const scriptMatch = command.match(/python\s+([^\s]+\.py)/);
            if (scriptMatch) {
                const filePath = path.resolve(scriptMatch[1]);
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf-8');
                    // Anti-pattern: AI trying to write its own Black-Scholes or Sharpe logic
                    const forbiddenPatterns = [
                        /math\.erf/g, /norm_cdf/g, /math\.sqrt\(252\)/g, /excess_returns/g
                    ];
                    
                    for (const pattern of forbiddenPatterns) {
                        if (pattern.test(content) && !filePath.includes('quant-engine.py')) {
                            return {
                                decision: "block",
                                reason: `[REJECTED] Quant Math Guard: You are trying to manually calculate financial math in ${scriptMatch[1]}. This is forbidden due to precision risks. You MUST use the core/quant-engine.py via stdin/stdout JSON pipeline.`
                            };
                        }
                    }
                }
            }
        } catch (e) {
            console.log("[Quant Math Guard] Skipped file check:", e.message);
        }
    }
    
    return { decision: "approve" };
};

// --- HOOK WRAPPER (PreToolUse) ---
// Invoked as `node quant-math-guard.js`: read the shell command from stdin,
// run the guard, and emit a PreToolUse permission decision.
if (require.main === module) {
  let input = "";
  process.stdin.on("data", (c) => (input += c));
  process.stdin.on("end", async () => {
    try {
      const data = JSON.parse(input);
      const command = data.tool_input?.command || "";
      const result = await module.exports({ command });
      if (result && result.decision === "block") {
        console.log(
          JSON.stringify({
            hookSpecificOutput: {
              hookEventName: "PreToolUse",
              permissionDecision: "deny",
              permissionDecisionReason: result.reason,
            },
          }),
        );
      } else {
        console.log(JSON.stringify({}));
      }
    } catch (e) {
      console.log(JSON.stringify({}));
    }
  });
}
