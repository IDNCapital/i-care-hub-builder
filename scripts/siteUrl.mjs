// Jumeau Node du helper src/lib/siteUrl.ts (meme regle, autre runtime).
// Regle : toute URL absolue d'une page declaree a un robot porte un slash final.
export const BASE_URL = "https://i-ca.re";

export function pagePath(path) {
  if (!path || path === "/") return "/";
  const withLeading = String(path).startsWith("/") ? String(path) : `/${path}`;
  return `${withLeading.replace(/\/+$/, "")}/`;
}

export function pageUrl(path) {
  return `${BASE_URL}${pagePath(path)}`;
}
