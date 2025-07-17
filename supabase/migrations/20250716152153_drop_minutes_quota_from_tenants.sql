-- Remove minutes_quota from tenants (moved to plans table)
alter table public.tenants
  drop column if exists minutes_quota;
