// Page en sommeil depuis le 17/07/2026 (Sprint 16) : route retirée de App.tsx,
// réactivable en la remettant + prerender + sitemap.
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  UserCircle2,
  Star,
  LayoutDashboard,
  BadgeCheck,
  PenLine,
  MapPin,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { localePath } from "@/lib/routes";
import { Analytics } from "@/lib/analytics";
import { z } from "zod";

// ─────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────
const referralSchema = z.object({
  parrain_nom: z
    .string()
    .trim()
    .min(1, "Votre nom est requis")
    .max(200, "Maximum 200 caractères"),
  parrain_email: z
    .string()
    .trim()
    .email("Email invalide")
    .max(255, "Maximum 255 caractères"),
  parrain_cabinet_slug: z.string().max(100).optional().nullable(),
  filleul_nom: z
    .string()
    .trim()
    .min(1, "Le nom de la personne recommandée est requis")
    .max(200, "Maximum 200 caractères"),
  filleul_profession: z
    .string()
    .trim()
    .min(1, "La profession est requise")
    .max(100, "Maximum 100 caractères"),
  filleul_email: z
    .string()
    .trim()
    .email("Email invalide")
    .max(255)
    .optional()
    .or(z.literal("")),
  filleul_telephone: z
    .string()
    .trim()
    .max(30, "Maximum 30 caractères")
    .optional()
    .or(z.literal("")),
  contexte: z
    .string()
    .trim()
    .max(500, "Maximum 500 caractères")
    .optional()
    .or(z.literal("")),
  consentement_rgpd: z.literal(true, {
    message: "Le consentement est requis",
  }),
});

type FormState = {
  parrain_nom: string;
  parrain_email: string;
  parrain_cabinet_slug: string;
  filleul_nom: string;
  filleul_profession: string;
  filleul_email: string;
  filleul_telephone: string;
  contexte: string;
  consentement_rgpd: boolean;
};

const initialState: FormState = {
  parrain_nom: "",
  parrain_email: "",
  parrain_cabinet_slug: "",
  filleul_nom: "",
  filleul_profession: "",
  filleul_email: "",
  filleul_telephone: "",
  contexte: "",
  consentement_rgpd: false,
};

// ─────────────────────────────────────────────
// Reward cards data
// ─────────────────────────────────────────────
const rewardCards = [
  {
    icon: UserCircle2,
    title: "Profil enrichi",
    desc: "Galerie photo, vidéo de présentation, FAQ, problématiques traitées.",
  },
  {
    icon: Star,
    title: "Avis patients",
    desc: "Avis sur la fiche, modérés par I-CA.RE.",
  },
  {
    icon: LayoutDashboard,
    title: "Tableau de bord",
    desc: "Vues, clics téléphone, clics RDV, demandes patient.",
  },
  {
    icon: BadgeCheck,
    title: "Mention recommandée",
    desc: "Encart visuel distinctif « Recommandation I-CA.RE ».",
  },
  {
    icon: PenLine,
    title: "Article de blog",
    desc: "Article co-rédigé sur i-ca.re mentionnant la personne qui recommande.",
  },
  {
    icon: MapPin,
    title: "Optimisation Google",
    desc: "Optimisation de la fiche Google Business Profile par l'équipe I-CA.RE.",
  },
];

const conditions = [
  "La personne recommandée signe un bail d'au moins 12 mois dans un cabinet I-CA.RE.",
  "La déclaration de parrainage est faite avant ou pendant le processus de signature.",
  "Le décompte des 3 mois commence à la signature du bail.",
  "En cas de résiliation anticipée du bail (avant 6 mois), la récompense est suspendue.",
  "Cumulable : une même personne peut déclarer plusieurs recommandations.",
];

