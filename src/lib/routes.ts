// Route mappings between FR and EN
const routeMap: Record<string, Record<string, string>> = {
  fr: {
    home: "",
    projects: "projets",
    projectDetail: "projets",
    professionals: "professionnels",
    investment: "investissement",
    investmentInterest: "investissement/interet",
    investmentMemo: "investissement/memo",
    approach: "notre-approche",
    contact: "contact",
    legal: "mentions-legales",
    privacy: "confidentialite",
    cookies: "cookies",
  },
  en: {
    home: "",
    projects: "projects",
    projectDetail: "projects",
    professionals: "health-professionals",
    investment: "investment",
    investmentInterest: "investment/interest",
    investmentMemo: "investment/memo",
    approach: "our-approach",
    contact: "contact",
    legal: "legal",
    privacy: "privacy",
    cookies: "cookies",
  },
};

/**
 * Given a full pathname like /fr/projets/some-slug,
 * returns the equivalent path in the target language.
 */
export function getEquivalentPath(
  currentPath: string,
  targetLang: "fr" | "en"
): string {
  // Extract current language and rest of path
  const match = currentPath.match(/^\/(fr|en)(\/.*)?$/);
  if (!match) return `/${targetLang}/`;

  const currentLang = match[1] as "fr" | "en";
  const rest = (match[2] || "/").replace(/^\//, "");

  // Find which route key matches
  const currentRoutes = routeMap[currentLang];
  const targetRoutes = routeMap[targetLang];

  for (const [key, frPath] of Object.entries(currentRoutes)) {
    if (!frPath) continue;

    // Check for exact match or prefix match (for detail pages with slugs)
    if (rest === frPath) {
      const targetPath = targetRoutes[key];
      return `/${targetLang}/${targetPath}`;
    }

    if (rest.startsWith(frPath + "/")) {
      const slug = rest.slice(frPath.length + 1);
      const targetPath = targetRoutes[key];
      return `/${targetLang}/${targetPath}/${slug}`;
    }
  }

  // Home page
  if (rest === "" || rest === "/") {
    return `/${targetLang}/`;
  }

  // Fallback: keep the same path segment
  return `/${targetLang}/${rest}`;
}

/**
 * Build a localized path for a given route key
 */
export function localePath(lang: "fr" | "en", routeKey: string, slug?: string): string {
  const path = routeMap[lang]?.[routeKey] ?? routeKey;
  if (slug) return `/${lang}/${path}/${slug}`;
  return `/${lang}/${path}`;
}

export { routeMap };
