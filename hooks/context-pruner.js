// context-pruner.js — UserPromptSubmit hook
// Prunes noise from user prompt before processing:
// - Strips redundant system-reminder duplicates
// - Collapses excessive whitespace
// - Removes stale tool error artifacts
// - Trims leading/trailing filler from copy-paste

let input = "";
process.stdin.on("data", (c) => (input += c));
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input);
    let prompt = data.prompt || "";

    // 1. Remove duplicate system-reminder blocks (keep first occurrence only)
    const seenReminders = new Set();
    prompt = prompt.replace(
      /<system-reminder>[\s\S]*?<\/system-reminder>/gi,
      (match) => {
        const hash = match.replace(/\s+/g, " ").trim();
        if (seenReminders.has(hash)) return "";
        seenReminders.add(hash);
        return match;
      },
    );

    // 2. Strip known noise patterns from tool/subagent output leakage
    const noisePatterns = [
      /●︎ Background agent "[^"]+" failed\.\n?/gi,
      /✗ brave_web_search[\s\S]*?(?=\n\n|◆|●|$)/gi,
      /✗ tavily_search[\s\S]*?(?=\n\n|◆|●|$)/gi,
      /MCP tool '[^']+' reported[\s\S]*?(?=\n\n|$)/gi,
      /Blocked by auto mode policy:[\s\S]*?(?=\n\n|$)/gi,
      /Error: Brave API error:[\s\S]*?(?=\n\n|$)/gi,
      /SUBSCRIPTION_TOKEN_INVALID[\s\S]*?(?=\n\n|$)/gi,
      /●︎ Ran \d+ stop hooks[\s\S]*?(?=◆|●|$)/gi,
      /Tool "[^"]+" not found in registry[\s\S]*?(?=\n\n|$)/gi,
      /\.\.\. first \d+ lines hidden \.\.\./gi,
      /Press ctrl-s to show more lines/gi,
      /agent-[\w-]+-[\w]+\.jsonl/gi,
      /agent-[\w-]+-[\w]+\.meta\.json/gi,
    ];
    noisePatterns.forEach((pat) => {
      prompt = prompt.replace(pat, "");
    });

    // 3. Collapse horizontal rules (───, ━━━)
    prompt = prompt.replace(/[─━]{10,}/g, "");

    // 4. Collapse 4+ consecutive newlines into 2
    prompt = prompt.replace(/\n{4,}/g, "\n\n");

    // 5. Remove empty XML tags
    prompt = prompt.replace(/<(\w+)>\s*<\/\1>/g, "");

    // 6. Trim
    prompt = prompt.trim();

    console.log(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "UserPromptSubmit",
          prompt: prompt,
        },
      }),
    );
  } catch (e) {
    console.log(JSON.stringify({}));
  }
});
