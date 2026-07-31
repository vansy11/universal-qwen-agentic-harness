Universal Qwen Agentic Harness
An interactive CLI-based AI agent system inspired by ECC (Everything Claude Code), OpenClaw, and Hermes. This project transforms standard Qwen Code into a Virtual Tech Company inside your terminal, using an Orchestrator-Worker architecture driven by native hooks to delegate tasks to specialized AI agents.

Key Features
Intelligent Prompt Routing: A lightweight hook automatically scans prompt complexity. Light prompts are answered directly; heavy prompts are decomposed and delegated to specialized sub-agents.
18 Specialized Agents: Pre-configured agents for Backend, Frontend, Database, UI/UX, Animation, Cybersecurity, DevOps, Finance, Quant Trading, and more.
24 Technical Skills: Progressive disclosure guidelines that provide agents with specific architectural patterns (e.g., ERD Generation, React/Tailwind standards, OWASP Pentest).
3 Universal Node.js Hooks:
prompt-router.js: Analyzes prompts and maps them to target agents.
security-check.js: Blocks dangerous shell commands (e.g., rm -rf).
quality-gate.js: Anti-AI-Slop enforcer that rejects robotic phrasing and forces human-like rewrites.
7 MCP Server Integrations: Connects AI to Tavily, Exa, GitHub, Filesystem, Memory, Fetch, and Sequential-Thinking.
Multi-Provider Support: Easily switch between DashScope (Alibaba), OpenAI, Moonshot, and OpenRouter within the configuration.

System Prerequisites
Before installing this harness, ensure your system has the following installed:

Node.js (Required for MCP servers and Universal Hooks)
Qwen Code CLI
Git (for version control and GitHub integration)

Installation & Setup (Windows / Universal)
Clone the Repository
git clone https://github.com/YOUR_USERNAME/universal-qwen-agentic-harness.gitcd universal-qwen-agentic-harness
Install MCP Server Dependencies
Install the required global Node packages for the AI's external tools:

npm install -g @modelcontextprotocol/server-github @modelcontextprotocol/server-filesystem @modelcontextprotocol/server-memory @modelcontextprotocol/server-sequential-thinking @kazuph/mcp-fetch tavily-mcp exa-mcp-server

Configure API Keys
Rename settings.example.json to .qwen/settings.json.
Open .qwen/settings.json and replace the placeholder values in the "env" block with your actual API keys (DashScope, Tavily, GitHub, etc.).
Run Qwen Code
Launch the interactive terminal from the root of this project:
qwen

Usage Examples
Once the system is running, you can interact with it naturally. The hooks will automatically route your requests.

Example 1: Heavy Full-Stack Task

"Build a modern bio-data website with loading animations, create an SQL database to store the data, and design the backend API for it."

System Behavior: The router detects a heavy task -> Invokes fullstack-orchestrator -> Delegates to database-architect, backend-engineer, frontend-engineer, and animation-engineer -> Runs quality-gate before final output.

Example 2: Using Slash Commands
Force specific agent delegation instantly using built-in commands:

/fullstack : Run the full-stack chain (DB -> Backend -> Frontend).
/research : Force the web-researcher agent to search the internet.
/pentest : Run a security scan on the current codebase.
/git-push : Safely commit and push the project to a new GitHub repo.

Project Structure
.qwen/
├── agents/          # 18 AI specialist agents (YAML frontmatter + system prompts)
├── commands/        # 12 Slash command shortcuts
├── hooks/           # 3 Universal Node.js hooks (Router, Security, Quality Gate)
├── skills/          # 24 Technical skill guidelines (Progressive disclosure)
└── settings.json    # Core configuration (Models, MCP servers, Hooks, API Keys)

Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to add new agents, skills, or MCP integrations.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Built with ❤️ using Qwen Code