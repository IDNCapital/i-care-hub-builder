-- Add lat/lng columns to projets for map rendering
ALTER TABLE public.projets
  ADD COLUMN IF NOT EXISTS lat numeric(9, 6),
  ADD COLUMN IF NOT EXISTS lng numeric(9, 6);

-- Seed coordinates for the 7 known cabinets
UPDATE public.projets SET lat = 44.819387, lng = -0.576871 WHERE slug = 'i-ca-re-nansouty';
UPDATE public.projets SET lat = 44.848312, lng = -0.575084 WHERE slug = 'i-ca-re-jardin-public';
UPDATE public.projets SET lat = 44.839664, lng = -0.576338 WHERE slug = 'i-ca-re-pey-berland';
UPDATE public.projets SET lat = 44.856529, lng = -0.570650 WHERE slug = 'i-ca-re-chartrons';
UPDATE public.projets SET lat = 44.836600, lng = -0.531600 WHERE slug = 'i-ca-re-floirac';
UPDATE public.projets SET lat = 44.875800, lng = -0.523200 WHERE slug = 'i-ca-re-lormont';
UPDATE public.projets SET lat = 43.604400, lng =  1.443900 WHERE slug = 'i-ca-re-toulouse-capitole';