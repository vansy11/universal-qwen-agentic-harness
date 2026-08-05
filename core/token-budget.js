// Token Budget Allocator - Calculates token limits for sub-agents
const CHAR_TO_TOKEN_RATIO = 4; // Approximate chars per token

function estimateTokens(text) {
    if (!text) return 0;
    return Math.ceil(text.length / CHAR_TO_TOKEN_RATIO);
}

function calculateBudget(promptLength, maxContext) {
    maxContext = maxContext || 128000;
    const reserved = {
        systemPrompt: 4000,
        agentDefinitions: 6000,
        skillDefinitions: 4000,
        outputReserve: 8000,
        safetyMargin: 2000
    };
    const totalReserved = Object.values(reserved).reduce((a, b) => a + b, 0);
    const available = maxContext - totalReserved - promptLength;

    return {
        maxContext: maxContext,
        promptTokens: promptLength,
        reserved: reserved,
        totalReserved: totalReserved,
        availableForAgents: Math.max(available, 10000),
        perAgentBudget: Math.floor(Math.max(available, 10000) / 3),
        usagePercent: Math.round(((promptLength + totalReserved) / maxContext) * 100),
        shouldCompact: (promptLength + totalReserved) > (maxContext * 0.7)
    };
}

function allocateForDelegation(numAgents, availableTokens) {
    const perAgent = Math.floor(availableTokens / Math.max(numAgents, 1));
    const allocations = [];
    for (let i = 0; i < numAgents; i++) {
        allocations.push({
            agentIndex: i,
            budget: perAgent,
            inputLimit: Math.floor(perAgent * 0.6),
            outputLimit: Math.floor(perAgent * 0.4)
        });
    }
    return allocations;
}

module.exports = { estimateTokens, calculateBudget, allocateForDelegation };