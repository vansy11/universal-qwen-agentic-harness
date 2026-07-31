let input = '';
process.stdin.on('data', (chunk) => input += chunk);
process.stdin.on('end', () => {
    try {
        const payload = JSON.parse(input);
        const cmd = payload.tool_input.command || '';
        const dangerous = ['rm -rf /', 'rmdir /s', 'mkfs', 'dd if=', 'curl.*| sh', 'git push --force'];
        
        let blocked = false;
        for (let pattern of dangerous) {
            if (new RegExp(pattern).test(cmd)) {
                blocked = true;
                break;
            }
        }
        
        const response = blocked ? 
            { hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: "Blocked: Dangerous command detected." } } :
            { hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "allow" } };
            
        console.log(JSON.stringify(response));
    } catch(e) {
        console.log(JSON.stringify({}));
    }
});