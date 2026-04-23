import { type NextRequest, NextResponse } from "next/server";

/**
 * Stub. Phase 2 green commit replaces this with @supabase/ssr session
 * refresh + redirect for unauthenticated /app/* requests.
 */
export async function middleware(_request: NextRequest): Promise<NextResponse> {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
