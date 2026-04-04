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

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const PORT = 45678;
const OPTIONAL = process.env.PRERENDER_OPTIONAL === "true";

// ── Route definitions ───────────────────────────────────────────────
// type: "strategic" = must be indexed, "legal" = must have noindex
const ROUTES = [
  // FR strategic
  { path: "/", type: "strategic" },
  { path: "/projets", type: "strategic" },
  { path: "/projets/i-ca-re-chartrons", type: "strategic" },
  { path: "/projets/i-ca-re-nansouty", type: "strategic" },
  { path: "/projets/i-ca-re-jardin-public", type: "strategic" },
  { path: "/projets/i-ca-re-pey-berland", type: "strategic" },
  { path: "/professionnels", type: "strategic" },
  { path: "/location-cabinet-bordeaux", type: "strategic" },
  { path: "/trouver-cabinet-medical-bordeaux", type: "strategic" },
  { path: "/installer-cabinet-praticien", type: "strategic" },
  { path: "/insights", type: "strategic" },
  { path: "/insights/cabinet-medical-bordeaux", type: "strategic" },
  { path: "/insights/budget-cabinet-bordeaux", type: "strategic" },
  { path: "/insights/surface-cabinet-medical", type: "strategic" },
  { path: "/insights/transformer-local-en-cabinet", type: "strategic" },
  { path: "/insights/professions-partage-cabinet", type: "strategic" },
  { path: "/insights/louer-ou-acheter-cabinet", type: "strategic" },
  { path: "/investissement", type: "strategic" },
  { path: "/notre-approche", type: "strategic" },
  { path: "/contact", type: "strategic" },
  { path: "/questions-frequentes", type: "strategic" },
  // FR legal
  { path: "/mentions-legales", type: "legal" },
  { path: "/confidentialite", type: "legal" },
  { path: "/cookies", type: "legal" },
  // EN strategic
  { path: "/en/", type: "strategic" },
  { path: "/en/projects", type: "strategic" },
  { path: "/en/health-professionals", type: "strategic" },
  { path: "/en/office-rental-bordeaux", type: "strategic" },
  { path: "/en/finding-medical-office-bordeaux", type: "strategic" },
  { path: "/en/setting-up-practice", type: "strategic" },
  { path: "/en/insights", type: "strategic" },
  { path: "/en/insights/medical-office-bordeaux", type: "strategic" },
  { path: "/en/insights/office-budget-bordeaux", type: "strategic" },
  { path: "/en/insights/medical-office-size", type: "strategic" },
  { path: "/en/insights/converting-commercial-space", type: "strategic" },
  { path: "/en/insights/professions-sharing-office", type: "strategic" },
  { path: "/en/insights/rent-or-buy-office", type: "strategic" },
  { path: "/en/investment", type: "strategic" },
  { path: "/en/our-approach", type: "strategic" },
  { path: "/en/contact", type: "strategic" },
  { path: "/en/faq", type: "strategic" },
  // EN legal
  { path: "/en/legal", type: "legal" },
  { path: "/en/privacy", type: "legal" },
  { path: "/en/cookies", type: "legal" },
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

  if (route.type === "legal") {
    if (!noindex) errors.push("Legal page missing noindex");
  } else {
    if (noindex) errors.push("Strategic page has noindex — should NOT");
  }

  // JSON-LD check for insight articles
  if (route.path.includes("/insights/")) {
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
    let hasArticle = false;
    let hasBreadcrumb = false;
    for (const s of scripts) {
      try {
        const data = JSON.parse(s.textContent);
        if (data["@type"] === "Article") hasArticle = true;
        if (data["@type"] === "BreadcrumbList") hasBreadcrumb = true;
      } catch { /* ignore */ }
    }
    if (!hasArticle) errors.push("Missing Article JSON-LD");
    if (!hasBreadcrumb) errors.push("Missing BreadcrumbList JSON-LD");
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

  for (const route of ROUTES) {
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
      entry.noindex = route.type === "legal"
        ? (noindex ? "✓ present" : "✗ MISSING")
        : (noindex ? "✗ UNEXPECTED" : "✓ absent");

      if (route.path.includes("/insights/")) {
        const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
        let hasArticle = false, hasBreadcrumb = false;
        for (const s of scripts) {
          try {
            const d = JSON.parse(s.textContent);
            if (d["@type"] === "Article") hasArticle = true;
            if (d["@type"] === "BreadcrumbList") hasBreadcrumb = true;
          } catch {}
        }
        entry.jsonLd = hasArticle && hasBreadcrumb ? "✓ Article+Breadcrumb" : `✗ Article:${hasArticle} Breadcrumb:${hasBreadcrumb}`;
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
    `\n[prerender] Done: ${total} prerendered, ${fail} failed out of ${ROUTES.length} routes.`
  );

  // Fail on critical SEO issues on strategic pages (even if prerender succeeded)
  if (criticalFails.length > 0 && !OPTIONAL) {
    console.error(`\n[prerender] BUILD FAILED: ${criticalFails.length} strategic page(s) missing critical SEO elements.`);
    process.exit(1);
  }

  if (fail > 0 && !OPTIONAL) {
    console.error(`\n[prerender] BUILD FAILED: ${fail} route(s) failed to prerender.`);
    process.exit(1);
  }

  if (fail > 0 || criticalFails.length > 0) {
    console.warn(`\n[prerender] PRERENDER_OPTIONAL=true → continuing despite ${fail} failures and ${criticalFails.length} critical issues.`);
  }

  process.exit(0);
}

main();
