#!/usr/bin/env node
/**
 * Controle de concordance des referentiels de routes.
 *
 * Le depot tient QUATRE listes de chemins a la main, et rien ne verifiait
 * qu'elles se repondent :
 *   1. routeMap, dans src/lib/routes.ts, lu par 29 fichiers du client
 *   2. les declarations <Route path=...> d'App.tsx, ce que le routeur sert
 *   3. ROUTES et REDIRECTS de scripts/prerender.mjs, ce qui est reellement servi
 *      en HTML statique
 *   4. les <loc> de public/sitemap.xml, ce que nous declarons a Google
 *
 * Arbitrage du 21/08/2026 : on instrumente, on n'unifie pas. Une unification
 * complete est un sprint de trois a quatre lots dont un de migration a diff non
 * vide par construction ; cet instrument coute un lot, ne touche aucun
 * consommateur, et attrape la classe entiere.
 *
 * AUCUN cinquieme referentiel n'est cree ici : routeMap est COMPILE depuis le
 * vrai src/lib/routes.ts, les trois autres listes sont lues dans leurs fichiers.
 * Un jumeau ecrit a la main serait precisement le defaut que ce controle traque.
 *
 * Le controle est un lecteur de fichiers : il n'ouvre aucune connexion et ne
 * depend d'aucune variable d'environnement.
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import * as esbuild from "esbuild";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Ecarts DECLARES. Un chemin listé ici diverge volontairement : le controle se
 * tait. Un chemin qui diverge sans y figurer est une divergence SUBIE : le
 * controle la signale. Retirer une entree est la facon de redemander l'alerte.
 *
 * `absentDe` vaut "app", "prerendu" ou "sitemap". Un ecart declare pour "app"
 * reste signale s'il apparait sur "prerendu" : declarer n'est pas taire.
 */
const ECARTS_DECLARES = [
  { chemin: "/parrainage", absentDe: ["app", "sitemap"], motif: "mis en sommeil au sprint 16, retire d'App.tsx, servi par une souche de redirection" },
  { chemin: "/en/referral", absentDe: ["app", "sitemap"], motif: "idem /parrainage, cote anglais" },
  { chemin: "/investissement/interet", absentDe: ["prerendu", "sitemap"], motif: "page dormante, noindex et hors sitemap, atteinte par clic depuis /investissement qui porte nofollow" },
  { chemin: "/investissement/memo", absentDe: ["prerendu", "sitemap"], motif: "idem, accessible seulement apres verification par courriel" },
  { chemin: "/investissement/verify", absentDe: ["prerendu", "sitemap"], motif: "idem, page de retour de verification, sans contenu propre" },
  { chemin: "/en/investment/interest", absentDe: ["prerendu", "sitemap"], motif: "idem /investissement/interet, cote anglais" },
  { chemin: "/en/investment/memo", absentDe: ["prerendu", "sitemap"], motif: "idem /investissement/memo, cote anglais" },
  { chemin: "/en/investment/verify", absentDe: ["prerendu", "sitemap"], motif: "idem /investissement/verify, cote anglais" },
  { chemin: "/blog/trouver-cabinet-bordeaux-praticien", absentDe: ["prerendu", "sitemap"], motif: "ancienne URL, redirigee cote client vers /insights/cabinet-medical-bordeaux" },
  { chemin: "/blog/combien-coute-cabinet-consultation-bordeaux", absentDe: ["prerendu", "sitemap"], motif: "ancienne URL, redirigee cote client vers /insights/budget-cabinet-bordeaux" },
  { chemin: "/en/blog/finding-office-bordeaux-practitioner", absentDe: ["prerendu", "sitemap"], motif: "ancienne URL anglaise, redirigee cote client" },
  { chemin: "/en/blog/consultation-office-cost-bordeaux", absentDe: ["prerendu", "sitemap"], motif: "ancienne URL anglaise, redirigee cote client" },
];

const norm = (p) => {
  const s = String(p).split("#")[0].split("?")[0].replace(/\/+$/, "");
  return s || "/";
};

