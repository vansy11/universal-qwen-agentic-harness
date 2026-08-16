---
name: ivb-definition-correction
description: IVB stands for Initial Balance Breakout (NOT Initial Volume Breakout or Indicator Value Block). It is a 30-minute Opening Range Breakout strategy with orderflow confirmation.
type: feedback
---

**Rule:** IVB = **Initial Balance Breakout**, a 30-minute ORB strategy using orderflow confirmation (volume, delta, footprint). NOT "Initial Volume Breakout" or "Indicator Value Block".

**Why:** User corrected a hallucination where IVB was incorrectly expanded. The correct term comes from auction market theory — "Initial Balance" is the first 30-min range, and "Breakout" is the trade trigger.

**How to apply:** When user mentions IVB, always use "Initial Balance Breakout". Reference the `ivb-strategy` skill for full details.
