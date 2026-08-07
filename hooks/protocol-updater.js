const QWEN_HOME = require('path').resolve(__dirname, '..').replace(/\\/g, '/');
let input = '';
process.stdin.on('data', (chunk) => input += chunk);
process.stdin.on('end', () => {
    try {
        const fs = require('fs');
        const path = require('path');
        const payload = JSON.parse(input);
        const transcript = payload.transcript || '';
        const AGENTS_DIR = QWEN_HOME + '/agents';
        const LOG_FILE = QWEN_HOME + '/evolution/protocol-updates.jsonl';

        // Detect corrections with specific actionable feedback
        const correctionPatterns = [
            { pattern: /\b(seharusnya|should be|must be|harus)\s+(.{10,100})/i, type: 'should_statement' },
            { pattern: /\b(jangan|don't|never|stop)\s+(.{10,100})/i, type: 'prohibition' },
            { pattern: /\b(selalu|always|every time)\s+(.{10,100})/i, type: 'mandatory_rule' },
            { pattern: /\b(format|style|output|response)\s+(should|must|harus|seharusnya)\s+(.{10,100})/i, type: 'format_rule' },
            { pattern: /\b(tambahkan|add|include|insert)\s+(.{10,100})/i, type: 'addition_request' },
            { pattern: /\b(hapus|remove|delete|eliminate)\s+(.{10,100})/i, type: 'removal_request' }
        ];

        const updates = [];
        const lines = transcript.split('\n');

        for (const line of lines) {
            for (const cp of correctionPatterns) {
                const match = line.match(cp.pattern);
                if (match) {
                    updates.push({
                        timestamp: new Date().toISOString(),
                        type: cp.type,
                        rule: match[0].trim().slice(0, 300),
                        source_line: line.trim().slice(0, 200)
                    });
                }
            }
        }

        if (updates.length === 0) {
            console.log(JSON.stringify({}));
            return;
        }

        // Log updates
        for (const u of updates) {
            fs.appendFileSync(LOG_FILE, JSON.stringify(u) + '\n', 'utf8');
        }

        // Generate protocol patch instructions for AI
        let ctx = '## PROTOCOL UPDATE SIGNALS\n';
        ctx += 'User provided ' + updates.length + ' actionable correction(s).\n\n';
        ctx += '### Corrections detected:\n';
        for (const u of updates.slice(0, 5)) {
            ctx += '- [' + u.type + '] "' + u.rule + '"\n';
        }
        ctx += '\n### INSTRUCTION:\n';
        ctx += 'Apply these corrections to your CURRENT response AND remember them for future interactions.\n';
        ctx += 'If a correction contradicts your agent protocol, note the discrepancy in your response.\n';
        ctx += 'Do NOT ask user to run commands. Apply immediately.\n';

        console.log(JSON.stringify({
            hookSpecificOutput: {
                hookEventName: 'Stop',
                additionalContext: ctx
            }
        }));
    } catch(e) {
        console.log(JSON.stringify({}));
    }
});