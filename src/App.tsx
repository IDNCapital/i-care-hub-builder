import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Vision from "./pages/Vision";
import Professionnels from "./pages/Professionnels";
import Projets from "./pages/Projets";
import Collectivites from "./pages/Collectivites";
import Investisseurs from "./pages/Investisseurs";
import Methode from "./pages/Methode";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vision" element={<Vision />} />
            <Route path="/professionnels" element={<Professionnels />} />
            <Route path="/projets" element={<Projets />} />
            <Route path="/collectivites" element={<Collectivites />} />
            <Route path="/investisseurs" element={<Investisseurs />} />
            <Route path="/methode" element={<Methode />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
