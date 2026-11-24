import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
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

type CibleRefus = "type" | "nom" | "email" | "message" | "consentement";
const IDS_REFUS: Record<CibleRefus, string> = {
  type: "types-contact",
  nom: "nom",
  email: "email",
  message: "message",
  consentement: "rgpd-contact",
};

type Recu = { etat: "confirme"; id: string } | { etat: "refuse" | "limite" | "inconnu" };
const delaiRecuMs = 15_000;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const refusAvantInsertion = new Set(["invalid_type", "missing_fields", "invalid_email", "invalid_phone", "invalid_profession"]);

function estObjet(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

async function qualifierRecu(resultat: { data: unknown; error: unknown; response?: Response }): Promise<Recu> {
  const { data, error, response } = resultat;
  if (!(response instanceof Response) || response.headers.get("x-relay-error") === "true") return { etat: "inconnu" };
  if (response.status === 200 && error === null && estObjet(data) && Object.keys(data).length === 2 &&
    data.status === "ok" && typeof data.lead_id === "string" && uuid.test(data.lead_id)) {
    return { etat: "confirme", id: data.lead_id };
  }
  if (data !== null || !estObjet(error) || error.context !== response ||
    (response.status !== 400 && response.status !== 429)) return { etat: "inconnu" };
  const corps: unknown = await response.json();
  if (!estObjet(corps) || Object.keys(corps).length !== 1 || typeof corps.error !== "string") return { etat: "inconnu" };
  if (response.status === 429 && corps.error === "rate_limited") return { etat: "limite" };
  if (response.status === 400 && refusAvantInsertion.has(corps.error)) return { etat: "refuse" };
  return { etat: "inconnu" };
}

export default function Contact() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const visite = JSON.stringify([location.key, location.pathname, location.search, location.hash, i18n.language]);
  return <ContactCourant key={visite} />;
}

