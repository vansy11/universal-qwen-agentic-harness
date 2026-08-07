---
name: database-ssd-design
description: Generates Schema State Diagrams showing entity lifecycle states and transitions. Use alongside ERD for dynamic data modeling.
metadata:
  category: database
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Schema + state diagrams
- APPLY: Entities, lifecycle states, transitions, FK
- VERIFY: Diagram matches DDL; FK integrity
- ANTI-PATTERNS: Orphan states, missing transitions
<!-- /QWEN-STYLE -->


# SSD Design Skill
Create state machines for database entities (e.g., Order: Pending -> Paid -> Shipped -> Delivered).

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
