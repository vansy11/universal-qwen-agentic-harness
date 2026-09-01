# System Architecture

The **Universal Qwen Agentic Harness** is an enterprise-grade, event-driven **Orchestrator-Worker** multi-agent platform designed specifically for the Qwen Code CLI. It transforms a single-context LLM coding assistant into a coordinated autonomous engineering suite that plans, delegates, executes, self-evaluates, and persists learnings automatically.

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
                                               │ (30 Sub-Agents)    │
                                               └─────────┬──────────┘
                                                         │
                                               ┌─────────▼──────────┐
                                               │ Tool & MCP Layer   │
                                               │ (46 Skills, 15 MCP)│
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
- **Context Pruner (`hooks/context-pruner.js`)**: Strips noise from the user prompt before processing — deduplicates redundant `system-reminder` blocks, removes tool/subagent error artifacts, collapses excess whitespace, and trims empty XML tags.
- **Prompt Optimizer (`core/prompt-optimizer.js`)**: Minifies whitespace, eliminates redundant politeness phrases, injects active rules and relevant long-term memories, and calculates token budgets prior to API dispatch.
- **Prompt Router (`hooks/prompt-router.js`)**: Universal intent router with **16 domain intents** (frontend, backend/API, database, DevOps, quant/trading, data/ETL, mobile, security, research, docs, testing, git, migration, performance, network, social/PDF/SEO). Uses **Levenshtein fuzzy matching** to tolerate typos, then auto-injects the relevant skills and specialist agents for the detected domain.

### 3. Lifecycle Hooks Engine (18 Hook Scripts)

Cross-platform Node.js & Python scripts executed automatically by Qwen Code at specific turn boundaries:

- **Session Start**: Environment preparation and session state initialization (`session-bootstrap.js`, `auto-resume-watcher.js`).
- **Prompt Interception**: Context pruning and universal intent routing (`context-pruner.js`, `prompt-router.js`).
- **Tool Guarding**: Command security checking, trading risk boundaries, and mathematical rigor (`security-check.js`, `trading-risk-guard.js`, `quant-math-guard.js`).
- **Post-Tool Processing**: Real-time token monitoring, automatic code linting, and standard formatting (`token-monitor.js`, `lint-check.js`, `auto-format.js`).
- **Display Filtering**: Parent/subagent noise suppression and raw tool output sanitization (`parent-silencer.js`, `output-sanitizer.js`, `subagent-presenter.js`).
- **Stop Validation & Reflection**: Domain-agnostic quality gating, anti-slop verification, hallucination guards, auto-memory persistence, improvement tracking, protocol synchronization, and scored session reflection (`quality-gate.js`, `hallucination-guard.js`, `auto-memory.js`, `reflection.js`, `improvement-tracker.js`, `protocol-updater.js`).
- **Pre-Compact Distillation**: Context distillation prior to token compaction (`memory-distiller.py`).

### 4. Auto Evaluation & Quality Control

- **System Routing Evaluator (`core/router-eval.js` / `/eval`)**: Measures prompt routing precision against test datasets (`evals/cases.json`).
- **Self-Evaluator Agent (`agents/self-evaluator.md`)**: Assesses completion criteria, formatting, and verifies that no unresolved placeholders exist before delivering work.
- **Domain-Agnostic Quality Gate (`hooks/quality-gate.js`)**: Auto-detects the project domain and applies a tailored evaluation strategy. Universal checks (AI-slop, placeholder/TODO remnants, hardcoded secrets) run on every output, then a domain-specific evaluator applies:
  - **web** → Playwright headless runtime evaluation (`core/eval-runner.js`).
  - **api** → Endpoint structure, error handling, and input validation checks.
  - **python** → Anti-pattern detection (bare `except`, wildcard imports, debug prints).
  - **quant** → Risk-management and data-validation safeguards.
  - **devops** → Multi-stage builds, health checks, and secret-leak detection.
  - **general** → Code structure and error-handling review.
  - Enforcement: only FAIL findings emit a Stop-hook block decision (looping back for fixes); WARN findings are advisory, and clean approvals produce no output.
