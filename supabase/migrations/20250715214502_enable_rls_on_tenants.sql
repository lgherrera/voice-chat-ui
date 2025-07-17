-- 20250716XXXXXX_enable_rls_on_tenants.sql
-- Enable row-level security on the tenants table and
-- allow each user to read only the row whose id matches
-- their tenant_id JWT claim.

--------------------------------------------------------------------------------
-- 1. Ensure the helper function exists (safe re-create)
--------------------------------------------------------------------------------
create or replace function public.current_tenant()
returns uuid
language sql
stable
set search_path = ''
as $$
  select nullif(
    current_setting('request.jwt.claims', true)::json ->> 'tenant_id',
    ''
  )::uuid;
$$;


--------------------------------------------------------------------------------
-- 2. Turn on RLS for public.tenants
--------------------------------------------------------------------------------
alter table public.tenants
  enable row level security;


--------------------------------------------------------------------------------
-- 3. Replace the policy (drop then create)
--------------------------------------------------------------------------------
drop policy if exists "tenant owns row" on public.tenants;

create policy "tenant owns row"
  on public.tenants
  for select
  using ( id = public.current_tenant() );
