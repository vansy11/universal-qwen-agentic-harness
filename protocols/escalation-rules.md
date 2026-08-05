# Escalation Rules

## Immediate (Block + Alert Human)
- Trading risk checklist failure
- Security vulnerability CVSS >= 7.0
- Token budget exceeded >120%
- Agent handoff loop >3 cycles between same agents
- Unknown error pattern not in failure database

## Advisory (Continue + Warning)
- Non-critical code review findings
- Test coverage below threshold
- Style guide violations
- Performance regression <10%

## Informational (Log Only)
- Successful task completion
- Routine handoffs
- Memory compaction events
- Skill health check passes

## Escalation Format
Use JSON structure defined in protocols/handoff-schema.json with status="escalated".
