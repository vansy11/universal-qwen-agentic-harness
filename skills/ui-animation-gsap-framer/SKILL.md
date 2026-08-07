---
name: ui-animation-gsap-framer
description: Adds animations using GSAP, Framer Motion, CSS keyframes, Lottie. Respects prefers-reduced-motion. Use after frontend is built.
metadata:
  category: frontend
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Motion with GSAP/Framer
- APPLY: Spring physics, stagger, scroll-linked, transform/opacity only
- VERIFY: Reduced-motion + 60fps check
- ANTI-PATTERNS: Animating layout props, gratuitous motion
<!-- /QWEN-STYLE -->


# UI Animation Skill
Use gsap.context() for cleanup. Implement prefers-reduced-motion media query to disable animations for accessibility.

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
