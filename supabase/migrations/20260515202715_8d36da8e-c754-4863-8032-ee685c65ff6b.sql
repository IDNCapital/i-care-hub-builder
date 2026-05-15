-- 1. Enrich projets table
ALTER TABLE public.projets
  ADD COLUMN IF NOT EXISTS date_ouverture_cible date,
  ADD COLUMN IF NOT EXISTS slug_installation text UNIQUE;

-- Backfill 4 pipeline cabinets
UPDATE public.projets SET slug_installation = 'bordeaux-chartrons', date_ouverture_cible = '2026-12-01' WHERE slug = 'i-ca-re-chartrons';
UPDATE public.projets SET slug_installation = 'toulouse-capitole', date_ouverture_cible = '2026-12-01' WHERE slug = 'i-ca-re-toulouse-capitole';
UPDATE public.projets SET slug_installation = 'floirac', date_ouverture_cible = '2027-03-01' WHERE slug = 'i-ca-re-floirac';
UPDATE public.projets SET slug_installation = 'lormont', date_ouverture_cible = '2027-06-01' WHERE slug = 'i-ca-re-lormont';

-- 2. professions table
CREATE TABLE public.professions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  nom_masculin_singulier text NOT NULL,
  nom_feminin_singulier text NOT NULL,
  nom_inclusif_pluriel text NOT NULL,
  ordre_affichage integer NOT NULL DEFAULT 100,
  actif boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.professions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professions actives publiquement lisibles"
  ON public.professions FOR SELECT
  TO anon, authenticated
  USING (actif = true);

CREATE TRIGGER set_professions_updated_at
  BEFORE UPDATE ON public.professions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.professions (slug, nom_masculin_singulier, nom_feminin_singulier, nom_inclusif_pluriel, ordre_affichage) VALUES
  ('osteopathe', 'Ostéopathe', 'Ostéopathe', 'Ostéopathes', 10),
  ('sophrologue', 'Sophrologue', 'Sophrologue', 'Sophrologues', 20),
  ('psychologue', 'Psychologue', 'Psychologue', 'Psychologues', 30),
  ('psychotherapeute', 'Psychothérapeute', 'Psychothérapeute', 'Psychothérapeutes', 40),
  ('dieteticien-nutritionniste', 'Diététicien-nutritionniste', 'Diététicienne-nutritionniste', 'Diététiciennes et diététiciens-nutritionnistes', 50),
  ('naturopathe', 'Naturopathe', 'Naturopathe', 'Naturopathes', 60),
  ('hypnotherapeute', 'Hypnothérapeute', 'Hypnothérapeute', 'Hypnothérapeutes', 70),
  ('medecin-generaliste', 'Médecin généraliste', 'Médecin généraliste', 'Médecins généralistes', 80),
  ('sage-femme', 'Sage-femme', 'Sage-femme', 'Sages-femmes', 90);

-- 3. installation_pages view
CREATE OR REPLACE VIEW public.installation_pages AS
SELECT
  pr.slug AS profession_slug,
  pr.nom_inclusif_pluriel AS profession_libelle,
  pr.ordre_affichage AS profession_ordre,
  pj.slug_installation AS ville_slug,
  pj.name AS cabinet_nom_complet,
  pj.address AS cabinet_adresse,
  pj.city AS cabinet_ville,
  pj.date_ouverture_cible AS date_ouverture,
  CONCAT('/sinstaller/', pr.slug, '/', pj.slug_installation) AS url_path,
  pj.id AS projet_id,
  pr.id AS profession_id
FROM public.professions pr
CROSS JOIN public.projets pj
WHERE pr.actif = true
  AND pj.status IN ('en_travaux', 'a_venir')
  AND pj.slug_installation IS NOT NULL
ORDER BY pr.ordre_affichage, pj.date_ouverture_cible;

GRANT SELECT ON public.installation_pages TO anon, authenticated;