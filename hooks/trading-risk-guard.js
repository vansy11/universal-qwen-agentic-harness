let input = '';
process.stdin.on('data', c => input += c);
process.stdin.on('end', () => {
    try {
        const payload = JSON.parse(input);
        const code = payload.tool_input?.content || '';
        if (code.includes('live_trade') && !code.includes('paper_trading=true')) {
            console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: "Blocked: Live trading requires paper_trading=true flag." } }));
        } else { console.log(JSON.stringify({})); }
    } catch(e) { console.log(JSON.stringify({})); }
});