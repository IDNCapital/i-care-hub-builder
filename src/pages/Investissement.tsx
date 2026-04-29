import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import {
  FileText,
  Phone,
  Landmark,
  Search,
  HandshakeIcon,
  ArrowRight,
  Heart,
  Shield,
  Settings,
  Building2,
  MapPin,
  Network,
} from "lucide-react";
import { getDefaultHero } from "@/lib/projectImages";
import { FadeImage } from "@/components/FadeImage";
import { BrandName, InlineBrand } from "@/components/BrandName";
import { STATIC_CENTRES } from "@/lib/centres";

export default function Investissement() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const pillars = [
    { icon: Heart, title: t("investment.pillar1Title"), description: t("investment.pillar1Desc") },
    { icon: Shield, title: t("investment.pillar2Title"), description: t("investment.pillar2Desc") },
    { icon: Settings, title: t("investment.pillar3Title"), description: t("investment.pillar3Desc") },
  ];

  const partnerEncarts = [
    {
      icon: Landmark,
      title: lang === "en" ? "Banks & Credit Institutions" : "Banques & établissements de crédit",
      description: lang === "en"
        ? "Structured operation financing, complete dossiers. Each project includes senior debt at asset level."
        : "Financement d'opérations structurées, dossiers complets. Chaque projet fait l'objet d'un montage avec dette senior au niveau de l'actif.",
      cta: lang === "en" ? "Discuss Financing" : "Discuter d'un financement",
    },
    {
      icon: Search,
      title: lang === "en" ? "Estate Agents & Introducers" : "Agents immobiliers & apporteurs",
      description: lang === "en"
        ? "We are constantly sourcing 50 to 300 sqm undervalued ground floors in dense urban areas. Structured introduction fees."
        : "Nous recherchons en permanence des rez-de-chaussée de 50 à 300 m², sous-valorisés, en zone urbaine dense. Rémunération d'apport d'affaires structurée.",
      cta: lang === "en" ? "Submit a Property" : "Proposer un bien",
    },
    {
      icon: HandshakeIcon,
      title: lang === "en" ? "Landlords & Property Owners" : "Bailleurs & propriétaires",
      description: lang === "en"
        ? "Asset revaluation through complete requalification and multi-tenant leasing. Retain a high-performing, sustainably managed asset."
        : "Revalorisation de votre actif par une requalification complète et une commercialisation multi-locataires. Conservez un bien performant, durablement géré.",
      cta: lang === "en" ? "Revalue My Asset" : "Revaloriser mon actif",
    },
  ];

  const parc = STATIC_CENTRES.filter((c) => ["chartrons", "nansouty", "jardin-public", "pey-berland"].includes(c.id));

  const idnBrands = ["I‑CA.RE", "IDN Promotion", "IDN Construction", "IDN Patrimoine", "IDN Capital"];

  const statusLabel = (s: string) =>
    s === "available"
      ? lang === "en" ? "Available" : "Disponible"
      : s === "full"
      ? lang === "en" ? "Fully leased" : "Complet"
      : lang === "en" ? "Coming soon" : "Bientôt";

  return (
    <Layout>
      <SeoHead
        title={t("seo.investmentTitle")}
        description={t("seo.investmentDesc")}
        path={lang === "fr" ? "/investissement" : "/en/investment"}
      />

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center pt-20">
        <div className="absolute inset-0">
          <FadeImage
            src={getDefaultHero("investissement")}
            alt={lang === "fr" ? "Façade – I‑CA.RE Nansouty" : "Facade – I‑CA.RE Nansouty"}
            className="w-full h-full object-cover"
            loading="eager"
            fadeDuration={500}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/30" />
        </div>
        <div className="container relative z-10 py-20">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 border border-accent/50 text-accent text-xs font-body font-bold uppercase tracking-[0.12em] rounded-full mb-6 opacity-0 animate-fade-up">
              {t("investment.heroTag")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-normal text-background leading-[1.1] mb-6 opacity-0 animate-fade-up stagger-1">
              {t("investment.heroTitle")}
            </h1>
            <p className="text-lg md:text-xl font-body text-background/80 leading-relaxed mb-10 opacity-0 animate-fade-up stagger-2">
              {t("investment.heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up stagger-3">
              <Button variant="hero" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to={localePath(lang, "investmentInterest")}>
                  <FileText className="mr-2 h-5 w-5" />
                  {t("investment.ctaMemo")}
                </Link>
              </Button>
              <Button variant="outline" asChild className="border-background/30 text-background hover:bg-background hover:text-foreground">
                <Link to={localePath(lang, "contact")}>
                  <Phone className="mr-2 h-5 w-5" />
                  {t("investment.ctaCall")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Le concept + métriques */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-16">
            <p className="text-xs font-body font-bold uppercase tracking-[0.15em] text-primary mb-4">
              {lang === "en" ? "The Concept" : "Le concept"}
            </p>
            <h2 className="font-heading font-normal text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
              <InlineBrand>{t("investment.concept")}</InlineBrand>
            </h2>
            <div className="w-16 h-px bg-accent mb-8" />
            <p className="text-lg font-body text-muted-foreground leading-relaxed mb-6">
              <InlineBrand>{t("investment.conceptP1")}</InlineBrand>
            </p>
            <p className="text-lg font-body text-muted-foreground leading-relaxed">
              {t("investment.conceptP2")}
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "50–300 m²", label: t("investment.surfacePerAsset") },
              { value: "3–6", label: t("investment.officesPerOp") },
              { value: "11–15 m²", label: t("investment.perOffice") },
              { value: "24–36 " + (lang === "en" ? "months" : "mois"), label: t("investment.stabilisation") },
            ].map((metric) => (
              <div
                key={metric.label}
                className="text-center bg-[hsl(var(--sage)/0.18)] border border-[hsl(var(--sage)/0.35)] rounded-xl p-6"
              >
                <p className="font-heading font-normal text-3xl md:text-4xl text-accent-foreground">
                  {metric.value}
                </p>
                <p className="text-sm font-body text-muted-foreground mt-2">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre parc actuel */}
      <section className="section-padding bg-card">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-xs font-body font-bold uppercase tracking-[0.15em] text-primary mb-4">
              {lang === "en" ? "Current Portfolio" : "Notre parc actuel"}
            </p>
            <h2 className="font-heading font-normal text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
              {lang === "en" ? "Four operations in Bordeaux" : "Quatre opérations à Bordeaux"}
            </h2>
            <div className="w-16 h-px bg-accent mb-8" />
            <p className="text-lg font-body text-muted-foreground leading-relaxed">
              {lang === "en"
                ? "A real, operating portfolio: three sites already fully leased and one under construction, opening Q4 2026 in Chartrons."
                : "Un parc réel, en exploitation : trois lieux déjà entièrement loués et un quatrième en construction, ouverture T4 2026 dans le quartier des Chartrons."}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {parc.map((c) => (
              <div key={c.id} className="bg-background border border-border rounded-xl p-6 shadow-soft">
                <div className="flex items-start justify-between mb-4">
                  <Building2 className="w-6 h-6 text-primary" />
                  <span
                    className={`text-[10px] font-body font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                      c.status === "available"
                        ? "bg-accent/30 text-accent-foreground"
                        : c.status === "full"
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary/15 text-primary"
                    }`}
                  >
                    {statusLabel(c.status)}
                  </span>
                </div>
                <h3 className="font-heading font-normal text-xl text-foreground mb-2">
                  I‑CA.RE {c.name}
                </h3>
                <p className="text-sm font-body text-muted-foreground flex items-start gap-1.5 leading-snug">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>{c.address}</span>
                </p>
                {c.openingLabel && (
                  <p className="text-xs font-body text-primary mt-3 font-bold uppercase tracking-wider">
                    {lang === "en" ? "Opening " : "Ouverture "}{c.openingLabel}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trois piliers */}
      <section className="section-padding bg-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-body font-bold uppercase tracking-[0.15em] text-accent mb-4">
              {lang === "en" ? "Stewardship Approach" : "Approche patrimoniale"}
            </p>
            <h2 className="font-heading font-normal text-3xl md:text-4xl lg:text-5xl mb-6 text-background leading-tight">
              {t("investment.executionModel")}
            </h2>
            <div className="w-16 h-px bg-accent mx-auto mb-8" />
            <p className="font-body text-background/75 text-lg leading-relaxed">
              {t("investment.executionModelDesc")}
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="relative bg-background/[0.06] border border-background/15 rounded-xl p-8 text-center backdrop-blur-sm"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/25 flex items-center justify-center mx-auto mb-6">
                    <pillar.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-heading font-normal text-xl mb-4 text-background">
                    {pillar.title}
                  </h3>
                  <p className="font-body text-background/75 leading-relaxed text-sm">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Écosystème Groupe IDN */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-body font-bold uppercase tracking-[0.15em] text-primary mb-4">
                {lang === "en" ? "Affiliate Brand" : "Marque affiliée"}
              </p>
              <h2 className="font-heading font-normal text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
                {lang === "en" ? "The Groupe IDN ecosystem" : "L'écosystème Groupe IDN"}
              </h2>
              <div className="w-16 h-px bg-accent mx-auto mb-8" />
              <p className="text-lg font-body text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                {lang === "en"
                  ? "I‑CA.RE is an independent family-owned real estate firm and an affiliate brand of Groupe IDN — a family group active in real estate development, construction, asset management and investment across South-West France."
                  : "I‑CA.RE est une foncière familiale indépendante et une marque affiliée du Groupe IDN — un groupe familial actif dans la promotion, la construction, la gestion patrimoniale et l'investissement immobilier dans le Sud-Ouest."}
              </p>
            </div>
            <div className="bg-[hsl(var(--cream))] border border-[hsl(var(--gold)/0.4)] rounded-xl p-8 md:p-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Network className="w-5 h-5 text-accent-foreground" />
                <p className="text-xs font-body font-bold uppercase tracking-[0.15em] text-accent-foreground">
                  {lang === "en" ? "Group brands" : "Marques du Groupe"}
                </p>
              </div>
              <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                {idnBrands.map((b) => (
                  <li
                    key={b}
                    className="font-heading font-normal text-base md:text-lg text-foreground"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pour les investisseurs (teaser) */}
      <section className="section-padding bg-card">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-body font-bold uppercase tracking-[0.15em] text-primary mb-4">
              {lang === "en" ? "Investor Access" : "Accès investisseur"}
            </p>
            <h2 className="font-heading font-normal text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
              {t("investment.forInvestors")}
            </h2>
            <div className="w-16 h-px bg-accent mx-auto mb-8" />
            <p className="text-lg font-body text-muted-foreground leading-relaxed mb-4">
              <InlineBrand>{t("investment.forInvestorsP1")}</InlineBrand>
            </p>
            <p className="text-lg font-body text-muted-foreground leading-relaxed mb-10">
              {t("investment.forInvestorsP2")}
            </p>
            <Button variant="hero" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to={localePath(lang, "investmentInterest")}>
                <FileText className="mr-2 h-5 w-5" />
                {t("investment.ctaMemo")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-xs font-body text-muted-foreground mt-4">
              {t("investment.accessNote")}
            </p>
          </div>
        </div>
      </section>

      {/* Partenaires */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-body font-bold uppercase tracking-[0.15em] text-primary mb-4">
              {lang === "en" ? "Partners" : "Partenaires"}
            </p>
            <h2 className="font-heading font-normal text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
              {t("investment.partners")}
            </h2>
            <div className="w-16 h-px bg-accent mx-auto mb-8" />
            <p className="font-body text-muted-foreground text-lg leading-relaxed">
              {t("investment.partnersDesc")}
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {partnerEncarts.map((partner) => (
              <div key={partner.title} className="bg-card border border-border rounded-xl p-8 shadow-soft">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-6">
                  <partner.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-normal text-xl text-foreground mb-3">
                  {partner.title}
                </h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed mb-6">
                  {partner.description}
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to={localePath(lang, "contact")}>
                    {partner.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading font-normal text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 leading-tight">
              {t("investment.exchangeTitle")}
            </h2>
            <div className="w-16 h-px bg-accent mx-auto mb-8" />
            <p className="text-lg font-body text-muted-foreground mb-10 leading-relaxed">
              {t("investment.exchangeDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to={localePath(lang, "investmentInterest")}>
                  <FileText className="mr-2 h-5 w-5" />
                  {t("investment.ctaMemo")}
                </Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to={localePath(lang, "contact")}>
                  <Phone className="mr-2 h-5 w-5" />
                  {t("investment.ctaCall")}
                </Link>
              </Button>
            </div>
            <p className="text-xs font-body text-muted-foreground mt-6">
              {t("investment.confidential")}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
