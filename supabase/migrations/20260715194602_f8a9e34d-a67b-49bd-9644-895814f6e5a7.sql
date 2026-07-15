
CREATE TABLE public.specialites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  nom text NOT NULL,
  description_courte text NOT NULL,
  description_longue text NULL,
  synonymes text[] NOT NULL DEFAULT '{}',
  actif boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.specialites TO anon;
GRANT SELECT ON public.specialites TO authenticated;
GRANT ALL ON public.specialites TO service_role;

ALTER TABLE public.specialites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active specialites"
  ON public.specialites FOR SELECT
  USING (actif = true);

CREATE TRIGGER update_specialites_updated_at
  BEFORE UPDATE ON public.specialites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.specialites (slug, nom, synonymes, description_courte) VALUES
('psychologue-bordeaux', 'Psychologue', ARRAY['psychologue','psychologue clinicienne','psychologue clinicien','psychologie clinique','psychologue du travail','psychologie du travail'], 'Consulter une ou un psychologue : un accompagnement fondé sur un diplôme d''État, pour traverser une difficulté ou y voir plus clair.'),
('psychotherapeute-bordeaux', 'Psychothérapeute', ARRAY['psychothérapeute','psychopraticienne','psychopraticien','psychothérapie','psychothérapie humaniste','psychothérapie intégrative','gestalt-thérapie','thérapie brève'], 'Un espace de parole régulier pour travailler en profondeur ce qui fait souffrir ou se répète.'),
('sophrologue-bordeaux', 'Sophrologue', ARRAY['sophrologie','sophrothérapie'], 'Respiration, détente musculaire et visualisation pour apaiser le corps et l''esprit au quotidien.'),
('naturopathe-bordeaux', 'Naturopathe', ARRAY['naturopathie'], 'Une approche globale du bien-être : hygiène de vie, alimentation, équilibre nerveux.'),
('therapie-emdr-bordeaux', 'Thérapie EMDR', ARRAY['EMDR','thérapie EMDR','thérapeute EMDR / DMO','DMO'], 'Une méthode reconnue pour retraiter les souvenirs douloureux et apaiser les traumatismes.'),
('massage-bien-etre-bordeaux', 'Massage bien-être', ARRAY['massage bien-être','praticienne en massage bien-être','praticien en massage bien-être','kobido','shiatsu','réflexologie plantaire','reiki'], 'Des pratiques manuelles de détente pour relâcher les tensions et se reconnecter à son corps.'),
('hypnotherapeute-bordeaux', 'Hypnothérapeute', ARRAY['hypnose','hypnothérapie'], 'L''hypnose thérapeutique pour mobiliser ses ressources et changer ce qui résiste.'),
('dieteticien-bordeaux', 'Diététicien-nutritionniste', ARRAY['diététicienne','diététicien','diététique','nutrition','diététicienne nutritionniste'], 'Un accompagnement nutritionnel personnalisé, sans injonction, ancré dans le quotidien.'),
('osteopathe-bordeaux', 'Ostéopathe', ARRAY['ostéopathie'], 'Des mains expertes pour soulager les douleurs articulaires, musculaires et fonctionnelles.'),
('sage-femme-bordeaux', 'Sage-femme', ARRAY['maïeutique'], 'Suivi gynécologique de prévention, grossesse et post-partum : un accompagnement de proximité.'),
('medecin-generaliste-bordeaux', 'Médecin généraliste', ARRAY['médecine générale'], 'Le premier recours pour votre santé et celle de votre famille.');
