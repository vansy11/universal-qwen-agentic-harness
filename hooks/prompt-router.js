// --- ANTI-TYPO LOGIC (LEVENSHTEIN DISTANCE) ---
function levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            const val = a[j - 1] === b[i - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + val
            );
        }
    }
    return matrix[b.length][a.length];
}

// Function to check if a word closely matches the target (tolerates up to 2 typos)
function isFuzzyMatch(prompt, target) {
    if (prompt.includes(target)) return true; // Exact match first
    const words = prompt.split(/\s+/);
    for (const word of words) {
        // Only apply fuzzy matching to words longer than 3 characters
        if (word.length > 3 && levenshtein(word.toLowerCase(), target) <= 2) {
            return true; // Typo detected, but close enough!
        }
    }
    return false;
}

// --- MAIN ROUTER LOGIC ---
const skillRouter = (userPrompt) => {
  const lowerPrompt = userPrompt.toLowerCase();
  let requiredSkills = [];
  let requiredAgents = [];

  // Intent: 3D Website & Animation (Immune to typos like "wbsite", "animatin")
  if (isFuzzyMatch(lowerPrompt, "website") && (isFuzzyMatch(lowerPrompt, "3d") || isFuzzyMatch(lowerPrompt, "animation"))) {
    requiredSkills.push("skills/ui-animation-gsap-framer/SKILL.md");
    requiredSkills.push("skills/frontend-react-tailwind/SKILL.md");
    requiredSkills.push("skills/ai-humanizer-anti-slop/SKILL.md");
    requiredAgents.push("agents/frontend-engineer.md");
    requiredAgents.push("agents/ui-ux-designer.md");
  }

  // Intent: Database & Professional System (Immune to typos like "dtabase", "systm")
  if (isFuzzyMatch(lowerPrompt, "database") || isFuzzyMatch(lowerPrompt, "system") || isFuzzyMatch(lowerPrompt, "erd")) {
    requiredSkills.push("skills/database-ssd-design/SKILL.md");
    requiredSkills.push("skills/code-review-security/SKILL.md");
    requiredAgents.push("agents/database-architect.md");
    requiredAgents.push("agents/cybersecurity-analyst.md");
  }

  // Mandatory Universal Execution & QC
  requiredSkills.push("skills/universal-execution-loop/SKILL.md");
  requiredAgents.push("agents/fullstack-orchestrator.md");
  requiredAgents.push("agents/quality-gatekeeper.md");

  return {
    injectedSkills: requiredSkills,
    injectedAgents: requiredAgents
  };
};

module.exports = skillRouter;