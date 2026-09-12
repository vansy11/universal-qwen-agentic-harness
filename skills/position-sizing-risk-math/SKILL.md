---
name: position-sizing-risk-math
description: Position sizing and risk math for futures. Kelly/fractional Kelly, risk-per-trade, expectancy, R-multiples, risk of ruin, drawdown-constrained sizing with NQ/MNQ contract math.
metadata:
  category: finance
---

## EXECUTION STANDARD (QWEN STYLE)

Focus: Every size justified by computed math

- APPLY: Compute contract counts from equity, stop distance, and point value — never vibes
- VERIFY: All formulas pass the symbolic-math-verifier gate; output shows the calculation
- ANTI-PATTERNS: Martingale, averaging down, sizing without a defined stop

<!-- /QWEN-STYLE -->

# Position Sizing & Risk Math Skill

## When to Activate

- Position sizing, risk per trade, Kelly criterion, contract/lot counts, leverage, drawdown budgets, expectancy, risk of ruin.

## Contract Constants (STRICT — do not guess others; state when unknown)

- NQ: $20 per point. MNQ: $2 per point.
- Verify current tick values against the exchange spec if the symbol is not NQ/MNQ — never assume.

## Core Formulas (compute every time, show the work)

- **Contracts** = floor( (equity × risk_fraction) / (stop_points × point_value) )
- **Expectancy** = (win_rate × avg_win) − (loss_rate × avg_loss), in R-multiples and $
- **Kelly f*** = W − (1 − W) / R, where W = win rate, R = avg_win/avg_loss
- **Applied Kelly:** never full Kelly — cap at ¼ to ½ Kelly, and still bounded by max risk-per-trade.

## Risk Rules (STRICT)

- Risk per trade default: 0.5–1% of equity; 2% is the hard ceiling and needs explicit user intent.
- Daily loss limit: stop sizing after the limit is hit (typ. 2–3%); state the remaining budget.
- No martingale, no averaging down, no widening stops to keep a size justified.
- Drawdown constraint: if sizing for a max drawdown D, risk_fraction ≤ D / longest_expected_losing_streak; estimate the streak from win rate (1/(1−W) runs), computed not guessed.
- If win rate/R are unknown, say so and use the conservative default (0.5% risk) — never fabricate statistics.

## Output Contract (every sizing answer includes)

1. Inputs: equity, risk %, stop in points, point value.
2. Contracts (floored) + the exact formula with numbers substituted.
3. $ at risk at stop, $ at target, R:R.
4. Expectancy if statistics are provided; otherwise labeled "not computable — no stats given".
5. Risk-of-ruin or drawdown note when a losing streak assumption is involved.

## Verification

- All formula results must be computed (per symbolic-math-verifier), not mentally estimated.
- Round DOWN contracts; never round risk up.
