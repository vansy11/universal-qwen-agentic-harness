# Security Baseline (All Languages)

## Secrets Management
- NEVER hardcode API keys, passwords, tokens, or credentials
- Use environment variables or secret managers
- Scan all outputs for secret patterns before delivery

## Input Validation
- Validate all external inputs at system boundaries
- Sanitize user-provided strings before use in queries/commands
- Reject inputs exceeding expected length/format

## Dependencies
- Flag known vulnerable package versions
- Prefer pinned versions over ranges in production

## Trading-Specific
- Validate all numeric parameters have bounds checking
- Implement circuit breakers for abnormal behavior
- Log all trade decisions with full audit trail
- Never auto-execute trades without explicit human approval flag
