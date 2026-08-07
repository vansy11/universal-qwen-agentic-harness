---
name: network-diagnostics
description: Network troubleshooting: DNS resolution, port connectivity, latency tests, traceroute, API endpoint health checks.
metadata:
  category: network
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Connectivity troubleshooting
- APPLY: Layered OSI checks, capture + trace
- VERIFY: Fault isolated + verified fix
- ANTI-PATTERNS: Random config changes
<!-- /QWEN-STYLE -->


# Network Diagnostics Skill
Use 
slookup, ping, 	elnet (or Test-NetConnection in PowerShell), curl -I. Provide structured latency and status tables.

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
