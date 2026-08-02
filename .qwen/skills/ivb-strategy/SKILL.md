---
name: ivb-strategy
description: Initial Balance Breakout (IVB) strategy — 30-minute Opening Range Breakout (ORB) with orderflow confirmation. Use when user asks about IVB, initial balance, opening range, volume breakout, or ORB strategies.
type: reference
---

# IVB Strategy (Initial Balance Breakout)

## Definition

**IVB (Initial Balance Breakout)** is a trading strategy based on the **30-minute Opening Range Breakout (ORB)** concept combined with **orderflow confirmation**. It identifies the high-low range established during the first 30 minutes of market open (the "Initial Balance"), then trades the breakout from that range using orderflow analysis (volume, delta, footprint imbalances) to filter false breakouts.

> **Note:** IVB stands for **Initial Balance Breakout**, NOT "Initial Volume Breakout" or "Indicator Value Block".

## Core Components

1. **Initial Balance (IB)** — The high-low price range formed in the first 30 minutes after market open. Represents the initial "price agreement" between buyers and sellers before a directional move.
2. **Breakout (B)** — Price closing above the IB high (bullish) or below the IB low (bearish) after the 30-minute period ends.
3. **Orderflow Confirmation** — Volume spike, delta imbalance, and footprint chart analysis to confirm genuine aggressive participation (not just noise).

## Strategy Rules

### Step 1: Mark the Initial Balance
- At market open (e.g., 09:30 EST for US equities), mark the **High** and **Low** formed during the first 30 minutes (09:30–10:00)
- This range = your Initial Balance (IB)

### Step 2: Wait for Breakout After 30 Minutes
- **Long setup:** Price closes above IB High after 10:00
- **Short setup:** Price closes below IB Low after 10:00
- Do NOT enter during the first 30 minutes

### Step 3: Confirm with Orderflow
Valid breakout requires ALL of:
- **Volume:** Breakout candle volume > 1.5x the average volume of IB candles
- **Delta/Imbalance:** Aggressive buyer dominance (for longs) or seller dominance (for shorts) visible on footprint chart
- **No absorption:** No signs of the opposing side absorbing the breakout pressure at the IB boundary

### Entry Models

**Model 1 — Direct Breakout:**
- Price breaks IB High/Low directly after the 30-min period
- Enter on breakout candle close with orderflow confirmation
- Stop loss: below IB midpoint (longs) or above IB midpoint (shorts)

**Model 2 — Breakout + Retest:**
- Price breaks out, then pulls back to retest the IB level
- Enter on successful retest (IB resistance becomes support, or vice versa)
- Confirm orderflow rejection of opposing side during retest
- Stop loss: below/above the IB level

### Stop Loss
- **Conservative:** Opposite side of the IB range
- **Moderate:** IB midpoint
- **Invalidation:** Price closes back inside IB after breakout = cancel trade

### Targets
- **Minimum:** 1x IB range width (measured move from breakout point)
- **Extended:** 2:1 Risk-Reward ratio
- **Trailing:** After 1R achieved, trail stop behind swing candles
- Exit when post-breakout volume drops below 75% of breakout candle volume

## Context & Confluence

IVB works best when combined with higher-timeframe context:
- Daily/hourly support-resistance levels
- VWAP (Volume Weighted Average Price)
- Value Area High/Low from previous session
- Key moving averages

## Best Practices

- Most effective on liquid instruments (indices like ES/NQ, major forex pairs, high-volume stocks)
- Best during major session opens (New York, London)
- Avoid during low-volume periods or immediately before major news events
- 30-minute IB is the sweet spot: 5-15 min = too noisy, 60 min = too late
- Always wait for candle close — never enter on wicks poking the IB boundary

## References

- Strategy explanation: https://youtu.be/cUTsoU-15Tc?si=X5G0A3Rzz2Zk1ddq
- Advanced concepts: https://youtu.be/wm6XQFw1GHI?si=bpieExq_u7T__PbL
