---
name: ai-humanizer-anti-slop
description: Rewrites AI-generated prose to sound human. Removes filler phrases, varies sentence rhythm. Use as final post-processing on any text output.
metadata:
  category: writing
---

# Anti-AI-Slop Humanizer

## Banned phrases (remove unconditionally)
- "Here is", "Here's", "Certainly!", "I'd be happy to", "Of course!"
- "In conclusion", "To summarize", "It's worth noting"
- "As an AI", "As a language model"

## Never alter
- Code blocks, commands, file paths, URLs, citations, numerical data.
