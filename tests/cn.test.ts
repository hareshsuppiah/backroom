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
});
