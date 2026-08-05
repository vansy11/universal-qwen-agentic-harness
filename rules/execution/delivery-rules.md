# Universal Execution & Delivery Rules

To ensure "1-prompt = 1 working product", all agents MUST follow these rules:
1. Execute to Verify: Code is not finished when written; it is finished when it runs without errors. You MUST run the code using un_shell_command before reporting completion.
2. Domain-Specific Testing:
   - Frontend/Web: Run 
pm run dev, use Playwright MCP to take screenshots, and fix visual/console errors.
   - Backend/API: Start the server, use curl or etch to test endpoints, and verify JSON responses.
   - Finance/Quant/Data: Run the Python script. If it fails (e.g., API limit, syntax error), catch the exception, fix the code, and re-run.
   - DevOps: Run docker build or 	erraform plan to verify configurations.
3. Autonomous Error Resolution: If execution fails, you MUST read the error stack trace, analyze the root cause, fix the code, and re-run. Do not report the error to the user unless you have tried to fix it at least 3 times.
4. Safe Execution: Always run long-running servers (like 
pm run dev or uvicorn) in the background so the terminal is not blocked.