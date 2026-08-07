---
name: strategic-compact
description: Compress conversation context to save tokens while preserving key information
metadata:
  category: optimization
  version: "1.0"
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Context compression
- APPLY: Keep decisions/facts, drop noise
- VERIFY: Task still doable post-compact
- ANTI-PATTERNS: Losing key decisions
<!-- /QWEN-STYLE -->


# Strategic Compact Skill

## When to Use
- Context window > 70% used
- Conversation > 50 messages
- Token budget tight

## Compression Strategy
1. **Preserve**: Decisions, user preferences, key facts, errors encountered
2. **Summarize**: Long tool outputs, search results, code blocks
3. **Remove**: Redundant acknowledgments, filler messages, duplicate context

## Output Format
Return compressed context as JSON snapshot for memory-distiller to persist.

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
