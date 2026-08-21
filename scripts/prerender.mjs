#!/usr/bin/env node
/**
 * Post-build prerender script for I-CA.RE.
 * Generates static HTML for strategic routes so crawlers (including AI bots)
 * can read SEO tags, H1, content, and JSON-LD without executing JavaScript.
 *
 * Chromium resolution order (chaque branche prise est journalisee) :
 *   1. PUPPETEER_EXECUTABLE_PATH env var
 *   2. puppeteer.executablePath(), le navigateur que Puppeteer a telecharge
 *   3. Common system paths, en dernier recours et signale comme tel
 *
 * Build behaviour:
 *   - Default: fails the build if prerender cannot run (exit 1)
 *   - PRERENDER_OPTIONAL=true: logs a warning and exits 0
 */

import puppeteer from "puppeteer";
import { createServer } from "http";
import handler from "serve-handler";
import { readFile, writeFile, mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { existsSync, statSync } from "fs";
import { JSDOM } from "jsdom";
import { pagePath, pageUrl } from "./siteUrl.mjs";
import { JSONLD_EXPECTATIONS } from "./jsonLdExpectations.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const PORT = 45678;
const OPTIONAL = process.env.PRERENDER_OPTIONAL === "true";

// ── Reprise par route ───────────────────────────────────────────────
// Une capture echoue parfois : la page est prise dans son etat de chargement,
// ni canonical, ni h1, ni JSON-LD propre. Le controle a eu raison deux fois de
// la refuser (run #183 sur /projets/i-ca-re-le-bouscat, build local du lot 4
// sur /patients/articles/burn-out-reconnaitre-les-signes).
//
// LA CAUSE N'EST PAS ETABLIE, et ce lot ne pretend pas la corriger : il absorbe
// l'alea. Deux candidates au 20/08/2026. Une course entre la requete Supabase
// et networkidle0. Ou une fragilite de react-helmet-async 2.0.5 sous React
// 19.2.1, qui n'injecterait rien dans le head : la signature du run #183
// comportait "Missing canonical" et "Missing hreflang", qui viennent de Helmet
// et non de la donnee, et la meme bibliotheque a montre deux autres
// manifestations, le head fige en navigation cliente et une non-injection au
// premier rendu observee en local. Un lot de diagnostic est ouvert.
// On absorbe donc l'alea, sans toucher a la severite : une route qui echoue a
// TOUS ses essais fait echouer le build, exactement comme avant, en rendant son
// erreur d'origine et non un message de reprise.
//
// La reprise couvre AUSSI les captures qui levent, timeout de navigation,
// selecteur jamais apparu, connexion fermee. Une exception est une forme plus
// forte de ne pas satisfaire le controle, pas une forme differente. Le budget
// global borne le cas ou elles seraient toutes permanentes.
//
// 3 essais : la frequence observee est d'environ 0,1 % par capture, 3 essais
// independants ramenent le residuel sous 10^-9 par route. Au-dela on paie sans
// gagner.
// 1000 ms : l'echec est une requete qui retombe trop tard, une pause courte
// suffit a laisser passer le a-coup.
// Budget global de 10 : sans lui, un defaut PERMANENT touchant les 188 routes
// couterait 3 x 20 s de timeout chacune, soit plus de trois heures, et une
// reprise transformerait un defaut permanent en attente longue. Le budget borne
// le pire cas a environ 3,5 min ajoutees, sur les 15 min que le workflow
// accorde et les 7 a 8 min que prend un build vert. Il vaut cinquante fois la
// frequence observee, donc il ne mord jamais en regime normal.
const ESSAIS_MAX = 3;
const ATTENTE_REPRISE_MS = 1000;
const BUDGET_REPRISES = 10;


// Collecte a plat de tous les @type declares dans les blocs JSON-LD du document.
// Descend uniquement dans les tableaux et dans @graph, pas dans les proprietes
// imbriquees (PostalAddress, GeoCoordinates ne sont pas des entites de page).
function collectJsonLdTypes(doc) {
  const types = new Set();
  const errors = [];
  const MAX_DEPTH = 10;

  const walk = (node, depth) => {
    if (!node || depth > MAX_DEPTH) return;
    if (Array.isArray(node)) {
      for (const item of node) walk(item, depth + 1);
      return;
    }
    if (typeof node !== "object") return;
    const t = node["@type"];
    if (typeof t === "string") types.add(t);
    else if (Array.isArray(t)) for (const x of t) if (typeof x === "string") types.add(x);
    if (node["@graph"]) walk(node["@graph"], depth + 1);
  };

  for (const s of doc.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      walk(JSON.parse(s.textContent), 0);
    } catch {
      errors.push("JSON-LD illisible");
    }
  }

  return { types, errors };
}

function checkJsonLd(doc, routePath) {
  const { types, errors } = collectJsonLdTypes(doc);
  const found = [...types].sort();
  const unreadable = errors.includes("JSON-LD illisible");
  // Normalisation pour la recherche de regle uniquement : le rapport continue
  // d'afficher le chemin tel qu'il est declare dans ROUTES.
  const lookupPath = routePath !== "/" ? routePath.replace(/\/$/, "") : routePath;
  const rule = JSONLD_EXPECTATIONS.find((r) => r.match(lookupPath));
  if (!rule) {
    return { label: found.length ? `n/a (trouves : ${found.join(", ")})` : "n/a", errors, checked: false, conform: false, found, unreadable, missing: [] };
  }
  const missing = rule.expect.filter((t) => !types.has(t));
  const label = missing.length === 0
    ? `✓ ${rule.expect.join("+")}`
    : `✗ manque ${missing.join(", ")} (trouves : ${found.length ? found.join(", ") : "aucun"})`;
  if (missing.length > 0) errors.push(`JSON-LD ${rule.label} : manque ${missing.join(", ")}`);
  return { label, errors, checked: true, conform: missing.length === 0, found, unreadable, missing };
}

