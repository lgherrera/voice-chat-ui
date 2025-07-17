-- Disable client-side INSERT/UPDATE/DELETE on personas
alter table public.personas enable row level security;

drop policy if exists "tenant write personas" on public.personas;

-- No write policy means only service role (which bypasses RLS) can modify rows.
-- The "public read personas" policy remains unchanged.
