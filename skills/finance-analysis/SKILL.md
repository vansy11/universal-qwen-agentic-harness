---
name: finance-analysis
description: Financial modeling: DCF, ratio analysis, portfolio optimization, risk metrics (VaR, Sharpe, Sortino). Uses SQLite MCP for price data.
metadata:
  category: finance
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: DCF + ratio + risk metrics
- APPLY: Transparent assumptions, sensitivity
- VERIFY: Benchmarks + limits disclosed
- ANTI-PATTERNS: Projections as certainties
<!-- /QWEN-STYLE -->


# Finance Analysis Skill
Build Discounted Cash Flow (DCF) models. Calculate Sharpe and Sortino ratios. Output data tables in Markdown.

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
