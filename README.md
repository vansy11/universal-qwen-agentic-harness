# Universal Qwen Agentic Harness

<p align="center">
  <strong>The Enterprise Agent Performance & Orchestration Harness for Qwen Code CLI</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/-Qwen%20Code-4A5EFF?logo=alibabacloud&logoColor=white" alt="Qwen Code" />
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license" />
  <img src="https://img.shields.io/badge/maintainer-Vansy-orange" alt="Vansy" />
  <img src="https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white" alt="Python" />
</p>

---

## Executive Summary

The **Universal Qwen Agentic Harness** transforms the Qwen Code CLI into an autonomous, enterprise-grade software engineering system. Instead of relying on a single context window to write, test, and review its own code, this harness provides an **Orchestrator-Worker** architecture powered by 17 native lifecycle hooks, 30 specialist agents, 42 technical skills, 15 slash commands, 13 enforced rule sets, and 15 Model Context Protocol (MCP) integrations.

```
User Prompt ──► Prompt Router ──► Orchestration ──► Specialist Agents ──► Security Check ──► Quality Gate ──► Humanized Output
```

---

## Harness Metrics At A Glance

| Component             | Count  | Functionality                                                                                                   |
| :-------------------- | :----: | :-------------------------------------------------------------------------------------------------------------- |
| **Specialist Agents** | **30** | Domain experts across Management, Frontend, Backend, Database, Cloud, Security, Data, and Quantitative Finance  |
| **Technical Skills**  | **42** | Production guidelines and workflows for full-stack, security, DevOps, data pipelines, and quantitative trading  |
| **Slash Commands**    | **15** | Direct triggers for instant agent delegation (`/fullstack`, `/review`, `/research`, `/quant`, `/pentest`, etc.) |
| **Lifecycle Hooks**   | **17** | Cross-platform Node.js & Python scripts enforcing security, token efficiency, quality gates, and auto-memory    |
| **Enforced Rules**    | **13** | Strict coding, security baseline, output formatting, and verification protocols                                 |
| **MCP Integrations**  | **15** | Integrations for real-time web search, GitHub, filesystem, browser testing, live library docs, and memory       |

---

## Core System Features

### 1. Orchestrator-Worker Architecture

Automatically evaluates task complexity. Simple queries are answered directly to preserve tokens, while complex prompts trigger the `fullstack-orchestrator` to spawn specialized sub-agents working in parallel or sequence.

### 2. Auto Prompting & Context Handoff

Uses the `context-builder` agent and `prompt-optimizer.js` to extract codebase context, remove prompt fluff, enforce token budgets, and format structured JSON handoffs (`handoff-schema.json`) for seamless sub-agent execution.

### 3. Auto Evaluation & Quality Control

Integrates multi-layered verification:

- **System Evaluator (`core/eval-runner.js` / `/eval`)**: Tests routing precision against prompt benchmarks.
- **Self-Evaluator Agent (`agents/self-evaluator.md`)**: Assesses completion criteria before delivery.
- **Playwright Runtime Evaluation**: Automatically runs headless browser checks to verify 3D canvas rendering, DOM updates, and scroll animations on generated frontend apps.
- **Quality Gate (`hooks/quality-gate.js`)**: Detects robotic "AI Slop" phrasing and triggers the `humanizer` agent for natural human-like rewrites.

### 4. Auto Loop & Resiliency Engine

- **Scheduled Loops (`/loop` & `loop_wakeup`)**: Runs tasks on fixed schedules or background wakeups up to 24 hours.
- **Auto-Resume Watcher (`core/auto-resume-watcher.js`)**: Monitors background task stalls and API rate limits. Automatically waits out cooldown periods and injects recovery prompts (`[SYSTEM AUTO-RESUME]`) until quality gates pass.

### 5. Security & Risk Firewall

