-- Rename content→summary in calls
alter table public.calls
  rename column content to summary;

-- Rename attachment table + FK column
alter table public.message_attachments
  rename to call_attachments;

alter table public.call_attachments
  rename column message_id to call_id;

-- Optional: update comment for clarity
comment on column public.call_attachments.call_id
  is 'FK to public.calls(id)';
