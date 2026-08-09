# Architecture Overview

Universal Qwen Agentic Harness — Orchestrator-Worker architecture driven by native Qwen Code Hooks.

## Workflow

1. **Input**: User types a prompt in the terminal.
2. **Routing** (`prompt-router.js`): The `UserPromptSubmit` hook scans the text. If light, the AI answers directly. If heavy, it injects routing instructions.
3. **Delegation**: The `fullstack-orchestrator` delegates tasks to specialists (Backend, Frontend, DB, etc.).
4. **Execution**: Agents work in parallel/sequence. They call MCPs for external data and read Skills for technical guidelines.
5. **Quality Gate** (`quality-gate.js`): The `Stop` hook checks the output. If "AI Slop" is detected, it blocks and invokes the `humanizer` agent to rewrite.

---

## Component Inventory

### 1. Agents (30)

| Category           | Agents                                                                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Management**     | `context-builder`, `fullstack-orchestrator`, `memory-curator`, `humanizer`, `team-commander`                                                                  |
| **Programming**    | `database-architect`, `backend-engineer`, `frontend-engineer`, `mobile-developer`, `ui-ux-designer`, `code-reviewer`, `refactor-engineer`, `technical-writer` |
| **Infrastructure** | `cloud-architect`, `devops-engineer`, `network-engineer`, `execution-engineer`                                                                                |
| **Security**       | `cybersecurity-analyst`, `quality-gatekeeper`, `risk-manager`                                                                                                 |
| **Data**           | `data-engineer`, `market-data-engineer`                                                                                                                       |
| **Research**       | `web-researcher`, `news-trending-scout`, `social-media-analyst`                                                                                               |
| **Finance**        | `finance-analyst`, `quant-algo-engineer`, `quant-strategist`, `trading-desk-chief`                                                                            |
| **Specialized**    | `self-evaluator`                                                                                                                                              |

---

### 2. Skills (42)

| Category        | Skills                                                                                                                                                                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AI Core**     | `ai-humanizer-anti-slop`, `ai-memory-curator`, `prompt-router`, `fact-check-anti-hallucination`                                                                                                                                                    |
| **Programming** | `backend-api-design`, `database-ssd-design`, `frontend-react-tailwind`, `ui-animation-gsap-framer`, `ui-ux-design-system`, `api-doc-generator`, `api-testing`, `mobile-react-native`, `migration-refactoring`, `tdd-workflow`, `verification-loop` |
| **Security**    | `cybersecurity-pentest`, `cybersecurity-vuln-scan`, `code-review-security`                                                                                                                                                                         |
| **DevOps**      | `docker-deployment`, `git-workflow`, `github-workflow`, `network-diagnostics`, `monitoring-observability`, `performance-optimization`                                                                                                              |
| **Data**        | `data-visualization`, `etl-pipeline`                                                                                                                                                                                                               |
| **Research**    | `web-research-deep`, `news-trending-aggregator`, `api-integration-exa-tavily`, `social-media-monitor`                                                                                                                                              |
| **Finance**     | `finance-analysis`, `quant-algo-trading`                                                                                                                                                                                                           |
| **System**      | `fullstack-orchestration`, `workflow-automation`, `universal-execution-loop`, `error-resolution-loop`, `accessibility-audit`, `seo-optimization`, `technical-documentation`, `cloud-infrastructure`, `strategic-compact`                           |

---

### 3. Commands (15)

| Command       | Description                                                                  |
| ------------- | ---------------------------------------------------------------------------- |
| `/audit`      | Audit usage of agents, models, MCP servers, and skills harness               |
| `/backtest`   | Run backtest suite for a trading strategy with walk-forward validation       |
| `/deploy`     | Deploy application to production or staging environment                      |
| `/erd`        | Generate Entity Relationship Diagram from database schema or requirements    |
| `/eval`       | Run routing regression evals to measure harness precision                    |
| `/fullstack`  | Build complete full-stack feature from requirements to deployment            |
| `/git-push`   | Stage, commit, and push changes with conventional commit message             |
| `/humanize`   | Rewrite AI-generated text to sound natural and human                         |
| `/pentest`    | Run security penetration test on target application or infrastructure        |
| `/quant`      | Design and implement quantitative trading algorithm                          |
| `/research`   | Conduct deep web research with multi-source synthesis and fact verification  |
| `/review`     | Review changed code for correctness, security, code quality, and performance |
| `/risk-check` | Validate current positions and parameters against risk rules                 |
| `/route`      | Analyze prompt and route to optimal agent/skill combination                  |
| `/trend`      | Aggregate trending news and sentiment for specified topic or market          |

