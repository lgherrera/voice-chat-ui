-- Creates a flexible attachment system for messages (images, audio, files, …)
create or replace function public.current_tenant()
returns uuid
language sql stable as $$
  select nullif(
    current_setting('request.jwt.claims', true)::json ->> 'tenant_id',
    ''
  )::uuid;
$$;

-- ──────────────────────────────────────────────────────────────────────────────
-- Attachment table
create table public.message_attachments (
  id           bigserial primary key,
  message_id   bigint      not null
               references public.messages(id) on delete cascade,
  file_url     text        not null,           -- storage URL or signed URL
  file_type    text        not null,           -- 'image/png', 'audio/mpeg', …
  created_at   timestamptz default now()
);

-- Index to speed up look-ups by parent message
create index message_attachments_message_id_idx
  on public.message_attachments(message_id);

-- ──────────────────────────────────────────────────────────────────────────────
-- Row-Level Security & policy (tenant-scoped)
alter table public.message_attachments enable row level security;

create policy "tenant attachment access"
  on public.message_attachments
  using (
    exists (
      select 1
      from public.messages m
      where m.id = message_id
        and m.tenant_id = public.current_tenant()
    )
  );

