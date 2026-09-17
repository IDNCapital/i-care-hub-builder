import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { STATIC_CENTRES } from "@/lib/centres";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Euro,
  MapPin,
  Users,
  XCircle,
} from "lucide-react";

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
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
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
              return (
                <Link
                  key={centre.id}
                  to={linkTo}
                  className="card-premium flex flex-col gap-3 hover:shadow-elevated transition-shadow"
                >
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
