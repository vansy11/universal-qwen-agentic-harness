const QWEN_HOME = require('path').resolve(__dirname, '..').replace(/\\/g, '/');
let input = '';
process.stdin.on('data', (chunk) => input += chunk);
process.stdin.on('end', () => {
    try {
        const { execSync } = require('child_process');
        const payload = JSON.parse(input);
        const filePath = payload.tool_input?.file_path || '';
        if (!filePath) { console.log(JSON.stringify({})); return; }
        let cmd = null;
        if (/\.(ts|tsx|js|jsx|json|css|scss|md)$/.test(filePath)) cmd = 'npx prettier --write "' + filePath + '"';
        else if (/\.py$/.test(filePath)) cmd = 'python -m black "' + filePath + '"';
        if (cmd) {
            try { execSync(cmd, { timeout: 10000, stdio: 'pipe' }); console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: "Auto-formatted: " + filePath } })); }
            catch(e) { console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: "Format skipped for " + filePath + ": " + e.message.split('\n')[0] } })); }
        } else { console.log(JSON.stringify({})); }
    } catch(e) { console.log(JSON.stringify({})); }
});