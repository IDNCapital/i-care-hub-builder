# Gardes de publication

Exécuter `node tests/run-tests.mjs` avec Node 24. La CI lance ces tests avant le build strict.

Les 14 cas exécutent les vrais scripts de sitemap et de prerender sur des fixtures temporaires : données saines, données invalides, panne réseau et anomalie suivie d'une panne. Une anomalie déjà constatée doit empêcher la publication, même avec `PRERENDER_OPTIONAL=true`. Les artefacts précédents doivent rester intacts.

Les accès réseau, DOM et navigateur sont remplacés par des doubles explicites. Le serveur local temporaire du prerender doit pouvoir ouvrir son port 45678 ; ne pas lancer simultanément un autre prerender sur ce port. Les cas sains de prerender vérifient l'arrivée au navigateur, pas une capture complète. Celle-ci est couverte séparément par `bun run build:ci` et les contrôles de pages de la CI.

Les doubles restent sous `tests/doubles/modules`, puis sont copiés dans le `node_modules` temporaire de chaque cas. Aucun runtime mutable ni donnée de production ne sert de fixture.

Lot WEB-GARDE-MUETTE, 6 septembre 2026 : développement initial Claude Fable, reprise ciblée Claude Sonnet après revue Codex. Codex assure l'intégration et les vérifications indépendantes. Les relevés détaillés sont conservés dans le dossier partagé Pilotage manager IA.
