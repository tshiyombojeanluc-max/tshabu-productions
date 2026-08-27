"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ImageUp } from "lucide-react";
import { uploadImageToStorage } from "@/app/dashboard/_lib/upload";
import { setGalleryCover } from "@/app/dashboard/_actions/galleries";
import { Button } from "@/components/ui/button";

export function GalleryCoverUploader({
  galleryId,
  userId,
  currentCover,
}: {
  galleryId: string;
  userId: string;
  currentCover: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setPreview(URL.createObjectURL(file));

    startTransition(async () => {
      try {
        const uploaded = await uploadImageToStorage(file, userId, `galleries/${galleryId}/cover`);
        const result = await setGalleryCover(galleryId, uploaded);
        if (result && "error" in result) setError(result.error);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      }
    });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-24 w-32 shrink-0 overflow-hidden border border-border bg-tshabu-charcoal">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob preview, not yet a persisted remote URL
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : currentCover ? (
          <Image src={currentCover} alt="" fill sizes="128px" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-tshabu-paper/30">
            <ImageUp className="h-6 w-6" />
          </div>
        )}
      </div>
      <div>
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
          className="h-auto rounded-none px-4 py-2 text-sm"
        >
          {pending ? "Uploading…" : "Change Cover"}
        </Button>
        <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => handleFile(e.target.files?.[0])} />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