// ── Route definitions ───────────────────────────────────────────────
// type: "strategic" = must be indexed, "legal" = must have noindex,
// "dormant" = volontairement desindexee et hors sitemap, doit porter un noindex
const ROUTES = [
  // FR strategic
  { path: "/", type: "strategic" },
  { path: "/projets", type: "strategic" },
  { path: "/projets/i-ca-re-chartrons", type: "strategic" },
  { path: "/projets/i-ca-re-nansouty", type: "strategic" },
  { path: "/projets/i-ca-re-jardin-public", type: "strategic" },
  { path: "/projets/i-ca-re-pey-berland", type: "strategic" },
  { path: "/projets/i-ca-re-floirac", type: "strategic" },
  { path: "/projets/i-ca-re-lormont", type: "strategic" },
  { path: "/projets/i-ca-re-toulouse-capitole", type: "strategic" },
  { path: "/projets/i-ca-re-le-bouscat", type: "strategic" },
  { path: "/professionnels", type: "strategic" },
  { path: "/location-cabinet-bordeaux", type: "strategic" },
  { path: "/location-cabinet-toulouse", type: "strategic" },
  { path: "/insights", type: "strategic" },
  { path: "/insights/cabinet-medical-bordeaux", type: "strategic" },
  { path: "/insights/budget-cabinet-bordeaux", type: "strategic" },
  { path: "/insights/surface-cabinet-medical", type: "strategic" },
  { path: "/insights/transformer-local-en-cabinet", type: "strategic" },
  { path: "/insights/professions-partage-cabinet", type: "strategic" },
  { path: "/insights/louer-ou-acheter-cabinet", type: "strategic" },
  // Page investisseur volontairement desindexee et hors sitemap, reactivable.
  // Decision doctrine V1.4.
  { path: "/investissement", type: "dormant" },
  { path: "/notre-approche", type: "strategic" },
  { path: "/contact", type: "strategic" },
  { path: "/questions-frequentes", type: "strategic" },
  { path: "/temoignages-praticiens", type: "strategic" },
  { path: "/patients", type: "strategic" },
  { path: "/patients/problematiques", type: "strategic" },
  { path: "/patients/articles", type: "strategic" },
  // Conciergerie patient, formulaire de conversion de l'Espace Patients, lie
  // depuis 54 pages servies. Elle etait declaree dans App.tsx mais absente de
  // cette table, donc jamais prerendue : elle repondait 404 a froid ET au clic,
  // les points d'appel servis etant tous des <a href> nus. Une route absente de
  // ROUTES n'est pas controlee, elle est ignoree : le controle couvre ce qui est
  // declare, pas ce qui existe.
  //
  // Type "dormant" faute de mieux : sa definition correspond aux trois faits,
  // noindex volontaire, hors sitemap, desindexation deliberee. Le mot est
  // trompeur pour autant, la page n'ayant rien d'endormi. A relire comme
  // "active, mais volontairement hors index".
  { path: "/patients/decrire-mon-besoin", type: "dormant" },
  // FR installation matrix : index seul ; les combinaisons profession × ville
  // sont ajoutées dynamiquement depuis la base (voir fetchInstallationMatrix).
  { path: "/sinstaller", type: "strategic" },
  // Page ressources, publiee au lot 3 du sprint 12, alignee sur le balisage des
  // guides au lot 3 du sprint 14. Son attente figure dans JSONLD_EXPECTATIONS.
  { path: "/ressources/exercer-en-lieu-pluridisciplinaire", type: "strategic" },
  // FR legal
  { path: "/mentions-legales", type: "legal" },
  { path: "/confidentialite", type: "legal" },
  { path: "/cookies", type: "legal" },
  // EN strategic
  { path: "/en/", type: "strategic" },
  { path: "/en/projects", type: "strategic" },
  { path: "/en/projects/i-ca-re-chartrons", type: "strategic" },
  { path: "/en/projects/i-ca-re-nansouty", type: "strategic" },
  { path: "/en/projects/i-ca-re-jardin-public", type: "strategic" },
  { path: "/en/projects/i-ca-re-pey-berland", type: "strategic" },
  { path: "/en/projects/i-ca-re-floirac", type: "strategic" },
  { path: "/en/projects/i-ca-re-lormont", type: "strategic" },
  { path: "/en/projects/i-ca-re-toulouse-capitole", type: "strategic" },
  { path: "/en/projects/i-ca-re-le-bouscat", type: "strategic" },
  { path: "/en/health-professionals", type: "strategic" },
  { path: "/en/office-rental-bordeaux", type: "strategic" },
  { path: "/en/office-rental-toulouse", type: "strategic" },
  { path: "/en/insights", type: "strategic" },
  { path: "/en/insights/medical-office-bordeaux", type: "strategic" },
  { path: "/en/insights/office-budget-bordeaux", type: "strategic" },
  { path: "/en/insights/medical-office-size", type: "strategic" },
  { path: "/en/insights/converting-commercial-space", type: "strategic" },
  { path: "/en/insights/professions-sharing-office", type: "strategic" },
  { path: "/en/insights/rent-or-buy-office", type: "strategic" },
  // Page investisseur volontairement desindexee et hors sitemap, reactivable.
  // Decision doctrine V1.4.
  { path: "/en/investment", type: "dormant" },
  { path: "/en/our-approach", type: "strategic" },
  { path: "/en/contact", type: "strategic" },
  { path: "/en/faq", type: "strategic" },
  { path: "/en/practitioner-testimonials", type: "strategic" },
  { path: "/en/patients", type: "strategic" },
  // EN legal
  { path: "/en/legal", type: "legal" },
  { path: "/en/privacy", type: "legal" },
  { path: "/en/cookies", type: "legal" },
];

