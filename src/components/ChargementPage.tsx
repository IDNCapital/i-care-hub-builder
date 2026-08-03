import { Loader2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";

interface ChargementPageProps {
  mode: "loading" | "error";
}

/**
 * État de chargement / d'échec de requête partagé par les pages dynamiques.
 * Ne rend AUCUN Helmet, SeoHead, JSON-LD ni meta : le head prérendu reste intact.
 */
export function ChargementPage({ mode }: ChargementPageProps) {
  if (mode === "loading") {
    return (
      <Layout>
        <div className="pt-40 pb-40 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-40 pb-40 px-4 flex flex-col items-center justify-center text-center">
        <h2 className="font-heading font-normal text-2xl md:text-3xl text-anthracite mb-3 text-balance">
          Le contenu n'a pas pu être chargé.
        </h2>
        <p className="font-sans text-base text-[#6B6B6B] mb-8">
          Vérifiez votre connexion, puis réessayez.
        </p>
        <Button variant="gold" size="lg" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    </Layout>
  );
}