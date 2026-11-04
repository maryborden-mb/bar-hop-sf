import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

// The data isolation test talks to the real Supabase project, so it has its
// own config and command (npm run test:isolation), separate from `npm test`.
export default defineConfig(({ mode }) => ({
  test: {
    include: ["tests/**/*.test.ts"],
    // Load NEXT_PUBLIC_SUPABASE_* and TEST_EMAIL from .env.local.
    env: loadEnv(mode, process.cwd(), ""),
    testTimeout: 20_000,
    hookTimeout: 30_000,
  },
}));
