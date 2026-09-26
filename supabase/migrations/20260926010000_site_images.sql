-- Lets the client replace any of the fixed brand/hero photos on the public
-- site (logo, hero images, about page photo, homepage "Behind the Scenes"
-- gallery) from the dashboard, without a code change or redeploy.
--
-- These images previously lived only as files under public/images committed
-- to the repo — editable by a developer, not the client. Each editable slot
-- is identified by a stable `key` (defined in src/lib/site-image-slots.ts);
-- a row here overrides that slot's default file. No row for a key means
-- "use the default asset shipped in the repo".

create table public.site_images (
  key text primary key,
  url text not null,
  storage_path text not null,
  width integer,
  height integer,
  updated_at timestamptz not null default now()
);

create trigger site_images_set_updated_at
  before update on public.site_images
  for each row execute function public.set_updated_at();

alter table public.site_images enable row level security;

-- Every visitor to the public site needs to read these to render the page,
-- so selects are open — same trust model as the public gallery-photos bucket.
create policy "site_images_select_all"
  on public.site_images for select
  using (true);

-- Single-tenant today (one client account), like galleries/photos in
-- practice — so any authenticated dashboard user may write, same as the
-- storage policies below already assume.
create policy "site_images_insert_authenticated"
  on public.site_images for insert
  to authenticated
  with check (true);

create policy "site_images_update_authenticated"
  on public.site_images for update
  to authenticated
  using (true)
  with check (true);

create policy "site_images_delete_authenticated"
  on public.site_images for delete
  to authenticated
  using (true);

-- Reuses the existing "gallery-photos" bucket under a "<user_id>/site/..."
-- prefix rather than a new bucket — the storage RLS policies added in
-- 20260827000000_dashboard_schema.sql already scope writes to that prefix
-- for any authenticated user, so no new storage policy is needed.
