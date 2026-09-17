import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { STATIC_CENTRES } from "@/lib/centres";
import { FadeImage } from "@/components/FadeImage";
import { getDefaultHero, PROJECT_IMAGES } from "@/lib/projectImages";
import { InlineBrand } from "@/components/BrandName";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Armchair,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Euro,
  MapPin,
  Ruler,
  Table2,
  Users,
  XCircle,
} from "lucide-react";

/* Semaine de mix & match illustrant la compatibilite des usages (section 2bis).
   Jours et specialites fictifs, textes passes par i18n depuis le composant. */
const SCHEMA_DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat"] as const;
const SCHEMA_PRACTITIONERS = [
  { key: "psychologist", days: [0, 1], color: "#9EB8A5" },
  { key: "psychotherapist", days: [2, 3], color: "#D9C7A1" },
  { key: "sophrologist", days: [4], color: "#C5D4CA" },
] as const;

export default function CabinetALaJournee() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const principleBlocks = [
    {
      id: "shared",
      icon: Users,
      title: t("cabinetJournee.principle.sharedTitle"),
      desc: t("cabinetJournee.principle.sharedDesc"),
    },
    {
      id: "fixedDays",
      icon: CalendarCheck,
      title: t("cabinetJournee.principle.fixedDaysTitle"),
      desc: t("cabinetJournee.principle.fixedDaysDesc"),
    },
    {
      id: "sharedCost",
      icon: Euro,
      title: t("cabinetJournee.principle.sharedCostTitle"),
      desc: t("cabinetJournee.principle.sharedCostDesc"),
    },
  ];

  const furnitureBlocks = [
    {
      id: "psy",
      icon: Armchair,
      title: t("cabinetJournee.furniture.psyTitle"),
      desc: t("cabinetJournee.furniture.psyDesc"),
    },
    {
      id: "osteo",
      icon: Table2,
      title: t("cabinetJournee.furniture.osteoTitle"),
      desc: t("cabinetJournee.furniture.osteoDesc"),
    },
    {
      id: "dietetique",
      icon: Ruler,
      title: t("cabinetJournee.furniture.dietTitle"),
      desc: t("cabinetJournee.furniture.dietDesc"),
    },
  ];

  const schemaDayLabels = SCHEMA_DAY_KEYS.map((k) => t(`cabinetJournee.schema.days.${k}`));
  const schemaPractitioners = SCHEMA_PRACTITIONERS.map((p) => ({
    ...p,
    label: t(`cabinetJournee.schema.specialties.${p.key}`),
  }));

  const pricingTiers = [
    {
      id: "oneDay",
      label: t("cabinetJournee.pricing.oneDayLabel"),
      price: t("cabinetJournee.pricing.oneDayPrice"),
    },
    {
      id: "twoDays",
      label: t("cabinetJournee.pricing.twoDaysLabel"),
      price: t("cabinetJournee.pricing.twoDaysPrice"),
    },
    {
      id: "threeDays",
      label: t("cabinetJournee.pricing.threeDaysLabel"),
      price: t("cabinetJournee.pricing.threeDaysPrice"),
    },
  ];

  const faqItems = [
    { q: t("cabinetJournee.faq.q1"), a: t("cabinetJournee.faq.a1") },
    { q: t("cabinetJournee.faq.q2"), a: t("cabinetJournee.faq.a2") },
    { q: t("cabinetJournee.faq.q3"), a: t("cabinetJournee.faq.a3") },
  ];

  /* FAQ JSON-LD, meme patron que src/pages/LocationCabinetToulouse.tsx */
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  const statusLabel = (status: string) => {
    if (status === "available") return t("projects.availableBadge");
    if (status === "full") return t("projects.fullBadge");
    return t("projects.comingSoonBadge");
  };

  const statusBadgeClass = (status: string) => {
    if (status === "available") return "bg-sage text-anthracite";
    if (status === "full") return "bg-cream text-anthracite border border-anthracite/30";
    return "bg-gold text-anthracite";
  };

  const heroImage = getDefaultHero("professionnels");

  return (
    <Layout>
      <SeoHead
        title={t("seo.cabinetJourneeTitle")}
        description={t("seo.cabinetJourneeDesc")}
        path={lang === "fr" ? "/cabinet-a-la-journee" : "/en/day-office"}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── HERO ── */}
      <section className="relative min-h-[60vh] flex items-center pt-20">
        <div className="absolute inset-0">
          <FadeImage
            src={heroImage}
            alt={t("cabinetJournee.heroImageAlt")}
            className="w-full h-full object-cover"
            loading="eager"
            fadeDuration={500}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/30" />
        </div>
        <div className="container relative z-10 py-20">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-primary/15 text-primary text-xs font-bold uppercase tracking-[0.1em] rounded-full mb-6">
              {t("cabinetJournee.heroTag")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
              {t("cabinetJournee.h1")}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t("cabinetJournee.heroSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 1 : Le principe ── */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="section-title">{t("cabinetJournee.principleTitle")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              {t("cabinetJournee.principleIntro")}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("cabinetJournee.principleChoice")}
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {principleBlocks.map((b) => (
              <div key={b.id} className="text-center">
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

      {/* ── SECTION 1bis : Le mobilier par specialite ── */}
      <section className="section-padding bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="section-title">{t("cabinetJournee.furnitureTitle")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("cabinetJournee.furnitureIntro")}
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto mb-10">
            {furnitureBlocks.map((b) => (
              <div key={b.id} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-5">
                  <b.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-3">{b.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground/80 leading-relaxed text-center max-w-2xl mx-auto">
            {t("cabinetJournee.furnitureNote")}
          </p>
        </div>
      </section>

      {/* ── SECTION 1ter : Jours libres et usages compatibles ── */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="section-title">{t("cabinetJournee.compatTitle")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              {t("cabinetJournee.compatIntro")}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              {t("cabinetJournee.compatExample")}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              <InlineBrand>{t("cabinetJournee.compatTeam")}</InlineBrand>
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <svg
              viewBox="0 0 640 210"
              className="w-full h-auto"
              role="img"
              aria-label={t("cabinetJournee.schema.ariaLabel")}
            >
              <rect x="0" y="0" width="640" height="210" fill="#F6F5F0" />

              {/* En-tete des jours */}
              {schemaDayLabels.map((label, i) => (
                <text
                  key={`day-${i}`}
                  x={160 + i * 80 + 40}
                  y="20"
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="700"
                  fill="#2B2B2B"
                >
                  {label}
                </text>
              ))}

              {/* Lignes des praticiens fictifs */}
              {schemaPractitioners.map((p, rowIndex) => {
                const rowY = 40 + rowIndex * 55;
                return (
                  <g key={p.key}>
                    <text
                      x="8"
                      y={rowY + 33}
                      fontSize="16"
                      fill="#2B2B2B"
                    >
                      {p.label}
                    </text>
                    {schemaDayLabels.map((_, dayIndex) => {
                      const occupied = (p.days as readonly number[]).includes(dayIndex);
                      return (
                        <rect
                          key={`${p.key}-${dayIndex}`}
                          x={160 + dayIndex * 80 + 4}
                          y={rowY}
                          width="72"
                          height="44"
                          rx="6"
                          fill={occupied ? p.color : "#F6F5F0"}
                          stroke="#2B2B2B"
                          strokeOpacity={occupied ? 0 : 0.15}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </section>

      {/* ── SECTION 2 : Grille tarifaire ── */}
      <section className="section-padding bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title">{t("cabinetJournee.pricingTitle")}</h2>
            <p className="section-subtitle mx-auto">{t("cabinetJournee.pricingSubtitle")}</p>
            <p className="text-sm text-muted-foreground/80 leading-relaxed mt-3 max-w-2xl mx-auto">
              {t("cabinetJournee.pricingLeaseNote")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            {pricingTiers.map((tier) => (
              <div key={tier.id} className="card-premium text-center">
                <p className="text-base font-heading font-semibold mb-3">{tier.label}</p>
                <p className="text-2xl font-heading font-bold text-primary">{tier.price}</p>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">
                  {t("cabinetJournee.pricingIncludesTitle")}
                </span>{" "}
                {t("cabinetJournee.pricingIncludes")}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">
                  {t("cabinetJournee.pricingExcludesTitle")}
                </span>{" "}
                {t("cabinetJournee.pricingExcludes")}
              </p>
            </div>
            <p className="text-sm text-muted-foreground/80 leading-relaxed pt-2">
              {t("cabinetJournee.pricingWifi")}
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 : Nos cabinets ── */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title">{t("cabinetJournee.sitesTitle")}</h2>
            <p className="section-subtitle mx-auto">{t("cabinetJournee.sitesSubtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {STATIC_CENTRES.map((centre) => {
              const linkTo = centre.slug
                ? localePath(lang, "projects", centre.slug)
                : localePath(lang, "contact");
              const heroImg = centre.slug ? PROJECT_IMAGES[centre.slug]?.hero : undefined;
              return (
                <Link
                  key={centre.id}
                  to={linkTo}
                  className="card-premium overflow-hidden flex flex-col gap-3 hover:shadow-elevated transition-shadow"
                >
                  {heroImg && (
                    <div className="relative w-full h-32 -mt-6 md:-mt-8 -mx-6 md:-mx-8 mb-1 overflow-hidden">
                      <FadeImage
                        src={heroImg}
                        alt={t("cabinetJournee.siteImageAlt", { name: centre.name })}
                        className="w-full h-full object-cover"
                        fadeDuration={400}
                      />
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>
                      <span className="block font-heading font-semibold text-foreground">
                        {centre.name}
                      </span>
                      <span className="block text-xs text-muted-foreground/70 mt-1">
                        {centre.address}
                      </span>
                    </span>
                  </div>
                  <span
                    className={`self-start text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow-sm ${statusBadgeClass(centre.status)}`}
                  >
                    {statusLabel(centre.status)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 4 : FAQ ── */}
      <section className="section-padding bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center">{t("cabinetJournee.faqTitle")}</h2>
            <Accordion type="single" collapsible className="mt-10">
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-base font-medium">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent
                    forceMount
                    className="text-muted-foreground leading-relaxed"
                  >
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ── SECTION 5 : CTA final ── */}
      <section className="section-padding bg-foreground">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4 text-background">
              {t("cabinetJournee.ctaTitle")}
            </h2>
            <p className="text-background/70 text-lg mb-8">
              {t("cabinetJournee.ctaDesc")}
            </p>
            <Button variant="hero" asChild>
              <Link to={localePath(lang, "contact")}>
                {t("common.contactUs")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
