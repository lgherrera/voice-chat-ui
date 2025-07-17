-- 20250718XXXXXX_add_llm_providers_and_fk.sql
-------------------------------------------------------------------------------
-- ① LLM providers lookup table
-------------------------------------------------------------------------------
create table if not exists public.llm_providers (
  id         uuid primary key default gen_random_uuid(),
  name       text unique not null,            -- 'openai', 'anthropic', …
  base_url   text,                            -- optional: override endpoint
  notes      text,
  created_at timestamptz default now()
);

-------------------------------------------------------------------------------
-- ② Add fk column to personas
-------------------------------------------------------------------------------
alter table public.personas
  add column if not exists llm_provider_id uuid
  references public.llm_providers(id);

-- Optional convenience index for quick look-ups
create index if not exists personas_llm_provider_idx
  on public.personas(llm_provider_id);

-------------------------------------------------------------------------------
-- ③ Row-level security for llm_providers (read-only to all, write = admin)
-------------------------------------------------------------------------------
alter table public.llm_providers enable row level security;

drop policy if exists "public read llm providers" on public.llm_providers;
create policy "public read llm providers"
  on public.llm_providers
  for select
  using (true);              -- anyone can read

-- No insert/update/delete policies → only service-role can modify rows
