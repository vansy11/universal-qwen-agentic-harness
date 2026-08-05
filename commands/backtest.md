---
description: "Run backtest suite for a trading strategy with walk-forward validation"
---
Delegate this task to the quant-strategist agent. Execute the following workflow:

1. Load strategy parameters from config
2. Fetch historical market data via market-data-engineer agent
3. Execute backtest with walk-forward validation
4. Generate performance report (Sharpe, max drawdown, win rate, profit factor)
5. Validate results against risk-manager thresholds
6. Output results with overfitting warnings

Agent chain: quant-strategist -> market-data-engineer -> risk-manager