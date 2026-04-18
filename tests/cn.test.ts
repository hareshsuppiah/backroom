import { cn } from "@/lib/cn";
import { describe, expect, it } from "vitest";

/**
 * `cn()` wraps clsx + tailwind-merge. The integration risk is conflict
 * resolution — when two Tailwind utilities collide, twMerge must win in the
 * later-wins direction. These tests guard that behaviour so refactors don't
 * silently drop it.
 */
describe("cn", () => {
  it("joins class strings with spaces", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("drops falsy values from conditional blocks", () => {
    expect(cn("foo", false && "hidden", null, undefined, "")).toBe("foo");
  });

  it("resolves Tailwind conflicts with later-wins semantics", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-secondary", "text-primary")).toBe("text-primary");
  });

  it("merges responsive variants independently of base classes", () => {
    expect(cn("p-2 md:p-6", "md:p-8")).toBe("p-2 md:p-8");
  });

  it("accepts nested arrays and objects per clsx conventions", () => {
    expect(cn(["foo", ["bar", { baz: true, qux: false }]])).toBe("foo bar baz");
  });

  // Regression: codex-review #1 (PR #1). Without the extendTailwindMerge config
  // for the custom font-size group, twMerge collapses both classes to one.
  it("keeps custom font-size and text-colour classes together", () => {
    expect(cn("text-body-sm", "text-secondary")).toBe("text-body-sm text-secondary");
    expect(cn("text-heading-md", "text-primary")).toBe("text-heading-md text-primary");
    expect(cn("text-mono-sm", "text-tertiary")).toBe("text-mono-sm text-tertiary");
  });

  it("still resolves conflicts within the font-size group itself", () => {
    expect(cn("text-body-sm", "text-body-md")).toBe("text-body-md");
    expect(cn("text-heading-sm", "text-heading-lg")).toBe("text-heading-lg");
  });
});
