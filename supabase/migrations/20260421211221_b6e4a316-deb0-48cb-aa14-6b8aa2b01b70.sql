
-- Update Floirac with new copy and address
UPDATE public.projets SET
  name = 'I-CA.RE Floirac',
  address = '23 avenue de la Libération, 33270 Floirac',
  delivery_date = 'Q4 2026',
  status = 'en_travaux',
  surface_m2 = 300,
  units_count = 15,
  short_description = 'Ouverture Q4 2026 à Floirac, rive droite de Bordeaux. 15 cabinets paramédicaux clé en main, 11–15 m², 550–650 €/mois.',
  short_description_en = 'Opening Q4 2026 in Floirac, Bordeaux right bank. 15 turnkey paramedical offices, 11–15 sqm, €550–650/month.',
  long_description = E'À Floirac, rive droite de Bordeaux, ce projet de 300 m² est notre plus grande opération à date. 15 cabinets paramédicaux y seront aménagés autour d''une salle d''attente mutualisée. Un format qui permet à un véritable écosystème pluridisciplinaire de se constituer au sein d''un même lieu : psychologues, ostéopathes, diététiciens, sophrologues, naturopathes, et autres métiers du soin et du bien-être.\n\nLa requalification complète préservera l''identité architecturale du bâtiment tout en intégrant l''ensemble des standards I-CA.RE : conformité ERP et PMR, isolation acoustique renforcée, éclairage naturel optimisé, matériaux chaleureux, équipements techniques modernes.\n\nLoyers maîtrisés entre 550 et 650 € hors charges, selon les surfaces et spécificités de chaque cabinet.\n\nPlan d''aménagement en cours de finalisation.',
  long_description_en = E'In Floirac, on the right bank of Bordeaux, this 300 sqm project is our largest operation to date. 15 paramedical offices will be set up around a shared waiting room. A format that allows a true multidisciplinary ecosystem to take root in a single location: psychologists, osteopaths, dietitians, sophrologists, naturopaths and other care and wellbeing professionals.\n\nThe full redevelopment will preserve the building''s architectural identity while integrating all I-CA.RE standards: ERP and accessibility compliance, reinforced acoustic insulation, optimised natural light, warm materials, modern technical equipment.\n\nControlled rents between €550 and €650 excluding charges, depending on the size and features of each office.\n\nLayout plan being finalised.',
  key_features = ARRAY['15 cabinets paramédicaux', 'Salle d''attente mutualisée', '11–15 m² par cabinet', '550–650 € HT/mois', 'Permis déposé', 'Ouverture Q4 2026', 'Conformité ERP et PMR', 'Isolation acoustique renforcée'],
  key_features_en = ARRAY['15 paramedical offices', 'Shared waiting room', '11–15 sqm per office', '€550–650/month excl.', 'Permit filed', 'Opening Q4 2026', 'ERP and accessibility compliant', 'Reinforced acoustic insulation']
WHERE slug = 'i-ca-re-floirac';

-- Update Lormont with new copy and address
UPDATE public.projets SET
  name = 'I-CA.RE Lormont',
  address = '1 rue Marc Tallavi, 33310 Lormont',
  delivery_date = 'Q2 2027',
  status = 'en_travaux',
  surface_m2 = 100,
  units_count = 5,
  short_description = 'Ouverture Q2 2027 à Lormont, rive droite de Bordeaux. 5 cabinets paramédicaux clé en main, 11–15 m², 550–650 €/mois.',
  short_description_en = 'Opening Q2 2027 in Lormont, Bordeaux right bank. 5 turnkey paramedical offices, 11–15 sqm, €550–650/month.',
  long_description = E'À Lormont, rive droite de Bordeaux, ce projet de 100 m² accueillera 5 cabinets paramédicaux et une salle d''attente mutualisée. Un format granulaire qui permet à une petite communauté de praticiens de s''implanter durablement dans un quartier résidentiel en croissance, proche de ses habitants.\n\nComme chaque lieu I-CA.RE, l''aménagement intégrera l''ensemble des standards techniques et architecturaux : cloisons et portes acoustiques, revêtements chaleureux, pompe à chaleur réversible, éclairage LED sur variateur, points d''eau en cabinet, conformité ERP et PMR.\n\nLoyers maîtrisés entre 550 et 650 € hors charges, selon les surfaces et spécificités de chaque cabinet.',
  long_description_en = E'In Lormont, on the right bank of Bordeaux, this 100 sqm project will host 5 paramedical offices and a shared waiting room. A granular format that allows a small community of practitioners to settle sustainably in a growing residential neighbourhood, close to its residents.\n\nLike every I-CA.RE location, the layout will integrate all our technical and architectural standards: acoustic partitions and doors, warm finishes, reversible heat pump, dimmable LED lighting, water points in each office, ERP and accessibility compliance.\n\nControlled rents between €550 and €650 excluding charges, depending on the size and features of each office.',
  key_features = ARRAY['5 cabinets paramédicaux', 'Salle d''attente mutualisée', '11–15 m² par cabinet', '550–650 € HT/mois', 'Permis déposé', 'Ouverture Q2 2027', 'Cloisons et portes acoustiques', 'Pompe à chaleur réversible'],
  key_features_en = ARRAY['5 paramedical offices', 'Shared waiting room', '11–15 sqm per office', '€550–650/month excl.', 'Permit filed', 'Opening Q2 2027', 'Acoustic partitions and doors', 'Reversible heat pump']
