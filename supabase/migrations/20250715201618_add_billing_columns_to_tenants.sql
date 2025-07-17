alter table public.tenants
  add column if not exists minutes_quota      int    not null default 30,
  add column if not exists minutes_used       int    not null default 0,
  add column if not exists stripe_customer_id text,
  add column if not exists payment_customer_id text;

-- Prevent duplicate Stripe IDs
create unique index if not exists tenants_stripe_customer_uidx
  on public.tenants(stripe_customer_id)
  where stripe_customer_id is not null;
