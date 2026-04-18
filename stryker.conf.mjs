/**
 * Stryker mutation testing config.
 *
 * Per Build Prompt §0 + §8: runs nightly (not per-PR) against `lib/`. The
 * 70% mutation-score threshold applies to `lib/business-hours/` and
 * `lib/sla/` once they exist (Phase 9 and Phase 10). Until then the gate is
 * held at a lower value so the infrastructure works end-to-end.
 *
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
export default {
  packageManager: "pnpm",
  testRunner: "vitest",
  vitest: {
    configFile: "vitest.config.ts",
  },
  coverageAnalysis: "perTest",
  mutate: ["lib/**/*.{ts,tsx}", "!lib/**/*.d.ts", "!lib/**/index.ts", "!lib/**/*.test.{ts,tsx}"],
  reporters: ["html", "clear-text", "progress"],
  htmlReporter: {
    fileName: "reports/mutation/index.html",
  },
  thresholds: {
    high: 85,
    low: 60,
    // Break the build below this. Phase-specific gates tightened as modules land.
    break: 0,
  },
  timeoutMS: 60000,
  concurrency: 2,
  disableTypeChecks: "{test,lib,app,components}/**/*.{ts,tsx}",
};
