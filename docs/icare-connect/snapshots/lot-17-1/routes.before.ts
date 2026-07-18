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
    investmentVerify: "investissement/verify",
    approach: "notre-approche",
    contact: "contact",
    legal: "mentions-legales",
    privacy: "confidentialite",
    cookies: "cookies",
    locationBordeaux: "location-cabinet-bordeaux",
    locationToulouse: "location-cabinet-toulouse",
    faq: "questions-frequentes",
    blogTrouverCabinet: "blog/trouver-cabinet-bordeaux-praticien",
    blogCoutCabinet: "blog/combien-coute-cabinet-consultation-bordeaux",
    insights: "insights",
    insightsCabinetMedical: "insights/cabinet-medical-bordeaux",
    insightsBudget: "insights/budget-cabinet-bordeaux",
    insightsSurface: "insights/surface-cabinet-medical",
    insightsTransformer: "insights/transformer-local-en-cabinet",
    insightsProfessions: "insights/professions-partage-cabinet",
    insightsLouerAcheter: "insights/louer-ou-acheter-cabinet",
    temoignages: "temoignages-praticiens",
    parrainage: "parrainage",
    patients: "patients",
  },
  en: {
    home: "",
    projects: "projects",
    projectDetail: "projects",
    professionals: "health-professionals",
    investment: "investment",
    investmentInterest: "investment/interest",
    investmentMemo: "investment/memo",
    investmentVerify: "investment/verify",
    approach: "our-approach",
    contact: "contact",
    legal: "legal",
    privacy: "privacy",
    cookies: "cookies",
    locationBordeaux: "office-rental-bordeaux",
    locationToulouse: "office-rental-toulouse",
    faq: "faq",
    blogTrouverCabinet: "blog/finding-office-bordeaux-practitioner",
    blogCoutCabinet: "blog/consultation-office-cost-bordeaux",
    insights: "insights",
    insightsCabinetMedical: "insights/medical-office-bordeaux",
    insightsBudget: "insights/office-budget-bordeaux",
    insightsSurface: "insights/medical-office-size",
    insightsTransformer: "insights/converting-commercial-space",
    insightsProfessions: "insights/professions-sharing-office",
    insightsLouerAcheter: "insights/rent-or-buy-office",
    temoignages: "practitioner-testimonials",
    parrainage: "referral",
    patients: "patients",
  },
};

/**
 * Build a localized path for a given route key.
 * FR routes live at the root (/projets), EN routes under /en/ (/en/projects).
 */
export function localePath(lang: "fr" | "en", routeKey: string, slug?: string): string {
  const path = routeMap[lang]?.[routeKey] ?? routeKey;
  if (lang === "fr") {
    if (slug) return `/${path}/${slug}`;
    return path ? `/${path}` : "/";
  }
  // EN
  if (slug) return `/en/${path}/${slug}`;
  return path ? `/en/${path}` : "/en/";
}

/**
 * Given a full pathname, returns the equivalent path in the target language.
 * FR paths have no prefix (/projets), EN paths have /en/ prefix (/en/projects).
 */
export function getEquivalentPath(
  currentPath: string,
  targetLang: "fr" | "en"
): string | null {
  // Detect current language from path
  const enMatch = currentPath.match(/^\/en(\/.*)?$/);
  const currentLang: "fr" | "en" = enMatch ? "en" : "fr";
  const rest = enMatch
    ? (enMatch[1] || "/").replace(/^\//, "")
    : currentPath.replace(/^\//, "");

  const currentRoutes = routeMap[currentLang];

  for (const [key, routePath] of Object.entries(currentRoutes)) {
    if (!routePath) continue;

    if (rest === routePath) {
      return localePath(targetLang, key);
    }

    if (rest.startsWith(routePath + "/")) {
      const slug = rest.slice(routePath.length + 1);
      return localePath(targetLang, key, slug);
    }
  }

  // Home page
  if (rest === "" || rest === "/") {
    return localePath(targetLang, "home");
  }

  // No mapping for this path in the target language
  return null;
}

export { routeMap };
