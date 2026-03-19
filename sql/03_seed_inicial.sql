-- 03_seed_inicial.sql
-- Seeds mínimos. O script.js completa seeds automaticamente se as chaves não existirem.

insert into public.app_storage (chave, valor)
values
  ('pv_seed_upgrade_v2', '0'),
  ('pv_seed_upgrade_v3', '0'),
  ('pv_seed_upgrade_v4', '0')
on conflict (chave) do nothing;
