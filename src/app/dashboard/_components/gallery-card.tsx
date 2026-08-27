"use client";

import Link from "next/link";
import Image from "next/image";
import { useTransition } from "react";
import { Images } from "lucide-react";
import type { Gallery } from "@/lib/supabase/types";
import { togglePublished, deleteGallery } from "@/app/dashboard/_actions/galleries";
import { ConfirmDeleteButton } from "@/app/dashboard/_components/confirm-delete-button";
import { Switch } from "@/components/ui/switch";

export function GalleryCard({ gallery }: { gallery: Gallery }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="group block border border-border bg-card">
      <Link href={`/dashboard/galleries/${gallery.id}`} className="relative block aspect-[4/3] w-full overflow-hidden bg-tshabu-charcoal">
        {gallery.cover_image ? (
          <Image
            src={gallery.cover_image}
            alt={gallery.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-tshabu-paper/30">
            <Images className="h-8 w-8" />
          </div>
        )}
      </Link>
      <div className="flex items-start justify-between gap-3 p-4">
        <Link href={`/dashboard/galleries/${gallery.id}`} className="min-w-0">
          <p className="truncate font-medium">{gallery.title}</p>
          <p className="label-caps mt-1">{new Date(gallery.updated_at).toLocaleDateString()}</p>
        </Link>
        <div className="flex shrink-0 items-center gap-3">
          <Switch
            checked={gallery.published}
            disabled={pending}
            aria-label={gallery.published ? "Unpublish gallery" : "Publish gallery"}
            onCheckedChange={(checked) =>
              startTransition(async () => {
                await togglePublished(gallery.id, checked);
              })
            }
          />
          <ConfirmDeleteButton
            title="Delete gallery?"
            description={`This permanently removes "${gallery.title}" and all of its photos. This can't be undone.`}
            onConfirm={() => deleteGallery(gallery.id)}
          />
        </div>
      </div>
    </div>
  );
}
