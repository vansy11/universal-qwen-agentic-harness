let input = '';
process.stdin.on('data', (chunk) => input += chunk);
process.stdin.on('end', () => {
    try {
        const { execSync } = require('child_process');
        const payload = JSON.parse(input);
        const filePath = payload.tool_input?.file_path || '';
        if (!filePath) { console.log(JSON.stringify({})); return; }
        let cmd = null;
        if (/\.(ts|tsx)$/.test(filePath)) cmd = 'npx tsc --noEmit "' + filePath + '"';
        else if (/\.py$/.test(filePath)) cmd = 'python -m py_compile "' + filePath + '"';
        if (cmd) {
            try { execSync(cmd, { timeout: 15000, stdio: 'pipe' }); console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: "Lint passed: " + filePath } })); }
            catch(e) { console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: "LINT ERRORS in " + filePath + ":\n" + e.stderr.toString().slice(0,500) + "\nFix these errors immediately before proceeding." } })); }
        } else { console.log(JSON.stringify({})); }
    } catch(e) { console.log(JSON.stringify({})); }
});