"use client";

import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PhotoUploader } from "@/app/dashboard/_components/photo-uploader";
import { VideoUploader } from "@/app/dashboard/_components/video-uploader";
import { cn } from "@/lib/utils";

type MediaType = "photos" | "videos";

export function UploadFlow({ galleries, userId }: { galleries: { id: string; title: string }[]; userId: string }) {
  const [galleryId, setGalleryId] = useState<string | null>(galleries[0]?.id ?? null);
  const [mediaType, setMediaType] = useState<MediaType>("photos");

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex border border-border">
        {(["photos", "videos"] as const).map((type) => (
          <Button
            key={type}
            type="button"
            variant="ghost"
            onClick={() => setMediaType(type)}
            className={cn(
              "h-auto flex-1 rounded-none py-3 text-sm uppercase tracking-[0.15em] hover:bg-tshabu-black/5",
              mediaType === type && "bg-tshabu-black text-tshabu-paper hover:bg-tshabu-charcoal hover:text-tshabu-paper"
            )}
          >
            {type}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        <Label className="label-caps">Gallery</Label>
        <Select value={galleryId} onValueChange={(v) => setGalleryId(v as string)}>
          <SelectTrigger className="w-full rounded-none">
            <SelectValue placeholder="Choose a gallery" />
          </SelectTrigger>
          <SelectContent>
            {galleries.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {galleryId && mediaType === "photos" && <PhotoUploader key={galleryId} galleryId={galleryId} userId={userId} />}
      {galleryId && mediaType === "videos" && <VideoUploader key={galleryId} galleryId={galleryId} userId={userId} />}
    </div>
  );
}
