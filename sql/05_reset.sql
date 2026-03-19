-- 05_reset.sql
-- ============================================================
-- ATENÇÃO: Este script apaga TODOS os dados do banco de dados.
-- Execute apenas quando quiser resetar o sistema do zero.
-- Após executar, o próximo acesso ao site fará o seed automático.
-- ============================================================

-- 1. Remove todos os dados de aplicação
delete from public.app_storage;

-- ============================================================
-- 2. Para apagar as fotos do Supabase Storage, acesse:
--    Supabase Dashboard → Storage → canil-assets
--    Selecione todas as pastas (pets/ e blog/) e exclua.
-- ============================================================

-- ============================================================
-- 3. (Opcional) Para resetar apenas os dados mantendo as fotos,
--    reinsira somente os marcadores de versão zerados:
--
-- insert into public.app_storage (chave, valor)
-- values
--   ('pv_seed_upgrade_v2', '0'),
--   ('pv_seed_upgrade_v3', '0'),
--   ('pv_seed_upgrade_v4', '0')
-- on conflict (chave) do nothing;
-- ============================================================
