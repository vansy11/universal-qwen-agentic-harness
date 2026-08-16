const skillRouter = (userPrompt) => {
  const lowerPrompt = userPrompt.toLowerCase();
  let requiredSkills = [];
  let requiredAgents = [];

  // Intent: 3D Website & Animation
  if (lowerPrompt.includes("website") && (lowerPrompt.includes("3d") || lowerPrompt.includes("animation"))) {
    requiredSkills.push("skills/ui-animation-gsap-framer/SKILL.md");
    requiredSkills.push("skills/frontend-react-tailwind/SKILL.md");
    requiredSkills.push("skills/ai-humanizer-anti-slop/SKILL.md");
    requiredAgents.push("agents/frontend-engineer.md");
    requiredAgents.push("agents/ui-ux-designer.md");
  }

  // Intent: Database & Professional System
  if (lowerPrompt.includes("database") || lowerPrompt.includes("system") || lowerPrompt.includes("erd")) {
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
