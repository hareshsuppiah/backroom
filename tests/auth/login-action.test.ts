import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const signInWithOtp = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  getSupabaseServerClient: vi.fn(async () => ({
    auth: { signInWithOtp },
  })),
}));

describe("sendMagicLink", () => {
  beforeEach(() => {
    signInWithOtp.mockReset();
    signInWithOtp.mockResolvedValue({ data: {}, error: null });
    process.env.NEXT_PUBLIC_APP_URL = "https://backroom.test";
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("sends a magic link with the configured callback URL", async () => {
    const { sendMagicLink } = await import("@/app/(auth)/login/actions");
    const fd = new FormData();
    fd.set("email", "tenant@backroom.test");

    const result = await sendMagicLink(fd);

    expect(signInWithOtp).toHaveBeenCalledTimes(1);
    expect(signInWithOtp).toHaveBeenCalledWith({
      email: "tenant@backroom.test",
      options: {
        emailRedirectTo: "https://backroom.test/auth/callback",
        shouldCreateUser: true,
      },
    });
    expect(result.status).toBe("sent");
  });

  it("returns error and does not call Supabase for an invalid email", async () => {
    const { sendMagicLink } = await import("@/app/(auth)/login/actions");
    const fd = new FormData();
    fd.set("email", "not-an-email");

    const result = await sendMagicLink(fd);

    expect(result.status).toBe("error");
    expect(signInWithOtp).not.toHaveBeenCalled();
  });

  it("surfaces the Supabase error message when send fails", async () => {
    signInWithOtp.mockResolvedValue({ data: null, error: { message: "rate limited" } });
    const { sendMagicLink } = await import("@/app/(auth)/login/actions");
    const fd = new FormData();
    fd.set("email", "tenant@backroom.test");

    const result = await sendMagicLink(fd);

    expect(result.status).toBe("error");
    expect(result.message).toMatch(/rate limited/i);
  });
});
