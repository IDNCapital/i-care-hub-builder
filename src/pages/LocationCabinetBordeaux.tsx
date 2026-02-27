import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { FadeImage } from "@/components/FadeImage";
import { getDefaultHero } from "@/lib/projectImages";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Volume2,
  Sun,
  Ruler,
  Shield,
  Users,
} from "lucide-react";

export default function LocationCabinetBordeaux() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const features = [
    {
      icon: Volume2,
      title: t("locationBordeaux.features.acoustic"),
      desc: t("locationBordeaux.features.acousticDesc"),
    },
    {
      icon: Sun,
      title: t("locationBordeaux.features.light"),
      desc: t("locationBordeaux.features.lightDesc"),
    },
    {
      icon: Ruler,
      title: t("locationBordeaux.features.surface"),
      desc: t("locationBordeaux.features.surfaceDesc"),
    },
    {
      icon: Shield,
      title: t("locationBordeaux.features.compliance"),
      desc: t("locationBordeaux.features.complianceDesc"),
    },
    {
      icon: MapPin,
      title: t("locationBordeaux.features.location"),
      desc: t("locationBordeaux.features.locationDesc"),
    },
    {
      icon: Users,
      title: t("locationBordeaux.features.community"),
      desc: t("locationBordeaux.features.communityDesc"),
    },
  ];

  const professions = [
    t("locationBordeaux.professions.psychologist"),
    t("locationBordeaux.professions.psychotherapist"),
    t("locationBordeaux.professions.sophrologist"),
    t("locationBordeaux.professions.osteopath"),
    t("locationBordeaux.professions.physio"),
    t("locationBordeaux.professions.speechTherapist"),
    t("locationBordeaux.professions.dietitian"),
    t("locationBordeaux.professions.midwife"),
    t("locationBordeaux.professions.other"),
  ];

  return (
    <Layout>
      <Helmet>
        <title>{t("seo.locationBordeauxTitle")}</title>
        <meta name="description" content={t("seo.locationBordeauxDesc")} />
        <link rel="canonical" href={`https://i-ca.re/${lang === "fr" ? "fr/location-cabinet-bordeaux" : "en/office-rental-bordeaux"}`} />
      </Helmet>

      {/* Hero */}
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

      {/* Intro */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title">{t("locationBordeaux.introTitle")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {t("locationBordeaux.introP1")}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("locationBordeaux.introP2")}
            </p>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="section-padding bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">{t("locationBordeaux.featuresTitle")}</h2>
            <p className="section-subtitle mx-auto">{t("locationBordeaux.featuresSubtitle")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="card-premium group hover:shadow-elevated transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For whom */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center">{t("locationBordeaux.forWhomTitle")}</h2>
            <p className="section-subtitle text-center mx-auto mb-10">{t("locationBordeaux.forWhomDesc")}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {professions.map((p) => (
                <span
                  key={p}
                  className="px-4 py-2 bg-primary/10 text-foreground text-sm font-medium rounded-full"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & practical */}
      <section className="section-padding bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title">{t("locationBordeaux.pricingTitle")}</h2>
            <div className="grid sm:grid-cols-3 gap-8 mt-12">
              <div>
                <p className="text-4xl font-heading font-bold text-primary">600–800 €</p>
                <p className="text-muted-foreground mt-2 text-sm">{t("locationBordeaux.pricingRent")}</p>
              </div>
              <div>
                <p className="text-4xl font-heading font-bold text-primary">11–15 m²</p>
                <p className="text-muted-foreground mt-2 text-sm">{t("locationBordeaux.pricingSurface")}</p>
              </div>
              <div>
                <p className="text-4xl font-heading font-bold text-primary">100%</p>
                <p className="text-muted-foreground mt-2 text-sm">{t("locationBordeaux.pricingTurnkey")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Approach link */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title">{t("locationBordeaux.approachTitle")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {t("locationBordeaux.approachDesc")}
            </p>
            <Button variant="outline" asChild>
              <Link to={localePath(lang, "approach")}>
                {t("locationBordeaux.ctaApproach")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
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
                <Link to={localePath(lang, "projects")}>
                  {t("locationBordeaux.ctaProjects")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" className="border-background/30 text-background hover:bg-background/10" asChild>
                <Link to={localePath(lang, "contact")}>
                  {t("common.contactUs")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
