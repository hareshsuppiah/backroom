import { LoginForm } from "./login-form";

export const metadata = {
  title: "Sign in · Backroom",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base px-6 py-12">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
