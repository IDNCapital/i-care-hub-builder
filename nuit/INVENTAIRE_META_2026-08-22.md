# Inventaire méta des pages · i-care-hub-builder · 2026-08-22

Mission de nuit `[XS] [1]`. **Lecture seule : aucune page n'a été modifiée.**
Rollback : aucun.

## Périmètre, vérifié et non supposé

La mission annonce 43 pages. Le chiffre est exact, et c'est la commande qui le dit :

```
$ ls src/pages/*.tsx | wc -l
43
$ find src/pages -type f | wc -l
49            # 43 pages + 6 fichiers sous src/pages/admin/
```

Les 6 fichiers restants vivent sous `src/pages/admin/` et ne sont pas des pages
publiques ; ils sont hors périmètre, la mission portant sur `src/pages`.

## Méthode, et le piège qu'elle évite

Une lecture naïve, fichier par fichier, compte comme dépourvues de `title` les
pages qui **délèguent leur `<head>` à un composant**. Le premier passage de cette
nuit a fait exactement cette erreur : il rendait « 6 pages sans title », dont les
six guides `Insights*`, qui portent en réalité toutes leurs balises via
`src/components/InsightArticleTemplate.tsx`, lequel appelle `SeoHead`. Le chiffre
était faux.

Le tableau ci-dessous suit donc les imports internes (`@/…` et relatifs) **en
profondeur**, avec mémoïsation et garde contre les cycles, et attribue une balise
à une page dès qu'elle-même ou l'un de ses composants la pose. La colonne
« porteur des balises » nomme la source.

Motifs cherchés dans les sources, un par colonne :

| colonne | motif |
|---|---|
| title | `<title>` |
| meta description | `<meta name="description"` |
| canonical | `rel="canonical"` |
| OG | `property="og:` |
| JSON-LD émis | `application/ld+json` |

La colonne « JSON-LD attendu » vient de `regleJsonLd()` de
`scripts/jsonLdExpectations.mjs`, appelée sur chaque route déclarée, les segments
paramétrés (`:slug`, `:profession`) étant remplacés par un segment concret. Une
route qu'aucune règle ne couvre est notée « non controlee » : c'est la valeur que
`jsonLdExpectations.mjs` documente lui-même (« son rapport vaut n/a »), pas une
absence de contrôle constatée.

Les routes viennent de `src/App.tsx`, texte entier et non ligne à ligne : trois
`<Route>` y sont écrits sur plusieurs lignes, dont celui de
`RessourcesLieuPluridisciplinaire`, que le premier passage manquait. Le préfixe
de langue est celui du bloc englobant (`/en/*` puis `/*`). Les routes dont
l'élément est `<Navigate>` sont des redirections, pas des pages : elles sont
exclues.

## Chiffres du relevé

```
pages inventoriées ............ 43
sans title .................... 0
sans meta description ......... 5
sans canonical ................ 8
sans OG ....................... 8
sans JSON-LD émis ............. 23
sans route dans App.tsx ....... 3
routes distinctes couvertes ... 70
```

Ces neuf nombres sortent du même script que le tableau, sur son canal d'erreur.

## Ce que le relevé montre

- **Aucune page sans `title`.** Le parc est complet sur ce point.
- Les **cinq pages sans meta description** sont les quatre pages `Preview*`
  (outils internes, non indexables) et `InvestisseurVerify`, page de vérification
  de jeton. Aucune n'est une page de contenu public.
- Les **huit pages sans canonical ni OG** sont ces cinq-là, plus `NotFound`,
  `InvestisseurInteret` et `InvestisseurMemo`. `NotFound` sans canonical est le
  comportement voulu pour une 404. Les deux pages investisseur sont derrière un
  jeton.
