-- Restreindre le bucket praticiens-photos: 5 MB max, types image jpeg/png/webp
UPDATE storage.buckets
SET file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp']
WHERE id = 'praticiens-photos';

-- Lecture publique (au cas où la policy n'existe pas déjà)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'Praticiens photos publiquement lisibles'
  ) THEN
    CREATE POLICY "Praticiens photos publiquement lisibles"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'praticiens-photos');
  END IF;
END$$;
