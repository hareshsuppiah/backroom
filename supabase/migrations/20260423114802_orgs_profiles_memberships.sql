-- Phase 2: organisations + profiles + memberships with row-level security.
-- Schemas are fixed by docs/build-prompt.md §4. RLS is tenant-scoped to the
-- organisations a user is a member of. Memberships' own RLS policies cannot
-- subquery memberships directly without recursion, so we route through two
-- security-definer helpers that bypass RLS at the function call boundary.

create extension if not exists "pgcrypto";

-- Tables --------------------------------------------------------------------

create table public.organisations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now(),
  settings jsonb not null default '{}'::jsonb,
  template_used text
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  default_organisation_id uuid references public.organisations(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  org_role text not null check (org_role in ('admin', 'member')),
  created_at timestamptz not null default now(),
  unique (organisation_id, profile_id)
);

create index memberships_profile_id_idx on public.memberships(profile_id);
create index memberships_organisation_id_idx on public.memberships(organisation_id);

-- Helpers (security definer to dodge recursive RLS) -------------------------

create or replace function public.user_organisation_ids(uid uuid)
returns setof uuid
language sql
security definer
set search_path = public
stable
as $$
  select organisation_id from public.memberships where profile_id = uid;
$$;

create or replace function public.user_admin_organisation_ids(uid uuid)
returns setof uuid
language sql
security definer
set search_path = public
stable
as $$
  select organisation_id
  from public.memberships
  where profile_id = uid and org_role = 'admin';
$$;

revoke execute on function public.user_organisation_ids(uuid) from public;
revoke execute on function public.user_admin_organisation_ids(uuid) from public;
grant execute on function public.user_organisation_ids(uuid) to authenticated;
grant execute on function public.user_admin_organisation_ids(uuid) to authenticated;

-- Row-level security --------------------------------------------------------

alter table public.organisations enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;

-- organisations: visible to members; updatable only by admins. Creation is
-- intentionally blocked at RLS in Phase 2 — the bootstrapping flow lands in
-- Phase 3 with proper safeguards.
create policy organisations_select on public.organisations
  for select using (
    id in (select public.user_organisation_ids(auth.uid()))
  );

create policy organisations_update on public.organisations
  for update using (
    id in (select public.user_admin_organisation_ids(auth.uid()))
  ) with check (
    id in (select public.user_admin_organisation_ids(auth.uid()))
  );

-- profiles: a user reads, inserts (via the auth callback) and updates only
-- their own row. The id PK references auth.users so it is always auth.uid().
create policy profiles_select on public.profiles
  for select using (id = auth.uid());

create policy profiles_insert on public.profiles
  for insert with check (id = auth.uid());

create policy profiles_update on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- memberships: tenant-scoped reads; admin-only writes.
create policy memberships_select on public.memberships
  for select using (
    organisation_id in (select public.user_organisation_ids(auth.uid()))
  );

create policy memberships_insert on public.memberships
  for insert with check (
    organisation_id in (select public.user_admin_organisation_ids(auth.uid()))
  );

create policy memberships_update on public.memberships
  for update using (
    organisation_id in (select public.user_admin_organisation_ids(auth.uid()))
  ) with check (
    organisation_id in (select public.user_admin_organisation_ids(auth.uid()))
  );

create policy memberships_delete on public.memberships
  for delete using (
    organisation_id in (select public.user_admin_organisation_ids(auth.uid()))
  );
