# Réception du formulaire d'installation

Tests du vrai formulaire avec doubles explicites. Depuis la racine, avec dépendances du site et outils déjà disponibles :

```
node .ci/installation-interest-receipts/node_modules/vitest/vitest.mjs run --config .ci/installation-interest-receipts/vitest.config.ts
node node_modules/typescript/bin/tsc --noEmit -p .ci/installation-interest-receipts/tsconfig.json
node node_modules/eslint/bin/eslint.js src/components/FormulaireInteretInstallation.tsx .ci/installation-interest-receipts/Installation.recu.test.tsx
```

Vitest3.2.7, Vite5.4.21 et jsdom20.0.3 épinglés, verrou repris de la famille Contact, aucun workflow ou manifeste racine modifié. React/ReactDOM et leurs types viennent des dépendances du site. Aucun outil installé pendant le lot ; liens node_modules locaux exclus du patch.

SDK, Analytics et référentiels sont doublés ; Select est remplacé par son équivalent natif dans les tests. Le composant, ses champs/validation/consentement/payload et Router sont réels. Fetch est bloqué. Les captures distinctes emploient les vrais contrôles Radix et des données fictives.

Le formulaire existant est en français ; le lot préserve cette interface et tous ses textes commerciaux. Les pages parentes, leurs gardes de lecture et leur éventuel démontage sont hors modification. Le test props A/B conserve volontairement le même parent pour couvrir le consommateur partagé de ProjetDetail ; les tests de démontage distinguent le callback Analytics de l'état visuel React abandonné.

La réception serveur n'est pas un email reçu ni une preuve de synchronisation CRM. Le honeypot ne constitue pas un enregistrement et ne produit pas Analytics. Le verrou est local à la visite, sans persistance, idempotence serveur ni annulation réelle. Une nouvelle tentative après ambiguïté peut créer un doublon ; deux gestes explicites préparent la saisie sans envoyer. Le reçu confirmé conserve l'écran de succès commercial existant et ajoute sa référence.
