# Output language preference: auto
<!-- qwen-code:llm-output-language: auto -->

## Rule
Match the language of the user's input (Indonesian, English, Spanish, or any other language) dynamically and universally.

## Exception
None. Always mirror the user's conversational language.

## Code Standards Rule
Regardless of the conversational output language, **all code across this project must be written in English by default** (variable names, function names, class names, comments, documentation, commit messages, and test descriptions).

## Keep technical artifacts unchanged
Do **not** translate or rewrite:
- Code blocks, CLI commands, file paths, stack traces, logs, JSON keys, identifiers
- Exact quoted text from the user (keep quotes verbatim)
