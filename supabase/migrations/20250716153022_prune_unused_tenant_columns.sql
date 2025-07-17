-- Prune legacy / unused fields from tenants
alter table public.tenants
  drop column if exists name,
  drop column if exists created_at,
  drop column if exists minutes_used,
  drop column if exists stripe_customer_id,
  drop column if exists payment_customer_id,
  drop column if exists username,
  drop column if exists last_name,
  drop column if exists language;
