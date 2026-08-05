---
name: verification-loop
description: Continuous verification of code changes. Run linters, type checkers, and tests after every significant edit.
metadata:
  category: methodology
---
# Verification Loop
Never assume your code works. Prove it.
1. After writing/editing a file, check for syntax errors.
2. Run the project's linter (ESLint, Flake8, etc.).
3. Run the type checker (tsc, mypy).
4. If errors are found, fix them immediately before moving to the next task.