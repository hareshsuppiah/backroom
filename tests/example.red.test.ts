import { greet } from "@/lib/example";
import { describe, expect, it } from "vitest";

/**
 * Red-green evidence test.
 *
 * This test is committed first, proving the TDD loop works end-to-end.
 * Without `lib/example.ts` it fails on import. With the minimum production
 * code in place it passes.
 *
 * Kept in the repo deliberately — future contributors can see the cadence.
 * Future lib/ modules follow the same pattern; see docs/build-prompt.md §0.
 */
describe("greet", () => {
  it("returns a sport-operations-flavoured greeting", () => {
    expect(greet("Amara")).toBe("Hello Amara, let's run the numbers.");
  });

  it("falls back to 'practitioner' when no name is supplied", () => {
    expect(greet()).toBe("Hello practitioner, let's run the numbers.");
  });
});
