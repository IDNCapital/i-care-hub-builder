import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
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
  Shield,
} from "lucide-react";
import { getDefaultHero, SECTION_IMAGES } from "@/lib/projectImages";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { TestimonialsSlider } from "@/components/TestimonialsSlider";
import { FadeImage } from "@/components/FadeImage";
import { InlineBrand } from "@/components/BrandName";

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
      <SeoHead
        title={t("seo.homeTitle")}
        description={t("seo.homeDesc")}
        path={lang === "fr" ? "/" : "/en/"}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <HeroSlideshow lang={lang} />

        <div className="container relative z-10 py-20">
          <div className="max-w-3xl bg-foreground/20 backdrop-blur-[2px] rounded-2xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-6 opacity-0 animate-fade-up">
              {t("home.heroTitle")}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-3 opacity-0 animate-fade-up stagger-1">
              {t("home.heroSubtitle")}
            </p>
            <p className="text-base text-white/60 mb-2 opacity-0 animate-fade-up stagger-1">
              {t("home.heroMicro")}
            </p>
            <p className="text-base text-white/60 font-heading italic mb-10 opacity-0 animate-fade-up stagger-2">
              Des lieux de soin, pensés comme des lieux de vie
            </p>
            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up stagger-3">
              <Button variant="hero" asChild>
                <Link to={localePath(lang, "professionals")}>
                  {t("home.ctaFindOffice")}
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

      {/* Practitioner Promise */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title">{t("homePromise.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {([
              { icon: Shield, title: t("homePromise.confidentiality"), desc: t("homePromise.confidentialityDesc") },
              { icon: Building2, title: t("homePromise.image"), desc: t("homePromise.imageDesc") },
              { icon: Users, title: t("homePromise.respect"), desc: t("homePromise.respectDesc") },
              { icon: Heart, title: t("homePromise.stability"), desc: t("homePromise.stabilityDesc") },
            ] as const).map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
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
              <div key={service.title} className="card-premium flex flex-col items-center text-center md:items-start md:text-left opacity-0 animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-5 mx-auto md:mx-0">
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
              <h2 className="section-title mb-6"><InlineBrand>{t("home.whyChoose")}</InlineBrand></h2>
              <p className="text-lg text-muted-foreground mb-8"><InlineBrand>{t("home.whyChooseDesc")}</InlineBrand></p>
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
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button asChild>
                  <Link to={localePath(lang, "professionals")}>
                    {t("home.allBenefits")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to={localePath(lang, "locationBordeaux")}>
                    {lang === "fr" ? "Voir les cabinets disponibles" : "View available offices"}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <FadeImage src={SECTION_IMAGES.homeWhyChoose} alt={lang === "fr" ? "Cabinet – I-CA.RE Pey Berland" : "Office – I-CA.RE Pey Berland"} className="rounded-xl shadow-card w-full aspect-[4/3] object-cover object-center" />
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

      {/* Testimonials */}
      <TestimonialsSlider />

      {/* Societal Impact */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <FadeImage src={SECTION_IMAGES.homeImpact} alt={lang === "fr" ? "Cabinet – I-CA.RE Nansouty" : "Office – I-CA.RE Nansouty"} className="rounded-xl shadow-card w-full aspect-[4/3] object-cover object-center" />
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
            <p className="text-muted-foreground max-w-2xl mx-auto mb-4">{t("home.readyToJoinDesc")}</p>
            <p className="text-sm text-muted-foreground mb-2">
              <Link to={localePath(lang, "locationBordeaux")} className="text-primary underline underline-offset-4 hover:text-primary/80">
                {lang === "fr" ? "Voir tous les cabinets à louer à Bordeaux" : "View all offices for rent in Bordeaux"}
              </Link>
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              <Link to={localePath(lang, "installerCabinet")} className="text-primary underline underline-offset-4 hover:text-primary/80">
                {lang === "fr" ? "Ressources pour s'installer comme praticien" : "Resources for setting up as a practitioner"}
              </Link>
            </p>
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