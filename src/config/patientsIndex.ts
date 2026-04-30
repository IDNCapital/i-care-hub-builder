/**
 * Configuration de la bascule de l'index public /patients.
 *
 * MODE AMORÇAGE  : nb de praticiens validés < SEUIL → page noindex,nofollow
 * MODE OUVERT    : nb de praticiens validés ≥ SEUIL → page index,follow
 *
 * Le mode est résolu côté client/SSG à partir des données live Supabase.
 * Override possible via la variable d'env `VITE_FORCE_PATIENTS_INDEX_OPEN=true`
 * (pratique pour QA le rendu cible avant le go publique).
 */
export const SEUIL_OUVERTURE_INDEX_PATIENTS = 8;

export const FORCE_PATIENTS_INDEX_OPEN: boolean =
  String(import.meta.env.VITE_FORCE_PATIENTS_INDEX_OPEN ?? "").toLowerCase() ===
  "true";

export type PatientsIndexMode = "amorcage" | "ouvert";

export function resolvePatientsIndexMode(nbValidees: number): PatientsIndexMode {
  if (FORCE_PATIENTS_INDEX_OPEN) return "ouvert";
  return nbValidees >= SEUIL_OUVERTURE_INDEX_PATIENTS ? "ouvert" : "amorcage";
}