# Universal Agentic AI Harness (Qwen Code Native)

An interactive CLI-based AI agent system inspired by ECC, OpenClaw, and Qwen Code. 
This system uses a lightweight model to route tasks to specialized flagship models based on prompt complexity.

## Setup (Windows)
1. Run setup-harness.ps1 to generate this project.
2. Install Qwen Code CLI.
3. Install Node.js dependencies for MCP servers: 
   
pm install -g @modelcontextprotocol/server-github @modelcontextprotocol/server-filesystem @modelcontextprotocol/server-fetch @modelcontextprotocol/server-memory @modelcontextprotocol/server-sequential-thinking @modelcontextprotocol/server-sqlite @modelcontextprotocol/server-brave-search tavily-mcp exa-mcp-server
4. Copy .env.example to .qwen/settings.local.json or set environment variables.
5. Run qwen inside this project folder.
