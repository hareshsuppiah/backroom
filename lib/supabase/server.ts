import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Stub. Phase 2 green commit replaces this with the real @supabase/ssr
 * server client wired into next/headers cookies.
 */
export async function getSupabaseServerClient(): Promise<SupabaseClient> {
  throw new Error("getSupabaseServerClient: not implemented");
}
