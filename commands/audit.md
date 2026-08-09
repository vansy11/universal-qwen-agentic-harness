---
description: Audit harness usage (agents, models, MCPs, skills)
---

Run the harness usage audit script based on your Operating System:

If on Windows (PowerShell):
powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\.qwen\core\usage-audit.ps1"

If on macOS/Linux (requires PowerShell Core installed):
pwsh -File "$HOME/.qwen/core/usage-audit.ps1"

Synthesize the JSON output into ONE clean Markdown table with columns:
Component | Status | Details

Display rules:
- Active agents: display name + invocation count + model used
- Unused agents: display only the count + a brief list (not one per line)
- MCPs: display active ones with session counts, mark unused ones as "never"
- Do not dump raw JSON output. No thinking tags. No emojis.
- End with 2-3 insights: most active agent, dominant MCP, and 1 prune recommendation.
- Close with --- then Sources: [usage-audit.ps1]
