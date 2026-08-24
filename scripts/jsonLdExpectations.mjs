#!/usr/bin/env node
/**
 * Attentes JSON-LD par famille d'URL.
 *
 * Extrait de scripts/prerender.mjs au lot 4 du sprint 14, pour que le prerendu
 * ET la sonde du HTML servi lisent la MEME table. Dupliquer cette table serait
 * creer un referentiel de plus, exactement ce que le controle de concordance
 * existe pour empecher.
 */
// ── JSON-LD expectations per URL family ─────────────────────────────
// Cette table s'etend a chaque nouvelle famille d'URL, au meme titre que la
// passe ROUTES. Une route qui ne correspond a aucune entree n'est pas
// controlee (son rapport vaut "n/a").
// Statut sprint 9 : controle bloquant. Une route controlee non conforme, ou un
// bloc JSON-LD illisible quel que soit le type de route, fait echouer le build.
export const JSONLD_EXPECTATIONS = [
  { match: (p) => p === "/" || p === "/en", label: "accueil", expect: ["Organization", "ProfessionalService"] },
  { match: (p) => /^(\/en)?\/(projets|projects)\/./.test(p), label: "cabinet", expect: ["MedicalBusiness", "Organization"] },
  { match: (p) => /^\/praticien\/./.test(p), label: "praticien", expect: ["Person", "Organization"] },
  // FAQPage retire au lot 1-ter du sprint 12 : le balisage etait faux, les
  // reponses ne figurant pas dans le HTML servi, et sans effet depuis le retrait
  // des resultats enrichis FAQ par Google. Attente relevee sur le HTML servi.
  { match: (p) => /^(\/en)?\/insights\/./.test(p), label: "insight", expect: ["Article", "BreadcrumbList"] },
  // Index des guides : depuis le retrait du FAQPage au lot 1-ter, ces deux pages
  // n'emettent aucun balisage propre et ne servent que les deux blocs statiques
  // d'index.html. Attente relevee sur dist/insights/index.html et son homologue
  // anglais, et non supposee. Elle est satisfaite par toute page du site : elle
  // ne discrimine rien, elle ferme un angle mort de controle en versant ces deux
  // routes dans le compte des controlees, ou elles ne figuraient pas.
  { match: (p) => p === "/insights" || p === "/en/insights", label: "index guides", expect: ["Organization", "ProfessionalService"] },
  // Index annuaire : attente bloquante assumee. Elle couple le build a l'etat de
  // la base, puisque l'ItemList n'est emis que si des fiches sont publiables ;
  // une base vide ou injoignable fera donc echouer le build. C'est voulu : un
  // annuaire qui se vide sans que personne ne le voie est un incident plus grave
  // qu'un build rouge, et le prerendu de cette page est deja couple aux memes
  // donnees par son attente DOM.
  { match: (p) => p === "/patients" || p === "/en/patients", label: "annuaire patients", expect: ["ItemList", "BreadcrumbList"] },
  { match: (p) => /^\/patients\/problematiques\/./.test(p), label: "problematique", expect: ["MedicalCondition", "ItemList", "BreadcrumbList"] },
  // Page ressources : alignee sur les guides au lot 3 du sprint 14. Elle ne
  // portait que les deux blocs statiques d'index.html, alors que c'est la page
  // la plus engageante du parc, et un guide de meme nature.
  { match: (p) => p === "/ressources/exercer-en-lieu-pluridisciplinaire", label: "ressources", expect: ["Article", "BreadcrumbList"] },
  { match: (p) => /^\/patients\/specialite\/./.test(p), label: "specialite", expect: ["CollectionPage", "ItemList", "BreadcrumbList"] },
  { match: (p) => /^\/patients\/articles\/./.test(p), label: "article patients", expect: ["Article", "BreadcrumbList"] },
  { match: (p) => /^\/sinstaller\/[^/]+\/./.test(p), label: "matrice installation", expect: ["MedicalBusiness", "Service", "BreadcrumbList"] },
];

/** Regle applicable a une route, ou null si la route n'est pas controlee. */
export function regleJsonLd(routePath) {
  const p = routePath !== "/" ? routePath.replace(/\/$/, "") : routePath;
  return JSONLD_EXPECTATIONS.find((r) => r.match(p)) || null;
}
