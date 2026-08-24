// src/lib/norm.js
// Corps UNIQUE de norm(). Il vivait en deux exemplaires, src/lib/taxonomy.ts et
// scripts/publishedRoutes.mjs, avec un commentaire de synchronisation qu'aucun
// controle ne faisait respecter.
//
// En JavaScript, et importe avec son extension explicite, parce que les scripts
// de build sont du Node ESM sans etape de compilation et doivent le charger tel
// quel ; src/lib/norm.d.ts en porte le type pour le client.
//
// LE CONTRAT EST STRICT, et il leve sur toute valeur non chaine. Motif : norm()
// decide de l'appariement des libelles de taxonomie, donc de la liste des pages
// problematique et specialite publiees et des fiches praticien prerendues. Une
// valeur absente absorbee en "" ne correspondrait silencieusement a rien, ce qui
// transformerait un echec bruyant en echec muet. Les gardes se posent aux appels,
// jamais dans ce corps.

/**
 * Normalisation utilitaire : minuscules + retrait des diacritiques.
 * Utilisee pour comparer libelles utilisateur et termes de la taxonomie.
 *
 * @param {string} s libelle a normaliser
 * @returns {string} libelle en minuscules, sans diacritiques
 * @throws {TypeError} si s n'est pas une chaine
 */
export function norm(s) {
  if (typeof s !== "string") {
    throw new TypeError(
      `norm() attend une chaine, recu ${s === null ? "null" : typeof s}`,
    );
  }
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
