---
name: market-microstructure-orderflow
description: Auction market theory and orderflow execution for intraday futures (NQ/MNQ). Initial Balance / IVB-ORB canon, footprint, delta/CVD, volume profile, VWAP confluence.
metadata:
  category: finance
---

## EXECUTION STANDARD (QWEN STYLE)

Focus: Rule-based intraday execution, zero discretion drift

- APPLY: IVB canon + orderflow confirmation before any signal
- VERIFY: Every signal cites its confirmation evidence (delta, volume, absorption, profile level)
- ANTI-PATTERNS: Signaling breakouts without orderflow confirmation; guessing values without data

<!-- /QWEN-STYLE -->

# Market Microstructure & Orderflow Skill

## When to Activate

- IVB, Opening Range Breakout, Initial Balance, orderflow, footprint, delta, CVD, volume profile, VWAP, auction market theory, or NQ/MNQ intraday execution.

## IVB Canon (Initial Balance Breakout — NEVER redefine)

- **IVB = Initial Balance Breakout**, a 30-minute ORB with orderflow confirmation. Not "Initial Volume Breakout", not "Indicator Value Block".
- **Initial Balance (IB):** first 30 minutes of RTH, 09:30–10:00 New York time.
- **Session:** RTH only (09:30–16:00 NY). All times stated in NY time.
- **Entry:** only after a candle CLOSES beyond the IB boundary, with orderflow confirmation.
- **Stop:** just inside the IB boundary.
- **Profit target:** 0.79 × IB range.
- **EOD:** flat by 15:40 NY, no exceptions.
- **Filters:** prior-day value area (PBD), Big Trades volume validation, ATR deviation extremes, market-maker daily range exhaustion/imbalance.

## Orderflow Confirmation (STRICT — required for every signal)

A breakout is tradable only with at least one confirming read:

- **Volume surge:** breakout bar volume materially above its 20-bar average.
- **Delta alignment:** positive bar delta on upside breaks, negative on downside; no opposing divergence.
- **Absorption:** large resting orders getting hit without price rejecting (footprint).
- **Big Trades:** institutional-size prints in the breakout direction.

## Footprint & Delta Reading

- **Delta divergence** (price new extreme, delta not) = warning, not entry — expect absorption or reversal.
- **Unfinished auction** at session highs/lows often gets revisited; finished auctions hold better.
- **CVD** must trend with the trade direction; flat/opposing CVD downgrades the signal.

## Volume Profile & VWAP

- **HVN** = acceptance (expect rotation through), **LVN** = rejection (expect fast travel).
- Prior-day value area: open inside value → favor mean reversion to VAH/VAL; open outside → favor acceptance/breakout scenarios.
- VWAP is confluence, not a standalone signal: longs above, shorts below, and note band extensions.

## Rules (STRICT)

- NEVER issue a signal without citing its orderflow evidence.
- If live data (footprint, delta, T&S) is unavailable in-session, state exactly which data is needed instead of improvising.
- Educational framing only — present scenarios and rules, never guarantees of outcome.
- All sizing for signals routes through the position-sizing-risk-math skill.
