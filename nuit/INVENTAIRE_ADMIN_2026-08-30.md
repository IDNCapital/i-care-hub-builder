# Inventaire des pages d'administration · i-care-hub-builder · 2026-08-30

Mission `[XS] [1]` de `nuit/MISSIONS.md`. Relevé, aucune page modifiée.

## Périmètre de chaque relevé, dit avant les résultats

- **Route déclarée** : lecture de `src/App.tsx`, bloc « Admin routes (hors i18n) »,
  lignes 115 à 157. Relevé de source.
- **Garde `AdminGuard`** : présence ou absence du composant `AdminGuard` autour de
  l'élément de la route, dans le même bloc de `src/App.tsx`. Relevé de source. Il ne dit
  rien de l'efficacité de la garde à l'exécution.
- **Balises de tête** : lecture du JSX de chaque page sous `src/pages/admin/`. **Ce n'est
  pas un relevé du rendu.** Le dépôt est en React 19 (`react` et `react-dom` en `^19.2.1`),
  où `<title>` et `<meta>` écrits dans le corps d'un composant sont remontés dans le
  `<head>` par React lui-même, sans bibliothèque tierce. Cette remontée n'a pas été
  observée : l'environnement de nuit n'a ni navigateur ni variables Supabase, et aucun
  prérendu n'a été lancé. **Un vert de nuit ne vaudrait pas preuve de rendu, et il n'y en
  a pas eu.**
- **JSON-LD** : recherche de `application/ld+json` dans `src/pages/admin/`. Zéro
  occurrence sur l'ensemble du dossier.

## Tableau

| Page | Route déclarée dans App.tsx | AdminGuard | title | meta | JSON-LD |
|---|---|---|---|---|---|
| `AdminLogin.tsx` | `/admin/login` (ligne 116) | **absent** | `Admin \| I‑CA.RE` (l. 41) | `robots` = `noindex, nofollow` (l. 42) | aucun |
| `AdminPraticiens.tsx` | `/admin/praticiens` (l. 118 à 124) | présent | `Praticiens \| Admin I‑CA.RE` (l. 343) | `robots` = `noindex, nofollow` (l. 344) | aucun |
| `AdminDemandes.tsx` | `/admin/demandes` (l. 125 à 132) | présent | `Demandes conciergerie \| Admin I-CA.RE` (l. 111) | `robots` = `noindex,nofollow` (l. 112) | aucun |
| `AdminDemandesInstallation.tsx` | `/admin/demandes-installation` (l. 133 à 140) | présent | `Demandes installation \| Admin I-CA.RE` (l. 136) | `robots` = `noindex,nofollow` (l. 137) | aucun |
| `AdminWebhooks.tsx` | `/admin/idn-os-webhooks` (l. 141 à 148) | présent | `Webhooks IDN OS \| Admin I-CA.RE` (l. 76) | `robots` = `noindex,nofollow` (l. 77) | aucun |
| `AdminExtractions.tsx` | `/admin/extractions` (l. 149 à 156) | présent | `Extractions \| Admin I‑CA.RE` (l. 224) | `robots` = `noindex, nofollow` (l. 225) | aucun |
| *(aucune page)* | `/admin`, `<Route element={<Navigate to="/admin/praticiens" replace />} />` (l. 157) | sans objet | sans objet | sans objet | sans objet |

Six pages, six routes nominatives, plus la route `/admin` déclarée en `Navigate` sans page.
Le nom du fichier ne préjuge pas de la route : `AdminWebhooks.tsx` sert
`/admin/idn-os-webhooks`, et non `/admin/webhooks`.

## `Disallow: /admin/` dans `public/robots.txt`

Mention présente. `public/robots.txt` porte la ligne `Disallow: /admin/`, aux côtés de
`Disallow: /preview/`, `Disallow: /preview-footer-idn`, `Disallow: /preview-footer-idn-v3`
et `Disallow: /preview-carte-cabinets`.

Une remarque de lecture, sans geste : la directive porte sur le préfixe `/admin/`, avec la
barre finale. La route `/admin` sans barre, celle déclarée en `Navigate`, n'est donc pas
couverte par cette ligne. Ce n'est pas un constat de mission, et rien n'a été modifié.

## Deux divergences observées, aucune corrigée

- **Le trait d'union du nom.** Trois titres portent `I‑CA.RE` avec un trait d'union
  insécable `U+2011` : `AdminLogin`, `AdminPraticiens` et `AdminExtractions`. Les trois
  autres portent `I-CA.RE` avec le trait d'union simple `U+002D`.
- **L'espace de la directive robots.** Trois pages écrivent `noindex, nofollow` avec une
  espace, trois écrivent `noindex,nofollow` sans. Les deux formes sont valides.

Ces deux divergences sont des relevés. Aucune page n'a été modifiée : la mission dit
« sans modifier aucune page », et un alignement d'apparence est un arbitrage de jour.

## Aucune des routes d'administration n'est prérendue

`grep -n admin scripts/prerender.mjs scripts/generate-sitemap.mjs` ne rend aucune ligne.
Ce fait est repris par la mission 2, qui compte les routes déclarées dans `App.tsx` et ni
prérendues ni redirigées.
