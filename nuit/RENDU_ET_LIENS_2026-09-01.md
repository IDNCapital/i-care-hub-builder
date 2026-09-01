# Releve WEB-RENDU-ET-LIENS - i-care-hub-builder - 2026-09-01

Releve en lecture seule sur l'etat courant de la branche `nuit/2026-09-01`, issue de `main` au commit `eeffe05`. Aucun fichier de `src/` ni de `scripts/` n'est modifie par ce releve.

## 1. URLs absolues en dur vers le domaine du site, dans `src/`

Motifs exacts demandes, joues separement.

| Commande | Resultat |
| --- | ---: |
| `grep -rn "https://i-ca\.re" src/ \| wc -l` | 1 |
| `grep -rn "http://i-ca\.re" src/ \| wc -l` | 0 |
| `grep -rn "i-ca\.re" src/ \| wc -l` | 19 |
| `grep -rn "siteUrl" src/ \| wc -l` | 20 |

**Une seule URL absolue en dur, et elle est a sa place.** L'unique occurrence est la definition meme de la constante de base :

    src/lib/siteUrl.ts:10:export const BASE_URL = "https://i-ca.re";

Fichier concerne : `src/lib/siteUrl.ts`, et lui seul. Aucune URL absolue en dur ailleurs dans `src/`. La dette WEB-RENDU-ET-LIENS est, sur ce point, **eteinte sur `src/`**.

**Verification par le motif large.** Les 19 lignes contenant `i-ca.re` se repartissent ainsi, apres exclusion de la definition ci dessus :

| Nature | Lignes | Fichiers |
| --- | ---: | --- |
| adresses electroniques `contact@i-ca.re` ou `nicolas@i-ca.re` | 14 | `src/components/Footer.tsx` (2), `src/pages/MentionsLegales.tsx`, `src/pages/Contact.tsx`, `src/pages/PolitiqueCookies.tsx`, `src/pages/PolitiqueConfidentialite.tsx` (5), `src/pages/ProjetDetail.tsx`, `src/pages/Parrainage.tsx`, `src/locales/fr.json`, `src/locales/en.json` |
| domaine cite en texte d'affichage, sans protocole | 2 | `src/pages/PreviewPraticien.tsx:128`, `src/pages/Parrainage.tsx:134` |
| mention en commentaire de documentation | 1 | `src/lib/brand.ts:21` |
| definition de `BASE_URL` | 1 | `src/lib/siteUrl.ts:10` |
| non retenue par le decompte ci dessus, deja comptee | 1 | recouvrement entre les deux premieres lignes de `Footer.tsx` |

Aucune de ces lignes n'est une URL absolue de navigation : ce sont des adresses electroniques, du texte affiche et un commentaire. Rien a corriger, et rien n'est corrige.

## 2. Liens internes sans barre oblique finale

Motif demande : `href="/..."` sans `/` final, hors ancres et fichiers.

    grep -rnE 'href="/[A-Za-z0-9._~/-]*[^/"]"' src/ \
      | grep -vE 'href="/[^"]*\.(png|jpg|jpeg|svg|webp|ico|xml|txt|json|pdf|avif|webmanifest)"' \
      | grep -vE 'href="/#'

**Resultat : 0.** Aucun fichier concerne. Sur une assiette de **18** occurrences de `href="/..."` dans `src/`, toutes portent la barre oblique finale. La correction fusionnee le 25/08 tient.

**Observation supplementaire, hors du motif demande mais de la meme dette.** La forme react-router `to="/..."` compte **19** occurrences sans barre finale, sur une assiette de 30 :

    grep -rnE 'to="/[A-Za-z0-9._~/-]*[^/"]"' src/

| Fichier | Lignes | Nature |
| --- | --- | --- |
| `src/App.tsx` | 157, 177, 178, 179, 180, 197, 198, 199, 200, 201, 202, 203, 204, 207, 208, 209, 229, 230 | cibles de `<Navigate ... replace />`, table de redirection |
| `src/components/AdminGuard.tsx` | 19 | cible de `<Navigate ... replace />` vers la page d'authentification |

Les dix-neuf sont des **cibles de redirection**, non des liens offerts au visiteur : aucune n'est un ancrage de navigation. Leur forme avec ou sans barre finale releve de l'appariement de routes, question distincte de la dette des liens internes. Constat seulement, aucune correction : le geste toucherait le rendu et se prend de jour.

## 3. Barriere d'erreur React

    grep -rniE "ErrorBoundary|componentDidCatch|getDerivedStateFromError|react-error-boundary" \
      src/ scripts/ index.html package.json

**Verdict : ABSENTE.** Aucune occurrence, ni composant maison, ni `componentDidCatch`, ni `getDerivedStateFromError`, ni la dependance `react-error-boundary` dans `package.json`. Une exception levee au rendu d'une page fait donc tomber l'arbre React entier, sans repli affiche.

C'est un constat, pas une mission : poser une barriere modifie le rendu, et la file interdit toute mission dont la preuve en depend. La decision revient au jour.

## Ce que ce releve ne mesure pas

Il ne regarde que `src/`. Il ne dit rien de `supabase/functions/`, exclu par la file. Il ne verifie aucun comportement a l'execution : le filet local du depot est injouable cette nuit, `node_modules` etant absent et `node scripts/checkRoutesConcordance.mjs` echouant sur `ERR_MODULE_NOT_FOUND` pour le paquet `esbuild`. Un vert de nuit ne vaudrait de toute facon jamais preuve de prerendu.

## Commandes citees, dans l'ordre

    grep -rn "https://i-ca\.re" src/ | wc -l
    grep -rln "https://i-ca\.re" src/
    grep -rn "http://i-ca\.re" src/ | wc -l
    grep -rn "i-ca\.re" src/ | wc -l
    grep -rn "siteUrl" src/ | wc -l
    grep -rnE 'href="/[A-Za-z0-9._~/-]*[^/"]"' src/ | grep -vE 'href="/[^"]*\.(png|jpg|jpeg|svg|webp|ico|xml|txt|json|pdf|avif|webmanifest)"' | grep -vE 'href="/#'
    grep -rnoE 'href="/[^"]*"' src/ | wc -l
    grep -rnE 'to="/[A-Za-z0-9._~/-]*[^/"]"' src/
    grep -rnoE 'to="/[^"]*"' src/ | wc -l
    grep -rniE "ErrorBoundary|componentDidCatch|getDerivedStateFromError|react-error-boundary" src/ scripts/ index.html package.json
