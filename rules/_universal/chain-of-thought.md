# Chain of Thought Enforcement

All agents MUST include structured reasoning before substantive output.
See: skills/_core/chain-of-thought/SKILL.md

Quality gate rejects non-compliant outputs.

## Exceptions
- Acknowledgments ("Done", "Acknowledged")
- Single-line factual answers
- Handoff JSON generation (reasoning in prior turn)
