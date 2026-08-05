---
description: "Design and implement quantitative trading algorithm"
---
Delegate this task to the quant-strategist agent. Execute the following workflow:

1. Define alpha hypothesis with mathematical formulation
2. Implement signal generation with look-ahead bias prevention
3. Build backtest harness with realistic slippage, fees, and latency
4. Run walk-forward validation across multiple market regimes
5. Analyze performance metrics (Sharpe, Sortino, max drawdown, win rate)
6. Paper trade minimum 30 days before live consideration

NEVER deploy live without paper trading validation. Check trading-risk-tolerance.md.
Agent chain: quant-strategist -> quant-algo-engineer -> risk-manager