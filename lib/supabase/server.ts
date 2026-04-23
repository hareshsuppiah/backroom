import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Server-bound Supabase client for Server Components, Route Handlers, and
 * Server Actions. Reads + writes auth cookies via next/headers.
 *
 * In a pure Server Component the cookieStore is read-only — `setAll` will
 * throw. We swallow that throw because middleware.ts already takes care of
 * refreshing the session on every matching request.
 */
export async function getSupabaseServerClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // ignore — middleware handles refresh in non-mutable contexts
          }
        },
      },
    },
  );
}
