// src/lib/norm.d.ts
// Type du module unique src/lib/norm.js.
//
// tsconfig.app.json ne pose pas allowJs et resout en mode "bundler" : un import
// de "./norm.js" y est resolu vers ce fichier de declaration, tandis que Node et
// Vite chargent bien le .js. C'est ce qui permet au meme module de servir le
// client et les scripts de build sans etape de compilation.

/**
 * Normalisation utilitaire : minuscules + retrait des diacritiques.
 * Contrat strict : leve un TypeError sur toute valeur non chaine.
 */
export declare function norm(s: string): string;
