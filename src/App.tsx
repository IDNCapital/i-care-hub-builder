import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Index from "./pages/Index";
import Professionnels from "./pages/Professionnels";
import Projets from "./pages/Projets";
import ProjetDetail from "./pages/ProjetDetail";
import Investissement from "./pages/Investissement";
import InvestisseurInteret from "./pages/InvestisseurInteret";
import InvestisseurMemo from "./pages/InvestisseurMemo";
import InvestisseurVerify from "./pages/InvestisseurVerify";
import NotreApproche from "./pages/NotreApproche";
import Contact from "./pages/Contact";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import PolitiqueCookies from "./pages/PolitiqueCookies";
import NotFound from "./pages/NotFound";
import LocationCabinetBordeaux from "./pages/LocationCabinetBordeaux";
import LocationCabinetToulouse from "./pages/LocationCabinetToulouse";
import FAQ from "./pages/FAQ";
import BlogTrouverCabinet from "./pages/BlogTrouverCabinet";
import BlogCoutCabinetBordeaux from "./pages/BlogCoutCabinetBordeaux";
import InsightsCabinetMedicalBordeaux from "./pages/InsightsCabinetMedicalBordeaux";
import InsightsIndex from "./pages/InsightsIndex";
import InsightsBudget from "./pages/InsightsBudget";
import InsightsSurface from "./pages/InsightsSurface";
import InsightsTransformer from "./pages/InsightsTransformer";
import InsightsProfessions from "./pages/InsightsProfessions";
import InsightsLouerAcheter from "./pages/InsightsLouerAcheter";
import Patients from "./pages/Patients";
import DecrireMonBesoin from "./pages/DecrireMonBesoin";
import ProblematiquesIndex from "./pages/ProblematiquesIndex";
import ProblematiqueDetail from "./pages/ProblematiqueDetail";
import ArticlesIndex from "./pages/ArticlesIndex";
import ArticleDetail from "./pages/ArticleDetail";
import SpecialiteDetail from "./pages/SpecialiteDetail";
import TemoignagesPraticiens from "./pages/TemoignagesPraticiens";
import SinstallerIndex from "./pages/SinstallerIndex";
import SinstallerDetail from "./pages/SinstallerDetail";
import { CookieBanner } from "./components/CookieBanner";
import { ScrollToTop } from "./components/ScrollToTop";
import { useAnalytics } from "./hooks/useAnalytics";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminPraticiens from "./pages/admin/AdminPraticiens";
import AdminDemandes from "./pages/admin/AdminDemandes";
import AdminDemandesInstallation from "./pages/admin/AdminDemandesInstallation";
import AdminWebhooks from "./pages/admin/AdminWebhooks";
import AdminExtractions from "./pages/admin/AdminExtractions";
import { AdminGuard } from "./components/AdminGuard";
import PreviewPraticien from "./pages/PreviewPraticien";
import PraticienPublic from "./pages/PraticienPublic";
import PreviewFooterIdn from "./pages/PreviewFooterIdn";
import PreviewFooterIdnV3 from "./pages/PreviewFooterIdnV3";
import PreviewCarteCabinets from "./pages/PreviewCarteCabinets";

const queryClient = new QueryClient();

function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useAnalytics();
  return <>{children}</>;
}

/** Syncs i18n language with the route group */
function LangSync({ lang, children }: { lang: "fr" | "en"; children: React.ReactNode }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en-GB" : "fr-FR";
  }, [lang]);

  return <>{children}</>;
}

