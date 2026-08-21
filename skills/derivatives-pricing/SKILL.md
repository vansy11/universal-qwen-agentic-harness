---
name: derivatives-pricing
description: Options pricing, Greeks (Black-Scholes), and Monte Carlo Simulations for complex derivatives.
metadata:
  category: quant
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Options Valuation & Path-Dependent Simulations
- APPLY: Black-Scholes for standard European options. Monte Carlo for Asian/Lookback/Complex payoffs.
- VERIFY: Use `core/quant-engine.py` for closed-form math. Use `core/monte-carlo-engine.py` for simulations.
- ANTI-PATTERNS: Guessing implied volatility, running 1M simulations on pure Python, ignoring standard error.
<!-- /QWEN-STYLE -->

# Derivatives Pricing & Monte Carlo Skill
When asked to price an option or simulate portfolio risk:
1. **Standard Options (European):** Execute `python core/quant-engine.py` with `{"function": "black_scholes", ...}`.
2. **Complex Options (Asian, Lookback, Custom Payoffs):** Execute `python core/monte-carlo-engine.py` with `{"function": "mc_option_price", "data": {"S": 100, "K": 105, "T": 1, "r": 0.05, "sigma": 0.2, "simulations": 100000, "type": "call"}}`.
3. **Portfolio Tail Risk:** If user asks for stressed VaR, use `mc_var` function in `core/monte-carlo-engine.py`.
4. Always report the `standard_error` when running Monte Carlo to show confidence interval.

## FILE WRITE PROTOCOL (MANDATORY)
BEFORE every write_file or edit_file call:
1. ALWAYS call read_file on the target path FIRST
