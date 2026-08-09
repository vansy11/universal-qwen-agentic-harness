const QWEN_HOME = require('path').resolve(__dirname, '..').replace(/\\/g, '/');
let input = '';
process.stdin.on('data', (chunk) => input += chunk);
process.stdin.on('end', () => {
    try {
        const fs = require('fs');
        const path = require('path');
        const payload = JSON.parse(input);
        const prompt = (payload.prompt || '').toLowerCase();
        const AGENTS_DIR = QWEN_HOME + '/agents';
        const SKILLS_DIR = QWEN_HOME + '/skills';
        const agents = [];
        try { fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md')).forEach(f => agents.push(f.replace('.md', ''))); } catch(e) {}
        const skills = [];
        try { fs.readdirSync(SKILLS_DIR, { withFileTypes: true }).filter(d => d.isDirectory()).forEach(d => { if (fs.existsSync(path.join(SKILLS_DIR, d.name, 'SKILL.md'))) skills.push(d.name); }); } catch(e) {}

        const hasUrl = /https?:\/\/[^\s]+|youtu\.be|youtube\.com|vimeo\.com/i.test(prompt);
        let matchedAgent = null, matchedSkill = null, matchScore = 0;

        if (hasUrl) {
            matchedAgent = 'web-researcher';
            matchedSkill = 'web-research-deep';
            matchScore = 999;
        } else {
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
                { kw: ['animation','gsap','framer','motion','transition','motion.dev'], agent: 'frontend-engineer', skill: 'ui-animation-gsap-framer' },
                { kw: ['design','ui ','ux','landing page','component','tailwind','css','website','frontend','dashboard'], agent: 'frontend-engineer', skill: 'ui-ux-pro-max' },
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
                { kw: ['video','youtube','youtu.be','watch','summarize this','analyze this link'], agent: 'web-researcher', skill: 'web-research-deep' },
            ];
            for (const r of routes) { let score = 0; for (const kw of r.kw) { if (prompt.includes(kw)) score++; } if (score > matchScore) { matchScore = score; matchedAgent = r.agent; matchedSkill = r.skill; } }
            const heavySignals = ['build','create','make','design','implement','develop','deploy','generate'];
            if (!matchedAgent && heavySignals.some(s => prompt.includes(s))) { matchedAgent = 'fullstack-orchestrator'; matchedSkill = 'universal-execution-loop'; }
        }

        let ctx = '## CAPABILITIES\nAgents: ' + agents.length + ' | Skills: ' + skills.length + '\n\n';
        
        if (matchedAgent || matchedSkill) {
            let useSubAgent = false;
            let agentModel = '';

            if (matchedAgent) {
                const agentPath = path.join(AGENTS_DIR, matchedAgent + '.md');
                if (fs.existsSync(agentPath)) {
                    const fullContent = fs.readFileSync(agentPath, 'utf8');
                    const frontmatterMatch = fullContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
                    if (frontmatterMatch) {
                        const modelMatch = frontmatterMatch[1].match(/^model:\s*(.*)/im);
                        if (modelMatch && modelMatch[1] && !modelMatch[1].toLowerCase().includes('default')) {
                            useSubAgent = true;
                            agentModel = modelMatch[1].trim();
                        }
                    }
                }
            }

            if (useSubAgent) {
                // MULTI-MODEL DELEGATION (STOP & WAIT ENFORCEMENT)
                ctx += '## CRITICAL ACTION: MULTI-MODEL DELEGATION\n';
                ctx += `Delegate to "${matchedAgent}" (Model: ${agentModel}) via Task tool.\n`;
                ctx += '### STRICT ORCHESTRATOR RULES (DO NOT VIOLATE):\n';
                ctx += '1. CALL THE TASK TOOL AND IMMEDIATELY STOP.\n';
                ctx += '2. DO NOT call any other tools (No web_search, No brave_web_search, No read_file).\n';
                ctx += '3. DO NOT attempt to do the task yourself.\n';
                ctx += '4. WAIT for the sub-agent to return its result.\n';
                ctx += '5. When the subagent finishes, output EXACTLY its response verbatim. DO NOT add introductions, conclusions, or summaries.\n\n';
            } else {
                // ACTIVE INJECTION
                ctx += '## ACTIVE CONTEXT INJECTION\n';
                if (matchedAgent) {
                    const agentPath = path.join(AGENTS_DIR, matchedAgent + '.md');
                    if (fs.existsSync(agentPath)) {
                        const fullContent = fs.readFileSync(agentPath, 'utf8');
                        const agentContent = fullContent.replace(/^---[\s\S]*?---/, '').trim().slice(0, 2000);
                        ctx += `\n### AGENT: ${matchedAgent}\n${agentContent}\n\n`;
                    }
                }
                if (matchedSkill) {
                    const skillPath = path.join(SKILLS_DIR, matchedSkill, 'SKILL.md');
                    if (fs.existsSync(skillPath)) {
                        const skillContent = fs.readFileSync(skillPath, 'utf8').slice(0, 2000);
                        ctx += `\n### SKILL: ${matchedSkill}\n${skillContent}\n\n`;
                    }
                }
                ctx += 'INSTRUCTION: Follow protocols strictly.\n\n';
            }
        }

        // MEMORY LOADING
        try {
          const memDir = QWEN_HOME + '/memories';
          function readMemFiles(dir, prefix) {
            let results = [];
            try {
              const entries = fs.readdirSync(dir, { withFileTypes: true });
              for (const e of entries) {
                const full = dir + '/' + e.name;
                if (e.isDirectory()) { results = results.concat(readMemFiles(full, prefix + e.name + '/')); }
                else if (e.name.endsWith('.md')) { results.push({ name: prefix + e.name, path: full }); }
              }
            } catch(ex) {}
            return results;
          }
          const allMemFiles = readMemFiles(memDir, '');
          const priorityOrder = ['global-user-profile.md','_global/user-profile.md','global-MEMORY.md','_global/MEMORY.md','MEMORY.md'];
          const loaded = new Set();
          for (const pf of priorityOrder) {
            const found = allMemFiles.find(f => f.name === pf || f.name.endsWith('/' + pf));
            if (found && !loaded.has(found.path)) {
              const mc = fs.readFileSync(found.path, 'utf8').slice(0, 400);
              ctx += '### MEM: ' + found.name + '\n' + mc + '\n\n';
              loaded.add(found.path);
            }
          }
          let extraCount = 0;
          for (const f of allMemFiles) {
            if (!loaded.has(f.path) && extraCount < 3) {
              const mc = fs.readFileSync(f.path, 'utf8').slice(0, 150);
              ctx += '### MEM: ' + f.name + '\n' + mc + '\n\n';
              loaded.add(f.path);
              extraCount++;
            }
          }
        } catch(e) {}

        // SYSTEM RULES
        ctx += '## RULES (ZERO TOLERANCE)\n';
        ctx += '1. NO FILLER/EMOJI: Start immediately with substance. No "Here is", "Certainly".\n';
        ctx += '2. SINGLE OUTPUT: Output only 1 final response. No duplicates.\n';
        ctx += '3. CLEAN SYNTHESIS: No raw JSON/HTML/MCP dumps. Synthesize into clean Markdown.\n';
        ctx += '4. NO THINKING TAGS in final output.\n';
        ctx += '5. TRADING SAFETY: No live trades without explicit user confirmation.\n\n';
        
        ctx += '## FORMAT & MCP\n';
        ctx += '- Use `###` for headers, `-` for bullets, **bold** for key terms.\n';
        ctx += '- End with `---` and `Sources: [A], [B]`\n';
        ctx += '- MCP Priority: 1. Brave 2. Tavily (max_results: 5, depth: basic) 3. Exa\n\n';

        console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: ctx } }));
    } catch(e) { 
        console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: 'Router error: ' + e.message } })); 
    }
});
