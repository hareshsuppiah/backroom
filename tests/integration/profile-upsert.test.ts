import { ensureProfileExists } from "@/lib/auth/ensure-profile";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createServiceClient, truncateTenantTables } from "./helpers/supabase-test-client";

/**
 * Phase 2 acceptance: "Profile row exists for the signed-in user". The
 * /auth/callback route handler runs ensureProfileExists immediately after
 * exchanging the OTP code for a session.
 */
describe("ensureProfileExists", () => {
  const service = createServiceClient();
  let userId: string;
  let userEmail: string;

  beforeEach(async () => {
    await truncateTenantTables(service);
    userEmail = `callback-${Date.now()}@backroom.test`;
    const { data, error } = await service.auth.admin.createUser({
      email: userEmail,
      password: "test-password-must-be-twelve+",
      email_confirm: true,
    });
    if (error || !data.user) {
      throw new Error(`createUser failed: ${error?.message ?? "no user"}`);
    }
    userId = data.user.id;
  });

  afterEach(async () => {
    await truncateTenantTables(service);
  });

  it("creates a profile row when one is missing", async () => {
    await ensureProfileExists(service, userId);

    const { data, error } = await service.from("profiles").select("id").eq("id", userId);

    expect(error).toBeNull();
    expect(data).toEqual([{ id: userId }]);
  });

  it("is idempotent on a second call", async () => {
    await ensureProfileExists(service, userId);
    await ensureProfileExists(service, userId);

    const { data } = await service.from("profiles").select("id").eq("id", userId);

    expect(data).toHaveLength(1);
  });

  it("preserves the existing profile if one is already there", async () => {
    await service.from("profiles").insert({ id: userId, full_name: "Existing Coach" });

    await ensureProfileExists(service, userId);

    const { data } = await service.from("profiles").select("full_name").eq("id", userId).single();

    expect(data?.full_name).toBe("Existing Coach");
  });
});
