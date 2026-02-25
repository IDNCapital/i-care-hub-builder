import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import {
  Building2,
  Heart,
  MapPin,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Accessibility,
  Home,
  BadgeEuro,
} from "lucide-react";
import { getDefaultHero, SECTION_IMAGES } from "@/lib/projectImages";

export default function Index() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const services = [
    { icon: Building2, title: t("services.acquisition"), description: t("services.acquisitionDesc") },
    { icon: Users, title: t("services.design"), description: t("services.designDesc") },
    { icon: Home, title: t("services.turnkey"), description: t("services.turnkeyDesc") },
    { icon: Sparkles, title: t("services.management"), description: t("services.managementDesc") },
  ];

  const benefits = [
    { icon: Building2, title: t("benefits.optimised"), description: t("benefits.optimisedDesc") },
    { icon: Accessibility, title: t("benefits.accessibility"), description: t("benefits.accessibilityDesc") },
    { icon: MapPin, title: t("benefits.proximity"), description: t("benefits.proximityDesc") },
    { icon: BadgeEuro, title: t("benefits.rents"), description: t("benefits.rentsDesc") },
  ];

  const impacts = [
    { value: "87%", label: t("impacts.deserts") },
    { value: "6M", label: t("impacts.noDoctor") },
    { value: "+30%", label: t("impacts.retirement") },
  ];

  return (
    <Layout>
      <Helmet>
        <title>{t("seo.homeTitle")}</title>
        <meta name="description" content={t("seo.homeDesc")} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0">
          <img src={getDefaultHero("home")} alt={lang === "fr" ? "Salle d'attente – I-CA.RE Pey Berland" : "Waiting room – I-CA.RE Pey Berland"} className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/30" />
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight mb-6 opacity-0 animate-fade-up">
              {t("home.heroTitle")}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-4 opacity-0 animate-fade-up stagger-1">
              {t("home.heroSubtitle")}
            </p>
            <p className="text-base text-muted-foreground/70 font-heading italic mb-10 opacity-0 animate-fade-up stagger-2">
              Des lieux de soin, pensés comme des lieux de vie
            </p>
            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up stagger-3">
              <Button variant="hero" asChild>
                <Link to={localePath(lang, "professionals")}>
                  {t("home.ctaProfessionals")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to={localePath(lang, "approach")}>
                  {t("home.ctaApproach")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title">{t("home.whatWeDo")}</h2>
            <p className="section-subtitle mx-auto">{t("home.whatWeDoSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={service.title} className="card-premium opacity-0 animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-5">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose I-CA.RE */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-title mb-6">{t("home.whyChoose")}</h2>
              <p className="text-lg text-muted-foreground mb-8">{t("home.whyChooseDesc")}</p>
              <div className="grid sm:grid-cols-2 gap-6">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="w-11 h-11 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold font-heading mb-1 text-sm">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-8" asChild>
                <Link to={localePath(lang, "professionals")}>
                  {t("home.allBenefits")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img src={SECTION_IMAGES.homeWhyChoose} alt={lang === "fr" ? "Cabinet – I-CA.RE Pey Berland" : "Office – I-CA.RE Pey Berland"} className="rounded-xl shadow-card w-full" loading="lazy" />
              <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">7–10</p>
                    <p className="text-xs text-muted-foreground">{t("home.officesPerAsset")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding bg-foreground">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold mb-4 text-background">
                {t("home.ourOperations")}
              </h2>
              <p className="text-background/60 text-lg max-w-xl">{t("home.ourOperationsDesc")}</p>
            </div>
            <Button variant="outline" className="mt-6 md:mt-0 border-background/20 text-background hover:bg-background hover:text-foreground" asChild>
              <Link to={localePath(lang, "projects")}>{t("home.viewAllProjects")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Societal Impact */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img src={SECTION_IMAGES.homeImpact} alt={lang === "fr" ? "Cabinet – I-CA.RE Nansouty" : "Office – I-CA.RE Nansouty"} className="rounded-xl shadow-card w-full" loading="lazy" />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="section-title mb-6">{t("home.localImpact")}</h2>
              <p className="text-lg text-muted-foreground mb-8">{t("home.localImpactDesc")}</p>
              <div className="grid grid-cols-3 gap-6 mb-8">
                {impacts.map((impact) => (
                  <div key={impact.label} className="text-center">
                    <p className="text-2xl md:text-3xl font-heading font-bold text-primary mb-2">{impact.value}</p>
                    <p className="text-xs text-muted-foreground">{impact.label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {[t("impactActions.requalification"), t("impactActions.heritage"), t("impactActions.territorial")].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Button className="mt-8" asChild>
                <Link to={localePath(lang, "approach")}>
                  {t("home.ctaApproach")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">{t("home.readyToJoin")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">{t("home.readyToJoinDesc")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <Link to={`${localePath(lang, "professionals")}#candidature`}>
                  {t("home.applyNow")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to={localePath(lang, "contact")}>{t("home.contactUs")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}