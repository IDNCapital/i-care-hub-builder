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
import ts from "typescript";

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
  { chemin: "/admin", absentDe: ["prerendu"], motif: "route Navigate sans page, reorientee cote client vers /admin/praticiens, hors prerendu par construction ; nuance du 26/08 : au sens strict de robots.txt, Disallow: /admin/ ne couvre pas /admin sans barre oblique, mais lireInterdits normalise les directives et le controle tient donc /admin pour interdit par egalite stricte" },
  { chemin: "/admin/login", absentDe: ["prerendu"], motif: "page d'administration, hors prerendu par construction, couverte par Disallow: /admin/" },
  { chemin: "/admin/praticiens", absentDe: ["prerendu"], motif: "page d'administration, hors prerendu par construction, couverte par Disallow: /admin/" },
  { chemin: "/admin/demandes", absentDe: ["prerendu"], motif: "page d'administration, hors prerendu par construction, couverte par Disallow: /admin/" },
  { chemin: "/admin/demandes-installation", absentDe: ["prerendu"], motif: "page d'administration, hors prerendu par construction, couverte par Disallow: /admin/" },
  { chemin: "/admin/idn-os-webhooks", absentDe: ["prerendu"], motif: "page d'administration, hors prerendu par construction, couverte par Disallow: /admin/" },
  { chemin: "/admin/extractions", absentDe: ["prerendu"], motif: "page d'administration, hors prerendu par construction, couverte par Disallow: /admin/" },
  { chemin: "/preview-carte-cabinets", absentDe: ["prerendu"], motif: "page de mise au point, hors prerendu, couverte par sa propre directive Disallow" },
  { chemin: "/preview-footer-idn", absentDe: ["prerendu"], motif: "page de mise au point, hors prerendu, couverte par sa propre directive Disallow" },
  { chemin: "/preview-footer-idn-v3", absentDe: ["prerendu"], motif: "page de mise au point, hors prerendu, couverte par sa propre directive Disallow" },
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
function sourceStructuree(chemin, nom, genre) {
  const source = ts.createSourceFile(nom, readFileSync(join(ROOT, chemin), "utf8"), ts.ScriptTarget.Latest, true, genre);
  if (source.parseDiagnostics.length) throw new Error(`Lecture de ${nom} non confirmee : syntaxe illisible.`);
  return source;
}

function sansParentheses(expression) {
  while (expression && ts.isParenthesizedExpression(expression)) expression = expression.expression;
  return expression;
}

function chaineLitterale(expression) {
  const value = sansParentheses(expression);
  return value && (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) ? value.text : null;
}

function lireApp() {
  const source = sourceStructuree("src/App.tsx", "App.tsx", ts.ScriptKind.TSX);
  const fixes = new Set();
  const parametrees = new Set();
  const navigate = new Set();
  let routeurTrouve = false;
  const parcourir = (node, prefixe = "") => {
    const ouverture = ts.isJsxElement(node) ? node.openingElement : ts.isJsxSelfClosingElement(node) ? node : null;
    if (ouverture?.tagName.getText(source) === "Routes") {
      routeurTrouve = true;
      const enfantsLitteraux = enfants => {
        for (const enfant of enfants) {
          if (ts.isJsxText(enfant) && !enfant.text.trim()) continue;
          if (ts.isJsxExpression(enfant) && !enfant.expression) continue;
          if (ts.isJsxFragment(enfant)) { enfantsLitteraux(enfant.children); continue; }
          const tag = ts.isJsxElement(enfant) ? enfant.openingElement.tagName.getText(source) : ts.isJsxSelfClosingElement(enfant) ? enfant.tagName.getText(source) : null;
          if (tag === "Route") continue;
          if (tag === "React.Fragment" && ts.isJsxElement(enfant)) { enfantsLitteraux(enfant.children); continue; }
          throw new Error("Lecture de App.tsx non confirmee : enfants de Routes non litteraux.");
        }
      };
      if (ts.isJsxElement(node)) enfantsLitteraux(node.children);
    }
    if (ouverture?.tagName.getText(source) === "Route") {
      const attributs = ouverture.attributes.properties;
      if (attributs.some(ts.isJsxSpreadAttribute)) throw new Error("Lecture de App.tsx non confirmee : attributs de Route calcules.");
      const chemins = attributs.filter(a => ts.isJsxAttribute(a) && a.name.getText(source) === "path");
      if (chemins.length > 1) throw new Error("Lecture de App.tsx non confirmee : chemin de Route ambigu.");
      if (chemins.length === 1) {
        const init = chemins[0].initializer;
        const p = chaineLitterale(init && ts.isJsxExpression(init) ? init.expression : init);
        if (p === null) throw new Error("Lecture de App.tsx non confirmee : chemin de Route non litteral.");
        if (p === "/en/*") prefixe = "/en";
        else if (!["/*", "/fr/*", "*"].includes(p)) {
          const q = norm(prefixe ? prefixe + (p === "/" ? "" : p.startsWith("/") ? p : "/" + p) : p);
          const elements = attributs.filter(a => ts.isJsxAttribute(a) && a.name.getText(source) === "element");
          if (elements.length > 1) throw new Error("Lecture de App.tsx non confirmee : element de Route ambigu.");
          const element = elements[0]?.initializer;
          const rendu = element && ts.isJsxExpression(element) ? sansParentheses(element.expression) : null;
          const tag = rendu && ts.isJsxElement(rendu) ? rendu.openingElement.tagName : rendu && ts.isJsxSelfClosingElement(rendu) ? rendu.tagName : null;
          if (tag?.getText(source) === "Navigate") navigate.add(q);
          (q.includes(":") ? parametrees : fixes).add(q);
        }
      }
    }
    ts.forEachChild(node, child => parcourir(child, prefixe));
  };
  parcourir(source);
  if (!routeurTrouve) throw new Error("Lecture de App.tsx non confirmee : aucun routeur Routes reconnu.");
  return { fixes, parametrees, navigate };
}