- Les **trois pages sans route** sont `BlogCoutCabinetBordeaux`,
  `BlogTrouverCabinet` et `Parrainage`. Les deux premières sont importées par
  `App.tsx` mais leurs anciennes URL `/blog/...` sont désormais des `<Navigate>`
  vers `/insights/...` : les composants ne sont plus montés par aucune route.
  `Parrainage` n'est ni routé ni importé. **Ce sont des constats, pas des
  verdicts** : décider de les supprimer, de les re-router ou de les laisser est
  une décision de jour.
- « Sans JSON-LD émis » n'est pas un défaut en soi : la table d'attentes ne
  couvre que certaines familles d'URL, et une page non couverte n'a rien à
  émettre.

## Tableau

| Page (`src/pages/`) | Route(s) | title | meta description | canonical | OG | JSON-LD emis | JSON-LD attendu (jsonLdExpectations.mjs) | porteur des balises | noIndex |
|---|---|---|---|---|---|---|---|---|---|
| `ArticleDetail.tsx` | /patients/articles/:slug | oui | oui | oui | oui | oui | article patients : Article + BreadcrumbList | SeoHead |  |
| `ArticlesIndex.tsx` | /patients/articles | oui | oui | oui | oui | oui | non controlee | SeoHead |  |
| `BlogCoutCabinetBordeaux.tsx` | _aucune_ | oui | oui | oui | oui | **NON** | sans objet | SeoHead |  |
| `BlogTrouverCabinet.tsx` | _aucune_ | oui | oui | oui | oui | **NON** | sans objet | SeoHead |  |
| `Contact.tsx` | /en/contact<br>/contact | oui | oui | oui | oui | **NON** | non controlee | SeoHead |  |
| `DecrireMonBesoin.tsx` | /patients/decrire-mon-besoin | oui | oui | oui | oui | **NON** | non controlee | SeoHead | oui |
| `FAQ.tsx` | /en/faq<br>/questions-frequentes | oui | oui | oui | oui | oui | non controlee | SeoHead |  |
| `Index.tsx` | /en<br>/ | oui | oui | oui | oui | **NON** | accueil : Organization + ProfessionalService | SeoHead |  |
| `InsightsBudget.tsx` | /en/insights/office-budget-bordeaux<br>/insights/budget-cabinet-bordeaux | oui | oui | oui | oui | oui | insight : Article + BreadcrumbList | components/InsightArticleTemplate.tsx |  |
| `InsightsCabinetMedicalBordeaux.tsx` | /en/insights/medical-office-bordeaux<br>/insights/cabinet-medical-bordeaux | oui | oui | oui | oui | oui | insight : Article + BreadcrumbList | components/InsightArticleTemplate.tsx |  |
| `InsightsIndex.tsx` | /en/insights<br>/insights | oui | oui | oui | oui | **NON** | index guides : Organization + ProfessionalService | SeoHead |  |
| `InsightsLouerAcheter.tsx` | /en/insights/rent-or-buy-office<br>/insights/louer-ou-acheter-cabinet | oui | oui | oui | oui | oui | insight : Article + BreadcrumbList | components/InsightArticleTemplate.tsx |  |
| `InsightsProfessions.tsx` | /en/insights/professions-sharing-office<br>/insights/professions-partage-cabinet | oui | oui | oui | oui | oui | insight : Article + BreadcrumbList | components/InsightArticleTemplate.tsx |  |
| `InsightsSurface.tsx` | /en/insights/medical-office-size<br>/insights/surface-cabinet-medical | oui | oui | oui | oui | oui | insight : Article + BreadcrumbList | components/InsightArticleTemplate.tsx |  |
| `InsightsTransformer.tsx` | /en/insights/converting-commercial-space<br>/insights/transformer-local-en-cabinet | oui | oui | oui | oui | oui | insight : Article + BreadcrumbList | components/InsightArticleTemplate.tsx |  |
| `Investissement.tsx` | /en/investment<br>/investissement | oui | oui | oui | oui | **NON** | non controlee | SeoHead | oui |
| `InvestisseurInteret.tsx` | /en/investment/interest<br>/investissement/interet | oui | oui | **NON** | **NON** | **NON** | non controlee | balises propres |  |
| `InvestisseurMemo.tsx` | /en/investment/memo<br>/investissement/memo | oui | oui | **NON** | **NON** | **NON** | non controlee | balises propres |  |
| `InvestisseurVerify.tsx` | /en/investment/verify<br>/investissement/verify | oui | **NON** | **NON** | **NON** | **NON** | non controlee | balises propres |  |
| `LocationCabinetBordeaux.tsx` | /en/office-rental-bordeaux<br>/location-cabinet-bordeaux | oui | oui | oui | oui | **NON** | non controlee | SeoHead |  |
| `LocationCabinetToulouse.tsx` | /en/office-rental-toulouse<br>/location-cabinet-toulouse | oui | oui | oui | oui | oui | non controlee | SeoHead |  |
| `MentionsLegales.tsx` | /en/legal<br>/mentions-legales | oui | oui | oui | oui | **NON** | non controlee | SeoHead | oui |
| `NotFound.tsx` | /en*<br>* | oui | oui | **NON** | **NON** | **NON** | non controlee | balises propres |  |
| `NotreApproche.tsx` | /en/our-approach<br>/notre-approche | oui | oui | oui | oui | **NON** | non controlee | SeoHead |  |
| `Parrainage.tsx` | _aucune_ | oui | oui | oui | oui | oui | sans objet | SeoHead |  |
| `Patients.tsx` | /en/patients<br>/patients | oui | oui | oui | oui | **NON** | non controlee | SeoHead | oui |
| `PolitiqueConfidentialite.tsx` | /en/privacy<br>/confidentialite | oui | oui | oui | oui | **NON** | non controlee | SeoHead | oui |
| `PolitiqueCookies.tsx` | /en/cookies<br>/cookies | oui | oui | oui | oui | **NON** | non controlee | SeoHead | oui |
| `PraticienPublic.tsx` | /praticien/:slug | oui | oui | oui | oui | oui | praticien : Person + Organization | balises propres |  |
| `PreviewCarteCabinets.tsx` | /preview-carte-cabinets | oui | **NON** | **NON** | **NON** | **NON** | non controlee | balises propres |  |
| `PreviewFooterIdn.tsx` | /preview-footer-idn | oui | **NON** | **NON** | **NON** | **NON** | non controlee | balises propres |  |
| `PreviewFooterIdnV3.tsx` | /preview-footer-idn-v3 | oui | **NON** | **NON** | **NON** | **NON** | non controlee | balises propres |  |
| `PreviewPraticien.tsx` | /preview/:slug/:token | oui | **NON** | **NON** | **NON** | **NON** | non controlee | balises propres |  |
| `ProblematiqueDetail.tsx` | /patients/problematiques/:slug | oui | oui | oui | oui | oui | problematique : MedicalCondition + ItemList + BreadcrumbList | SeoHead |  |
| `ProblematiquesIndex.tsx` | /patients/problematiques | oui | oui | oui | oui | oui | non controlee | SeoHead |  |
| `Professionnels.tsx` | /en/health-professionals<br>/professionnels | oui | oui | oui | oui | **NON** | non controlee | SeoHead |  |
| `ProjetDetail.tsx` | /en/projects/:slug<br>/projets/:slug | oui | oui | oui | oui | oui | cabinet : MedicalBusiness + Organization | SeoHead |  |
| `Projets.tsx` | /en/projects<br>/projets | oui | oui | oui | oui | **NON** | non controlee | SeoHead |  |
| `RessourcesLieuPluridisciplinaire.tsx` | /ressources/exercer-en-lieu-pluridisciplinaire | oui | oui | oui | oui | oui | ressources : Article + BreadcrumbList | SeoHead |  |
| `SinstallerDetail.tsx` | /sinstaller/:profession/:ville | oui | oui | oui | oui | oui | matrice installation : MedicalBusiness + Service + BreadcrumbList | SeoHead |  |
| `SinstallerIndex.tsx` | /sinstaller | oui | oui | oui | oui | oui | non controlee | SeoHead |  |
| `SpecialiteDetail.tsx` | /patients/specialite/:slug | oui | oui | oui | oui | oui | specialite : CollectionPage + ItemList + BreadcrumbList | SeoHead | oui |
| `TemoignagesPraticiens.tsx` | /en/practitioner-testimonials<br>/temoignages-praticiens | oui | oui | oui | oui | oui | non controlee | SeoHead |  |


