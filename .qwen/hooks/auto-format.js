let input = '';
process.stdin.on('data', (chunk) => input += chunk);
process.stdin.on('end', () => {
    try {
        const payload = JSON.parse(input);
        const toolName = payload.tool_name;
        const filePath = payload.tool_input?.file_path || '';
        
        // Jika AI baru saja menulis/mengedit file kode
        if (toolName === 'write_file' || toolName === 'edit_file') {
            if (filePath.endsWith('.ts') || filePath.endsWith('.js') || filePath.endsWith('.py')) {
                const response = {
                    hookSpecificOutput: {
                        hookEventName: "PostToolUse",
                        additionalContext: "FORMATTING REQUIRED: You just wrote/edited a code file. Before reporting completion, you MUST run the project's code formatter (e.g., 
px prettier --write " + filePath + " for JS/TS or lack " + filePath + " for Python) to ensure consistent styling and indentation."
                    }
                };
                console.log(JSON.stringify(response));
            } else {
                console.log(JSON.stringify({}));
            }
        } else {
            console.log(JSON.stringify({}));
        }
    } catch(e) {
        console.log(JSON.stringify({}));
    }
});