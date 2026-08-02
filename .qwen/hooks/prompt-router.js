let input = '';
process.stdin.on('data', (chunk) => input += chunk);
process.stdin.on('end', () => {
    try {
        const payload = JSON.parse(input);
        const prompt = payload.prompt || '';
        
        const heavySignals = ['build','create','make','design','implement','deploy','fullstack','website','application','database','api','architecture'];
        const lightSignals = ['what','why','explain','define','summarize','who','when','where'];
        
        let heavyScore = 0, lightScore = 0;
        heavySignals.forEach(s => { if (prompt.toLowerCase().includes(s)) heavyScore++; });
        lightSignals.forEach(s => { if (prompt.toLowerCase().includes(s)) lightScore++; });
        
        const complexity = (heavyScore >= 2 && heavyScore > lightScore) ? "heavy" : "light";
        
        let agents = [];
        if (prompt.match(/database|erd|schema|sql/i)) agents.push("database-architect");
        if (prompt.match(/backend|api|server|endpoint/i)) agents.push("backend-engineer");
        if (prompt.match(/frontend|ui|website|page|react|vue/i)) agents.push("frontend-engineer");
        if (prompt.match(/animat|transition|motion|gsap/i)) agents.push("animation-engineer");
        if (prompt.match(/security|vuln|pentest|owasp/i)) agents.push("cybersecurity-analyst");
        
        if (complexity === "heavy" && agents.length === 0) agents.push("fullstack-orchestrator");
        
        // Suntikkan Aturan Anti-AI Slop SEBELUM AI menjawab untuk mencegah double output
        const antiSlopRule = "CRITICAL OUTPUT RULE: Do NOT use AI filler phrases. Do not start with 'Here is', 'Certainly', 'I would be happy to', or 'Sure!'. Be direct, professional, and human-like from the very first word.";
        
        const additionalContext = "[ROUTER ANALYSIS]\nComplexity: " + complexity + "\nTarget agents: " + agents.join(', ') + "\n@if heavy: Use Task tool to delegate. context-builder runs FIRST, humanizer runs LAST.\n@if light: Answer directly.\n\n" + antiSlopRule;
        
        const response = { hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext } };
        console.log(JSON.stringify(response));
    } catch(e) {
        console.log(JSON.stringify({}));
    }
});