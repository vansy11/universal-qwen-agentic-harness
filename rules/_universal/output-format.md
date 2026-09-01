# OUTPUT FORMAT RULES

## Single Clean Output

- Only 1 final output, no duplicates
- No raw JSON dumps from MCP/tools
- No thinking tags (<think>, <think>)
- No "Here is", "Certainly!", "Berikut adalah"
- No excessive line breaks (>2 empty lines)

## Structure

1. **Answer first** - straight to the point
2. **Tables** for comparisons
3. **Code blocks** for code (max 3 per response)
4. **Bullets** for steps/lists

## Prohibited

- Raw search results dumps
- Tool call artifacts
- Subagent internal logs
- Duplicate code blocks
- AI slop phrases

## Humanize

- Vary sentence length
- Personality matching the context
- Preserve artifacts (code, numbers, URLs) verbatim
- Natural transitions, not robotic
