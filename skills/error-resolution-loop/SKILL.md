---
name: error-resolution-loop
description: Systematic debugging methodology. Read error logs, isolate root cause, implement fix, and verify. Use when code fails or tests fail.
metadata:
  category: methodology
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Systematic debugging
- APPLY: Reproduce→isolate→fix→regression-test
- VERIFY: Repro gone + regression test added
- ANTI-PATTERNS: Guess-fixes without repro
<!-- /QWEN-STYLE -->


# Error Resolution Loop
When you encounter an error (syntax error, failed test, or runtime crash):
1. READ: Read the full error stack trace. Do not guess the error.
2. ISOLATE: Identify the exact file and line number causing the issue.
3. ANALYZE: Explain to yourself (in thought) WHY the error is happening.
4. FIX: Implement the minimal change required to fix the error. Do not rewrite the entire file.
5. VERIFY: Re-run the command that caused the error to confirm it is fixed.
Never report a task as complete if there are outstanding errors.

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