function ContactCourant() {
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

  const [recu, setRecu] = useState<Recu | null>(null);
  const verrou = useRef(false);
  const visiteActive = useRef(false);
  const annuler = useRef<(() => void) | null>(null);
  const bloque = isSubmitting || recu?.etat === "confirme" || recu?.etat === "inconnu";
  useLayoutEffect(() => {
    visiteActive.current = true;
    return () => { visiteActive.current = false; annuler.current?.(); };
  }, []);

  const contactRef = useRef<HTMLDivElement>(null);
  const prefixeRefus = useId();
  const [refus, setRefus] = useState<{ cible: CibleRefus; cleMessage: string } | null>(null);

  const attributsRefus = (cible: CibleRefus) => refus?.cible === cible
    ? { "aria-invalid": true, "aria-describedby": `${prefixeRefus}-${cible}` } as const
    : undefined;
  const erreurLocale = (cible: CibleRefus) => refus?.cible === cible
    ? <p id={`${prefixeRefus}-${cible}`} role="alert" className="text-sm text-destructive">{t(refus.cleMessage)}</p>
    : null;

  // Le focus intervient après l'insertion de la description dans le DOM.
  useEffect(() => {
    if (refus) contactRef.current?.querySelector<HTMLElement>(`[id="${IDS_REFUS[refus.cible]}"]`)?.focus();
  }, [refus]);

  useEffect(() => {
    if (!refus) return;
    const email = contactRef.current?.querySelector<HTMLInputElement>("#email");
    const champCorrige = {
      type: Boolean(selectedType),
      nom: Boolean(formData.nom.trim()),
      email: email?.validity.valid && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()),
      message: Boolean(formData.message.trim()),
      consentement: rgpdConsent,
    };
    if (champCorrige[refus.cible]) setRefus(null);
  }, [refus, selectedType, formData.nom, formData.email, formData.message, rgpdConsent]);

  const handleInvalid = (event: React.FormEvent<HTMLFormElement>) => {
    if (honeypot) return;
    const champ = event.target;
    if (!(champ instanceof HTMLInputElement || champ instanceof HTMLTextAreaElement)) return;
    if (champ.id !== "nom" && champ.id !== "email" && champ.id !== "message") return;

    // Les contraintes du navigateur bloquent toujours la soumission.
    // Notre message et notre focus remplacent l'infobulle native.
    event.preventDefault();
    const premierChampInvalide = Array.from(event.currentTarget.elements).find((controle) =>
      (controle instanceof HTMLInputElement || controle instanceof HTMLTextAreaElement) &&
      controle.willValidate && !controle.validity.valid,
    );
    if (champ !== premierChampInvalide) return;
    setRefus({
      cible: champ.id,
      cleMessage: champ.validity.valueMissing ? "contact.errorRequired" : "contact.errorEmail",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visiteActive.current || verrou.current) return;
    if (honeypot) return;
    if (!selectedType) {
      setRefus({ cible: "type", cleMessage: "contact.selectType" });
      toast.error(t("contact.selectType"));
      return;
    }
    if (!formData.nom.trim() || !formData.email.trim() || !formData.message.trim()) {
      const cible = !formData.nom.trim() ? "nom" : !formData.email.trim() ? "email" : "message";
      setRefus({ cible, cleMessage: "contact.errorRequired" });
      toast.error(t("contact.errorRequired")); return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setRefus({ cible: "email", cleMessage: "contact.errorEmail" });
      toast.error(t("contact.errorEmail"));
      return;
    }
    if (!rgpdConsent) {
      setRefus({ cible: "consentement", cleMessage: "contact.errorConsent" });
      toast.error(t("contact.errorConsent"));
      return;
    }

    const selectedConfig = contactTypes.find((ct) => ct.id === selectedType);
    const backendType = selectedConfig?.backendType || "contact_general";

    verrou.current = true;
    setRecu(null);
    setIsSubmitting(true);
    const source = window.location.href;
    const controller = new AbortController();
    const echeance = Date.now() + delaiRecuMs;
    const inconnu = () => {
      setRecu({ etat: "inconnu" });
      setIsSubmitting(false);
    };
    const timer = window.setTimeout(() => { controller.abort(); inconnu(); }, delaiRecuMs);
    annuler.current = () => { window.clearTimeout(timer); controller.abort(); };
    try {
      const reponse = await supabase.functions.invoke("send-contact-lead", {
        signal: controller.signal,
        body: {
          type: backendType,
          full_name: formData.nom,
          email: formData.email,
          phone: formData.telephone || null,
          organization: formData.organisation || null,
          message: formData.message,
          language: lang,
          source_url: source,
          honeypot,
          ...getUtmParams(),
        },
      });
      if (!visiteActive.current || controller.signal.aborted) return;
      const preuve = await qualifierRecu(reponse);
      if (!visiteActive.current || controller.signal.aborted) return;
      if (Date.now() >= echeance || window.location.href !== source) { inconnu(); return; }
      setRecu(preuve);
      if (preuve.etat === "confirme") {
        try { Analytics.formSubmission("contact", window.location.pathname); }
        catch { /* La mesure est indépendante du reçu. */ }
      }
      if (preuve.etat === "refuse" || preuve.etat === "limite") verrou.current = false;
    } catch {
      if (visiteActive.current && !controller.signal.aborted) inconnu();
    } finally {
      window.clearTimeout(timer);
      if (visiteActive.current && !controller.signal.aborted) setIsSubmitting(false);
      annuler.current = null;
    }
  };

  const autreDemande = () => {
    if (recu?.etat !== "confirme") return;
    setRecu(null);
    setFormData({ nom: "", email: "", telephone: "", organisation: "", message: "" });
    setSelectedType(null);
    setRgpdConsent(false);
    verrou.current = false;
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

          <div ref={contactRef} className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="section-title mb-4">{t("contact.sendMessage")}</h2>
              <p className="text-muted-foreground">{t("contact.sendMessageDesc")}</p>
            </div>
            <div
              id="types-contact"
              role="group"
              aria-label={t("contact.selectType")}
              tabIndex={-1}
              {...attributsRefus("type")}
              className="grid sm:grid-cols-3 gap-4 mb-8 focus:outline focus:outline-2 focus:outline-offset-4"
            >
              {contactTypes.map((type) => (
                <button key={type.id} disabled={bloque} aria-pressed={selectedType === type.id} onClick={() => setSelectedType(type.id)} className={`p-6 rounded-2xl border-2 transition-all text-left ${selectedType === type.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
                  <type.icon className={`w-8 h-8 mb-4 ${selectedType === type.id ? "text-primary" : "text-muted-foreground"}`} />
                  <h3 className="font-semibold mb-1">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </button>
              ))}
            </div>
            {erreurLocale("type")}
            <form onSubmit={handleSubmit} onInvalidCapture={handleInvalid} className="space-y-6">
              <fieldset disabled={bloque} className="min-w-0 space-y-6">
              {/* Honeypot */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <input type="text" name="company_url" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nom">{t("contact.fullName")} *</Label>
                  <Input id="nom" {...attributsRefus("nom")} value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} required maxLength={200} />
                  {erreurLocale("nom")}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("contact.email")} *</Label>
                  <Input id="email" type="email" {...attributsRefus("email")} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required maxLength={255} />
                  {erreurLocale("email")}
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
                <Textarea id="message" {...attributsRefus("message")} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder={t("contact.messagePlaceholder")} rows={6} required maxLength={5000} />
                {erreurLocale("message")}
              </div>

              <div className="flex items-start gap-3">
                <Checkbox id="rgpd-contact" {...attributsRefus("consentement")} checked={rgpdConsent} onCheckedChange={(checked) => setRgpdConsent(checked === true)} className="mt-1" />
                <Label htmlFor="rgpd-contact" className="text-sm leading-relaxed cursor-pointer text-muted-foreground">
                  <InlineBrand>{t("contact.rgpd")}</InlineBrand>{" "}
                  <Link to={localePath(lang, "privacy")} className="text-primary underline underline-offset-4 hover:text-primary/80">{t("contact.rgpdLink")}</Link>. *
                </Label>
              </div>

              {erreurLocale("consentement")}

              </fieldset>
              {recu?.etat === "confirme" && <div role="status" className="space-y-2">
                <p>{lang === "fr" ? "Votre demande a été enregistrée. Référence" : "Your request has been recorded. Reference"} : <span className="break-all">{recu.id}</span></p>
                <Button type="button" variant="outline" onClick={autreDemande}>{lang === "fr" ? "Préparer une autre demande" : "Prepare another request"}</Button>
              </div>}
              {recu?.etat === "inconnu" && <p role="alert">{lang === "fr"
                ? "Réception non confirmée. Votre demande a pu être enregistrée. Votre saisie est conservée. Contactez l’équipe avant tout nouvel envoi."
                : "Receipt unconfirmed. Your request may have been recorded. Your details are retained. Contact the team before submitting again."}</p>}
              {recu?.etat === "limite" && <p role="alert">{t("contact.errorRateLimit")}</p>}
              {recu?.etat === "refuse" && <p role="alert">{lang === "fr"
                ? "La demande a été refusée avant son enregistrement. Vérifiez votre saisie."
                : "The request was declined before it was recorded. Check your details."}</p>}
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
