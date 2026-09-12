---
name: symbolic-math-verifier
description: Verify all non-trivial math symbolically and numerically with SymPy/NumPy instead of mental derivation. Anti-hallucination gate for formulas, proofs, and statistics.
metadata:
  category: math
---

## EXECUTION STANDARD (QWEN STYLE)

Focus: Computed truth over confident mental math

- APPLY: Encode every derivation in SymPy (or NumPy/scipy for numerics) and run it
- VERIFY: Result confirmed by simplification, substitution, or numeric sampling before presentation
- ANTI-PATTERNS: Presenting derived formulas never executed; trusting arithmetic done "in head"

<!-- /QWEN-STYLE -->

# Symbolic Math Verifier Skill

## When to Activate

- Any derivation, formula manipulation, proof step, integral/derivative, matrix op, probability, or statistics result.
- Any quant/finance formula before it reaches the user (pairs with institutional-econometrics).
- Whenever a numeric claim has more than one operation.

## The Gate (STRICT)

- NEVER present a derived formula, simplified expression, or multi-step numeric result that was not executed.
- Encode → run → verify → present. Mental math is a draft, never a deliverable.

## Workflow

1. **Encode** the problem in SymPy (`symbols`, `Eq`, `simplify`, `diff`, `integrate`, `solve`).
2. **Verify** with one independent check:
   - Symbolic: `simplify(a - b) == 0` for claimed equivalences.
   - Substitution: plug concrete values into both sides.
   - Numeric sampling: evaluate at 3+ points (use NumPy for arrays, scipy.stats for distributions).
3. **Present** the result with its verification status: `verified symbolically` or `verified numerically at x = {...}`.

## Rules (STRICT)

- If SymPy disagrees with the mental draft, the computation wins — state the correction explicitly.
- Keep verification snippets minimal: the check, not a tutorial.
- For statistics/probability, cross-check closed-form results with a 10k-sample simulation when cheap.
- Units and domains matter: state assumptions (x > 0, integer n, etc.) when solving.
- If a problem is not computable in-session (no Python available), say so instead of guessing.

## Finance/Quant Tie-in

- All formulas in position-sizing-risk-math and institutional-econometrics outputs must pass this gate.
- A wrong formula delivered confidently is worse than no formula.
