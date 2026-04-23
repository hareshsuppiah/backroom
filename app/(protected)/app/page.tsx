import { getSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Home · Backroom",
};

export default async function AppHome() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen items-start justify-center bg-base px-6 py-12">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-heading-lg text-primary">Welcome to Backroom</h1>
          <p className="text-body-md text-secondary">
            Signed in as <span className="text-primary">{user?.email}</span>.
          </p>
        </header>
        <p className="text-body-sm text-tertiary">
          The operations dashboard lands in Phase 3. This page confirms session handling and the
          protected route guard are working.
        </p>
      </div>
    </main>
  );
}
