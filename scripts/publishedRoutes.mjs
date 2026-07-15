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
 * Returns [{slug, updated_at, problematiques, problematiques_derivees}].
 */
export async function fetchPraticiensPublies() {
  const url =
    `${base()}/rest/v1/praticiens` +
    `?select=slug,updated_at,profession,specialites,specialites_derivees,problematiques,problematiques_derivees` +
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
    `?select=slug,nom,synonymes,updated_at&order=nom.asc`;
  return fetchJson(url);
}

/**
 * Pre-compute per-praticien normalized tag Set
 * (problematiques_derivees, fallback problematiques if empty).
 */
export function praticiensNormTagSets(praticiens) {
  return praticiens.map((pr) => {
    const source =
      (Array.isArray(pr.problematiques_derivees) && pr.problematiques_derivees.length > 0
        ? pr.problematiques_derivees
        : pr.problematiques) ?? [];
    return new Set(source.map(norm));
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
 */
export function matchSpecialites(specialites, praticiens) {
  const candSets = praticiensNormSpecialiteSets(praticiens);
  const matched = [];
  for (const sp of specialites) {
    const slug = (sp && sp.slug ? String(sp.slug) : "").trim();
    if (!slug) continue;
    const targets = [sp.nom, ...(Array.isArray(sp.synonymes) ? sp.synonymes : [])]
      .map(norm)
      .filter(Boolean);
    const hasMatch = candSets.some((set) => targets.some((t) => set.has(t)));
    if (hasMatch) matched.push(sp);
  }
  return matched;
}