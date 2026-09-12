---
name: visual-qa-playwright
description: Mandatory visual verification loop for frontend work. Dev server + multi-breakpoint screenshots + console error capture, fix-and-recheck until clean.
metadata:
  category: frontend
---

## EXECUTION STANDARD (QWEN STYLE)

Focus: Catch visual/runtime bugs the build cannot see

- APPLY: Playwright MCP loop — navigate, capture console, screenshot 3 breakpoints, inspect, fix, repeat
- VERIFY: Zero console errors + screenshot evidence before claiming done
- ANTI-PATTERNS: "Build passed so it works", claiming visual correctness without screenshot evidence

<!-- /QWEN-STYLE -->

# Visual QA Playwright Skill

## When to Activate

- After building or fixing ANY frontend page, component, or layout — before reporting done.
- When the user reports a visual bug (broken layout, overflow, untriggered animation, black canvas).
- After responsive/Tailwind changes.

## The Loop (STRICT — no skipping)

1. **Start** the dev server in the background (`npm run dev` / equivalent).
2. **Navigate** via Playwright MCP to the affected route.
3. **Capture console**: collect all messages. Zero `error` level allowed; every `warning` must be justified or fixed.
4. **Screenshot** at three widths: 375px (mobile), 768px (tablet), 1440px (desktop).
5. **Inspect** each screenshot for: horizontal overflow, broken/unloaded images, overlapping or clipped text, elements failing to animate into view, incorrect color/contrast, black WebGL canvas.
6. **Check network**: no failed asset requests (404 fonts, images, models).
7. **Fix** the root cause, then re-run steps 3–5.
8. **Report done** only with: zero console errors + screenshot filenames as evidence.

## Rules (STRICT)

- NEVER claim a page "looks correct" or "works" without screenshot evidence from this loop.
- Fix root causes, not symptoms (no `overflow: hidden` band-aids on broken layouts).
- Test with `prefers-reduced-motion` emulated when the page has scroll/entrance animations.
- Maximum 3 fix iterations on the same defect — then stop and report the blocker with evidence.
- For 3D/WebGL pages, combine with the threejs-r3f-3d-web skill's verification steps.

## Evidence Format

- Save screenshots inside the workspace and reference paths in the final report.
- One line per breakpoint: `1440px: pass — hero, grid, footer render; no overflow`.
