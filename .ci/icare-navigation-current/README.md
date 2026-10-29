# Navigation Icare courante

Lot isolé. Produit unique : `src/components/Header.tsx`. Base et preuves datées dans `proof/preflight.json`. Le runtime est réutilisé, sans installation. Ne pas lancer de SDK ni analytics réels.

Commandes locales :

```
node node_modules/vitest/vitest.mjs run --config .ci/icare-navigation-current/vitest.config.ts -t 'DELTA un survol'
node node_modules/typescript/bin/tsc -p .ci/icare-navigation-current/tsconfig.json
node node_modules/eslint/bin/eslint.js src/components/Header.tsx
node .ci/icare-navigation-current/check-invariants.mjs
node .ci/icare-navigation-current/build-fixture.mjs
node .ci/icare-navigation-current/capture-delay.mjs
INVERSE_NAMES=desktop-timer python3 .ci/icare-navigation-current/inverses.py
```

Ces commandes documentent la reproduction, sans inviter à rejouer les acquis. Les scènes navigateur exigent Chromium local. La feuille fixture est générée par Tailwind à partir de `fixture-input.css`, avec fontes externes retirées dans la seule fixture. `capture390.mjs` conserve le premier protocole et ne représente pas les captures finales V2. Les douze scènes initiales sont archivées dans `proof/pre-hover-fix/mobile`. Les six scènes finales sont dans `proof/mobile`. L'option `NAV_DELAY_SCENES=tail` reprend les cinq dernières après la première, seulement à SHA produit identique.

Le vrai App, Router interne, LangSync, Index, Contact, Layout, Header et NavigationMenu sont utilisés. Les feuilles métier, SDK, analytics et traduction sont fermés ou doublés par les alias explicites. Le contrat Patients masque la langue sur Header isolé, sans qualifier la page métier Patients. Aucun effet extérieur n'est nécessaire.

L'analyse AST vérifie treize initialiseurs métier, la séquence des destinations et la séquence des classes, ainsi que dix-neuf sources officielles readonly. Les inverses utilisent des copies temporaires et vérifient que le produit de travail ne change pas. Les six inverses initiaux portent sur la version pré-minuteries ; le nouvel inverse `desktop-timer` porte sur la source finale. Ne pas réattribuer les anciens reçus à cette dernière.
