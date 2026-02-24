import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
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
import NotreApproche from "./pages/NotreApproche";
import Contact from "./pages/Contact";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import PolitiqueCookies from "./pages/PolitiqueCookies";
import NotFound from "./pages/NotFound";
import { CookieBanner } from "./components/CookieBanner";
import { useAnalytics } from "./hooks/useAnalytics";

const queryClient = new QueryClient();

function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useAnalytics();
  return <>{children}</>;
}

/** Syncs i18n language with the URL :lang param */
function LangSync({ children }: { children: React.ReactNode }) {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && (lang === "fr" || lang === "en") && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // Set html lang attribute
  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en-GB" : "fr-FR";
  }, [lang]);

  return <>{children}</>;
}

/** Detects language and redirects to the right prefix */
function LangRedirect() {
  const stored = localStorage.getItem("i18nextLng");
  const detected = stored || (navigator.language?.startsWith("en") ? "en" : "fr");
  const lang = detected === "en" ? "en" : "fr";
  return <Navigate to={`/${lang}/`} replace />;
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
              {/* Root redirect */}
              <Route path="/" element={<LangRedirect />} />

              {/* FR routes */}
              <Route path="/fr/*" element={<LangSync><Routes>
                <Route path="/" element={<Index />} />
                <Route path="/projets" element={<Projets />} />
                <Route path="/projets/:slug" element={<ProjetDetail />} />
                <Route path="/professionnels" element={<Professionnels />} />
                <Route path="/investissement" element={<Investissement />} />
                <Route path="/investissement/interet" element={<InvestisseurInteret />} />
                <Route path="/investissement/memo" element={<InvestisseurMemo />} />
                <Route path="/notre-approche" element={<NotreApproche />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/confidentialite" element={<PolitiqueConfidentialite />} />
                <Route path="/cookies" element={<PolitiqueCookies />} />
                <Route path="*" element={<NotFound />} />
              </Routes></LangSync>} />

              {/* EN routes */}
              <Route path="/en/*" element={<LangSync><Routes>
                <Route path="/" element={<Index />} />
                <Route path="/projects" element={<Projets />} />
                <Route path="/projects/:slug" element={<ProjetDetail />} />
                <Route path="/health-professionals" element={<Professionnels />} />
                <Route path="/investment" element={<Investissement />} />
                <Route path="/investment/interest" element={<InvestisseurInteret />} />
                <Route path="/investment/memo" element={<InvestisseurMemo />} />
                <Route path="/our-approach" element={<NotreApproche />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/legal" element={<MentionsLegales />} />
                <Route path="/privacy" element={<PolitiqueConfidentialite />} />
                <Route path="/cookies" element={<PolitiqueCookies />} />
                <Route path="*" element={<NotFound />} />
              </Routes></LangSync>} />

              {/* Legacy redirects (old URLs without prefix → FR) */}
              <Route path="/projets" element={<Navigate to="/fr/projets" replace />} />
              <Route path="/projets/:slug" element={<Navigate to="/fr/projets" replace />} />
              <Route path="/professionnels" element={<Navigate to="/fr/professionnels" replace />} />
              <Route path="/investissement" element={<Navigate to="/fr/investissement" replace />} />
              <Route path="/investissement/*" element={<Navigate to="/fr/investissement" replace />} />
              <Route path="/notre-approche" element={<Navigate to="/fr/notre-approche" replace />} />
              <Route path="/contact" element={<Navigate to="/fr/contact" replace />} />
              <Route path="/mentions-legales" element={<Navigate to="/fr/mentions-legales" replace />} />
              <Route path="/confidentialite" element={<Navigate to="/fr/confidentialite" replace />} />
              <Route path="/cookies" element={<Navigate to="/fr/cookies" replace />} />
              <Route path="/vision" element={<Navigate to="/fr/notre-approche" replace />} />
              <Route path="/a-propos" element={<Navigate to="/fr/notre-approche" replace />} />
              <Route path="/collectivites" element={<Navigate to="/fr/notre-approche" replace />} />
              <Route path="/investisseurs" element={<Navigate to="/fr/investissement" replace />} />
              <Route path="/methode" element={<Navigate to="/fr/notre-approche" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieBanner />
          </AnalyticsProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
