// lint-check.js — PostToolUse (write_file) hook
// Lightweight static lint on newly written files. Flags TypeScript `any`,
// debug console statements, and legacy `var`. Emits advisory context only;
// it never blocks the tool.

let input = "";
process.stdin.on("data", (c) => (input += c));
process.stdin.on("end", () => {
  try {
    const payload = JSON.parse(input);
    const filePath = payload.tool_input?.file_path || "";
    const content =
      payload.tool_input?.content || payload.tool_input?.new_string || "";

    if (!filePath || !content) {
      console.log(JSON.stringify({}));
      return;
    }

    const violations = [];
    const isTS = /\.tsx?$/.test(filePath);

    if (isTS && /:\s*any\b/.test(content)) {
      violations.push(
        "Type 'any' is forbidden in TypeScript; use a proper interface or unknown.",
      );
    }
    if (isTS && /\bvar\s+[a-zA-Z_$]/.test(content)) {
      violations.push("Use 'let' or 'const' instead of 'var'.");
    }
    if (/console\.(log|debug)\s*\(/.test(content)) {
      violations.push(
        "Debug console statement present; remove before shipping.",
      );
    }

    if (violations.length === 0) {
      console.log(JSON.stringify({}));
      return;
    }

    console.log(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext:
            "LINT (advisory) in " + filePath + ": " + violations.join(" "),
        },
      }),
    );
  } catch (e) {
    console.log(JSON.stringify({}));
  }
});
