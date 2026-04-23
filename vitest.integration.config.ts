import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Vitest config for integration tests that hit a real local Supabase stack.
 *
 * Run `supabase start` first and copy the URL + keys into `.env.local`
 * (the integration setup loads them). Coverage is intentionally not gated
 * here — the unit config owns the lib/ coverage floor.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/integration/setup.ts"],
    include: ["tests/integration/**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**"],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    fileParallelism: false,
  },
});
