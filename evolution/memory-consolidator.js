#!/usr/bin/env node
/**
 * Memory Consolidator v1.0
 * Merges flat + subfolder memories, extracts persistent rules,
 * updates user-profile with learned preferences.
 */
const fs = require('fs');
const path = require('path');
const MEM_DIR = 'C:/Users/vansy/.qwen/memories';
const LOG_FILE = 'C:/Users/vansy/.qwen/evolution/improvement-log.jsonl';
const PROFILE_FILE = MEM_DIR + '/global-user-profile.md';

// Read all memories recursively
function readAll(dir, prefix) {
    let results = [];
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const e of entries) {
            const full = dir + '/' + e.name;
            if (e.isDirectory()) results = results.concat(readAll(full, prefix + e.name + '/'));
            else if (e.name.endsWith('.md')) results.push({ name: prefix + e.name, path: full, content: fs.readFileSync(full, 'utf8') });
        }
    } catch(ex) {}
    return results;
}

const allMems = readAll(MEM_DIR, '');
console.log('Found ' + allMems.length + ' memory files');

// Extract learned rules from improvement log
let learnedRules = [];
try {
    const logContent = fs.readFileSync(LOG_FILE, 'utf8');
    for (const line of logContent.trim().split('\n')) {
        if (!line.trim()) continue;
        try {
            const entry = JSON.parse(line);
            if (entry.type === 'correction' || entry.type === 'format_issue' || entry.type === 'negative_feedback') {
                learnedRules.push(entry.excerpt || entry.source_line || '');
            }
        } catch(e) {}
    }
} catch(e) {}

// Deduplicate rules
learnedRules = [...new Set(learnedRules)].slice(0, 20);

if (learnedRules.length > 0) {
    // Append learned rules to user profile
    let profile = '';
    try { profile = fs.readFileSync(PROFILE_FILE, 'utf8'); } catch(e) { profile = '# User Profile\n'; }

    if (!profile.includes('## Learned Preferences')) {
        profile += '\n## Learned Preferences\n(Auto-extracted from user corrections)\n';
        for (const rule of learnedRules) {
            profile += '- ' + rule + '\n';
        }
        fs.writeFileSync(PROFILE_FILE, profile, 'utf8');
        console.log('Updated user-profile.md with ' + learnedRules.length + ' learned preferences');
    } else {
        console.log('Learned Preferences section already exists in user-profile.md');
    }
} else {
    console.log('No new learned rules to consolidate');
}

// Check for duplicate memory files (flat vs subfolder)
const seen = new Map();
let duplicates = 0;
for (const m of allMems) {
    const baseName = m.name.split('/').pop();
    if (seen.has(baseName)) {
        duplicates++;
        // Keep the one with more content
        const existing = seen.get(baseName);
        if (m.content.length > existing.content.length) {
            seen.set(baseName, m);
        }
    } else {
        seen.set(baseName, m);
    }
}
if (duplicates > 0) {
    console.log('Found ' + duplicates + ' duplicate memory files (flat vs subfolder). Consider cleanup.');
}

console.log('Memory consolidation complete.');