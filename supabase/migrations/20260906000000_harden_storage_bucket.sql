-- The gallery-photos bucket had no server-side file type or size limit —
-- the "image/*" accept attribute on upload inputs is a UI hint only and is
-- trivially bypassed. Only the authenticated dashboard user can upload
-- (storage RLS already scopes writes to their own "<user_id>/..." prefix),
-- so this is a low-severity gap in practice, but there's no reason to allow
-- arbitrary file types or unbounded sizes through the one upload path.

update storage.buckets
set
  file_size_limit = 26214400, -- 25 MB, generous for high-resolution photography
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
where id = 'gallery-photos';
