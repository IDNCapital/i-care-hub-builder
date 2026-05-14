
-- ==============================================================
-- Lot 0bis · Étape 1 — Colonnes dérivées + auto-slug + backfill
-- ==============================================================

-- 1. Extension unaccent pour le slug
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 2. Nouvelles colonnes sur praticiens (tags dérivés)
ALTER TABLE public.praticiens
  ADD COLUMN IF NOT EXISTS specialites_derivees text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS problematiques_derivees text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS tags_extraction_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS tags_extracted_at timestamptz,
  ADD COLUMN IF NOT EXISTS tags_bio_hash text,
  ADD COLUMN IF NOT EXISTS tags_extraction_log jsonb NOT NULL DEFAULT '[]'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'praticiens_tags_extraction_status_check'
  ) THEN
    ALTER TABLE public.praticiens
      ADD CONSTRAINT praticiens_tags_extraction_status_check
      CHECK (tags_extraction_status IN ('pending','success','review','error','skipped'));
  END IF;
END $$;

-- 3. Fonction de génération de slug (immutable per (prenom, nom))
CREATE OR REPLACE FUNCTION public.set_praticien_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  base text;
  candidate text;
  n int := 1;
BEGIN
  base := lower(unaccent(coalesce(NEW.prenom,'') || '-' || coalesce(NEW.nom,'')));
  base := regexp_replace(base, '[^a-z0-9]+', '-', 'g');
  base := regexp_replace(base, '-+', '-', 'g');
  base := regexp_replace(base, '^-+|-+$', '', 'g');
  IF base IS NULL OR base = '' THEN
    base := 'praticien';
  END IF;

  candidate := base;
  WHILE EXISTS (
    SELECT 1 FROM public.praticiens
    WHERE slug = candidate
      AND id IS DISTINCT FROM NEW.id
  ) LOOP
    n := n + 1;
    candidate := base || '-' || n::text;
  END LOOP;

  NEW.slug := candidate;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_praticien_slug ON public.praticiens;
CREATE TRIGGER trg_set_praticien_slug
BEFORE INSERT OR UPDATE OF prenom, nom ON public.praticiens
FOR EACH ROW EXECUTE FUNCTION public.set_praticien_slug();

-- 4. Backfill : déclencher le recalcul sur toutes les fiches existantes
UPDATE public.praticiens SET prenom = prenom;
