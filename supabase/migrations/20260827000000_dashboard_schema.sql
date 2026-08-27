-- Tshabu Productions client dashboard/CMS — core schema.
--
-- Run this once against your Supabase project (SQL Editor, or
-- `supabase db push` if you have the CLI linked to the project — see
-- README-DASHBOARD.md for both options).
--
-- Design notes:
-- * `profiles` extends `auth.users` 1:1 and is auto-populated by a trigger
--   whenever a new user is created in Supabase Auth, so creating a user in
--   the Auth dashboard is the only manual step needed to provision a client.
-- * `galleries`/`photos` are owned by a profile (`owner_id`), not hardcoded
--   to a single client — RLS is written so this already supports multiple
--   clients later without any schema changes, even though today there is
--   exactly one.
-- * RLS is the actual security boundary (not just hidden UI). Every table
--   has row level security enabled with policies scoped to the row's owner.

-- ============================================================================
-- profiles
-- ============================================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'client' check (role in ('admin', 'client')),
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile row whenever a new Supabase Auth user is created.
-- `security definer` lets this run with the privileges needed to bypass RLS
-- for the insert; `search_path` is pinned so it can't be hijacked by a
-- session-level search_path change.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'display_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- updated_at helper
-- ============================================================================

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- galleries
-- ============================================================================

create table public.galleries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(btrim(title)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text,
  category text,
  client_name text,
  project_year text,
  cover_image text,
  cover_width integer,
  cover_height integer,
  published boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index galleries_owner_id_idx on public.galleries (owner_id);
create index galleries_published_idx on public.galleries (published);

create trigger galleries_set_updated_at
  before update on public.galleries
  for each row execute function public.set_updated_at();

alter table public.galleries enable row level security;

-- Public visitors (anon) and the dashboard owner can both read: published
-- work is public, unpublished drafts are visible only to their owner.
create policy "galleries_select"
  on public.galleries for select
  using (published = true or owner_id = auth.uid());

create policy "galleries_insert_own"
  on public.galleries for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "galleries_update_own"
  on public.galleries for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "galleries_delete_own"
  on public.galleries for delete
  to authenticated
  using (owner_id = auth.uid());

-- ============================================================================
-- photos
-- ============================================================================

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.galleries (id) on delete cascade,
  storage_path text not null,
  image_url text not null,
  width integer not null,
  height integer not null,
  title text,
  description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index photos_gallery_id_idx on public.photos (gallery_id, display_order);

create trigger photos_set_updated_at
  before update on public.photos
  for each row execute function public.set_updated_at();

alter table public.photos enable row level security;

-- Photo visibility/ownership is derived from the parent gallery, so a photo
-- is only as public (or as private) as the gallery it belongs to.
create policy "photos_select"
  on public.photos for select
  using (
    exists (
      select 1 from public.galleries g
      where g.id = photos.gallery_id
        and (g.published = true or g.owner_id = auth.uid())
    )
  );

create policy "photos_insert_own"
  on public.photos for insert
  to authenticated
  with check (
    exists (
      select 1 from public.galleries g
      where g.id = photos.gallery_id and g.owner_id = auth.uid()
    )
  );

create policy "photos_update_own"
  on public.photos for update
  to authenticated
  using (
    exists (
      select 1 from public.galleries g
      where g.id = photos.gallery_id and g.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.galleries g
      where g.id = photos.gallery_id and g.owner_id = auth.uid()
    )
  );

create policy "photos_delete_own"
  on public.photos for delete
  to authenticated
  using (
    exists (
      select 1 from public.galleries g
      where g.id = photos.gallery_id and g.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- storage — one public bucket, objects path-prefixed by the uploading
-- user's id ("<user_id>/<gallery_id>/<file>"), so storage RLS can scope
-- writes to the owner without a join back into `galleries`.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('gallery-photos', 'gallery-photos', true)
on conflict (id) do nothing;

create policy "gallery_photos_insert_own_folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'gallery-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "gallery_photos_update_own_folder"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'gallery-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "gallery_photos_delete_own_folder"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'gallery-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Reads don't need a policy: the bucket is public, so `storage.objects`
-- SELECT via the public URL endpoint bypasses RLS entirely (this is the
-- same mechanism every plain <img src> on a public bucket relies on).
