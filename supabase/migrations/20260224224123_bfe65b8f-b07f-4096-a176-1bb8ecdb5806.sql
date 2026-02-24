
ALTER TABLE public.projets
  ADD COLUMN IF NOT EXISTS short_description_en TEXT,
  ADD COLUMN IF NOT EXISTS long_description_en TEXT,
  ADD COLUMN IF NOT EXISTS key_features_en TEXT[] DEFAULT '{}'::text[];
