-- Adds profile, locale, and billing fields to tenants
alter table public.tenants
  add column if not exists username            text,
  add column if not exists first_name          text,
  add column if not exists last_name           text,
  add column if not exists language            text,
  add column if not exists created_at          timestamptz default now(),
  add column if not exists minutes_used        int    default 0,
  add column if not exists stripe_customer_id  int,
  add column if not exists payment_customer_id int;
