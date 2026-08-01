Universal Qwen Agentic Harness
The Agent Harness Performance Optimization System for Qwen Code

Node.jsQwen CodeMIT licenseVansy

ShellTypeScriptPythonMarkdown

[!WARNING]Configure API Keys Securely. This harness integrates with external APIs (DashScope, Tavily, GitHub, etc.). Never hardcode API keys in your repository. Always use the .qwen/settings.json environment block or system environment variables.

Quickstart
Get up and running in 2 minutes	Architecture
How the Orchestrator-Worker system functions	Components
18 Agents, 24 Skills, 3 Hooks, 7 MCPs
Universal Qwen Agentic Harness
Your agent can write code, but this harness gives it a coordinated engineering system and toolbox: it plans before it builds, delegates tasks to specialized sub-agents, reviews its own work from a fresh context, and enforces quality gates.

prompt -> route -> orchestrate -> delegate -> verify -> humanize -> output
Instead of rebuilding this process in every prompt, you install it once and make it part of how your agent works.

Optimize the context window. Persist everything else.

This harness is MIT-licensed open source. It works natively with Qwen Code CLI, using an Orchestrator-Worker architecture driven by Universal Node.js Hooks.

Quickstart
Get up and running in less than 2 minutes.

bash

# 1. Clone the repository
git clone https://github.com/vansy11/universal-qwen-agentic-harness.git
cd universal-qwen-agentic-harness

# 2. Install MCP Server dependencies globally
npm install -g @modelcontextprotocol/server-github @modelcontextprotocol/server-filesystem @modelcontextprotocol/server-memory @modelcontextprotocol/server-sequential-thinking @kazuph/mcp-fetch tavily-mcp exa-mcp-server

# 3. Configure your API Keys
# Rename settings.example.json to .qwen/settings.json
# Open it and replace the placeholder values in the "env" block with your actual keys

# 4. Run Qwen Code
qwen
Advanced Configuration
Multi-Provider Support
You can easily switch between DashScope (Alibaba), OpenAI, Moonshot, and OpenRouter within the settings.json configuration.

json

{
  "modelProviders": {
    "bailian": {
      "type": "openai",
      "baseURL": "https://dashscope.aliyuncs.com/compatible-mode/v1",
      "apiKeyEnv": "DASHSCOPE_API_KEY",
      "models": {
        "deepseek-v3.2": { "contextWindow": 128000, "maxTokens": 8192 }
      }
    }
  }
}
Universal Node.js Hooks
The hooks are written in pure Node.js (.js) rather than PowerShell (.ps1) to ensure 100% cross-platform compatibility (Windows, macOS, Linux) without execution policy issues.

Architecture Flow
This system uses an Orchestrator-Worker architecture. Below is the visual flow of how a prompt is processed automatically by the hooks and agents.

graph TD
    A[User Prompt] --> B{prompt-router.js Hook}
    B -->|Light Prompt| C[Direct AI Response]
    B -->|Heavy Prompt| D[fullstack-orchestrator]
    D --> E[context-builder]
    E --> F[database-architect]
    E --> G[backend-engineer]
    E --> H[frontend-engineer]
    E --> I[animation-engineer]
    F & G & H & I --> J{quality-gate.js Hook}
    J -->|AI Slop Detected| K[humanizer-agent]
    K --> J
    J -->|Clean Output| L[✅ Final Output to User]
Core Components
18 Specialized Agents
<br>

Management: context-builder, fullstack-orchestrator, memory-curator, humanizer
Programming: database-architect, backend-engineer, frontend-engineer, ui-ux-designer, animation-engineer, code-reviewer
Infrastructure: cybersecurity-analyst, network-engineer, devops-engineer
Research: web-researcher, news-trending-scout, social-media-analyst
Finance: finance-analyst, quant-algo-engineer

24 Technical Skills
<br>

AI Core: ai-humanizer-anti-slop, ai-memory-curator, prompt-router
Programming: backend-api-design, database-ssd-design, frontend-react-tailwind, ui-animation-gsap-framer, api-doc-generator
Security: cybersecurity-pentest, cybersecurity-vuln-scan, code-review-security
DevOps: docker-deployment, github-workflow, network-diagnostics
Research: web-research-deep, news-trending-aggregator, api-integration-exa-tavily, social-media-monitor
Finance: finance-analysis, quant-algo-trading
System: fullstack-orchestration, workflow-automation

3 Universal Node.js Hooks
<br>

prompt-router.js: Analyzes prompt complexity and maps tasks to target agents.
security-check.js: PreToolUse hook to block dangerous shell commands (e.g., rm -rf).
quality-gate.js: Stop hook that acts as an Anti-AI-Slop enforcer, rejecting robotic phrasing and forcing human-like rewrites.

7 MCP Server Integrations
<br>

tavily: Real-time web search and news.
exa: Semantic search for code and academic research.
github: Repository management, PRs, and issues.
filesystem: Secure local file read/write access.
fetch: Raw URL content retrieval (web scraping).
memory: Knowledge graph for long-term AI memory.
sequential-thinking: Complex problem decomposition tool.

Slash Commands
Force specific agent delegation instantly using built-in commands:

Command
Description
/fullstack	Run the full-stack chain (DB ➔ Backend ➔ Frontend ➔ Animation).
/research	Force the web-researcher agent to search the internet.
/pentest	Run a security scan on the current codebase.
/git-push	Safely commit and push the project to a new GitHub repo.
/humanize	Clean up the AI's last response to sound more human.
/quant	Build and backtest a trading strategy.

Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to add new agents, skills, or MCP integrations.

License
This project is licensed under the MIT License - see the LICENSE file for details.

<div align="center">
Built by <strong>Vansy</strong> using Qwen Code
</div>