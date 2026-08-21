import json
import sys
import math

# --- Statistical & Risk Functions ---
def calculate_sharpe_ratio(returns, risk_free_rate=0.02):
    if len(returns) < 2: return 0.0
    excess_returns = [r - risk_free_rate/252 for r in returns]
    mean_excess = sum(excess_returns) / len(excess_returns)
    std_dev = math.sqrt(sum((r - mean_excess)**2 for r in excess_returns) / (len(excess_returns) - 1))
    if std_dev == 0: return 0.0
    return (mean_excess / std_dev) * math.sqrt(252)

def calculate_sortino_ratio(returns, risk_free_rate=0.02):
    if len(returns) < 2: return 0.0
    excess_returns = [r - risk_free_rate/252 for r in returns]
    mean_excess = sum(excess_returns) / len(excess_returns)
    downside_returns = [r for r in excess_returns if r < 0]
    if not downside_returns: return float("inf")
    downside_std = math.sqrt(sum(r**2 for r in downside_returns) / len(downside_returns))
    if downside_std == 0: return float("inf")
    return (mean_excess / downside_std) * math.sqrt(252)

def calculate_max_drawdown(prices):
    peak = prices[0]
    max_dd = 0.0
    for price in prices:
        if price > peak: peak = price
        dd = (peak - price) / peak
        if dd > max_dd: max_dd = dd
    return max_dd

def calculate_var(returns, confidence=0.95):
    sorted_returns = sorted(returns)
    index = int((1 - confidence) * len(sorted_returns))
    return abs(sorted_returns[index])

def calculate_cvar(returns, confidence=0.95):
    sorted_returns = sorted(returns)
    index = int((1 - confidence) * len(sorted_returns))
    tail = sorted_returns[:index]
    return abs(sum(tail) / len(tail)) if tail else 0.0

# --- Black-Scholes Options Pricing (European) ---
def norm_cdf(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))

def black_scholes(S, K, T, r, sigma, option_type="call"):
    d1 = (math.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    if option_type == "call":
        price = S * norm_cdf(d1) - K * math.exp(-r * T) * norm_cdf(d2)
    else:
        price = K * math.exp(-r * T) * norm_cdf(-d2) - S * norm_cdf(-d1)
    
    # Greeks
    delta = norm_cdf(d1) if option_type == "call" else -norm_cdf(-d1)
    gamma = norm_cdf(d1) / (S * sigma * math.sqrt(T))
    vega = S * norm_cdf(d1) * math.sqrt(T) / 100  # Per 1% change in vol
    return {"price": price, "delta": delta, "gamma": gamma, "vega": vega}

# --- CLI Interface ---
if __name__ == "__main__":
    input_data = json.loads(sys.stdin.read())
    func = input_data.get("function")
    data = input_data.get("data", {})
    
    result = {}
    try:
        if func == "sharpe":
            result = {"sharpe_ratio": calculate_sharpe_ratio(data.get("returns", []), data.get("risk_free", 0.02))}
        elif func == "sortino":
            result = {"sortino_ratio": calculate_sortino_ratio(data.get("returns", []), data.get("risk_free", 0.02))}
        elif func == "drawdown":
            result = {"max_drawdown": calculate_max_drawdown(data.get("prices", []))}
        elif func == "var":
            result = {"var_95": calculate_var(data.get("returns", []), 0.95)}
        elif func == "cvar":
            result = {"cvar_95": calculate_cvar(data.get("returns", []), 0.95)}
        elif func == "black_scholes":
            result = black_scholes(data.get("S"), data.get("K"), data.get("T"), data.get("r"), data.get("sigma"), data.get("type", "call"))
        else:
            result = {"error": "Function not supported"}
    except Exception as e:
        result = {"error": str(e)}
        
    print(json.dumps(result))

# --- MONTE CARLO SIMULATION (Requires NumPy) ---
import numpy as np

def monte_carlo_option_price(S, K, T, r, sigma, simulations=10000, option_type="call"):
    """Prices a European option using Monte Carlo Simulation."""
    # Generate random standard normal variables (Z)
    Z = np.random.standard_normal(simulations)
    # Calculate end stock prices using Geometric Brownian Motion (GBM)
    ST = S * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)
    
    # Calculate payoffs
    if option_type == "call":
        payoffs = np.maximum(ST - K, 0)
    else:
        payoffs = np.maximum(K - ST, 0)
    
    # Discount average payoff back to present value
    option_price = np.exp(-r * T) * np.mean(payoffs)
    
    # Calculate Standard Error (for confidence intervals)
    std_error = np.std(payoffs) / np.sqrt(simulations)
    
    return {
        "price": option_price,
        "standard_error": std_error,
        "simulations_run": simulations
    }

def monte_carlo_portfolio_var(returns, simulations=10000, confidence=0.95):
    """Calculates Portfolio VaR using Historical Simulation Monte Carlo."""
    # Randomly sample from historical returns with replacement
    simulated_returns = np.random.choice(returns, size=simulations, replace=True)
    # Calculate portfolio value changes (assuming initial portfolio value = 1)
    portfolio_values = 1 + simulated_returns
    # Sort to find the percentile
    sorted_values = np.sort(portfolio_values)
    index = int((1 - confidence) * simulations)
    var = abs(sorted_values[index] - 1)
    return {"var_monte_carlo": var, "simulations_run": simulations}
