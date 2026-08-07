let input = '';
process.stdin.on('data', (chunk) => input += chunk);
process.stdin.on('end', () => {
    try {
        const payload = JSON.parse(input);
        const text = JSON.stringify(payload);

        // === 1. AI SLOP CHECK ===
        const slopPhrases = [
            'Here is', "Here's", 'Certainly!', "I'd be happy to",
            'I would be happy to', 'In conclusion', 'To summarize',
            'As an AI', 'As a language model', "It's worth noting",
            'Of course!', 'Absolutely!', 'Great question',
            'Sure thing', 'No problem', 'Happy to help',
            'Let me explain', 'Allow me to', 'Based on my analysis'
        ];

        // === 2. EMOJI/SYMBOL CHECK ===
        const emojiPattern = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}🔧🚫🛠️◆︎∴︎➜▄▀█╔╗╚╝║═┌┐└┘│─├┤┬┴┼]/gu;

        // === 3. HALLUCINATION RISK CHECK ===
        const hallucinationSignals = [
            { pattern: /\baccording to (a |the )?(study|research|report|source)\b/i, reason: 'Vague citation' },
            { pattern: /\bstudies show\b/i, reason: 'Generic "studies show"' },
            { pattern: /\bexperts say\b/i, reason: 'Anonymous expert appeal' },
            { pattern: /\bstatistics show\b/i, reason: 'Statistics without source' }
        ];

        let issues = [];

        for (const phrase of slopPhrases) {
            if (text.includes(phrase)) issues.push('Slop: "' + phrase + '"');
        }

        const emojiMatches = text.match(emojiPattern);
        if (emojiMatches && emojiMatches.length > 0) {
            issues.push('Emojis/symbols detected');
        }

        for (const sig of hallucinationSignals) {
            if (sig.pattern.test(text)) issues.push('Hallucination risk: ' + sig.reason);
        }

        // === 4. RAW MCP OUTPUT CHECK ===
        const rawMcpPatterns = [
            { pattern: /"search_results":\s*\[/i, reason: 'Raw Tavily/Exa JSON' },
            { pattern: /"Detailed Results":/i, reason: 'Raw MCP dump' },
            { pattern: /"Title:":.*"URL:":/is, reason: 'Raw search item dump' },
            { pattern: /Error during fetch for|API Error: \d+/i, reason: 'Error log exposed' },
            { pattern: /<html|<!DOCTYPE/i, reason: 'Raw HTML tags' }
        ];

        for (const sig of rawMcpPatterns) {
            if (sig.pattern.test(text)) issues.push('Messy output: ' + sig.reason);
        }

        // === 5. RAW TOOL CALL JSON DUMP CHECK (FIXED PLACEMENT) ===
        const rawToolCallPatterns = [
            { pattern: /"name":\s*"agent",\s*"arguments":\s*{/i, reason: 'Raw Task tool JSON dumped' },
            { pattern: /"subagent_type":\s*"/i, reason: 'Raw subagent JSON dumped' },
            { pattern: /"name":\s*"(tavily_search|brave_web_search|web_search)",\s*"arguments":\s*{/i, reason: 'Raw MCP search JSON dumped' }
        ];

        for (const sig of rawToolCallPatterns) {
            if (sig.pattern.test(text)) issues.push('Messy output: ' + sig.reason);
        }

        // === DECISION MAKING ===
        if (issues.length > 0) {
            console.log(JSON.stringify({
                decision: "block",
                reason: "Quality gate rejected:\n- " + issues.join('\n- ') + "\n\nRewrite rules:\n1. Remove filler phrases/emojis\n2. Cite specific sources\n3. Say 'I cannot verify' if uncertain\n4. SYNTHESIZE raw data into clean Markdown. Never dump raw JSON/HTML."
            }));
        } else {
            console.log(JSON.stringify({ decision: "allow" }));
        }
    } catch(e) {
        console.log(JSON.stringify({ decision: "allow" }));
    }
});