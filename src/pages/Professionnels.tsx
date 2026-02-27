import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight,
  Shield,
  Building2,
  Headphones,
  Search,
  MapPin,
  HardHat,
  Key,
  CheckCircle2,
  Loader2,
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
  const cabinetCountOptions = ["1", "2", "3", "4+", "custom"];

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", organisation: "", website: "",
    profession: "", ville: "", neighbourhood: "", dateInstallation: "", cabinetCount: "", cabinetConfig: "", message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [rgpdConsent, setRgpdConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showCabinetConfig = formData.cabinetCount === "4+" || formData.cabinetCount === "custom";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    if (!rgpdConsent) { toast.error(t("professionals.formErrorConsent")); return; }
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.profession || !formData.ville.trim() || !formData.cabinetCount) {
      toast.error(t("professionals.formErrorRequired")); return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) { toast.error(t("professionals.formErrorEmail")); return; }
    const phoneRegex = /^[+\d\s.\-()]{6,30}$/;
    if (!phoneRegex.test(formData.phone.trim())) { toast.error(t("professionals.formErrorPhone")); return; }

    setIsSubmitting(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const { data, error } = await supabase.functions.invoke("send-contact-lead", {
        body: {
          type: "cabinet_request",
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          organization: formData.organisation || null,
          city: formData.ville,
          message: formData.message || t("professionals.formSubmit"),
          language: lang,
          source_url: window.location.href,
          honeypot,
          utm_source: params.get("utm_source") || undefined,
          utm_medium: params.get("utm_medium") || undefined,
          utm_campaign: params.get("utm_campaign") || undefined,
          extra_data: {
            profession: formData.profession,
            neighbourhood: formData.neighbourhood || null,
            move_in_date: formData.dateInstallation || null,
            cabinet_count: formData.cabinetCount || null,
            cabinet_config: formData.cabinetConfig || null,
            website: formData.website || null,
            organisation: formData.organisation || null,
          },
        },
      });
      if (error) throw error;
      if (data?.error === "rate_limited") { toast.error(t("professionals.formErrorRateLimit")); return; }
      if (data?.error) throw new Error(data.error);

      toast.success(t("professionals.formSuccess"));
      setFormData({ firstName: "", lastName: "", email: "", phone: "", organisation: "", website: "", profession: "", ville: "", neighbourhood: "", dateInstallation: "", cabinetCount: "", cabinetConfig: "", message: "" });
      setRgpdConsent(false);
    } catch (err) {
      console.error("Form submission error:", err);
      toast.error(t("professionals.formErrorGeneric"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dark section select classes
  const darkSelectTrigger = "h-12 bg-[#1F1F1F] border-white/15 text-[#F6F5F0] data-[placeholder]:text-[#F6F5F0]/45 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/25";
  const darkSelectContent = "bg-[#1F1F1F] border-white/15 rounded-lg shadow-elevated";

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

      {/* Contextual link to location page */}
      <section className="py-6">
        <div className="container">
          <p className="text-center text-muted-foreground">
            {lang === "fr"
              ? <>Vous cherchez un <Link to={localePath(lang, "locationBordeaux")} className="text-primary underline underline-offset-4 hover:text-primary/80">cabinet paramédical à louer à Bordeaux</Link> ? Découvrez nos espaces disponibles.</>
              : <>Looking for a <Link to={localePath(lang, "locationBordeaux")} className="text-primary underline underline-offset-4 hover:text-primary/80">professional office to rent in Bordeaux</Link>? Discover our available spaces.</>
            }
          </p>
        </div>
      </section>

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
            <form onSubmit={handleSubmit} className="space-y-6 form-dark-section">
              {/* Honeypot */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <input type="text" name="website_url_confirm" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>

              {/* Identity fields */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[#F6F5F0]">{t("professionals.formFirstName")} *</Label>
                  <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="h-12" required maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[#F6F5F0]">{t("professionals.formLastName")} *</Label>
                  <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="h-12" required maxLength={100} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#F6F5F0]">{t("professionals.formEmail")} *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-12" required maxLength={255} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#F6F5F0]">{t("professionals.formPhone")} *</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="06 49 80 80 97" className="h-12" required maxLength={30} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="organisation" className="text-[#F6F5F0]">{t("professionals.formOrganisation")}</Label>
                  <Input id="organisation" value={formData.organisation} onChange={(e) => setFormData({ ...formData, organisation: e.target.value })} className="h-12" maxLength={200} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-[#F6F5F0]">{t("professionals.formWebsite")}</Label>
                  <Input id="website" type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://" className="h-12" maxLength={300} />
                </div>
              </div>

              {/* Project fields */}
              <div className="space-y-2">
                <Label className="text-[#F6F5F0]">{t("professionals.formProfession")} *</Label>
                <Select value={formData.profession} onValueChange={(v) => setFormData({ ...formData, profession: v })}>
                  <SelectTrigger className={darkSelectTrigger}>
                    <SelectValue placeholder={t("professionals.formProfessionPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent className={darkSelectContent}>
                    {professionOptions.map((key) => (
                      <SelectItem key={key} value={key} className="text-[#F6F5F0] focus:bg-primary/15 data-[state=checked]:bg-primary data-[state=checked]:text-[#1F1F1F]">
                        {t(`professionals.professionOptions.${key}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ville" className="text-[#F6F5F0]">{t("professionals.formCity")} *</Label>
                  <Input id="ville" value={formData.ville} onChange={(e) => setFormData({ ...formData, ville: e.target.value })} placeholder={t("professionals.formCityPlaceholder")} className="h-12" required maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neighbourhood" className="text-[#F6F5F0]">{t("professionals.formNeighbourhood")}</Label>
                  <Input id="neighbourhood" value={formData.neighbourhood} onChange={(e) => setFormData({ ...formData, neighbourhood: e.target.value })} placeholder={t("professionals.formNeighbourhoodPlaceholder")} className="h-12" maxLength={200} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[#F6F5F0]">{t("professionals.formDate")}</Label>
                  <Select value={formData.dateInstallation} onValueChange={(v) => setFormData({ ...formData, dateInstallation: v })}>
                    <SelectTrigger className={darkSelectTrigger}>
                      <SelectValue placeholder={t("professionals.formDatePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent className={darkSelectContent}>
                      {dateOptions.map((key) => (
                        <SelectItem key={key} value={key} className="text-[#F6F5F0] focus:bg-primary/15 data-[state=checked]:bg-primary data-[state=checked]:text-[#1F1F1F]">
                          {t(`professionals.dateOptions.${key}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#F6F5F0]">{t("professionals.formCabinetCount")} *</Label>
                  <Select value={formData.cabinetCount} onValueChange={(v) => setFormData({ ...formData, cabinetCount: v, cabinetConfig: v !== "4+" && v !== "custom" ? "" : formData.cabinetConfig })}>
                    <SelectTrigger className={darkSelectTrigger}>
                      <SelectValue placeholder={t("professionals.formCabinetCountPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent className={darkSelectContent}>
                      {cabinetCountOptions.map((key) => (
                        <SelectItem key={key} value={key} className="text-[#F6F5F0] focus:bg-primary/15 data-[state=checked]:bg-primary data-[state=checked]:text-[#1F1F1F]">
                          {t(`professionals.cabinetCountOptions.${key}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[#F6F5F0]/50 text-xs leading-relaxed mt-1.5">{t("professionals.formCabinetCountHint")}</p>
                </div>
              </div>

              {showCabinetConfig && (
                <div className="space-y-2">
                  <Label htmlFor="cabinetConfig" className="text-[#F6F5F0]">{t("professionals.formCabinetConfig")}</Label>
                  <Textarea id="cabinetConfig" value={formData.cabinetConfig} onChange={(e) => setFormData({ ...formData, cabinetConfig: e.target.value })} rows={3} maxLength={500} />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="message" className="text-[#F6F5F0]">{t("professionals.formMessage")}</Label>
                <Textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder={t("professionals.formMessagePlaceholder")} rows={4} maxLength={1000} />
              </div>

              <div className="flex items-start gap-3">
                <Checkbox id="rgpd" checked={rgpdConsent} onCheckedChange={(checked) => setRgpdConsent(checked === true)} className="mt-1 border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-[#1F1F1F]" />
                <Label htmlFor="rgpd" className="text-[#F6F5F0]/70 text-sm leading-relaxed cursor-pointer">
                  {t("professionals.formRgpd")}{" "}
                  <Link to={localePath(lang, "privacy")} className="underline hover:text-[#F6F5F0]">{t("professionals.formRgpdLink")}</Link>. *
                </Label>
              </div>

              <Button type="submit" variant="hero" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-sm transition-colors duration-200" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" />{t("professionals.formSubmitting")}</>
                ) : (
                  <>{t("professionals.formSubmit")}<ArrowRight className="ml-2 h-5 w-5" /></>
                )}
              </Button>
              <p className="text-[#F6F5F0]/70 text-xs text-center font-medium">{t("professionals.formRecontact")}</p>
              <p className="text-[#F6F5F0]/50 text-xs text-center">{t("professionals.formDisclaimer")}</p>
            </form>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">{t("professionals.bottomCtaTitle")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">{t("professionals.bottomCtaDesc")}</p>
            <p className="text-sm text-muted-foreground mb-8">
              <Link to={localePath(lang, "locationBordeaux")} className="text-primary underline underline-offset-4 hover:text-primary/80">
                {lang === "fr" ? "Voir les cabinets disponibles" : "View available offices"}
              </Link>
            </p>
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
