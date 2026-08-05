const fs = require('fs');
const path = require('path');
const AGENTS_DIR = 'C:/Users/vansy/.qwen/agents';
const SKILLS_DIR = 'C:/Users/vansy/.qwen/skills';
const agents = [];
try { fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md')).forEach(f => agents.push(f.replace('.md', ''))); } catch(e) {}
const skills = [];
try { fs.readdirSync(SKILLS_DIR, { withFileTypes: true }).filter(d => d.isDirectory()).forEach(d => { if (fs.existsSync(path.join(SKILLS_DIR, d.name, 'SKILL.md'))) skills.push(d.name); }); } catch(e) {}
console.log(JSON.stringify({ type: 'session_init', totalAgents: agents.length, totalSkills: skills.length, agents: agents, skills: skills }));