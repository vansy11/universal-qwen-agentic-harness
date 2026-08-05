---
description: "Analyze prompt and route to optimal agent/skill combination"
---
Execute the prompt-router hook manually:

1. Scan prompt against 40 keyword route patterns
2. Score each route by keyword match count
3. Select highest-scoring agent + skill pair
4. If no match and heavy task detected, default to fullstack-orchestrator
5. Display recommended agent, skill, and matched keywords
6. Provide instruction to read corresponding .md files for detailed protocols

This command shows routing analysis without executing the task.