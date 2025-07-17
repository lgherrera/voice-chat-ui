create table public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  tenant_id               uuid not null references public.tenants(id) on delete cascade,
  plan_id                 uuid not null references public.plans(id),
  status                  text not null,
  trial_ends_at           timestamptz,
  current_period_ends_at  timestamptz,
  stripe_subscription_id  text,
  payment_subscription_id text,
  created_at              timestamptz default now(),
  ended_at                timestamptz
);

create index subscriptions_tenant_status_idx
  on public.subscriptions (tenant_id, status);

alter table public.subscriptions enable row level security;

create policy "tenant subscriptions"
  on public.subscriptions
  using (tenant_id = public.current_tenant());
