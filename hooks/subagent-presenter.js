const QWEN_HOME = require('path').resolve(__dirname, '..').replace(/\\/g, '/');
let input = '';
process.stdin.on('data', (c) => input += c);
process.stdin.on('end', () => {
    let ctx = '';

    ctx += '## CRITICAL: NO THINKING TAGS ALLOWED\n';
    ctx += 'You are FORBIDDEN from using <thinking> tags in your output. ';
    ctx += 'Do your thinking internally, then output ONLY the final clean response.\n\n';

    ctx += '## OUTPUT FORMAT (STRICT)\n';
    ctx += 'Your entire output must be:\n';
    ctx += '1. Start with ### header\n';
    ctx += '2. Bullet points with **bold** key terms\n';
    ctx += '3. End with --- and Sources: line\n';
    ctx += '4. NOTHING ELSE — no thinking tags, no raw dumps, no trailing prompts\n\n';

    ctx += '## BANNED PATTERNS (will cause rejection)\n';
    ctx += '- <thinking>...</thinking>\n';
    ctx += '- "Detailed Results:"\n';
    ctx += '- "Title:", "URL:", "Content:"\n';
    ctx += '- Long separator lines (more than 3 dashes)\n';
    ctx += '- Trailing text like "* next task"\n\n';

    ctx += '## CORRECT OUTPUT EXAMPLE\n';
    ctx += '### Topic Name\n';
    ctx += '- **Key point 1** — Brief fact (Source)\n';
    ctx += '- **Key point 2** — Brief fact (Source)\n';
    ctx += '\n---\n';
    ctx += 'Sources: [Name1], [Name2]\n\n';

    ctx += 'That is ALL. No thinking tags. No raw dumps. No trailing prompts. STOP after Sources line.\n';

    console.log(JSON.stringify({
        hookSpecificOutput: { hookEventName: 'SubagentStart', additionalContext: ctx }
    }));
});