-- 04_storage_bucket.sql
-- Bucket público para servir imagens originais dos pets e capas do blog.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'canil-assets',
  'canil-assets',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view canil assets" on storage.objects;
create policy "Public can view canil assets"
on storage.objects
for select
to public
using (bucket_id = 'canil-assets');

drop policy if exists "Service role manages canil assets" on storage.objects;
create policy "Service role manages canil assets"
on storage.objects
for all
to service_role
using (bucket_id = 'canil-assets')
with check (bucket_id = 'canil-assets');
