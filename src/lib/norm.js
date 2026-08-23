// src/lib/norm.js
//
// MODULE UNIQUE de la normalisation de libelle : minuscules, puis retrait des
// diacritiques. Il etait duplique entre src/lib/taxonomy.ts (client) et
// scripts/publishedRoutes.mjs (scripts de build Node), avec le commentaire
// « duplique de src/lib/taxonomy.ts, a garder synchronise » -- une consigne
// qu'aucun controle ne faisait respecter.
//
// Ecrit en JavaScript, et non en TypeScript, pour une raison unique : les
// scripts de build sont du Node ESM sans etape de compilation, et doivent
// pouvoir l'importer tel quel. Les types sont fournis par norm.d.ts, de sorte
// que le client garde exactement la meme signature qu'avant.
//
// Comportement inchange pour toute chaine : la forme tolerante `String(s ?? "")`
// est celle qui vivait deja cote scripts ; cote client, la signature reste
// `(s: string) => string`, et sur une chaine les deux implementations rendaient
// deja le meme resultat, caractere pour caractere.

/**
 * Minuscules + retrait des diacritiques.
 * @param {string} s
 * @returns {string}
 */
export function norm(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}
