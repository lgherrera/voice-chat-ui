-- READ: allow all roles to see every persona
drop policy if exists "public read personas" on public.personas;
create policy "public read personas"
  on public.personas
  for select
  using (true);                     -- no restriction

-- WRITE: keep per-tenant protection
drop policy if exists "tenant write personas" on public.personas;
create policy "tenant write personas"
  on public.personas
  for all                           -- covers insert, update, delete
  using (tenant_id = public.current_tenant());
