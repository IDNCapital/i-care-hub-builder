import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { PlayCircle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/SeoHead";
import { TestimonialCard, type TestimonialCardData } from "@/components/TestimonialCard";
import { GoogleReviewCard, type GoogleReviewCardData } from "@/components/GoogleReviewCard";
import { supabase } from "@/integrations/supabase/client";
import { localePath } from "@/lib/routes";
import { PROJECT_IMAGES } from "@/lib/projectImages";

export default function TemoignagesPraticiens() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";
  const path = localePath(lang, "temoignages");

  const [testimonials, setTestimonials] = useState<TestimonialCardData[]>([]);
  const [reviews, setReviews] = useState<GoogleReviewCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [tRes, rRes] = await Promise.all([
        supabase
          .from("temoignages_praticiens")
          .select("*")
          .eq("actif", true)
          .order("ordre_affichage", { ascending: true }),
        supabase
          .from("avis_google_mis_en_avant")
          .select("*")
          .eq("actif", true)
          .order("ordre_affichage", { ascending: true })
          .order("date_publication", { ascending: false }),
      ]);
      if (cancelled) return;
      setTestimonials((tRes.data ?? []) as TestimonialCardData[]);
      setReviews((rRes.data ?? []) as GoogleReviewCardData[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Pick a fallback "view all reviews on Google" link from the first review with one
  const allReviewsLink =
    reviews.find((r) => r.lien_fiche_gbp)?.lien_fiche_gbp ??
    reviews.find((r) => r.lien_avis_google)?.lien_avis_google ??
    null;

  // Video placeholder backgrounds (real cabinet images, no fakes)
  const videoPlaceholders = [
    {
      slug: "i-ca-re-nansouty",
      label: "I-CA.RE Nansouty",
      img: PROJECT_IMAGES["i-ca-re-nansouty"]?.hero,
    },
    {
      slug: "i-ca-re-pey-berland",
      label: "I-CA.RE Pey-Berland",
      img: PROJECT_IMAGES["i-ca-re-pey-berland"]?.hero,
    },
  ];

  // ─── JSON-LD ──────────────────────────────────────────
  const aboutPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name:
      lang === "fr"
        ? "Témoignages des praticiens locataires I-CA.RE"
        : "I-CA.RE practitioner tenant testimonials",
    description:
      lang === "fr"
        ? "Ce que les praticiens locataires disent de leur cabinet I-CA.RE à Bordeaux."
        : "What I-CA.RE tenant practitioners say about their care offices in Bordeaux.",
    url: `https://i-ca.re${path}`,
  };

  const reviewsJsonLd = reviews.map((r) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "LocalBusiness",
      name: r.cabinet_nom_affichage,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bordeaux",
        addressCountry: "FR",
      },
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(r.note),
      bestRating: "5",
    },
    author: {
      "@type": "Person",
      name: r.auteur_initiale_nom
        ? `${r.auteur_prenom} ${r.auteur_initiale_nom}`
        : r.auteur_prenom,
    },
    datePublished: r.date_publication,
    reviewBody: r.texte_avis,
    publisher: {
      "@type": "Organization",
      name: "Google",
    },
  }));

  return (
    <Layout>
      <SeoHead
        title={
          lang === "fr"
            ? "Témoignages — Ce que les praticiens disent de I-CA.RE"
            : "Testimonials — What practitioners say about I-CA.RE"
        }
        description={
          lang === "fr"
            ? "Témoignages institutionnels et avis Google publics des praticiens locataires de cabinets I-CA.RE à Bordeaux."
            : "Institutional testimonials and public Google reviews from practitioner tenants of I-CA.RE offices in Bordeaux."
        }
        path={path}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(aboutPageJsonLd)}</script>
        {reviewsJsonLd.map((schema, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>

      {/* ─── Section 1 — Hero ────────────────────────── */}
      <section className="bg-background pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-foreground/60 font-light mb-6">
            {lang === "fr" ? "— Témoignages praticiens —" : "— Practitioner testimonials —"}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 text-balance">
            <span className="font-bold not-italic block">
              {lang === "fr" ? "Ce que les praticiens disent" : "What practitioners say"}
            </span>
            <span className="italic font-medium block mt-2">
              {lang === "fr" ? "de I‑CA.RE." : "about I‑CA.RE."}
            </span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-[600px] mx-auto">
            {lang === "fr"
              ? "Nos locataires partagent leur expérience de leur cabinet et de la communauté I-CA.RE. Témoignages institutionnels et avis Google publics."
              : "Our tenants share their experience of their office and the I-CA.RE community. Institutional testimonials and public Google reviews."}
          </p>
        </div>
      </section>

      {/* ─── Section 2 — Long testimonials ───────────── */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-heading italic text-2xl md:text-3xl text-foreground mb-4">
              {lang === "fr" ? "Paroles de locataires" : "In our tenants' words"}
            </h2>
            <div className="w-[60px] h-px bg-accent mx-auto" aria-hidden="true" />
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground">…</div>
          ) : testimonials.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {lang === "fr" ? "Aucun témoignage pour le moment." : "No testimonials yet."}
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 md:gap-10">
              {testimonials.map((t, i) => (
                <div
                  key={t.id}
                  className={i % 2 === 1 ? "md:translate-y-8" : ""}
                >
                  <TestimonialCard testimonial={t} lang={lang} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Section 3 — Google reviews ──────────────── */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="font-heading italic text-2xl md:text-3xl text-foreground mb-3">
              {lang === "fr" ? "Avis Google récents" : "Recent Google reviews"}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              {lang === "fr"
                ? "Avis publics déposés par les locataires sur les fiches Google de nos cabinets."
                : "Public reviews left by tenants on the Google listings of our offices."}
            </p>
          </div>

          {reviews.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <GoogleReviewCard key={r.id} review={r} lang={lang} />
              ))}
            </div>
          )}

          {allReviewsLink && (
            <div className="text-center mt-10">
              <Button variant="outline" asChild>
                <a
                  href={allReviewsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={lang === "fr" ? "Voir tous les avis sur Google" : "See all reviews on Google"}
                >
                  {lang === "fr" ? "Voir tous les avis sur Google" : "See all reviews on Google"}
                </a>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ─── Section 4 — Video placeholders ──────────── */}
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h2 className="font-heading italic text-2xl md:text-3xl text-center text-foreground mb-8">
            {lang === "fr" ? "Bientôt en vidéo" : "Coming soon in video"}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {videoPlaceholders.map((v) => (
              <div
                key={v.slug}
                className="relative aspect-video rounded-lg overflow-hidden bg-muted"
              >
                {v.img && (
                  <img
                    src={v.img}
                    alt={v.label}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-foreground/30" aria-hidden="true" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-background">
                  <PlayCircle className="h-16 w-16 mb-3 opacity-90" aria-hidden="true" />
                  <p className="text-sm uppercase tracking-[0.18em] font-light">
                    {lang === "fr" ? "Disponible prochainement" : "Available soon"}
                  </p>
                  <p className="text-xs text-background/80 mt-2">{v.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 5 — Final CTA (forest) ──────────── */}
      <section className="py-20 md:py-24" style={{ backgroundColor: "#1E392B" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <p
            className="text-xs uppercase tracking-[0.25em] font-light mb-6"
            style={{ color: "#C2A46C" }}
          >
            {lang === "fr" ? "— Rejoindre le réseau —" : "— Join the network —"}
          </p>
          <h2 className="font-heading italic text-3xl md:text-4xl lg:text-5xl text-background mb-10 text-balance">
            {lang === "fr"
              ? "Et si vous étiez le prochain locataire ?"
              : "What if you were the next tenant?"}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="text-[#1E392B] hover:opacity-90 border-0"
              style={{ backgroundColor: "#C2A46C" }}
            >
              <Link to={localePath(lang, "projects")}>
                {lang === "fr" ? "Visiter un cabinet" : "Visit an office"}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent hover:bg-transparent"
              style={{ borderColor: "#C2A46C", color: "#C2A46C" }}
            >
              <Link to={localePath(lang, "contact")}>
                {lang === "fr" ? "Découvrir l'opportunité" : "Discover the opportunity"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}