#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const SKILLS_DIR = 'C:/Users/vansy/.qwen/skills';
const PROJECTS_DIR = 'C:/Users/vansy/.qwen/projects';
const CACHE_FILE = 'C:/Users/vansy/.qwen/evolution/skill-health-cache.json';
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

// Check if recently run
try {
    const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    if (Date.now() - cache.lastRun < SEVEN_DAYS) {
        console.log(JSON.stringify({ cached: true, unused: cache.unused, stale: cache.stale }));
        process.exit(0);
    }
} catch(e) {}

// Scan skills
const skills = fs.readdirSync(SKILLS_DIR, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
const usage = {};
for (const s of skills) usage[s] = { mentions: 0, lastUsed: null };

try {
    const projects = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
    for (const proj of projects) {
        const chatsDir = path.join(PROJECTS_DIR, proj.name, 'chats');
        if (!fs.existsSync(chatsDir)) continue;
        for (const cf of fs.readdirSync(chatsDir).filter(f => f.endsWith('.jsonl'))) {
            try {
                const content = fs.readFileSync(path.join(chatsDir, cf), 'utf8');
                for (const s of skills) {
                    const matches = content.match(new RegExp(s, 'gi'));
                    if (matches) {
                        usage[s].mentions += matches.length;
                        const mtime = fs.statSync(path.join(chatsDir, cf)).mtimeMs;
                        if (!usage[s].lastUsed || mtime > usage[s].lastUsed) usage[s].lastUsed = mtime;
                    }
                }
            } catch(e) {}
        }
    }
} catch(e) {}

const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
const unused = Object.entries(usage).filter(([_,d]) => d.mentions === 0).map(([s]) => s);
const stale = Object.entries(usage).filter(([_,d]) => d.lastUsed && d.lastUsed < thirtyDaysAgo && d.mentions > 0).map(([s]) => s);

// Cache result
fs.writeFileSync(CACHE_FILE, JSON.stringify({ lastRun: Date.now(), unused, stale, totalSkills: skills.length }), 'utf8');

console.log(JSON.stringify({ unused, stale, totalSkills: skills.length }));