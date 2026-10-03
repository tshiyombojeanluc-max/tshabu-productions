"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { deleteVideo } from "@/app/dashboard/_actions/videos";
import { ConfirmDeleteButton } from "@/app/dashboard/_components/confirm-delete-button";
import { Button } from "@/components/ui/button";
import type { VideoWithGallery } from "@/app/dashboard/_lib/data";

export function VideoRow({ video }: { video: VideoWithGallery }) {
  return (
    <div className="group relative aspect-square overflow-hidden border border-border bg-tshabu-charcoal">
      <Link href={`/dashboard/galleries/${video.gallery_id}`} className="absolute inset-0">
        <video
          src={video.video_url}
          poster={video.thumbnail_url ?? undefined}
          muted
          preload="metadata"
          className="h-full w-full object-cover"
        />
      </Link>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
        <p className="pointer-events-auto truncate text-xs text-white">{video.gallery_title}</p>
      </div>
      <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
        <ConfirmDeleteButton
          title="Delete video?"
          description="This permanently removes the video from its gallery and from storage."
          onConfirm={() => deleteVideo(video.id)}
          trigger={
            <Button type="button" variant="secondary" size="icon-sm" aria-label="Delete video">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          }
        />
      </div>
    </div>
  );
}
