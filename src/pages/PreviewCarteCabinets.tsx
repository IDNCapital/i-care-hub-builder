import { Helmet } from "react-helmet-async";
import { Suspense, lazy } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Lazy import : Leaflet (~150kB) ne se charge que sur cette page.
const CarteCabinets = lazy(() =>
  import("@/components/CarteCabinets").then((m) => ({ default: m.CarteCabinets })),
);

/**
 * /preview-carte-cabinets — preview de la carte interactive des cabinets.
 * noindex,nofollow + Disallow robots.txt. Pas encore en prod.
 */
export default function PreviewCarteCabinets() {
  return (
    <>
      <Helmet>
        <title>Preview — Carte des cabinets | I-CA.RE</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="googlebot" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-background">
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <p className="font-body text-xs uppercase font-bold tracking-[0.2em] text-primary mb-4">
                Preview interne — sprint 6
              </p>
              <h1 className="font-heading font-normal text-3xl md:text-4xl text-foreground mb-4">
                Carte interactive des cabinets I-CA.RE
              </h1>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                Tuiles OpenStreetMap, sans clé API. Page exclue de l'indexation.
                Embarquement sprint 7 sur home, /projets, /patients.
              </p>
            </div>

            <Suspense
              fallback={
                <div className="flex items-center justify-center h-[400px] bg-muted/30 rounded-md">
                  <p className="text-sm text-muted-foreground">Chargement…</p>
                </div>
              }
            >
              <CarteCabinets centerOn="all" showSidebar />
            </Suspense>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
