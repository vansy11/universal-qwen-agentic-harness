# Universal Coding Standards (Language-Agnostic Fallback)

Applies to ALL programming languages, especially those without a dedicated rule file (PHP, Go, Rust, Java, C#, Ruby, etc.).

## Structure & Organization

- One class/module per file. File name matches the primary class/module name.
- Group imports: standard library → third-party → local/project. Alphabetical within each group.
- Max function length: 50 lines. Extract if longer.
- Max file length: 500 lines. Split if larger.

## Naming Conventions

- **Variables/Functions:** camelCase (JS/TS/Go), snake_case (Python/Ruby), PascalCase (C#/Java for methods)
- **Classes/Types:** PascalCase universally
- **Constants:** UPPER_SNAKE_CASE
- **Booleans:** Prefix with is/has/can/should (e.g., `isValid`, `hasPermission`)
- No abbreviations unless universally understood (id, url, api, http)

## Error Handling

- All external calls (network, file I/O, database) MUST have error handling
- Never swallow errors silently — log or re-throw
- Use specific exception types, not generic catch-all
- Return early on error conditions (guard clauses) over deep nesting

## Input Validation

- Validate ALL external inputs at system boundaries (user input, API params, env vars)
- Sanitize strings before use in queries/commands
- Validate numeric ranges and types
- Reject invalid input explicitly — never coerce silently

## Security

- NEVER hardcode secrets, API keys, tokens, or passwords
- Use environment variables or secret managers
- Parameterized queries only — no string concatenation in SQL/commands
- Validate and sanitize all file paths to prevent traversal attacks

## Testing

- Public functions must have corresponding tests
- Test names describe the scenario: `test_should_return_error_when_input_is_empty`
- Cover: happy path, edge case, error case

## Documentation

- Public APIs: document parameters, return types, and error cases
- Complex algorithms: document the approach and constraints
- No redundant comments that restate the code
