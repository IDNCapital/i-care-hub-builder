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
import FAQ from "./pages/FAQ";
import BlogTrouverCabinet from "./pages/BlogTrouverCabinet";
import BlogCoutCabinetBordeaux from "./pages/BlogCoutCabinetBordeaux";
import InstallerCabinet from "./pages/InstallerCabinet";
import TrouverCabinetMedicalBordeaux from "./pages/TrouverCabinetMedicalBordeaux";
import InsightsCabinetMedicalBordeaux from "./pages/InsightsCabinetMedicalBordeaux";
import InsightsIndex from "./pages/InsightsIndex";
import InsightsBudget from "./pages/InsightsBudget";
import InsightsSurface from "./pages/InsightsSurface";
import InsightsTransformer from "./pages/InsightsTransformer";
import InsightsProfessions from "./pages/InsightsProfessions";
import InsightsLouerAcheter from "./pages/InsightsLouerAcheter";
import { CookieBanner } from "./components/CookieBanner";
import { ScrollToTop } from "./components/ScrollToTop";
import { useAnalytics } from "./hooks/useAnalytics";

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
          <title>I-CA.RE — Rénovation de lieux de santé</title>
          <meta
            name="description"
            content="I-CA.RE rénove et modernise des lieux de santé pour offrir aux professionnels un cadre de travail exemplaire et aux habitants un accès facilité à des soins de qualité."
          />
        </Helmet>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnalyticsProvider>
            <Routes>
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
                <Route path="/faq" element={<FAQ />} />
                <Route path="/blog/finding-office-bordeaux-practitioner" element={<BlogTrouverCabinet />} />
                <Route path="/blog/consultation-office-cost-bordeaux" element={<BlogCoutCabinetBordeaux />} />
                <Route path="/setting-up-practice" element={<InstallerCabinet />} />
                <Route path="/finding-medical-office-bordeaux" element={<TrouverCabinetMedicalBordeaux />} />
                <Route path="/insights/medical-office-bordeaux" element={<InsightsCabinetMedicalBordeaux />} />
                <Route path="/insights" element={<InsightsIndex />} />
                <Route path="/insights/office-budget-bordeaux" element={<InsightsBudget />} />
                <Route path="/insights/medical-office-size" element={<InsightsSurface />} />
                <Route path="/insights/converting-commercial-space" element={<InsightsTransformer />} />
                <Route path="/insights/professions-sharing-office" element={<InsightsProfessions />} />
                <Route path="/insights/rent-or-buy-office" element={<InsightsLouerAcheter />} />
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
                <Route path="/questions-frequentes" element={<FAQ />} />
                <Route path="/blog/trouver-cabinet-bordeaux-praticien" element={<BlogTrouverCabinet />} />
                <Route path="/installer-cabinet-praticien" element={<InstallerCabinet />} />
                <Route path="/trouver-cabinet-medical-bordeaux" element={<TrouverCabinetMedicalBordeaux />} />
                <Route path="/insights/cabinet-medical-bordeaux" element={<InsightsCabinetMedicalBordeaux />} />
                <Route path="/insights" element={<InsightsIndex />} />
                <Route path="/insights/budget-cabinet-bordeaux" element={<InsightsBudget />} />
                <Route path="/insights/surface-cabinet-medical" element={<InsightsSurface />} />
                <Route path="/insights/transformer-local-en-cabinet" element={<InsightsTransformer />} />
                <Route path="/insights/professions-partage-cabinet" element={<InsightsProfessions />} />
                <Route path="/insights/louer-ou-acheter-cabinet" element={<InsightsLouerAcheter />} />
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
