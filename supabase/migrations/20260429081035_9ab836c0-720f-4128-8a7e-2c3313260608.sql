-- Table: temoignages_praticiens
CREATE TABLE public.temoignages_praticiens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  praticien_nom text NOT NULL,
  praticien_profession text,
  cabinet_slug text NOT NULL,
  cabinet_nom_affichage text NOT NULL,
  photo_url text,
  citation_longue text NOT NULL,
  ordre_affichage integer NOT NULL DEFAULT 0,
  actif boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.temoignages_praticiens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Témoignages praticiens publiquement lisibles"
  ON public.temoignages_praticiens
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX idx_temoignages_praticiens_actif_ordre
  ON public.temoignages_praticiens (actif, ordre_affichage);

-- Table: avis_google_mis_en_avant
CREATE TABLE public.avis_google_mis_en_avant (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auteur_prenom text NOT NULL,
  auteur_initiale_nom text,
  cabinet_slug text NOT NULL,
  cabinet_nom_affichage text NOT NULL,
  note integer NOT NULL DEFAULT 5 CHECK (note BETWEEN 1 AND 5),
  texte_avis text NOT NULL,
  date_publication date NOT NULL,
  lien_avis_google text,
  lien_fiche_gbp text,
  ordre_affichage integer NOT NULL DEFAULT 0,
  actif boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.avis_google_mis_en_avant ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Avis Google publiquement lisibles"
  ON public.avis_google_mis_en_avant
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX idx_avis_google_actif_ordre_date
  ON public.avis_google_mis_en_avant (actif, ordre_affichage, date_publication DESC);