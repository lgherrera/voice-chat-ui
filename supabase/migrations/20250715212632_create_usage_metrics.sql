-- Roll-up metrics per tenant per month
create table public.usage_metrics (
  tenant_id     uuid    not null references public.tenants(id) on delete cascade,
  period_start  date    not null,                     -- e.g., '2025-07-01'
  total_calls   int     not null default 0,
  total_minutes int     not null default 0,
  total_call_attachments int     not null default 0,
  updated_at    timestamptz default now(),

  primary key (tenant_id, period_start)
);

-- Handy index for dashboard graphs
create index if not exists usage_metrics_date_idx
  on public.usage_metrics (period_start);

-- Row-Level Security
alter table public.usage_metrics enable row level security;

create policy "tenant metrics"
  on public.usage_metrics
  using (tenant_id = public.current_tenant());
