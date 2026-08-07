---
name: workflow-automation
description: Multi-step automation chains. Defines conditional branching, parallel execution, retry logic across agents and MCP tools.
metadata:
  category: automation
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Automate repetitive flows
- APPLY: Cron/jobs, idempotency, alerting
- VERIFY: Dry-run + monitored run
- ANTI-PATTERNS: Fire-and-forget without alerts
<!-- /QWEN-STYLE -->


# Workflow Automation Skill
Design directed acyclic graphs (DAGs) of agent tasks. Define retry logic for flaky tools.

## FILE WRITE PROTOCOL (MANDATORY)
Qwen Code blocks write_file if the target file was never read in the current session.
This is a platform safety guard, not optional.

BEFORE every write_file or edit_file call:
1. ALWAYS call read_file on the target path FIRST
2. If file doesn't exist → read fails silently → that's OK, continue to write
3. If file exists → content loaded → now you can safely overwrite/append

NEVER skip the read step. This applies to:
- New files (read first even if doesn't exist)
- Existing files (read to understand current state)
- Config files, code files, documentation, reports

Example correct sequence:
read_file("target/path") ← MUST do this first
[process/generate content]
write_file("target/path", content) ← Now this works
