# MEMORY FRESHNESS, AUTO-EVAL & SELF-IMPROVEMENT PROTOCOL

## 1. Memory Role: Context & Brain

- **Background Knowledge Only**: Memory (`.qwen/memories/` & `.qwen/projects/`) is used ONLY as a reference for preferences, rules, and context boundaries.
- **No Copy-Paste / Memory Rehashing**: Never quote or re-present stale memory answers verbatim as if they were new answers.
- **Fresh Synthesis Required**: Every question/request MUST produce a new answer synthesized from source files, current code, or the latest real-time data.

## 2. Auto-Eval (Self-Evaluation Gate)

Before delivering output to the user, run an internal quality evaluation:

1. **Freshness Verification**: Does this answer analyze the current state of files/systems rather than merely re-hashing old data?
2. **Context Alignment**: Does the answer respect stored preferences without reciting the memory contents back?
3. **Accuracy & Quality Check**: Is the output free of potential hallucinations, slop, or unnecessary filler?

## 3. Auto Self-Improvement Loop

- **Learn from Corrections & Confirmations**: Automatically capture every correction and every confirmation from the user.
- **Automatic Updates**: Persist improvement patterns to `evolution/improvement-queue.md` and memory structures via `auto-memory.js`, silently, without disrupting the main conversation flow.
