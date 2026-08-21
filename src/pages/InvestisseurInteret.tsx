import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { Analytics } from "@/lib/analytics";
import { FileText, ArrowLeft, Mail } from "lucide-react";
import { InlineBrand } from "@/components/BrandName";

const PROFILE_KEYS = ["family_office", "investisseur_prive", "cgp", "banque", "autre"] as const;
const TICKET_KEYS = ["<100k", "100-250k", "250-500k", "500k-1M", ">1M"] as const;

export default function InvestisseurInteret() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
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
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/send-investor-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            first_name: formData.firstName.trim().slice(0, 100),
            last_name: formData.lastName.trim().slice(0, 100),
            email: formData.email.trim().toLowerCase().slice(0, 255),
            phone: formData.phone.trim().slice(0, 30) || null,
            profile_type: formData.profileType,
            ticket_range: formData.ticketRange,
            area_interest: formData.areaInterest.trim().slice(0, 200) || null,
            message: formData.message.trim().slice(0, 2000) || null,
            locale: lang,
            source_page: `/${lang}/investissement`,
          }),
        }
      );

      const result = await res.json();

      if (result.status === "already_verified" && result.access_token) {
        // Already verified: store token and redirect
        localStorage.setItem("icare_investor_token", result.access_token);
        toast.success(t("interestForm.successExisting"));
        navigate(localePath(lang, "investmentMemo"));
        return;
      }

      if (result.status === "verification_sent" || result.status === "email_already_sent") {
        setEmailSent(true);
        Analytics.formSubmission("investor_interest", `/${lang}/investment/interest`);
      } else if (result.error) {
        throw new Error(result.error);
      }
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

  // Confirmation screen after form submission
  if (emailSent) {
    return (
      <Layout>
        <title>{lang === "en" ? "Check Your Email | I-CA.RE" : "Vérifiez vos emails | I-CA.RE"}</title>
        <meta name="robots" content="noindex, nofollow" />
        <section className="pt-32 pb-20">
          <div className="container">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold mb-4">
                {lang === "en" ? "Check your email" : "Vérifiez vos emails"}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                {lang === "en"
                  ? "A confirmation email has been sent to:"
                  : "Un email de confirmation vient d'être envoyé à :"}
              </p>
              <p className="text-lg font-semibold mb-8">{formData.email}</p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {lang === "en"
                  ? "Click the link in the email to access the investment memo. The link is valid for 24 hours."
                  : "Cliquez sur le lien dans l'email pour accéder à la note d'investissement. Le lien est valide pendant 24 heures."}
              </p>
              <p className="text-sm text-muted-foreground">
                {lang === "en"
                  ? "Didn't receive the email? Check your spam folder or"
                  : "Vous n'avez pas reçu l'email ? Vérifiez vos spams ou"}{" "}
                <button
                  onClick={() => setEmailSent(false)}
                  className="text-primary underline hover:no-underline"
                >
                  {lang === "en" ? "try again" : "réessayez"}
                </button>.
              </p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <title>{lang === "en" ? "Express Your Interest | I-CA.RE Investment" : "Manifester mon intérêt | Investissement I-CA.RE"}</title>
      <meta name="description" content={lang === "en"
        ? "Complete a short form to receive the I-CA.RE investment memo and access detailed financial model information."
        : "Remplissez un formulaire court pour recevoir la note d'investissement I-CA.RE et accéder aux informations détaillées de notre modèle financier."
      } />

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
                <InlineBrand>{t("interestForm.subtitle")}</InlineBrand>
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
                  <Label>{t("interestForm.profile")} *</Label>
                  <Select value={formData.profileType} onValueChange={(v) => updateField("profileType", v)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t("interestForm.selectProfile")} />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFILE_KEYS.map((key) => (
                        <SelectItem key={key} value={key}>{t(`interestForm.profileOptions.${key}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("interestForm.ticket")} *</Label>
                  <Select value={formData.ticketRange} onValueChange={(v) => updateField("ticketRange", v)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={t("interestForm.selectTicket")} />
                    </SelectTrigger>
                    <SelectContent>
                      {TICKET_KEYS.map((key) => (
                        <SelectItem key={key} value={key}>{t(`interestForm.ticketOptions.${key}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <InlineBrand>{t("interestForm.consent")}</InlineBrand>{" "}
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
