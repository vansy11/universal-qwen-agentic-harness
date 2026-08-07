const QWEN_HOME = require('path').resolve(__dirname, '..').replace(/\\/g, '/');
let input = '';
process.stdin.on('data', (chunk) => input += chunk);
process.stdin.on('end', () => {
    try {
        const fs = require('fs');
        const path = require('path');
        const payload = JSON.parse(input);
        const transcript = payload.transcript || '';
        const QUEUE_FILE = QWEN_HOME + '/evolution/improvement-queue.json';
        const LOG_FILE = QWEN_HOME + '/evolution/improvement-log.jsonl';
        const REPORT_FILE = QWEN_HOME + '/evolution/latest-improvements.md';

        // Detect improvement signals
        const signals = [
            { pattern: /\b(no|bukan|salah|wrong|incorrect|not what i|that's not|seharusnya|should be)\b/i, type: 'correction', weight: 3 },
            { pattern: /\b(fix|perbaiki|repair|correct|koreksi)\b.*\b(your|previous|last|tadi)\b/i, type: 'fix_request', weight: 2 },
            { pattern: /\b(don't|jangan|stop|berhenti)\b.*\b(doing|making|using|pakai)\b/i, type: 'negative_feedback', weight: 3 },
            { pattern: /\b(hallucinat|fabricat|made up|ngarang|tidak benar|inaccurate)\b/i, type: 'hallucination', weight: 5 },
            { pattern: /\b(outdated|kadaluarsa|deprecated|usang)\b/i, type: 'stale_knowledge', weight: 4 },
            { pattern: /\b(too verbose|terlalu panjang|too short|kurang detail)\b/i, type: 'format_issue', weight: 2 }
        ];

        const detected = [];
        for (const line of transcript.split('\n')) {
            for (const sig of signals) {
                if (sig.pattern.test(line)) {
                    detected.push({ timestamp: new Date().toISOString(), type: sig.type, weight: sig.weight, excerpt: line.trim().slice(0, 200), status: 'processed' });
                }
            }
        }

        if (detected.length === 0) {
            console.log(JSON.stringify({}));
            return;
        }

        // Log to file
        for (const d of detected) {
            fs.appendFileSync(LOG_FILE, JSON.stringify(d) + '\n', 'utf8');
        }

        // Auto-categorize and generate inline context for AI
        const types = [...new Set(detected.map(d => d.type))];
        const highPriority = detected.filter(d => d.weight >= 4);
        
        let ctx = '## SELF-IMPROVEMENT SIGNALS DETECTED\n';
        ctx += 'The user provided corrective feedback during this session.\n';
        ctx += 'Types: ' + types.join(', ') + '\n';
        ctx += 'Count: ' + detected.length + ' signal(s)\n\n';
        
        ctx += '### Feedback excerpts:\n';
        for (const d of detected.slice(0, 3)) {
            ctx += '- [' + d.type + '] "' + d.excerpt + '"\n';
        }
        
        ctx += '\n### AUTO-ACTIONS TAKEN:\n';
        
        // Auto-action based on type
        if (types.includes('hallucination')) {
            ctx += '- Hallucination reported. Next response MUST cite specific sources or say "I cannot verify this".\n';
        }
        if (types.includes('correction') || types.includes('fix_request')) {
            ctx += '- User corrected output. Review and adjust approach. Do NOT repeat the same mistake.\n';
        }
        if (types.includes('negative_feedback')) {
            ctx += '- Negative feedback received. Change strategy immediately.\n';
        }
        if (types.includes('stale_knowledge')) {
            ctx += '- Outdated information flagged. Verify against current sources before responding.\n';
        }
        if (types.includes('format_issue')) {
            ctx += '- Format preference noted. Adjust output length and detail level.\n';
        }
        
        ctx += '\nINSTRUCTION: Apply these corrections NOW in your current response. Do not ask user to run any command.\n';

        // Save latest improvements for session-bootstrap to load next session
        fs.writeFileSync(REPORT_FILE, '# Latest Improvements\n' + new Date().toISOString() + '\n\n' + ctx, 'utf8');

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