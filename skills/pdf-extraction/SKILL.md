---
name: pdf-extraction
description: Extracts and reads text content from local PDF files for analysis, summarization, or data extraction.
metadata:
  category: utility
---

## EXECUTION STANDARD (QWEN STYLE)
Focus: PDF Text Extraction & Contextualization
- APPLY: Use absolute path to `C:/Users/vansy/.qwen/core/pdf-reader.py` via `run_shell_command` to read local PDFs.
- VERIFY: Ensure the file path is absolute and correctly formatted for the OS.
- ANTI-PATTERNS: Using `read_file` on .pdf extensions, hallucinating PDF content, reading binary data directly.
<!-- /QWEN-STYLE -->

# PDF Extraction Skill
When the user asks you to read, summarize, or analyze a local PDF file:
1. DO NOT use the `read_file` tool. It will fail because PDFs are binary.
2. You MUST use `run_shell_command` to execute Python with the ABSOLUTE path:
   `python C:/Users/vansy/.qwen/core/pdf-reader.py`
3. Pass the JSON input via stdin: 
   `echo {"file_path": "C:/Users/vansy/Downloads/document.pdf"} | python C:/Users/vansy/.qwen/core/pdf-reader.py`
   *(Note: use proper JSON string escaping for Windows cmd)*
4. Read the JSON stdout response containing the extracted text.
5. If the text is truncated, inform the user and ask if they want to focus on a specific section.

## FILE WRITE PROTOCOL (MANDATORY)
BEFORE every write_file or edit_file call:
1. ALWAYS call read_file on the target path FIRST
