-- Enrich calls table with voice-specific metadata
alter table public.calls
  add column if not exists provider          text,                            -- 'vapi', 'livekit', ...
  add column if not exists external_call_id  text unique,                     -- provider’s call ID
  add column if not exists status            text,                            -- initiated | connected | ended
  add column if not exists started_at        timestamptz default now(),
  add column if not exists ended_at          timestamptz,
  add column if not exists duration_sec      int,
  add column if not exists minutes_billed    int,
  add column if not exists recording_url     text,
  add column if not exists transcript        text,
  add column if not exists cost_usd          numeric(10,4),
  add column if not exists tokens_used       int;

-- Helpful indexes
create index if not exists calls_tenant_started_idx
  on public.calls (tenant_id, started_at desc);

create index if not exists calls_external_id_idx
  on public.calls (external_call_id);
