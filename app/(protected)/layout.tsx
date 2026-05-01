import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Defence-in-depth: middleware.ts already redirects unauthenticated /app/*
 * requests, but a layout-level recheck guards against a misconfigured matcher
 * shipping unauthenticated content.
 */
export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}
