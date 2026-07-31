# 🏗️ Architecture Overview

This system utilizes an **Orchestrator-Worker** architecture driven entirely by native Qwen Code **Hooks**.

## 🔄 Workflow
1. **Input**: User types a prompt in the terminal.
2. **Routing (prompt-router.js)**: The UserPromptSubmit hook scans the text. If light, the AI answers directly. If heavy, it injects routing instructions.
3. **Delegation**: The ullstack-orchestrator delegates tasks to specialists.
4. **Execution**: Agents work in parallel/sequence. They call MCPs for external data and read Skills for technical guidelines.
5. **Quality Gate (quality-gate.js)**: The Stop hook checks the output. If "AI Slop" is detected, it blocks the output and invokes the humanizer agent.

## 🤖 Component Inventory
- **18 Agents**: Context Builder, Fullstack Orchestrator, Backend, Frontend, Database, UI/UX, Animation, Cybersecurity, Network, DevOps, Web Researcher, News Scout, Social Media, Finance, Quant, Code Reviewer, Humanizer, Memory Curator.
- **3 Hooks**: Router, Security Check, Quality Gate.
- **7 MCP Servers**: Tavily, Exa, GitHub, Filesystem, Memory, Fetch, Sequential-Thinking.
- **24 Skills**: Technical guidelines loaded via progressive disclosure.