// ── 1. routeMap, compile depuis le vrai fichier TypeScript ──────────
async function lireRouteMap() {
  const ts = readFileSync(join(ROOT, "src/lib/routes.ts"), "utf8");
  const { code } = await esbuild.transform(ts, { loader: "ts", format: "esm" });
  const url = "data:text/javascript;base64," + Buffer.from(code).toString("base64");
  const mod = await import(url);
  const chemins = new Set();
  for (const lang of ["fr", "en"]) {
    for (const cle of Object.keys(mod.routeMap[lang])) chemins.add(norm(mod.localePath(lang, cle)));
  }
  return { chemins, getEquivalentPath: mod.getEquivalentPath };
}

// ── 2. App.tsx : ce que le routeur sert ─────────────────────────────
// Les routes anglaises sont imbriquees sous <Route path="/en/*">, donc
// relatives : leur chemin absolu se reconstitue en prefixant /en.
function lireApp() {
  const txt = readFileSync(join(ROOT, "src/App.tsx"), "utf8");
  const debutNid = txt.indexOf('path="/en/*"');
  const finNid = txt.indexOf("</Routes></LangSync>", debutNid);
  const fixes = new Set();
  const parametrees = new Set();
  const navigate = new Set();
  for (const m of txt.matchAll(/<Route\b/g)) {
    const bout = txt.slice(m.index, m.index + 600);
    const pm = bout.match(/path="([^"]+)"/);
    if (!pm) continue;
    let p = pm[1];
    if (["/en/*", "/*", "/fr/*", "*"].includes(p)) continue;
    if (m.index > debutNid && m.index < finNid) p = "/en" + (p === "/" ? "" : p);
    const q = norm(p);
    if (/element=\{<Navigate/.test(bout)) navigate.add(q);
    (q.includes(":") ? parametrees : fixes).add(q);
  }
  return { fixes, parametrees, navigate };
}

// ── 3. prerender.mjs : ce qui est servi en HTML statique ────────────
function lirePrerendu() {
  const txt = readFileSync(join(ROOT, "scripts/prerender.mjs"), "utf8");
  const bloc = (nom, cle) => {
    const d = txt.indexOf(`const ${nom} = [`);
    const b = txt.slice(d, d + txt.slice(d).indexOf("\n];"));
    return new Set([...b.matchAll(new RegExp(`${cle}:\\s*"([^"]+)"`, "g"))].map((x) => norm(x[1])));
  };
  return { routes: bloc("ROUTES", "path"), redirections: bloc("REDIRECTS", "from") };
}

// ── 4 bis. robots.txt : ce qu'un robot n'explore pas ────────────────
// Un chemin interdit d'exploration ne peut pas rendre 404 a un robot, il ne
// sera jamais demande. Le filtrer garde le signal lisible.
function lireInterdits() {
  const txt = readFileSync(join(ROOT, "public/robots.txt"), "utf8");
  return [...txt.matchAll(/^\s*Disallow:\s*(\S+)\s*$/gim)].map((x) => norm(x[1]));
}

// ── 4. sitemap de base ──────────────────────────────────────────────
function lireSitemap() {
  const txt = readFileSync(join(ROOT, "public/sitemap.xml"), "utf8");
  return new Set([...txt.matchAll(/<loc>([^<]+)<\/loc>/g)].map((x) => norm(x[1].replace(/^https?:\/\/i-ca\.re/, ""))));
}

