const fs = require('fs');
const path = require('path');

const BLACKBOARD_PATH = path.join(__dirname, '../tmp/blackboard.json');
const COOLDOWN_MS = 60 * 1000; // 1 minute cooldown (adjust as needed)

class AutoResumeWatcher {
  constructor() {
    this.isWatching = false;
  }

  start() {
    if (this.isWatching) return;
    this.isWatching = true;
    console.log("[Auto-Resume Watcher] Active. Monitoring for stalls and rate limits...");
    this.monitorLoop();
  }

  async monitorLoop() {
    while (this.isWatching) {
      try {
        const blackboard = JSON.parse(fs.readFileSync(BLACKBOARD_PATH, 'utf-8'));
        
        // If status is stalled or rate limited, wait and resume
        if (blackboard.status === 'stalled' || blackboard.status === 'rate_limited') {
          console.log(`[Auto-Resume] Issue detected: ${blackboard.status}. Waiting for ${COOLDOWN_MS / 1000}s cooldown...`);
          await new Promise(resolve => setTimeout(resolve, COOLDOWN_MS));
          
          // Update state to resuming
          blackboard.status = 'resuming';
          fs.writeFileSync(BLACKBOARD_PATH, JSON.stringify(blackboard, null, 2));
          
          // Inject resume prompt (This should trigger your harness's main input)
          const resumePrompt = `[SYSTEM AUTO-RESUME] Cooldown finished. Continue task: "${blackboard.currentTask}". Do not stop until QC passes.`;
          console.log(`[Auto-Resume] Injecting prompt: ${resumePrompt}`);
          
          // Example: require('../main').injectPrompt(resumePrompt);
        }
      } catch (error) {
        // Ignore file read errors if file doesn't exist yet
      }
      await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5s
    }
  }
}

module.exports = new AutoResumeWatcher();
