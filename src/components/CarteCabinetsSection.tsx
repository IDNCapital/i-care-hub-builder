/**
 * CarteCabinetsSection : Wrapper réutilisable pour embarquer la carte
 * interactive sur les pages publiques (home, /projets, /patients).
 *
 * Lazy import + Suspense : Leaflet (~150kB) ne se charge que si la
 * section est rendue, et n'alourdit jamais le bundle initial.
 */
import { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { MapErrorBoundary } from "@/components/MapErrorBoundary";

const CarteCabinets = lazy(() =>
  import("@/components/CarteCabinets").then((m) => ({ default: m.CarteCabinets })),
);

interface CarteCabinetsSectionProps {
  /** Titre H2 de la section. Si non fourni, utilise une valeur par défaut i18n. */
  title?: string;
  /** Sous-titre optionnel sous le H2. */
  subtitle?: string;
  /** Variation visuelle du fond. */
  background?: "default" | "secondary";
  /** Affichage de la sidebar (filtres + liste). Défaut : true. */
  showSidebar?: boolean;
  /** Hauteur custom de la carte. */
  height?: string;
}

export function CarteCabinetsSection({
  title,
  subtitle,
  background = "default",
  showSidebar = true,
  height,
}: CarteCabinetsSectionProps) {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const defaultTitle = lang === "fr" ? "Nos cabinets" : "Our offices";
  const defaultSubtitle =
    lang === "fr"
      ? "Découvrez nos espaces de soin, paramédical et bien-être à Bordeaux et en métropole."
      : "Discover our care, paramedical and wellbeing spaces in Bordeaux and surroundings.";

  const bgClass = background === "secondary" ? "bg-secondary" : "bg-background";

  return (
    <section className={`section-padding ${bgClass}`}>
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="section-title mb-4">{title ?? defaultTitle}</h2>
          <p className="text-lg text-muted-foreground">{subtitle ?? defaultSubtitle}</p>
        </div>
        <MapErrorBoundary lang={lang} recovery="reload">
          <Suspense
            fallback={
              <div
                className="flex items-center justify-center bg-muted/30 rounded-md"
                style={{ height: height ?? "min(70vh, 520px)" }}
              >
                <p className="text-sm text-muted-foreground">
                  {lang === "fr" ? "Chargement de la carte…" : "Loading map…"}
                </p>
              </div>
            }
          >
            <CarteCabinets centerOn="all" showSidebar={showSidebar} height={height} />
          </Suspense>
        </MapErrorBoundary>
      </div>
    </section>
  );
}

export default CarteCabinetsSection;
