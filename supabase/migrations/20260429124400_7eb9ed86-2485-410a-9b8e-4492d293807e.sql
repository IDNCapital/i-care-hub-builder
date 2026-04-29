-- ============================================================
-- 1. Table praticiens
-- ============================================================
CREATE TABLE public.praticiens (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  text UNIQUE NOT NULL,
  cabinet_slug          text NOT NULL,
  prenom                text NOT NULL,
  nom                   text NOT NULL,
  genre                 text,
  profession            text NOT NULL,
  specialites           text[] NOT NULL DEFAULT '{}',
  problematiques        text[] NOT NULL DEFAULT '{}',
  bio_courte            text,
  bio_courte_en         text,
  bio_longue            text,
  bio_longue_en         text,
  photo_url             text,
  lien_rdv              text,
  google_place_id       text,
  google_kgmid          text,
  google_cid            text,
  statut_validation     text NOT NULL DEFAULT 'brouillon',
  preview_token         text UNIQUE NOT NULL DEFAULT replace(gen_random_uuid()::text, '-', ''),
  date_envoi_preview    timestamptz,
  date_validation       timestamptz,
  notes_internes        text,
  actif                 boolean NOT NULL DEFAULT true,
  ordre_affichage       integer NOT NULL DEFAULT 0,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT praticiens_genre_check
    CHECK (genre IS NULL OR genre IN ('F','M','X')),
  CONSTRAINT praticiens_statut_check
    CHECK (statut_validation IN (
      'brouillon','preview_envoyee','validee','refusee',
      'non_repondeuse','en_attente_infos','en_attente_resolution'
    ))
);

COMMENT ON TABLE public.praticiens IS 'Annuaire des praticiens locataires des cabinets I-CA.RE (Espace Patients).';
COMMENT ON COLUMN public.praticiens.cabinet_slug IS 'Lien logique vers projets.slug (pas de FK).';
COMMENT ON COLUMN public.praticiens.google_place_id IS 'Place ID Google Places API (format ChIJ... ou 0x...:0x...).';
COMMENT ON COLUMN public.praticiens.google_kgmid IS 'Knowledge Graph ID (/g/11...) pour liens directs vers la fiche GBP.';
COMMENT ON COLUMN public.praticiens.preview_token IS 'Jeton unique pour ouverture de la fiche preview par le praticien.';

-- Index
CREATE INDEX idx_praticiens_statut ON public.praticiens(statut_validation);
CREATE INDEX idx_praticiens_cabinet_slug ON public.praticiens(cabinet_slug);
CREATE INDEX idx_praticiens_google_place_id ON public.praticiens(google_place_id) WHERE google_place_id IS NOT NULL;

-- Trigger updated_at (réutilise public.update_updated_at_column existante)
CREATE TRIGGER praticiens_set_updated_at
BEFORE UPDATE ON public.praticiens
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.praticiens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Praticiens validés et actifs publiquement lisibles"
ON public.praticiens
FOR SELECT
TO anon, authenticated
USING (statut_validation = 'validee' AND actif = true);

-- Aucune politique INSERT/UPDATE/DELETE → écritures bloquées pour anon/authenticated.
-- Les opérations admin passeront par le service role (qui bypass RLS).

-- ============================================================
-- 2. RPC get_praticien_preview
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_praticien_preview(
  p_slug text,
  p_token text
)
RETURNS SETOF public.praticiens
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
    SELECT * FROM public.praticiens
    WHERE slug = p_slug
      AND preview_token = p_token
      AND statut_validation IN (
        'preview_envoyee','brouillon','validee','en_attente_infos'
      );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_praticien_preview(text, text) TO anon, authenticated;

-- ============================================================
-- 3. Table avis_google_cache
-- ============================================================
CREATE TABLE public.avis_google_cache (
  place_id            text PRIMARY KEY,
  rating              numeric(2,1),
  user_ratings_total  integer,
  reviews             jsonb NOT NULL DEFAULT '[]'::jsonb,
  google_display_name text,
  google_url          text,
  last_updated_at     timestamptz NOT NULL DEFAULT now(),
  last_error          text,
  last_error_at       timestamptz
);

COMMENT ON TABLE public.avis_google_cache IS 'Cache hebdomadaire des avis Google par Place ID (alimenté par Edge Function appelant Google Places API).';

ALTER TABLE public.avis_google_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cache avis Google publiquement lisible"
ON public.avis_google_cache
FOR SELECT
TO anon, authenticated
USING (true);

-- Aucune écriture publique : alimentation via service role uniquement.