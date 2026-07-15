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
import { Link } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { supabase } from "@/integrations/supabase/client";
import { FadeImage } from "@/components/FadeImage";
import { PROJECT_IMAGES } from "@/lib/projectImages";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, MapPin, TreePine, Volume2, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { InlineBrand } from "@/components/BrandName";
import { ICARE_TELEPHONE_AFFICHAGE } from "@/lib/contact";
import { useCabinetsPipeline } from "@/hooks/useInstallation";
import { cabinetNomCourt } from "@/lib/installation";
import { SinstallerLinksCabinet } from "@/components/SinstallerLinksCabinet";

export default function LocationCabinetToulouse() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";
  const { data: pipelineCabinets } = useCabinetsPipeline();
  const cabinetsToulouse = (pipelineCabinets ?? []).filter((c) => c.city === "Toulouse");

  const toulouseCapitoleHero = PROJECT_IMAGES["i-ca-re-toulouse-capitole"]?.hero;

  const professionOptions = [
    { value: "medecin_generaliste", label: "Médecin généraliste" },
    { value: "medecin_specialiste", label: "Médecin spécialiste" },
    { value: "kinesitherapeute", label: "Kinésithérapeute" },
    { value: "osteopathe", label: "Ostéopathe" },
    { value: "psychologue", label: "Psychologue" },
    { value: "orthophoniste", label: "Orthophoniste" },
    { value: "sage_femme", label: "Sage-femme" },
    { value: "dentiste", label: "Chirurgien-dentiste" },
    { value: "infirmier", label: "Infirmier·ère" },
    { value: "autre", label: "Autre praticien du soin ou du bien-être" },
  ];

  const neighbourhoodOptions = [
    "Capitole", "Carmes", "Saint-Étienne", "Saint-Cyprien",
    "Les Chalets", "Jean-Jaurès", "Compans-Caffarelli",
    "Autre", "Pas de préférence",
  ];

  const daysOptions = [
    "Temps plein", "4 jours", "3 jours", "2 jours", "1 jour", "À définir",
  ];

  const dateOptions = [
    "Dès l'ouverture Q4 2026",
    "Dans les 6 mois après ouverture",
    "Courant 2027",
    "Plus tard",
    "À définir",
  ];

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    profession: "", neighbourhood: "", days: "", dateInstall: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    if (!consent) { toast.error("Merci d'accepter le traitement de vos données."); return; }
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim() || !form.profession) {
      toast.error("Merci de remplir les champs obligatoires."); return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) { toast.error("Email invalide."); return; }
    const phoneRegex = /^[+\d\s.\-()]{6,30}$/;
    if (!phoneRegex.test(form.phone.trim())) { toast.error("Téléphone invalide."); return; }

    setSubmitting(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const { data, error } = await supabase.functions.invoke("send-contact-lead", {
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
      if (error) throw error;
      if (data?.error === "rate_limited") { toast.error("Une demande a déjà été envoyée récemment. Réessayez dans un instant."); return; }
      if (data?.error) throw new Error(data.error);
      toast.success("Merci ! Nous vous recontactons dès qu'un cabinet correspondant à votre projet est disponible.");
      setForm({ firstName: "", lastName: "", email: "", phone: "", profession: "", neighbourhood: "", days: "", dateInstall: "", message: "" });
      setConsent(false);
    } catch (err) {
      console.error("Toulouse interest form error:", err);
      toast.error("Une erreur est survenue. Merci de réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  const whyBlocks = [
    { icon: Volume2, title: "Espaces pensés pour la pratique", desc: "Cabinets de 11 à 15 m² avec isolation acoustique renforcée, lumière naturelle, climatisation réversible et points d'eau." },
    { icon: MapPin, title: "Implantation dans des quartiers vivants à Toulouse", desc: "Capitole et autres quartiers centraux en cours d'étude, accessibles à pied, en métro et à vélo." },
    { icon: TreePine, title: "Atmosphère calme et professionnelle", desc: "Une décoration soignée, une salle d'attente mutualisée chaleureuse, une communauté de praticien·ne·s engagé·e·s." },
  ];

  const faqItems = [
    {
      q: "Quand ouvrira le premier cabinet I-CA.RE à Toulouse ?",
      a: "Notre première ouverture toulousaine est prévue au quatrième trimestre 2026, à deux pas de la place du Capitole. Le permis de construire a été obtenu et les travaux débutent prochainement.",
    },
    {
      q: "Dans quels quartiers de Toulouse I-CA.RE prévoit-il d'ouvrir ?",
      a: "Au-delà du Capitole, nous étudions plusieurs autres quartiers centraux toulousains pour mailler progressivement la ville rose. Les praticien·ne·s inscrit·e·s à notre liste d'intérêt sont informé·e·s en priorité des nouvelles ouvertures.",
    },
    {
      q: "Quels sont les loyers pratiqués par I-CA.RE à Toulouse ?",
      a: "Les loyers sont compris entre 550 et 800 € hors charges par mois, selon la surface du cabinet (11 à 15 m²) et ses spécificités. Les cabinets sont entièrement clé en main : aucune dépense d'aménagement à prévoir.",
    },
    {
      q: "Comment être informé en priorité des disponibilités toulousaines ?",
      a: "Inscrivez-vous à notre liste d'intérêt Toulouse via le formulaire ci-dessus. Vous serez contacté·e dès qu'un cabinet correspondant à votre projet est disponible, avant publication des annonces publiques.",
    },
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
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center pt-20">
        <div className="absolute inset-0">
          {toulouseCapitoleHero ? (
            <FadeImage
              src={toulouseCapitoleHero}
              alt="Façade I-CA.RE Toulouse Capitole — cabinets paramédicaux à louer"
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
              Cabinet à louer Toulouse
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
              Cabinet paramédical à louer à Toulouse
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10">
              Cabinets de consultation rénovés, acoustiques et clé en main — premier lieu en plein cœur de Toulouse, ouverture Q4 2026. 550 à 800&nbsp;€ HC/mois selon les surfaces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" asChild>
                <a href="#liste-interet">
                  Rejoindre la liste d'intérêt
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to={localePath(lang, "projects", "i-ca-re-toulouse-capitole")}>
                  Découvrir Toulouse Capitole
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
            <h2 className="section-title"><InlineBrand>I-CA.RE arrive à Toulouse</InlineBrand></h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Après quatre lieux exploités à Bordeaux — Nansouty, Jardin Public, Pey-Berland et Chartrons — <InlineBrand>I-CA.RE</InlineBrand> étend son modèle à Toulouse. Notre mission reste la même : transformer des rez-de-chaussée urbains sous-valorisés en espaces de soin nouvelle génération, pensés pour la confidentialité, le confort acoustique et la qualité d'accueil des patient·e·s.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              La première ouverture toulousaine, située à deux pas de la place du Capitole, nous évoque naturellement notre réalisation Pey-Berland à Bordeaux : même cœur de ville, même qualité patrimoniale, même potentiel pour devenir un lieu de soin de référence. D'autres ouvertures suivront dans d'autres quartiers toulousains, pour mailler progressivement la ville rose.
            </p>
          </div>
        </div>
      </section>

      {/* Trouver un cabinet à louer à Toulouse : un vrai défi */}
      <section className="section-padding bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center">
              Trouver un cabinet à louer à Toulouse : un vrai défi pour les praticiens
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Psychologues, ostéopathes, thérapeutes, infirmier·ère·s… trouver un cabinet paramédical à louer à Toulouse qui conjugue confidentialité, accessibilité et loyer maîtrisé reste un parcours du combattant. Les locaux disponibles sont rarement adaptés à la pratique du soin : mauvaise isolation acoustique, absence de conformité PMR, surfaces inadaptées.
              </p>
              <p>
                C'est pourquoi <InlineBrand>I-CA.RE</InlineBrand> identifie des rez-de-chaussée sous-valorisés dans les quartiers centraux de Toulouse et les transforme en cabinets de consultation nouvelle génération. Chaque espace est pensé pour la relation thérapeutique : isolation phonique renforcée, lumière naturelle, conformité ERP et PMR, accueil chaleureux.
              </p>
              <p>
                Avec <InlineBrand>I-CA.RE</InlineBrand>, la location de cabinet à Toulouse devient simple : un espace clé en main, un loyer transparent, une communauté de praticiens engagés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos cabinets de consultation à Toulouse */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title">Nos cabinets de consultation à Toulouse</h2>
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
                    alt="I-CA.RE Toulouse Capitole — façade brique"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    fadeDuration={400}
                  />
                ) : (
                  <div className="w-full h-full bg-secondary" />
                )}
                <span className="absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm bg-[hsl(38,30%,90%)] text-[hsl(38,40%,35%)]">
                  Ouverture Q4 2026
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  <InlineBrand>I-CA.RE</InlineBrand> Toulouse Capitole
                </h3>
                <p className="text-xs text-muted-foreground/70 mb-5">
                  5 rue de Mirepoix, 31000 Toulouse
                </p>
                <span className="text-sm font-semibold text-primary inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                  Découvrir le projet
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8 max-w-xl mx-auto">
            D'autres ouvertures sont en cours d'étude dans Toulouse.{" "}
            <a href="#liste-interet" className="text-primary underline underline-offset-4 hover:text-primary/80">
              Rejoignez notre liste d'intérêt
            </a>{" "}
            pour être informé·e en priorité.
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
            <h2 className="section-title"><InlineBrand>Pourquoi rejoindre un lieu I-CA.RE</InlineBrand></h2>
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
            <h2 className="section-title">Notre preuve à Bordeaux</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Nous ne partons pas de zéro. À Bordeaux, nos 4 lieux exploités — Nansouty, Jardin Public, Pey-Berland, Chartrons — sont complets ou en cours de commercialisation, avec une communauté d'une vingtaine de praticien·ne·s : psychologues, psychothérapeutes, sophrologues, naturopathes, ostéopathes, hypnothérapeutes. Nous apportons ce savoir-faire à Toulouse.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="default" asChild>
                <Link to={localePath(lang, "projects")}>
                  Voir nos lieux bordelais
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to={localePath(lang, "approach")}>
                  Notre approche
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Formulaire — Liste d'intérêt Toulouse */}
      <section id="liste-interet" className="section-padding bg-foreground">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4 text-background">
                Soyez informé·e en priorité des ouvertures toulousaines
              </h2>
              <p className="text-background/70 text-lg">
                Laissez-nous vos coordonnées et votre projet. Vous serez contacté·e dès qu'un cabinet correspondant à votre besoin sera disponible.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 form-dark-section">
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
                  <Label htmlFor="tlse-firstName" className="text-[#F6F5F0]">Prénom *</Label>
                  <Input id="tlse-firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="h-12" required maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tlse-lastName" className="text-[#F6F5F0]">Nom *</Label>
                  <Input id="tlse-lastName" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="h-12" required maxLength={100} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tlse-email" className="text-[#F6F5F0]">Email *</Label>
                  <Input id="tlse-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-12" required maxLength={255} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tlse-phone" className="text-[#F6F5F0]">Téléphone *</Label>
                  <Input id="tlse-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={ICARE_TELEPHONE_AFFICHAGE} className="h-12" required maxLength={30} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#F6F5F0]">Type de praticien *</Label>
                <Select value={form.profession} onValueChange={(v) => setForm({ ...form, profession: v })}>
                  <SelectTrigger className={darkSelectTrigger}>
                    <SelectValue placeholder="Sélectionnez votre profession" />
                  </SelectTrigger>
                  <SelectContent className={darkSelectContent}>
                    {professionOptions.map((p) => (
                      <SelectItem key={p.value} value={p.value} className={darkSelectItem}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[#F6F5F0]">Quartier souhaité</Label>
                  <Select value={form.neighbourhood} onValueChange={(v) => setForm({ ...form, neighbourhood: v })}>
                    <SelectTrigger className={darkSelectTrigger}>
                      <SelectValue placeholder="Sélectionnez un quartier" />
                    </SelectTrigger>
                    <SelectContent className={darkSelectContent}>
                      {neighbourhoodOptions.map((n) => (
                        <SelectItem key={n} value={n} className={darkSelectItem}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#F6F5F0]">Nombre de jours/semaine</Label>
                  <Select value={form.days} onValueChange={(v) => setForm({ ...form, days: v })}>
                    <SelectTrigger className={darkSelectTrigger}>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent className={darkSelectContent}>
                      {daysOptions.map((d) => (
                        <SelectItem key={d} value={d} className={darkSelectItem}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#F6F5F0]">Date d'installation visée</Label>
                <Select value={form.dateInstall} onValueChange={(v) => setForm({ ...form, dateInstall: v })}>
                  <SelectTrigger className={darkSelectTrigger}>
                    <SelectValue placeholder="Sélectionnez une période" />
                  </SelectTrigger>
                  <SelectContent className={darkSelectContent}>
                    {dateOptions.map((d) => (
                      <SelectItem key={d} value={d} className={darkSelectItem}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tlse-message" className="text-[#F6F5F0]">Message (optionnel)</Label>
                <Textarea
                  id="tlse-message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="min-h-[120px] bg-[#1F1F1F] border-white/15 text-[#F6F5F0] placeholder:text-[#F6F5F0]/45"
                  maxLength={2000}
                  placeholder="Décrivez votre projet d'installation à Toulouse"
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
                  J'accepte que mes données soient traitées par <InlineBrand>I-CA.RE</InlineBrand> dans le cadre de ma demande, conformément à la{" "}
                  <Link to={localePath(lang, "privacy")} className="text-primary underline underline-offset-4 hover:text-primary/80">
                    politique de confidentialité
                  </Link>
                  .
                </Label>
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
                {submitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Envoi en cours…</>) : "Rejoindre la liste d'intérêt Toulouse"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center">Questions fréquentes — Toulouse</h2>
            <Accordion type="single" collapsible className="mt-10 space-y-3">
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`tlse-faq-${i}`} className="bg-secondary rounded-2xl px-6 border-none">
                  <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent
                    forceMount
                    className="text-muted-foreground leading-relaxed pb-5 data-[state=closed]:hidden"
                  >
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="section-padding bg-foreground">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4 text-background">
              Échanger sur votre projet d'installation à Toulouse
            </h2>
            <p className="text-background/70 text-lg mb-8">
              Rejoignez la liste d'intérêt pour être informé·e en priorité, ou contactez-nous directement pour échanger sur votre projet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <a href="#liste-interet">
                  Rejoindre la liste d'intérêt
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="hero-outline"
                className="border-background/30 text-background hover:bg-background/10"
                asChild
              >
                <Link to={localePath(lang, "contact")}>Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
