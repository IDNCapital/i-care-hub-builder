import { ExternalLink, Star } from "lucide-react";

export interface GoogleReviewCardData {
  id: string;
  auteur_prenom: string;
  auteur_initiale_nom: string | null;
  cabinet_slug: string;
  cabinet_nom_affichage: string;
  note: number;
  texte_avis: string;
  date_publication: string; // ISO date
  lien_avis_google: string | null;
  lien_fiche_gbp: string | null;
}

function formatRelativeMonth(iso: string, lang: "fr" | "en" = "fr"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", {
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Official Google "G" logo (multicolor) */
function GoogleGLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.95l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export function GoogleReviewCard({
  review,
  lang = "fr",
}: {
  review: GoogleReviewCardData;
  lang?: "fr" | "en";
}) {
  const authorName = review.auteur_initiale_nom
    ? `${review.auteur_prenom} ${review.auteur_initiale_nom}`
    : review.auteur_prenom;
  const externalUrl = review.lien_avis_google || review.lien_fiche_gbp || null;
  const labelSeeOnGoogle = lang === "fr" ? "Voir sur Google" : "View on Google";
  const labelGoogleReview = lang === "fr" ? "Avis Google" : "Google review";

  return (
    <article className="bg-card border border-accent/30 rounded-lg p-6 shadow-soft flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
          <GoogleGLogo />
          <span className="font-medium">{labelGoogleReview}</span>
        </div>
        <span className="text-xs text-muted-foreground text-right leading-tight">
          {review.cabinet_nom_affichage}
        </span>
      </div>

      {/* Stars + date */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="flex items-center gap-0.5"
          role="img"
          aria-label={`${review.note} ${lang === "fr" ? "étoiles sur 5" : "stars out of 5"}`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < review.note
                  ? "fill-accent stroke-accent"
                  : "fill-transparent stroke-muted-foreground/40"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground capitalize">
          {formatRelativeMonth(review.date_publication, lang)}
        </span>
      </div>

      {/* Author */}
      <p className="text-[0.95rem] font-bold text-foreground mb-3">{authorName}</p>

      {/* Body */}
      <blockquote className="text-base text-foreground/85 leading-[1.65] mb-5 flex-1">
        {review.texte_avis}
      </blockquote>

      {/* Footer link */}
      {externalUrl && (
        <div
          className="mt-4 pt-4 flex justify-end"
          style={{ borderTop: "1px solid #BFBFBF" }}
        >
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-body transition-colors"
            style={{ fontSize: "0.85rem", color: "#9EB8A5" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#B89B6F")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9EB8A5")}
            aria-label={`${labelSeeOnGoogle} — ${authorName}`}
          >
            {labelSeeOnGoogle} →
          </a>
        </div>
      )}
    </article>
  );
}