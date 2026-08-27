"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { uploadImageToStorage } from "@/app/dashboard/_lib/upload";
import { updateAvatar } from "@/app/dashboard/_actions/settings";
import { Button } from "@/components/ui/button";

export function AvatarUploader({ userId, currentAvatar }: { userId: string; currentAvatar: string | null }) {
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
        const uploaded = await uploadImageToStorage(file, userId, "avatar");
        const result = await updateAvatar(uploaded.url);
        if (result && "error" in result) setError(result.error);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      }
    });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-tshabu-charcoal">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob preview, not yet a persisted remote URL
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : currentAvatar ? (
          <Image src={currentAvatar} alt="" fill sizes="64px" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-tshabu-paper/30">
            <User className="h-6 w-6" />
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
          {pending ? "Uploading…" : "Change Photo"}
        </Button>
        <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => handleFile(e.target.files?.[0])} />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
