import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Inserts a profile row for the user if one is missing. Idempotent — the
 * upsert with `ignoreDuplicates` is a no-op when the row already exists, so
 * the /auth/callback handler can call this on every sign-in safely.
 */
export async function ensureProfileExists(client: SupabaseClient, userId: string): Promise<void> {
  const { error } = await client
    .from("profiles")
    .upsert({ id: userId }, { onConflict: "id", ignoreDuplicates: true });

  if (error) {
    throw new Error(`ensureProfileExists failed for ${userId}: ${error.message}`);
  }
}