- **Command Security (`security-check.js`)**: Blocks dangerous terminal execution (`rm -rf /`, `git push --force`, `curl | sh`).
- **Trading Risk Guard (`trading-risk-guard.js`)**: Validates financial algorithm parameters, enforcing position sizing limits and circuit breakers.

### 6. Persistent Long-Term Memory

Stores learnings across sessions in `.qwen/memories/` (user-level) and `.qwen/projects/` (project-level), utilizing the `memory` MCP knowledge graph server and `memory-distiller.py` context compaction.

---

## Quickstart Guide

Get up and running in under 2 minutes.

### 1. Clone the Repository

```bash
git clone https://github.com/vansy11/universal-qwen-agentic-harness.git
cd universal-qwen-agentic-harness
```

### 2. Install MCP Server Dependencies

```bash
npm install -g @modelcontextprotocol/server-github @modelcontextprotocol/server-filesystem @modelcontextprotocol/server-memory @modelcontextprotocol/server-sequential-thinking @kazuph/mcp-fetch tavily-mcp exa-mcp-server
```

### 3. Configure API Keys

Copy `settings.example.json` to `.qwen/settings.json` and configure your API keys:

```json
{
  "env": {
    "DASHSCOPE_API_KEY": "your-dashscope-key",
    "TAVILY_API_KEY": "your-tavily-key",
    "GITHUB_TOKEN": "your-github-token",
    "EXA_API_KEY": "your-exa-key",
    "GEMINI_API_KEY": "your-gemini-key"
  }
}
```

### 4. Launch Qwen Code CLI

```bash
qwen
```

---

## Slash Commands Reference

Force specific agent delegation or execute system workflows instantly:

| Command       | Action / Description                                                    |
| :------------ | :---------------------------------------------------------------------- |
| `/audit`      | Audit usage across agents, models, MCP servers, and skills              |
| `/backtest`   | Run strategy backtest suite with walk-forward validation                |
| `/deploy`     | Generate Docker containerization and deployment scripts                 |
| `/erd`        | Generate Entity-Relationship Diagrams from database schemas             |
| `/eval`       | Execute routing precision regression evaluation (`core/eval-runner.js`) |
| `/fullstack`  | Trigger full-stack development (Database → Backend → Frontend → Mobile) |
| `/git-push`   | Stage, commit with conventional message, and push changes               |
| `/humanize`   | Rewrite last AI response into natural human prose                       |
| `/pentest`    | Conduct security penetration test and vulnerability scan                |
| `/quant`      | Design and backtest quantitative trading algorithms                     |
| `/research`   | Execute multi-source deep web research with fact-verification           |
| `/review`     | Perform code quality, security, and performance review                  |
| `/risk-check` | Validate active trading positions against risk rules                    |
| `/route`      | Analyze prompt intent and display routing recommendations               |
| `/trend`      | Aggregate real-time news trends and market sentiment                    |

---

## Multi-Provider Model Configuration

The harness natively supports switching between DashScope (Alibaba), OpenAI, Google Gemini, Moonshot (Kimi), GLM, DeepSeek, and Alibaba Token Plan directly inside `.qwen/settings.json`:

```json
{
  "model": {
    "name": "gemini-3.6-flash",
    "baseUrl": "https://generativelanguage.googleapis.com"
  },
  "modelProviders": {
    "openai": [
      {
        "id": "qwen3.7-plus",
        "name": "[ModelStudio Token Plan] qwen3.7-plus",
        "baseUrl": "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
        "envKey": "BAILIAN_TOKEN_PLAN_API_KEY"
      }
    ]
  }
}
```

---

## Architecture & Data Flow

For in-depth architectural breakdown and complete sequence flows, refer to:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: System design, subsystem overview, and complete component inventory.
- **[FLOW.md](./FLOW.md)**: Sequence diagrams, hook execution matrix, and delegation routing tables.

---

## License & Support

Distributed under the **MIT License**. Maintained by **Vansy**.