- **Quality Gatekeeper (`agents/quality-gatekeeper.md` & `agents/humanizer.md`)**: Rejects generic AI response patterns ("AI Slop") and triggers humanized rewrites.

### 5. Auto Loop & Resiliency Engine

- **Self-Paced Loop Scheduler (`/loop` command & `loop_wakeup` tool)**: Enables scheduled and background recurring tasks up to 24 hours.
- **Auto-Resume Watcher (`core/auto-resume-watcher.js`)**: Monitors background execution state (`tmp/blackboard.json`). When execution stalls or hits API rate limits, it waits out cooldown periods and injects `[SYSTEM AUTO-RESUME]` recovery prompts to resume execution autonomously.

### 6. Long-Term Memory & Knowledge Graph

- **Dual Memory Architecture**:
  - **Global User Memory (`~/.qwen/memories/`)**: Stores cross-project developer profiles, coding preferences, and style guidelines.
  - **Project Local Memory (`.qwen/projects/<hash>/memory/`)**: Persists project-specific decisions, architecture notes, and domain invariants.
- **Knowledge Graph MCP Server (`memory`)**: Maintains semantic entities and relations for structured context retrieval.

---

## Detailed Component Inventory

### 1. Agents (30 Specialist Sub-Agents)

| Category                   | Agent                    | Primary Role                                                             |
| :------------------------- | :----------------------- | :----------------------------------------------------------------------- |
| **Management & Quality**   | `context-builder`        | Assembles concise context handoff packages for sub-agents                |
|                            | `fullstack-orchestrator` | Orchestrates end-to-end full-stack feature delivery                      |
|                            | `memory-curator`         | Manages long-term agent memory, prunes stale entries                     |
|                            | `humanizer`              | Rewrites AI text into natural, professional, human prose                 |
|                            | `team-commander`         | Coordinates multi-agent team tasks and resolves blockers                 |
|                            | `self-evaluator`         | Conducts objective self-evaluations against prompt criteria              |
|                            | `quality-gatekeeper`     | Enforces verification standards and output quality contracts             |
| **Software Engineering**   | `database-architect`     | Designs normalized relational/NoSQL schemas, ERDs, and migrations        |
|                            | `backend-engineer`       | Implements server logic, REST/GraphQL APIs, and middleware               |
|                            | `frontend-engineer`      | Constructs responsive React/Next.js interfaces with Tailwind             |
|                            | `mobile-developer`       | Builds cross-platform React Native / Expo mobile applications            |
|                            | `ui-ux-designer`         | Creates design tokens, component specifications, and wireframes          |
|                            | `code-reviewer`          | Conducts thorough code quality reviews and anti-pattern detection        |
|                            | `refactor-engineer`      | Refactors legacy code, resolves technical debt, optimizes performance    |
|                            | `technical-writer`       | Generates comprehensive API references, READMEs, and ADRs                |
| **Infrastructure & Cloud** | `cloud-architect`        | Designs IaC (Terraform/Pulumi) for AWS/GCP/Azure environments            |
|                            | `devops-engineer`        | Configures CI/CD pipelines, Docker containers, and K8s manifests         |
|                            | `network-engineer`       | Handles DNS resolution, port diagnostics, and network troubleshooting    |
|                            | `execution-engineer`     | Automates background task execution, cron schedules, and workflows       |
| **Security & Auditing**    | `cybersecurity-analyst`  | Conducts OWASP security audits, vulnerability scans, and threat models   |
|                            | `risk-manager`           | Monitors portfolio exposure, position sizing, and circuit breakers       |
| **Data & Research**        | `data-engineer`          | Builds robust ETL/ELT pipelines, data warehouses, and validation         |
|                            | `market-data-engineer`   | Processes real-time market feeds, OHLCV data, and WebSocket streams      |
|                            | `web-researcher`         | Performs deep multi-source web research with fact-verification           |
|                            | `news-trending-scout`    | Monitors real-time news trends, sentiment, and social signals            |
|                            | `social-media-analyst`   | Tracks engagement metrics, platform trends, and brand sentiment          |
| **Quantitative Finance**   | `finance-analyst`        | Constructs DCF models, financial ratios, and risk metrics                |
|                            | `quant-algo-engineer`    | Implements quantitative trading algorithms and backtest logic            |
|                            | `quant-strategist`       | Researches alpha signals, mean-reversion, and trend-following strategies |
|                            | `trading-desk-chief`     | Oversees trading operations, compliance, and risk limits                 |

