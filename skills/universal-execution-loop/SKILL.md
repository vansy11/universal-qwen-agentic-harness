---
name: universal-execution-loop
description: Enforces a universal build-run-test-fix loop for ANY domain (Web, Finance, Backend). After writing code, execute it, verify output, and fix errors autonomously before reporting to the user.
metadata:
  category: methodology
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Generic execution loop
- APPLY: Think→search→execute→verify→learn
- VERIFY: Verify evidence present
- ANTI-PATTERNS: Skipping verify
<!-- /QWEN-STYLE -->


# Universal Execution Loop (Autonomous Self-Healing)
When you write or modify code for ANY domain, you MUST follow this sequence:
1. WRITE: Write the code (React, Python, Bash, Docker, etc.).
2. EXECUTE: Run the code or start the server using un_shell_command. (Use background execution for servers).
3. VERIFY:
   - For UI: Use Playwright MCP to screenshot and check layout.
   - For API/Backend: Send a test request and check the HTTP status code.
   - For Scripts/Quant: Run the script and check stdout/stderr for exceptions.
4. FIX: If execution fails, read the error log. Fix the code immediately. Do not ask the user for help.
5. REPEAT: Run the code again. Do NOT report task completion until the code executes 100% successfully and produces the expected output.

## FILE WRITE PROTOCOL (MANDATORY)
Qwen Code blocks write_file if the target file was never read in the current session.
This is a platform safety guard, not optional.

BEFORE every write_file or edit_file call:
1. ALWAYS call read_file on the target path FIRST
2. If file doesn't exist → read fails silently → that's OK, continue to write
3. If file exists → content loaded → now you can safely overwrite/append

NEVER skip the read step. This applies to:
- New files (read first even if doesn't exist)
- Existing files (read to understand current state)
- Config files, code files, documentation, reports

Example correct sequence:
read_file("target/path") ← MUST do this first
[process/generate content]
write_file("target/path", content) ← Now this works
