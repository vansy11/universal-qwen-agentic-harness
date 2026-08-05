// Prompt Optimizer - Minifies and enriches prompts before API call
const { getContext } = require('./context-manager');
const { estimateTokens, calculateBudget } = require('./token-budget');

function optimizePrompt(prompt, options) {
    options = options || {};
    let optimized = prompt;

    // Step 1: Minify whitespace
    optimized = optimized.replace(/\s+/g, ' ').trim();

    // Step 2: Remove redundant instructions already in system prompt
    const redundantPatterns = [
        /please\s+/gi,
        /could you\s+/gi,
        /i would like you to\s+/gi,
        /make sure to\s+/gi,
        /remember to\s+/gi
    ];
    for (const pattern of redundantPatterns) {
        optimized = optimized.replace(pattern, '');
    }
    optimized = optimized.replace(/\s+/g, ' ').trim();

    // Step 3: Calculate budget
    const promptTokens = estimateTokens(optimized);
    const budget = calculateBudget(promptTokens, options.maxContext || 128000);

    // Step 4: Inject relevant context if not already present
    let contextInjection = '';
    if (options.taskType && !options.skipContext) {
        const ctx = getContext(options.taskType);
        if (ctx.rules && !optimized.includes('CHAIN-OF-THOUGHT')) {
            contextInjection += '\n\n## Active Rules\n' + ctx.rules.slice(0, 1000);
        }
        if (ctx.memories && !optimized.includes('MEMORY')) {
            contextInjection += '\n\n## Relevant Memories\n' + ctx.memories.slice(0, 500);
        }
    }

    return {
        original: prompt,
        optimized: optimized + contextInjection,
        originalTokens: estimateTokens(prompt),
        optimizedTokens: estimateTokens(optimized + contextInjection),
        savings: estimateTokens(prompt) - estimateTokens(optimized),
        budget: budget,
        compactNeeded: budget.shouldCompact
    };
}

module.exports = { optimizePrompt };