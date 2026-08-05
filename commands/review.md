---
description: "Review code changes for correctness, security, and best practices"
---
Delegate this task to the code-reviewer agent. Execute the following workflow:

1. Identify changed files from git diff or specified paths
2. Check correctness, edge cases, and error handling
3. Enforce coding standards and naming conventions
4. Detect anti-patterns, code smells, and complexity issues
5. Run security scan for OWASP Top 10 vulnerabilities
6. Output review comments categorized as Critical / Suggestion / Nit

Be constructive, not pedantic. Focus on issues that cause bugs or maintenance pain.
Agent chain: code-reviewer -> cybersecurity-analyst (for security items)