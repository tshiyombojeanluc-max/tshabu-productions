import { createClient } from "@/lib/supabase/client";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabase/env";

export type UploadResult = {
  storagePath: string;
  url: string;
  width: number;
  height: number;
};

export type VideoUploadResult = UploadResult & {
  durationSeconds: number;
  thumbnailUrl?: string;
  thumbnailStoragePath?: string;
};

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

/**
 * Captures a single frame as a JPEG blob, to use as a <video> poster so the
 * player shows something other than a blank/black frame before playback.
 * Best-effort: a handful of real-world files (unusual codecs, very short
 * clips) can fail to seek/draw, so callers treat a thrown error as "no
 * poster" rather than failing the whole upload over it.
 */
function captureVideoPoster(file: File, atSeconds = 1): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const cleanup = () => URL.revokeObjectURL(objectUrl);

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(atSeconds, Math.max(video.duration - 0.1, 0));
    };
    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        cleanup();
        reject(new Error("Canvas not supported."));
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          cleanup();
          if (blob) resolve(blob);
          else reject(new Error("Could not capture a poster frame."));
        },
        "image/jpeg",
        0.85
      );
    };
    video.onerror = () => {
      cleanup();
      reject(new Error("Could not read the video to capture a poster frame."));
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
 * Uploads a file straight from the browser to Supabase Storage via a raw
 * XHR request shaped exactly like the one @supabase/storage-js's own
 * `upload()` makes internally (same endpoint, same FormData body, same
 * headers) — the SDK's method wraps `fetch`, which exposes no upload
 * progress events, so large files (especially video) otherwise have no way
 * to show anything better than an indeterminate spinner.
 */
function uploadWithProgress(
  bucket: string,
  path: string,
  file: File | Blob,
  onProgress?: (fraction: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    (async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        reject(new Error("Your session has expired — please sign in again."));
        return;
      }

      const formData = new FormData();
      formData.append("cacheControl", "31536000");
      formData.append("", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${supabaseUrl()}/storage/v1/object/${bucket}/${path}`);
      xhr.setRequestHeader("Authorization", `Bearer ${session.access_token}`);
      xhr.setRequestHeader("apikey", supabaseAnonKey());
      xhr.setRequestHeader("x-upsert", "false");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) onProgress(event.loaded / event.total);
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
          return;
        }
        let message = `Upload failed (${xhr.status}).`;
        try {
          const body = JSON.parse(xhr.responseText) as { message?: string };
          if (body.message) message = body.message;
        } catch {
          // Response wasn't JSON — fall back to the generic status message above.
        }
        reject(new Error(message));
      };
      xhr.onerror = () => reject(new Error("Upload failed — check your connection and try again."));
      xhr.send(formData);
    })();
  });
}

/**
 * Uploads straight from the browser to Supabase Storage (bypassing our own
 * server entirely), so large, high-resolution photography files never hit
 * the Next.js Server Action body-size cap. Storage RLS — not this function —
 * is what actually enforces that a user can only write under their own
 * "<user_id>/..." folder prefix.
 */
export async function uploadImageToStorage(
  file: File,
  userId: string,
  folder: string,
  onProgress?: (fraction: number) => void
): Promise<UploadResult> {
  const { width, height } = await readImageDimensions(file);

  const supabase = createClient();
  const path = `${userId}/${folder}/${safeFileName(file.name)}`;

  await uploadWithProgress(BUCKET, path, file, onProgress);

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return { storagePath: path, url: publicUrl, width, height };
}

/** Same direct-from-browser pattern as uploadImageToStorage, for the gallery-videos bucket. */
export async function uploadVideoToStorage(
  file: File,
  userId: string,
  folder: string,
  onProgress?: (fraction: number) => void
): Promise<VideoUploadResult> {
  const { width, height, durationSeconds } = await readVideoMetadata(file);

  const supabase = createClient();
  const path = `${userId}/${folder}/${safeFileName(file.name, "video")}`;

  await uploadWithProgress(VIDEO_BUCKET, path, file, onProgress);

  const {
    data: { publicUrl },
  } = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(path);

  const result: VideoUploadResult = { storagePath: path, url: publicUrl, width, height, durationSeconds };

  try {
    const posterBlob = await captureVideoPoster(file);
    const posterPath = `${userId}/${folder}/posters/${safeFileName(file.name, "video").replace(/\.[^.]+$/, "")}.jpg`;
    const { error: posterError } = await supabase.storage.from(BUCKET).upload(posterPath, posterBlob, {
      cacheControl: "31536000",
      upsert: false,
      contentType: "image/jpeg",
    });
    if (!posterError) {
      const {
        data: { publicUrl: posterUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(posterPath);
      result.thumbnailUrl = posterUrl;
      result.thumbnailStoragePath = posterPath;
    }
  } catch {
    // No poster — the <video> falls back to showing its own first frame.
  }

  return result;
}
