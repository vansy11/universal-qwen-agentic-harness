---
name: backend-api-design
description: Designs RESTful/GraphQL API contracts with OpenAPI specs, request/response schemas, error codes, auth flows. Use before backend implementation.
metadata:
  category: backend
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: REST/GraphQL contract design
- APPLY: Resource naming, status codes, pagination, versioning, rate limits
- VERIFY: OpenAPI + request/response examples
- ANTI-PATTERNS: Verb-in-URL, 200-for-everything
<!-- /QWEN-STYLE -->


# API Design Skill
Output OpenAPI 3.0 specs. Include JWT/OAuth bearer auth definitions. Define standard error response schema.

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
