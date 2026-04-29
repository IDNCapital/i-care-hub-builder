ALTER TABLE public.projets RENAME COLUMN google_place_id TO google_kgmid;
COMMENT ON COLUMN public.projets.google_kgmid IS 'Google Knowledge Graph ID (format /g/11...) — utilisé pour les liens directs vers la fiche Google Business Profile (onglet avis).';

ALTER TABLE public.projets ADD COLUMN IF NOT EXISTS google_place_id text;
COMMENT ON COLUMN public.projets.google_place_id IS 'Google Place ID au sens de l''API Places (format ChIJ... ou FID hex 0x...:0x...) — à renseigner lors de l''activation de Places API.';