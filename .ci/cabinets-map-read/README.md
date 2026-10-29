# Lecture entière de la carte des cabinets

[D] Lot ICARE-CARTE-CABINETS-LECTURE-ENTIERE-1, un seul produit : src/components/CarteCabinets.tsx. Claude conserve l'intégration. Aucune CI ou publication ajoutée.

[M] Le composant reçoit l'ensemble géolocalisé avant d'afficher ses compteurs, marqueurs ou liste. La projection et les deux filtres not-null restent ceux d'origine. L'ordre name puis slug utilise le slug UNIQUE du schéma. Chaque page exige un count exact entier stable ; la progression suit le nombre réellement reçu, même si le serveur rend moins de200 lignes. Au plus50 pages et10000 lignes ; compte inconnu/changeant, page vide prématurée, doublon slug, structure contradictoire ou dépassement ne publient aucun résultat partiel. Ce contrôle ne crée pas d'instantané transactionnel.

[M] Les erreurs, valeurs nulles et rejets ont un message borné et une reprise manuelle. L'URL courante sélectionne un cabinet du reçu courant sans relire la collection globale à chaque recherche. Un ancien callback de navigation est ignoré. Choisir dans Toutes conserve les autres métropoles ; un deep-link externe rend sa sélection visible. Les liens de détail et libellés de contrôle/popup sont FR/EN. La liste apparaît aussi après une erreur de tuiles si showSidebar était false.

[D] Recette depuis la racine, avec les dépendances existantes :

```sh
node .ci/cabinets-map-read/node_modules/vitest/vitest.mjs run --config .ci/cabinets-map-read/vitest.config.ts
node node_modules/typescript/bin/tsc --noEmit -p .ci/cabinets-map-read/tsconfig.json
node node_modules/eslint/bin/eslint.js src/components/CarteCabinets.tsx .ci/cabinets-map-read/CarteCabinets.read.test.tsx
```

[M] Le manifeste isolé et son verrou reprennent les versions Vitest3.2.7, Vite5.4.21 et jsdom20.0.3 du harnais Contact existant, seuls les noms du paquet ont changé. Aucun paquet installé pour ce lot, aucun manifeste ou verrou racine modifié. Les symlinks locaux node_modules ne sont pas livrés. React/Router sont ceux du dépôt ; les alias explicites évitent un second React des outils.

[M] Trente huit cas distincts acquis par groupes : sept causes rouges puis vertes, vingt huit contrats/courses/parcours/gardes, un ancien callback, une préservation de filtre et une localisation popup. Deux cas précédemment verts ont seulement été rejoués après la correction du filtre. Les types/lint ciblés ont été repris après les vrais deltas. Aucun rejeu global de tests verts. Les trois premiers inverses sont acquis avant le dernier delta de libellés anglais ; celui ci a son inverse final distinct. La source est restaurée byte exacte après chaque inverse.

[D] Preuves locales sous proof : causal-base.log, causal-fixed.log, contracts-first.log, context-first.log, filter-preservation-red.log puis fixed, language-delta.log ; inverses.json et inverse-final-language.json ; captures390/results.json et dix images issues de neuf scènes/parcours. Les sorties historiques montrent aussi un avertissement lint de cleanup ensuite supprimé, puis un échec du harnais navigateur à deux React, corrigé en unifiant ses alias. Ces échecs ne sont pas présentés comme des reçus finaux verts.

[D] Reproduire les captures locales uniquement : build-fixture.mjs construit la coque avec le vrai composant ; la commande Tailwind suivante applique les vrais tokens/classes sans l'import distant Google Fonts ; capture390.mjs ouvre temporairement un serveur127.0.0.1 et Chrome headless. Le serveur est fermé à la fin.

```sh
node .ci/cabinets-map-read/build-fixture.mjs
node .ci/cabinets-map-read/node_modules/tailwindcss/lib/cli.js -i .ci/cabinets-map-read/fixture/styles.css -c .ci/cabinets-map-read/fixture/tailwind.config.ts -o .ci/cabinets-map-read/proof/browser-dist/styles.css
node .ci/cabinets-map-read/capture390.mjs
```

[M] La fixture utilise le vrai Router, la vraie barrière MapErrorBoundary, les vrais helpers géographiques, de marque, de trimestre et de lien Maps. SDK, Leaflet et tuiles sont doublés ; fetch est interdit dans les tests et les captures bloquent tout autre origin que le serveur local. La carte simulée est explicitement signalée dans les images. Le contrôle couvre la réception/UI, pas la géométrie ou les animations réelles de Leaflet, l'état des tuiles, les données ou RLS déployées.

[D] Les inverses optionnels modifient puis restaurent le produit dans une copie dédiée seulement : inverse.py et son bloc finally. Ils ne sont pas une commande de production ou de soumission. Les tests de ce lot ne doivent pas déclencher de parcours réel.

[M] Références primaires lues le29/10 : https://supabase.com/docs/reference/javascript/range (bornes inclusives et nécessité d'un ordre), https://supabase.com/docs/reference/javascript/select (count exact), changelogSupabase parcouru via sa page HTML après refus du contenu text/markdown par l'outil web. Contrats locaux : types.ts et migration cd2374a3, lat/lng validés par geo.ts345275ed readonly.
