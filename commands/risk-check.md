---
description: "Validate current positions and parameters against risk rules"
---
Delegate this task to the risk-manager agent. Execute the following workflow:

1. Load current portfolio state
2. Run validation against ~/.qwen/protocols/trading-risk-checklist.md (resolve `~` to the user home)
3. Check against ~/.qwen/memories/_global/trading-risk-tolerance.md (if the user has defined it)
4. Report pass/fail for each checkpoint
5. Block execution if any critical check fails

Agent chain: risk-manager -> quality-gatekeeper