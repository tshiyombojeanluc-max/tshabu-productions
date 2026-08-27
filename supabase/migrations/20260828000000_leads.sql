-- Contact form submissions ("leads"). Anyone can submit one (that's the
-- whole point of a public contact form); only signed-in users of this
-- business can read, update or delete them.

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  company text,
  project_type text,
  budget text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_idx on public.leads (status);

alter table public.leads enable row level security;

-- Public visitors can create a lead (submit the form) but never read, update
-- or delete existing ones — that would leak every other visitor's message.
create policy "leads_insert_public"
  on public.leads for insert
  to anon, authenticated
  with check (true);

-- Any signed-in user of this business can see and manage every lead. There's
-- no per-gallery ownership concept here — a contact-form message belongs to
-- the business as a whole, not to one client's galleries.
create policy "leads_select_authenticated"
  on public.leads for select
  to authenticated
  using (true);

create policy "leads_update_authenticated"
  on public.leads for update
  to authenticated
  using (true)
  with check (true);

create policy "leads_delete_authenticated"
  on public.leads for delete
  to authenticated
  using (true);
