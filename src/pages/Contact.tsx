import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { supabase } from "@/integrations/supabase/client";
import { Analytics } from "@/lib/analytics";
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
import { ICARE_TELEPHONE_E164, ICARE_TELEPHONE_AFFICHAGE } from "@/lib/contact";

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
  };
}

type Recu = { etat: "pret" | "confirme" | "refuse" | "inconnu"; id?: string };
async function qualifierRecu(value: unknown): Promise<Recu> {
  if (!value || typeof value !== "object") return { etat: "inconnu" };
  const r = value as { data?: unknown; error?: unknown; response?: unknown };
  if (!(r.response instanceof Response) || r.response.headers.get("x-relay-error") === "true") return { etat: "inconnu" };
  const data = r.data && typeof r.data === "object" && !Array.isArray(r.data) ? r.data as Record<string, unknown> : null;
  if (r.response.status === 200 && r.error === null && data?.status === "ok" && !Object.prototype.hasOwnProperty.call(data, "error") && typeof data.lead_id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.lead_id)) return { etat: "confirme", id: data.lead_id };
  // Seuls les refus explicitement documentés avant INSERT autorisent une correction directe.
  if (r.data === null && r.error && typeof r.error === "object" && (r.error as { context?: unknown }).context === r.response && [400, 429].includes(r.response.status)) {
    try {
      const corps: unknown = await r.response.clone().json();
      if (corps && typeof corps === "object" && !Array.isArray(corps)) {
        const code = (corps as Record<string, unknown>).error;
        if (typeof code === "string" && ((r.response.status === 429 && code === "rate_limited") || (r.response.status === 400 && ["invalid_type", "missing_fields", "invalid_email", "invalid_phone", "invalid_profession"].includes(code)))) return { etat: "refuse" };
      }
    } catch { /* Une réponse illisible ne prouve pas l'absence d'écriture. */ }
  }
  return { etat: "inconnu" };
}

type Visite = { cle: string; active: boolean };
export default function Contact() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const cle = `${location.key}:${location.pathname}${location.search}${location.hash}:${i18n.language === "en" ? "en" : "fr"}`;
  const visite = useRef<Visite | null>(null);
  if (!visite.current || visite.current.cle !== cle) {
    if (visite.current) visite.current.active = false;
    visite.current = { cle, active: true };
  }
  return <ContactCourant key={cle} visite={visite.current} />;
}

function ContactCourant({ visite }: { visite: Visite }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const contactTypes = [
    { id: "professionnel", backendType: "praticien", icon: Users, title: t("contact.types.professionnel"), description: t("contact.types.professionnelDesc") },
    { id: "collectivite", backendType: "collectivite", icon: Building2, title: t("contact.types.collectivite"), description: t("contact.types.collectiviteDesc") },
    { id: "investisseur", backendType: "investisseur", icon: Briefcase, title: t("contact.types.investisseur"), description: t("contact.types.investisseurDesc") },
  ];

  const [searchParams] = useSearchParams();
  const centre = (searchParams.get("centre") ?? "").slice(0, 120);
  const [selectedType, setSelectedType] = useState<string | null>(centre ? "professionnel" : null);
  const [formData, setFormData] = useState({ nom: "", email: "", telephone: "", organisation: "", message: centre ? (lang === "fr" ? `Je souhaite organiser une visite de ${centre}.` : `I would like to arrange a visit to ${centre}.`) : "" });
  const [honeypot, setHoneypot] = useState("");
  const [rgpdConsent, setRgpdConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [recu, setRecu] = useState<Recu>({ etat: "pret" });
  const [preparerReprise, setPreparerReprise] = useState(false);
  const verrou = useRef(false);
  const generation = useRef(0);
  const bloque = isSubmitting || recu.etat === "inconnu" || recu.etat === "confirme";
  useLayoutEffect(() => {
    const compteur = generation;
    visite.active = true;
    return () => { visite.active = false; ++compteur.current; };
  }, [visite]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verrou.current || !visite.active) return;
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

    verrou.current = true;
    const tentative = ++generation.current;
    const sourceTentative = window.location.href;
    const active = () => visite.active && generation.current === tentative;
    setRecu({ etat: "pret" });
    setIsSubmitting(true);
    try {
      const reponse = await supabase.functions.invoke("send-contact-lead", {
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
      const preuve = await qualifierRecu(reponse);
      if (!active()) return;
      if (window.location.href !== sourceTentative) { setRecu({ etat: "inconnu" }); return; }
      setRecu(preuve);
      if (preuve.etat === "confirme") {
        toast.success(lang === "fr" ? "Votre demande a été enregistrée." : "Your request has been recorded.");
        try { Analytics.formSubmission("contact", window.location.pathname); } catch { /* Le reçu reste confirmé si la mesure échoue. */ }
      } else if (preuve.etat === "refuse") {
        verrou.current = false;
      }
    } catch {
      if (active()) setRecu({ etat: "inconnu" });
    } finally {
      if (active()) setIsSubmitting(false);
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
                <a href={`tel:${ICARE_TELEPHONE_E164}`} className="text-muted-foreground hover:text-foreground transition-colors">{ICARE_TELEPHONE_AFFICHAGE}</a>
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
                <button key={type.id} disabled={bloque} onClick={() => setSelectedType(type.id)} className={`p-6 rounded-2xl border-2 transition-all text-left ${selectedType === type.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
                  <type.icon className={`w-8 h-8 mb-4 ${selectedType === type.id ? "text-primary" : "text-muted-foreground"}`} />
                  <h3 className="font-semibold mb-1">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <fieldset disabled={bloque} className="space-y-6 min-w-0">
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

              </fieldset>
              {recu.etat === "refuse" && <div role="alert"><p>{lang === "fr" ? "Cette tentative a été refusée avant enregistrement. Vérifiez votre saisie ou patientez avant de réessayer." : "This attempt was refused before being recorded. Check your details or wait before trying again."}</p></div>}
              {recu.etat === "confirme" && <div role="status" className="space-y-3"><p>{lang === "fr" ? "Votre demande a été enregistrée. Référence : " : "Your request has been recorded. Reference: "}<span className="break-all">{recu.id}</span></p><Button type="button" variant="outline" onClick={() => { ++generation.current; verrou.current = false; setRecu({ etat: "pret" }); }}>{lang === "fr" ? "Préparer une autre demande" : "Prepare another request"}</Button></div>}
              {recu.etat === "inconnu" && <div role="alert" className="space-y-3"><p>{lang === "fr" ? "Résultat non confirmé. Votre demande a pu être enregistrée. Votre saisie est conservée ; évitez de la renvoyer sans vérification auprès de l'équipe." : "Result unconfirmed. Your request may have been recorded. Your details are retained; check with the team before sending them again."}</p>{!preparerReprise ? <Button type="button" variant="outline" onClick={() => setPreparerReprise(true)}>{lang === "fr" ? "Préparer une autre tentative" : "Prepare another attempt"}</Button> : <><p>{lang === "fr" ? "Déverrouiller ne supprime ni n'annule la première tentative. Aucun envoi ne sera effectué par ce geste." : "Unlocking does not delete or cancel the first attempt. This action sends nothing."}</p><Button type="button" variant="outline" className="h-auto whitespace-normal" onClick={() => { ++generation.current; verrou.current = false; setPreparerReprise(false); setRecu({ etat: "pret" }); }}>{lang === "fr" ? "Je comprends le risque de doublon, déverrouiller" : "I understand the duplicate risk, unlock"}</Button></>}</div>}
              <Button type="submit" variant="hero" className="w-full" disabled={bloque}>
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
