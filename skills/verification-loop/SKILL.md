---
name: verification-loop
description: Continuous verification of code changes. Run linters, type checkers, and tests after every significant edit.
metadata:
  category: methodology
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Post-build verification
- APPLY: Build+test+lint+security sweep
- VERIFY: All gates green with evidence
- ANTI-PATTERNS: Claiming done without gates
<!-- /QWEN-STYLE -->


# Verification Loop
Never assume your code works. Prove it.
1. After writing/editing a file, check for syntax errors.
2. Run the project's linter (ESLint, Flake8, etc.).
3. Run the type checker (tsc, mypy).
4. If errors are found, fix them immediately before moving to the next task.

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
