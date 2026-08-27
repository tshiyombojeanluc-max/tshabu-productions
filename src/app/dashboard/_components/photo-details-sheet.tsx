"use client";

import { useState, useTransition, type FormEvent } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updatePhotoDetails } from "@/app/dashboard/_actions/photos";
import type { Photo } from "@/lib/supabase/types";

export function PhotoDetailsSheet({ photo }: { photo: Photo }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);

    startTransition(async () => {
      const result = await updatePhotoDetails(photo.id, {
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
      });
      if (result && "error" in result) {
        setError(result.error);
        return;
      }
      setOpen(false);
    });
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setError(null);
      }}
    >
      <SheetTrigger
        render={
          <Button variant="secondary" size="icon-sm" aria-label="Edit photo details">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        }
      />
      <SheetContent className="gap-0 rounded-none p-0">
        <SheetHeader className="border-b border-border p-6">
          <SheetTitle>Edit Photo</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 overflow-y-auto p-6">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-tshabu-charcoal">
            <Image src={photo.image_url} alt="" fill sizes="384px" className="object-cover" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor={`title-${photo.id}`} className="label-caps">
                Title
              </Label>
              <Input id={`title-${photo.id}`} name="title" defaultValue={photo.title ?? ""} className="rounded-none" />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`description-${photo.id}`} className="label-caps">
                Description
              </Label>
              <Textarea
                id={`description-${photo.id}`}
                name="description"
                rows={3}
                defaultValue={photo.description ?? ""}
                className="rounded-none"
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={pending}
              className="h-auto w-full rounded-none bg-tshabu-black py-3 text-sm uppercase tracking-[0.15em] text-tshabu-paper hover:bg-tshabu-charcoal"
            >
              {pending ? "Saving…" : "Save"}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
