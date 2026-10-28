import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useLocation } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { supabase } from "@/integrations/supabase/client";
import { Analytics } from "@/lib/analytics";
import { FadeImage } from "@/components/FadeImage";
import { PROJECT_IMAGES } from "@/lib/projectImages";
import { getCentreBySlug } from "@/lib/centres";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, MapPin, TreePine, Volume2, Loader2 } from "lucide-react";
import { InlineBrand } from "@/components/BrandName";
import { ICARE_TELEPHONE_AFFICHAGE } from "@/lib/contact";
import { useCabinetsPipeline, useProfessions } from "@/hooks/useInstallation";
import { cabinetNomCourt } from "@/lib/installation";
import { SinstallerLinksCabinet } from "@/components/SinstallerLinksCabinet";

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
export default function LocationCabinetToulouse() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const cle = `${location.key}:${location.pathname}${location.search}${location.hash}:${i18n.language === "en" ? "en" : "fr"}`;
  const visite = useRef<Visite | null>(null);
  if (!visite.current || visite.current.cle !== cle) {
    if (visite.current) visite.current.active = false;
    visite.current = { cle, active: true };
  }
  return <ToulouseCourant key={cle} visite={visite.current} />;
}

function ToulouseCourant({ visite }: { visite: Visite }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";
  const { data: pipelineCabinets } = useCabinetsPipeline();
  const { data: professions = [] } = useProfessions();
  const cabinetsToulouse = (pipelineCabinets ?? []).filter((c) => c.city === "Toulouse");

  const toulouseCapitoleHero = PROJECT_IMAGES["i-ca-re-toulouse-capitole"]?.hero;
  const toulouseCapitoleCentre = getCentreBySlug("i-ca-re-toulouse-capitole");

  /* Valeurs stables envoyees au backend (extra_data), non traduites : seul le
     libelle affiche est localise via t(). Memes options qu'avant l'i18n. */
  const neighbourhoodKeys = [
    "capitole", "carmes", "saintEtienne", "saintCyprien",
    "lesChalets", "jeanJaures", "compansCaffarelli",
    "other", "noPreference",
  ] as const;
  const neighbourhoodValues: Record<(typeof neighbourhoodKeys)[number], string> = {
    capitole: "Capitole",
    carmes: "Carmes",
    saintEtienne: "Saint-Étienne",
    saintCyprien: "Saint-Cyprien",
    lesChalets: "Les Chalets",
    jeanJaures: "Jean-Jaurès",
    compansCaffarelli: "Compans-Caffarelli",
    other: "Autre",
    noPreference: "Pas de préférence",
  };
  const neighbourhoodOptions = neighbourhoodKeys.map((k) => ({
    value: neighbourhoodValues[k],
    label: t(`locationToulouse.neighbourhoodOptions.${k}`),
  }));

  const daysKeys = ["fullTime", "fourDays", "threeDays", "twoDays", "oneDay", "toBeDefined"] as const;
  const daysValues: Record<(typeof daysKeys)[number], string> = {
    fullTime: "Temps plein",
    fourDays: "4 jours",
    threeDays: "3 jours",
    twoDays: "2 jours",
    oneDay: "1 jour",
    toBeDefined: "À définir",
  };
  const daysOptions = daysKeys.map((k) => ({
    value: daysValues[k],
    label: t(`locationToulouse.daysOptions.${k}`),
  }));

  const dateKeys = ["fromOpening", "within6Months", "during2027", "later", "toBeDefined"] as const;
  const dateValues: Record<(typeof dateKeys)[number], string> = {
    fromOpening: "À la livraison prévue en mars 2027",
    within6Months: "Dans les 6 mois après ouverture",
    during2027: "Courant 2027",
    later: "Plus tard",
    toBeDefined: "À définir",
  };
  const dateOptions = dateKeys.map((k) => ({
    value: dateValues[k],
    label: t(`locationToulouse.dateOptions.${k}`),
  }));

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    profession: "", neighbourhood: "", days: "", dateInstall: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [recu, setRecu] = useState<Recu>({ etat: "pret" });
  const [preparerReprise, setPreparerReprise] = useState(false);
  const verrou = useRef(false);
  const generation = useRef(0);
  const bloque = submitting || recu.etat === "inconnu" || recu.etat === "confirme";
  useLayoutEffect(() => {
    const compteur = generation;
    visite.active = true;
    return () => { visite.active = false; ++compteur.current; };
  }, [visite]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verrou.current || !visite.active) return;
    if (honeypot) return;
    if (!consent) { toast.error(t("locationToulouse.toastConsentRequired")); return; }
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim() || !form.profession) {
      toast.error(t("locationToulouse.toastRequiredFields")); return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) { toast.error(t("locationToulouse.toastInvalidEmail")); return; }
    const phoneRegex = /^[+\d\s.\-()]{6,30}$/;
    if (!phoneRegex.test(form.phone.trim())) { toast.error(t("locationToulouse.toastInvalidPhone")); return; }

    verrou.current = true;
    const tentative = ++generation.current;
    const sourceTentative = window.location.href;
    const active = () => visite.active && generation.current === tentative;
    setRecu({ etat: "pret" });
    setSubmitting(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const reponse = await supabase.functions.invoke("send-contact-lead", {
        body: {
          type: "cabinet_request",
          firstname: form.firstName,
          lastname: form.lastName,
          email: form.email,
          phone: form.phone,
          city: "Toulouse",
          message: form.message || "Inscription liste d'intérêt Toulouse",
          language: lang,
          source_url: window.location.href,
          honeypot,
          utm_source: params.get("utm_source") || undefined,
          utm_medium: params.get("utm_medium") || undefined,
          utm_campaign: params.get("utm_campaign") || undefined,
          extra_data: {
            form_source: "toulouse_interest_list",
            list_tag: "Toulouse liste d'intérêt",
            profession: form.profession,
            neighbourhood: form.neighbourhood || null,
            days_per_week: form.days || null,
            move_in_date: form.dateInstall || null,
          },
        },
      });
      const preuve = await qualifierRecu(reponse);
      if (!active()) return;
      if (window.location.href !== sourceTentative) { setRecu({ etat: "inconnu" }); return; }
      setRecu(preuve);
      if (preuve.etat === "confirme") {
        // Présentation et mesure restent indépendantes du reçu serveur.
        try { toast.success(lang === "fr" ? "Votre demande a été enregistrée." : "Your request has been recorded."); } catch { /* Le reçu est conservé. */ }
        try {
          Analytics.formSubmission(
            "installation_toulouse",
            lang === "fr" ? "/location-cabinet-toulouse" : "/en/office-rental-toulouse",
          );
        } catch { /* Une mesure refusée ne remet pas la demande en échec. */ }
      } else if (preuve.etat === "refuse") {
        verrou.current = false;
      }
    } catch {
      if (active()) setRecu({ etat: "inconnu" });
    } finally {
      if (active()) setSubmitting(false);
    }
  };

  const whyBlocks = [
    {
      icon: Volume2,
      title: t("locationToulouse.why.spaces"),
      desc: t("locationToulouse.why.spacesDesc"),
    },
    {
      icon: MapPin,
      title: t("locationToulouse.why.neighbourhoods"),
      desc: t("locationToulouse.why.neighbourhoodsDesc"),
    },
    {
      icon: TreePine,
      title: t("locationToulouse.why.atmosphere"),
      desc: t("locationToulouse.why.atmosphereDesc"),
    },
  ];

  const faqItems = [
    { q: t("locationToulouse.faq.q1"), a: t("locationToulouse.faq.a1") },
    { q: t("locationToulouse.faq.q2"), a: t("locationToulouse.faq.a2") },
    { q: t("locationToulouse.faq.q3"), a: t("locationToulouse.faq.a3") },
    { q: t("locationToulouse.faq.q4"), a: t("locationToulouse.faq.a4") },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  // Dark form styling (consistent with /professionnels)
  const darkSelectTrigger =
    "h-12 bg-[#1F1F1F] border-white/15 text-[#F6F5F0] data-[placeholder]:text-[#F6F5F0]/45 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/25";
  const darkSelectContent = "bg-[#1F1F1F] border-white/15 rounded-lg shadow-elevated";
  const darkSelectItem =
    "text-[#F6F5F0] focus:bg-primary/15 data-[state=checked]:bg-primary data-[state=checked]:text-[#1F1F1F]";

  return (
    <Layout>
      <SeoHead
        title={t("seo.locationToulouseTitle")}
        description={t("seo.locationToulouseDesc")}
        path={lang === "fr" ? "/location-cabinet-toulouse" : "/en/office-rental-toulouse"}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center pt-20">
        <div className="absolute inset-0">
          {toulouseCapitoleHero ? (
            <FadeImage
              src={toulouseCapitoleHero}
              alt={t("locationToulouse.heroImageAlt")}
              className="w-full h-full object-cover"
              loading="eager"
              fadeDuration={500}
            />
          ) : (
            <div className="w-full h-full bg-secondary" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/30" />
        </div>
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-primary/15 text-primary text-xs font-bold uppercase tracking-[0.1em] rounded-full mb-6">
              {t("locationToulouse.heroTag")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
              {t("locationToulouse.h1")}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10">
              {t("locationToulouse.heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" asChild>
                <a href="#liste-interet">
                  {t("locationToulouse.ctaJoinList")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to={localePath(lang, "projects", "i-ca-re-toulouse-capitole")}>
                  {t("locationToulouse.ctaDiscoverCapitole")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* I-CA.RE arrive à Toulouse */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title"><InlineBrand>{t("locationToulouse.arrivingTitle")}</InlineBrand></h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              <InlineBrand>{t("locationToulouse.arrivingP1")}</InlineBrand>
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("locationToulouse.arrivingP2")}
            </p>
          </div>
        </div>
      </section>

      {/* Trouver un cabinet à louer à Toulouse : un vrai défi */}
      <section className="section-padding bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center">
              {t("locationToulouse.challengeTitle")}
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                {t("locationToulouse.challengeP1")}
              </p>
              <p>
                <InlineBrand>{t("locationToulouse.challengeP2")}</InlineBrand>
              </p>
              <p>
                <InlineBrand>{t("locationToulouse.challengeP3")}</InlineBrand>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos cabinets de consultation à Toulouse */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title">{t("locationToulouse.centresTitle")}</h2>
          </div>
          <div className="max-w-md mx-auto">
            <Link
              to={localePath(lang, "projects", "i-ca-re-toulouse-capitole")}
              className="group card-premium overflow-hidden transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 block"
            >
              <div className="relative w-full h-60 overflow-hidden">
                {toulouseCapitoleHero ? (
                  <FadeImage
                    src={toulouseCapitoleHero}
                    alt={t("locationToulouse.centresImageAlt")}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    fadeDuration={400}
                  />
                ) : (
                  <div className="w-full h-full bg-secondary" />
                )}
                <span className="absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm bg-[hsl(38,30%,90%)] text-[hsl(38,40%,35%)]">
                  {t("locationToulouse.centresBadgeOpening")}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  <InlineBrand>I-CA.RE</InlineBrand> Toulouse Capitole
                </h3>
                <p className="text-xs text-muted-foreground/70 mb-5">
                  {toulouseCapitoleCentre?.address}
                </p>
                <span className="text-sm font-semibold text-primary inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                  {t("locationToulouse.centresCardCta")}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8 max-w-xl mx-auto">
            {t("locationToulouse.centresMoreP1")}{" "}
            <a href="#liste-interet" className="text-primary underline underline-offset-4 hover:text-primary/80">
              {t("locationToulouse.centresMoreLink")}
            </a>{" "}
            {t("locationToulouse.centresMoreP2")}
          </p>
        </div>
      </section>

      {lang === "fr" && cabinetsToulouse.length > 0 && (
        <section className="section-padding">
          <div className="container max-w-4xl">
            {cabinetsToulouse.map((c) => (
              <SinstallerLinksCabinet
                key={c.id}
                slugInstallation={c.slug_installation}
                cabinetLabel={cabinetNomCourt(c.name)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Pourquoi rejoindre */}
      <section className="section-padding bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title"><InlineBrand>{t("locationToulouse.whyTitle")}</InlineBrand></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {whyBlocks.map((b) => (
              <div key={b.title} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-5">
                  <b.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-3">{b.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre preuve à Bordeaux */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title">{t("locationToulouse.proofTitle")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {t("locationToulouse.proofP1")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="default" asChild>
                <Link to={localePath(lang, "projects")}>
                  {t("locationToulouse.proofCtaBordeaux")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to={localePath(lang, "approach")}>
                  {t("locationToulouse.proofCtaApproach")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire : Liste d'intérêt Toulouse */}
      <section id="liste-interet" className="section-padding bg-foreground">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4 text-background">
                {t("locationToulouse.formTitle")}
              </h2>
              <p className="text-background/70 text-lg">
                {t("locationToulouse.formSubtitle")}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 form-dark-section">
              <fieldset disabled={bloque} className="space-y-6 min-w-0">
              {/* Honeypot */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <input
                  type="text"
                  name="website_url_confirm"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tlse-firstName" className="text-[#F6F5F0]">{t("locationToulouse.formFirstName")}</Label>
                  <Input id="tlse-firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="h-12" required maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tlse-lastName" className="text-[#F6F5F0]">{t("locationToulouse.formLastName")}</Label>
                  <Input id="tlse-lastName" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="h-12" required maxLength={100} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tlse-email" className="text-[#F6F5F0]">{t("locationToulouse.formEmail")}</Label>
                  <Input id="tlse-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-12" required maxLength={255} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tlse-phone" className="text-[#F6F5F0]">{t("locationToulouse.formPhone")}</Label>
                  <Input id="tlse-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={ICARE_TELEPHONE_AFFICHAGE} className="h-12" required maxLength={30} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#F6F5F0]">{t("locationToulouse.formProfessionLabel")}</Label>
                {/*
                  key porteuse du correctif : le <select> natif caché de Radix (aria-hidden)
                  suit l'ORDRE DE MONTAGE des SelectItem, pas l'ordre du JSX. Sans remontage,
                  l'item statique « autre », monté au premier rendu alors que professions est
                  encore vide, apparaît en première position dans le HTML servi.
                  La key bascule une seule fois, loading -> loaded. NE PAS SUPPRIMER.
                  La valeur choisie est préservée : elle vit dans form (composant contrôlé).
                */}
                <Select
                  key={professions.length > 0 ? "loaded" : "loading"}
                  value={form.profession}
                  onValueChange={(v) => setForm({ ...form, profession: v })}
                >
                  <SelectTrigger className={darkSelectTrigger}>
                    <SelectValue placeholder={t("locationToulouse.formProfessionPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent className={darkSelectContent}>
                    {professions.map((p) => (
                      <SelectItem key={p.slug} value={p.slug} className={darkSelectItem}>
                        {p.nom_inclusif_pluriel}
                      </SelectItem>
                    ))}
                    <SelectItem value="autre" className={darkSelectItem}>
                      {t("locationToulouse.formProfessionOther")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[#F6F5F0]">{t("locationToulouse.formNeighbourhoodLabel")}</Label>
                  <Select value={form.neighbourhood} onValueChange={(v) => setForm({ ...form, neighbourhood: v })}>
                    <SelectTrigger className={darkSelectTrigger}>
                      <SelectValue placeholder={t("locationToulouse.formNeighbourhoodPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent className={darkSelectContent}>
                      {neighbourhoodOptions.map((n) => (
                        <SelectItem key={n.value} value={n.value} className={darkSelectItem}>{n.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#F6F5F0]">{t("locationToulouse.formDaysLabel")}</Label>
                  <Select value={form.days} onValueChange={(v) => setForm({ ...form, days: v })}>
                    <SelectTrigger className={darkSelectTrigger}>
                      <SelectValue placeholder={t("locationToulouse.formDaysPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent className={darkSelectContent}>
                      {daysOptions.map((d) => (
                        <SelectItem key={d.value} value={d.value} className={darkSelectItem}>{d.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#F6F5F0]">{t("locationToulouse.formDateLabel")}</Label>
                <Select value={form.dateInstall} onValueChange={(v) => setForm({ ...form, dateInstall: v })}>
                  <SelectTrigger className={darkSelectTrigger}>
                    <SelectValue placeholder={t("locationToulouse.formDatePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent className={darkSelectContent}>
                    {dateOptions.map((d) => (
                      <SelectItem key={d.value} value={d.value} className={darkSelectItem}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tlse-message" className="text-[#F6F5F0]">{t("locationToulouse.formMessageLabel")}</Label>
                <Textarea
                  id="tlse-message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="min-h-[120px] bg-[#1F1F1F] border-white/15 text-[#F6F5F0] placeholder:text-[#F6F5F0]/45"
                  maxLength={2000}
                  placeholder={t("locationToulouse.formMessagePlaceholder")}
                />
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="tlse-consent"
                  checked={consent}
                  onCheckedChange={(c) => setConsent(c === true)}
                  className="mt-1 border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="tlse-consent" className="text-sm text-[#F6F5F0]/80 leading-relaxed cursor-pointer">
                  {t("locationToulouse.formConsentPrefix")} <InlineBrand>I-CA.RE</InlineBrand> {t("locationToulouse.formConsentMiddle")}{" "}
                  <Link to={localePath(lang, "privacy")} className="text-primary underline underline-offset-4 hover:text-primary/80">
                    {t("locationToulouse.formConsentLinkText")}
                  </Link>
                  .
                </Label>
              </div>

              </fieldset>
              {recu.etat === "refuse" && <div role="alert" className="text-[#F6F5F0] location-toulouse-recu"><p>{lang === "fr" ? "Cette tentative a été refusée avant enregistrement. Vérifiez votre saisie ou patientez avant de réessayer." : "This attempt was refused before being recorded. Check your details or wait before trying again."}</p></div>}
              {recu.etat === "confirme" && <div role="status" className="space-y-3 text-[#F6F5F0] location-toulouse-recu"><p>{lang === "fr" ? "Votre demande a été enregistrée. Référence : " : "Your request has been recorded. Reference: "}<span className="break-all">{recu.id}</span></p><Button type="button" variant="outline" className="h-auto whitespace-normal border-white/30 text-[#F6F5F0] hover:bg-white/10" onClick={() => { ++generation.current; verrou.current = false; setPreparerReprise(false); setRecu({ etat: "pret" }); }}>{lang === "fr" ? "Préparer une autre demande" : "Prepare another request"}</Button></div>}
              {recu.etat === "inconnu" && <div role="alert" className="space-y-3 text-[#F6F5F0] location-toulouse-recu"><p>{lang === "fr" ? "Résultat non confirmé. Votre demande a pu être enregistrée. Votre saisie est conservée ; évitez de la renvoyer sans vérification auprès de l'équipe." : "Result unconfirmed. Your request may have been recorded. Your details are retained; check with the team before sending them again."}</p>{!preparerReprise ? <Button type="button" variant="outline" className="h-auto whitespace-normal border-white/30 text-[#F6F5F0] hover:bg-white/10" onClick={() => setPreparerReprise(true)}>{lang === "fr" ? "Préparer une autre tentative" : "Prepare another attempt"}</Button> : <><p>{lang === "fr" ? "Déverrouiller ne supprime ni n'annule la première tentative. Aucun envoi ne sera effectué par ce geste." : "Unlocking does not delete or cancel the first attempt. This action sends nothing."}</p><Button type="button" variant="outline" className="h-auto whitespace-normal border-white/30 text-[#F6F5F0] hover:bg-white/10" onClick={() => { ++generation.current; verrou.current = false; setPreparerReprise(false); setRecu({ etat: "pret" }); }}>{lang === "fr" ? "Je comprends le risque de doublon et je souhaite modifier ma demande" : "I understand the duplicate risk and want to edit my request"}</Button></>}</div>}
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={bloque}>
                {submitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t("locationToulouse.formSubmitting")}</>) : t("locationToulouse.formSubmit")}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center">{t("locationToulouse.faqTitle")}</h2>
            <Accordion type="single" collapsible className="mt-10 space-y-3">
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`tlse-faq-${i}`} className="bg-secondary rounded-2xl px-6 border-none">
                  <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent
                    forceMount
                    className="text-muted-foreground leading-relaxed pb-5"
                  >
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Encart : cabinet à la journée, mêmes clefs que la page Bordeaux (cabinetJournee.crossLink*). */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-2xl mx-auto card-premium text-center">
            <h2 className="text-xl font-heading font-semibold mb-3">
              {t("cabinetJournee.crossLinkTitle")}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              {t("cabinetJournee.crossLinkDesc1")}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t("cabinetJournee.crossLinkDesc2")}
            </p>
            <Button variant="outline" asChild>
              <Link to={localePath(lang, "cabinetJournee")}>
                {t("cabinetJournee.crossLinkCta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="section-padding bg-foreground">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4 text-background">
              {t("locationToulouse.ctaFinalTitle")}
            </h2>
            <p className="text-background/70 text-lg mb-8">
              {t("locationToulouse.ctaFinalDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <a href="#liste-interet">
                  {t("locationToulouse.ctaJoinList")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="hero-outline"
                className="border-background/30 text-background hover:bg-background/10"
                asChild
              >
                <Link to={localePath(lang, "contact")}>{t("common.contactUs")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
