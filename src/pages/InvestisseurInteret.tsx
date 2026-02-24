import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { supabase } from "@/integrations/supabase/client";
import { Analytics } from "@/lib/analytics";
import { FileText, ArrowLeft } from "lucide-react";

const PROFILE_KEYS = ["family_office", "investisseur_prive", "cgp", "banque", "autre"] as const;
const TICKET_KEYS = ["<100k", "100-250k", "250-500k", "500k-1M", ">1M"] as const;

export default function InvestisseurInteret() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profileType: "",
    ticketRange: "",
    areaInterest: "",
    message: "",
  });
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      toast.error(t("interestForm.errorConsent"));
      return;
    }
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.profileType || !formData.ticketRange) {
      toast.error(t("interestForm.errorRequired"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error(t("interestForm.errorEmail"));
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("investor_leads").insert({
        first_name: formData.firstName.trim().slice(0, 100),
        last_name: formData.lastName.trim().slice(0, 100),
        email: formData.email.trim().toLowerCase().slice(0, 255),
        phone: formData.phone.trim().slice(0, 30) || null,
        profile_type: formData.profileType,
        ticket_range: formData.ticketRange,
        area_interest: formData.areaInterest.trim().slice(0, 200) || null,
        message: formData.message.trim().slice(0, 2000) || null,
        consent: true,
        consent_at: new Date().toISOString(),
        source_page: `/${lang}/investment`,
      });

      if (error) {
        if (error.code === "23505") {
          toast.success(t("interestForm.successExisting"));
        } else {
          throw error;
        }
      } else {
        toast.success(t("interestForm.successNew"));
      }

      Analytics.formSubmission("investor_interest", `/${lang}/investment/interest`);
      sessionStorage.setItem("icare_investor_access", "granted");
      navigate(localePath(lang, "investmentMemo"));
    } catch (err) {
      console.error("Investor lead submission error:", err);
      toast.error(t("interestForm.errorGeneric"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      <Helmet>
        <title>{lang === "en" ? "Express Your Interest — I-CA.RE Investment" : "Manifester mon intérêt — Investissement I-CA.RE"}</title>
        <meta name="description" content={lang === "en"
          ? "Complete a short form to receive the I-CA.RE investment memo and access detailed financial model information."
          : "Remplissez un formulaire court pour recevoir la note d'investissement I-CA.RE et accéder aux informations détaillées de notre modèle financier."
        } />
      </Helmet>

      <section className="pt-32 pb-8">
        <div className="container">
          <Link
            to={localePath(lang, "investment")}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("interestForm.back")}
          </Link>
        </div>
      </section>

      <section className="pb-20">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                {t("interestForm.title")}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("interestForm.subtitle")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("interestForm.firstName")} *</Label>
                  <Input id="firstName" value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} required maxLength={100} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("interestForm.lastName")} *</Label>
                  <Input id="lastName" value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} required maxLength={100} className="h-12" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("interestForm.email")} *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} required maxLength={255} className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("interestForm.phone")} <span className="text-muted-foreground text-xs">{t("interestForm.phoneHint")}</span></Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} maxLength={30} className="h-12" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="profileType">{t("interestForm.profile")} *</Label>
                  <select id="profileType" value={formData.profileType} onChange={(e) => updateField("profileType", e.target.value)} required className="w-full h-12 px-4 rounded-lg border border-border bg-background text-sm">
                    <option value="">{t("interestForm.selectProfile")}</option>
                    {PROFILE_KEYS.map((key) => (
                      <option key={key} value={key}>{t(`interestForm.profileOptions.${key}`)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticketRange">{t("interestForm.ticket")} *</Label>
                  <select id="ticketRange" value={formData.ticketRange} onChange={(e) => updateField("ticketRange", e.target.value)} required className="w-full h-12 px-4 rounded-lg border border-border bg-background text-sm">
                    <option value="">{t("interestForm.selectTicket")}</option>
                    {TICKET_KEYS.map((key) => (
                      <option key={key} value={key}>{t(`interestForm.ticketOptions.${key}`)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="areaInterest">{t("interestForm.area")} <span className="text-muted-foreground text-xs">{t("interestForm.areaHint")}</span></Label>
                <Input id="areaInterest" value={formData.areaInterest} onChange={(e) => updateField("areaInterest", e.target.value)} placeholder={t("interestForm.areaPlaceholder")} maxLength={200} className="h-12" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">{t("interestForm.message")} <span className="text-muted-foreground text-xs">{t("interestForm.messageHint")}</span></Label>
                <Textarea id="message" value={formData.message} onChange={(e) => updateField("message", e.target.value)} placeholder={t("interestForm.messagePlaceholder")} maxLength={2000} rows={4} />
              </div>

              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox id="consent" checked={consent} onCheckedChange={(checked) => setConsent(checked === true)} className="mt-1" />
                  <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                    {t("interestForm.consent")}{" "}
                    <Link to={localePath(lang, "privacy")} className="text-primary underline" target="_blank">
                      {t("interestForm.privacyLink")}
                    </Link>. *
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{t("interestForm.rgpdNotice")}</p>
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t("interestForm.submitting") : t("interestForm.submit")}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
