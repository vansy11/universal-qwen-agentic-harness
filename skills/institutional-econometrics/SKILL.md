---
name: institutional-econometrics
description: Advanced financial math, risk metrics, and time-series analysis. Forbids AI from guessing mathematical formulas.
metadata:
  category: quant
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Quantitative Risk & Performance Metrics
- APPLY: Sharpe, Sortino, Max Drawdown, VaR (95%), CVaR (95%)
- VERIFY: Run `core/quant-engine.py` via `run_shell_command` to calculate metrics. NEVER do math in your head.
- ANTI-PATTERNS: Hardcoding metrics, ignoring risk-free rates, using daily mean instead of annualized standard deviation.
<!-- /QWEN-STYLE -->

# Institutional Econometrics Skill
When evaluating a trading strategy or portfolio:
1. You MUST NOT output Sharpe, VaR, or Drawdown values based on your own internal logic. LLMs are bad at complex math.
2. Extract the daily returns array from the backtest.
3. Execute `python core/quant-engine.py` and pass the JSON: `{"function": "sharpe", "data": {"returns": [0.01, -0.02]}}`.
4. Read the stdout JSON result and format it for the user.
5. If CVaR > 5%, flag the strategy as "High Tail Risk".

## FILE WRITE PROTOCOL (MANDATORY)
BEFORE every write_file or edit_file call:
1. ALWAYS call read_file on the target path FIRST
