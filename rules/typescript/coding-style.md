# TypeScript Specialist Rules
1. Strict Mode: strict: true must be enabled in tsconfig.json.
2. No Any: NEVER use the ny type. Use unknown or proper interfaces.
3. React: Use functional components with hooks. Class components are banned.
4. API: Use tRPC or strictly typed REST (Zod for validation).