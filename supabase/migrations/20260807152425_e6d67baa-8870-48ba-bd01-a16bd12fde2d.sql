INSERT INTO public.professions
  (slug, nom_masculin_singulier, nom_feminin_singulier, nom_inclusif_pluriel, ordre_affichage, actif, page_installation)
VALUES
  ('medecin-specialiste', 'Médecin spécialiste', 'Médecin spécialiste', 'Médecins spécialistes', 85, true, false),
  ('chirurgien-dentiste', 'Chirurgien-dentiste', 'Chirurgienne-dentiste', 'Chirurgiennes et chirurgiens-dentistes', 100, true, false),
  ('masseur-kinesitherapeute', 'Masseur-kinésithérapeute', 'Masseuse-kinésithérapeute', 'Masseuses et masseurs-kinésithérapeutes', 110, true, false),
  ('infirmier', 'Infirmier', 'Infirmière', 'Infirmières et infirmiers', 120, true, false),
  ('orthophoniste', 'Orthophoniste', 'Orthophoniste', 'Orthophonistes', 130, true, false)
ON CONFLICT (slug) DO NOTHING;

NOTIFY pgrst, 'reload schema';