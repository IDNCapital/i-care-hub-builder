/**
 * Helpers centralisés pour la matrice d'installation praticien × ville.
 * Doctrine §4.2 pattern A : tout format apparaissant 2+ fois → helper.
 */

export function installationUrl(professionSlug: string, villeSlug: string): string {
  return `/sinstaller/${professionSlug}/${villeSlug}`;
}

export function isPipelineCabinet(projectStatus: string): boolean {
  return projectStatus === "en_travaux" || projectStatus === "a_venir";
}

/**
 * Cabinet qui dispose de pages /sinstaller : en travaux, à venir, ou ouvert
 * (décision du 15/10/2026 : un cabinet ouvert garde ses pages d'installation).
 */
export function hasInstallationPages(projectStatus: string | null | undefined): boolean {
  return projectStatus === "en_travaux" || projectStatus === "a_venir" || projectStatus === "en_exploitation";
}

/** Libellé d'ouverture d'un cabinet selon son statut. */
export function libelleOuverture(projectStatus: string | null | undefined, dateString: string | null): string {
  if (projectStatus === "en_exploitation") return "Cabinet ouvert";
  return formatDateOuverture(dateString);
}

export function formatDateOuverture(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const trimester = Math.ceil(month / 3);
  return `Ouverture prévue T${trimester} ${date.getFullYear()}`;
}

/**
 * Strip du préfixe "I-CA.RE " du nom complet pour obtenir le nom court.
 * Permettra une migration douce si on ajoute une vraie colonne nom_court.
 */
export function cabinetNomCourt(name: string): string {
  return name.replace(/^I[-‑]CA\.RE\s+/i, "").trim();
}

/**
 * Contraction de la préposition « à » devant un nom de ville avec article.
 * "Le Bouscat" → "au Bouscat", "Les Angles" → "aux Angles", sinon "à {ville}".
 */
export function aVille(city: string): string {
  if (/^Le\s/i.test(city)) return "au " + city.replace(/^Le\s/i, "");
  if (/^Les\s/i.test(city)) return "aux " + city.replace(/^Les\s/i, "");
  return "à " + city;
}