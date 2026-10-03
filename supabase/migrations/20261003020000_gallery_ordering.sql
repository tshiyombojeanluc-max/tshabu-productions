-- Lets the client manually control which order galleries show in on /work
-- and in the dashboard, instead of always being pinned to creation date.
-- Defaults everyone to 0, which collapses back to the existing created_at-
-- desc ordering (see the secondary `order by` in listGalleries/
-- getPublishedProjects) until someone actually drags a gallery to reorder it.

alter table public.galleries
  add column display_order integer not null default 0;

create index galleries_owner_display_order_idx on public.galleries (owner_id, display_order);