---

### 2. Technical Skills (46 Skills)

| Domain                     | Skill                           | Description                                                         |
| :------------------------- | :------------------------------ | :------------------------------------------------------------------ |
| **AI Core & Routing**      | `ai-humanizer-anti-slop`        | Anti-slop guidelines and prose naturalization                       |
|                            | `ai-memory-curator`             | Memory curation, deduplication, and indexing                        |
|                            | `prompt-router`                 | Intent classification and skill-to-agent mapping                    |
|                            | `fact-check-anti-hallucination` | Cross-verification protocol preventing ungrounded claims            |
|                            | `strategic-compact`             | Context window compression protocols                                |
| **Frontend & UI/UX**       | `frontend-react-tailwind`       | React component construction with Tailwind CSS                      |
|                            | `ui-animation-gsap-framer`      | GSAP and Framer Motion animation implementations                    |
|                            | `ui-ux-design-system`           | Design system generation (tokens, scales, wireframes)               |
|                            | `ui-ux-pro-max`                 | Advanced visual design hierarchy and component layout               |
|                            | `accessibility-audit`           | WCAG 2.1 AA/AAA compliance checking and keyboard navigation         |
| **Backend & Architecture** | `backend-api-design`            | RESTful/GraphQL API design with OpenAPI specifications              |
|                            | `database-ssd-design`           | Schema State Diagrams and entity lifecycle modeling                 |
|                            | `api-doc-generator`             | Automatic API documentation extraction from codebase                |
|                            | `api-testing`                   | Contract testing, load testing, and integration suites              |
|                            | `mobile-react-native`           | React Native / Expo application development patterns                |
|                            | `migration-refactoring`         | Legacy migration strategies and framework upgrades                  |
|                            | `tdd-workflow`                  | Test-Driven Development (Red-Green-Refactor) loop                   |
|                            | `verification-loop`             | Continuous linting, type-checking, and test execution               |
|                            | `performance-optimization`      | Profiling bundle sizes, memory leaks, and query performance         |
| **Security & Testing**     | `cybersecurity-pentest`         | Penetration testing methodology based on OWASP Top 10               |
|                            | `cybersecurity-vuln-scan`       | Automated vulnerability scanning (`npm audit`, `bandit`, `semgrep`) |
|                            | `code-review-security`          | Static analysis for injection, XSS, SSRF, and credential leaks      |
| **DevOps & Cloud**         | `cloud-infrastructure`          | Infrastructure as Code (Terraform/Pulumi) generation                |
|                            | `docker-deployment`             | Containerization, multi-stage Dockerfiles, compose setups           |
|                            | `git-workflow`                  | Advanced Git branching, rebasing, and merge strategies              |
|                            | `github-workflow`               | GitHub operations (PRs, issues, Actions) via MCP                    |
|                            | `network-diagnostics`           | DNS, connectivity, latency, and port troubleshooting                |
|                            | `monitoring-observability`      | Prometheus, Grafana, Datadog setup and log tracing                  |
| **Data & Research**        | `data-visualization`            | Interactive charts using D3.js, Recharts, and Plotly                |
|                            | `etl-pipeline`                  | Idempotent ETL pipeline construction and data quality checks        |
|                            | `web-research-deep`             | Multi-source deep research pipeline with citation scoring           |
|                            | `news-trending-aggregator`      | Real-time news aggregation and sentiment clustering                 |
|                            | `api-integration-exa-tavily`    | Unified search API integration patterns (Tavily/Exa/Brave)          |
|                            | `social-media-monitor`          | Social media metric tracking and sentiment analysis                 |
|                            | `pdf-extraction`                | High-fidelity text and table extraction from PDF files              |
|                            | `ms-office-engine`              | Read/write Microsoft Office files (.docx, .xlsx, .pptx) locally     |
| **Quantitative Finance**   | `finance-analysis`              | DCF valuation, portfolio optimization, VaR calculation              |
|                            | `quant-algo-trading`            | Quantitative strategy backtesting with Backtrader/VectorBT          |
|                            | `derivatives-pricing`           | Black-Scholes options pricing, Greeks, and Monte Carlo models       |
|                            | `institutional-econometrics`    | Advanced financial math, risk metrics, and time-series econometrics |
| **System Workflows**       | `fullstack-orchestration`       | End-to-end full-stack application orchestration                     |
|                            | `workflow-automation`           | Multi-agent conditional execution chains                            |
|                            | `universal-execution-loop`      | Universal build-run-test-fix verification loop                      |
|                            | `error-resolution-loop`         | Systematic root-cause analysis and automated debugging              |
|                            | `seo-optimization`              | Technical SEO, structured data, and Core Web Vitals                 |
|                            | `technical-documentation`       | Comprehensive technical documentation generation                    |

