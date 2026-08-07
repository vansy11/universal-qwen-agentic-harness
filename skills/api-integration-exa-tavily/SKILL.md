---
name: api-integration-exa-tavily
description: Standardized patterns for calling Tavily (general search + news) and Exa (semantic + code + academic). API key handling, rate limits, result merging.
metadata:
  category: integration
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Search API integration
- APPLY: Tavily general/news, Exa semantic
- VERIFY: Correct endpoint + params
- ANTI-PATTERNS: Wrong tool for query type
<!-- /QWEN-STYLE -->


# Exa & Tavily Integration Skill
Merge results from both APIs. Rank by relevance. Strip unnecessary metadata to save context window.

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
