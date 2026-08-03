---
name: tdd-workflow
description: Enforces Test-Driven Development. Write failing test first, then implement code, then verify. Use for feature development.
metadata:
  category: methodology
---
# TDD Workflow (RED -> GREEN -> REFACTOR)
When asked to build a feature, you MUST follow this exact sequence:
1. RED: Write a unit test (using Jest/Vitest/Pytest) that describes the expected behavior. Run the test to confirm it FAILS.
2. GREEN: Write the minimal implementation code to make the test PASS.
3. REFACTOR: Clean up the code without changing behavior.
4. VERIFY: Run the test suite one final time.
Do not report task completion until all tests are GREEN.