---

### 3. Slash Commands (15 Commands)

| Command       | Target Workflow / Action                                             |
| :------------ | :------------------------------------------------------------------- |
| `/audit`      | Audits system usage across agents, models, MCP servers, and skills   |
| `/backtest`   | Runs strategy backtest suite with walk-forward validation            |
| `/deploy`     | Generates containerization and staging/production deployment scripts |
| `/erd`        | Generates Entity-Relationship Diagrams from database schemas         |
| `/eval`       | Runs routing regression evaluations (`core/router-eval.js`)          |
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

### 4. Lifecycle Hooks (18 Scripts)

| Script                   | Qwen Code Lifecycle Event | Matcher Target      | Timeout | Primary Function                                                    |
| :----------------------- | :------------------------ | :------------------ | :-----: | :------------------------------------------------------------------ |
| `session-bootstrap.js`   | `SessionStart`            | All                 | 10000ms | Initializes session environment & environment variables             |
| `auto-resume-watcher.js` | `SessionStart`            | All                 | 10000ms | Monitors background stalls and injects auto-resume prompts          |
| `context-pruner.js`      | `UserPromptSubmit`        | All                 | 5000ms  | Strips prompt noise: dedup reminders, tool artifacts, empty tags    |
| `prompt-router.js`       | `UserPromptSubmit`        | All                 | 15000ms | Universal 16-intent router with Levenshtein fuzzy skill/agent inject |
| `security-check.js`      | `PreToolUse`              | `run_shell_command` | 5000ms  | Blocks destructive terminal commands (`rm -rf`, `git push --force`) |
| `trading-risk-guard.js`  | `PreToolUse`              | `run_shell_command` | 5000ms  | Enforces trading limits and position risk controls                  |
| `quant-math-guard.js`    | `PreToolUse`              | `run_shell_command` | 5000ms  | Validates quantitative calculations and econometric formulas        |
| `token-monitor.js`       | `PostToolUse`             | `*`                 | 5000ms  | Tracks turn-by-turn token consumption                               |
| `lint-check.js`          | `PostToolUse`             | `write_file`        | 5000ms  | Runs linter checks after file modifications                         |
| `auto-format.js`         | `PostToolUse`             | `write_file`        | 5000ms  | Auto-formats edited files to project style                          |
| `parent-silencer.js`     | `MessageDisplay`          | All                 | 5000ms  | Suppresses parent echo, thinking tags, raw JSON, subagent chatter    |
| `output-sanitizer.js`    | `MessageDisplay`          | All                 | 5000ms  | Cleans raw MCP/tool JSON dumps from output                          |
| `subagent-presenter.js`  | `SubagentStart`           | All                 | 5000ms  | Formats sub-agent start/progress notifications                      |
| `hallucination-guard.js` | `Stop`                    | All                 | 5000ms  | Flags ungrounded claims, non-existent URLs, or code bugs            |
| `quality-gate.js`        | `Stop`                    | All                 | 10000ms | Domain-agnostic QC: blocks on FAIL only, silent on approval          |
| `auto-memory.js`         | `Stop`                    | All                 | 10000ms | Persists key learnings to long-term memory                          |
| `improvement-tracker.js` | `Stop`                    | All                 | 10000ms | Logs continuous system improvements                                 |
| `protocol-updater.js`    | `Stop`                    | All                 |    —    | Syncs protocol documentation with codebase updates                  |
| `reflection.js`          | `Stop`                    | All                 | 10000ms | Scores each turn (corrections/retries/slop) → evolution-log.jsonl   |
| `memory-distiller.py`    | `PreCompact`              | All                 | 15000ms | Distills context into structured memory before compaction           |

