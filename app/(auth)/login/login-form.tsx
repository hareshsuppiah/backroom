"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { type SendMagicLinkResult, sendMagicLink } from "./actions";

const initialState: SendMagicLinkResult | null = null;

export function LoginForm() {
  const [state, action] = useActionState<SendMagicLinkResult | null, FormData>(
    async (_prev, formData) => sendMagicLink(formData),
    initialState,
  );

  return (
    <form action={action} className="space-y-6" noValidate>
      <header className="space-y-2">
        <h1 className="text-heading-lg text-primary">Sign in to Backroom</h1>
        <p className="text-body-sm text-secondary">
          We'll email you a one-time sign-in link. No passwords.
        </p>
      </header>

      <FormField
        label="Work email"
        htmlFor="email"
        helper="Use the address your organisation invited."
        error={state?.status === "error" ? state.message : undefined}
        required
      >
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@yourclub.org"
        />
      </FormField>

      <SubmitButton sentBefore={state?.status === "sent"} />

      {state?.status === "sent" ? (
        <output className="block text-body-sm text-accent">{state.message}</output>
      ) : null}
    </form>
  );
}

function SubmitButton({ sentBefore }: { sentBefore: boolean }) {
  const { pending } = useFormStatus();
  const label = pending ? "Sending…" : sentBefore ? "Send another link" : "Send magic link";

  return (
    <Button type="submit" variant="primary" size="lg" disabled={pending} className="w-full">
      {label}
    </Button>
  );
}