// ── Legacy redirects (301-equivalent : stub statique meta-refresh + canonical) ──
// GitHub Pages ne fait pas de 301 serveur ; on écrit un fichier statique servi en 200
// qui redirige immédiatement et pointe le canonical vers la cible (signal de consolidation).
const REDIRECTS = [
  { from: "/installer-cabinet-praticien", to: "/sinstaller" },
  { from: "/trouver-cabinet-medical-bordeaux", to: "/location-cabinet-bordeaux" },
  { from: "/en/setting-up-practice", to: "/en/health-professionals" },
  { from: "/en/finding-medical-office-bordeaux", to: "/en/office-rental-bordeaux" },
  { from: "/praticien/vanessa-marty", to: "/patients" },
  // Parrainage mis en sommeil (Sprint 16, 17/07/2026) : page retirée de App.tsx et du sitemap.
  { from: "/parrainage", to: "/professionnels" },
  { from: "/en/referral", to: "/en/health-professionals" },

  // Anciennes URLs du site precedent, lot 5 du sprint 14. Elles etaient
  // redirigees COTE CLIENT seulement, par un <Navigate> d'App.tsx : une
  // personne arrivait a destination, un robot recevait un 404. Mesure du
  // 21/08/2026 sur le site servi : les treize rendaient 404, avec et sans slash
  // final. Les cibles ci-dessous sont celles que declarent les <Navigate>
  // existants, relevees et non devinees.
  { from: "/vision", to: "/notre-approche" },
  { from: "/a-propos", to: "/notre-approche" },
  { from: "/collectivites", to: "/notre-approche" },
  { from: "/methode", to: "/notre-approche" },
  { from: "/praticiens", to: "/professionnels" },
  { from: "/nos-offres", to: "/professionnels" },
  { from: "/realisations", to: "/projets" },
  { from: "/blog", to: "/insights" },
  // Cible volontairement desindexee : /investissement est "dormant", noindex et
  // hors sitemap. La souche dit quand meme ou la page a bougé, ce qui laisse un
  // robot consolider les deux et les retirer ensemble, plutot que de garder une
  // ancienne URL en 404 sans explication.
  { from: "/investisseurs", to: "/investissement" },

  // Anciennes URLs d'articles, meme cas et meme mesure. Elles figuraient dans
  // ECARTS_DECLARES de checkRoutesConcordance.mjs comme divergences acceptees :
  // poser leur souche est ce qui permet de les en retirer.
  { from: "/blog/trouver-cabinet-bordeaux-praticien", to: "/insights/cabinet-medical-bordeaux" },
  { from: "/blog/combien-coute-cabinet-consultation-bordeaux", to: "/insights/budget-cabinet-bordeaux" },
  { from: "/en/blog/finding-office-bordeaux-practitioner", to: "/en/insights/medical-office-bordeaux" },
  { from: "/en/blog/consultation-office-cost-bordeaux", to: "/en/insights/office-budget-bordeaux" },
];

// ── Resolution du navigateur ────────────────────────────────────────
// Chaque branche prise s'ecrit dans le journal, y compris l'echec d'une
// branche et son motif : un build doit pouvoir se relire.
//
// La branche qui interrogeait `npx puppeteer browsers installed` a ete
// RETIREE au Sprint 13 lot 5, et non corrigee. Le motif n'est pas qu'elle
// etait cassee, c'est ce qu'elle etait : analyser la sortie humaine d'un
// outil en ligne de commande alors qu'une interface programmatique existe.
// Ce format n'est pas une interface, et la meme fonction s'y etait trompee
// deux fois. Sur le nom de la sous-commande d'abord : `installed` n'existe
// pas, @puppeteer/browsers ne declare que `install`, `clear` et `list`, et
// yargs rend alors 0 avec zero octet, donc sans lever. Sur la forme de la
// ligne ensuite : `list` rend `chrome@VERSION (plateforme) CHEMIN`, et la
// regex ignorait le champ de plateforme. La corriger aurait reconduit la
// fragilite un cran plus loin. `puppeteer.executablePath()` rend le meme
// chemin, sans aucun parsing.
//
// Le `catch` silencieux disparait avec elle. A noter pour la prochaine
// fois : il n'a PAS masque l'echec du run #183, puisqu'il ne s'est jamais
// declenche, la commande inconnue ne levant pas. Il aurait masque le
// suivant.
function findChromium() {
  // 1. Chemin impose par l'environnement.
  const impose = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (impose) {
    if (existsSync(impose)) {
      console.log(`[prerender] Navigateur, branche 1 : PUPPETEER_EXECUTABLE_PATH → ${impose}`);
      return impose;
    }
    console.warn(`[prerender] Navigateur, branche 1 ecartee : PUPPETEER_EXECUTABLE_PATH=${impose} est absent du disque.`);
  }

  // 2. Le navigateur que Puppeteer a telecharge, resolu par son interface.
  //    C'est celui que `npx puppeteer browsers install chrome` depose en CI.
  try {
    const chemin = puppeteer.executablePath();
    if (existsSync(chemin)) {
      console.log(`[prerender] Navigateur, branche 2 : puppeteer.executablePath() → ${chemin}`);
      return chemin;
    }
    console.warn(`[prerender] Navigateur, branche 2 ecartee : puppeteer.executablePath() rend ${chemin}, absent du disque.`);
  } catch (err) {
    console.warn(`[prerender] Navigateur, branche 2 ecartee : puppeteer.executablePath() a leve ${String(err && err.message).split("\n")[0]}`);
  }

  // 3. Chemins systeme. On y arrive quand le navigateur du build est
  //    introuvable : la resolution n'est alors plus deterministe, et le
  //    journal doit le dire.
  const candidats = [
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  for (const candidat of candidats) {
    if (existsSync(candidat)) {
      console.warn(
        `[prerender] Navigateur, branche 3 : chemin systeme → ${candidat}. ` +
          "Le navigateur installe par le build est introuvable, la resolution n'est donc pas deterministe.",
      );
      return candidat;
    }
  }

  console.error("[prerender] Navigateur : aucune des trois branches n'a abouti.");
  return null;
}

// ── Dedup SEO tags in final HTML ────────────────────────────────────
function deduplicateHtml(html) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const head = doc.head;

  // Le <title> garde la PREMIERE occurrence, tout le reste la DERNIERE.
  // L'asymetrie vient de React 19, qui insere chaque <title> AVANT le
  // premier titre deja present (mountHoistable : head.insertBefore(instance,
  // querySelector("head > title"))) et se contente d'ajouter en fin pour
  // <meta> et <link>. La page, montee en dernier, arrive donc en TETE pour le
  // titre et en QUEUE pour le reste. Tant que react-helmet-async posait le
  // head, tout arrivait en fin et une regle unique suffisait.
  deduplicateTagKeepFirst(head, "title");
  deduplicateMetaByName(head, "description");
  deduplicateMetaByName(head, "twitter:title");
  deduplicateMetaByName(head, "twitter:description");
  deduplicateMetaByName(head, "twitter:image");
  deduplicateMetaByName(head, "twitter:card");
  deduplicateMetaByProperty(head, "og:title");
  deduplicateMetaByProperty(head, "og:description");
  deduplicateMetaByProperty(head, "og:url");
  deduplicateMetaByProperty(head, "og:image");
  deduplicateMetaByProperty(head, "og:type");
  deduplicateMetaByProperty(head, "og:locale");
  deduplicateMetaByProperty(head, "og:site_name");
  deduplicateLinkByRel(head, "canonical");

  // Deduplicate hreflang: keep last per hreflang value
  const hreflangs = head.querySelectorAll('link[rel="alternate"][hreflang]');
  const seen = new Map();
  for (const el of hreflangs) {
    const lang = el.getAttribute("hreflang");
    if (seen.has(lang)) seen.get(lang).remove();
    seen.set(lang, el);
  }

  return dom.serialize();
}

