---
description: Run routing regression evals to measure harness precision
---
Run: node ~/.qwen/core/router-eval.js (resolve `~` to the user home first: %USERPROFILE% on Windows, $HOME on macOS/Linux)
Report pass/fail per case + precision %. If any case FAILs, identify the missing routing keywords and fix prompt-router.