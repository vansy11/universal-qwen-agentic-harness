let input = '';
process.stdin.on('data', (chunk) => input += chunk);
process.stdin.on('end', () => {
    try {
        const payload = JSON.parse(input);
        const cmd = payload.tool_input?.command || '';
        const dangerous = [/rm\s+-rf\s+\//, /rmdir\s+\/s/, /mkfs/, /dd\s+if=/, /curl.*\|\s*sh/, /git\s+push\s+--force/, />\s*\/dev\/sd/];
        let blocked = false;
        for (const pattern of dangerous) { if (pattern.test(cmd)) { blocked = true; break; } }
        console.log(JSON.stringify(blocked ? { hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: "Blocked: Dangerous command detected." } } : { hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "allow" } }));
    } catch(e) { console.log(JSON.stringify({})); }
});