-- 02_policies.sql
-- Políticas para permitir que o frontend público leia/escreva no storage remoto.
-- IMPORTANTE: este modelo é simples e funcional para migração rápida.
-- Recomendado evoluir para Supabase Auth + regras por perfil em produção.

alter table public.app_storage enable row level security;

drop policy if exists "app_storage_select_all" on public.app_storage;
create policy "app_storage_select_all"
on public.app_storage
for select
to anon, authenticated
using (true);

drop policy if exists "app_storage_insert_all" on public.app_storage;
create policy "app_storage_insert_all"
on public.app_storage
for insert
to anon, authenticated
with check (true);

drop policy if exists "app_storage_update_all" on public.app_storage;
create policy "app_storage_update_all"
on public.app_storage
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "app_storage_delete_all" on public.app_storage;
create policy "app_storage_delete_all"
on public.app_storage
for delete
to anon, authenticated
using (true);