const faq = [
  {
    q: "Qui peut parrainer ?",
    r: "Toute praticienne ou tout praticien actuellement locataire d'un cabinet I-CA.RE peut recommander une consœur ou un confrère.",
  },
  {
    q: "Quand est versée la récompense ?",
    r: "Les services premium sont activés dès la signature effective du bail par la personne recommandée, pour une durée de 3 mois consécutifs.",
  },
  {
    q: "Que se passe-t-il si la personne recommandée résilie son bail avant 6 mois ?",
    r: "La récompense est suspendue. Si la résiliation intervient après 6 mois, la récompense est définitivement acquise.",
  },
  {
    q: "Le palier Confort n'est pas encore ouvert publiquement, comment ça marche ?",
    r: "Vous bénéficiez d'un accès anticipé au palier Confort en mode bêta-testeur. Cet accès est acquis dès la signature du bail de la personne recommandée. À l'ouverture officielle du palier (Q1 2027), vous aurez déjà 3 mois d'expérience produit et pourrez décider de continuer.",
  },
  {
    q: "La personne recommandée est-elle informée du parrainage ?",
    r: "Oui, en toute transparence. Lors de l'onboarding, nous mentionnons à la personne recommandée que sa venue active une récompense pour la personne qui l'a recommandée.",
  },
];

