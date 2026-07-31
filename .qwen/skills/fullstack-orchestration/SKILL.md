---
name: fullstack-orchestration
description: Orchestrates end-to-end full-stack project delivery. Use when user requests a complete web app, website, or system requiring database + backend + frontend + animation.
metadata:
  category: orchestration
---

# Full-Stack Orchestration Skill

## Execution flow
1. Brief: Delegate to context-builder for requirements extraction.
2. Database: Delegate to database-architect -> produces ERD + schema.
3. Backend: Delegate to ackend-engineer with schema -> produces API.
4. Frontend: Delegate to rontend-engineer with API contract -> produces UI.
5. Animation: Delegate to nimation-engineer with frontend files -> adds motion.
6. Security: Delegate to cybersecurity-analyst (plan mode) for audit.
7. Polish: Delegate to humanizer for final prose cleanup.

## Handoff protocol
Each agent writes its output to predictable paths:
- db/schema.sql, docs/erd.mmd
- src/server/, docs/api-contract.md
- src/client/, docs/component-manifest.md
"@

# --- .qwen/skills/database-erd-generator/SKILL.md ---
 System.Collections.Hashtable["qwen-agentic-harness\.qwen\skills\database-erd-generator\SKILL.md"] = @"
---
name: database-erd-generator
description: Generates Entity-Relationship Diagrams in Mermaid syntax from natural language schema descriptions. Use when designing databases or modeling data.
metadata:
  category: database
---

# ERD Generator Skill

## Output format
 `mermaid
erDiagram
  USER ||--o{ ORDER : places
  USER {
    int id PK
    string email UK
  }
 `

## Rules
- Always include PK/FK/UK markers.
- Normalize to 3NF before diagramming.
- Save to docs/erd.mmd.
