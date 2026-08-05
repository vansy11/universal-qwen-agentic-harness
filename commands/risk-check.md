---
description: "Validate current positions and parameters against risk rules"
---
Delegate this task to the risk-manager agent. Execute the following workflow:

1. Load current portfolio state
2. Run validation against C:/Users/vansy/.qwen/protocols/trading-risk-checklist.md
3. Check against C:/Users/vansy/.qwen/memories/_global/trading-risk-tolerance.md
4. Report pass/fail for each checkpoint
5. Block execution if any critical check fails

Agent chain: risk-manager -> quality-gatekeeper