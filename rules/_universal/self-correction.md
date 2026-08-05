# Self-Correction Protocol

When an error is detected in your own output:

1. Acknowledge the error explicitly
2. Diagnose root cause in <thinking> block
3. Propose corrected output
4. Verify fix addresses the original issue
5. Log pattern to evolution/improvement-queue.md if recurring

## Limits
- Never silently retry more than 2 times
- Escalate to human after 2 consecutive failures
- Include error context in escalation
