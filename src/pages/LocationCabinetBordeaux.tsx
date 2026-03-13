import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { FadeImage } from "@/components/FadeImage";
import { getDefaultHero, PROJECT_IMAGES } from "@/lib/projectImages";
import { STATIC_CENTRES } from "@/lib/centres";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  MapPin,
  TreePine,
  Volume2,
} from "lucide-react";

export default function LocationCabinetBordeaux() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const centresWithImages = STATIC_CENTRES.filter((c) => c.slug && PROJECT_IMAGES[c.slug]);

  const whyBlocks = [
    {
      icon: Volume2,
      title: t("locationBordeaux.why.spaces"),
      desc: t("locationBordeaux.why.spacesDesc"),
    },
    {
      icon: MapPin,
      title: t("locationBordeaux.why.neighbourhoods"),
      desc: t("locationBordeaux.why.neighbourhoodsDesc"),
    },
    {
      icon: TreePine,
      title: t("locationBordeaux.why.atmosphere"),
      desc: t("locationBordeaux.why.atmosphereDesc"),
    },
  ];

  const faqItems = [
    { q: t("locationBordeaux.faq.q1"), a: t("locationBordeaux.faq.a1") },
    { q: t("locationBordeaux.faq.q2"), a: t("locationBordeaux.faq.a2") },
    { q: t("locationBordeaux.faq.q3"), a: t("locationBordeaux.faq.a3") },
    { q: t("locationBordeaux.faq.q4"), a: t("locationBordeaux.faq.a4") },
  ];

  const statusLabel = (status: string) => {
    if (status === "available") return t("projects.statusAvailable");
    if (status === "full") return t("projects.statusFull");
    return t("projects.statusComingSoon");
  };

  return (
    <Layout>
      <SeoHead
        title={t("seo.locationBordeauxTitle")}
        description={t("seo.locationBordeauxDesc")}
        path={lang === "fr" ? "/location-cabinet-bordeaux" : "/en/office-rental-bordeaux"}
      />

      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex items-center pt-20">
        <div className="absolute inset-0">
          <FadeImage
            src={getDefaultHero("professionnels")}
            alt={t("locationBordeaux.heroImageAlt")}
            className="w-full h-full object-cover"
            loading="eager"
            fadeDuration={500}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/30" />
        </div>
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-primary/15 text-primary text-xs font-bold uppercase tracking-[0.1em] rounded-full mb-6">
              {t("locationBordeaux.heroTag")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
              {t("locationBordeaux.h1")}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10">
              {t("locationBordeaux.heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" asChild>
                <Link to={localePath(lang, "projects")}>
                  {t("locationBordeaux.ctaProjects")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to={localePath(lang, "contact")}>
                  {t("common.contactUs")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 1 — Introduction ── */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title">{t("locationBordeaux.introTitle")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {t("locationBordeaux.introP1")}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {t("locationBordeaux.introP2")}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("locationBordeaux.introP3")}
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 — Nos cabinets ── */}
      <section className="section-padding bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">{t("locationBordeaux.centresTitle")}</h2>
            <p className="section-subtitle mx-auto">{t("locationBordeaux.centresSubtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {STATIC_CENTRES.map((centre) => {
              const images = centre.slug ? PROJECT_IMAGES[centre.slug] : null;
              const heroImg = images?.hero;
              return (
                <div key={centre.id} className="card-premium group hover:shadow-elevated transition-all duration-300 overflow-hidden">
                  {heroImg ? (
                    <Link to={localePath(lang, "projects", centre.slug)}>
                      <FadeImage
                        src={heroImg}
                        alt={`Cabinet I-CA.RE ${centre.name}`}
                        className="w-full h-48 object-cover"
                        fadeDuration={400}
                      />
                    </Link>
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-heading font-semibold">{centre.name}</h3>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        centre.status === "available"
                          ? "bg-primary/15 text-primary"
                          : centre.status === "full"
                            ? "bg-muted-foreground/15 text-muted-foreground"
                            : "bg-accent/50 text-accent-foreground"
                      }`}>
                        {statusLabel(centre.status)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{centre.address}</p>
                    {centre.slug && (
                      <Link
                        to={localePath(lang, "projects", centre.slug)}
                        className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {centre.status === "available"
                          ? t("projects.viewSpace")
                          : centre.status === "full"
                            ? t("projects.discoverSpace")
                            : t("projects.discoverProject")}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 3 — Pourquoi rejoindre ── */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">{t("locationBordeaux.whyTitle")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {whyBlocks.map((b) => (
              <div key={b.title} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-5">
                  <b.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-3">{b.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4 — Exemples avec photos ── */}
      <section className="section-padding bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">{t("locationBordeaux.examplesTitle")}</h2>
            <p className="section-subtitle mx-auto">{t("locationBordeaux.examplesSubtitle")}</p>
          </div>
          <div className="space-y-16">
            {centresWithImages.map((centre) => {
              const images = PROJECT_IMAGES[centre.slug!];
              return (
                <div key={centre.id}>
                  <h3 className="text-xl font-heading font-semibold mb-6 text-center">
                    I-CA.RE {centre.name}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.gallery.slice(0, 4).map((img, i) => (
                      <FadeImage
                        key={i}
                        src={img}
                        alt={`Cabinet I-CA.RE ${centre.name} – photo ${i + 1}`}
                        className="w-full h-40 md:h-52 object-cover rounded-lg"
                        fadeDuration={400}
                      />
                    ))}
                  </div>
                  <div className="text-center mt-4">
                    <Link
                      to={localePath(lang, "projects", centre.slug)}
                      className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {t("locationBordeaux.seeDetails")}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — FAQ ── */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center">{t("locationBordeaux.faqTitle")}</h2>
            <Accordion type="single" collapsible className="mt-10">
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-base font-medium">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ── SECTION 6 — CTA final ── */}
      <section className="section-padding bg-foreground">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4 text-background">
              {t("locationBordeaux.ctaTitle")}
            </h2>
            <p className="text-background/70 text-lg mb-8">
              {t("locationBordeaux.ctaDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <Link to={localePath(lang, "contact")}>
                  {t("home.applyNow")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="hero-outline"
                className="border-background/30 text-background hover:bg-background/10"
                asChild
              >
                <Link to={localePath(lang, "projects")}>
                  {t("locationBordeaux.ctaProjects")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