// Garde la PREMIERE occurrence. Reservee au <title>, voir deduplicateHtml.
function deduplicateTagKeepFirst(head, tagName) {
  const els = head.querySelectorAll(tagName);
  for (let i = 1; i < els.length; i++) els[i].remove();
}

function deduplicateMetaByName(head, name) {
  const els = head.querySelectorAll(`meta[name="${name}"]`);
  if (els.length > 1) {
    for (let i = 0; i < els.length - 1; i++) els[i].remove();
  }
}

function deduplicateMetaByProperty(head, prop) {
  const els = head.querySelectorAll(`meta[property="${prop}"]`);
  if (els.length > 1) {
    for (let i = 0; i < els.length - 1; i++) els[i].remove();
  }
}

function deduplicateLinkByRel(head, rel) {
  const els = head.querySelectorAll(`link[rel="${rel}"]`);
  if (els.length > 1) {
    for (let i = 0; i < els.length - 1; i++) els[i].remove();
  }
}

// ── Attentes DOM par route ──────────────────────────────────────────
// Un fait DECLARE, jamais un delai. Depuis le lot 2 le JSON-LD est rendu dans
// le CORPS : il n'existe que tant que son composant rend. Un composant qui rend
// null en attendant sa requete est, vu du DOM, indiscernable d'un composant qui
// a fini et n'a rien a montrer. La capture ne peut donc pas savoir si elle doit
// attendre, et elle partait parfois trop tot : /en/projects/i-ca-re-nansouty
// perdait son bloc sur 1 capture sur 8, mesure sur 8 captures avec la coquille
// pristine. Tant que react-helmet-async ecrivait dans le head, la balise y
// restait une fois posee et la course etait invisible.
//
// Le composant declare donc son etat par un attribut, et la capture attend cet
// attribut. Pas de seuil de temps regle a la main, et l'attente echoue si le
// fait ne vient jamais, ce que la reprise par route absorbe comme le reste.
const ATTENTES_DOM = [
  {
    match: (p) => /^(\/en)?\/(projets|projects)\/./.test(p),
    selecteur: "[data-praticiens-cabinet]",
    label: "section praticiens du cabinet",
  },
  {
    match: (p) => p === "/temoignages-praticiens" || p === "/en/practitioner-testimonials",
    selecteur: "[data-avis-mis-en-avant]",
    label: "avis Google mis en avant",
  },
  {
    match: (p) => p === "/patients/problematiques",
    selecteur: "[data-problematiques-publiees]",
    label: "index des problematiques publiees",
  },
];

function attenteDom(routePath) {
  const p = routePath !== "/" ? routePath.replace(/\/$/, "") : routePath;
  return ATTENTES_DOM.find((a) => a.match(p)) || null;
}

