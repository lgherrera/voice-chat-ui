-- 20250717XXXXXX_make_personas_global.sql
-------------------------------------------------------------------------------
-- 1. Drop FK/column/related index
-------------------------------------------------------------------------------
-- If you created an FK from personas.tenant_id to tenants.id, drop it first
alter table public.personas
  drop constraint if exists personas_tenant_fk;

-- If you had an index on tenant_id, drop it too
drop index if exists personas_tenant_id_idx;

-- Now drop the tenant_id column
alter table public.personas
  drop column if exists tenant_id;

-------------------------------------------------------------------------------
-- 2. Row-level security: global read, admin-only writes
-------------------------------------------------------------------------------
alter table public.personas enable row level security;

-- Remove old tenant-scoped policy if it exists
drop policy if exists "tenant personas" on public.personas;

-- Public read: any role can SELECT any row
drop policy if exists "public read personas" on public.personas;
create policy "public read personas"
  on public.personas
  for select
  using (true);

-- No insert/update/delete policies → blocked for anon/authenticated.
-- Service role (admin key) bypasses RLS and can manage rows.
