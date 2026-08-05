let input = '';
process.stdin.on('data', (chunk) => input += chunk);
process.stdin.on('end', () => {
    try {
        const fs = require('fs');
        const path = require('path');
        const payload = JSON.parse(input);
        const prompt = (payload.prompt || '').toLowerCase();
        const AGENTS_DIR = 'C:/Users/vansy/.qwen/agents';
        const SKILLS_DIR = 'C:/Users/vansy/.qwen/skills';
        const agents = [];
        try { fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md')).forEach(f => agents.push(f.replace('.md', ''))); } catch(e) {}
        const skills = [];
        try { fs.readdirSync(SKILLS_DIR, { withFileTypes: true }).filter(d => d.isDirectory()).forEach(d => { if (fs.existsSync(path.join(SKILLS_DIR, d.name, 'SKILL.md'))) skills.push(d.name); }); } catch(e) {}
        const routes = [
            { kw: ['trading','strategy','backtest','alpha','signal','futures','position','pnl','drawdown'], agent: 'quant-strategist', skill: 'quant-algo-trading' },
            { kw: ['risk','exposure','leverage','margin','stop-loss'], agent: 'risk-manager', skill: 'finance-analysis' },
            { kw: ['market-data','feed','tick','ohlcv','websocket'], agent: 'market-data-engineer', skill: 'quant-algo-trading' },
            { kw: ['portfolio','return','volatility','sharpe','correlation'], agent: 'finance-analyst', skill: 'finance-analysis' },
            { kw: ['api','rest','graphql','endpoint','backend','server','express','fastapi'], agent: 'backend-engineer', skill: 'backend-api-design' },
            { kw: ['react','vue','frontend','component','tailwind','css','ui ','page','website'], agent: 'frontend-engineer', skill: 'frontend-react-tailwind' },
            { kw: ['fullstack','full-stack','end-to-end','e2e'], agent: 'fullstack-orchestrator', skill: 'fullstack-orchestration' },
            { kw: ['database','schema','erd','sql','postgres','mysql','migration','table'], agent: 'database-architect', skill: 'database-ssd-design' },
            { kw: ['docker','container','compose','kubernetes','deploy','ci/cd','pipeline'], agent: 'devops-engineer', skill: 'docker-deployment' },
            { kw: ['github','action','workflow','pr ','pull request'], agent: 'devops-engineer', skill: 'github-workflow' },
            { kw: ['security','vuln','pentest','owasp','xss','sqli','cve','exploit'], agent: 'cybersecurity-analyst', skill: 'cybersecurity-pentest' },
            { kw: ['review','code quality','lint','clean code'], agent: 'code-reviewer', skill: 'code-review-security' },
            { kw: ['error','bug','fix','debug','crash','exception','traceback'], agent: 'refactor-engineer', skill: 'error-resolution-loop' },
            { kw: ['test','tdd','jest','pytest','spec','coverage','unit test'], agent: 'code-reviewer', skill: 'tdd-workflow' },
            { kw: ['network','dns','firewall','routing','ping','tcp','ssh'], agent: 'network-engineer', skill: 'network-diagnostics' },
            { kw: ['animation','gsap','framer','motion','transition'], agent: 'frontend-engineer', skill: 'ui-animation-gsap-framer' },
            { kw: ['design system','token','component library','figma'], agent: 'ui-ux-designer', skill: 'ui-ux-design-system' },
            { kw: ['doc','documentation','swagger','openapi','readme'], agent: 'backend-engineer', skill: 'api-doc-generator' },
            { kw: ['automate','script','cron','batch'], agent: 'execution-engineer', skill: 'workflow-automation' },
            { kw: ['research','investigate','deep dive','literature','survey'], agent: 'web-researcher', skill: 'web-research-deep' },
            { kw: ['news','trending','sentiment','social media','monitor'], agent: 'news-trending-scout', skill: 'news-trending-aggregator' },
            { kw: ['fact-check','verify','hallucination','claim','source'], agent: 'web-researcher', skill: 'fact-check-anti-hallucination' },
            { kw: ['humanize','rewrite','natural','anti-slop','tone'], agent: 'humanizer', skill: 'ai-humanizer-anti-slop' },
            { kw: ['memory','remember','context','recall','knowledge'], agent: 'memory-curator', skill: 'ai-memory-curator' },
            { kw: ['compact','compress','summarize context','token save'], agent: 'memory-curator', skill: 'strategic-compact' },
            { kw: ['evaluate','self-eval','quality check','assess'], agent: 'self-evaluator', skill: 'verification-loop' },
            { kw: ['orchestrate','coordinate','multi-agent','team'], agent: 'team-commander', skill: 'universal-execution-loop' },
            { kw: ['gate','approve','reject','quality gate'], agent: 'quality-gatekeeper', skill: 'verification-loop' },
            { kw: ['etl','pipeline','data warehouse','extract','transform','load'], agent: 'data-engineer', skill: 'etl-pipeline' },
            { kw: ['mobile','react native','flutter','ios','android','app'], agent: 'mobile-developer', skill: 'mobile-react-native' },
            { kw: ['cloud','aws','gcp','azure','terraform','pulumi','iac','infrastructure'], agent: 'cloud-architect', skill: 'cloud-infrastructure' },
            { kw: ['documentation','readme','changelog','guide','tutorial','docs'], agent: 'technical-writer', skill: 'technical-documentation' },
            { kw: ['performance','optimize','benchmark','profile','speed','latency','bundle size'], agent: 'refactor-engineer', skill: 'performance-optimization' },
            { kw: ['api test','contract test','load test','integration test','postman'], agent: 'code-reviewer', skill: 'api-testing' },
            { kw: ['monitoring','logging','metrics','alerting','grafana','prometheus','observability'], agent: 'devops-engineer', skill: 'monitoring-observability' },
            { kw: ['chart','dashboard','d3','plotly','recharts','visualization','graph'], agent: 'frontend-engineer', skill: 'data-visualization' },
            { kw: ['migration','legacy','refactor','upgrade','port','monolith','microservice'], agent: 'refactor-engineer', skill: 'migration-refactoring' },
            { kw: ['accessibility','wcag','a11y','screen reader','contrast','aria'], agent: 'frontend-engineer', skill: 'accessibility-audit' },
            { kw: ['seo','meta tag','structured data','core web vitals','sitemap','robots'], agent: 'frontend-engineer', skill: 'seo-optimization' },
            { kw: ['git','branch','rebase','merge conflict','cherry-pick','stash'], agent: 'devops-engineer', skill: 'git-workflow' },
        ];
        let matchedAgent = null, matchedSkill = null, matchScore = 0;
        for (const r of routes) { let score = 0; for (const kw of r.kw) { if (prompt.includes(kw)) score++; } if (score > matchScore) { matchScore = score; matchedAgent = r.agent; matchedSkill = r.skill; } }
        const heavySignals = ['build','create','make','design','implement','develop','deploy','generate'];
        if (!matchedAgent && heavySignals.some(s => prompt.includes(s))) { matchedAgent = 'fullstack-orchestrator'; matchedSkill = 'universal-execution-loop'; }
        const agentList = agents.map(a => '- ' + a).join('\n');
        const skillList = skills.map(s => '- ' + s).join('\n');
        let ctx = '## AVAILABLE CAPABILITIES\n### Agents (' + agents.length + '):\n' + agentList + '\n\n### Skills (' + skills.length + '):\n' + skillList + '\n\n### MCP Tools: tavily_search, exa_search, brave_web_search, fetch, playwright, context7, filesystem, memory, sequential-thinking\n\n';
        if (matchedAgent || matchedSkill) { ctx += '## AUTO-ROUTING RESULT\n'; if (matchedAgent) ctx += 'Recommended Agent: ' + matchedAgent + '\n'; if (matchedSkill) ctx += 'Recommended Skill: ' + matchedSkill + '\n'; ctx += 'Keywords matched: ' + matchScore + '\nINSTRUCTION: Read C:/Users/vansy/.qwen/agents/' + (matchedAgent||'') + '.md and C:/Users/vansy/.qwen/skills/' + (matchedSkill||'') + '/SKILL.md for detailed protocols. Follow them strictly. Delegate via Task tool for complex multi-step tasks.\n\n'; }
        ctx += '## SYSTEM RULES\n1. ZERO FLUFF: No filler phrases. Start immediately with substance.\n2. CODE > TEXT unless explanation requested.\n3. CHAIN-OF-THOUGHT: Use <thinking>/<plan>/<execution> for complex tasks.\n4. HANDOFF: Use JSON format from C:/Users/vansy/.qwen/protocols/handoff-schema.json.\n5. VERIFY: Validate against requirements before responding.\n6. TRADING SAFETY: Never execute trades without explicit user confirmation. Check C:/Users/vansy/.qwen/memories/_global/trading-risk-tolerance.md before any trading operation.\n';
        console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: ctx } }));
    } catch(e) { console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: 'Router error: ' + e.message } })); }
});