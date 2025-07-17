-- Adds bg_url, assistant_id, supports_voice (default TRUE) to personas

alter table public.personas
  add column if not exists bg_url         text,
  add column if not exists assistant_id   text,
  add column if not exists supports_voice boolean default true;

comment on column public.personas.bg_url         is 'Background hero image';
comment on column public.personas.assistant_id   is 'Vapi / OpenAI assistant ID';
comment on column public.personas.supports_voice is 'Whether voice call UI is enabled (default TRUE)';
