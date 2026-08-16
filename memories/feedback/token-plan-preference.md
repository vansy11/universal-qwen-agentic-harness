---
name: token-plan-preference
description: Token Plan preference with 66.7% cost savings over Lite Plan using flash models
type: feedback
---

**Rule:** Default to Token Plan subscription with economical models (qwen3.6-flash, deepseek-v4-flash) for cost efficiency.
**Why:** User confirmed 66.7% cost savings ($0.35 vs $1.05 for 350k tokens) through `qwen --usage` output, prioritizing actual usage billing over fixed Lite Plan subscription.
**How to apply:** Use slash commands (`/research`, `/route`, `/backtest`) leveraging MCP servers (0 token cost). Monitor daily via `qwen --usage`. Prefer flash models unless premium quality is required for critical tasks.
