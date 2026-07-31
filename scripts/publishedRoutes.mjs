#!/usr/bin/env node
/**
 * Shared helpers for build scripts (sitemap + prerender).
 *
 * Reads Supabase via public REST with the anon (publishable) key only.
 * No service_role, no secret in plain text.
 *
 * Node 20, ESM, zero external dependency (uses global fetch).
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// dupliqué de src/lib/taxonomy.ts (contexte Node build), à garder synchronisé
export function norm(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export async function fetchJson(url) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY env var.");
  }
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (!Array.isArray(json)) throw new Error("non-array JSON");
  return json;
}

function base() {
  return SUPABASE_URL.replace(/\/$/, "");
}

/**
 * Published praticiens (RLS: statut_validation='validee' AND actif=true).
 * Returns [{slug, updated_at, problematiques, problematiques_derivees, problematiques_manuelles}].
 */
export async function fetchPraticiensPublies() {
  const url =
    `${base()}/rest/v1/praticiens` +
    `?select=slug,updated_at,profession,specialites,specialites_derivees,problematiques,problematiques_derivees,problematiques_manuelles,cabinet_slug` +
    `&statut_validation=eq.validee&actif=eq.true&order=nom.asc`;
  return fetchJson(url);
}

/**
 * All active problématiques (RLS filters actif=true).
 * Returns [{slug, nom, synonymes, updated_at}].
 */
export async function fetchProblematiques() {
  const url =
    `${base()}/rest/v1/problematiques` +
    `?select=slug,nom,synonymes,updated_at&order=nom.asc`;
  return fetchJson(url);
}

/**
 * All active specialités (RLS filters actif=true).
 * Returns [{slug, nom, synonymes, updated_at}].
 */
export async function fetchSpecialites() {
  const url =
    `${base()}/rest/v1/specialites` +
    `?select=slug,nom,synonymes,updated_at,cabinet_slug&order=nom.asc`;
  return fetchJson(url);
}

/**
 * All published articles (RLS filters statut='publie').
 * Returns [{slug, updated_at}].
 */
export async function fetchArticlesPublies() {
  const url =
    `${base()}/rest/v1/articles` +
    `?select=slug,updated_at&order=published_at.desc`;
  return fetchJson(url);
}

/**
 * Pre-compute per-praticien normalized tag Set.
 *
 * Règle de fusion canonique (dupliqué de src/lib/taxonomy.ts
 * getPraticienProblematiqueTags, à garder synchronisé — contexte Node build) :
 * (problematiques_derivees non vide ? problematiques_derivees : problematiques)
 * UNION problematiques_manuelles, dédoublonné après norm().
 */
export function praticiensNormTagSets(praticiens) {
  return praticiens.map((pr) => {
    const derived = Array.isArray(pr.problematiques_derivees) ? pr.problematiques_derivees : [];
    const raw = Array.isArray(pr.problematiques) ? pr.problematiques : [];
    const manual = Array.isArray(pr.problematiques_manuelles) ? pr.problematiques_manuelles : [];
    const source = derived.length > 0 ? derived : raw;
    const set = new Set();
    for (const tag of [...source, ...manual]) {
      if (!tag) continue;
      set.add(norm(tag));
    }
    return set;
  });
}

/**
 * Subset of `problematiques` for which ≥1 praticien matches
 * (norm() against nom + synonymes).
 */
export function matchProblematiques(problematiques, praticiens) {
  const tagSets = praticiensNormTagSets(praticiens);
  const matched = [];
  for (const pb of problematiques) {
    const slug = (pb && pb.slug ? String(pb.slug) : "").trim();
    if (!slug) continue;
    const targets = [pb.nom, ...(Array.isArray(pb.synonymes) ? pb.synonymes : [])]
      .map(norm)
      .filter(Boolean);
    const hasMatch = tagSets.some((tagSet) => targets.some((t) => tagSet.has(t)));
    if (hasMatch) matched.push(pb);
  }
  return matched;
}

/**
 * Pre-compute per-praticien normalized specialite candidate Set :
 * norm(profession) + norm(specialites_derivees) (fallback specialites).
 * Aligné sur src/lib/taxonomy.ts matchSpecialite().
 */
export function praticiensNormSpecialiteSets(praticiens) {
  return praticiens.map((pr) => {
    const derived = Array.isArray(pr.specialites_derivees) ? pr.specialites_derivees : [];
    const raw = Array.isArray(pr.specialites) ? pr.specialites : [];
    const specSource = derived.length > 0 ? derived : raw;
    const set = new Set();
    if (pr.profession) set.add(norm(pr.profession));
    for (const s of specSource) set.add(norm(s));
    return set;
  });
}

/**
 * Subset of `specialites` for which ≥1 praticien matches
 * (norm(profession) OU specialites_derivees/specialites vs nom + synonymes).
 * Une spécialité avec cabinet_slug non nul ne matche que sur les praticiens
 * du même cabinet_slug (pages quartier).
 */
export function matchSpecialites(specialites, praticiens) {
  const matched = [];
  for (const sp of specialites) {
    const slug = (sp && sp.slug ? String(sp.slug) : "").trim();
    if (!slug) continue;
    const scoped = sp.cabinet_slug
      ? praticiens.filter((pr) => pr.cabinet_slug === sp.cabinet_slug)
      : praticiens;
    const candSets = praticiensNormSpecialiteSets(scoped);
    const targets = [sp.nom, ...(Array.isArray(sp.synonymes) ? sp.synonymes : [])]
      .map(norm)
      .filter(Boolean);
    const hasMatch = candSets.some((set) => targets.some((t) => set.has(t)));
    if (hasMatch) matched.push(sp);
  }
  return matched;
}