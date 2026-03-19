-- 01_schema.sql
-- Estrutura mínima para persistência do frontend no Supabase.

create table if not exists public.app_storage (
  chave text primary key,
  valor text not null default '',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create or replace function public.set_updated_at_app_storage()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists trg_set_updated_at_app_storage on public.app_storage;

create trigger trg_set_updated_at_app_storage
before update on public.app_storage
for each row
execute function public.set_updated_at_app_storage();
