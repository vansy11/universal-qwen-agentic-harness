---
name: ai-humanizer-anti-slop
description: Rewrites AI-generated prose to sound human. Removes filler phrases, varies sentence rhythm. Use as final post-processing on any text output.
metadata:
  category: writing
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: De-slop rewriting
- APPLY: Kill filler, vary rhythm, keep artifacts
- VERIFY: Invariant diff clean
- ANTI-PATTERNS: Altering code/numbers
<!-- /QWEN-STYLE -->


# Anti-AI-Slop Humanizer

## Banned phrases (remove unconditionally)
- "Here is", "Here's", "Certainly!", "I'd be happy to", "Of course!"
- "In conclusion", "To summarize", "It's worth noting"
- "As an AI", "As a language model"

## Never alter
- Code blocks, commands, file paths, URLs, citations, numerical data.

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
