"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

export type SendMagicLinkResult =
  | { status: "sent"; message: string }
  | { status: "error"; message: string };

const Schema = z.object({
  email: z.string().trim().min(1).email(),
});

export async function sendMagicLink(formData: FormData): Promise<SendMagicLinkResult> {
  const parsed = Schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  return {
    status: "sent",
    message: `Check your inbox — we've sent a sign-in link to ${parsed.data.email}.`,
  };
}