// ── 3. prerender.mjs : ce qui est servi en HTML statique ────────────
function lirePrerendu() {
  const source = sourceStructuree("scripts/prerender.mjs", "prerender.mjs", ts.ScriptKind.JS);
  const bloc = (nom, cle) => {
    const declarations = source.statements.filter(ts.isVariableStatement).flatMap(s => [...s.declarationList.declarations])
      .filter(d => ts.isIdentifier(d.name) && d.name.text === nom);
    const tableau = declarations.length === 1 ? sansParentheses(declarations[0].initializer) : null;
    if (!tableau || !ts.isArrayLiteralExpression(tableau)) throw new Error(`Lecture de prerender.mjs non confirmee : ${nom} absent, ambigu ou non litteral.`);
    // Consommateurs presents : copie par spread et iteration for-of.
    // Tout autre acces au tableau exige une qualification du lecteur, sans
    // executer ce fichier ni supposer qu'un alias ne le modifie pas.
    const verifierUsages = node => {
      if (ts.isIdentifier(node) && node.text === nom && node !== declarations[0].name) {
        const parent = node.parent;
        const copie = ts.isSpreadElement(parent) && parent.expression === node && ts.isArrayLiteralExpression(parent.parent);
        const iteration = ts.isForOfStatement(parent) && parent.expression === node;
        const cle = (ts.isPropertyAssignment(parent) || ts.isPropertyAccessExpression(parent)) && parent.name === node;
        if (!copie && !iteration && !cle) throw new Error(`Lecture de prerender.mjs non confirmee : usage de ${nom} non qualifie.`);
      }
      ts.forEachChild(node, verifierUsages);
    };
    verifierUsages(source);
    const chemins = new Set();
    for (const ligne of tableau.elements) {
      if (!ts.isObjectLiteralExpression(ligne) || ligne.properties.some(p => ts.isSpreadAssignment(p) || (p.name && ts.isComputedPropertyName(p.name)))) throw new Error(`Lecture de prerender.mjs non confirmee : ligne de ${nom} non litterale.`);
      const proprietes = ligne.properties.filter(p => p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) && p.name.text === cle);
      const valeur = proprietes.length === 1 && ts.isPropertyAssignment(proprietes[0]) ? chaineLitterale(proprietes[0].initializer) : null;
      if (valeur === null || !valeur.trim()) throw new Error(`Lecture de prerender.mjs non confirmee : chemin de ${nom} inconnu.`);
      chemins.add(norm(valeur));
    }
    return chemins;
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
  const xml = txt.replace(/^\uFEFF/, "").replace(/<!--[^]*?-->/g, "").replace(/^\s*<\?xml[^]*?\?>/, "").trim();
  const root = /^<urlset\b[^>]*>([^]*)<\/urlset>$/.exec(xml);
  const vide = /^<urlset\b[^>]*\/\s*>$/.test(xml);
  if (!root && !vide) throw new Error("Lecture de sitemap.xml non confirmee : racine non reconnue.");
  const corps = root?.[1] ?? "";
  const locs = [...corps.matchAll(/<loc>([^<]+)<\/loc>/g)];
  const nombre = expression => [...corps.matchAll(expression)].length;
  if (locs.length !== nombre(/<loc\b[^>]*>/g) || locs.length !== nombre(/<\/loc\s*>/g) || locs.length !== nombre(/<url(?:\s[^>]*)?>/g) || locs.length !== nombre(/<\/url\s*>/g)) throw new Error("Lecture de sitemap.xml non confirmee : inventaire loc incomplet.");
  return new Set(locs.map((x) => norm(x[1].replace(/^https?:\/\/i-ca\.re/, ""))));
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
    // Ajoutee le 30/08. Le sens inverse de la troisieme entree : une route que le
    // routeur declare mais que rien ne sert en statique. Meme severite que les
    // autres, un avertissement, jamais un bloquant. La source est `app.fixes`,
    // deja lue par lireApp : aucun second lecteur de routes n'est introduit.
    ["prerendu", "declare dans App.tsx, ni prerendu ni redirige", app.fixes, (p) => pre.routes.has(p) || pre.redirections.has(p)],
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
