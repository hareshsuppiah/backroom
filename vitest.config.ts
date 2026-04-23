import { URL, fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Vitest config for unit + component tests.
 *
 * Coverage floor: 85% lines + branches on `lib/**`. The gate fails the job
 * if coverage regresses. Build Prompt §8 names this explicitly.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["e2e/**", "tests/integration/**", "node_modules/**", ".next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: ["lib/**/*.{ts,tsx}"],
      exclude: [
        "lib/**/*.d.ts",
        "lib/**/index.ts",
        "lib/**/__mocks__/**",
        // Supabase client factories are exercised by the integration suite
        // (tests/integration/**) against a real local stack — mocking them in
        // unit tests would prove only that the mocks work.
        "lib/supabase/**",
      ],
      thresholds: {
        lines: 85,
        branches: 85,
        functions: 85,
        statements: 85,
      },
    },
  },
});
