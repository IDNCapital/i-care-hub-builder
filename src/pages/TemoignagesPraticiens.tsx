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

  // "Voir tous les avis" — DB-provided link if any, else Pey-Berland GBP placeholder.
  const allReviewsLink =
    reviews.find((r) => r.lien_fiche_gbp)?.lien_fiche_gbp ??
    reviews.find((r) => r.lien_avis_google)?.lien_avis_google ??
    "https://www.google.com/maps/place/I-CA.RE+Pey-Berland";

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
          <p className="font-body text-xs md:text-sm uppercase font-bold tracking-[0.15em] text-primary mb-6">
            {lang === "fr" ? "Témoignages praticiens" : "Practitioner testimonials"}
          </p>
          <h1 className="font-heading font-normal text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 text-balance leading-[1.15]">
            {lang === "fr"
              ? "Ce que les praticiens disent de I‑CA.RE."
              : "What practitioners say about I‑CA.RE."}
          </h1>
          <p className="font-heading italic text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-[640px] mx-auto">
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
            <p className="font-body text-xs md:text-sm uppercase font-bold tracking-[0.15em] text-primary mb-4">
              {lang === "fr" ? "Paroles de locataires" : "In our tenants' words"}
            </p>
            <h2 className="font-heading font-normal text-3xl md:text-4xl text-foreground mb-4">
              {lang === "fr" ? "Locataires actuels du réseau" : "Current tenants of the network"}
            </h2>
            <div className="w-[60px] h-px bg-primary/40 mx-auto" aria-hidden="true" />
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
            <p className="font-body text-xs md:text-sm uppercase font-bold tracking-[0.15em] text-primary mb-4">
              {lang === "fr" ? "Avis Google récents" : "Recent Google reviews"}
            </p>
            <h2 className="font-heading font-normal text-3xl md:text-4xl text-foreground mb-3">
              {lang === "fr" ? "Avis publics des locataires" : "Public reviews from our tenants"}
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

          <div className="text-center mt-10">
            <a
              href={allReviewsLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={lang === "fr" ? "Voir tous les avis sur Google" : "See all reviews on Google"}
              className="inline-block font-body font-bold uppercase tracking-[0.10em] text-sm px-8 py-3.5 rounded-md border bg-transparent transition-colors hover:text-foreground"
              style={{ borderColor: "#D9C7A1", color: "#B89B6F" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#D9C7A1";
                e.currentTarget.style.color = "#2B2B2B";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#B89B6F";
              }}
            >
              {lang === "fr" ? "Voir tous les avis sur Google" : "See all reviews on Google"}
            </a>
          </div>
        </div>
      </section>

      {/* ─── Section 4 — Video placeholders ──────────── */}
      <section className="bg-background py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-8">
            <p className="font-body text-xs md:text-sm uppercase font-bold tracking-[0.15em] text-primary mb-3">
              {lang === "fr" ? "Bientôt en vidéo" : "Coming soon in video"}
            </p>
            <h2 className="font-heading font-normal text-3xl md:text-4xl text-foreground">
              {lang === "fr" ? "Témoignages en images" : "Testimonials in pictures"}
            </h2>
          </div>
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
                  <p className="font-body text-sm uppercase tracking-[0.15em] font-bold">
                    {lang === "fr" ? "Disponible prochainement" : "Available soon"}
                  </p>
                  <p className="text-xs text-background/80 mt-2">{v.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 5 — Final CTA (sage) ────────────── */}
      <section className="py-20 md:py-24 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <p className="font-body text-xs md:text-sm uppercase font-bold tracking-[0.15em] text-background mb-6">
            {lang === "fr" ? "Rejoindre le réseau" : "Join the network"}
          </p>
          <h2 className="font-heading font-normal text-3xl md:text-4xl lg:text-5xl text-background mb-10 text-balance leading-[1.2]">
            {lang === "fr"
              ? "Et si vous étiez le prochain locataire ?"
              : "What if you were the next tenant?"}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 border-0 font-body font-bold uppercase tracking-[0.1em]"
            >
              <Link to={localePath(lang, "projects")}>
                {lang === "fr" ? "Visiter un cabinet" : "Visit an office"}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent hover:bg-background/10 border-background text-background hover:text-background font-body font-bold uppercase tracking-[0.1em]"
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