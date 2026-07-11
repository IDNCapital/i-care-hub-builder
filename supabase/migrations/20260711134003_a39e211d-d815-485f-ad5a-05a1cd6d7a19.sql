
CREATE TABLE public.problematiques (
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

GRANT SELECT ON public.problematiques TO anon;
GRANT SELECT ON public.problematiques TO authenticated;
GRANT ALL ON public.problematiques TO service_role;

ALTER TABLE public.problematiques ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active problematiques"
  ON public.problematiques
  FOR SELECT
  TO anon, authenticated
  USING (actif = true);

CREATE TRIGGER update_problematiques_updated_at
  BEFORE UPDATE ON public.problematiques
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.problematiques (slug, nom, synonymes, description_courte) VALUES
('stress','Stress',ARRAY['gestion du stress'],'Tension permanente, sensation d''être sous pression : le stress s''installe parfois durablement et finit par peser sur le corps et l''esprit.'),
('anxiete','Anxiété',ARRAY['angoisses','troubles anxieux','crise d''angoisse'],'Inquiétudes envahissantes, anticipations constantes, sensations physiques d''alerte : l''anxiété peut prendre beaucoup de place au quotidien.'),
('burn-out','Burn-out',ARRAY['épuisement professionnel','burnout'],'Épuisement physique et émotionnel lié au travail, perte d''élan et sentiment de ne plus y arriver.'),
('souffrance-au-travail','Souffrance au travail',ARRAY['stress au travail','souffrance professionnelle'],'Conflits, pression, perte de reconnaissance : quand le travail devient une source de mal-être.'),
('traumatismes','Traumatismes',ARRAY['psychotraumatisme','trauma','blessures du passé'],'Un événement marquant peut laisser des traces durables : reviviscences, évitements, hypervigilance.'),
('troubles-du-sommeil','Troubles du sommeil',ARRAY['sommeil','insomnie','insomnies'],'Difficultés d''endormissement, réveils nocturnes, sommeil non réparateur qui use au fil des semaines.'),
('troubles-alimentaires','Troubles du comportement alimentaire',ARRAY['TCA','déséquilibres alimentaires'],'Relation compliquée à la nourriture : restrictions, compulsions, culpabilité autour des repas.'),
('estime-de-soi','Estime de soi',ARRAY['confiance en soi','manque de confiance'],'Petite voix intérieure trop critique, difficulté à se sentir légitime ou à s''affirmer.'),
('difficultes-relationnelles','Difficultés relationnelles',ARRAY['relations','conflits relationnels'],'Tensions répétées en couple, en famille ou entre proches, difficulté à se faire comprendre ou à poser des limites.'),
('transitions-de-vie','Transitions de vie',ARRAY['périodes de doute','parcours de vie difficiles','changement de vie'],'Déménagement, séparation, retraite, nouvelle étape : les grands changements bousculent les repères.'),
('transition-professionnelle','Transition professionnelle',ARRAY['transitions de carrière','orientation professionnelle','orientation','reconversion'],'Envie ou nécessité de changer de voie, questionnements sur sa place et son avenir professionnel.'),
('perte-de-sens','Perte de sens',ARRAY['questionnements','quête de sens'],'Impression de tourner en rond, de ne plus savoir pourquoi on fait les choses, besoin de se réaligner.'),
('gestion-des-emotions','Gestion des émotions',ARRAY['régulation émotionnelle','blocages émotionnels','surcharge émotionnelle','troubles émotionnels','difficultés émotionnelles','équilibre émotionnel','apaisement émotionnel'],'Émotions qui débordent ou qui restent bloquées : apprendre à les accueillir et à les réguler.'),
('douleur-chronique','Douleur chronique',ARRAY['douleurs chroniques'],'Douleurs qui durent et s''installent, avec leur retentissement sur le moral, le sommeil et la vie quotidienne.'),
('tensions-corporelles','Tensions corporelles',ARRAY['relâchement des tensions','relation au corps'],'Corps noué, crispations, difficulté à relâcher : quand les tensions physiques racontent aussi autre chose.'),
('fatigue','Fatigue',ARRAY['fatigue chronique','épuisement'],'Fatigue persistante qui ne cède pas au repos et entame l''énergie disponible pour le reste.'),
('deuil','Deuil',ARRAY['perte d''un proche'],'Traverser la perte d''un proche, avec des vagues d''émotions qui demandent du temps et parfois un soutien.'),
('separation','Séparation',ARRAY['rupture','divorce'],'Rupture amoureuse ou divorce : une période de bouleversement où un soutien fait la différence.'),
('parentalite','Parentalité',ARRAY['soutien à la parentalité'],'Doutes, épuisement, questionnements éducatifs : être parent est un rôle exigeant qui mérite un espace d''écoute.'),
('perinatalite','Périnatalité',ARRAY['grossesse','post-partum'],'Grossesse, arrivée d''un enfant, post-partum : une période intense, physiquement et émotionnellement.'),
('pression-scolaire','Pression scolaire',ARRAY['tensions liées à la pression scolaire','stress des examens'],'Examens, orientation, exigences scolaires : quand la pression pèse sur les épaules des jeunes.'),
('depression','Dépression',ARRAY['déprime','état dépressif'],'Tristesse durable, perte d''envie et d''énergie : des signes à prendre au sérieux et à accompagner.'),
('phobies','Phobies',ARRAY['peurs'],'Peurs intenses et irrationnelles qui restreignent le quotidien et que l''on peut apprendre à apprivoiser.'),
('addictions','Addictions',ARRAY['dépendances','tabac','sevrage tabagique'],'Tabac, alcool, écrans ou autres dépendances : retrouver de la liberté face à un comportement qui échappe.'),
('hypersensibilite','Hypersensibilité',ARRAY['haut potentiel'],'Ressentir tout plus fort : une richesse qui peut aussi épuiser lorsqu''elle n''est pas apprivoisée.'),
('developpement-personnel','Développement personnel',ARRAY['connaissance de soi'],'Mieux se connaître, clarifier ses besoins et avancer vers ce qui compte vraiment.'),
('schemas-repetitifs','Schémas répétitifs',ARRAY['attachement'],'Rejouer malgré soi les mêmes scénarios en amour, au travail ou en famille, et vouloir en sortir.'),
('situation-de-crise','Situation de crise',ARRAY['crise'],'Un événement soudain qui déstabilise : besoin d''un point d''appui rapide pour traverser la tempête.'),
('solitude','Solitude',ARRAY['isolement'],'Sentiment d''isolement, difficulté à créer ou maintenir des liens nourrissants.'),
('charge-mentale','Charge mentale',ARRAY['surcharge mentale'],'Penser à tout, tout le temps : une accumulation invisible qui épuise.'),
('gestion-du-poids','Gestion du poids',ARRAY['surpoids','perte de poids'],'Trouver un équilibre alimentaire durable, sans régime punitif ni culpabilité.'),
('alimentation-emotionnelle','Alimentation émotionnelle',ARRAY['compulsions alimentaires','grignotage'],'Manger pour apaiser ses émotions plutôt que sa faim : un mécanisme fréquent dont on peut sortir.'),
('relaxation','Détente et relaxation',ARRAY['détente','bien-être global'],'S''accorder un espace pour souffler, relâcher la pression et retrouver de la disponibilité.'),
('souffrance-psychique','Souffrance psychique',ARRAY['mal-être'],'Mal-être diffus ou intense, difficile à nommer, qui mérite une écoute professionnelle.'),
('mal-de-dos','Mal de dos',ARRAY['lombalgies','douleurs lombaires'],'Lombalgies et douleurs de dos qui gênent les mouvements du quotidien.'),
('menopause','Ménopause',ARRAY['périménopause'],'Bouleversements hormonaux, sommeil, humeur : une étape de vie qui mérite un accompagnement global.');