## Commande de reproduction

Le tableau et les chiffres sont produits par le script ci-dessous, écrit pour
cette mission et volontairement **non versionné** : la mission demande un
tableau, pas un outil de plus dans le dépôt. Il est reproduit ici en entier pour
que le relevé soit refaisable à l'identique.

```
node inventaire.mjs > tableau.md 2> chiffres.json
```

<details>
<summary><code>inventaire.mjs</code></summary>

```js
import fs from "node:fs";
import path from "node:path";
import { regleJsonLd } from "./scripts/jsonLdExpectations.mjs";

const RACINE = process.cwd();
const SRC = path.join(RACINE, "src");
const PAGES = path.join(SRC, "pages");
const app = fs.readFileSync(path.join(SRC, "App.tsx"), "utf8");

// ── 1. Routes declarees dans App.tsx ────────────────────────────────
// Le texte entier est parcouru, pas ligne a ligne : plusieurs <Route> du
// fichier sont ecrits sur trois lignes (cas de RessourcesLieuPluridisciplinaire).
// Le prefixe de langue vient du bloc englobant : "/en/*" puis "/*".
const bornes = [...app.matchAll(/<Route path="(\/en\/\*|\/\*|\/fr\/\*)"/g)]
  .map((m) => ({ index: m.index, prefixe: m[1] === "/en/*" ? "/en" : "" }));
function prefixePour(index) {
  let p = "";
  for (const b of bornes) if (b.index < index) p = b.prefixe;
  return p;
}

const routes = new Map();
const re = /<Route\s+path="([^"]+)"\s+element=\{<([A-Za-z0-9_]+)/g;
let m;
while ((m = re.exec(app)) !== null) {
  const [, chemin, composant] = m;
  if (composant === "Navigate") continue;
  const prefixe = prefixePour(m.index);
  const complet = chemin === "/" ? (prefixe || "/") : (prefixe + chemin);
  if (!routes.has(composant)) routes.set(composant, []);
  if (!routes.get(composant).includes(complet)) routes.get(composant).push(complet);
}

// ── 2. Qui porte quelle balise, en suivant les imports internes ─────
// Une page peut deleguer tout son <head> a un composant (InsightArticleTemplate,
// SeoHead...). Une lecture naive du seul fichier de page compterait ces pages
// comme depourvues de title : c'est faux. On suit donc les imports "@/..." et
// relatifs, en profondeur, avec memoisation et garde contre les cycles.
const cache = new Map();
function resoudre(spec, depuis) {
  let base;
  if (spec.startsWith("@/")) base = path.join(SRC, spec.slice(2));
  else if (spec.startsWith(".")) base = path.resolve(path.dirname(depuis), spec);
  else return null;
  for (const suffixe of [".tsx", ".ts", "/index.tsx", "/index.ts"]) {
    if (fs.existsSync(base + suffixe)) return base + suffixe;
  }
  return fs.existsSync(base) && fs.statSync(base).isFile() ? base : null;
}

const MOTIFS = {
  title: /<title>|<title\s/,
  description: /<meta\s+name="description"/,
  canonical: /rel="canonical"/,
  og: /property="og:/,
  jsonld: /application\/ld\+json/,
};

function analyser(fichier, vus = new Set()) {
  if (cache.has(fichier)) return cache.get(fichier);
  if (vus.has(fichier)) return { title: false, description: false, canonical: false, og: false, jsonld: false, via: [] };
  vus.add(fichier);
  const src = fs.readFileSync(fichier, "utf8");
  const res = { via: [] };
  for (const [cle, motif] of Object.entries(MOTIFS)) res[cle] = motif.test(src);
  for (const imp of src.matchAll(/from\s+"([^"]+)"/g)) {
    const cible = resoudre(imp[1], fichier);
    if (!cible) continue;
    const sous = analyser(cible, vus);
    let apporte = false;
    for (const cle of Object.keys(MOTIFS)) {
      if (sous[cle] && !res[cle]) { res[cle] = true; apporte = true; }
    }
    if (apporte) res.via.push(path.relative(SRC, cible));
  }
  const fige = { ...res };
  cache.set(fichier, fige);
  return fige;
}

// ── 3. Table ────────────────────────────────────────────────────────
const fichiers = fs.readdirSync(PAGES).filter((f) => f.endsWith(".tsx")).sort();
const O = "oui", N = "**NON**";
const rows = [];
for (const fichier of fichiers) {
  const composant = fichier.replace(/\.tsx$/, "");
  const chemin = path.join(PAGES, fichier);
  const src = fs.readFileSync(chemin, "utf8");
  const a = analyser(chemin);
  const rs = routes.get(composant) || [];
  const attentes = rs.length
    ? [...new Set(rs.map((r) => {
        const regle = regleJsonLd(r.replace(/:[A-Za-z0-9_]+/g, "x"));
        return regle ? `${regle.label} : ${regle.expect.join(" + ")}` : "non controlee";
      }))].join(" ; ")
    : "sans objet";
  rows.push({
    fichier,
    routes: rs.length ? rs.join("<br>") : "_aucune_",
    title: a.title ? O : N,
    description: a.description ? O : N,
    canonical: a.canonical ? O : N,
    og: a.og ? O : N,
    jsonld: a.jsonld ? O : N,
    attentes,
    porteur: /<SeoHead\b/.test(src) ? "SeoHead" : (a.via.length ? a.via.join(", ") : "balises propres"),
    noindex: /noIndex/.test(src) ? "oui" : "",
  });
}

const entetes = ["Page (`src/pages/`)", "Route(s)", "title", "meta description",
                 "canonical", "OG", "JSON-LD emis", "JSON-LD attendu (jsonLdExpectations.mjs)",
                 "porteur des balises", "noIndex"];
let out = "| " + entetes.join(" | ") + " |\n|" + entetes.map(() => "---").join("|") + "|\n";
for (const r of rows) {
  out += `| \`${r.fichier}\` | ${r.routes} | ${r.title} | ${r.description} | ${r.canonical} | ${r.og} | ${r.jsonld} | ${r.attentes} | ${r.porteur} | ${r.noindex} |\n`;
}
console.log(out);
const compte = (cle) => rows.filter((r) => r[cle] === N).length;
console.error(JSON.stringify({
  pages: rows.length,
  sans_title: compte("title"),
  sans_description: compte("description"),
  sans_canonical: compte("canonical"),
  sans_og: compte("og"),
  sans_jsonld: compte("jsonld"),
  sans_route: rows.filter((r) => r.routes === "_aucune_").length,
  routes_distinctes: new Set([...routes.values()].flat()).size,
}, null, 1));
```

</details>

## Filet local

```
$ node scripts/checkRoutesConcordance.mjs
[concordance] routeMap 54 | App 80 fixes dont 36 Navigate, 8 parametrees | prerendu 63 + 20 redirections | sitemap 52 | ecarts declares 8 | interdits robots 5
[concordance] 0 incoherence(s) bloquante(s), 0 absence(s) signalee(s).
$ echo $?
0
```

Aucune page n'ayant été modifiée, ni le build ni le prérendu ne sont requis pour
cette mission.
