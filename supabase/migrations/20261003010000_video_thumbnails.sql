-- Adds an optional poster-frame image to videos, captured client-side at
-- upload time (see uploadVideoToStorage in src/app/dashboard/_lib/upload.ts)
-- so <video> elements have something to show before playback instead of a
-- blank/black frame. Nullable because poster capture can fail in some
-- browsers — the video itself must never be blocked by that.

alter table public.videos
  add column thumbnail_url text,
  add column thumbnail_storage_path text;

-- No new storage bucket/policy needed: posters are uploaded as JPEGs into
-- the existing "gallery-photos" bucket (already public, already scoped to
-- "<user_id>/..." via storage RLS), not a new video asset.
