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

// Predefined event helpers
export const Analytics = {
  ctaClick: (ctaLabel: string, page: string) =>
    trackEvent("cta_click", { cta_label: ctaLabel, page }),

  formSubmission: (formName: string, page: string) =>
    trackEvent("form_submission", { form_name: formName, page }),

  projectView: (projectName: string, projectSlug: string, city: string) =>
    trackEvent("project_view", {
      project_name: projectName,
      project_slug: projectSlug,
      project_city: city,
    }),

  scrollDepth: (depth: number, page: string) =>
    trackEvent("scroll_depth", { depth_percent: depth, page }),

  pageView: (pagePath: string, pageTitle: string) =>
    trackEvent("page_view", { page_path: pagePath, page_title: pageTitle }),
};

// Conversion goals reference (for GTM configuration)
// Goal 1: CTA Click → event "cta_click"
// Goal 2: Form Submission → event "form_submission"
// Goal 3: Project Page View → event "project_view"
// Goal 4: Scroll 50% → event "scroll_depth" where depth_percent = 50
// Goal 5: Contact Page Visit → event "page_view" where page_path = "/contact"

// TypeScript declarations
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
