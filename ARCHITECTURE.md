# System Architecture

The **Universal Qwen Agentic Harness** is an enterprise-grade, event-driven **Orchestrator-Worker** performance system built specifically for the Qwen Code CLI. It turns a standard LLM coding assistant into a coordinated autonomous engineering suite that plans, delegates, executes, self-evaluates, and persists learnings automatically.

---

## Architecture Overview

```
                          ┌────────────────────────┐
                          │       User Prompt      │
                          └───────────┬────────────┘
                                      │
                         ┌────────────▼───────────┐
                         │   Session Bootstrap    │
                         │ (session-bootstrap.js) │
                         └────────────┬───────────┘
                                      │
                         ┌────────────▼───────────┐
                         │  UserPromptSubmit Hook │
                         │ (context-pruner.js +   │
                         │    prompt-router.js)   │
                         └────────────┬───────────┘
                                      │
                   ┌──────────────────┴──────────────────┐
                   │                                     │
         ┌─────────▼──────────┐                ┌─────────▼──────────┐
         │ Light Query / Task │                │ Heavy / Complex    │
         │ Direct AI Response │                │ Orchestrated Flow  │
         └────────────────────┘                └─────────┬──────────┘
                                                         │
                                               ┌─────────▼──────────┐
                                               │ Context Builder    │
                                               │ (context-builder)  │
                                               └─────────┬──────────┘
                                                         │
                                               ┌─────────▼──────────┐
                                               │ Fullstack          │
                                               │ Orchestrator       │
                                               └─────────┬──────────┘
                                                         │
                                               ┌─────────▼──────────┐
                                               │ Specialist Agents  │
                                               │ (Sub-Agent Pool)   │
                                               └─────────┬──────────┘
                                                         │
                                               ┌─────────▼──────────┐
                                               │ Tool Execution     │
                                               │ (Skills & MCPs)    │
                                               └─────────┬──────────┘
                                                         │
                                               ┌─────────▼──────────┐
                                               │ Pre/Post Tool Hooks│
                                               │ (Security, Risk,   │
                                               │  Lint & Format)    │
                                               └─────────┬──────────┘
                                                         │
                                               ┌─────────▼──────────┐
                                               │ Stop Lifecycle     │
                                               │ (Quality Gate,     │
                                               │  Memory, Reflection)│
                                               └─────────┬──────────┘
                                                         │
                                               ┌─────────▼──────────┐
                                               │   Final Delivery   │
                                               └────────────────────┘
```

---

## Core System Subsystems

### 1. Orchestrator-Worker Framework

- **Fullstack Orchestrator (`agents/fullstack-orchestrator.md`)**: Acts as the chief project coordinator, decomposing complex software requirements into independent subtasks for domain specialists.
- **Team Commander (`agents/team-commander.md`)**: Coordinates multi-agent team communications, manages priorities, and resolves task conflicts.
- **Specialist Sub-Agent Pool (30 Agents)**: Highly focused domain experts across software development, system architecture, cloud deployment, data engineering, cybersecurity, research, and quantitative finance.

### 2. Auto Prompting & Context Engineering

- **Context Builder (`agents/context-builder.md`)**: Automatically gathers codebase state, extracts structural decisions, formats concise handoff JSON packages (`handoff-schema.json`), and feeds structured context to sub-agents.
- **Prompt Optimizer (`core/prompt-optimizer.js`)**: Minifies whitespace, eliminates redundant politeness phrases, injects active rules and relevant long-term memories, and calculates token budgets prior to API dispatch.
- **Prompt Router (`hooks/prompt-router.js`)**: Matches incoming prompts against keyword routing rules, classifying prompts into light (direct) or heavy (orchestrated) execution paths.

### 3. Lifecycle Hooks Engine (17 Hooks)

Cross-platform Node.js scripts executed automatically by Qwen Code at specific turn boundaries:

