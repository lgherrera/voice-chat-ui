-- Track total LLM tokens consumed per tenant
alter table public.tenants
  add column if not exists tokens_llm int default 0;
