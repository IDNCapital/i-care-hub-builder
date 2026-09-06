/**
 * Barrière d'erreur autour de la carte Leaflet.
 *
 * Deux usages :
 * - `recovery="remount"` (défaut) : barrière LOCALE, posée directement
 *   autour de `<MapContainer>` dans CarteCabinets. Un nouvel essai remonte
 *   uniquement la carte ; l'en-tête, le reste de la page, la sidebar et la
 *   sélection en cours restent intacts.
 * - `recovery="reload"` : barrière EXTÉRIEURE, posée autour du `<Suspense>`
 *   qui attend le `lazy()import` de CarteCabinets (CarteCabinetsSection,
 *   PreviewCarteCabinets). Si ce lazy import a échoué (ex. coupure réseau
 *   pendant le chargement du chunk), React met en cache la promesse
 *   rejetée : un simple `setState` local relance le même import et
 *   échoue à nouveau indéfiniment, même une fois le réseau rétabli. Seul
 *   un rechargement complet de la page force un nouvel import.
 *
 * Ne journalise jamais l'objet d'erreur ni de donnée utilisateur (aucune
 * télémétrie).
 */
import { Component, type ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  lang?: "fr" | "en";
  /** "remount" (défaut) : réessai local. "reload" : recharge la page entière. */
  recovery?: "remount" | "reload";
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

const COPY = {
  fr: {
    title: "Carte indisponible",
    body: "La carte interactive n'a pas pu s'afficher. Retrouvez nos cabinets via le lien ci-dessous.",
    retry: "Réessayer",
    reload: "Recharger la page",
    link: "Voir tous les cabinets",
    href: "/projets",
  },
  en: {
    title: "Map unavailable",
    body: "The interactive map could not be displayed. You can find our offices via the link below.",
    retry: "Try again",
    reload: "Reload page",
    link: "See all offices",
    href: "/en/projects",
  },
} as const;

export class MapErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch() {
    // Volontairement vide : pas de log de l'objet d'erreur, pas de télémétrie.
  }

  handleRetry = () => {
    if (this.props.recovery === "reload") {
      window.location.reload();
      return;
    }
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      const lang = this.props.lang === "en" ? "en" : "fr";
      const t = COPY[lang];
      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-3 text-center bg-muted/30 rounded-md p-8"
          style={{ minHeight: 240 }}
        >
          <p className="font-heading text-lg text-foreground">{t.title}</p>
          <p className="text-sm text-muted-foreground max-w-sm">{t.body}</p>
          <div className="flex gap-4 flex-wrap justify-center items-center">
            <button
              type="button"
              onClick={this.handleRetry}
              className="inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-2 text-foreground focus:outline-none focus:ring-2 focus:ring-[#9EB8A5]/40 rounded"
            >
              {this.props.recovery === "reload" ? t.reload : t.retry}
            </button>
            <Link
              to={t.href}
              className="inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-2 text-foreground focus:outline-none focus:ring-2 focus:ring-[#9EB8A5]/40 rounded"
            >
              {t.link}
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default MapErrorBoundary;
