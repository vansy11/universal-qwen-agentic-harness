// parent-silencer.js — MessageDisplay hook
// Suppresses parent-agent and subagent internal noise from user-facing output.
// Keeps displayed messages clean by removing:
// - Parent echo/introduction of subagent results
// - Short filler status messages ("Waiting...", "Processing...")
// - Orphaned thinking/reasoning tags that leaked into output
// - Raw tool call JSON dumps
// - Internal agent coordination chatter

let input = "";
process.stdin.on("data", (c) => (input += c));
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input);
    const text = data.message || data.content || data.text || "";

    if (!text) {
      console.log(JSON.stringify({}));
      return;
    }

    // 1. Detect parent echo of subagent results (suppress entirely)
    const isParentEcho =
      /Here is the result from|The sub-agent has completed|Based on the sub-agent|I have delegated the task|The agent has returned|Subagent .+ reports/i.test(
        text,
      );
    const isShortFiller =
      text.trim().length < 80 &&
      /Waiting|Processing|Delegating|Stand by|Working on|Let me/i.test(text);

    if (isParentEcho || isShortFiller) {
      console.log(
        JSON.stringify({
          hookSpecificOutput: { hookEventName: "MessageDisplay", message: "" },
        }),
      );
      return;
    }

    // 2. Strip orphaned thinking/reasoning tags
    let cleaned = text;
    cleaned = cleaned.replace(/<think[\s\S]*?<\/think>/gi, "");
    cleaned = cleaned.replace(/<thinking[\s\S]*?<\/thinking>/gi, "");
    cleaned = cleaned.replace(/<reasoning[\s\S]*?<\/reasoning>/gi, "");

    // 3. Remove raw JSON tool call artifacts
    cleaned = cleaned.replace(/\{[\s]*"tool_use"[\s\S]*?\}[\s]*\}/g, "");
    cleaned = cleaned.replace(
      /"function_call"[\s\S]*?"arguments"[\s\S]*?\}/g,
      "",
    );

    // 4. Strip subagent internal status lines
    const agentNoise = [
      /✓ (Agent|Task|Subagent) .+ completed in [\d.]+s\.?/gi,
      /● (Agent|Task) .+ (started|running|paused|resumed)\.?/gi,
      /✗ (Agent|Task) .+ (failed|timed out|cancelled)\.?/gi,
      /Ran \d+ (tool calls|steps) in [\d.]+s\.?/gi,
      /\[\d+\/\d+\] (Processing|Executing|Running)/gi,
    ];
    agentNoise.forEach((pat) => {
      cleaned = cleaned.replace(pat, "");
    });

    // 5. Remove "Detailed Results:" raw dump headers
    cleaned = cleaned.replace(/Detailed Results:\s*\n/gi, "");
    cleaned = cleaned.replace(/"search_results":\s*\[[\s\S]*?\]/g, "");

    // 6. Collapse excessive blank lines
    cleaned = cleaned.replace(/\n{4,}/g, "\n\n");

    // 7. Remove trailing whitespace per line
    cleaned = cleaned.replace(/[ \t]+$/gm, "");

    const result = cleaned.trim();

    // If cleaning removed everything, suppress
    if (!result) {
      console.log(
        JSON.stringify({
          hookSpecificOutput: { hookEventName: "MessageDisplay", message: "" },
        }),
      );
      return;
    }

    console.log(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "MessageDisplay",
          message: result,
        },
      }),
    );
  } catch (e) {
    console.log(JSON.stringify({}));
  }
});
