"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/dashboard/_actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const fieldClass =
  "rounded-none border-x-0 border-t-0 border-b border-tshabu-paper/30 bg-transparent px-0 text-tshabu-paper placeholder:text-tshabu-paper/40 focus-visible:border-tshabu-paper focus-visible:ring-0";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, null);

  return (
    <form action={formAction} className="w-full max-w-sm space-y-8">
      <input type="hidden" name="next" value={next} />

      <div className="space-y-2">
        <Label htmlFor="email" className="label-caps text-tshabu-paper/60">
          Email
        </Label>
        <Input id="email" name="email" type="email" autoComplete="email" required className={fieldClass} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="label-caps text-tshabu-paper/60">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={fieldClass}
        />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-400">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-auto w-full rounded-none bg-tshabu-paper px-8 py-4 text-sm uppercase tracking-[0.2em] text-tshabu-black hover:bg-tshabu-paper/90"
      >
        {pending ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}
