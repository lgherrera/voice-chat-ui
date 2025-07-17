-- Adds a voice model ID (e.g. ElevenLabs voice) to each persona
alter table public.personas
  add column if not exists voice_id text;

comment on column public.personas.voice_id
  is 'External TTS voice identifier (e.g. ElevenLabs voice_id)';
