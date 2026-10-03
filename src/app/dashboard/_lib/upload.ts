import { createClient } from "@/lib/supabase/client";

export type UploadResult = {
  storagePath: string;
  url: string;
  width: number;
  height: number;
};

export type VideoUploadResult = UploadResult & { durationSeconds: number };

const BUCKET = "gallery-photos";
const VIDEO_BUCKET = "gallery-videos";

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("That file doesn't look like a valid image."));
    };
    img.src = objectUrl;
  });
}

function readVideoMetadata(file: File): Promise<{ width: number; height: number; durationSeconds: number }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      resolve({ width: video.videoWidth, height: video.videoHeight, durationSeconds: video.duration });
      URL.revokeObjectURL(objectUrl);
    };
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("That file doesn't look like a valid video."));
    };
    video.src = objectUrl;
  });
}

function safeFileName(name: string, fallback = "photo"): string {
  const dotIndex = name.lastIndexOf(".");
  const ext = dotIndex > -1 ? name.slice(dotIndex).toLowerCase() : "";
  const base =
    (dotIndex > -1 ? name.slice(0, dotIndex) : name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || fallback;
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${base}-${unique}${ext}`;
}

/**
 * Uploads straight from the browser to Supabase Storage (bypassing our own
 * server entirely), so large, high-resolution photography files never hit
 * the Next.js Server Action body-size cap. Storage RLS — not this function —
 * is what actually enforces that a user can only write under their own
 * "<user_id>/..." folder prefix.
 */
export async function uploadImageToStorage(file: File, userId: string, folder: string): Promise<UploadResult> {
  const { width, height } = await readImageDimensions(file);

  const supabase = createClient();
  const path = `${userId}/${folder}/${safeFileName(file.name)}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return { storagePath: path, url: publicUrl, width, height };
}

/** Same direct-from-browser pattern as uploadImageToStorage, for the gallery-videos bucket. */
export async function uploadVideoToStorage(file: File, userId: string, folder: string): Promise<VideoUploadResult> {
  const { width, height, durationSeconds } = await readVideoMetadata(file);

  const supabase = createClient();
  const path = `${userId}/${folder}/${safeFileName(file.name, "video")}`;

  const { error } = await supabase.storage.from(VIDEO_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(path);

  return { storagePath: path, url: publicUrl, width, height, durationSeconds };
}
