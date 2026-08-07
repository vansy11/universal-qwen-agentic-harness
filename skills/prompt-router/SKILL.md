---
name: prompt-router
description: Meta-skill documenting the routing logic. Complexity scoring rules, agent-to-domain mapping, handoff protocols. Reference for prompt-router.ps1 hook.
metadata:
  category: ai
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Intent→agent/skill routing
- APPLY: Keyword + URL priority routing
- VERIFY: Correct route for test prompts
- ANTI-PATTERNS: Misrouting, no fallback
<!-- /QWEN-STYLE -->


# Prompt Router Skill
Documents the heuristic rules used by prompt-router.ps1 to classify prompts as 'light' or 'heavy' and map them to specific agents.

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