- **Session Start**: Environment preparation and session state initialization (`session-bootstrap.js`, `auto-resume-watcher.js`).
- **Prompt Interception**: Context pruning and complexity routing (`context-pruner.js`, `prompt-router.js`).
- **Tool Guarding**: Command security checking and financial risk boundaries (`security-check.js`, `trading-risk-guard.js`).
- **Post-Tool Processing**: Real-time token monitoring, automatic code linting, and standard formatting (`token-monitor.js`, `lint-check.js`, `auto-format.js`).
- **Display Filtering**: Parent noise suppression and raw tool output sanitization (`parent-silencer.js`, `output-sanitizer.js`, `subagent-presenter.js`).
- **Stop Validation & Reflection**: Quality gating, anti-slop verification, hallucination guards, auto-memory persistence, improvement tracking, protocol synchronization, and session reflection (`quality-gate.js`, `hallucination-guard.js`, `auto-memory.js`, `reflection.js`, `improvement-tracker.js`, `protocol-updater.js`).
- **Pre-Compact Distillation**: Context distillation prior to token compaction (`memory-distiller.py`).

### 4. Auto Evaluation & Quality Control

- **System Routing Evaluator (`core/eval-runner.js` / `/eval`)**: Measures prompt routing precision against test datasets (`evals/cases.json`).
- **Self-Evaluator Agent (`agents/self-evaluator.md`)**: Assesses completion criteria, formatting, and verifies that no unresolved placeholders exist before delivering work.
- **Runtime Application Evaluator (`autoEvaluate` Playwright Integration)**: Runs headless browser automation to test generated frontend applications for runtime errors, missing 3D canvases, or broken animations.
- **Quality Gatekeeper (`hooks/quality-gate.js` & `agents/humanizer.md`)**: Automatically rejects generic AI response patterns ("AI Slop") and triggers humanized rewrites.

### 5. Auto Loop & Resiliency Engine

- **Self-Paced Loop Scheduler (`/loop` command & `loop_wakeup` tool)**: Enables scheduled and background recurring tasks up to 24 hours.
- **Auto-Resume Watcher (`core/auto-resume-watcher.js`)**: Monitors background execution state (`blackboard.json`). When execution stalls or hits API rate limits, it waits out cooldown periods and injects `[SYSTEM AUTO-RESUME]` recovery prompts to resume execution autonomously.

### 6. Long-Term Memory & Knowledge Graph

- **Dual Memory Architecture**:
  - **Global User Memory (`~/.qwen/memories/`)**: Stores cross-project developer profiles, coding preferences, and style guidelines.
  - **Project Local Memory (`.qwen/projects/<hash>/memory/`)**: Persists project-specific decisions, architecture notes, and domain invariants.
- **Knowledge Graph MCP Server (`memory`)**: Maintains semantic entities and relations for structured context retrieval.

---

## Detailed Component Inventory

### 1. Agents (30)

| Category                 | Agent                    | Primary Role                                                             |
| :----------------------- | :----------------------- | :----------------------------------------------------------------------- |
| **Management**           | `context-builder`        | Assembles concise context handoff packages for sub-agents                |
|                          | `fullstack-orchestrator` | Orchestrates end-to-end full-stack feature delivery                      |
|                          | `memory-curator`         | Manages long-term agent memory, prunes stale entries                     |
|                          | `humanizer`              | Rewrites AI text into natural, professional, human prose                 |
|                          | `team-commander`         | Coordinates multi-agent team tasks and resolves blockers                 |
| **Engineering**          | `database-architect`     | Designs normalized relational/NoSQL schemas, ERDs, and migrations        |
|                          | `backend-engineer`       | Implements server logic, REST/GraphQL APIs, and middleware               |
|                          | `frontend-engineer`      | Constructs responsive React/Next.js interfaces with Tailwind             |
|                          | `mobile-developer`       | Builds cross-platform React Native / Expo mobile applications            |
|                          | `ui-ux-designer`         | Creates design tokens, component specifications, and wireframes          |
|                          | `code-reviewer`          | Conducts thorough code quality reviews and anti-pattern detection        |
|                          | `refactor-engineer`      | Refactors legacy code, resolves technical debt, optimizes performance    |
|                          | `technical-writer`       | Generates comprehensive API references, READMEs, and ADRs                |
| **Infrastructure**       | `cloud-architect`        | Designs IaC (Terraform/Pulumi) for AWS/GCP/Azure environments            |
|                          | `devops-engineer`        | Configures CI/CD pipelines, Docker containers, and K8s manifests         |
|                          | `network-engineer`       | Handles DNS resolution, port diagnostics, and network troubleshooting    |
|                          | `execution-engineer`     | Automates background task execution, cron schedules, and workflows       |
| **Security**             | `cybersecurity-analyst`  | Conducts OWASP security audits, vulnerability scans, and threat models   |
|                          | `quality-gatekeeper`     | Enforces verification standards and output quality contracts             |
|                          | `risk-manager`           | Monitors portfolio exposure, position sizing, and circuit breakers       |
| **Data & Research**      | `data-engineer`          | Builds robust ETL/ELT pipelines, data warehouses, and validation         |
|                          | `market-data-engineer`   | Processes real-time market feeds, OHLCV data, and WebSocket streams      |
|                          | `web-researcher`         | Performs deep multi-source web research with fact-verification           |
|                          | `news-trending-scout`    | Monitors real-time news trends, sentiment, and social signals            |
|                          | `social-media-analyst`   | Tracks engagement metrics, platform trends, and brand sentiment          |
| **Quantitative Finance** | `finance-analyst`        | Constructs DCF models, financial ratios, and risk metrics                |
|                          | `quant-algo-engineer`    | Implements quantitative trading algorithms and backtest logic            |
|                          | `quant-strategist`       | Researches alpha signals, mean-reversion, and trend-following strategies |
|                          | `trading-desk-chief`     | Oversees trading operations, compliance, and risk limits                 |
| **Specialized**          | `self-evaluator`         | Conducts objective self-evaluations against prompt criteria              |

