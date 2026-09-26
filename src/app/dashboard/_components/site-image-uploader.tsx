"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ImageUp } from "lucide-react";
import { uploadImageToStorage } from "@/app/dashboard/_lib/upload";
import { setSiteImage, resetSiteImage } from "@/app/dashboard/_actions/site-images";
import { Button } from "@/components/ui/button";
import type { SiteImageSlot } from "@/lib/site-image-slots";

export function SiteImageUploader({
  slot,
  userId,
  currentUrl,
}: {
  slot: SiteImageSlot;
  userId: string;
  /** The client's uploaded override for this slot, if any — null means "using the default". */
  currentUrl: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displaySrc = preview ?? currentUrl ?? slot.defaultSrc;

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setPreview(URL.createObjectURL(file));

    startTransition(async () => {
      try {
        const uploaded = await uploadImageToStorage(file, userId, `site/${slot.key}`);
        const result = await setSiteImage(slot.key, { url: uploaded.url, storagePath: uploaded.storagePath, width: uploaded.width, height: uploaded.height });
        if (result && "error" in result) setError(result.error);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      }
    });
  };

  const handleReset = () => {
    setError(null);
    setPreview(null);
    startTransition(async () => {
      const result = await resetSiteImage(slot.key);
      if (result && "error" in result) setError(result.error);
    });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-28 shrink-0 overflow-hidden border border-border bg-tshabu-charcoal">
        {displaySrc ? (
          preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- local blob preview, not yet a persisted remote URL
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <Image src={displaySrc} alt="" fill sizes="112px" className="object-cover" />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-tshabu-paper/30">
            <ImageUp className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="mb-2 truncate text-sm font-medium">{slot.label}</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => inputRef.current?.click()}
            className="h-auto rounded-none px-4 py-2 text-sm"
          >
            {pending ? "Saving…" : "Replace Photo"}
          </Button>
          {currentUrl && (
            <button
              type="button"
              disabled={pending}
              onClick={handleReset}
              className="text-xs uppercase tracking-[0.15em] text-tshabu-graphite underline-offset-2 hover:underline disabled:opacity-50"
            >
              Reset to default
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => handleFile(e.target.files?.[0])} />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
