export type AIAgentOption = {
  id: string;
  name: string;
  provider: string;
  description: string;
  baseVotes: number;
};

export const AI_AGENT_OPTIONS: readonly AIAgentOption[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    provider: "Google",
    description: "Connect Gemini models via MCP for fast codebase indexing and multi-modal diff analysis.",
    baseVotes: 48,
  },
  {
    id: "grok",
    name: "xAI Grok",
    provider: "xAI",
    description: "Bring Grok's real-time reasoning and code generation into local repositories with project boundaries.",
    baseVotes: 41,
  },
  {
    id: "kimi",
    name: "Moonshot Kimi",
    provider: "Moonshot",
    description: "Leverage ultra-long context reasoning to inspect entire monorepos, architectural designs, and complex dependencies.",
    baseVotes: 36,
  },
] as const;
