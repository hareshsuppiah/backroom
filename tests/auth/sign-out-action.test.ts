import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const signOutFn = vi.fn();
const redirect = vi.fn((target: string) => {
  // Mimic next/navigation: redirect throws so caller code halts.
  throw new Error(`__REDIRECT__:${target}`);
});

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServerClient: vi.fn(async () => ({
    auth: { signOut: signOutFn },
  })),
}));

vi.mock("next/navigation", () => ({ redirect }));

describe("signOut", () => {
  beforeEach(() => {
    signOutFn.mockReset();
    signOutFn.mockResolvedValue({ error: null });
    redirect.mockClear();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("clears the Supabase session and redirects to /login", async () => {
    const { signOut } = await import("@/app/(auth)/actions");

    await expect(signOut()).rejects.toThrow("__REDIRECT__:/login");

    expect(signOutFn).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
