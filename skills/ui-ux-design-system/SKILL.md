---
name: ui-ux-design-system
description: Creates design systems: color tokens, typography scale, spacing, component specs, wireframes. Output as design tokens JSON + Mermaid wireframes.
metadata:
  category: design
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Design system craft
- APPLY: Tokens, hierarchy, a11y, motion
- VERIFY: Contrast + focus + reduced-motion
- ANTI-PATTERNS: Low contrast, inconsistency
<!-- /QWEN-STYLE -->


# Design System Skill
Define primary/secondary/semantic colors. Use modular scale for typography (e.g., 1.250 major third). Output design-tokens.json.

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
