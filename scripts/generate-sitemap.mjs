#!/usr/bin/env node
/**
 * Post-build sitemap generator for I-CA.RE.
 *
 * Reads public/sitemap.xml as the static base (never modified) and appends
 * <url> entries for every published praticien fetched from the Supabase
 * public REST API (RLS-filtered: statut_validation='validee' AND actif=true).
 *
 * Writes the result to dist/sitemap.xml, overwriting the copy made by Vite.
 *
 * Failure mode:
 *   - Default: exit 1 on network / HTTP / JSON error (CI fails hard).
 *   - PRERENDER_OPTIONAL=true: warning + exit 0, dist/sitemap.xml untouched.
 *
 * No external dependencies (Node 20 native fetch only). No service_role.
 */

import { readFile, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import {
  fetchPraticiensPublies,
  fetchProblematiques,
  matchProblematiques,
  fetchSpecialites,
  matchSpecialites,
} from "./publishedRoutes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const STATIC_SITEMAP = join(ROOT, "public", "sitemap.xml");
const DIST_SITEMAP = join(ROOT, "dist", "sitemap.xml");
const OPTIONAL = process.env.PRERENDER_OPTIONAL === "true";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function fail(message) {
  if (OPTIONAL) {
    console.warn(`[generate-sitemap] ⚠ ${message} — PRERENDER_OPTIONAL=true, skipping.`);
    process.exit(0);
  }
  console.error(`[generate-sitemap] ✗ ${message}`);
  process.exit(1);
}

function xmlEscape(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toIsoDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const d = new Date(value);
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return fail("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY env var.");
  }

  if (!existsSync(STATIC_SITEMAP)) {
    return fail(`Static sitemap not found at ${STATIC_SITEMAP}`);
  }

  const baseXml = await readFile(STATIC_SITEMAP, "utf8");

  // Fetch published praticiens (RLS enforces validee + actif).
  let rows;
  try {
    rows = await fetchPraticiensPublies();
  } catch (e) {
    return fail(`Supabase REST call error: ${e?.message || e}`);
  }

  if (rows.length === 0) {
    console.warn("[generate-sitemap] ⚠ 0 published praticiens returned (no error).");
  }

  // Fetch problématiques (RLS filtre actif=true).
  let problematiques;
  try {
    problematiques = await fetchProblematiques();
  } catch (e) {
    return fail(`Supabase REST call error (problematiques): ${e?.message || e}`);
  }

  // Ordre d'origine : matchProblematiques garde l'ordre reçu (nom.asc).
  const matchedProblematiques = matchProblematiques(problematiques, rows);
  const matchedSet = new Set(matchedProblematiques.map((p) => p.slug));

  // Fetch spécialités (RLS filtre actif=true).
  let specialites;
  try {
    specialites = await fetchSpecialites();
  } catch (e) {
    return fail(`Supabase REST call error (specialites): ${e?.message || e}`);
  }
  const matchedSpecialites = matchSpecialites(specialites, rows);
  const matchedSpecialiteSet = new Set(matchedSpecialites.map((s) => s.slug));

  // Existing <loc> values in the static base (for dedup on the entire file).
  const existingLocs = new Set(
    Array.from(baseXml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim()),
  );

  const seenSlugs = new Set();
  const blocks = [];
  for (const row of rows) {
    const slug = (row && row.slug ? String(row.slug) : "").trim();
    if (!slug) continue;
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const loc = `https://i-ca.re/praticien/${slug}`;
    if (existingLocs.has(loc)) continue;

    const lastmod = toIsoDate(row.updated_at);
    blocks.push(
      `  <url>\n` +
      `    <loc>${xmlEscape(loc)}</loc>\n` +
      `    <lastmod>${xmlEscape(lastmod)}</lastmod>\n` +
      `    <changefreq>monthly</changefreq>\n` +
      `    <priority>0.6</priority>\n` +
      `  </url>`,
    );
    existingLocs.add(loc);
  }

  // Bloc problématiques : index (toujours) + détails matchés (≥1 praticien).
  const problematiquesBlocks = [];
  const indexLoc = "https://i-ca.re/patients/problematiques";
  if (!existingLocs.has(indexLoc)) {
    problematiquesBlocks.push(
      `  <url>\n` +
      `    <loc>${xmlEscape(indexLoc)}</loc>\n` +
      `    <changefreq>weekly</changefreq>\n` +
      `    <priority>0.6</priority>\n` +
      `  </url>`,
    );
    existingLocs.add(indexLoc);
  }

  let matchedCount = 0;
  for (const pb of problematiques) {
    const slug = (pb && pb.slug ? String(pb.slug) : "").trim();
    if (!slug) continue;
    if (!matchedSet.has(slug)) continue;

    const loc = `https://i-ca.re/patients/problematiques/${slug}`;
    if (existingLocs.has(loc)) continue;

    const lastmod = toIsoDate(pb.updated_at);
    problematiquesBlocks.push(
      `  <url>\n` +
      `    <loc>${xmlEscape(loc)}</loc>\n` +
      `    <lastmod>${xmlEscape(lastmod)}</lastmod>\n` +
      `    <changefreq>monthly</changefreq>\n` +
      `    <priority>0.5</priority>\n` +
      `  </url>`,
    );
    existingLocs.add(loc);
    matchedCount++;
  }

  // Bloc spécialités : uniquement détails matchés (≥1 praticien). Pas d'index.
  const specialitesBlocks = [];
  for (const sp of specialites) {
    const slug = (sp && sp.slug ? String(sp.slug) : "").trim();
    if (!slug) continue;
    if (!matchedSpecialiteSet.has(slug)) continue;

    const loc = `https://i-ca.re/patients/specialite/${slug}`;
    if (existingLocs.has(loc)) continue;

    const lastmod = toIsoDate(sp.updated_at);
    specialitesBlocks.push(
      `  <url>\n` +
      `    <loc>${xmlEscape(loc)}</loc>\n` +
      `    <lastmod>${xmlEscape(lastmod)}</lastmod>\n` +
      `    <changefreq>monthly</changefreq>\n` +
      `    <priority>0.5</priority>\n` +
      `  </url>`,
    );
    existingLocs.add(loc);
  }

  const closing = "</urlset>";
  if (!baseXml.includes(closing)) {
    return fail("Static sitemap has no </urlset> closing tag.");
  }

  const allBlocks = [...blocks, ...problematiquesBlocks, ...specialitesBlocks];
  const injection = allBlocks.length > 0 ? allBlocks.join("\n") + "\n" : "";
  const finalXml = baseXml.replace(
    closing,
    (allBlocks.length > 0 ? `\n${injection}` : "") + closing,
  );

  // Sanity: balanced <url> tags and no duplicate <loc>.
  const openCount = (finalXml.match(/<url>/g) || []).length;
  const closeCount = (finalXml.match(/<\/url>/g) || []).length;
  if (openCount !== closeCount) {
    return fail(`Malformed XML: ${openCount} <url> vs ${closeCount} </url>.`);
  }
  const allLocs = Array.from(finalXml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());
  const dupSet = new Set();
  for (const l of allLocs) {
    if (dupSet.has(l)) {
      return fail(`Duplicate <loc> in final sitemap: ${l}`);
    }
    dupSet.add(l);
  }

  if (!existsSync(join(ROOT, "dist"))) {
    return fail("dist/ directory not found — run vite build first.");
  }

  await writeFile(DIST_SITEMAP, finalXml, "utf8");

  const staticCount = (baseXml.match(/<url>/g) || []).length;
  const problematiquesTotal = problematiquesBlocks.length;
  const specialitesTotal = specialitesBlocks.length;
  console.log(
    `[generate-sitemap] ✓ ${staticCount} static + ${blocks.length} praticiens + ${problematiquesTotal} problematiques + ${specialitesTotal} specialites = ${openCount} total → dist/sitemap.xml`,
  );
}

main().catch((e) => fail(`Unexpected error: ${e?.stack || e?.message || e}`));