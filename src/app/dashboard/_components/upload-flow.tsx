"use client";

import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PhotoUploader } from "@/app/dashboard/_components/photo-uploader";

export function UploadFlow({ galleries, userId }: { galleries: { id: string; title: string }[]; userId: string }) {
  const [galleryId, setGalleryId] = useState<string | null>(galleries[0]?.id ?? null);

  return (
    <div className="max-w-2xl space-y-8">
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

      {galleryId && <PhotoUploader key={galleryId} galleryId={galleryId} userId={userId} />}
    </div>
  );
}
