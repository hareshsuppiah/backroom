import { ensureProfileExists } from "@/lib/auth/ensure-profile";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Magic-link callback. Supabase redirects here with a `code` query param
 * after the user clicks the email link. We exchange it for a session,
 * upsert the profile row if missing, then send the user on to /app
 * (or to whatever `next` path the middleware preserved).
 */
export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/app";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    const message = encodeURIComponent(error?.message ?? "unknown");
    return NextResponse.redirect(`${origin}/login?error=${message}`);
  }

  await ensureProfileExists(supabase, data.user.id);

  const safeNext = next.startsWith("/") ? next : "/app";
  return NextResponse.redirect(`${origin}${safeNext}`);
}