---

### 5. Enforced System Rules (15 Rules)

- **Universal Rules (`rules/_universal/`)**:
  - `chain-of-thought.md`: Requires structured reasoning before substantive output.
  - `file-write-protocol.md`: Enforces mandatory `read_file` calls prior to writing files.
  - `memory-freshness.md`: Forbids stale memory rehashing; demands fresh synthesis from current state.
  - `output-contract.md`: Direct answers, tables, code blocks, zero filler.
  - `output-format.md`: Single clean response format rules.
  - `power-protocol.md`: Adaptive 5-step engineering framework (Think-Search-Execute-Verify-Learn).
  - `security-baseline.md`: Secrets management, input sanitization, and trading safety.
  - `self-correction.md`: Root cause diagnosis and self-repair protocols.
  - `web-search-priority.md`: Prioritizes Brave -> Tavily -> Exa -> Web-Research.
- **Domain Standards**:
  - `common/coding-style.md`: DRY, error handling, self-documenting code.
  - `common/universal-coding.md`: Language-agnostic fallback (naming, validation, security, testing) for PHP, Go, Rust, Java, C#, Ruby, etc.
  - `execution/delivery-rules.md`: Executable verification before completion reporting.
  - `python/coding-style.md`: PEP 8 compliance, strict typing, async I/O.
  - `sql/query-safety.md`: Parameterized queries, explicit column selection.
  - `typescript/coding-style.md`: Strict mode enabled, zero `any` types.

---

### 6. Model Context Protocol (MCP) Integrations (15 Servers)

| MCP Server            | Transport / Runtime                                            | Primary Capabilities                                            |
| :-------------------- | :------------------------------------------------------------- | :-------------------------------------------------------------- |
| `tavily`              | stdio (`npx tavily-mcp`)                                       | Real-time web search and news optimized for AI models           |
| `exa`                 | stdio (`npx exa-mcp-server`)                                   | Semantic code, academic research, and deep content search       |
| `brave-search`        | stdio (`npx @modelcontextprotocol/server-brave-search`)        | Privacy-focused web search with local business data             |
| `web-research`        | stdio (`npx @mzxrai/mcp-webresearch`)                          | Multi-page automated web research via headless browser          |
| `github`              | stdio (`npx @modelcontextprotocol/server-github`)              | GitHub repository, PR, issue, and workflow management           |
| `filesystem`          | stdio (`npx @modelcontextprotocol/server-filesystem`)          | Secure local file system operations                             |
| `fetch`               | stdio (`npx @kazuph/mcp-fetch`)                                | Web page extraction and markdown parsing with Jina proxy        |
| `memory`              | stdio (`npx @modelcontextprotocol/server-memory`)              | Local knowledge graph persistence for entities & relations      |
| `sequential-thinking` | stdio (`npx @modelcontextprotocol/server-sequential-thinking`) | Dynamic multi-step reasoning and hypothesis testing             |
| `playwright`          | stdio (`npx @playwright/mcp`)                                  | Headless browser automation, visual snapshots, E2E testing      |
| `context7`            | stdio (`npx @upstash/context7-mcp`)                            | Up-to-date documentation lookup for modern frameworks/libraries |
| `magic`               | stdio (`npx @magicuidesign/mcp`)                               | Magic UI animation components and visual blocks                 |
| `vercel`              | HTTP (`https://mcp.vercel.com`)                                | Cloud deployments and project infrastructure management         |
| `firecrawl`           | stdio (`npx firecrawl-mcp`)                                    | Advanced web scraping, recursive crawling, and document parsing |
| `Parallel Search MCP` | stdio (`npx mcp-remote https://search.parallel.ai/mcp`)        | High-speed parallel search with focused snippet extraction      |
