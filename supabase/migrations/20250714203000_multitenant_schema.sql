-- 01  Base multitenant schema  -----------------------------

create table public.tenants (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  plan        text default 'free',
  created_at  timestamp default now()
);

create table public.profiles (
  user_id   uuid primary key references auth.users on delete cascade,
  tenant_id uuid not null references public.tenants,
  role      text default 'member',
  created_at timestamp default now()
);

create table public.personas (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references public.tenants,
  name        text,
  age         int,
  bio         text,
  image_url   text    -- already requested
);

create table public.messages (
  id          bigserial primary key,
  tenant_id   uuid not null references public.tenants,
  user_id     uuid references auth.users,
  persona_id  uuid references public.personas,
  content     text,
  created_at  timestamptz default now()
);

-- Enable RLS (policies come later if you like)
alter table public.profiles  enable row level security;
alter table public.personas  enable row level security;
alter table public.messages  enable row level security;