const cabinetOptions = [
  { value: "i-ca-re-nansouty", label: "Nansouty" },
  { value: "i-ca-re-pey-berland", label: "Pey-Berland" },
  { value: "i-ca-re-jardin-public", label: "Jardin Public" },
  { value: "autre", label: "Autre" },
];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function Parrainage() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";
  const path = localePath(lang, "parrainage");

  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedFilleulNom, setSubmittedFilleulNom] = useState("");

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      const { [key]: _, ...rest } = e;
      return rest;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = referralSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const payload = {
      parrain_nom: form.parrain_nom.trim(),
      parrain_email: form.parrain_email.trim().toLowerCase(),
      parrain_cabinet_slug: form.parrain_cabinet_slug || null,
      filleul_nom: form.filleul_nom.trim(),
      filleul_profession: form.filleul_profession.trim(),
      filleul_email: form.filleul_email.trim() || null,
      filleul_telephone: form.filleul_telephone.trim() || null,
      contexte: form.contexte.trim() || null,
      statut: "declare",
      consentement_rgpd: true,
    };

    const { error } = await supabase
      .from("declarations_parrainage")
      .insert(payload);

    setSubmitting(false);

    if (error) {
      setErrors({
        form:
          "Un problème est survenu lors de l'envoi. Merci de réessayer dans un instant.",
      });
      return;
    }

    // TODO: Lovable Emails (send internal notification to nicolas@i-ca.re)
    // and acknowledgement email to the sponsor (parrain_email).
    setSubmittedFilleulNom(payload.filleul_nom);
    setSuccess(true);
    Analytics.formSubmission("parrainage", "/parrainage");
  };

  // ─── JSON-LD ──────────────────────────────
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Programme de parrainage I-CA.RE",
    description:
      "Recommandez une consœur ou un confrère qui signe un bail dans un cabinet I-CA.RE et bénéficiez de 3 mois de services Espace Patients premium offerts.",
    url: `https://i-ca.re${path}`,
    isPartOf: {
      "@type": "WebSite",
      name: "I-CA.RE",
      url: "https://i-ca.re",
    },
  };

  // Shared input class: I-CA.RE charter
  const inputClass =
    "w-full px-4 py-3 bg-background border border-[#BFBFBF] rounded-md font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-colors";

  return (
    <Layout>
      <SeoHead
        title="Parrainage | Recommandez une consœur ou un confrère et recevez 3 mois offerts | I-CA.RE"
        description="Recommandez une praticienne ou un praticien qui signe un bail dans un cabinet I-CA.RE et bénéficiez de 3 mois de services Espace Patients premium offerts."
        path={path}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      {/* ── Section 1 : Hero ───────────────────── */}
      <section className="bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <p className="font-body text-xs md:text-sm uppercase font-bold tracking-[0.15em] text-primary mb-6">
            Programme de parrainage
          </p>
          <h1 className="font-heading font-normal text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 text-balance leading-[1.15]">
            Recommandez quelqu'un, et bénéficiez de 3&nbsp;mois offerts.
          </h1>
          <p className="font-heading italic text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-[700px] mx-auto mb-10">
            Recommandez une praticienne ou un praticien qui signe un bail dans
            un cabinet I-CA.RE et recevez 3&nbsp;mois d'accès aux services
            Espace Patients premium.
          </p>
          <a
            href="#formulaire"
            className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-body font-bold uppercase tracking-[0.1em] text-sm md:text-base px-8 py-4 rounded-md transition-colors"
            aria-label="Aller au formulaire de recommandation"
          >
            Recommander quelqu'un
          </a>
        </div>
      </section>

      {/* ── Section 2 : Mécanique en une phrase ── */}
      <section className="py-20" style={{ backgroundColor: "#E2EAE5" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <p className="font-body text-xs md:text-sm uppercase font-bold tracking-[0.15em] text-primary mb-6">
            Le principe
          </p>
          <p className="font-heading italic text-xl md:text-2xl text-foreground leading-[1.5]">
            Si une praticienne ou un praticien locataire I-CA.RE recommande
            une consœur ou un confrère qui signe un bail d'au moins
            12&nbsp;mois dans un de nos cabinets, la personne qui recommande
            reçoit l'équivalent de 3&nbsp;mois de palier Confort de l'Espace
            Patients (valeur 147&nbsp;€), à activer dès la signature du bail.
          </p>
        </div>
      </section>

      {/* ── Section 3 : Récompense détaillée ───── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <p className="font-body text-xs md:text-sm uppercase font-bold tracking-[0.15em] text-primary mb-4">
              Ce que comprend la récompense
            </p>
            <h2 className="font-heading font-normal text-3xl md:text-4xl text-foreground mb-5">
              Trois mois de services premium offerts
            </h2>
            <div
              className="w-[60px] h-px mx-auto"
              style={{ backgroundColor: "#C5D4CA" }}
              aria-hidden="true"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {rewardCards.map(({ icon: Icon, title, desc }) => (
              <article
                key={title}
                className="rounded-2xl p-8 flex gap-5 items-start"
                style={{ backgroundColor: "#E2EAE5" }}
              >
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(158, 184, 165, 0.25)" }}
                >
                  <Icon
                    className="w-7 h-7 text-primary"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="font-body font-bold text-[1.05rem] text-foreground mb-2 leading-tight">
                    {title}
                  </h3>
                  <p className="font-body text-[0.95rem] text-muted-foreground leading-[1.55]">
                    {desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4 : Conditions précises ────── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-10">
            <p className="font-body text-xs md:text-sm uppercase font-bold tracking-[0.15em] text-primary mb-4">
              Conditions
            </p>
            <h2 className="font-heading font-normal text-3xl md:text-4xl text-foreground">
              Comment ça marche
            </h2>
          </div>
          <ul className="space-y-4 list-none">
            {conditions.map((c) => (
              <li
                key={c}
                className="flex gap-4 items-start font-body text-base md:text-[1.05rem] text-foreground leading-[1.6]"
              >
                <span
                  className="flex-shrink-0 w-2 h-2 rounded-full mt-[0.7rem] bg-primary"
                  aria-hidden="true"
                />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Section 5 : FAQ ─────────────────────── */}
      <section className="py-20" style={{ backgroundColor: "#E2EAE5" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-10">
            <p className="font-body text-xs md:text-sm uppercase font-bold tracking-[0.15em] text-primary mb-4">
              Questions fréquentes
            </p>
            <h2 className="font-heading font-normal text-3xl md:text-4xl text-foreground">
              Vos questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faq.map((item, idx) => (
              <AccordionItem
                key={item.q}
                value={`item-${idx}`}
                className="border-b"
                style={{ borderColor: "#BFBFBF" }}
              >
                <AccordionTrigger className="font-body font-bold text-base md:text-[1.05rem] text-foreground hover:no-underline py-5 text-left [&>svg]:text-primary [&>svg]:h-5 [&>svg]:w-5">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-base text-muted-foreground leading-[1.65] pb-5">
                  {item.r}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── Section 6 : Formulaire ──────────────── */}
      <section id="formulaire" className="py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <div className="bg-background rounded-xl p-8 md:p-12 shadow-elevated">
            {success ? (
              <div className="text-center py-8">
                <p className="font-body text-xs md:text-sm uppercase font-bold tracking-[0.15em] text-primary mb-4">
                  Recommandation enregistrée
                </p>
                <h2 className="font-heading italic text-3xl md:text-4xl text-foreground mb-6">
                  Merci&nbsp;!
                </h2>
                <p className="font-body text-base md:text-lg text-foreground leading-[1.6] max-w-xl mx-auto">
                  Votre recommandation a bien été enregistrée. Nous contacterons{" "}
                  <span className="font-bold">{submittedFilleulNom}</span> dans
                  les prochains jours et reviendrons vers vous prochainement.
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <p className="font-body text-xs md:text-sm uppercase font-bold tracking-[0.15em] text-primary mb-3">
                    Déclaration de parrainage
                  </p>
                  <h2 className="font-heading font-normal text-3xl md:text-4xl text-foreground mb-3">
                    Recommander quelqu'un
                  </h2>
                  <p className="font-heading italic text-lg text-muted-foreground">
                    Quelques informations pour qu'on puisse contacter votre
                    recommandation.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-8">
                  {/* ── VOUS ── */}
                  <div>
                    <div
                      className="border-b pb-2 mb-5"
                      style={{ borderColor: "#C5D4CA" }}
                    >
                      <p className="font-body font-bold uppercase tracking-[0.15em] text-xs text-primary">
                        Vous
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="parrain_nom"
                          className="block font-body font-bold text-sm text-foreground mb-2"
                        >
                          Votre nom complet *
                        </label>
                        <input
                          id="parrain_nom"
                          type="text"
                          required
                          value={form.parrain_nom}
                          onChange={(e) => update("parrain_nom", e.target.value)}
                          className={inputClass}
                          maxLength={200}
                          aria-invalid={!!errors.parrain_nom}
                          aria-describedby={
                            errors.parrain_nom ? "err-parrain_nom" : undefined
                          }
                        />
                        {errors.parrain_nom && (
                          <p
                            id="err-parrain_nom"
                            className="mt-1.5 text-sm font-body"
                            style={{ color: "#B89B6F" }}
                          >
                            {errors.parrain_nom}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="parrain_email"
                          className="block font-body font-bold text-sm text-foreground mb-2"
                        >
                          Votre email *
                        </label>
                        <input
                          id="parrain_email"
                          type="email"
                          required
                          value={form.parrain_email}
                          onChange={(e) =>
                            update("parrain_email", e.target.value)
                          }
                          className={inputClass}
                          maxLength={255}
                          aria-invalid={!!errors.parrain_email}
                          aria-describedby={
                            errors.parrain_email ? "err-parrain_email" : undefined
                          }
                        />
                        {errors.parrain_email && (
                          <p
                            id="err-parrain_email"
                            className="mt-1.5 text-sm font-body"
                            style={{ color: "#B89B6F" }}
                          >
                            {errors.parrain_email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="parrain_cabinet_slug"
                          className="block font-body font-bold text-sm text-foreground mb-2"
                        >
                          Votre cabinet I-CA.RE
                        </label>
                        <Select
                          value={form.parrain_cabinet_slug}
                          onValueChange={(v) =>
                            update("parrain_cabinet_slug", v)
                          }
                        >
                          <SelectTrigger
                            id="parrain_cabinet_slug"
                            className="w-full px-4 py-3 h-auto bg-background border border-[#BFBFBF] rounded-md font-body text-base text-foreground"
                          >
                            <SelectValue placeholder="Sélectionner…" />
                          </SelectTrigger>
                          <SelectContent>
                            {cabinetOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* ── VOTRE FILLEUL ── */}
                  <div>
                    <div
                      className="border-b pb-2 mb-5"
                      style={{ borderColor: "#C5D4CA" }}
                    >
                      <p className="font-body font-bold uppercase tracking-[0.15em] text-xs text-primary">
                        Votre recommandation
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="filleul_nom"
                          className="block font-body font-bold text-sm text-foreground mb-2"
                        >
                          Nom complet de la personne recommandée *
                        </label>
                        <input
                          id="filleul_nom"
                          type="text"
                          required
                          value={form.filleul_nom}
                          onChange={(e) => update("filleul_nom", e.target.value)}
                          className={inputClass}
                          maxLength={200}
                          aria-invalid={!!errors.filleul_nom}
                          aria-describedby={
                            errors.filleul_nom ? "err-filleul_nom" : undefined
                          }
                        />
                        {errors.filleul_nom && (
                          <p
                            id="err-filleul_nom"
                            className="mt-1.5 text-sm font-body"
                            style={{ color: "#B89B6F" }}
                          >
                            {errors.filleul_nom}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="filleul_profession"
                          className="block font-body font-bold text-sm text-foreground mb-2"
                        >
                          Sa profession *
                        </label>
                        <input
                          id="filleul_profession"
                          type="text"
                          required
                          placeholder="Psychologue, Ostéopathe…"
                          value={form.filleul_profession}
                          onChange={(e) =>
                            update("filleul_profession", e.target.value)
                          }
                          className={inputClass}
                          maxLength={100}
                          aria-invalid={!!errors.filleul_profession}
                          aria-describedby={
                            errors.filleul_profession
                              ? "err-filleul_profession"
                              : undefined
                          }
                        />
                        {errors.filleul_profession && (
                          <p
                            id="err-filleul_profession"
                            className="mt-1.5 text-sm font-body"
                            style={{ color: "#B89B6F" }}
                          >
                            {errors.filleul_profession}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="filleul_email"
                          className="block font-body font-bold text-sm text-foreground mb-2"
                        >
                          Son email (si vous l'avez)
                        </label>
                        <input
                          id="filleul_email"
                          type="email"
                          value={form.filleul_email}
                          onChange={(e) =>
                            update("filleul_email", e.target.value)
                          }
                          className={inputClass}
                          maxLength={255}
                          aria-invalid={!!errors.filleul_email}
                          aria-describedby={
                            errors.filleul_email ? "err-filleul_email" : undefined
                          }
                        />
                        {errors.filleul_email && (
                          <p
                            id="err-filleul_email"
                            className="mt-1.5 text-sm font-body"
                            style={{ color: "#B89B6F" }}
                          >
                            {errors.filleul_email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="filleul_telephone"
                          className="block font-body font-bold text-sm text-foreground mb-2"
                        >
                          Son téléphone (si vous l'avez)
                        </label>
                        <input
                          id="filleul_telephone"
                          type="tel"
                          value={form.filleul_telephone}
                          onChange={(e) =>
                            update("filleul_telephone", e.target.value)
                          }
                          className={inputClass}
                          maxLength={30}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contexte"
                          className="block font-body font-bold text-sm text-foreground mb-2"
                        >
                          Comment vous connaissez-vous&nbsp;?
                        </label>
                        <textarea
                          id="contexte"
                          rows={4}
                          maxLength={500}
                          placeholder="Quelques mots de contexte nous aident à personnaliser la prise de contact"
                          value={form.contexte}
                          onChange={(e) => update("contexte", e.target.value)}
                          className={inputClass + " resize-y"}
                          aria-invalid={!!errors.contexte}
                          aria-describedby={
                            errors.contexte ? "err-contexte" : undefined
                          }
                        />
                        {errors.contexte && (
                          <p
                            id="err-contexte"
                            className="mt-1.5 text-sm font-body"
                            style={{ color: "#B89B6F" }}
                          >
                            {errors.contexte}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ── Consent ── */}
                  <div>
                    <label className="flex gap-3 items-start cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={form.consentement_rgpd}
                        onChange={(e) =>
                          update("consentement_rgpd", e.target.checked)
                        }
                        className="mt-1 w-4 h-4 accent-primary flex-shrink-0"
                        aria-invalid={!!errors.consentement_rgpd}
                        aria-describedby={
                          errors.consentement_rgpd
                            ? "err-consent"
                            : undefined
                        }
                      />
                      <span className="font-body text-sm text-foreground leading-[1.55]">
                        Je confirme avoir informé la personne recommandée que
                        je transmets ses coordonnées à I-CA.RE pour une prise
                        de contact dans le cadre de ce programme de parrainage.
                      </span>
                    </label>
                    {errors.consentement_rgpd && (
                      <p
                        id="err-consent"
                        className="mt-1.5 text-sm font-body"
                        style={{ color: "#B89B6F" }}
                      >
                        {errors.consentement_rgpd}
                      </p>
                    )}
                  </div>

                  {errors.form && (
                    <p
                      role="alert"
                      className="text-sm font-body text-center"
                      style={{ color: "#B89B6F" }}
                    >
                      {errors.form}
                    </p>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-foreground hover:bg-foreground/90 text-background font-body font-bold uppercase tracking-[0.1em] text-sm md:text-base px-8 py-4 rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting
                        ? "Envoi en cours…"
                        : "Envoyer ma recommandation"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
