---
name: github-workflow
description: GitHub operations via MCP: create repo, open PR, manage issues, trigger Actions, code review. Uses github MCP server with GITHUB_TOKEN.
metadata:
  category: devops
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Actions + PR automation
- APPLY: Reusable workflows, least-privilege, caching
- VERIFY: Workflow runs green; secrets masked
- ANTI-PATTERNS: Unpinned actions, secret leaks
<!-- /QWEN-STYLE -->


# GitHub Workflow Skill
Use mcp__github tools. Automate PR creation, issue labeling, and Action triggers.

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
