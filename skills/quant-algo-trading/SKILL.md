---
name: quant-algo-trading
description: Quantitative trading strategy development + backtesting (backtrader/vectorbt). Mean-reversion, momentum, ML signals, walk-forward analysis.
metadata:
  category: finance
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Strategy coding + backtest
- APPLY: Vectorized, cost model, no lookahead
- VERIFY: Walk-forward + cost-adjusted metrics
- ANTI-PATTERNS: Lookahead, in-sample overfit
<!-- /QWEN-STYLE -->


# Quant Algo Trading Skill
Implement strategies in Python. Run walk-forward analysis to prevent overfitting. Output performance metrics (CAGR, Max Drawdown, Win Rate, Monte Carlo, Risk Reward Ratio).

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
