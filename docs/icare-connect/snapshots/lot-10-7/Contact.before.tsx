import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  Building2,
  Users,
  Briefcase,
  Loader2,
} from "lucide-react";
import { InlineBrand } from "@/components/BrandName";
import { LinkedInLink } from "@/components/LinkedInLink";

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
  };
}

export default function Contact() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const contactTypes = [
    { id: "professionnel", backendType: "praticien", icon: Users, title: t("contact.types.professionnel"), description: t("contact.types.professionnelDesc") },
    { id: "collectivite", backendType: "collectivite", icon: Building2, title: t("contact.types.collectivite"), description: t("contact.types.collectiviteDesc") },
    { id: "investisseur", backendType: "investisseur", icon: Briefcase, title: t("contact.types.investisseur"), description: t("contact.types.investisseurDesc") },
  ];

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nom: "", email: "", telephone: "", organisation: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [rgpdConsent, setRgpdConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    if (!selectedType) { toast.error(t("contact.selectType")); return; }
    if (!formData.nom.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error(t("contact.errorRequired")); return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) { toast.error(t("contact.errorEmail")); return; }
    if (!rgpdConsent) { toast.error(t("contact.errorConsent")); return; }

    const selectedConfig = contactTypes.find((ct) => ct.id === selectedType);
    const backendType = selectedConfig?.backendType || "contact_general";

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-contact-lead", {
        body: {
          type: backendType,
          full_name: formData.nom,
          email: formData.email,
          phone: formData.telephone || null,
          organization: formData.organisation || null,
          message: formData.message,
          language: lang,
          source_url: window.location.href,
          honeypot,
          ...getUtmParams(),
        },
      });
      if (error) throw error;
      if (data?.error === "rate_limited") { toast.error(t("contact.errorRateLimit")); return; }
      if (data?.error) throw new Error(data.error);

      toast.success(t("contact.success"));
      setFormData({ nom: "", email: "", telephone: "", organisation: "", message: "" });
      setSelectedType(null);
      setRgpdConsent(false);
    } catch (err) {
      console.error("Contact form error:", err);
      toast.error(t("contact.errorGeneric"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const orgLabel = selectedType === "collectivite"
    ? t("contact.organisationCollectivite")
    : selectedType === "investisseur"
    ? t("contact.organisationInvestisseur")
    : t("contact.organisation");

  return (
    <Layout>
      <SeoHead
        title={t("seo.contactTitle")}
        description={t("seo.contactDesc")}
        path={lang === "fr" ? "/contact" : "/en/contact"}
      />

      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-up">{t("contact.title")}</h1>
            <p className="text-xl text-muted-foreground opacity-0 animate-fade-up stagger-1">{t("contact.subtitle")}</p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="flex items-start gap-4 p-6 bg-secondary rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t("contact.address")}</h3>
                <p className="text-muted-foreground">Bordeaux, France</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-secondary rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t("contact.email")}</h3>
                <a href="mailto:contact@i-ca.re" className="text-muted-foreground hover:text-foreground transition-colors">contact@i-ca.re</a>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-secondary rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{t("contact.phone")}</h3>
                <a href="tel:+33649808097" className="text-muted-foreground hover:text-foreground transition-colors">06 49 80 80 97</a>
                <div className="mt-3">
                  <LinkedInLink showLabel className="-ml-2" />
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="section-title mb-4">{t("contact.sendMessage")}</h2>
              <p className="text-muted-foreground">{t("contact.sendMessageDesc")}</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {contactTypes.map((type) => (
                <button key={type.id} onClick={() => setSelectedType(type.id)} className={`p-6 rounded-2xl border-2 transition-all text-left ${selectedType === type.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
                  <type.icon className={`w-8 h-8 mb-4 ${selectedType === type.id ? "text-primary" : "text-muted-foreground"}`} />
                  <h3 className="font-semibold mb-1">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <input type="text" name="company_url" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nom">{t("contact.fullName")} *</Label>
                  <Input id="nom" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} required maxLength={200} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("contact.email")} *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required maxLength={255} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="telephone">{t("contact.phone")}</Label>
                  <Input id="telephone" type="tel" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} maxLength={30} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organisation">{orgLabel}</Label>
                  <Input id="organisation" value={formData.organisation} onChange={(e) => setFormData({ ...formData, organisation: e.target.value })} maxLength={200} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">{t("contact.message")} *</Label>
                <Textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder={t("contact.messagePlaceholder")} rows={6} required maxLength={5000} />
              </div>

              <div className="flex items-start gap-3">
                <Checkbox id="rgpd-contact" checked={rgpdConsent} onCheckedChange={(checked) => setRgpdConsent(checked === true)} className="mt-1" />
                <Label htmlFor="rgpd-contact" className="text-sm leading-relaxed cursor-pointer text-muted-foreground">
                  <InlineBrand>{t("contact.rgpd")}</InlineBrand>{" "}
                  <Link to={localePath(lang, "privacy")} className="text-primary underline underline-offset-4 hover:text-primary/80">{t("contact.rgpdLink")}</Link>. *
                </Label>
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" />{t("contact.submitting")}</>
                ) : (
                  <>{t("contact.submit")}<ArrowRight className="ml-2 h-5 w-5" /></>
                )}
              </Button>
              <p className="text-muted-foreground text-xs text-center">{t("contact.recontact")}</p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
