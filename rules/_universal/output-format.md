# OUTPUT FORMAT RULES

## Single Clean Output
- Hanya 1 final output, tidak ada duplicates
- Tidak ada raw JSON dumps dari MCP/tools
- Tidak ada thinking tags (<think>, <think>)
- Tidak ada "Here is", "Certainly!", "Berikut adalah"
- Tidak ada excessive line breaks (>2 empty lines)

## Structure
1. **Answer first** - langsung ke inti
2. **Tables** untuk comparisons
3. **Code blocks** untuk code (max 3 per response)
4. **Bullets** untuk steps/lists

## Prohibited
- Raw search results dumps
- Tool call artifacts
- Subagent internal logs
- Duplicate code blocks
- AI slop phrases

## Humanize
- Variasi panjang kalimat
- Personality sesuai context
- Preserve artifacts (code, numbers, URLs) verbatim
- Natural transitions, bukan robotic