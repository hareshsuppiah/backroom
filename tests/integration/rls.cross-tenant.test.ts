import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  type SeededTenant,
  createServiceClient,
  seedTenant,
  truncateTenantTables,
} from "./helpers/supabase-test-client";

/**
 * RLS cross-tenant isolation. User A (Org 1) must never see or mutate any row
 * belonging to User B (Org 2), and vice versa. Build Prompt §6 Phase 2
 * acceptance: "RLS policies verified by an integration test."
 */
describe("RLS cross-tenant isolation", () => {
  const service = createServiceClient();
  let tenantA: SeededTenant;
  let tenantB: SeededTenant;

  beforeAll(async () => {
    await truncateTenantTables(service);
  });

  beforeEach(async () => {
    tenantA = await seedTenant(service, { emailPrefix: "user-a", orgSlug: `org-a-${Date.now()}` });
    tenantB = await seedTenant(service, { emailPrefix: "user-b", orgSlug: `org-b-${Date.now()}` });
  });

  afterEach(async () => {
    await truncateTenantTables(service);
  });

  describe("organisations", () => {
    it("user A sees only their own organisation", async () => {
      const { data, error } = await tenantA.client.from("organisations").select("id, slug");
      expect(error).toBeNull();
      const ids = (data ?? []).map((row) => row.id);
      expect(ids).toContain(tenantA.organisation.id);
      expect(ids).not.toContain(tenantB.organisation.id);
    });

    it("user A cannot update user B's organisation", async () => {
      const { data, error } = await tenantA.client
        .from("organisations")
        .update({ name: "hijacked" })
        .eq("id", tenantB.organisation.id)
        .select();
      // RLS-denied updates either error or return zero rows; either is acceptable.
      expect(error !== null || (data ?? []).length === 0).toBe(true);

      const { data: untouched } = await service
        .from("organisations")
        .select("name")
        .eq("id", tenantB.organisation.id)
        .single();
      expect(untouched?.name).not.toBe("hijacked");
    });
  });

  describe("memberships", () => {
    it("user A sees only memberships from their own organisation", async () => {
      const { data, error } = await tenantA.client.from("memberships").select("id, profile_id");
      expect(error).toBeNull();
      const profileIds = (data ?? []).map((row) => row.profile_id);
      expect(profileIds).toContain(tenantA.user.id);
      expect(profileIds).not.toContain(tenantB.user.id);
    });

    it("user A cannot insert a membership into user B's organisation", async () => {
      const { data, error } = await tenantA.client
        .from("memberships")
        .insert({
          organisation_id: tenantB.organisation.id,
          profile_id: tenantA.user.id,
          org_role: "member",
        })
        .select();
      expect(error !== null || (data ?? []).length === 0).toBe(true);
    });

    it("user A cannot delete user B's membership", async () => {
      await tenantA.client.from("memberships").delete().eq("id", tenantB.membership.id);

      const { data: stillThere } = await service
        .from("memberships")
        .select("id")
        .eq("id", tenantB.membership.id)
        .single();
      expect(stillThere?.id).toBe(tenantB.membership.id);
    });
  });

  describe("profiles", () => {
    it("user A reads their own profile only", async () => {
      const { data, error } = await tenantA.client.from("profiles").select("id");
      expect(error).toBeNull();
      const ids = (data ?? []).map((row) => row.id);
      expect(ids).toEqual([tenantA.user.id]);
    });

    it("user A cannot update user B's profile", async () => {
      const { data, error } = await tenantA.client
        .from("profiles")
        .update({ full_name: "hijacked" })
        .eq("id", tenantB.user.id)
        .select();
      expect(error !== null || (data ?? []).length === 0).toBe(true);

      const { data: untouched } = await service
        .from("profiles")
        .select("full_name")
        .eq("id", tenantB.user.id)
        .single();
      expect(untouched?.full_name).not.toBe("hijacked");
    });
  });
});
