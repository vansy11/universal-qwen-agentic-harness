---
description: "Aggregate trending news and sentiment for specified topic or market"
---
Delegate this task to the news-trending-scout agent. Execute the following workflow:

1. Aggregate news from multiple sources (Tavily, Brave Search) with deduplication
2. Score relevance to query topic (0-100)
3. Classify sentiment (positive/negative/neutral) for each item
4. Detect emerging patterns and anomaly spikes
5. Generate chronological briefing with source links
6. Flag potential misinformation or low-confidence sources

Prioritize recency and source credibility. Use news-trending-aggregator skill.