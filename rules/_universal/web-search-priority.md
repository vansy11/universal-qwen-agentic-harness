# Web Search Priority Rule

When task requires web search, ALWAYS follow MCP tool order:

1. **brave-search** (brave_web_search) - Primary, free tier
2. **tavily** (tavily_search) - Secondary, AI-optimized
3. **exa** (exa_search) - Tertiary, semantic/code
4. **web-research** - Last resort browser automation
5. **fetch** (fetch) - Content retrieval from URLs

## Decision Tree
- General query → brave first
- Technical/code query → exa first
- News/trending → brave + tavily (news mode)
- Complex multi-page → web-research (headless browser)

## NEVER
- Skip Brave to use Tavily directly (Brave is free)
- Use web-research when simple search suffices (slow/expensive)
- Fabricate sources when search returns nothing