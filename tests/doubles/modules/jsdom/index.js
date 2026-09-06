// DOUBLE DE FRONTIERE DOM, explicitement qualifie : satisfait l'import statique
// de scripts/prerender.mjs. Les tests s'arretent avant toute capture, donc
// avant toute construction de JSDOM ; construire ce double est une erreur.
export class JSDOM {
  constructor() {
    throw new Error("double de frontiere jsdom : ne doit pas etre construit dans ces tests");
  }
}
