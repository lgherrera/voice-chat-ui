-- Adds personal / locale fields to each tenant record
alter table public.tenants
  add column if not exists username   text,
  add column if not exists last_name  text,
  add column if not exists language   text;