---

### 2. Technical Skills (42)

| Domain                   | Skill                           | Description                                                         |
| :----------------------- | :------------------------------ | :------------------------------------------------------------------ |
| **AI Core**              | `ai-humanizer-anti-slop`        | Anti-slop guidelines and prose naturalization                       |
|                          | `ai-memory-curator`             | Memory curation, deduplication, and indexing                        |
|                          | `prompt-router`                 | Intent classification and skill-to-agent mapping                    |
|                          | `fact-check-anti-hallucination` | Cross-verification protocol preventing ungrounded claims            |
| **Software Engineering** | `backend-api-design`            | RESTful/GraphQL API design with OpenAPI specifications              |
|                          | `database-ssd-design`           | Schema State Diagrams and entity lifecycle modeling                 |
|                          | `frontend-react-tailwind`       | React component construction with Tailwind CSS                      |
|                          | `ui-animation-gsap-framer`      | GSAP and Framer Motion animation implementations                    |
|                          | `ui-ux-design-system`           | Design system generation (tokens, scales, wireframes)               |
|                          | `api-doc-generator`             | Automatic API documentation extraction from codebase                |
|                          | `api-testing`                   | Contract testing, load testing, and integration suites              |
|                          | `mobile-react-native`           | React Native / Expo application development patterns                |
|                          | `migration-refactoring`         | Legacy migration strategies and framework upgrades                  |
|                          | `tdd-workflow`                  | Test-Driven Development (Red-Green-Refactor) loop                   |
|                          | `verification-loop`             | Continuous linting, type-checking, and test execution               |
| **Security**             | `cybersecurity-pentest`         | Penetration testing methodology based on OWASP Top 10               |
|                          | `cybersecurity-vuln-scan`       | Automated vulnerability scanning (`npm audit`, `bandit`, `semgrep`) |
|                          | `code-review-security`          | Static analysis for injection, XSS, SSRF, and credential leaks      |
| **DevOps & Cloud**       | `docker-deployment`             | Containerization, multi-stage Dockerfiles, compose setups           |
|                          | `git-workflow`                  | Advanced Git branching, rebasing, and merge strategies              |
|                          | `github-workflow`               | GitHub operations (PRs, issues, Actions) via MCP                    |
|                          | `network-diagnostics`           | DNS, connectivity, latency, and port troubleshooting                |
|                          | `monitoring-observability`      | Prometheus, Grafana, Datadog setup and log tracing                  |
|                          | `performance-optimization`      | Profiling bundle sizes, memory leaks, and query performance         |
| **Data & Research**      | `data-visualization`            | Interactive charts using D3.js, Recharts, and Plotly                |
|                          | `etl-pipeline`                  | Idempotent ETL pipeline construction and data quality checks        |
|                          | `web-research-deep`             | Multi-source deep research pipeline with citation scoring           |
|                          | `news-trending-aggregator`      | Real-time news aggregation and sentiment clustering                 |
|                          | `api-integration-exa-tavily`    | Unified search API integration patterns (Tavily/Exa/Brave)          |
|                          | `social-media-monitor`          | Social media metric tracking and sentiment analysis                 |
| **Quantitative Finance** | `finance-analysis`              | DCF valuation, portfolio optimization, VaR calculation              |
|                          | `quant-algo-trading`            | Quantitative strategy backtesting with Backtrader/VectorBT          |
| **System Workflows**     | `fullstack-orchestration`       | End-to-end full-stack application orchestration                     |
|                          | `workflow-automation`           | Multi-agent conditional execution chains                            |
|                          | `universal-execution-loop`      | Universal build-run-test-fix verification loop                      |
|                          | `error-resolution-loop`         | Systematic root-cause analysis and automated debugging              |
|                          | `accessibility-audit`           | WCAG 2.1 AA/AAA compliance checking and keyboard nav                |
|                          | `seo-optimization`              | Technical SEO, structured data, and Core Web Vitals                 |
|                          | `technical-documentation`       | Comprehensive technical doc generation                              |
|                          | `cloud-infrastructure`          | Infrastructure as Code (IaC) generation                             |
|                          | `strategic-compact`             | Context window compression protocols                                |

