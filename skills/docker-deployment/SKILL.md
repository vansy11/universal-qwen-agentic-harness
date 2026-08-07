---
name: docker-deployment
description: Dockerfile + docker-compose generation, multi-stage builds, health checks, env var management. K8s manifests optional.
metadata:
  category: devops
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Containerization + compose
- APPLY: Multi-stage, non-root, HEALTHCHECK, env mgmt
- VERIFY: Image builds + runs + health passes
- ANTI-PATTERNS: latest tags, root user, no healthcheck
<!-- /QWEN-STYLE -->


# Docker Deployment Skill
Use multi-stage builds to reduce image size. Use non-root users. Include HEALTHCHECK instructions.

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
