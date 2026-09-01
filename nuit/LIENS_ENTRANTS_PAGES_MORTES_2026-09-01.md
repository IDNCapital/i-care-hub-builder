# Liens entrants vers les trois pages a souche de redirection - i-care-hub-builder - 2026-09-01

Releve en lecture seule. Aucune suppression, aucun fichier modifie hors le present rapport : le retrait est un lot de jour decide le 23/08.

Assiette : recherche dans `src/` de tout import, de toute reference de composant et de tout lien vers les routes de ces pages, hors leurs propres fichiers.

Commandes, jouees pour chacune des trois pages :

    find src -name "<Page>*"
    grep -rn "<Page>" src/ | grep -v "src/pages/<Page>"
    grep -nE 'path="[^"]*(trouver-cabinet|combien-coute|parrainage)[^"]*"' src/App.tsx
    grep -rnE '(href|to)="[^"]*(trouver-cabinet|combien-coute|parrainage)[^"]*"' src/

## BlogTrouverCabinet

**Encore referencee : oui, par un import mort.**

| Reference | Emplacement |
| --- | --- |
| import du composant | `src/App.tsx:25` : `import BlogTrouverCabinet from "./pages/BlogTrouverCabinet";` |
| montage sur une route | **aucun**. Le composant importe n'est monte sur aucun `<Route element={...}>`. |
| lien entrant (`href` ou `to`) | **aucun** dans `src/`. |

Son ancien chemin est desormais servi par une redirection qui pointe ailleurs :

    src/App.tsx:207: <Route path="/blog/trouver-cabinet-bordeaux-praticien" element={<Navigate to="/insights/cabinet-medical-bordeaux" replace />} />

Un second chemin voisin redirige lui aussi sans passer par la page :

    src/App.tsx:230: <Route path="/trouver-cabinet-medical-bordeaux" element={<Navigate to="/location-cabinet-bordeaux" replace />} />

**Etat** : le composant est importe mais injoignable. L'import de la ligne 25 est la seule chose qui le retienne dans le graphe de modules, et donc dans le paquet construit.

## BlogCoutCabinetBordeaux

**Encore referencee : oui, par un import mort.**

| Reference | Emplacement |
| --- | --- |
| import du composant | `src/App.tsx:26` : `import BlogCoutCabinetBordeaux from "./pages/BlogCoutCabinetBordeaux";` |
| montage sur une route | **aucun**. |
| lien entrant (`href` ou `to`) | **aucun** dans `src/`. |

Ancien chemin redirige :

    src/App.tsx:208: <Route path="/blog/combien-coute-cabinet-consultation-bordeaux" element={<Navigate to="/insights/budget-cabinet-bordeaux" replace />} />

**Etat** : identique au cas precedent, composant importe et injoignable.

## Parrainage

**Encore referencee : non. Aucune reference d'aucune sorte.**

| Reference | Emplacement |
| --- | --- |
| import du composant | **aucun**. `src/pages/Parrainage.tsx` n'est importe nulle part dans `src/`. |
| montage sur une route | **aucun**. Aucun `path` contenant `parrainage` dans `src/App.tsx`. |
| lien entrant (`href` ou `to`) | **aucun** dans `src/`. |

La mise en sommeil est documentee hors de `src/`, et les deux sources concordent :

    scripts/checkRoutesConcordance.mjs:41: { chemin: "/parrainage", absentDe: ["app", "sitemap"], motif: "mis en sommeil au sprint 16, retire d'App.tsx, servi par une souche de redirection" }
    scripts/checkRoutesConcordance.mjs:42: { chemin: "/en/referral", absentDe: ["app", "sitemap"], motif: "idem /parrainage, cote anglais" }
    scripts/prerender.mjs:226: // Parrainage mis en sommeil (Sprint 16, 17/07/2026) : page retiree de App.tsx et du sitemap.
    scripts/prerender.mjs:227: { from: "/parrainage", to: "/professionnels" }

**Etat** : entierement orpheline. Le fichier existe, plus rien ne le designe.

## Synthese

| Page | Import | Route | Lien entrant | Verdict |
| --- | --- | --- | --- | --- |
| `BlogTrouverCabinet` | `App.tsx:25` | aucune | aucun | import mort |
| `BlogCoutCabinetBordeaux` | `App.tsx:26` | aucune | aucun | import mort |
| `Parrainage` | aucun | aucune | aucun | orpheline complete |

Les trois routes publiques correspondantes sont bien des souches : les chemins existent, ils redirigent, et aucun ne rend la page. Le retrait des deux imports de `App.tsx` et des trois fichiers de page se prend de jour, avec la verification de prerendu qui va avec, hors de portee d'une passe de nuit.

## Ce que ce releve ne mesure pas

Il ne regarde que `src/`. Les references trouvees dans `scripts/` sont citees pour eclairer le verdict, non pour l'etablir. Il ne dit rien des liens entrants externes au depot, ni du sitemap servi en production, et il ne verifie aucun comportement a l'execution : le filet local est injouable cette nuit, `node_modules` etant absent.

Zero suppression, zero fichier modifie hors le present rapport.