---

### 3. Slash Commands (15)

| Command       | Target Workflow / Action                                             |
| :------------ | :------------------------------------------------------------------- |
| `/audit`      | Audits system usage across agents, models, MCP servers, and skills   |
| `/backtest`   | Runs strategy backtest suite with walk-forward validation            |
| `/deploy`     | Generates containerization and staging/production deployment scripts |
| `/erd`        | Generates Entity-Relationship Diagrams from database schemas         |
| `/eval`       | Runs routing regression evaluations (`core/eval-runner.js`)          |
| `/fullstack`  | Triggers the complete full-stack development orchestration chain     |
| `/git-push`   | Stages, commits with conventional message, and pushes changes        |
| `/humanize`   | Runs anti-slop pass to naturalize AI response text                   |
| `/pentest`    | Conducts security vulnerability and penetration testing scans        |
| `/quant`      | Designs and backtests quantitative trading algorithms                |
| `/research`   | Executes multi-source deep web research                              |
| `/review`     | Conducts comprehensive code quality and security reviews             |
| `/risk-check` | Validates active trading parameters against safety rules             |
| `/route`      | Displays prompt analysis and routing recommendation                  |
| `/trend`      | Aggregates trending news and market sentiment analysis               |

---

### 4. Lifecycle Hooks (17)

| Script                   | Qwen Code Lifecycle Event          | Purpose                                                           |
| :----------------------- | :--------------------------------- | :---------------------------------------------------------------- |
| `session-bootstrap.js`   | `SessionStart`                     | Prepares workspace environment and state                          |
| `auto-resume-watcher.js` | `SessionStart`                     | Monitors background execution and auto-resumes stalled tasks      |
| `context-pruner.js`      | `UserPromptSubmit`                 | Prunes stale context before prompt execution                      |
| `prompt-router.js`       | `UserPromptSubmit`                 | Analyzes prompt complexity and injects routing directives         |
| `security-check.js`      | `PreToolUse` (`run_shell_command`) | Blocks destructive system commands (`rm -rf`, `git push --force`) |
| `trading-risk-guard.js`  | `PreToolUse` (`run_shell_command`) | Validates trade execution limits and risk boundaries              |
| `token-monitor.js`       | `PostToolUse` (`*`)                | Tracks turn-by-turn token consumption                             |
| `lint-check.js`          | `PostToolUse` (`write_file`)       | Runs linter checks following code changes                         |
| `auto-format.js`         | `PostToolUse` (`write_file`)       | Formats modified code to project standards                        |
| `parent-silencer.js`     | `MessageDisplay`                   | Filters parent task chatter during sub-agent execution            |
| `output-sanitizer.js`    | `MessageDisplay`                   | Cleans raw tool artifacts from user-facing output                 |
| `subagent-presenter.js`  | `SubagentStart`                    | Standardizes sub-agent result formatting                          |
| `hallucination-guard.js` | `Stop`                             | Detects and flags ungrounded claims or invalid links              |
| `quality-gate.js`        | `Stop`                             | Enforces anti-slop rules and triggers humanized rewrites          |
| `auto-memory.js`         | `Stop`                             | Persists key learnings and decisions to long-term memory          |
| `improvement-tracker.js` | `Stop`                             | Logs continuous system improvements over time                     |
| `protocol-updater.js`    | `Stop`                             | Synchronizes protocol documentation with codebase changes         |
| `reflection.js`          | `Stop`                             | Generates self-reflections on session performance                 |
| `memory-distiller.py`    | `PreCompact`                       | Distills conversation history before token compaction             |

