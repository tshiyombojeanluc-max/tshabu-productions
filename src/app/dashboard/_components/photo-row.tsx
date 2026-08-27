"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { deletePhoto } from "@/app/dashboard/_actions/photos";
import { ConfirmDeleteButton } from "@/app/dashboard/_components/confirm-delete-button";
import { Button } from "@/components/ui/button";
import type { PhotoWithGallery } from "@/app/dashboard/_lib/data";

export function PhotoRow({ photo }: { photo: PhotoWithGallery }) {
  return (
    <div className="group relative aspect-square overflow-hidden border border-border bg-tshabu-charcoal">
      <Link href={`/dashboard/galleries/${photo.gallery_id}`} className="absolute inset-0">
        <Image src={photo.image_url} alt={photo.title ?? ""} fill sizes="(max-width: 768px) 33vw, 20vw" className="object-cover" />
      </Link>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
        <p className="pointer-events-auto truncate text-xs text-white">{photo.gallery_title}</p>
      </div>
      <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
        <ConfirmDeleteButton
          title="Delete photo?"
          description="This permanently removes the photo from its gallery and from storage."
          onConfirm={() => deletePhoto(photo.id)}
          trigger={
            <Button type="button" variant="secondary" size="icon-sm" aria-label="Delete photo">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          }
        />
      </div>
    </div>
  );
}
