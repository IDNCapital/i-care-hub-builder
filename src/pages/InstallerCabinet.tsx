import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { ArrowRight, BookOpen } from "lucide-react";
import { FadeImage } from "@/components/FadeImage";
import { getDefaultHero } from "@/lib/projectImages";

const ARTICLES = [
  {
    routeKey: "blogTrouverCabinet",
    image: null as string | null, // will use hero
    titleFr: "Comment trouver un cabinet à Bordeaux quand on est praticien ?",
    titleEn: "How to find a practice office in Bordeaux as a practitioner?",
    excerptFr:
      "Psychologue, thérapeute, ostéopathe : découvrez les critères essentiels pour choisir un cabinet adapté à votre pratique à Bordeaux.",
    excerptEn:
      "Psychologist, therapist, osteopath: discover the key criteria for choosing a practice office suited to your needs in Bordeaux.",
  },
];

export default function InstallerCabinet() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const title =
    lang === "fr"
      ? "S'installer comme praticien : trouver un cabinet adapté à sa pratique"
      : "Setting up as a practitioner: find the right office for your practice";

  const metaDesc =
    lang === "fr"
      ? "Ressources et conseils I-CA.RE pour aider les praticiens du soin et du bien-être à trouver un cabinet adapté à leur pratique."
      : "I-CA.RE resources and advice to help care and wellbeing practitioners find the right office for their practice.";

  const heroImage = getDefaultHero("professionnels");

  return (
    <Layout>
      <SeoHead
        title={`${title} | I-CA.RE`}
        description={metaDesc}
        path={
          lang === "fr"
            ? "/installer-cabinet-praticien"
            : "/en/setting-up-practice"
        }
      />

      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center pt-20">
        <div className="absolute inset-0">
          <FadeImage
            src={heroImage}
            alt={title}
            className="w-full h-full object-cover"
            loading="eager"
            fadeDuration={500}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/30" />
        </div>
        <div className="container relative z-10 py-20">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-primary/15 text-primary text-xs font-bold uppercase tracking-[0.1em] rounded-full mb-6">
              {lang === "fr" ? "Ressources praticiens" : "Practitioner Resources"}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {lang === "fr"
                ? "I-CA.RE partage des ressources pour aider les praticiens du soin et du bien-être à trouver un cabinet adapté à leur pratique, partout en France."
                : "I-CA.RE shares resources to help care and wellbeing practitioners find the right office for their practice, across France."}
            </p>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="section-padding">
        <div className="container">
          <h2 className="section-title text-center mb-12">
            {lang === "fr" ? "Nos articles" : "Our articles"}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {ARTICLES.map((article) => {
              const articleTitle =
                lang === "fr" ? article.titleFr : article.titleEn;
              const excerpt =
                lang === "fr" ? article.excerptFr : article.excerptEn;
              const linkTo = localePath(lang, article.routeKey);

              return (
                <Link
                  key={article.routeKey}
                  to={linkTo}
                  className="group card-premium overflow-hidden transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 block"
                >
                  <div className="relative w-full h-48 overflow-hidden">
                    <FadeImage
                      src={heroImage}
                      alt={articleTitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-semibold text-foreground">
                        <BookOpen className="w-3.5 h-3.5" />
                        {lang === "fr" ? "Article" : "Article"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-heading font-semibold mb-3 group-hover:text-primary transition-colors leading-snug">
                      {articleTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                      {lang === "fr" ? "Lire l'article" : "Read the article"}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
              {lang === "fr"
                ? "Vous cherchez un cabinet adapté à votre pratique ?"
                : "Looking for an office that fits your practice?"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              {lang === "fr"
                ? "Échangeons sur votre projet d'installation. Nos équipes vous accompagnent pour trouver le lieu idéal."
                : "Let's discuss your project. Our team will help you find the ideal space."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <Link to={`${localePath(lang, "professionals")}#candidature`}>
                  {lang === "fr"
                    ? "Échanger sur mon projet"
                    : "Discuss my project"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to={localePath(lang, "locationBordeaux")}>
                  {lang === "fr"
                    ? "Cabinets à Bordeaux"
                    : "Offices in Bordeaux"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
