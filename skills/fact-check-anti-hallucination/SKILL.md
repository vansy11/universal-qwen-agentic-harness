---
name: fact-check-anti-hallucination
description: Prevents AI hallucination on unknown acronyms, links, or facts. Forces the AI to use Web Search (Tavily/Exa) or explicitly admit ignorance instead of guessing. Use when user asks about specific terms, videos, or niche concepts.
metadata:
  category: ai-core
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: Claim verification
- APPLY: Source each claim; flag unverified
- VERIFY: Every claim sourced or flagged
- ANTI-PATTERNS: Unverified assertions
<!-- /QWEN-STYLE -->


# Anti-Hallucination & Fact-Checking Protocol

As an AI, your tendency to guess unknown concepts is a critical flaw. You MUST follow these rules to prevent hallucinations:

## 1. The "No Guessing" Rule
If the user mentions a specific acronym (e.g., IVB), a niche strategy, or a reference link (e.g., YouTube) and you are NOT 100% certain of its exact meaning from your training data:
- **DO NOT GUESS.** Do not invent logical-sounding definitions (e.g., do not guess "Indicator Value Block").
- **DO NOT SUMMARIZE BLINDLY.** If you cannot read a video or link, state clearly: "I cannot access the content of this link directly."

## 2. The Verification Protocol
If you encounter an unknown term or link:
1. **Invoke Web Research:** Use the web-researcher agent or Tavily/Exa MCP to search the web for the exact term (e.g., "IVB" trading strategy meaning).
2. **Analyze Transcripts:** If the user provides a YouTube link, ask the user for the transcript, or use Fetch MCP to see if a transcript is available.
3. **Admit Ignorance:** If web search yields no clear results, explicitly tell the user: "I cannot find a verified definition for this term. Could you explain what it means so I can save it to my memory?"

## 3. Creating New Skills from User Corrections
If the user corrects your hallucination :
1. Acknowledge the mistake immediately.
2. Invoke the memory-curator agent to save this correction to long-term memory.
3. Create a new SKILL.md file in .qwen/skills/ documenting this new definition so you never guess it wrong again.

## FILE WRITE PROTOCOL (MANDATORY)
Qwen Code blocks write_file if the target file was never read in the current session.
This is a platform safety guard, not optional.

BEFORE every write_file or edit_file call:
1. ALWAYS call read_file on the target path FIRST
2. If file doesn't exist → read fails silently → that's OK, continue to write
3. If file exists → content loaded → now you can safely overwrite/append

NEVER skip the read step. This applies to:
- New files (read first even if doesn't exist)
- Existing files (read to understand current state)
- Config files, code files, documentation, reports

Example correct sequence:
read_file("target/path") ← MUST do this first
[process/generate content]
write_file("target/path", content) ← Now this works
