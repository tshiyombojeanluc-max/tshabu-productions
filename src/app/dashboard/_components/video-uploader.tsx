"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadVideoToStorage } from "@/app/dashboard/_lib/upload";
import { createVideoRecord } from "@/app/dashboard/_actions/videos";
import { cn } from "@/lib/utils";

type Status = "uploading" | "processing" | "done" | "error";

type UploadItem = {
  id: string;
  file: File;
  previewUrl: string;
  status: Status;
  error?: string;
};

export function VideoUploader({ galleryId, userId }: { galleryId: string; userId: string }) {
  const router = useRouter();
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef<UploadItem[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const files = Array.from(fileList).filter((f) => f.type.startsWith("video/"));
      if (files.length === 0) return;

      const newItems: UploadItem[] = files.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        status: "uploading",
      }));

      setItems((prev) => [...newItems, ...prev]);

      newItems.forEach(async (item) => {
        try {
          const uploaded = await uploadVideoToStorage(item.file, userId, `galleries/${galleryId}`);
          setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "processing" } : i)));

          const result = await createVideoRecord({
            galleryId,
            storagePath: uploaded.storagePath,
            url: uploaded.url,
            width: uploaded.width,
            height: uploaded.height,
            durationSeconds: uploaded.durationSeconds,
            thumbnailUrl: uploaded.thumbnailUrl,
            thumbnailStoragePath: uploaded.thumbnailStoragePath,
            title: item.file.name.replace(/\.[^.]+$/, ""),
          });

          if ("error" in result) {
            setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "error", error: result.error } : i)));
            return;
          }

          setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "done" } : i)));
          router.refresh();
        } catch (err) {
          const message = err instanceof Error ? err.message : "Upload failed.";
          setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "error", error: message } : i)));
        }
      });
    },
    [galleryId, userId, router]
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed border-border px-6 py-16 text-center transition-colors",
          dragActive && "border-tshabu-black bg-tshabu-black/5"
        )}
      >
        <UploadCloud className="h-8 w-8 text-tshabu-graphite" />
        <div>
          <p className="font-medium">Drag and drop videos here</p>
          <p className="text-sm text-tshabu-graphite">or click to browse — you can select multiple files at once</p>
          <p className="mt-1 text-xs text-tshabu-graphite">MP4, MOV or WebM, up to 500MB each</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {items.length > 0 && (
        <ul className="mt-6 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 border border-border bg-card p-3">
              <video src={item.previewUrl} muted className="h-12 w-12 shrink-0 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{item.file.name}</p>
                <p className={cn("text-xs", item.status === "error" ? "text-red-600" : "text-tshabu-graphite")}>
                  {item.status === "uploading" && "Uploading…"}
                  {item.status === "processing" && "Processing…"}
                  {item.status === "done" && "Uploaded successfully"}
                  {item.status === "error" && (item.error ?? "Upload failed")}
                </p>
              </div>
              {item.status === "done" && <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />}
              {item.status === "error" && <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />}
              {(item.status === "uploading" || item.status === "processing") && (
                <div
                  aria-label="Loading"
                  className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-tshabu-graphite/30 border-t-tshabu-black"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