// ── Validation ──────────────────────────────────────────────────────
function validateHtml(html, route) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const errors = [];

  const title = doc.querySelector("title");
  if (!title || !title.textContent.trim()) errors.push("Missing <title>");

  const desc = doc.querySelector('meta[name="description"]');
  if (!desc || !desc.getAttribute("content")?.trim()) errors.push("Missing meta description");

  const canonical = doc.querySelector('link[rel="canonical"]');
  if (!canonical || !canonical.getAttribute("href")?.trim()) errors.push("Missing canonical");

  const h1 = doc.querySelector("h1");
  if (!h1 || !h1.textContent.trim()) errors.push("Missing H1");

  // Check for www.i-ca.re
  if (html.includes("www.i-ca.re")) errors.push("Contains www.i-ca.re reference");

  // Check hreflang
  const hreflangs = doc.querySelectorAll('link[rel="alternate"][hreflang]');
  if (hreflangs.length === 0) errors.push("Missing hreflang tags");

  // Check duplicate canonicals
  const canonicals = doc.querySelectorAll('link[rel="canonical"]');
  if (canonicals.length > 1) errors.push(`Duplicate canonical (${canonicals.length})`);

  // Check duplicate descriptions
  const descs = doc.querySelectorAll('meta[name="description"]');
  if (descs.length > 1) errors.push(`Duplicate meta description (${descs.length})`);

  // Check duplicate titles
  const titles = doc.querySelectorAll("title");
  if (titles.length > 1) errors.push(`Duplicate title (${titles.length})`);

  return errors;
}

