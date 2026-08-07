---
name: tdd-workflow
description: Enforces Test-Driven Development. Write failing test first, then implement code, then verify. Use for feature development.
metadata:
  category: methodology
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Test-driven development
- APPLY: Red→green→refactor; tests before code
- VERIFY: Tests fail first, then pass
- ANTI-PATTERNS: Tests written after, asserting nothing
<!-- /QWEN-STYLE -->


# TDD Workflow (RED -> GREEN -> REFACTOR)
When asked to build a feature, you MUST follow this exact sequence:
1. RED: Write a unit test (using Jest/Vitest/Pytest) that describes the expected behavior. Run the test to confirm it FAILS.
2. GREEN: Write the minimal implementation code to make the test PASS.
3. REFACTOR: Clean up the code without changing behavior.
4. VERIFY: Run the test suite one final time.
Do not report task completion until all tests are GREEN.

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
