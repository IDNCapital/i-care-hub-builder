import { Link } from "react-router-dom";
import { marqueAffichee } from "@/lib/brand";

export interface TestimonialCardData {
  id: string;
  praticien_nom: string;
  praticien_profession: string | null;
  cabinet_slug: string;
  cabinet_nom_affichage: string;
  photo_url: string | null;
  citation_longue: string;
}

export function TestimonialCard({
  testimonial,
  lang = "fr",
}: {
  testimonial: TestimonialCardData;
  lang?: "fr" | "en";
}) {
  const projectPath =
    lang === "fr"
      ? `/projets/${testimonial.cabinet_slug}`
      : `/en/projects/${testimonial.cabinet_slug}`;

  const initials = testimonial.praticien_nom
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="flex flex-col items-center text-center bg-card border border-accent/20 rounded-xl p-8 md:p-10 shadow-soft">
      {/* Portrait */}
      <div className="relative w-[180px] h-[180px] md:w-[240px] md:h-[240px] rounded-full overflow-hidden shadow-card mb-6 bg-muted flex items-center justify-center">
        {testimonial.photo_url ? (
          <img
            src={testimonial.photo_url}
            alt={testimonial.praticien_nom}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-heading text-4xl text-muted-foreground" aria-hidden="true">
            {initials}
          </span>
        )}
      </div>

      {/* Name: Playfair Regular */}
      <h3 className="font-heading font-normal text-2xl text-foreground mb-1 leading-tight">
        {testimonial.praticien_nom}
      </h3>

      {/* Profession: Lato */}
      {testimonial.praticien_profession && (
        <p className="font-body text-sm text-muted-foreground mb-5">
          {testimonial.praticien_profession}
        </p>
      )}

      {/* Sage rule */}
      <div className="w-12 h-px bg-primary/40 mb-5" aria-hidden="true" />

      {/* Quote: Playfair Italic */}
      <blockquote className="font-heading italic text-lg md:text-xl text-foreground/85 leading-[1.7] mb-6">
        « {marqueAffichee(testimonial.citation_longue)} »
      </blockquote>

      {/* Cabinet link: Playfair Italic */}
      <p className="font-heading italic text-base text-muted-foreground">
        {lang === "fr" ? "Locataire à " : "Tenant at "}
        <Link
          to={projectPath}
          className="text-foreground hover:text-primary underline-offset-4 hover:underline transition-colors"
        >
          {marqueAffichee(testimonial.cabinet_nom_affichage)}
        </Link>
      </p>
    </article>
  );
}