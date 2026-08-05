// Context Manager - Decides what context to inject based on task type
const fs = require('fs');
const path = require('path');

const MEMORIES_DIR = 'C:/Users/vansy/.qwen/memories';
const RULES_DIR = 'C:/Users/vansy/.qwen/rules';
const PROTOCOLS_DIR = 'C:/Users/vansy/.qwen/protocols';

function loadFile(fp) {
    try { return fs.readFileSync(fp, 'utf8').trim(); } catch(e) { return ''; }
}

function getContext(taskType) {
    const ctx = { memories: '', rules: '', protocols: '' };

    // Load global memories
    const globalMem = path.join(MEMORIES_DIR, '_global', 'MEMORY.md');
    if (fs.existsSync(globalMem)) ctx.memories += loadFile(globalMem) + '\n';

    // Load task-specific memories
    const taskMemMap = {
        trading: ['trading-risk-tolerance.md'],
        security: ['security-posture.md'],
        coding: ['tech-preferences.md']
    };
    const memFiles = taskMemMap[taskType] || [];
    for (const mf of memFiles) {
        const fp = path.join(MEMORIES_DIR, '_global', mf);
        if (fs.existsSync(fp)) ctx.memories += loadFile(fp) + '\n';
    }

    // Load universal rules
    const universalRules = ['chain-of-thought.md', 'output-format.md', 'self-correction.md'];
    for (const rf of universalRules) {
        const fp = path.join(RULES_DIR, '_universal', rf);
        if (fs.existsSync(fp)) ctx.rules += loadFile(fp) + '\n';
    }

    // Load language-specific rules
    const langMap = { python: 'python', typescript: 'typescript', javascript: 'typescript', sql: 'sql' };
    const langRule = langMap[taskType];
    if (langRule) {
        const fp = path.join(RULES_DIR, langRule, 'coding-style.md');
        if (fs.existsSync(fp)) ctx.rules += loadFile(fp) + '\n';
    }

    // Load protocols for trading tasks
    if (taskType === 'trading') {
        const checklist = path.join(PROTOCOLS_DIR, 'trading-risk-checklist.md');
        if (fs.existsSync(checklist)) ctx.protocols += loadFile(checklist) + '\n';
    }

    return ctx;
}

module.exports = { getContext, loadFile };