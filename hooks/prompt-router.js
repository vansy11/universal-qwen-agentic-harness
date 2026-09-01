// --- ANTI-TYPO LOGIC (LEVENSHTEIN DISTANCE) ---
function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++)
    ((matrix[0] = matrix[0] || []), (matrix[0][j] = j));
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const val = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + val,
      );
    }
  }
  return matrix[b.length][a.length];
}

function fuzzy(prompt, target) {
  if (prompt.includes(target)) return true;
  const words = prompt.split(/\s+/);
  for (const word of words) {
    if (word.length > 3 && levenshtein(word.toLowerCase(), target) <= 2)
      return true;
  }
  return false;
}

function anyOf(prompt, ...targets) {
  return targets.some((t) => fuzzy(prompt, t));
}

// --- UNIVERSAL INTENT ROUTER ---
const skillRouter = (userPrompt) => {
  const p = userPrompt.toLowerCase();
  const skills = new Set();
  const agents = new Set();

  // Always inject universal execution + QC
  skills.add("skills/universal-execution-loop/SKILL.md");
  agents.add("agents/fullstack-orchestrator.md");
  agents.add("agents/quality-gatekeeper.md");

  // --- FRONTEND / UI / 3D / ANIMATION ---
  if (
    anyOf(
      p,
      "frontend",
      "react",
      "tailwind",
      "component",
      "ui",
      "css",
      "responsive",
    ) ||
    (anyOf(p, "website", "web") &&
      anyOf(p, "3d", "animation", "animate", "gsap", "framer"))
  ) {
    skills.add("skills/frontend-react-tailwind/SKILL.md");
    skills.add("skills/ai-humanizer-anti-slop/SKILL.md");
    agents.add("agents/frontend-engineer.md");
    agents.add("agents/ui-ux-designer.md");
    if (anyOf(p, "3d", "animation", "animate", "gsap", "framer", "motion")) {
      skills.add("skills/ui-animation-gsap-framer/SKILL.md");
    }
    if (anyOf(p, "design", "system", "token", "palette")) {
      skills.add("skills/ui-ux-design-system/SKILL.md");
    }
  }

  // --- BACKEND / API ---
  if (
    anyOf(
      p,
      "api",
      "backend",
      "rest",
      "graphql",
      "endpoint",
      "server",
      "route",
      "controller",
      "middleware",
    )
  ) {
    skills.add("skills/backend-api-design/SKILL.md");
    skills.add("skills/api-testing/SKILL.md");
    skills.add("skills/code-review-security/SKILL.md");
    agents.add("agents/backend-engineer.md");
    if (anyOf(p, "graphql", "trpc")) {
      skills.add("skills/api-doc-generator/SKILL.md");
    }
  }

  // --- DATABASE / ERD / SCHEMA ---
  if (
    anyOf(
      p,
      "database",
      "schema",
      "erd",
      "migration",
      "index",
      "query",
      "sql",
      "postgres",
      "mysql",
      "mongodb",
    )
  ) {
    skills.add("skills/database-ssd-design/SKILL.md");
    skills.add("skills/code-review-security/SKILL.md");
    agents.add("agents/database-architect.md");
  }

  // --- DEVOPS / DOCKER / DEPLOY / CI-CD ---
  if (
    anyOf(
      p,
      "docker",
      "deploy",
      "ci",
      "cd",
      "pipeline",
      "kubernetes",
      "k8s",
      "terraform",
      "nginx",
      "server",
      "hosting",
      "vercel",
      "cloud",
      "aws",
      "gcp",
      "azure",
    )
  ) {
    skills.add("skills/docker-deployment/SKILL.md");
    skills.add("skills/cloud-infrastructure/SKILL.md");
    skills.add("skills/monitoring-observability/SKILL.md");
    agents.add("agents/devops-engineer.md");
    agents.add("agents/cloud-architect.md");
  }

  // --- QUANT / TRADING / FINANCE ---
  if (
    anyOf(
      p,
      "trading",
      "quant",
      "backtest",
      "strategy",
      "alpha",
      "portfolio",
      "risk",
      "greeks",
      "options",
      "futures",
      "pine",
      "orderflow",
      "ivb",
      "indicator",
    )
  ) {
    skills.add("skills/quant-algo-trading/SKILL.md");
    skills.add("skills/finance-analysis/SKILL.md");
    skills.add("skills/derivatives-pricing/SKILL.md");
    skills.add("skills/institutional-econometrics/SKILL.md");
    agents.add("agents/quant-algo-engineer.md");
    agents.add("agents/quant-strategist.md");
    agents.add("agents/risk-manager.md");
    agents.add("agents/trading-desk-chief.md");
    agents.add("agents/market-data-engineer.md");
  }

  // --- DATA / ETL / PIPELINE ---
  if (
    anyOf(
      p,
      "etl",
      "pipeline",
      "data",
      "warehouse",
      "ingest",
      "transform",
      "analytics",
      "dashboard",
      "visualization",
      "chart",
    )
  ) {
    skills.add("skills/etl-pipeline/SKILL.md");
    skills.add("skills/data-visualization/SKILL.md");
    agents.add("agents/data-engineer.md");
  }

  // --- MOBILE ---
  if (
    anyOf(
      p,
      "mobile",
      "react native",
      "expo",
      "flutter",
      "ios",
      "android",
      "app",
    )
  ) {
    skills.add("skills/mobile-react-native/SKILL.md");
    agents.add("agents/mobile-developer.md");
  }

  // --- SECURITY / PENTEST ---
  if (
    anyOf(
      p,
      "security",
      "pentest",
      "vulnerability",
      "exploit",
      "audit",
      "xss",
      "injection",
      "auth",
      "oauth",
      "cve",
      "owasp",
    )
  ) {
    skills.add("skills/cybersecurity-pentest/SKILL.md");
    skills.add("skills/cybersecurity-vuln-scan/SKILL.md");
    skills.add("skills/code-review-security/SKILL.md");
    agents.add("agents/cybersecurity-analyst.md");
  }

  // --- RESEARCH / WEB SEARCH ---
  if (
    anyOf(
      p,
      "research",
      "search",
      "find",
      "investigate",
      "compare",
      "review",
      "analyze",
      "news",
      "trend",
    )
  ) {
    skills.add("skills/web-research-deep/SKILL.md");
    skills.add("skills/news-trending-aggregator/SKILL.md");
    skills.add("skills/fact-check-anti-hallucination/SKILL.md");
    agents.add("agents/web-researcher.md");
    agents.add("agents/news-trending-scout.md");
  }

  // --- DOCUMENTATION ---
  if (
    anyOf(
      p,
      "document",
      "readme",
      "changelog",
      "adr",
      "onboarding",
      "guide",
      "api doc",
      "swagger",
      "openapi",
    )
  ) {
    skills.add("skills/technical-documentation/SKILL.md");
    skills.add("skills/api-doc-generator/SKILL.md");
    agents.add("agents/technical-writer.md");
  }

  // --- TESTING / TDD ---
  if (
    anyOf(
      p,
      "test",
      "tdd",
      "spec",
      "jest",
      "pytest",
      "vitest",
      "playwright",
      "cypress",
    )
  ) {
    skills.add("skills/tdd-workflow/SKILL.md");
    skills.add("skills/api-testing/SKILL.md");
    skills.add("skills/verification-loop/SKILL.md");
  }

  // --- GIT / GITHUB ---
  if (
    anyOf(
      p,
      "git",
      "commit",
      "branch",
      "merge",
      "rebase",
      "pull request",
      "pr",
      "github",
    )
  ) {
    skills.add("skills/git-workflow/SKILL.md");
    skills.add("skills/github-workflow/SKILL.md");
  }

  // --- MIGRATION / REFACTOR ---
  if (
    anyOf(p, "migrate", "migration", "refactor", "upgrade", "legacy", "port")
  ) {
    skills.add("skills/migration-refactoring/SKILL.md");
    agents.add("agents/refactor-engineer.md");
  }

  // --- PERFORMANCE ---
  if (
    anyOf(
      p,
      "performance",
      "optimize",
      "slow",
      "bottleneck",
      "profile",
      "cache",
      "bundle",
    )
  ) {
    skills.add("skills/performance-optimization/SKILL.md");
  }

  // --- NETWORK ---
  if (
    anyOf(
      p,
      "network",
      "dns",
      "firewall",
      "tcp",
      "latency",
      "connectivity",
      "proxy",
    )
  ) {
    skills.add("skills/network-diagnostics/SKILL.md");
    agents.add("agents/network-engineer.md");
  }

  // --- SOCIAL MEDIA ---
  if (
    anyOf(
      p,
      "social media",
      "twitter",
      "reddit",
      "sentiment",
      "brand",
      "influencer",
    )
  ) {
    skills.add("skills/social-media-monitor/SKILL.md");
    agents.add("agents/social-media-analyst.md");
  }

  // --- OFFICE / PDF ---
  if (
    anyOf(
      p,
      "pdf",
      "excel",
      "word",
      "powerpoint",
      "docx",
      "xlsx",
      "pptx",
      "office",
    )
  ) {
    skills.add("skills/pdf-extraction/SKILL.md");
    skills.add("skills/ms-office-engine/SKILL.md");
  }

  // --- ACCESSIBILITY ---
  if (anyOf(p, "accessibility", "a11y", "wcag", "screen reader", "keyboard")) {
    skills.add("skills/accessibility-audit/SKILL.md");
  }

  // --- SEO ---
  if (
    anyOf(p, "seo", "meta tag", "structured data", "sitemap", "core web vital")
  ) {
    skills.add("skills/seo-optimization/SKILL.md");
  }

  return {
    injectedSkills: [...skills],
    injectedAgents: [...agents],
  };
};

module.exports = skillRouter;
