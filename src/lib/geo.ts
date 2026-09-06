/**
 * Validation de coordonnées géographiques issues d'une source publique
 * (Supabase). `Number(valeur)` seul ne suffit pas : `Number("")` vaut 0,
 * `Number(undefined)` vaut NaN, `Number([1])` vaut 1, `Number(true)` vaut 1,
 * et rien ne borne l'intervalle valide. On n'accepte donc que les valeurs
 * déjà de type `number` ou `string` ; tout autre type (booléen, tableau,
 * objet, bigint, symbol...) est rejeté avant toute tentative de conversion,
 * pour ne jamais laisser passer une valeur "convertible par accident" ni
 * risquer une exception (ex. `Number(Symbol())`).
 * `parseLat`/`parseLng` retournent `null` pour toute valeur vide, non
 * numérique, infinie ou hors bornes, plutôt qu'un nombre invalide propagé
 * jusqu'à Leaflet.
 */

function parseCoordinate(value: unknown, min: number, max: number): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null;
  const raw = typeof value === "string" ? value.trim() : value;
  if (raw === "") return null;
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n)) return null;
  if (n < min || n > max) return null;
  return n;
}

export function parseLat(value: unknown): number | null {
  return parseCoordinate(value, -90, 90);
}

export function parseLng(value: unknown): number | null {
  return parseCoordinate(value, -180, 180);
}
