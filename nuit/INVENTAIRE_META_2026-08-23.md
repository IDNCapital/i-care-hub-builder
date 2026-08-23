# Inventaire meta des pages · i-care-hub-builder · 2026-08-23

Mission de nuit XS, priorite 1. **Lecture seule : aucune page n'a ete modifiee.**
Rollback : aucun, ce fichier est le seul ajout.

## Perimetre, et l'ecart avec l'hypothese de la file

La file annonce « les 43 pages de src/pages ». Chiffre VERIFIE et exact pour le
premier niveau du repertoire :

    ls src/pages/*.tsx | wc -l      -> 43

Il y a cependant **49 fichiers de page au total**, les six autres vivant sous
`src/pages/admin/` :

    find src/pages -name '*.tsx' | wc -l   -> 49

Les six pages d'administration (`AdminDemandes`, `AdminDemandesInstallation`,
`AdminExtractions`, `AdminLogin`, `AdminPraticiens`, `AdminWebhooks`) sont
**hors tableau** : elles vivent derriere `AdminGuard`, ne sont ni prerendues ni
au sitemap, et n'ont aucune attente meta. L'hypothese de la file est donc juste
sur ce qu'elle vise, incomplete sur ce qu'elle nomme.

## Comment chaque colonne est etablie

Aucune colonne n'est deduite d'une intention : chacune vient d'une commande.

- **Route** — compilee depuis `src/App.tsx`, en distinguant les trois zones du
  fichier : racine (lignes 99-159), bloc anglais `/en/*` (160-191, prefixe `/en`
  applique), bloc francais `/*` (212-254). Les elements `<Navigate>` sont exclus,
  ce sont des redirections et non des pages.

      grep -n 'path=' src/App.tsx

- **Source SEO** — `SeoHead` quand la page rend elle-meme `<SeoHead>` ; « gabarit
  Insight » quand elle delegue a `InsightArticleTemplate` ou `InsightLayout`, qui
  rendent `<SeoHead>` en interne (`src/components/InsightArticleTemplate.tsx:179`).

      grep -l '<SeoHead' src/pages/*.tsx | wc -l
      grep -l 'InsightArticleTemplate\|InsightLayout' src/pages/*.tsx | wc -l

- **title / description / canonical / OG** — `SeoHead` emet les quatre d'un bloc
  (`src/components/SeoHead.tsx`), une page qui l'utilise les porte donc toutes.
  Pour les autres, presence relevee dans le source de la page :

      grep -c '<title>' src/pages/X.tsx
      grep -c 'name="description"' src/pages/X.tsx
      grep -c 'rel="canonical"' src/pages/X.tsx
      grep -c 'property="og:' src/pages/X.tsx

- **JSON-LD attendu** — rendu par `regleJsonLd()` de `scripts/jsonLdExpectations.mjs`,
  la table que lisent DEJA le prerendu et la sonde du HTML servi. Aucune table
  n'est recopiee ici. Les segments parametres (`:slug`) sont substitues par un
  segment quelconque avant interrogation. `n/a` signifie : famille non controlee
  par le prerendu, pas « sans JSON-LD ».

- **ld+json dans la page** — presence d'un bloc emis par la page elle-meme :

      grep -c 'application/ld+json' src/pages/X.tsx

- **noindex** — passage de `noIndex` a `SeoHead` :

      grep -c 'noIndex' src/pages/X.tsx

## Tableau, une ligne par page

| Page | Route(s) | Source SEO | title | description | canonical | OG | JSON-LD attendu | ld+json propre | noindex |
|---|---|---|---|---|---|---|---|---|---|
| `ArticleDetail.tsx` | `/patients/articles/:slug` | SeoHead | oui | oui | oui | oui | article patients → Article + BreadcrumbList | oui | non |
| `ArticlesIndex.tsx` | `/patients/articles` | SeoHead | oui | oui | oui | oui | n/a | oui | non |
| `BlogCoutCabinetBordeaux.tsx` | _aucune_ | SeoHead | oui | oui | oui | oui | n/a | non | non |
| `BlogTrouverCabinet.tsx` | _aucune_ | SeoHead | oui | oui | oui | oui | n/a | non | non |
| `Contact.tsx` | `/en/contact`, `/contact` | SeoHead | oui | oui | oui | oui | n/a | non | non |
| `DecrireMonBesoin.tsx` | `/patients/decrire-mon-besoin` | SeoHead | oui | oui | oui | oui | n/a | non | oui |
| `FAQ.tsx` | `/en/faq`, `/questions-frequentes` | SeoHead | oui | oui | oui | oui | n/a | oui | non |
| `Index.tsx` | `/en`, `/` | SeoHead | oui | oui | oui | oui | accueil → Organization + ProfessionalService | non | non |
| `InsightsBudget.tsx` | `/en/insights/office-budget-bordeaux`, `/insights/budget-cabinet-bordeaux` | gabarit Insight | oui | oui | oui | oui | insight → Article + BreadcrumbList | non | non |
| `InsightsCabinetMedicalBordeaux.tsx` | `/en/insights/medical-office-bordeaux`, `/insights/cabinet-medical-bordeaux` | gabarit Insight | oui | oui | oui | oui | insight → Article + BreadcrumbList | non | non |
| `InsightsIndex.tsx` | `/en/insights`, `/insights` | SeoHead | oui | oui | oui | oui | index guides → Organization + ProfessionalService | non | non |
| `InsightsLouerAcheter.tsx` | `/en/insights/rent-or-buy-office`, `/insights/louer-ou-acheter-cabinet` | gabarit Insight | oui | oui | oui | oui | insight → Article + BreadcrumbList | non | non |
| `InsightsProfessions.tsx` | `/en/insights/professions-sharing-office`, `/insights/professions-partage-cabinet` | gabarit Insight | oui | oui | oui | oui | insight → Article + BreadcrumbList | non | non |
| `InsightsSurface.tsx` | `/en/insights/medical-office-size`, `/insights/surface-cabinet-medical` | gabarit Insight | oui | oui | oui | oui | insight → Article + BreadcrumbList | non | non |
| `InsightsTransformer.tsx` | `/en/insights/converting-commercial-space`, `/insights/transformer-local-en-cabinet` | gabarit Insight | oui | oui | oui | oui | insight → Article + BreadcrumbList | non | non |
| `Investissement.tsx` | `/en/investment`, `/investissement` | SeoHead | oui | oui | oui | oui | n/a | non | oui |
| `InvestisseurInteret.tsx` | `/en/investment/interest`, `/investissement/interet` | — | oui | oui | **non** | **non** | n/a | non | non |
| `InvestisseurMemo.tsx` | `/en/investment/memo`, `/investissement/memo` | — | oui | oui | **non** | **non** | n/a | non | non |
| `InvestisseurVerify.tsx` | `/en/investment/verify`, `/investissement/verify` | — | oui | **non** | **non** | **non** | n/a | non | non |
| `LocationCabinetBordeaux.tsx` | `/en/office-rental-bordeaux`, `/location-cabinet-bordeaux` | SeoHead | oui | oui | oui | oui | n/a | non | non |
| `LocationCabinetToulouse.tsx` | `/en/office-rental-toulouse`, `/location-cabinet-toulouse` | SeoHead | oui | oui | oui | oui | n/a | oui | non |
| `MentionsLegales.tsx` | `/en/legal`, `/mentions-legales` | SeoHead | oui | oui | oui | oui | n/a | non | oui |
| `NotFound.tsx` | `/en*`, `*` | — | oui | oui | **non** | **non** | accueil → Organization + ProfessionalService | non | non |
| `NotreApproche.tsx` | `/en/our-approach`, `/notre-approche` | SeoHead | oui | oui | oui | oui | n/a | non | non |
| `Parrainage.tsx` | _aucune_ | SeoHead | oui | oui | oui | oui | n/a | oui | non |
| `Patients.tsx` | `/en/patients`, `/patients` | SeoHead | oui | oui | oui | oui | n/a | non | oui |
| `PolitiqueConfidentialite.tsx` | `/en/privacy`, `/confidentialite` | SeoHead | oui | oui | oui | oui | n/a | non | oui |
| `PolitiqueCookies.tsx` | `/en/cookies`, `/cookies` | SeoHead | oui | oui | oui | oui | n/a | non | oui |
| `PraticienPublic.tsx` | `/praticien/:slug` | — | oui | oui | oui | oui | praticien → Person + Organization | oui | non |
| `PreviewCarteCabinets.tsx` | `/preview-carte-cabinets` | — | oui | **non** | **non** | **non** | n/a | non | non |
| `PreviewFooterIdn.tsx` | `/preview-footer-idn` | — | oui | **non** | **non** | **non** | n/a | non | non |
| `PreviewFooterIdnV3.tsx` | `/preview-footer-idn-v3` | — | oui | **non** | **non** | **non** | n/a | non | non |
| `PreviewPraticien.tsx` | `/preview/:slug/:token` | — | oui | **non** | **non** | **non** | n/a | non | non |
| `ProblematiqueDetail.tsx` | `/patients/problematiques/:slug` | SeoHead | oui | oui | oui | oui | problematique → MedicalCondition + ItemList + BreadcrumbList | oui | non |
| `ProblematiquesIndex.tsx` | `/patients/problematiques` | SeoHead | oui | oui | oui | oui | n/a | oui | non |
| `Professionnels.tsx` | `/en/health-professionals`, `/professionnels` | SeoHead | oui | oui | oui | oui | n/a | non | non |
| `ProjetDetail.tsx` | `/en/projects/:slug`, `/projets/:slug` | SeoHead | oui | oui | oui | oui | cabinet → MedicalBusiness + Organization | oui | non |
| `Projets.tsx` | `/en/projects`, `/projets` | SeoHead | oui | oui | oui | oui | n/a | non | non |
| `RessourcesLieuPluridisciplinaire.tsx` | `/ressources/exercer-en-lieu-pluridisciplinaire` | SeoHead | oui | oui | oui | oui | ressources → Article + BreadcrumbList | oui | non |
| `SinstallerDetail.tsx` | `/sinstaller/:profession/:ville` | SeoHead | oui | oui | oui | oui | matrice installation → MedicalBusiness + Service + BreadcrumbList | oui | non |
| `SinstallerIndex.tsx` | `/sinstaller` | SeoHead | oui | oui | oui | oui | n/a | oui | non |
| `SpecialiteDetail.tsx` | `/patients/specialite/:slug` | SeoHead | oui | oui | oui | oui | specialite → CollectionPage + ItemList + BreadcrumbList | oui | oui |
| `TemoignagesPraticiens.tsx` | `/en/practitioner-testimonials`, `/temoignages-praticiens` | SeoHead | oui | oui | oui | oui | n/a | oui | non |

## Ce que le tableau donne a voir

**Couverture meta.** 28 pages passent par `SeoHead`, 6 par le gabarit
Insight qui l'appelle : **34 pages sur 43 portent title, description,
canonical et OG**. Les 9 restantes se lisent en trois groupes, et un seul pose
question :

1. **Les quatre pages de previsualisation** (`PreviewPraticien`,
   `PreviewFooterIdn`, `PreviewFooterIdnV3`, `PreviewCarteCabinets`) — outils
   internes, hors sitemap, sans enjeu d'indexation.
2. **`PraticienPublic`** — n'utilise pas `SeoHead` mais emet ses quatre balises
   a la main, ce que le commentaire d'en-tete de `SeoHead.tsx` documente
   explicitement. Couverture reelle complete.
3. **`NotFound`, `InvestisseurInteret`, `InvestisseurMemo`, `InvestisseurVerify`**
   — portent un `<title>` (et une description pour trois d'entre elles) mais **ni
   canonical, ni OG**. C'est le seul manque de ce parc qui porte sur des routes
   publiques. Constat, pas correction : la mission est en lecture seule.

**Trois pages sans route.** `BlogTrouverCabinet.tsx`, `BlogCoutCabinetBordeaux.tsx`
et `Parrainage.tsx` ne sont montees par aucun `<Route>`. Ce n'est pas un oubli :
`scripts/prerender.mjs` sert ces trois chemins par REDIRECTION (lignes 225,
251-254) et `scripts/checkRoutesConcordance.mjs` declare l'ecart pour
`/parrainage` et `/en/referral` (lignes 41-42, « mis en sommeil au sprint 16 »).
En revanche `BlogTrouverCabinet` et `BlogCoutCabinetBordeaux` restent **importes
dans `src/App.tsx` (lignes 25-26) sans etre utilises** : deux imports morts, que
le filet de concordance ne voit pas puisqu'il regarde les routes, pas les
imports. `Parrainage`, elle, n'est meme plus importee — c'est l'etat propre.

**7 pages en noindex**, **14 pages emettent leur propre bloc `ld+json`.**

## Commandes de verification, rejouables telles quelles

    ls src/pages/*.tsx | wc -l
    find src/pages -name '*.tsx' | wc -l
    grep -l '<SeoHead' src/pages/*.tsx | wc -l
    grep -l 'InsightArticleTemplate\|InsightLayout' src/pages/*.tsx | wc -l
    grep -c 'application/ld+json' src/pages/*.tsx | grep -v ':0$' | wc -l
    grep -c 'noIndex' src/pages/*.tsx | grep -v ':0$' | wc -l
    grep -n 'BlogTrouverCabinet\|BlogCoutCabinetBordeaux' src/App.tsx
    node scripts/checkRoutesConcordance.mjs
