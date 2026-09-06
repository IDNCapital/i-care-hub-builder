# Gardes de publication

Exécuter `node tests/run-tests.mjs` avec Node 24. La CI lance ces tests avant le build strict.

Les 14 cas exécutent les vrais scripts de sitemap et de prerender sur des fixtures temporaires : données saines, données invalides, panne réseau et anomalie suivie d'une panne. Une anomalie déjà constatée doit empêcher la publication, même avec `PRERENDER_OPTIONAL=true`. Les artefacts précédents doivent rester intacts.

Les accès réseau, DOM et navigateur sont remplacés par des doubles explicites. Le serveur local temporaire du prerender doit pouvoir ouvrir son port 45678 ; ne pas lancer simultanément un autre prerender sur ce port. Les cas sains de prerender vérifient l'arrivée au navigateur, pas une capture complète. Celle-ci est couverte séparément par `bun run build:ci` et les contrôles de pages de la CI.

Les doubles restent sous `tests/doubles/modules`, puis sont copiés dans le `node_modules` temporaire de chaque cas. Aucun runtime mutable ni donnée de production ne sert de fixture.

Lot WEB-GARDE-MUETTE, 6 septembre 2026 : développement initial Claude Fable, reprise ciblée Claude Sonnet après revue Codex. Codex assure l'intégration et les vérifications indépendantes. Les relevés détaillés sont conservés dans le dossier partagé Pilotage manager IA.

## Carte publique et récupération après erreur

`node --experimental-strip-types tests/geo.test.mts` et `tests/geo-types.test.mts` vérifient les coordonnées et les types rejetés. `node tests/map-browser.mjs` lance Vite sur un port local disponible et Chrome pour six scénarios : erreur Leaflet puis reprise locale en FR/EN, import indisponible puis rechargement en FR/EN, coordonnées partiellement ou entièrement invalides. Les composants sont réels ; les cabinets sont fictifs et toute requête externe est bloquée. Le serveur et le navigateur sont fermés en fin de test.

La fixture HTML sous tests n'est pas une entrée du build de production. Les captures facultatives utilisent MAP_TEST_ARTIFACT_DIR. La CI exécute ces recettes avant son build strict. Le contrôle TypeScript emploie `--types node` : l'inclusion implicite du paquet transitoire incomplet mapbox__point-geometry échoue déjà sur la base e6a02d43 ; avec les types ambiants explicites, la base et le correctif passent, sans désactiver les vérifications de modules importés.

Lot WEB-CARTE-LATLNG-NAN : développement et reprise ciblée Claude Sonnet, revue, recette navigateur et intégration Codex. L'origine précise du signalement historique de premier chargement reste non confirmée. Le démontage de la page sur une coordonnée invalide et les chemins de récupération sont, eux, reproduits par les essais.
