-- Remove billing/plan columns (moved to subscriptions table)
alter table public.tenants
  drop column if exists plan_id,
  drop column if exists stripe_customer_id,
  drop column if exists payment_customer_id;
