-- Fix: pin search_path for helper so linter stops warning
create or replace function public.current_tenant()
returns uuid
language sql
stable
set search_path = pg_catalog   -- ← pinned search path
as $$
  select nullif(
    current_setting('request.jwt.claims', true)::json ->> 'tenant_id',
    ''
  )::uuid;
$$;
