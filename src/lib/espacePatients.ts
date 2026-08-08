/**
 * Selecteur de langue masque sur l'Espace Patients tant que la couverture
 * anglaise des fiches praticien est incomplete (1 fiche sur 9 au 8 aout 2026).
 * Repasser a false quand les biographies anglaises seront ecrites : c'est le
 * seul point a modifier, le reste du site n'est pas concerne.
 */
export const MASQUER_SELECTEUR_LANGUE_ESPACE_PATIENTS = true;

/**
 * Test d'appartenance unique aux routes de l'Espace Patients (FR et EN).
 * Calcule a partir du seul pathname, connu du routeur cote serveur comme
 * cote client : aucun acces a window, navigator ou localStorage.
 */
export function estRouteEspacePatients(pathname: string): boolean {
  const p = pathname.replace(/^\/en(?=\/|$)/, "").replace(/\/+$/, "") || "/";
  return p === "/patients" || p.startsWith("/patients/");
}

/** Vrai quand le selecteur de langue doit etre masque sur cette route. */
export function masquerSelecteurLangue(pathname: string): boolean {
  return MASQUER_SELECTEUR_LANGUE_ESPACE_PATIENTS && estRouteEspacePatients(pathname);
}
