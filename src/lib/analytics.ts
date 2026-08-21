import { pagePath } from "@/lib/siteUrl";

// Google Tag Manager Container ID: replace with your actual ID
export const GTM_ID = "GTM-W5VF94T3";

// Consent-gated GTM loader
export function loadGTM() {
  if (typeof window === "undefined") return;
  if (document.getElementById("gtm-script")) return;

  // dataLayer init
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });

  const script = document.createElement("script");
  script.id = "gtm-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(script);
}

export function removeGTM() {
  const script = document.getElementById("gtm-script");
  if (script) script.remove();
  // Clear dataLayer
  window.dataLayer = [];
}

// Push custom events to dataLayer
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });
}

/**
 * Normalise un chemin de page AVANT emission, sur la forme canonique du site :
 * slash final, racine exceptee. Meme fonction que celle qui produit la canonical,
 * l'og:url, les hreflang et le sitemap, donc aucune cinquieme regle a tenir.
 *
 * Sans elle, GA4 comptait deux chemins pour une meme page, et le clivage n'etait
 * pas aleatoire : un chargement a froid de /contact/ envoyait "/contact/", que la
 * barre d'adresse porte, tandis qu'un clic interne vers /projets envoyait
 * "/projets", que le <Link> porte sans slash. Search Console, lui, regroupait
 * correctement par la canonical, d'ou deux lectures qui ne se recoupaient pas.
 *
 * Une valeur qui n'est pas un chemin de page est laissee telle quelle.
 */
function cheminCanonique(page: string): string {
  if (typeof page !== "string" || !page.startsWith("/")) return page;
  return pagePath(page);
}

// Predefined event helpers
export const Analytics = {
  ctaClick: (ctaLabel: string, page: string) =>
    trackEvent("cta_click", { cta_label: ctaLabel, page: cheminCanonique(page) }),

  formSubmission: (formName: string, page: string) =>
    trackEvent("form_submission", { form_name: formName, page: cheminCanonique(page) }),

  projectView: (projectName: string, projectSlug: string, city: string) =>
    trackEvent("project_view", {
      project_name: projectName,
      project_slug: projectSlug,
      project_city: city,
    }),

  scrollDepth: (depth: number, page: string) =>
    trackEvent("scroll_depth", { depth_percent: depth, page: cheminCanonique(page) }),

  pageView: (chemin: string, pageTitle: string) =>
    trackEvent("page_view", { page_path: cheminCanonique(chemin), page_title: pageTitle }),
};

// Conversion goals reference (for GTM configuration)
// Goal 1: CTA Click → event "cta_click"
// Goal 2: Form Submission → event "form_submission"
// Goal 3: Project Page View → event "project_view"
// Goal 4: Scroll 50% → event "scroll_depth" where depth_percent = 50
// Goal 5: Contact Page Visit → event "page_view" where page_path = "/contact/"
//   ATTENTION : depuis le lot 4 du sprint 14, page_path porte TOUJOURS le slash
//   final, racine exceptee. Les objectifs et segments GA4 qui filtrent sur une
//   valeur exacte sans slash ne matchent plus et sont a reprendre en console.

// TypeScript declarations
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
