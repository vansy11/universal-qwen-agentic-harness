---
name: ms-office-engine
description: Reads and writes Microsoft Office files (.docx, .xlsx, .pptx) locally without hallucination.
metadata:
  category: utility
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: MS Office Document Processing
- APPLY: Use `core/office-engine.py` via `run_shell_command` to read/write Office files.
- VERIFY: Ensure file paths have correct extensions (.docx, .xlsx, .pptx).
- ANTI-PATTERNS: Using `read_file` on Office files, hallucinating document contents, failing to save properly.
<!-- /QWEN-STYLE -->

# MS Office Engine Skill
When the user asks you to read or write a Word, Excel, or PowerPoint file:

## To READ an Office File:
1. DO NOT use `read_file`. It will fail.
2. Execute via `run_shell_command`:
   `echo {"function": "read", "file_path": "C:/path/to/file.docx"} | python core/office-engine.py`

## To WRITE an Office File:
1. Gather the text/content from your research or chat.
2. Execute via `run_shell_command`:
   `echo {"function": "write", "file_path": "C:/path/to/output.docx", "data": "This is the content for the Word doc."} | python core/office-engine.py`
3. For PowerPoint, split slides in the data string using "---".

## FILE WRITE PROTOCOL (MANDATORY)
BEFORE every write_file or edit_file call:
1. ALWAYS call read_file on the target path FIRST