/** Redirects old /fr/* URLs to root equivalents */
function FrRedirect() {
  const location = useLocation();
  const rest = location.pathname.replace(/^\/fr\/?/, "/").replace(/\/\//g, "/");
  return <Navigate to={rest || "/"} replace />;
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Helmet>
          <title>I-CA.RE | Rénovation de lieux de santé</title>
          <meta
            name="description"
            content="I-CA.RE rénove et modernise des lieux de santé pour offrir aux professionnels un cadre de travail exemplaire et aux habitants un accès facilité à des soins de qualité."
          />
          {/* Open Graph (default: pages may override) */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="I-CA.RE" />
          <meta property="og:title" content="I-CA.RE | Des lieux de soin pensés comme des lieux de vie" />
          <meta property="og:description" content="Foncière familiale indépendante. Des cabinets à louer, pensés pour les praticiennes et praticiens, à Bordeaux et dans le Sud-Ouest." />
          <meta property="og:image" content="https://i-ca.re/og-i-ca-re.png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="I-CA.RE, Des lieux de soin pensés comme des lieux de vie" />
          <meta property="og:url" content="https://i-ca.re/" />
          <meta property="og:locale" content="fr_FR" />
          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="I-CA.RE | Des lieux de soin pensés comme des lieux de vie" />
          <meta name="twitter:description" content="Foncière familiale indépendante. Des cabinets à louer, pensés pour les praticiennes et praticiens, à Bordeaux et dans le Sud-Ouest." />
          <meta name="twitter:image" content="https://i-ca.re/og-i-ca-re.png" />
          <meta name="twitter:image:alt" content="I-CA.RE, Des lieux de soin pensés comme des lieux de vie" />
        </Helmet>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnalyticsProvider>
            <Routes>
              {/* Preview privée praticien (langue-agnostique, hors i18n) */}
              <Route path="/preview/:slug/:token" element={<PreviewPraticien />} />

              {/* Fiche publique praticien (langue-agnostique pour V1) */}
              <Route path="/praticien/:slug" element={<PraticienPublic />} />

              {/* Preview interne footer Famille IDN : sprint 7 (noindex,nofollow) */}
              <Route path="/preview-footer-idn" element={<PreviewFooterIdn />} />

              {/* Preview v3 footer compact unifié : sprint 7 (noindex,nofollow) */}
              <Route path="/preview-footer-idn-v3" element={<PreviewFooterIdnV3 />} />

              {/* Preview interne carte des cabinets : sprint 6 (noindex,nofollow) */}
              <Route path="/preview-carte-cabinets" element={<PreviewCarteCabinets />} />

              {/* Admin routes (hors i18n) */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/praticiens"
                element={
                  <AdminGuard>
                    <AdminPraticiens />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/demandes"
                element={
                  <AdminGuard>
                    <AdminDemandes />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/demandes-installation"
                element={
                  <AdminGuard>
                    <AdminDemandesInstallation />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/idn-os-webhooks"
                element={
                  <AdminGuard>
                    <AdminWebhooks />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/extractions"
                element={
                  <AdminGuard>
                    <AdminExtractions />
                  </AdminGuard>
                }
              />
              <Route path="/admin" element={<Navigate to="/admin/praticiens" replace />} />

              {/* EN routes (prefixed) */}
              <Route path="/en/*" element={<LangSync lang="en"><Routes>
                <Route path="/" element={<Index />} />
                <Route path="/projects" element={<Projets />} />
                <Route path="/projects/:slug" element={<ProjetDetail />} />
                <Route path="/health-professionals" element={<Professionnels />} />
                <Route path="/investment" element={<Investissement />} />
                <Route path="/investment/interest" element={<InvestisseurInteret />} />
                <Route path="/investment/memo" element={<InvestisseurMemo />} />
                <Route path="/investment/verify" element={<InvestisseurVerify />} />
                <Route path="/our-approach" element={<NotreApproche />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/legal" element={<MentionsLegales />} />
                <Route path="/privacy" element={<PolitiqueConfidentialite />} />
                <Route path="/cookies" element={<PolitiqueCookies />} />
                <Route path="/practitioners" element={<Professionnels />} />
                <Route path="/office-rental-bordeaux" element={<LocationCabinetBordeaux />} />
                <Route path="/office-rental-toulouse" element={<LocationCabinetToulouse />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/blog/finding-office-bordeaux-practitioner" element={<Navigate to="/en/insights/medical-office-bordeaux" replace />} />
                <Route path="/blog/consultation-office-cost-bordeaux" element={<Navigate to="/en/insights/office-budget-bordeaux" replace />} />
                <Route path="/setting-up-practice" element={<Navigate to="/en/health-professionals" replace />} />
                <Route path="/finding-medical-office-bordeaux" element={<Navigate to="/en/office-rental-bordeaux" replace />} />
                <Route path="/insights/medical-office-bordeaux" element={<InsightsCabinetMedicalBordeaux />} />
                <Route path="/insights" element={<InsightsIndex />} />
                <Route path="/insights/office-budget-bordeaux" element={<InsightsBudget />} />
                <Route path="/insights/medical-office-size" element={<InsightsSurface />} />
                <Route path="/insights/converting-commercial-space" element={<InsightsTransformer />} />
                <Route path="/insights/professions-sharing-office" element={<InsightsProfessions />} />
                <Route path="/insights/rent-or-buy-office" element={<InsightsLouerAcheter />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/patients/decrire-mon-besoin" element={<DecrireMonBesoin />} />
                <Route path="/practitioner-testimonials" element={<TemoignagesPraticiens />} />
                <Route path="*" element={<NotFound />} />
              </Routes></LangSync>} />

              {/* Legacy /fr/* redirects → root */}
              <Route path="/fr/*" element={<FrRedirect />} />

              {/* Legacy redirects (old URLs without prefix) */}
              <Route path="/vision" element={<Navigate to="/notre-approche" replace />} />
              <Route path="/a-propos" element={<Navigate to="/notre-approche" replace />} />
              <Route path="/collectivites" element={<Navigate to="/notre-approche" replace />} />
              <Route path="/investisseurs" element={<Navigate to="/investissement" replace />} />
              <Route path="/methode" element={<Navigate to="/notre-approche" replace />} />
              <Route path="/praticiens" element={<Navigate to="/professionnels" replace />} />
              <Route path="/realisations" element={<Navigate to="/projets" replace />} />
              <Route path="/nos-offres" element={<Navigate to="/professionnels" replace />} />

              {/* Blog → Insights 301 redirects */}
              <Route path="/blog/trouver-cabinet-bordeaux-praticien" element={<Navigate to="/insights/cabinet-medical-bordeaux" replace />} />
              <Route path="/blog/combien-coute-cabinet-consultation-bordeaux" element={<Navigate to="/insights/budget-cabinet-bordeaux" replace />} />
              <Route path="/blog" element={<Navigate to="/insights" replace />} />

              {/* FR routes (root, no prefix) */}
              <Route path="/*" element={<LangSync lang="fr"><Routes>
                <Route path="/" element={<Index />} />
                <Route path="/projets" element={<Projets />} />
                <Route path="/projets/:slug" element={<ProjetDetail />} />
                <Route path="/professionnels" element={<Professionnels />} />
                <Route path="/investissement" element={<Investissement />} />
                <Route path="/investissement/interet" element={<InvestisseurInteret />} />
                <Route path="/investissement/memo" element={<InvestisseurMemo />} />
                <Route path="/investissement/verify" element={<InvestisseurVerify />} />
                <Route path="/notre-approche" element={<NotreApproche />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/confidentialite" element={<PolitiqueConfidentialite />} />
                <Route path="/cookies" element={<PolitiqueCookies />} />
                <Route path="/location-cabinet-bordeaux" element={<LocationCabinetBordeaux />} />
                <Route path="/location-cabinet-toulouse" element={<LocationCabinetToulouse />} />
                <Route path="/questions-frequentes" element={<FAQ />} />
                <Route path="/installer-cabinet-praticien" element={<Navigate to="/sinstaller" replace />} />
                <Route path="/trouver-cabinet-medical-bordeaux" element={<Navigate to="/location-cabinet-bordeaux" replace />} />
                <Route path="/insights/cabinet-medical-bordeaux" element={<InsightsCabinetMedicalBordeaux />} />
                <Route path="/insights" element={<InsightsIndex />} />
                <Route path="/insights/budget-cabinet-bordeaux" element={<InsightsBudget />} />
                <Route path="/insights/surface-cabinet-medical" element={<InsightsSurface />} />
                <Route path="/insights/transformer-local-en-cabinet" element={<InsightsTransformer />} />
                <Route path="/insights/professions-partage-cabinet" element={<InsightsProfessions />} />
                <Route path="/insights/louer-ou-acheter-cabinet" element={<InsightsLouerAcheter />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/patients/decrire-mon-besoin" element={<DecrireMonBesoin />} />
                <Route path="/patients/problematiques" element={<ProblematiquesIndex />} />
                <Route path="/patients/problematiques/:slug" element={<ProblematiqueDetail />} />
                <Route path="/patients/articles" element={<ArticlesIndex />} />
                <Route path="/patients/articles/:slug" element={<ArticleDetail />} />
                <Route path="/patients/specialite/:slug" element={<SpecialiteDetail />} />
                <Route path="/temoignages-praticiens" element={<TemoignagesPraticiens />} />
                <Route path="/sinstaller" element={<SinstallerIndex />} />
                <Route path="/sinstaller/:profession/:ville" element={<SinstallerDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes></LangSync>} />
            </Routes>
            <ScrollToTop />
            <CookieBanner />
          </AnalyticsProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
