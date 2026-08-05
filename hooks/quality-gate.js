let input = '';
process.stdin.on('data', (chunk) => input += chunk);
process.stdin.on('end', () => {
    try {
        const payload = JSON.parse(input);
        const text = JSON.stringify(payload);
        const slopPhrases = ['Here is', "Here's", 'Certainly!', "I'd be happy to", 'I would be happy to', 'In conclusion', 'As an AI'];
        let needsHumanize = false;
        for (const phrase of slopPhrases) { if (text.includes(phrase)) { needsHumanize = true; break; } }
        console.log(JSON.stringify(needsHumanize ? { decision: "block", reason: "AI-slop detected. Rewrite response to be direct and professional. Remove filler phrases." } : { decision: "allow" }));
    } catch(e) { console.log(JSON.stringify({ decision: "allow" })); }
});