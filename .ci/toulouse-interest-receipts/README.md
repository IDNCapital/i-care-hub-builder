# Réception de la liste d'intérêt Toulouse

Tests isolés du vrai composant public. Aucun service ou SDK réel ne doit être appelé.
Depuis la racine, avec les dépendances du site et les outils déjà disponibles :

```
node .ci/toulouse-interest-receipts/node_modules/vitest/vitest.mjs run --config .ci/toulouse-interest-receipts/vitest.config.ts
node node_modules/typescript/bin/tsc --noEmit -p .ci/toulouse-interest-receipts/tsconfig.json
node node_modules/eslint/bin/eslint.js src/pages/LocationCabinetToulouse.tsx .ci/toulouse-interest-receipts/Toulouse.recu.test.tsx
```

Vitest3.2.7, Vite5.4.21 et jsdom20.0.3 repris du verrou existant du lot Contact ; aucun workflow ni dépendance racine modifié. Le graphe React et ReactDOM vient des dépendances du site. Le lien node_modules local n'est pas livré.

Le test remplace SDK, Analytics, traductions, Layout, référentiels et Select par des doubles déclarés. Il garde le vrai formulaire, ses champs, consentement, validation, payload et navigation Router. Fetch échoue s'il est appelé. La capture distincte utilise les vrais contrôles Radix et traductions du dépôt, hooks/SDK/Analytics/Layout/images restant doublés.

Un reçu serveur ne démontre ni email reçu, ni synchronisation CRM, ni absence de doublon côté serveur. Le verrou est local à la visite ; aucun mécanisme d'idempotence, persistance entre onglets ou annulation serveur n'est ajouté. Les captures, causes, inverses, invariants et limites sont remis avec DELIVERY.md au parent pour revue et intégration par Claude.
