# Choix de mesure, Storage refuse

Trois produits seulement : CookieBanner.tsx, useAnalytics.ts et analyticsConsent.ts. Les helpers Analytics, les evenements/payloads, les routes, locales, fournisseurs et politiques restent exacts aux blobs mainIcare8d2cc69e. Le nouveau helper garde exclusivement le choix explicite dans la memoire du module, pour la visite courante, et ne cree aucun autre stockage, evenement ou transmission. Son ecriture est un geste utilisateur, sans relance automatique ; une relecture exacte confirme separement la persistance.

Les nouveaux tests montent le vrai composant avec les vrais Button, traductions et Router, ainsi que le vrai hook compose. Seuls Storage et Analytics sont doubles. Ils bloquent fetch et recoivent les erreurs Window. Ils testent absence/opaque/accepted/refused, lecture/ecriture et relecture refusees separement, set silencieux, choix valide conserve, langues/liens, ancien accepted non ecrase puis refus et navigation/scroll, acceptation explicite prioritaire et payloads/seuil de scroll inchanges.

Dependances deja presentes, aucune installation. node_modules racine pointe vers les dependances React19 de Icare ; node_modules local .ci pointe vers les outils Vitest existants du Hub. La configuration de test impose les resolutions React/Router/I18n de Icare pour eviter deux copies de React.

```sh
node .ci/cookie-choice-storage/node_modules/vitest/vitest.mjs run --config .ci/cookie-choice-storage/vitest.config.ts
node_modules/.bin/tsc -p .ci/cookie-choice-storage/tsconfig.json
node_modules/.bin/eslint src/components/CookieBanner.tsx src/hooks/useAnalytics.ts src/lib/analyticsConsent.ts .ci/cookie-choice-storage/CookieBanner.test.tsx
node .ci/cookie-choice-storage/inverse.mjs
node .ci/cookie-choice-storage/build-mobile.mjs
node_modules/.bin/tailwindcss -i src/index.css -o .ci/cookie-choice-storage/mobile.css --minify
node .ci/cookie-choice-storage/mobile.mjs
```

L'inverse retire temporairement la priorite memoire, attend le seul cas critique rouge et restaure les octets en finally ; ne pas lancer pendant une edition concurrente. La fixture390 monte les vrais produits et traductions, Analytics et Storage seuls sont doubles. Elle exclut correctement l'import de polices distantes du CSS genere et bloque toutes les requetes. Les captures FR/refus et EN/acceptation ont ete inspectees. Les controles de bords portent sur les elements, pas seulement scrollWidth.

Preuves conservees : rougebase2 puis20verts ; inverse1rouge ; typesstrict0/lint0 ; deux langues390 sans requete ni erreur. Une annotation de types des espions a ete corrigee apres les20verts, sans changement du JavaScript transpile (recu type-only). Ensuite une classe mobile de largeur a ete precisee et seule la preuve visuelle affectee rejouee. Les tentatives de fixture non concluantes sont conservees : React duplique, import de police bloque, build initial utilisant un package.json non exporte puis retrait incorrect de l'import contenant des points virgules. Elles ne qualifient pas le produit ou une collecte reelle.

Limites : un refus ne retire pas une requete ou un evenement deja emis avant le geste ; le contrat removeGTM existant est conserve et ne promet ni effacement des cookies ni annulation retroactive. Les autres appels Analytics non conditionnes par useAnalytics restent hors lot. Apres rechargement, une ancienne valeur persistante peut revenir si la nouvelle n'a pas ete memorisee ; la phrase FR/EN le dit. Aucun gestionnaire global de preferences ou nouvelle politique n'est cree.

Delta de revue parent : après un choix confirmé, les préférences persistantes sont relues ; le dernier état observé reste le repli si la lecture devient indisponible. Le helper n'écoute pas les événements entre onglets. Voir DELIVERY.md et parent-review-delta-final-green.log.
