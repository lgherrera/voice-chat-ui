-- ① Plans lookup table
create table public.plans (
  id              uuid primary key default gen_random_uuid(),
  name            text unique not null,
  price_usd       numeric(10,2) not null,         -- monthly price
  minutes_quota   int not null,
  images_quota    int not null,
  video_quota     int not null,
  created_at      timestamptz default now()
);

-- seed a couple of starter plans (optional)
insert into public.plans (name, price_usd, minutes_quota, images_quota, video_quota)
values
  ('Free',    0.00, 30,  50,  0),
  ('Pro250', 19.00, 250, 500, 10);

-- ② Replace tenants.plan (text) with a FK
alter table public.tenants
  add column plan_id uuid references public.plans(id);

-- migrate existing text values if you already have tenants
update public.tenants t
set    plan_id = p.id
from   public.plans p
where  p.name = t.plan;      -- assumes old column is called plan

-- you can drop the old text column after verifying
alter table public.tenants
  drop column if exists plan;

-- ③ RLS: tenants already scoped by tenant_id, no change needed.
