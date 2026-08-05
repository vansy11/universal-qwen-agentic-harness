---
name: universal-execution-loop
description: Enforces a universal build-run-test-fix loop for ANY domain (Web, Finance, Backend). After writing code, execute it, verify output, and fix errors autonomously before reporting to the user.
metadata:
  category: methodology
---
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