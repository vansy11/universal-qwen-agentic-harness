---
name: frontend-react-tailwind
description: Builds React components with Tailwind CSS following atomic design. Includes state management patterns, accessibility, responsive breakpoints.
metadata:
  category: frontend
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: React + Tailwind component craft
- APPLY: Composition, hooks, token-based spacing, code splitting
- VERIFY: Build + Lighthouse + real-device
- ANTI-PATTERNS: Inline styles, missing keys, heavy bundles
<!-- /QWEN-STYLE -->


# React + Tailwind Skill
Use functional components, hooks. Tailwind utility classes only (no custom CSS unless necessary). Ensure responsive sm:, md:, lg: breakpoints.

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
