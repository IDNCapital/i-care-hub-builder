# FLOIRAC-SITE-RETRAIT-0411

Remise locale du04/11/2026. Claude intégrateur et consommateur de FLOIRAC-SORTIE-1. Décision acquise de Nicolas14:49 : retrait de l'offre publique et archivage, sans nouvelle décision commerciale.

## Résultat

Floirac reste dans les données historiques du code et ses médias restent présents, mais ses deux identités connues i-ca-re-floirac et floirac ne sont plus exposées comme offre. Un petit helper propre filtre les exports publics des deux catalogues, la carte, les listes d'installation et les options du formulaire. Le comptage des coordonnées rejetées de la carte ne classe pas un projet retiré comme une erreur de géolocalisation.

Les accès directs projet FR/EN, cabinet à louer et installation renvoient l'état indisponible 404/noindex existant, sans offre, formulaire ou données structurées d'offre. Les routes projet et installation arrêtent le lecteur avant son montage. Une ancienne présélection Floirac ferme le rendu du formulaire sans modifier son handler. Les anciennes demandes de visite via /contact ou /en/contact sont aussi retirées avant montage de Contact, par une garde sur les seules routes existantes. Elle reconnaît les identités exactes du projet et les anciennes attributions page-cabinet-floirac. Un centre explicite différent conserve son parcours même avec une attribution ancienne ; ville et message libres citant Floirac restent admis. La redirection remplace la route par le catalogue de la même langue. Contact et son handler ne sont pas modifiés.

Les autres centres gardent les mêmes données, tarifs, contrats, textes, liens et commandes.

Les trois routes statiques Floirac sortent du sitemap et du tableau de prérendu ; la matrice d'installation ne génère plus ses chemins. Les requêtes restent exactes. Seule la promesse de nouveau lieu Floirac est retirée de locationBordeaux.why.neighbourhoodsDesc en FR et EN. Les exemples géographiques de ville, autres traductions et clés historiques restent exacts.

## Préimages et responsabilité

Base GitHub primaire a7aeb8fc82cc0b1c122973e8d3fa5a7e93d73805, arbre af8f91a9834aebaee17b4c8e055ce120e911258e. La copie locale ancienne n'a servi que de support initial readonly ; les sources et médias nécessaires du graphe ont été rapprochés des blobs de l'arbre ou reçus par connecteur. Les préimages exactes des fichiers modifiés sont conservées avec leurs blobs et empreintes. Aucune édition dans /Users/nico/dev/i-care-hub-builder.

useInstallation.ts de PR46, useProjects.ts et Projets.tsx de PR60, Contact.tsx de PR54 et generate-sitemap restent readonly. App change uniquement pour envelopper ses deux routes Contact existantes. Le catalogue PR60 tête9dc0f6d1 a été reçu et qualifié comme consommateur local FR/EN sous compléments reçus et en erreur ; ce contrôle ne réexécute pas ses neuf anciens tests ni son transport SDK. FormulaireInteretInstallation.handleSubmit et le handler Toulouse sont exacts ; aucune soumission invoquée.

## Preuves par phases

-17:38:51 : trois causaux rouges sur préimages primaires (catalogues, carte avec réponse Floirac et ancien paramètre, projet direct). Les autres cas sont filtrés.
-17:42:11 : vingt quatre cas verts, soit vingt deux tests de lecteurs/DOM livrables et deux preuves locales de préservation des autres catalogues, routes et entrées sitemap.
-17:44:31 : trois nouveaux cas verts du seul delta de traduction, dont deux consommateurs DOM FR/EN et une preuve locale d'identité de tout autre contenu JSON. Les vingt quatre précédents ne sont pas rejoués.
-17:47:03 : quatre nouveaux cas verts de compatibilité du catalogue PR60 readonly, FR/EN et compléments reçus/erreur. Aucun corpus précédent rejoué.

-17:52:01 : revue indépendante, quatre nouveaux causaux Contact, deux témoins Chartrons verts et deux rouges Floirac, sans soumission. Non rejoués par l'auteur.
-17:57:09 : vingt nouveaux cas verts de la garde et du vrai Contact FR/EN, ancienne attribution, centre distinct prioritaire, géographie libre et changement de query.

Ces phases ne constituent pas un replay final unique. Les tests livrés actuels contiennent quarante quatre cas ; les sept autres preuves de préservation/PR60 restent locales. Les campagnes24,3,4 ont précédé la garde ; son code et les deux routes enveloppées sont qualifiés par le delta20 et les contrôles source suivants. Les consommateurs réels sont montés sous React19.2.1 avec routes locales. SDK/client, réseau, soumission DOM et fenêtre externe sont fermés ; carte Leaflet, Layout, sections annexes et formulaires hors du test propre sont des frontières inertes déclarées. Le vrai formulaire est contrôlé séparément sans invoquer le handler.

Contrôles17:48:29 après le retrait des deux valeurs traduites, puis contrôles finaux17:58:03 après ajout de la garde Contact : types app et tests en configuration locale, lint ciblé, syntaxe des deux scripts et build frontend Vite7.2.7 code zéro. Le build utilise des valeurs VITE fictives, sans chargement de .env, serveur, génération réseau de sitemap ou prérendu. Les avertissements Browserslist ancien et taille des chunks restent conservés.

## Limites

Le typecheck primaire natif est non qualifié : le runtime contient une entrée implicite mapbox__point-geometry sans définition exploitable. La configuration locale borne les types ambiants à node et conserve le graphe app/tests ; son vert n'est pas un vert primaire global. La première tentative de chargement Vite voulait écrire dans le runtime readonly via .vite-temp ; la construction finale emploie configFile:false et écrit seulement dans les preuves. Aucun port refusé n'a été rejoué.

Le dépôt ne déclare pas le collecteur Vitest de ces cas. Collecte CI, script build complet avec sitemap/prérendu, hébergement, réception mobile et retrait effectif en production restent à qualifier par Claude dans son cadre autorisé. Aucun changement IDN OS, donnée, fichier historique ou média supprimé. Aucun GitHub de mutation, push, PR, fusion, publication, achat, API payante, installation ou nouveau canal. Le rejet create_tree n'a pas été rejoué par un autre outil.

Où trouver : copie /private/tmp/advisor-0411-1720-floirac ; patch, préimages et reçus dans /private/tmp/advisor-0411-1720-floirac-evidence ; rapport /private/tmp/FLOIRAC-SITE-1720-DELIVERY.md. Claude reçoit la revue non auteur puis compose le patch sur les préimages fraîches, avec PR46/60 inchangées ; la livraison locale n'est pas une publication.
