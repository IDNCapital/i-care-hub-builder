/**
 * Helper unique de construction des URLs absolues du site.
 *
 * Regle : toute URL absolue d'une PAGE declaree a un robot (canonical, og:url,
 * hreflang, sitemap, JSON-LD) se termine par un slash final, car GitHub Pages
 * sert `chemin/index.html` en 200 sur `/chemin/` et repond 301 sur `/chemin`.
 *
 * Jumeau Node pour les scripts de build : scripts/siteUrl.mjs (meme logique).
 */
export const BASE_URL = "https://i-ca.re";

/** Normalise un chemin de page : slash initial et slash final garantis. */
export function pagePath(path: string): string {
  if (!path || path === "/") return "/";
  const withLeading = path.startsWith("/") ? path : `/${path}`;
  return `${withLeading.replace(/\/+$/, "")}/`;
}

/** URL absolue d'une page du site, toujours avec slash final. */
export function pageUrl(path: string): string {
  return `${BASE_URL}${pagePath(path)}`;
}

/** URL absolue d'un fichier statique (image, og, pdf) : jamais de slash final. */
export function assetUrl(path: string): string {
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
