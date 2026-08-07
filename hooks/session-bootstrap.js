const QWEN_HOME = require('path').resolve(__dirname, '..').replace(/\\/g, '/');
const fs = require('fs');
const path = require('path');
const AGENTS_DIR = QWEN_HOME + '/agents';
const SKILLS_DIR = QWEN_HOME + '/skills';

const agents = [];
try { fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md')).forEach(f => agents.push(f.replace('.md', ''))); } catch(e) {}

const skills = [];
try { fs.readdirSync(SKILLS_DIR, { withFileTypes: true }).filter(d => d.isDirectory()).forEach(d => { if (fs.existsSync(path.join(SKILLS_DIR, d.name, 'SKILL.md'))) skills.push(d.name); }); } catch(e) {}

// Weekly self-improvement tasks (every 3 days)
try {
  const scoreFile = QWEN_HOME + '/evolution/route-scores.json';
  let needsRun = true;
  try {
    const cache = JSON.parse(fs.readFileSync(scoreFile, 'utf8'));
    if (Date.now() - cache.lastRun < 3 * 24 * 60 * 60 * 1000) needsRun = false;
  } catch(e) {}
  if (needsRun) {
    const { execSync } = require('child_process');
    try { execSync('node QWEN_HOME/evolution/route-scorer.js', { timeout: 10000, stdio: 'pipe' }); } catch(e) {}
    try { execSync('node QWEN_HOME/evolution/memory-consolidator.js', { timeout: 10000, stdio: 'pipe' }); } catch(e) {}
  }
} catch(e) {}

// Build context string
let ctx = '';

// Load latest self-improvement signals (7 days)
try {
  const impFile = QWEN_HOME + '/evolution/latest-improvements.md';
  if (fs.existsSync(impFile)) {
    const impContent = fs.readFileSync(impFile, 'utf8');
    const age = Date.now() - fs.statSync(impFile).mtimeMs;
    if (age < 7 * 24 * 60 * 60 * 1000) {
      ctx += '\n## RECENT SELF-IMPROVEMENT CONTEXT\n' + impContent + '\n';
    }
  }
} catch(e) {}

// Load route scores if available
try {
  const scoreFile = QWEN_HOME + '/evolution/route-scores.json';
  if (fs.existsSync(scoreFile)) {
    const scores = JSON.parse(fs.readFileSync(scoreFile, 'utf8'));
    if (scores.adjustments && scores.adjustments.length > 0) {
      ctx += '\n## ROUTE SCORE ADJUSTMENTS\n';
      for (const adj of scores.adjustments.slice(0, 3)) {
        ctx += '- [' + adj.priority + '] ' + adj.area + ': ' + adj.action + '\n';
      }
      ctx += '\n';
    }
  }
} catch(e) {}

console.log(JSON.stringify({
  type: 'session_init',
  totalAgents: agents.length,
  totalSkills: skills.length,
  agents: agents,
  skills: skills,
  additionalContext: ctx
}));