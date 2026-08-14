#!/usr/bin/env node
/**
 * Post-build prerender script for I-CA.RE.
 * Generates static HTML for strategic routes so crawlers (including AI bots)
 * can read SEO tags, H1, content, and JSON-LD without executing JavaScript.
 *
 * Chromium resolution order:
 *   1. PUPPETEER_EXECUTABLE_PATH env var
 *   2. Puppeteer's bundled browser
 *   3. Common system paths
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
import { existsSync } from "fs";
import { execSync } from "child_process";
import { JSDOM } from "jsdom";
import { pagePath, pageUrl } from "./siteUrl.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const PORT = 45678;
const OPTIONAL = process.env.PRERENDER_OPTIONAL === "true";

// ── JSON-LD expectations per URL family ─────────────────────────────
// Cette table s'etend a chaque nouvelle famille d'URL, au meme titre que la
// passe ROUTES. Une route qui ne correspond a aucune entree n'est pas
// controlee (son rapport vaut "n/a").
// Statut sprint 9 : controle bloquant. Une route controlee non conforme, ou un
// bloc JSON-LD illisible quel que soit le type de route, fait echouer le build.
const JSONLD_EXPECTATIONS = [
  { match: (p) => p === "/" || p === "/en", label: "accueil", expect: ["Organization", "ProfessionalService"] },
  { match: (p) => /^(\/en)?\/(projets|projects)\/./.test(p), label: "cabinet", expect: ["MedicalBusiness", "Organization"] },
  { match: (p) => /^\/praticien\/./.test(p), label: "praticien", expect: ["Person", "Organization"] },
  // FAQPage retire au lot 1-ter du sprint 12 : le balisage etait faux, les
  // reponses ne figurant pas dans le HTML servi, et sans effet depuis le retrait
  // des resultats enrichis FAQ par Google. Attente relevee sur le HTML servi.
  { match: (p) => /^(\/en)?\/insights\/./.test(p), label: "insight", expect: ["Article", "BreadcrumbList"] },
  { match: (p) => /^\/patients\/problematiques\/./.test(p), label: "problematique", expect: ["MedicalCondition", "ItemList", "BreadcrumbList"] },
  { match: (p) => /^\/patients\/specialite\/./.test(p), label: "specialite", expect: ["CollectionPage", "ItemList", "BreadcrumbList"] },
  { match: (p) => /^\/patients\/articles\/./.test(p), label: "article patients", expect: ["Article", "BreadcrumbList"] },
  { match: (p) => /^\/sinstaller\/[^/]+\/./.test(p), label: "matrice installation", expect: ["MedicalBusiness", "Service", "BreadcrumbList"] },
];

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
  // FR installation matrix : index seul ; les combinaisons profession × ville
  // sont ajoutées dynamiquement depuis la base (voir fetchInstallationMatrix).
  { path: "/sinstaller", type: "strategic" },
  // Page ressources volontairement desindexee et hors sitemap au lot 1 du sprint 12 :
  // liens entrants, JSON-LD et indexation viennent au lot 3.
  { path: "/ressources/exercer-en-lieu-pluridisciplinaire", type: "dormant" },
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
];

// ── Chromium resolution ─────────────────────────────────────────────
function findChromium() {
  // 1. Explicit env var
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    const p = process.env.PUPPETEER_EXECUTABLE_PATH;
    if (existsSync(p)) return p;
    console.warn(`[prerender] PUPPETEER_EXECUTABLE_PATH=${p} not found, trying alternatives…`);
  }

  // 2. Puppeteer bundled browser
  try {
    const result = execSync("npx puppeteer browsers installed", {
      encoding: "utf-8",
      timeout: 10000,
    }).trim();
    const match = result.match(/chrome@[^\s]+\s+(.+)/);
    if (match && existsSync(match[1])) return match[1];
  } catch { /* ignore */ }

  // 3. Common system paths
  const candidates = [
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }

  return null;
}

// ── Dedup SEO tags in final HTML ────────────────────────────────────
function deduplicateHtml(html) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const head = doc.head;

  // Keep only the LAST of each: title, meta[name=description], link[rel=canonical]
  deduplicateTag(head, "title");
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

function deduplicateTag(head, tagName) {
  const els = head.querySelectorAll(tagName);
  if (els.length > 1) {
    for (let i = 0; i < els.length - 1; i++) els[i].remove();
  }
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
      } = await import("./publishedRoutes.mjs");
      const praticiens = await fetchPraticiensPublies();
      const problematiques = await fetchProblematiques();
      const matched = matchProblematiques(problematiques, praticiens);
      const specialites = await fetchSpecialites();
      const matchedSp = matchSpecialites(specialites, praticiens);
      const articles = await fetchArticlesPublies();
      const installation = await fetchInstallationMatrix();

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
  const allRoutes = [...ROUTES, ...dynamicRoutes];

  // 1. Serve dist/ locally
  const server = createServer((req, res) =>
    handler(req, res, {
      public: DIST,
      rewrites: [{ source: "**", destination: "/index.html" }],
    })
  );
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
  const report = [];

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
      const page = await browser.newPage();
      await page.goto(`http://localhost:${PORT}${route.path}`, {
        waitUntil: "networkidle0",
        timeout: 20000,
      });
      await page.waitForSelector("title", { timeout: 5000 });

      let html = await page.content();
      await page.close();

      // Deduplicate SEO tags
      html = deduplicateHtml(html);

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

      // Validate
      const baseErrors = validateHtml(html, route);
      const typeErrors = validateRouteType(html, route);
      entry.errors = [...baseErrors, ...typeErrors];

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
