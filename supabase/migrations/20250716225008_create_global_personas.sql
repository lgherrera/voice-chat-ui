-- 20250717XXXXXX_create_global_personas.sql
--------------------------------------------------------------------------------
-- 1. Table for personas visible to every tenant (no tenant_id)
--------------------------------------------------------------------------------
create table public.global_personas (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  age           int,
  bio           text,
  image_url     text,
  bg_url        text,
  assistant_id  uuid,
  supports_voice boolean default true,
  voice_id      text,
  created_at    timestamptz default now()
);

-- 2. Row-Level Security: read-only for everyone
alter table public.global_personas enable row level security;

-- Allow all roles to SELECT any row
create policy "public read global personas"
  on public.global_personas
  for select
  using (true);

-- No insert/update/delete policies → blocked for anon/authenticated.
-- Service-role bypasses RLS and can manage rows.

--------------------------------------------------------------------------------
-- 3. OPTIONAL: seed three shared personas
--------------------------------------------------------------------------------
insert into public.global_personas
  (name, age, bio, image_url, bg_url, assistant_id, supports_voice, voice_id)
values
  ('Maya', 24,
   'A warm and curious digital companion who loves to explore travel, art, and culture.',
   'https://skgixvakpeepgokcsqpx.supabase.co/storage/v1/object/public/preview-images/preview-maya.jpg',
   'https://skgixvakpeepgokcsqpx.supabase.co/storage/v1/object/public/bg-images/bg-maya.jpg',
   'd0fe5cdd-001a-4f16-ab4b-f108ad3d32a0', true, '86V9x9hrQds83qf7zaGn'),

  ('Valentina', 25,
   'An energetic conversationalist passionate about music, fitness, and discovering new experiences.',
   'https://skgixvakpeepgokcsqpx.supabase.co/storage/v1/object/public/preview-images/preview-valentina.jpg',
   'https://skgixvakpeepgokcsqpx.supabase.co/storage/v1/object/public/bg-images/bg_valentina.jpg',
   '34fb4f48-27ad-4203-8919-218b9d74d992', true, null),

  ('Fernanda', 28,
   'A thoughtful and supportive guide who enjoys in-depth discussions on books and philosophy.',
   'https://skgixvakpeepgokcsqpx.supabase.co/storage/v1/object/public/preview-images/preview-fernanda.jpg',
   'https://skgixvakpeepgokcsqpx.supabase.co/storage/v1/object/public/bg-images/bg-fernanda.jpg',
   '34fb4f48-27ad-4203-8919-218b9d74d992', true, null);
