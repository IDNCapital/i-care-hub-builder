import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Professionnels from "./pages/Professionnels";
import Projets from "./pages/Projets";
import ProjetDetail from "./pages/ProjetDetail";
import Investissement from "./pages/Investissement";
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
          <meta
            name="keywords"
            content="cabinet médical à louer, centre paramédical, locaux santé Bordeaux, professionnel de santé installation, réhabilitation santé, déserts médicaux"
          />
        </Helmet>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnalyticsProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/projets" element={<Projets />} />
              <Route path="/projets/:slug" element={<ProjetDetail />} />
              <Route path="/professionnels" element={<Professionnels />} />
              <Route path="/investissement" element={<Investissement />} />
              <Route path="/notre-approche" element={<NotreApproche />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/confidentialite" element={<PolitiqueConfidentialite />} />
              <Route path="/cookies" element={<PolitiqueCookies />} />
              {/* Redirects for old URLs */}
              <Route path="/vision" element={<Navigate to="/notre-approche" replace />} />
              <Route path="/a-propos" element={<Navigate to="/notre-approche" replace />} />
              <Route path="/collectivites" element={<Navigate to="/notre-approche#collectivites" replace />} />
              <Route path="/investisseurs" element={<Navigate to="/investissement" replace />} />
              <Route path="/methode" element={<Navigate to="/notre-approche" replace />} />
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