function validateRouteType(html, route) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const errors = [];
  const noindex = doc.querySelector('meta[name="robots"][content*="noindex"]');

  if (route.type === "legal" || route.type === "dormant") {
    if (!noindex) errors.push(`${route.type === "legal" ? "Legal" : "Dormant"} page missing noindex`);
  } else {
    if (noindex) errors.push("Strategic page has noindex: should NOT");
  }

  // JSON-LD : controle bloquant depuis le sprint 9 (voir JSONLD_EXPECTATIONS)
  errors.push(...checkJsonLd(doc, route.path).errors);

  if (route.attendServiceProvider) {
    const porte = [...doc.querySelectorAll('script[type="application/ld+json"]')].some((el) => {
      try {
        const j = JSON.parse(el.textContent);
        return Array.isArray(j?.serviceProvider) && j.serviceProvider.length > 0;
      } catch {
        return false;
      }
    });
    if (!porte) errors.push("JSON-LD cabinet : bloc serviceProvider absent");
  }

  // Filet des avis mis en avant, desormais derive de la SOURCE et non de la page.
  // Le compte vient de fetchAvisMisEnAvant, meme filtre que la requete de la page,
  // si bien que le controle peut dire combien de blocs Review sont dus sans
  // demander son avis a la page qu'il controle. La version precedente lisait le
  // marqueur data-avis-mis-en-avant, donc une requete de page en echec silencieux
  // rendait un marqueur a zero et le filet le validait. Le marqueur reste, mais
  // pour ce a quoi il sert vraiment : faire attendre la capture, voir ATTENTES_DOM.
  if (route.attendAvis !== undefined) {
    const rendus = [...doc.querySelectorAll('script[type="application/ld+json"]')].filter((el) => {
      try {
        return JSON.parse(el.textContent)?.["@type"] === "Review";
      } catch {
        return false;
      }
    }).length;
    if (rendus !== route.attendAvis) {
      errors.push(`JSON-LD avis : ${rendus} bloc(s) Review pour ${route.attendAvis} avis actif(s) en base`);
    }
  }

  return errors;
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  const execPath = findChromium();
  if (!execPath) {
    const msg = "[prerender] ERROR: No Chromium/Chrome executable found.";
    console.error(msg);
    if (OPTIONAL) {
      console.warn("[prerender] PRERENDER_OPTIONAL=true → skipping prerender (exit 0).");
      process.exit(0);
    }
    console.error("Set PUPPETEER_EXECUTABLE_PATH or install Chromium. Build aborted.");
    process.exit(1);
  }
  console.log(`[prerender] Using browser: ${execPath}`);

  // ── Dynamic routes: praticiens publiés + détails problématiques matchés ──
  // Fetch avant lancement du navigateur pour un mode d'échec clair.
  const dynamicRoutes = [];
  // Cabinets ayant au moins une praticienne ou un praticien valide. Derive de la
  // MEME source que les routes dynamiques, fetchPraticiensPublies, et non devine :
  // c'est ce qui rend l'attente du bloc serviceProvider exigible sans supposition.
  const cabinetsAvecPraticiens = new Set();
  // Nombre d'avis Google actifs, lu a la source. Vaut null si la lecture n'a pas
  // eu lieu, auquel cas le filet ne s'applique pas plutot que de compter zero.
  let nbAvisMisEnAvant = null;
  if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
    try {
      const {
        fetchPraticiensPublies,
        fetchProblematiques,
        matchProblematiques,
        fetchSpecialites,
        matchSpecialites,
        fetchArticlesPublies,
        fetchInstallationMatrix,
        fetchAvisMisEnAvant,
      } = await import("./publishedRoutes.mjs");
      const praticiens = await fetchPraticiensPublies();
      for (const p of praticiens) {
        const cs = (p?.cabinet_slug ?? "").toString().trim();
        if (cs) cabinetsAvecPraticiens.add(cs);
      }
      const problematiques = await fetchProblematiques();
      const matched = matchProblematiques(problematiques, praticiens);
      const specialites = await fetchSpecialites();
      const matchedSp = matchSpecialites(specialites, praticiens);
      const articles = await fetchArticlesPublies();
      const installation = await fetchInstallationMatrix();
      nbAvisMisEnAvant = (await fetchAvisMisEnAvant()).length;

      const seenP = new Set();
      for (const p of praticiens) {
        const slug = (p?.slug ?? "").toString().trim();
        if (!slug || seenP.has(slug)) continue;
        seenP.add(slug);
        dynamicRoutes.push({ path: `/praticien/${slug}`, type: "strategic" });
      }
      const seenPb = new Set();
      for (const pb of matched) {
        const slug = (pb?.slug ?? "").toString().trim();
        if (!slug || seenPb.has(slug)) continue;
        seenPb.add(slug);
        dynamicRoutes.push({
          path: `/patients/problematiques/${slug}`,
          type: "strategic",
        });
      }
      const seenSp = new Set();
      for (const sp of matchedSp) {
        const slug = (sp?.slug ?? "").toString().trim();
        if (!slug || seenSp.has(slug)) continue;
        seenSp.add(slug);
        dynamicRoutes.push({
          path: `/patients/specialite/${slug}`,
          type: "strategic",
        });
      }
      const seenAr = new Set();
      for (const ar of articles) {
        const slug = (ar?.slug ?? "").toString().trim();
        if (!slug || seenAr.has(slug)) continue;
        seenAr.add(slug);
        dynamicRoutes.push({
          path: `/patients/articles/${slug}`,
          type: "strategic",
        });
      }
      for (const path of installation.paths) {
        dynamicRoutes.push({ path, type: "strategic" });
      }
      console.log(
        `[prerender] Dynamic routes: ${seenP.size} praticiens + ${seenPb.size} problematiques + ${seenSp.size} specialites + ${seenAr.size} articles + ${installation.paths.length} sinstaller (${installation.professions.length} professions × ${installation.villes.length} villes)`,
      );
    } catch (err) {
      const msg = `[prerender] Failed to fetch dynamic routes: ${err?.message || err}`;
      if (err?.isEditorialGuard) {
        console.error(`[prerender] ✗ ${err.message}`);
        process.exit(1);
      }
      if (OPTIONAL) {
        console.warn(`${msg}: PRERENDER_OPTIONAL=true, skipping dynamic routes.`);
      } else {
        console.error(msg);
        process.exit(1);
      }
    }
  } else {
    const msg = "[prerender] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY: dynamic routes skipped.";
    if (OPTIONAL) {
      console.warn(msg);
    } else {
      console.error(msg);
      process.exit(1);
    }
  }
  // Une page cabinet dont le cabinet a des praticiennes ou des praticiens DOIT
  // porter le bloc MedicalBusiness a serviceProvider de SectionPraticiensDuCabinet.
  // Sans ce filet, son absence passe : l'attente declaree pour ces routes est
  // MedicalBusiness + Organization, et elle est deja satisfaite par le bloc propre
  // de ProjetDetail. C'est exactement ce qui a laisse passer un bloc sur 691.
  const allRoutes = [...ROUTES, ...dynamicRoutes].map((r) => {
    const m = r.path.match(/^(?:\/en)?\/(?:projets|projects)\/([^/]+)$/);
    if (m && cabinetsAvecPraticiens.has(m[1])) return { ...r, attendServiceProvider: true };
    const p = r.path !== "/" ? r.path.replace(/\/$/, "") : r.path;
    if (nbAvisMisEnAvant !== null && (p === "/temoignages-praticiens" || p === "/en/practitioner-testimonials")) {
      return { ...r, attendAvis: nbAvisMisEnAvant };
    }
    return r;
  });
  const nbFilet = allRoutes.filter((r) => r.attendServiceProvider).length;
  const nbFiletAvis = allRoutes.filter((r) => r.attendAvis !== undefined).length;
  console.log(`[prerender] Filet serviceProvider : ${nbFilet} route(s) cabinet concernee(s).`);
  console.log(`[prerender] Filet Review : ${nbFiletAvis} route(s), ${nbAvisMisEnAvant ?? "n/a"} avis actif(s) lu(s) a la source.`);

  // 1. Serve dist/ locally
  //
  // La coquille SPA est lue UNE FOIS, avant toute capture, et servie depuis la
  // memoire. Elle ne peut pas etre relue dans dist/ a chaque requete : la
  // premiere route de ROUTES est "/", sa capture ECRASE dist/index.html, et les
  // 187 routes suivantes booteraient alors sur un <head> portant deja le titre,
  // la canonical, les hreflang et les og de l'accueil.
  //
  // Tant que react-helmet-async posait le head, elle balayait ces balises au
  // demarrage : updateTags() reclame tout [data-rh] present et retire ce qu'elle
  // ne reemet pas. Rendues nativement par React 19, elles ne portent plus de
  // marqueur et rien ne les retire. La deduplication masque le probleme pour les
  // proprietes qu'elle traite, en gardant celle de la page, mais pas pour
  // og:image:width, og:image:height, og:image:alt et twitter:image:alt, ni pour
  // un hreflang que la page n'emet pas elle-meme.
  const SHELL = await readFile(join(DIST, "index.html"), "utf-8");
  const estUnFichier = (chemin) => {
    const cible = join(DIST, chemin);
    return existsSync(cible) && !statSync(cible).isDirectory();
  };
  const server = createServer((req, res) => {
    let chemin;
    try {
      chemin = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch {
      chemin = "/";
    }
    if (estUnFichier(chemin)) return handler(req, res, { public: DIST });
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(SHELL);
  });
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`[prerender] Serving dist/ on http://localhost:${PORT}`);

  // 2. Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: execPath,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  let ok = 0;
  let fail = 0;
  let routesReprises = 0;
  let routesSauvees = 0;
  let reprisesConsommees = 0;
  const report = [];

  // Un essai de capture : rend le HTML et les erreurs de controle, sans ecrire
  // sur le disque. L'ecriture n'a lieu qu'une fois le verdict rendu, pour ne
  // jamais laisser sur le disque une capture qu'une reprise a remplacee.
  async function tenterCapture(route) {
    let page = null;
    try {
      page = await browser.newPage();
      await page.goto(`http://localhost:${PORT}${route.path}`, {
        waitUntil: "networkidle0",
        timeout: 20000,
      });
      // Attendre la canonical, et non <title> : index.html porte desormais un
      // titre de repli, donc waitForSelector("title") serait satisfait avant
      // que React ait monte quoi que ce soit. La canonical n'existe que si la
      // page a rendu, et le controle l'exige deja sur toute route capturee.
      await page.waitForSelector('link[rel="canonical"]', { timeout: 5000 });
      // Puis les attentes DECLAREES de la route, s'il y en a. Voir ATTENTES_DOM.
      const attente = attenteDom(route.path);
      if (attente) await page.waitForSelector(attente.selecteur, { timeout: 5000 });
      const brut = await page.content();
      const html = deduplicateHtml(brut);
      return { html, erreurs: [...validateHtml(html, route), ...validateRouteType(html, route)], leve: null };
    } catch (err) {
      // Une exception est une forme PLUS FORTE de ne pas satisfaire le controle,
      // pas une forme differente : timeout de navigation, selecteur jamais
      // apparu, connexion fermee. Elle est donc reprise comme les autres. On la
      // conserve telle quelle pour que le verdict final rende l'erreur d'origine
      // et non un message de reprise.
      return { html: null, erreurs: [err.message], leve: err };
    } finally {
      // La fermeture peut lever a son tour si la connexion est deja tombee :
      // elle ne doit jamais masquer l'erreur d'origine.
      if (page) await page.close().catch(() => {});
    }
  }

  for (const route of allRoutes) {
    const entry = {
      url: route.path,
      type: route.type,
      prerendered: false,
      title: false,
      description: false,
      canonical: false,
      hreflang: false,
      h1: false,
      jsonLd: "n/a",
      noindex: "n/a",
      errors: [],
    };

    try {
      // Essais bornes. Un essai n'est accepte que si le controle ne remonte
      // AUCUNE erreur : c'est le meme controle qu'avant, applique plus tot.
      let resultat = null;
      let essaisFaits = 0;
      for (let essai = 1; essai <= ESSAIS_MAX; essai++) {
        essaisFaits = essai;
        resultat = await tenterCapture(route);
        if (resultat.erreurs.length === 0) break;
        // Reprise seulement s'il reste un essai ET du budget global.
        if (essai === ESSAIS_MAX) break;
        if (reprisesConsommees >= BUDGET_REPRISES) {
          console.warn(
            `[prerender] ↻ ${route.path} : budget de reprises epuise (${BUDGET_REPRISES}), essai ${essai} conserve tel quel.`,
          );
          break;
        }
        reprisesConsommees++;
        console.log(
          `[prerender] ↻ ${route.path} : essai ${essai} refuse (${resultat.erreurs.join(", ")}), reprise ${essai + 1}/${ESSAIS_MAX}.`,
        );
        await new Promise((r) => setTimeout(r, ATTENTE_REPRISE_MS));
      }
      if (essaisFaits > 1) {
        routesReprises++;
        if (resultat.erreurs.length === 0) routesSauvees++;
      }

      if (resultat.leve) {
        // Essais epuises sur une exception : rien a ecrire, et on rend l'erreur
        // d'origine, exactement comme avant ce lot.
        console.error(`[prerender] ✗ ${route.path}: ${resultat.leve.message}`);
        entry.errors.push(resultat.leve.message);
        fail++;
        report.push(entry);
        continue;
      }

      let html = resultat.html;

      // Determine output path
      const clean = route.path.replace(/\/$/, "") || "/index";
      const outPath =
        clean === "/index"
          ? join(DIST, "index.html")
          : join(DIST, clean, "index.html");

      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, html, "utf-8");
      console.log(`[prerender] ✓ ${route.path} → ${outPath.replace(DIST, "dist")}`);
      entry.prerendered = true;

      // Verdict final : celui du dernier essai retenu. Un ⚠ n'est emis que la,
      // donc une route sauvee par une reprise n'en produit aucun. C'est la
      // ligne de synthese des reprises, et elle seule, qui garde la trace de
      // l'incident : une reprise silencieuse effacerait la mesure.
      entry.errors = [...resultat.erreurs];

      // Parse for report
      const dom = new JSDOM(html);
      const doc = dom.window.document;
      entry.title = !!doc.querySelector("title")?.textContent?.trim();
      entry.description = !!doc.querySelector('meta[name="description"]')?.getAttribute("content")?.trim();
      entry.canonical = !!doc.querySelector('link[rel="canonical"]')?.getAttribute("href")?.trim();
      entry.hreflang = doc.querySelectorAll('link[rel="alternate"][hreflang]').length > 0;
      entry.h1 = !!doc.querySelector("h1")?.textContent?.trim();

      const noindex = doc.querySelector('meta[name="robots"][content*="noindex"]');
      entry.noindex = route.type === "legal" || route.type === "dormant"
        ? (noindex ? "✓ present" : "✗ MISSING")
        : (noindex ? "✗ UNEXPECTED" : "✓ absent");

      const jsonLdResult = checkJsonLd(doc, route.path);
      entry.jsonLd = jsonLdResult.label;
      entry.jsonLdChecked = jsonLdResult.checked;
      entry.jsonLdConform = jsonLdResult.conform;
      entry.jsonLdFound = jsonLdResult.found;
      entry.jsonLdUnreadable = jsonLdResult.unreadable;
      entry.jsonLdMissing = jsonLdResult.missing;
      if (process.env.JSONLD_SURVEY === "true") {
        console.log(`[jsonld-survey] ${route.path} :: ${jsonLdResult.found.join(", ") || "aucun"}`);
      }

      if (entry.errors.length === 0) ok++;
      else {
        console.warn(`[prerender] ⚠ ${route.path}: ${entry.errors.join(", ")}`);
        ok++; // still prerendered, just warnings
      }
    } catch (err) {
      console.error(`[prerender] ✗ ${route.path}: ${err.message}`);
      entry.errors.push(err.message);
      fail++;
    }

    report.push(entry);
  }

  await browser.close();
  server.close();

  // Write static redirect stubs (legacy → cible). Pas de <script>, donc pas d'hydratation SPA :
  // le meta-refresh s'exécute seul et le canonical signale la consolidation à Google.
  for (const r of REDIRECTS) {
    const cleanFrom = r.from.replace(/\/$/, "");
    const stubPath = join(DIST, cleanFrom, "index.html");
    const targetAbs = pageUrl(r.to);
    const stub = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${pagePath(r.to)}">
<link rel="canonical" href="${targetAbs}">
<title>Redirection…</title>
</head>
<body>
<p>Cette page a déménagé. <a href="${pagePath(r.to)}">Continuer vers la nouvelle page</a>.</p>
</body>
</html>`;
    await mkdir(dirname(stubPath), { recursive: true });
    await writeFile(stubPath, stub, "utf-8");
    console.log(`[prerender] ↪ redirect ${r.from} → ${r.to}`);
  }

  // Create 404.html for GitHub Pages SPA fallback (copy root index.html)
  const rootIndex = join(DIST, "index.html");
  const fallback404 = join(DIST, "404.html");
  try {
    const rootHtml = await readFile(rootIndex, "utf-8");
    await writeFile(fallback404, rootHtml, "utf-8");
    console.log(`[prerender] ✓ Created 404.html (SPA fallback for GitHub Pages)`);
  } catch (err) {
    console.warn(`[prerender] ⚠ Could not create 404.html: ${err.message}`);
  }

  // Print validation report
  console.log("\n══════════════════════════════════════════════════════════════");
  console.log("PRERENDER VALIDATION REPORT");
  console.log("══════════════════════════════════════════════════════════════");
  for (const r of report) {
    const status = r.prerendered ? "✓" : "✗";
    const errs = r.errors.length > 0 ? ` [${r.errors.join("; ")}]` : "";
    console.log(
      `${status} ${r.url.padEnd(50)} title:${r.title ? "✓" : "✗"} desc:${r.description ? "✓" : "✗"} canon:${r.canonical ? "✓" : "✗"} href:${r.hreflang ? "✓" : "✗"} h1:${r.h1 ? "✓" : "✗"} noindex:${r.noindex} jsonld:${r.jsonLd}${errs}`
    );
  }
  console.log("══════════════════════════════════════════════════════════════");

  // Synthese des reprises. Imprimee MEME a zero : c'est la mesure de frequence
  // de la course Supabase / networkidle0, et le seul moyen de savoir dans trois
  // mois si elle s'aggrave avec le nombre de routes.
  console.log(
    `[prerender] Reprises : ${routesReprises} route(s) reprise(s), ${routesSauvees} sauvee(s) a la reprise, ` +
      `${reprisesConsommees} essai(s) supplementaire(s) sur un budget de ${BUDGET_REPRISES}.`,
  );

  // Synthese JSON-LD (controle bloquant depuis le sprint 9)
  const jsonLdChecked = report.filter((r) => r.jsonLdChecked);
  const jsonLdConform = jsonLdChecked.filter((r) => r.jsonLdConform);
  console.log(
    `[prerender] JSON-LD : ${jsonLdChecked.length} route(s) controlee(s), ${jsonLdConform.length} conforme(s), ${jsonLdChecked.length - jsonLdConform.length} non conforme(s).`
  );

  // Echecs JSON-LD bloquants : non conformite sur route controlee, ou bloc illisible
  // quel que soit le type de route.
  const jsonLdFails = report.filter(
    (r) => (r.jsonLdChecked && r.jsonLdConform === false) || r.jsonLdUnreadable
  );
  if (jsonLdFails.length > 0) {
    console.error(`\n[prerender] JSON-LD NON CONFORME sur ${jsonLdFails.length} route(s) :`);
    for (const f of jsonLdFails) {
      const detail = f.jsonLdUnreadable
        ? "bloc JSON-LD illisible"
        : `types manquants : ${(f.jsonLdMissing || []).join(", ")}`;
      console.error(`  - ${f.url} (${f.type}) : ${detail}`);
    }
  }

  // Check for critical failures on strategic pages
  const criticalFails = report.filter(
    (r) => r.type === "strategic" && (!r.prerendered || !r.title || !r.description || !r.canonical || !r.h1)
  );
  if (criticalFails.length > 0) {
    console.error(`\n[prerender] CRITICAL: ${criticalFails.length} strategic page(s) have missing SEO elements:`);
    for (const f of criticalFails) {
      console.error(`  - ${f.url}: ${f.errors.join(", ")}`);
    }
  }

  const total = report.filter((r) => r.prerendered).length;
  console.log(
    `\n[prerender] Done: ${total} prerendered, ${fail} failed out of ${allRoutes.length} routes.`
  );

  // Fail on critical SEO issues on strategic pages (even if prerender succeeded)
  if (jsonLdFails.length > 0 && !OPTIONAL) {
    console.error(`\n[prerender] BUILD FAILED: ${jsonLdFails.length} route(s) avec un JSON-LD non conforme ou illisible.`);
    process.exit(1);
  }

  if (criticalFails.length > 0 && !OPTIONAL) {
    console.error(`\n[prerender] BUILD FAILED: ${criticalFails.length} strategic page(s) missing critical SEO elements.`);
    process.exit(1);
  }

  if (fail > 0 && !OPTIONAL) {
    console.error(`\n[prerender] BUILD FAILED: ${fail} route(s) failed to prerender.`);
    process.exit(1);
  }

  if (fail > 0 || criticalFails.length > 0 || jsonLdFails.length > 0) {
    console.warn(`\n[prerender] PRERENDER_OPTIONAL=true → continuing despite ${fail} failures, ${criticalFails.length} critical issues and ${jsonLdFails.length} JSON-LD issues.`);
  }

  process.exit(0);
}

main();