WHERE slug = 'i-ca-re-lormont';

-- Insert Toulouse Capitole
INSERT INTO public.projets (
  slug, name, city, address, show_address, status, typology,
  surface_m2, units_count, delivery_date,
  short_description, short_description_en,
  long_description, long_description_en,
  key_features, key_features_en
) VALUES (
  'i-ca-re-toulouse-capitole',
  'I-CA.RE Toulouse Capitole',
  'Toulouse',
  '5 rue de Mirepoix, 31000 Toulouse',
  true,
  'en_travaux',
  'cabinet_medical',
  100,
  5,
  'Q4 2026',
  'Ouverture Q4 2026 en plein cœur de Toulouse (quartier Capitole). 5 cabinets paramédicaux clé en main, 11–15 m², 550–800 €/mois.',
  'Opening Q4 2026 in the heart of Toulouse (Capitole district). 5 turnkey paramedical offices, 11–15 sqm, €550–800/month.',
  E'Au cœur de Toulouse, à deux pas de la place du Capitole, ce lieu de 100 m² accueillera 5 cabinets paramédicaux et une salle d''attente. Le local était déjà exploité comme cabinet par des psychologues — un indice fort de son adéquation naturelle aux métiers du soin.\n\nPar son volume, sa proximité immédiate d''un lieu de vie emblématique et la qualité de son enveloppe patrimoniale toulousaine (brique, volumes voûtés), Toulouse Capitole évoque notre réalisation bordelaise Pey-Berland — aujourd''hui complet, avec 8 praticiens en exercice. Nous y apportons la même exigence : rénovation intégrale, cloisons et portes acoustiques, revêtements chaleureux, pompe à chaleur réversible, éclairage LED sur variateur, points d''eau en cabinet, système visiophone avec mode cabinet.\n\nLoyers maîtrisés entre 550 et 800 € hors charges, selon les surfaces et spécificités de chaque cabinet.\n\nPlans et visuels détaillés disponibles sur demande.',
  E'In the heart of Toulouse, a stone''s throw from Place du Capitole, this 100 sqm location will host 5 paramedical offices and a waiting room. The space was already operated as a practice by psychologists — a strong indication of its natural fit for care professions.\n\nThrough its volume, immediate proximity to an iconic city landmark, and the quality of its Toulouse heritage envelope (brick, vaulted volumes), Toulouse Capitole echoes our Bordeaux project Pey-Berland — now full, with 8 practitioners in practice. We bring the same standards: complete renovation, acoustic partitions and doors, warm finishes, reversible heat pump, dimmable LED lighting, water points in each office, video intercom with practice mode.\n\nControlled rents between €550 and €800 excluding charges, depending on the size and features of each office.\n\nDetailed plans and visuals available on request.',
  ARRAY['5 cabinets paramédicaux', 'Salle d''attente mutualisée', '11–15 m² par cabinet', '550–800 € HT/mois', 'Permis obtenu', 'Ouverture Q4 2026', 'Architecture patrimoniale toulousaine', 'À l''angle de la rue des Jacobins', 'Cloisons et portes acoustiques', 'Pompe à chaleur réversible'],
  ARRAY['5 paramedical offices', 'Shared waiting room', '11–15 sqm per office', '€550–800/month excl.', 'Permit obtained', 'Opening Q4 2026', 'Toulouse heritage architecture', 'At the corner of rue des Jacobins', 'Acoustic partitions and doors', 'Reversible heat pump']
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  address = EXCLUDED.address,
  show_address = EXCLUDED.show_address,
  status = EXCLUDED.status,
  typology = EXCLUDED.typology,
  surface_m2 = EXCLUDED.surface_m2,
  units_count = EXCLUDED.units_count,
  delivery_date = EXCLUDED.delivery_date,
  short_description = EXCLUDED.short_description,
  short_description_en = EXCLUDED.short_description_en,
  long_description = EXCLUDED.long_description,
  long_description_en = EXCLUDED.long_description_en,
  key_features = EXCLUDED.key_features,
  key_features_en = EXCLUDED.key_features_en;