const main = async () => {
  const { chemins: routeMapChemins, getEquivalentPath } = await lireRouteMap();
  const app = lireApp();
  const pre = lirePrerendu();
  const sitemap = lireSitemap();
  const interdits = lireInterdits();
  const interditAuxRobots = (p) => interdits.some((d) => p === d || p.startsWith(d + "/"));

  const declare = (chemin, ou) =>
    ECARTS_DECLARES.some((e) => e.chemin === chemin && e.absentDe.includes(ou));
  const couvertParUneFamille = (p) =>
    [...app.parametrees].some((q) => {
      const a = q.split("/");
      const b = p.split("/");
      return a.length === b.length && a.every((s, i) => s.startsWith(":") || s === b[i]);
    });

  // Tout ce qui repond autre chose qu'un 404 a un robot ou a une personne.
  const servi = (p) =>
    app.fixes.has(p) || pre.routes.has(p) || pre.redirections.has(p) || couvertParUneFamille(p);

  const bloquants = [];
  const avertissements = [];

  // ── A. Coherence des FONCTIONS, bloquant ──────────────────────────
  // C'est le volet qui compte. Le defaut corrige au lot 3 du sprint 14 n'etait
  // pas un ecart d'appartenance : l'URL fautive ne figurait dans AUCUNE des
  // quatre listes, elle etait CALCULEE par getEquivalentPath, dont la cle
  // generique `insights` masquait les six cles specifiques. Comparer les listes
  // entre elles ne l'aurait jamais vu. On exerce donc la fonction sur tout
  // chemin connu, et on exige que sa sortie soit servie par quelque chose.
  const aExercer = new Set([...routeMapChemins, ...pre.routes, ...app.fixes]);
  for (const p of [...aExercer].sort()) {
    for (const cible of ["fr", "en"]) {
      let r;
      try {
        r = getEquivalentPath(p, cible);
      } catch (err) {
        bloquants.push(`getEquivalentPath("${p}", "${cible}") leve : ${err.message}`);
        continue;
      }
      if (r === null || r === undefined) continue;
      const q = norm(r);
      if (!servi(q)) {
        bloquants.push(`bascule de langue vers le vide : ${p} --${cible}--> ${q}, servi par rien`);
      }
    }
  }

  // ── B. Concordance d'APPARTENANCE, avertissant ────────────────────
  const absences = [
    ["app", "declare dans routeMap, absent des routes d'App.tsx", routeMapChemins, (p) => app.fixes.has(p) || couvertParUneFamille(p)],
    ["app", "prerendu, absent des routes d'App.tsx", pre.routes, (p) => app.fixes.has(p) || couvertParUneFamille(p)],
    ["prerendu", "declare dans routeMap, ni prerendu ni redirige", routeMapChemins, (p) => pre.routes.has(p) || pre.redirections.has(p)],
    ["sitemap", "au sitemap, absent du prerendu", sitemap, (p) => pre.routes.has(p)],
  ];
  for (const [ou, libelle, source, present] of absences) {
    for (const p of [...source].sort()) {
      if (present(p) || declare(p, ou)) continue;
      avertissements.push(`${libelle} : ${p}`);
    }
  }

  // ── C. Redirections clientes invisibles aux robots, avertissant ───
  for (const p of [...app.navigate].sort()) {
    if (pre.routes.has(p) || pre.redirections.has(p) || declare(p, "prerendu")) continue;
    if (interditAuxRobots(p)) continue;
    avertissements.push(`redirection cote client seulement, donc 404 pour un robot : ${p}`);
  }

  console.log(
    `[concordance] routeMap ${routeMapChemins.size} | App ${app.fixes.size} fixes dont ${app.navigate.size} Navigate, ${app.parametrees.size} parametrees | prerendu ${pre.routes.size} + ${pre.redirections.size} redirections | sitemap ${sitemap.size} | ecarts declares ${ECARTS_DECLARES.length} | interdits robots ${interdits.length}`,
  );
  for (const a of avertissements) console.warn(`[concordance] ⚠ ${a}`);
  for (const b of bloquants) console.error(`[concordance] ✗ ${b}`);
  console.log(
    `[concordance] ${bloquants.length} incoherence(s) bloquante(s), ${avertissements.length} absence(s) signalee(s).`,
  );
  if (bloquants.length) {
    console.error("[concordance] BUILD FAILED: un chemin calcule ne mene nulle part.");
    process.exit(1);
  }
};

main().catch((err) => {
  console.error(`[concordance] echec du controle : ${err?.stack || err}`);
  process.exit(1);
});
