-- Adds video support to galleries, mirroring the existing `photos` table and
-- its storage setup almost exactly — see 20260827000000_dashboard_schema.sql
-- for the patterns this follows (ownership derived from the parent gallery,
-- a dedicated public bucket path-prefixed by the uploading user's id).

create table public.videos (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.galleries (id) on delete cascade,
  storage_path text not null,
  video_url text not null,
  width integer not null,
  height integer not null,
  duration_seconds numeric not null,
  title text,
  description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index videos_gallery_id_idx on public.videos (gallery_id, display_order);

create trigger videos_set_updated_at
  before update on public.videos
  for each row execute function public.set_updated_at();

alter table public.videos enable row level security;

-- Same visibility/ownership model as photos: derived from the parent
-- gallery, so a video is only as public (or as private) as its gallery.
create policy "videos_select"
  on public.videos for select
  using (
    exists (
      select 1 from public.galleries g
      where g.id = videos.gallery_id
        and (g.published = true or g.owner_id = auth.uid())
    )
  );

create policy "videos_insert_own"
  on public.videos for insert
  to authenticated
  with check (
    exists (
      select 1 from public.galleries g
      where g.id = videos.gallery_id and g.owner_id = auth.uid()
    )
  );

create policy "videos_update_own"
  on public.videos for update
  to authenticated
  using (
    exists (
      select 1 from public.galleries g
      where g.id = videos.gallery_id and g.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.galleries g
      where g.id = videos.gallery_id and g.owner_id = auth.uid()
    )
  );

create policy "videos_delete_own"
  on public.videos for delete
  to authenticated
  using (
    exists (
      select 1 from public.galleries g
      where g.id = videos.gallery_id and g.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- storage — a separate bucket from gallery-photos: video files are far
-- larger and need a much higher size limit and a different set of allowed
-- mime types, so reusing the photos bucket's limits isn't an option.
-- Same "<user_id>/<folder>/<file>" prefix convention, same RLS shape.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gallery-videos', 'gallery-videos', true, 524288000, array['video/mp4', 'video/quicktime', 'video/webm'])
on conflict (id) do nothing;

create policy "gallery_videos_insert_own_folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'gallery-videos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "gallery_videos_update_own_folder"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'gallery-videos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "gallery_videos_delete_own_folder"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'gallery-videos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Reads don't need a policy: the bucket is public, same as gallery-photos.
