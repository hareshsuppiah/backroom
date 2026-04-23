import { randomUUID } from "node:crypto";
import { type SupabaseClient, createClient } from "@supabase/supabase-js";

const SUPABASE_URL = () => process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const SUPABASE_SERVICE_ROLE_KEY = () => process.env.SUPABASE_SERVICE_ROLE_KEY as string;

const TEST_USER_PASSWORD = "test-password-must-be-twelve+";

export function createServiceClient(): SupabaseClient {
  return createClient(SUPABASE_URL(), SUPABASE_SERVICE_ROLE_KEY(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function createAnonClient(): SupabaseClient {
  return createClient(SUPABASE_URL(), SUPABASE_ANON_KEY(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export interface SeededTenant {
  user: { id: string; email: string };
  organisation: { id: string; slug: string; name: string };
  membership: { id: string; org_role: "admin" | "member" };
  /** Anon client signed in as this tenant's user — RLS-scoped. */
  client: SupabaseClient;
}

export interface SeedTenantOptions {
  emailPrefix?: string;
  orgSlug?: string;
  orgName?: string;
  orgRole?: "admin" | "member";
}

export async function seedTenant(
  service: SupabaseClient,
  opts: SeedTenantOptions = {},
): Promise<SeededTenant> {
  const suffix = randomUUID().slice(0, 8);
  const email = `${opts.emailPrefix ?? "tenant"}-${suffix}@backroom.test`;
  const orgSlug = opts.orgSlug ?? `org-${suffix}`;
  const orgName = opts.orgName ?? `Org ${suffix}`;
  const orgRole = opts.orgRole ?? "admin";

  const { data: created, error: createUserErr } = await service.auth.admin.createUser({
    email,
    password: TEST_USER_PASSWORD,
    email_confirm: true,
  });
  if (createUserErr || !created.user) {
    throw new Error(`createUser failed: ${createUserErr?.message ?? "no user"}`);
  }
  const userId = created.user.id;

  const { error: profileErr } = await service.from("profiles").insert({ id: userId });
  if (profileErr) throw new Error(`profile insert failed: ${profileErr.message}`);

  const { data: org, error: orgErr } = await service
    .from("organisations")
    .insert({ slug: orgSlug, name: orgName })
    .select("id, slug, name")
    .single();
  if (orgErr || !org) throw new Error(`org insert failed: ${orgErr?.message ?? "no org"}`);

  const { data: membership, error: memberErr } = await service
    .from("memberships")
    .insert({ organisation_id: org.id, profile_id: userId, org_role: orgRole })
    .select("id, org_role")
    .single();
  if (memberErr || !membership) {
    throw new Error(`membership insert failed: ${memberErr?.message ?? "no membership"}`);
  }

  const client = createAnonClient();
  const { error: signInErr } = await client.auth.signInWithPassword({
    email,
    password: TEST_USER_PASSWORD,
  });
  if (signInErr) throw new Error(`signIn failed for ${email}: ${signInErr.message}`);

  return {
    user: { id: userId, email },
    organisation: org,
    membership: { id: membership.id, org_role: membership.org_role as "admin" | "member" },
    client,
  };
}

/**
 * Deletes every test row our suite created. Auth users get cascaded via the
 * profiles FK ON DELETE CASCADE; we still call admin.deleteUser to be sure.
 */
export async function truncateTenantTables(service: SupabaseClient): Promise<void> {
  await service.from("memberships").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await service.from("organisations").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const { data: profiles } = await service.from("profiles").select("id");
  if (profiles?.length) {
    for (const profile of profiles) {
      await service.auth.admin.deleteUser(profile.id);
    }
  }
}
