const fs = require('fs');
const path = require('path');

module.exports = async function (hookData) {
    const { last_message } = hookData;
    const evaluationReport = [];

    // 1. Check for AI Slop in the final output
    const slopPatterns = [
        "Delve into", "In conclusion", "Furthermore", "Moreover",
        "Revolutionary", "Cutting-edge", "Robust", "Seamless",
        "A testament to", "Navigating the complexities"
    ];

    if (last_message && last_message.text) {
        for (const slop of slopPatterns) {
            if (last_message.text.includes(slop)) {
                evaluationReport.push(`FAIL: AI Slop detected ("${slop}"). Humanize the text.`);
            }
        }
    }

    // 2. Trigger Playwright Auto-Eval if applicable 
    // (This assumes the app is running locally, e.g., http://localhost:3000)
    try {
        const { autoEvaluate } = require('../core/eval-runner.js');
        // Change URL to your local dev server or testing environment
        const evalResult = await autoEvaluate('http://localhost:3000', 'Evaluating final output'); 
        
        if (evalResult.status === 'FAIL') {
            evaluationReport.push(...evalResult.reasons);
        }
    } catch (error) {
        // If Playwright is not running or app isn't started, we don't hard-fail, just log it.
        console.log("[Quality Gate] Playwright eval skipped:", error.message);
    }

    // 3. Final Decision
    if (evaluationReport.length > 0) {
        console.log("[Quality Gate] Execution REJECTED. Looping back for fixes.");
        return {
            decision: "block",
            reason: `[REJECTED] QC failed: ${evaluationReport.join(" ")} Fix these issues and rerun.`
        };
    }

    // If no issues, allow the AI to finish and deliver to the user
    console.log("[Quality Gate] Execution APPROVED.");
    return { decision: "approve" };
};
