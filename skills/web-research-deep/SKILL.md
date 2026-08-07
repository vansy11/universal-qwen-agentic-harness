---
name: web-research-deep
description: Deep research pipeline using Tavily + Exa MCP. Query decomposition, multi-source cross-reference, citation extraction, confidence scoring.
metadata:
  category: research
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Deep multi-source research
- APPLY: >=2 sources, fact vs inference
- VERIFY: Cross-checked numbers/dates
- ANTI-PATTERNS: Single-source, hallucinated citations
<!-- /QWEN-STYLE -->


# Deep Web Research Skill
Break complex queries into sub-queries. Use Exa for code/semantic, Tavily for news/general. Assign confidence score (0-100%) based on source agreement.

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
