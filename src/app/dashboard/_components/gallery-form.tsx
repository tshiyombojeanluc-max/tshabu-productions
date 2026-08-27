"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { createGallery, updateGallery, type FormState } from "@/app/dashboard/_actions/galleries";
import type { Gallery } from "@/lib/supabase/types";

const fieldClass = "rounded-none";

export function GalleryForm({ gallery }: { gallery?: Gallery }) {
  const action = gallery ? updateGallery.bind(null, gallery.id) : createGallery;
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, null);

  return (
    <form action={formAction} className="max-w-2xl space-y-8">
      <div className="space-y-2">
        <Label htmlFor="title" className="label-caps">
          Title
        </Label>
        <Input id="title" name="title" required defaultValue={gallery?.title} className={fieldClass} placeholder="e.g. Weddings" />
      </div>

      {gallery && (
        <div className="space-y-2">
          <Label htmlFor="slug" className="label-caps">
            URL slug
          </Label>
          <Input id="slug" name="slug" defaultValue={gallery.slug} className={fieldClass} />
          <p className="text-xs text-tshabu-graphite">tshabu-productions.vercel.app/work/{gallery.slug}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description" className="label-caps">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={gallery?.description ?? ""}
          className={fieldClass}
          placeholder="A short description shown on the gallery page."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="category" className="label-caps">
            Category
          </Label>
          <Input
            id="category"
            name="category"
            defaultValue={gallery?.category ?? ""}
            className={fieldClass}
            placeholder="Event Coverage"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client_name" className="label-caps">
            Client
          </Label>
          <Input
            id="client_name"
            name="client_name"
            defaultValue={gallery?.client_name ?? ""}
            className={fieldClass}
            placeholder="Optional"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project_year" className="label-caps">
            Year
          </Label>
          <Input
            id="project_year"
            name="project_year"
            defaultValue={gallery?.project_year ?? ""}
            className={fieldClass}
            placeholder="2026"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 border border-border bg-card p-4 sm:flex-row sm:gap-10">
        <label className="flex items-center gap-3">
          <Switch name="published" defaultChecked={gallery?.published ?? false} />
          <span className="text-sm">
            Published
            <span className="block text-xs text-tshabu-graphite">Visible on the public website</span>
          </span>
        </label>
        <label className="flex items-center gap-3">
          <Switch name="featured" defaultChecked={gallery?.featured ?? false} />
          <span className="text-sm">
            Featured
            <span className="block text-xs text-tshabu-graphite">Shown on the homepage</span>
          </span>
        </label>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-auto rounded-none bg-tshabu-black px-8 py-4 text-sm uppercase tracking-[0.2em] text-tshabu-paper hover:bg-tshabu-charcoal"
      >
        {pending ? "Saving…" : gallery ? "Save Changes" : "Create Gallery"}
      </Button>
    </form>
  );
}
