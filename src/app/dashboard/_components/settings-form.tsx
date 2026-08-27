"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateProfile, type SettingsState } from "@/app/dashboard/_actions/settings";
import type { Profile } from "@/lib/supabase/types";

export function SettingsForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(updateProfile, null);

  return (
    <form action={formAction} className="max-w-md space-y-8">
      <div className="space-y-2">
        <Label htmlFor="display_name" className="label-caps">
          Name
        </Label>
        <Input id="display_name" name="display_name" required defaultValue={profile.display_name ?? ""} className="rounded-none" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="label-caps">
          Email
        </Label>
        <Input id="email" name="email" type="email" defaultValue={profile.email} className="rounded-none" />
        <p className="text-xs text-tshabu-graphite">Changing this sends a confirmation link to your new address.</p>
      </div>

      {state && "error" in state && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state && "success" in state && <p className="text-sm text-green-700">{state.success}</p>}

      <Button
        type="submit"
        disabled={pending}
        className="h-auto rounded-none bg-tshabu-black px-8 py-4 text-sm uppercase tracking-[0.2em] text-tshabu-paper hover:bg-tshabu-charcoal"
      >
        {pending ? "Saving…" : "Save Changes"}
      </Button>
    </form>
  );
}
