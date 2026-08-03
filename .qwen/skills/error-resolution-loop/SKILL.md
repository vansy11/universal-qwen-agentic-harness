---
name: error-resolution-loop
description: Systematic debugging methodology. Read error logs, isolate root cause, implement fix, and verify. Use when code fails or tests fail.
metadata:
  category: methodology
---
# Error Resolution Loop
When you encounter an error (syntax error, failed test, or runtime crash):
1. READ: Read the full error stack trace. Do not guess the error.
2. ISOLATE: Identify the exact file and line number causing the issue.
3. ANALYZE: Explain to yourself (in thought) WHY the error is happening.
4. FIX: Implement the minimal change required to fix the error. Do not rewrite the entire file.
5. VERIFY: Re-run the command that caused the error to confirm it is fixed.
Never report a task as complete if there are outstanding errors.
