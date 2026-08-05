let input = '';
process.stdin.on('data', (chunk) => input += chunk);
process.stdin.on('end', () => {
    try {
        const payload = JSON.parse(input);
        if (payload.transcript && payload.transcript.length > 4) {
            console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: "Stop", additionalContext: "SYSTEM INSTRUCTION: Before ending this session, analyze the conversation. Did you make mistakes the user corrected? Did you learn a new preference? If yes, write a 1-sentence summary to memory using memory-curator agent. If no notable patterns, do nothing." } }));
        } else { console.log(JSON.stringify({ decision: "allow" })); }
    } catch(e) { console.log(JSON.stringify({ decision: "allow" })); }
});