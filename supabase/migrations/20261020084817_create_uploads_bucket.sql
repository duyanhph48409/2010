/*
# Create storage bucket for card uploads (photos & music)

1. Storage
- Create a public bucket `card-uploads` for storing user-uploaded photos and music files.
2. Security
- Allow anon + authenticated to upload and read files (single-tenant, no auth app).
- Files are publicly readable so the greeting card can display them.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('card-uploads', 'card-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read
DROP POLICY IF EXISTS "anon_read_uploads" ON storage.objects;
CREATE POLICY "anon_read_uploads" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'card-uploads');

-- Allow anon + authenticated to upload
DROP POLICY IF EXISTS "anon_insert_uploads" ON storage.objects;
CREATE POLICY "anon_insert_uploads" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'card-uploads');

-- Allow anon + authenticated to delete
DROP POLICY IF EXISTS "anon_delete_uploads" ON storage.objects;
CREATE POLICY "anon_delete_uploads" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'card-uploads');
