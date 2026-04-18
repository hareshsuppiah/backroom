/**
 * Minimum production code to satisfy `tests/example.red.test.ts`.
 *
 * Kept intentionally small — its only job is to demonstrate that red state
 * becomes green with exactly the code a test demands, nothing more. Future
 * lib/ modules follow the same cadence (see docs/build-prompt.md §0).
 */

export function greet(name = "practitioner"): string {
  return `Hello ${name}, let's run the numbers.`;
}