---

### 5. Enforced System Rules (13)

- **Universal Rules (`rules/_universal/`)**:
  - `chain-of-thought.md`: Requires structured reasoning before substantive output.
  - `file-write-protocol.md`: Enforces mandatory `read_file` calls prior to writing files.
  - `output-contract.md`: Direct answers, tables, code blocks, zero filler.
  - `output-format.md`: Single clean response format rules.
  - `power-protocol.md`: Adaptive 5-step engineering framework (Think-Search-Execute-Verify-Learn).
  - `security-baseline.md`: Secrets management, input sanitization, and trading safety.
  - `self-correction.md`: Root cause diagnosis and self-repair protocols.
  - `web-search-priority.md`: Prioritizes Brave -> Tavily -> Exa -> Web-Research.
- **Domain Standards**:
  - `common/coding-style.md`: DRY, error handling, self-documenting code.
  - `execution/delivery-rules.md`: Executable verification before completion reporting.
  - `python/coding-style.md`: PEP 8 compliance, strict typing, async I/O.
  - `sql/query-safety.md`: Parameterized queries, explicit column selection.
  - `typescript/coding-style.md`: Strict mode enabled, zero `any` types.

---

### 6. Model Context Protocol (MCP) Integrations (15)

| MCP Server            | Connection                                                     | Capabilities                                                 |
| :-------------------- | :------------------------------------------------------------- | :----------------------------------------------------------- |
| `tavily`              | stdio (`npx tavily-mcp`)                                       | Real-time web search and news optimized for AI               |
| `exa`                 | stdio (`npx exa-mcp-server`)                                   | Semantic code, academic research, and deep content search    |
| `brave-search`        | stdio (`npx @modelcontextprotocol/server-brave-search`)        | Privacy-focused web search with local business data          |
| `web-research`        | stdio (`npx @mzxrai/mcp-webresearch`)                          | Multi-page automated web research via headless browser       |
| `github`              | stdio (`npx @modelcontextprotocol/server-github`)              | GitHub repository, PR, issue, and workflow management        |
| `filesystem`          | stdio (`npx @modelcontextprotocol/server-filesystem`)          | Secure local workspace file read/write operations            |
| `fetch`               | stdio (`npx @kazuph/mcp-fetch`)                                | Direct URL content retrieval and Jina AI web scraping        |
| `memory`              | stdio (`npx @modelcontextprotocol/server-memory`)              | Knowledge graph server for long-term entity-relation storage |
| `sequential-thinking` | stdio (`npx @modelcontextprotocol/server-sequential-thinking`) | Dynamic problem decomposition and multi-step reasoning       |
| `playwright`          | stdio (`npx @playwright/mcp`)                                  | Headless browser automation, visual snapshots, E2E testing   |
| `context7`            | stdio (`npx @upstash/context7-mcp`)                            | Live documentation lookup for npm/PyPI packages              |
| `magic`               | stdio (`npx @magicuidesign/mcp`)                               | Magic UI design token and component library access           |
| `vercel`              | HTTP (`https://mcp.vercel.com`)                                | Vercel deployment management and project integration         |
| `firecrawl`           | stdio (`npx firecrawl-mcp`)                                    | High-fidelity web scraping and page crawling                 |
| `Parallel Search MCP` | Remote HTTP (`https://search.parallel.ai/mcp`)                 | Multi-engine parallel search integration                     |

---

## Overall System Metrics

| Category                     | Component Count |
| :--------------------------- | :-------------: |
| **Specialized Agents**       |     **30**      |
| **Technical Skills**         |     **42**      |
| **Slash Commands**           |     **15**      |
| **Lifecycle Hooks**          |     **17**      |
| **Enforced Rules**           |     **13**      |
| **MCP Integrations**         |     **15**      |
| **Total Modular Components** |     **132**     |
