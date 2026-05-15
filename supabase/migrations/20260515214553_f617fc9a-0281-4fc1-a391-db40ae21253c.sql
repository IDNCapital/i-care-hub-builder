
-- Table ville
CREATE TABLE public.installation_content_ville (
  ville_slug text PRIMARY KEY REFERENCES public.projets(slug_installation) ON DELETE CASCADE,
  cabinet_details_md text,
  quartier_md text,
  acces_md text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.installation_content_ville ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contenu ville publiquement lisible"
  ON public.installation_content_ville FOR SELECT
  USING (true);
CREATE TRIGGER installation_content_ville_set_updated_at
  BEFORE UPDATE ON public.installation_content_ville
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Table profession
CREATE TABLE public.installation_content_profession (
  profession_slug text PRIMARY KEY REFERENCES public.professions(slug) ON DELETE CASCADE,
  enjeux_md text,
  patientele_md text,
  pourquoi_idn_md text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.installation_content_profession ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contenu profession publiquement lisible"
  ON public.installation_content_profession FOR SELECT
  USING (true);
CREATE TRIGGER installation_content_profession_set_updated_at
  BEFORE UPDATE ON public.installation_content_profession
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Table commune
CREATE TABLE public.installation_content_common (
  content_key text PRIMARY KEY,
  content_md text NOT NULL,
  titre_section text NOT NULL,
  ordre integer NOT NULL DEFAULT 100,
  actif boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.installation_content_common ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contenu commun actif publiquement lisible"
  ON public.installation_content_common FOR SELECT
  USING (actif = true);
CREATE TRIGGER installation_content_common_set_updated_at
  BEFORE UPDATE ON public.installation_content_common
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed unique
INSERT INTO public.installation_content_common (content_key, titre_section, ordre, actif, content_md)
VALUES (
  'comment_sinstaller',
  'Comment s''installer',
  10,
  true,
  E'Le parcours d''installation au sein d''un cabinet I-CA.RE se déroule en quatre temps.\n\n**1. Demande de dossier.** Vous demandez le dossier d''installation via le formulaire dédié. Vous recevez sous 48 heures les informations détaillées sur le cabinet : plans, surfaces disponibles, conditions de location, équipements inclus et planning prévisionnel.\n\n**2. Échange et visite.** Un échange téléphonique permet de cadrer votre projet. Une visite du cabinet est organisée — sur place si la livraison est proche, sur plans architecturaux si le projet est en amont.\n\n**3. Réservation.** Si le cabinet correspond à votre pratique, vous réservez l''espace via une promesse de location. Cette étape sécurise votre installation et engage l''équipe I-CA.RE sur les délais convenus.\n\n**4. Installation.** À la livraison, vous emménagez dans un cabinet entièrement équipé et opérationnel. L''équipe I-CA.RE reste à vos côtés sur les premiers mois pour faciliter votre installation, votre référencement et votre intégration au réseau de praticiennes et praticiens du cabinet.'
);
