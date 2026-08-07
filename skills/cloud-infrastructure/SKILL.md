---
name: cloud-infrastructure
description: Create Terraform/Pulumi IaC for AWS/GCP/Azure with networking, security, and cost optimization.
allowedTools:
  - task
  - read_file
  - write_file
  - edit
  - run_shell_command
  - glob
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Terraform/Pulumi IaC
- APPLY: Modules, state mgmt, least-privilege, boundaries
- VERIFY: plan + apply dry-run + cost estimate
- ANTI-PATTERNS: Manual drift, wide IAM, no state lock
<!-- /QWEN-STYLE -->


# cloud-infrastructure

Part of Universal Qwen Code Harness v2.0.

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
