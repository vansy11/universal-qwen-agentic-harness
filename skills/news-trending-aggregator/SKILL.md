---
name: news-trending-aggregator
description: Aggregates real-time news and trending topics via Tavily + Brave. Sentiment analysis, source diversity check, topic clustering.
metadata:
  category: research
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Trend aggregation
- APPLY: Multi-source ranking + recency
- VERIFY: Cross-source confirmation
- ANTI-PATTERNS: Single-source trends
<!-- /QWEN-STYLE -->


# News Aggregator Skill
Group articles by topic. Calculate sentiment polarity. Ensure source diversity (don't rely on a single domain).

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
