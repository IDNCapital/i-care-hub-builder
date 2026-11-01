/**
 * Adresse de Toulouse Capitole, decidee par Nicolas le 31/10/2026 (lot
 * SITE-CAPITOLE-VISUELS-1). Module volontairement sans dependance pour pouvoir
 * etre importe par la carte et les hooks d'installation sans tirer les images.
 *
 * La ligne inseree en base le 21/04/2026 portait le numero 5 sans « ter » ; tant
 * que la base n'est pas corrigee, chaque lecture de l'adresse de ce slug passe
 * par avecAdresseCapitole().
 */

export const CAPITOLE_SLUG = "i-ca-re-toulouse-capitole";

export const CAPITOLE_ADRESSE = "5 ter rue de Mirepoix, 31000 Toulouse";

/** Remplace l'adresse lue en base pour Toulouse Capitole ; renvoie l'objet tel quel pour les autres slugs. */
export function avecAdresseCapitole<T extends { slug: string; address?: string | null }>(ligne: T): T {
  if (ligne.slug !== CAPITOLE_SLUG) return ligne;
  return { ...ligne, address: CAPITOLE_ADRESSE };
}
