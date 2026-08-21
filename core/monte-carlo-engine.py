import json
import sys
import numpy as np

def monte_carlo_option_price(S, K, T, r, sigma, simulations=10000, option_type="call"):
    Z = np.random.standard_normal(simulations)
    ST = S * np.exp((r - 0.5 * sigma**2) * T + sigma * np.sqrt(T) * Z)
    if option_type == "call":
        payoffs = np.maximum(ST - K, 0)
    else:
        payoffs = np.maximum(K - ST, 0)
    option_price = np.exp(-r * T) * np.mean(payoffs)
    std_error = np.std(payoffs) / np.sqrt(simulations)
    return {"price": option_price, "standard_error": std_error, "simulations_run": simulations}

def monte_carlo_portfolio_var(returns, simulations=10000, confidence=0.95):
    simulated_returns = np.random.choice(returns, size=simulations, replace=True)
    portfolio_values = 1 + simulated_returns
    sorted_values = np.sort(portfolio_values)
    index = int((1 - confidence) * simulations)
    var = abs(sorted_values[index] - 1)
    return {"var_monte_carlo": var, "simulations_run": simulations}

if __name__ == "__main__":
    input_data = json.loads(sys.stdin.read())
    func = input_data.get("function")
    data = input_data.get("data", {})
    result = {}
    try:
        if func == "mc_option_price":
            result = monte_carlo_option_price(data.get("S"), data.get("K"), data.get("T"), data.get("r"), data.get("sigma"), data.get("simulations", 10000), data.get("type", "call"))
        elif func == "mc_var":
            result = monte_carlo_portfolio_var(data.get("returns", []), data.get("simulations", 10000), 0.95)
        else:
            result = {"error": "Monte Carlo function not supported"}
    except Exception as e:
        result = {"error": str(e)}
    print(json.dumps(result))
