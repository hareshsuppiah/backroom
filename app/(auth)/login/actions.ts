"use server";

export type SendMagicLinkResult =
  | { status: "sent"; message: string }
  | { status: "error"; message: string };

/**
 * Stub. Phase 2 green commit replaces this with a Supabase signInWithOtp call.
 */
export async function sendMagicLink(_formData: FormData): Promise<SendMagicLinkResult> {
  return { status: "error", message: "sendMagicLink: not implemented" };
}
