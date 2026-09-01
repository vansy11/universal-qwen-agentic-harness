#!/usr/bin/env node
/**
 * Dynamic Route Scorer v1.0
 * Analyzes improvement logs to identify failing routes and suggest adjustments.
 * Called by session-bootstrap or manually.
 */
const fs = require('fs');
const path = require('path');
const QH = path.resolve(__dirname, '..').replace(/\\/g, '/');
const ROUTER_FILE = QH + '/hooks/prompt-router.js';
const LOG_FILE = QH + '/evolution/improvement-log.jsonl';
const SCORE_FILE = QH + '/evolution/route-scores.json';
const CACHE_DAYS = 3 * 24 * 60 * 60 * 1000;

// Check cache
try {
    const cache = JSON.parse(fs.readFileSync(SCORE_FILE, 'utf8'));
    if (Date.now() - cache.lastRun < CACHE_DAYS) {
        console.log('Route scores cached. Next update: ' + new Date(cache.lastRun + CACHE_DAYS).toISOString());
        process.exit(0);
    }
} catch(e) {}

// Load improvement log
let logs = [];
try {
    const content = fs.readFileSync(LOG_FILE, 'utf8');
    for (const line of content.trim().split('\n')) {
        if (line.trim()) { try { logs.push(JSON.parse(line)); } catch(e) {} }
    }
} catch(e) { console.log('No improvement log found.'); process.exit(0); }

if (logs.length < 3) { console.log('Not enough data for route scoring (' + logs.length + ' entries). Need 3+.'); process.exit(0); }

// Analyze correction types
const typeCounts = {};
for (const log of logs) {
    typeCounts[log.type] = (typeCounts[log.type] || 0) + 1;
}

// Generate score adjustments
const adjustments = [];
const totalLogs = logs.length;

if (typeCounts.hallucination && typeCounts.hallucination > 2) {
    adjustments.push({ area: 'quality-gate', action: 'Add more hallucination patterns', priority: 'HIGH', count: typeCounts.hallucination });
}
if (typeCounts.correction && typeCounts.correction > 3) {
    adjustments.push({ area: 'routing', action: 'Review keyword patterns - frequent corrections suggest misrouting', priority: 'MEDIUM', count: typeCounts.correction });
}
if (typeCounts.format_issue && typeCounts.format_issue > 2) {
    adjustments.push({ area: 'output-format', action: 'Update output-format.md with user preferences', priority: 'MEDIUM', count: typeCounts.format_issue });
}
if (typeCounts.stale_knowledge && typeCounts.stale_knowledge > 1) {
    adjustments.push({ area: 'agent-protocols', action: 'Update agent .md files with current information', priority: 'HIGH', count: typeCounts.stale_knowledge });
}
if (typeCounts.negative_feedback && typeCounts.negative_feedback > 2) {
    adjustments.push({ area: 'quality-gate', action: 'Add new slop phrases from negative feedback', priority: 'MEDIUM', count: typeCounts.negative_feedback });
}

// Save scores
const scoreData = {
    lastRun: Date.now(),
    totalFeedback: totalLogs,
    typeCounts: typeCounts,
    adjustments: adjustments
};
fs.writeFileSync(SCORE_FILE, JSON.stringify(scoreData, null, 2), 'utf8');

console.log('Route Score Analysis:');
console.log('  Total feedback entries: ' + totalLogs);
console.log('  Types: ' + JSON.stringify(typeCounts));
console.log('  Adjustments needed: ' + adjustments.length);
for (const adj of adjustments) {
    console.log('  [' + adj.priority + '] ' + adj.area + ': ' + adj.action + ' (' + adj.count + ' signals)');
}