---

### 4. Hooks (17 Node.js & Python Scripts)

| Hook                     | Event                            | Purpose                                                             |
| ------------------------ | -------------------------------- | ------------------------------------------------------------------- |
| `session-bootstrap.js`   | `SessionStart`                   | Initialize session context and environment                          |
| `context-pruner.js`      | `UserPromptSubmit`               | Prune context before prompt processing                              |
| `prompt-router.js`       | `UserPromptSubmit`               | Analyze prompt complexity and route to optimal agent                |
| `security-check.js`      | `PreToolUse` (run_shell_command) | Block dangerous shell commands (e.g., `rm -rf`, `git push --force`) |
| `trading-risk-guard.js`  | `PreToolUse` (run_shell_command) | Guard for trading operations — prevents unauthorized trades         |
| `token-monitor.js`       | `PostToolUse` (*)                | Track token consumption per turn                                    |
| `lint-check.js`          | `PostToolUse` (write_file)       | Auto-lint code after file writes                                    |
| `auto-format.js`         | `PostToolUse` (write_file)       | Auto-format code to project standards                               |
| `parent-silencer.js`     | `MessageDisplay`                 | Silence parent conversation noise                                   |
| `output-sanitizer.js`    | `MessageDisplay`                 | Clean raw tool outputs from displayed messages                      |
| `subagent-presenter.js`  | `SubagentStart`                  | Format subagent results for clean presentation                      |
| `hallucination-guard.js` | `Stop`                           | Detect and flag potential hallucinations                            |
| `quality-gate.js`        | `Stop`                           | Final quality check before output delivery                          |
| `auto-memory.js`         | `Stop`                           | Auto-save learnings and patterns to memory                          |
| `improvement-tracker.js` | `Stop`                           | Track and log system improvements                                   |
| `protocol-updater.js`    | `Stop`                           | Update protocol documentation based on changes                      |
| `reflection.js`          | `Stop`                           | Self-reflect on session outcomes                                    |
| `memory-distiller.py`    | `PreCompact`                     | Distill conversation context into compact memory                    |

---

### 5. Rules (13)

| Category       | Rules                                                                                                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Universal**  | `chain-of-thought.md`, `file-write-protocol.md`, `output-contract.md`, `output-format.md`, `power-protocol.md`, `security-baseline.md`, `self-correction.md`, `web-search-priority.md` |
| **Common**     | `coding-style.md`                                                                                                                                                                      |
| **Execution**  | `delivery-rules.md`                                                                                                                                                                    |
| **Python**     | `coding-style.md`                                                                                                                                                                      |
| **SQL**        | `query-safety.md`                                                                                                                                                                      |
| **TypeScript** | `coding-style.md`                                                                                                                                                                      |

---

### 6. MCP Servers (15)

| Server                | Purpose                                                       |
| --------------------- | ------------------------------------------------------------- |
| `tavily`              | Real-time web search and news optimized for AI                |
| `exa`                 | Semantic search for code, academic research, and deep content |
| `brave-search`        | Privacy-focused web search (2,000 free queries/month)         |
| `web-research`        | Automated web research via headless browser                   |
| `github`              | GitHub operations — repo management, PRs, issues, Actions     |
| `filesystem`          | Secure local file read/write access                           |
| `fetch`               | Raw URL content retrieval + Jina AI proxy                     |
| `memory`              | Local knowledge graph for persistent long-term AI memory      |
| `sequential-thinking` | Complex problem decomposition and chain-of-thought reasoning  |
| `playwright`          | Browser automation and E2E testing via headless Chrome        |
| `context7`            | Live documentation lookup for frontend/backend libraries      |
| `magic`               | Magic UI components for premium frontend animations           |
| `vercel`              | Cloud deployment and project management for web apps          |
| `firecrawl`           | Advanced web scraping and crawling                            |
| `Parallel Search MCP` | Parallel AI search integration                                |

---

## System Metrics

| Component       | Count   |
| --------------- | ------- |
| **Agents**      | 30      |
| **Skills**      | 42      |
| **Commands**    | 15      |
| **Hooks**       | 17      |
| **Rules**       | 13      |
| **MCP Servers** | 15      |
| **Total**       | **131** |
