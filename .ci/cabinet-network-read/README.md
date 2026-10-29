# Réseau public du cabinet courant

[D] ICARE-RESEAU-CABINET-LECTURE-COURANTE-1. Deux produits seulement : src/hooks/usePraticiensCabinet.ts et src/components/SectionPraticiensDuCabinet.tsx. CartePraticienPublic, ProjetDetail, SDK, schéma, PR45 et prérenduPR44 readonly. Claude intègre après revue indépendante.

[M] Le lecteur exige un tableau qualifié, un compte exact entier stable et un ordre nom.asc/slug.asc. Le slug est UNIQUE, les trois tableaux de chaînes NOTNULL dans les migrations lues. Les filtres cabinet_slug, statut_validation=validee et actif=true sont identiques. Il avance du nombre reçu malgré un plafond serveur inférieur à200, au plus50 pages/10000 lignes. Refus, nul, corps incompatible, compte absent/changeant, doublon ou borne restent inconnus. Un compte stable ne crée pas de snapshot transactionnel.

[M] Une identité de visite sépare aussi A/B/A, avant l'effet du nouveau contexte. La reprise garde la génération et la visite courantes. Aucun reçu partiel, ancien réseau ou ancien JSON-LD n'est publié. Les cartes et les objets schema.org restent ceux d'origine ; la limite huit cartes est maintenant nommée. Les spécialités proviennent de toute la collection confirmée, les huit serviceProvider correspondent aux huit cartes comme avant.

[D] Contrat prérendu : data-praticiens-cabinet porte toujours le nombre de cartes rendues après réception complète, maximum8 ;0 seulement sur vide confirmé. Chargement et erreur ne portent pas ce marqueur ni JSON-LD. Aucun nouveau marqueur de fin, timeout ou règle de tolérance du script. Le script existant peut donc rester en attente puis appliquer sa politique propre sur une erreur : limite à recevoir par Claude. Ni schéma ni prérendu exécutés réellement.

[M] Les chaînes JSON-LD sont sérialisées avec les signes inférieur encodés en échappement JSON. Une fermeture littérale de script ne peut plus créer de balise en reparsing HTML. Le test utilise DOMParser inerte et une chaîne sans programme, sans événement et sans contenu exécuté ; JSON.parse restitue exactement ses valeurs.

[D] Depuis la racine avec les outils existants :

```sh
node .ci/cabinet-network-read/node_modules/vitest/vitest.mjs run --config .ci/cabinet-network-read/vitest.config.ts
node node_modules/typescript/bin/tsc --noEmit -p .ci/cabinet-network-read/tsconfig.json
node node_modules/eslint/bin/eslint.js src/hooks/usePraticiensCabinet.ts src/components/SectionPraticiensDuCabinet.tsx .ci/cabinet-network-read/Network.read.test.tsx
```

[M]34cas distincts acquis par deux groupes7causes puis27contrats/courses/préservations, aucun ancien vert rejoué. Quatre inverses rouges ciblés détectent retrait de pagination, portée de visite, génération et encodage littéral. Les deux produits sont restaurés byte exacts. Types/lint ciblés et fixture propres. Les avertissements du Router6 sur ses futurs flags ne sont pas des erreurs produit.

[M] Dix états390px de huit scènes, vrais hook/section/cartes/Router sous SDK doublé, zéro requête externe/erreur/débordement. Refus, nul, vide, attente, reçu, limite8, reprise reçue, transitionB en attente. Trois captures inspectées. Photos de fixture nulles, import Google Fonts omis dans la CSS de fixture seulement ; aucun rendu médical ou requête réel.

[D] build-fixture.mjs puis TailwindCLI et capture390.mjs permettent une reproduction locale. La capture ouvre temporairement127.0.0.1 et Chrome headless, bloque les autres origins et ferme le serveur. inverse.py modifie/restaure les produits pour les quatre contretests : uniquement dans une copie de revue dédiée.

```sh
node .ci/cabinet-network-read/build-fixture.mjs
node .ci/cabinet-network-read/node_modules/tailwindcss/lib/cli.js -i .ci/cabinet-network-read/fixture/styles.css -c .ci/cabinet-network-read/fixture/tailwind.config.ts -o .ci/cabinet-network-read/proof/browser-dist/styles.css
node .ci/cabinet-network-read/capture390.mjs
```

[M] Manifeste/verrou isolés héritent des outils Contact existants, versions Vitest3.2.7/Vite5.4.21/jsdom20.0.3 inchangées, seuls noms du paquet adaptés. Aucune installation ou modification racine. Les symlinks node_modules locaux ne sont pas livrés. Références primaires déjà lues pour ces appels : https://supabase.com/docs/reference/javascript/range et https://supabase.com/docs/reference/javascript/select ; schéma versionné et types réels lus avant produit. Aucun test DB autorisé, aucun SDK métier réel appelé.
