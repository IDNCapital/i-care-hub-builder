import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { Analytics } from "@/lib/analytics";
import {
  ArrowRight,
  Shield,
  Building2,
  Headphones,
  Search,
  MapPin,
  HardHat,
  Key,
  Quote,
  Star,
  CheckCircle2,
} from "lucide-react";
import { getDefaultHero } from "@/lib/projectImages";
import { FadeImage } from "@/components/FadeImage";

export default function Professionnels() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const pillars = [
    {
      icon: Shield,
      title: t("professionals.pillars.security"),
      description: t("professionals.pillars.securityDesc"),
      features: [t("professionals.pillars.securityF1"), t("professionals.pillars.securityF2"), t("professionals.pillars.securityF3")],
    },
    {
      icon: Building2,
      title: t("professionals.pillars.comfort"),
      description: t("professionals.pillars.comfortDesc"),
      features: [t("professionals.pillars.comfortF1"), t("professionals.pillars.comfortF2"), t("professionals.pillars.comfortF3")],
    },
    {
      icon: Headphones,
      title: t("professionals.pillars.support"),
      description: t("professionals.pillars.supportDesc"),
      features: [t("professionals.pillars.supportF1"), t("professionals.pillars.supportF2"), t("professionals.pillars.supportF3")],
    },
  ];

  const processSteps = [
    { icon: Search, number: "01", title: t("professionals.steps.analysis"), description: t("professionals.steps.analysisDesc") },
    { icon: MapPin, number: "02", title: t("professionals.steps.proposal"), description: t("professionals.steps.proposalDesc") },
    { icon: HardHat, number: "03", title: t("professionals.steps.fitout"), description: t("professionals.steps.fitoutDesc") },
    { icon: Key, number: "04", title: t("professionals.steps.install"), description: t("professionals.steps.installDesc") },
  ];


  const professionOptions = [
    "medecin_generaliste", "medecin_specialiste", "infirmier", "kinesitherapeute",
    "osteopathe", "psychologue", "orthophoniste", "sage_femme", "dentiste", "autre",
  ];

  const dateOptions = ["immediat", "3mois", "6mois", "1an", "plus"];

  const [formData, setFormData] = useState({ profession: "", ville: "", dateInstallation: "", surface: "", message: "" });
  const [rgpdConsent, setRgpdConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rgpdConsent) { toast.error(t("professionals.formErrorConsent")); return; }
    if (!formData.profession || !formData.ville) { toast.error(t("professionals.formErrorRequired")); return; }
    setIsSubmitting(true);
    Analytics.formSubmission("candidature_professionnel", `/${lang}/professionnels`);
    setTimeout(() => {
      toast.success(t("professionals.formSuccess"));
      setFormData({ profession: "", ville: "", dateInstallation: "", surface: "", message: "" });
      setRgpdConsent(false);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <Layout>
      <Helmet>
        <title>{t("seo.professionalsTitle")}</title>
        <meta name="description" content={t("seo.professionalsDesc")} />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center pt-20">
        <div className="absolute inset-0">
          <FadeImage src={getDefaultHero("professionnels")} alt={lang === "fr" ? "Cabinet – I-CA.RE Pey Berland" : "Consultation room – I-CA.RE Pey Berland"} className="w-full h-full object-cover" loading="eager" fadeDuration={500} />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/30" />
        </div>
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-primary/15 text-primary text-xs font-bold uppercase tracking-[0.1em] rounded-full mb-6 opacity-0 animate-fade-up">
              {t("professionals.heroTag")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6 opacity-0 animate-fade-up stagger-1">
              {t("professionals.heroTitle")}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10 opacity-0 animate-fade-up stagger-2">
              {t("professionals.heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up stagger-3">
              <Button variant="hero" asChild>
                <Link to={localePath(lang, "projects")}>
                  {t("professionals.ctaAvailability")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <a href="#candidature">{t("professionals.ctaExchange")}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer instead of unvalidated social proof */}

      {/* 3 Pillars */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">{t("professionals.whyTitle")}</h2>
            <p className="section-subtitle mx-auto">{t("professionals.whySubtitle")}</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="card-premium group hover:shadow-elevated transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <pillar.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-4">{pillar.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{pillar.description}</p>
                <ul className="space-y-3">
                  {pillar.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="section-padding bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">{t("professionals.processTitle")}</h2>
            <p className="section-subtitle mx-auto">{t("professionals.processSubtitle")}</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6 relative">
              <div className="hidden md:block absolute top-[52px] left-[12.5%] right-[12.5%] h-0.5 bg-border" />
              {processSteps.map((step) => (
                <div key={step.number} className="relative text-center">
                  <div className="w-24 h-24 rounded-full bg-card border-2 border-primary flex flex-col items-center justify-center mx-auto mb-6 relative z-10">
                    <step.icon className="w-8 h-8 text-primary mb-1" />
                    <span className="text-xs font-bold text-primary">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Form */}
      <section id="candidature" className="section-padding bg-foreground">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4 text-background">{t("professionals.formTitle")}</h2>
              <p className="text-background/70 text-lg">{t("professionals.formSubtitle")}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="profession" className="text-background">{t("professionals.formProfession")} *</Label>
                <select id="profession" value={formData.profession} onChange={(e) => setFormData({ ...formData, profession: e.target.value })} className="w-full h-12 px-4 rounded-lg border border-background/20 bg-background/10 text-background text-sm" required>
                  <option value="">{t("professionals.formProfessionPlaceholder")}</option>
                  {professionOptions.map((key) => (
                    <option key={key} value={key}>{t(`professionals.professionOptions.${key}`)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ville" className="text-background">{t("professionals.formCity")} *</Label>
                <Input id="ville" value={formData.ville} onChange={(e) => setFormData({ ...formData, ville: e.target.value })} placeholder={t("professionals.formCityPlaceholder")} className="h-12 bg-background/10 border-background/20 text-background placeholder:text-background/40 rounded-lg" required maxLength={100} />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dateInstallation" className="text-background">{t("professionals.formDate")}</Label>
                  <select id="dateInstallation" value={formData.dateInstallation} onChange={(e) => setFormData({ ...formData, dateInstallation: e.target.value })} className="w-full h-12 px-4 rounded-lg border border-background/20 bg-background/10 text-background text-sm">
                    <option value="">{t("professionals.formDatePlaceholder")}</option>
                    {dateOptions.map((key) => (
                      <option key={key} value={key}>{t(`professionals.dateOptions.${key}`)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surface" className="text-background">{t("professionals.formSurface")}</Label>
                  <select id="surface" value={formData.surface} onChange={(e) => setFormData({ ...formData, surface: e.target.value })} className="w-full h-12 px-4 rounded-lg border border-background/20 bg-background/10 text-background text-sm">
                    <option value="">{t("professionals.formSurfacePlaceholder")}</option>
                    <option value="15-20">15 – 20 {lang === "fr" ? "m²" : "sqm"}</option>
                    <option value="20-30">20 – 30 {lang === "fr" ? "m²" : "sqm"}</option>
                    <option value="30-50">30 – 50 {lang === "fr" ? "m²" : "sqm"}</option>
                    <option value="50-80">50 – 80 {lang === "fr" ? "m²" : "sqm"}</option>
                    <option value="80+">{lang === "fr" ? "Plus de 80 m²" : "Over 80 sqm"}</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-background">{t("professionals.formMessage")}</Label>
                <Textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder={t("professionals.formMessagePlaceholder")} rows={4} className="bg-background/10 border-background/20 text-background placeholder:text-background/40 rounded-lg" maxLength={1000} />
              </div>
              <div className="flex items-start gap-3">
                <Checkbox id="rgpd" checked={rgpdConsent} onCheckedChange={(checked) => setRgpdConsent(checked === true)} className="mt-1 border-background/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                <Label htmlFor="rgpd" className="text-background/70 text-sm leading-relaxed cursor-pointer">
                  {t("professionals.formRgpd")}{" "}
                  <Link to={localePath(lang, "privacy")} className="underline hover:text-background">{t("professionals.formRgpdLink")}</Link>. *
                </Label>
              </div>
              <Button type="submit" variant="hero" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-sm" disabled={isSubmitting}>
                {isSubmitting ? t("professionals.formSubmitting") : t("professionals.formSubmit")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-background/50 text-xs text-center">{t("professionals.formDisclaimer")}</p>
            </form>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">{t("professionals.bottomCtaTitle")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{t("professionals.bottomCtaDesc")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <Link to={localePath(lang, "projects")}>
                  {t("professionals.ctaAvailability")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to={localePath(lang, "contact")}>{t("common.contactUs")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}