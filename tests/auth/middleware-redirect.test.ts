/**
 * @vitest-environment node
 */
import { NextRequest, NextResponse } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const updateSession = vi.fn();

vi.mock("@/lib/supabase/middleware", () => ({
  updateSession,
}));

describe("middleware /app guard", () => {
  beforeEach(() => {
    updateSession.mockReset();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("redirects unauthenticated /app requests to /login", async () => {
    updateSession.mockResolvedValue({ response: NextResponse.next(), user: null });
    const { middleware } = await import("@/middleware");

    const response = await middleware(new NextRequest("http://localhost:3000/app"));

    expect([307, 308]).toContain(response.status);
    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });

  it("preserves the deep path so the user lands where they meant to", async () => {
    updateSession.mockResolvedValue({ response: NextResponse.next(), user: null });
    const { middleware } = await import("@/middleware");

    const response = await middleware(new NextRequest("http://localhost:3000/app/inbox/abc-123"));

    expect([307, 308]).toContain(response.status);
    const location = new URL(response.headers.get("location") ?? "");
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.get("next")).toBe("/app/inbox/abc-123");
  });

  it("lets authenticated /app requests pass through", async () => {
    const baseResponse = NextResponse.next();
    updateSession.mockResolvedValue({
      response: baseResponse,
      user: { id: "u-1", email: "x@y.test" },
    });
    const { middleware } = await import("@/middleware");

    const response = await middleware(new NextRequest("http://localhost:3000/app"));

    expect(response).toBe(baseResponse);
  });

  it("does not redirect public routes when signed out", async () => {
    updateSession.mockResolvedValue({ response: NextResponse.next(), user: null });
    const { middleware } = await import("@/middleware");

    const response = await middleware(new NextRequest("http://localhost:3000/login"));

    expect([307, 308]).not.toContain(response.status);
  });
});
