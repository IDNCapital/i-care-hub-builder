import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import {
  FileText,
  Phone,
  Building2,
  Landmark,
  Search,
  HandshakeIcon,
  ArrowRight,
  Heart,
  Shield,
  Settings,
} from "lucide-react";
import { getDefaultHero } from "@/lib/projectImages";
import { FadeImage } from "@/components/FadeImage";
import { BrandName } from "@/components/BrandName";

export default function Investissement() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const pillars = [
    {
      icon: Heart,
      title: t("investment.pillar1Title"),
      description: t("investment.pillar1Desc"),
    },
    {
      icon: Shield,
      title: t("investment.pillar2Title"),
      description: t("investment.pillar2Desc"),
    },
    {
      icon: Settings,
      title: t("investment.pillar3Title"),
      description: t("investment.pillar3Desc"),
    },
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
          <FadeImage src={getDefaultHero("investissement")} alt={lang === "fr" ? "Façade – I‑CA.RE Nansouty" : "Facade – I‑CA.RE Nansouty"} className="w-full h-full object-cover" loading="eager" fadeDuration={500} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/30" />
        </div>
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 border border-background/20 text-background/70 text-xs font-bold uppercase tracking-[0.1em] rounded-full mb-6 opacity-0 animate-fade-up">
              {lang === "en" ? "Family-backed private real estate" : "Foncière privée familiale"}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-background leading-tight mb-6 opacity-0 animate-fade-up stagger-1">
              {lang === "en"
                ? <>Invest in <BrandName variant="light" />: a family-backed private real estate company serving community care</>
                : <>Investir dans <BrandName variant="light" /> : une foncière privée familiale au service de la santé de proximité</>}
            </h1>
            <p className="text-xl md:text-2xl text-background/70 leading-relaxed mb-10 opacity-0 animate-fade-up stagger-2">
              {lang === "en"
                ? "A responsible, long-term stewardship strategy, founded on useful, well-located and sustainably operated assets."
                : "Une stratégie patrimoniale responsable, fondée sur des actifs utiles, bien situés et durablement exploités."}
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

      {/* Le concept */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="section-title mb-6"><InlineBrand>{t("investment.concept")}</InlineBrand></h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6"><InlineBrand>{t("investment.conceptP1")}</InlineBrand></p>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("investment.conceptP2")}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "50–300 m²", label: t("investment.surfacePerAsset") },
              { value: "7–10", label: t("investment.officesPerOp") },
              { value: "~11–15 m²", label: t("investment.perOffice") },
              { value: "24–36 " + (lang === "en" ? "months" : "mois"), label: t("investment.stabilisation") },
            ].map((metric) => (
              <div key={metric.label} className="text-center bg-card rounded-xl border border-border p-6">
                <p className="text-2xl md:text-3xl font-heading font-bold text-foreground">{metric.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trois piliers */}
      <section className="section-padding bg-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold mb-6 text-background">
              {t("investment.executionModel")}
            </h2>
            <p className="text-background/70 text-lg">{t("investment.executionModelDesc")}</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="relative bg-background/8 border border-background/15 rounded-xl p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                    <pillar.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-4 text-background">{pillar.title}</h3>
                  <p className="text-background/70 leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pour les investisseurs (teaser) */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title mb-6">{t("investment.forInvestors")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4"><InlineBrand>{t("investment.forInvestorsP1")}</InlineBrand></p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10">{t("investment.forInvestorsP2")}</p>
            <Button variant="hero" asChild>
              <Link to={localePath(lang, "investmentInterest")}>
                <FileText className="mr-2 h-5 w-5" />
                {t("investment.ctaMemo")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">{t("investment.accessNote")}</p>
          </div>
        </div>
      </section>

      {/* Partenaires */}
      <section className="section-padding bg-card">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="section-title mb-6">{t("investment.partners")}</h2>
            <p className="text-muted-foreground text-lg">{t("investment.partnersDesc")}</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {partnerEncarts.map((partner) => (
              <div key={partner.title} className="bg-background border border-border rounded-xl p-8">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-6">
                  <partner.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-3">{partner.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{partner.description}</p>
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
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">{t("investment.exchangeTitle")}</h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">{t("investment.exchangeDesc")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
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
            <p className="text-xs text-muted-foreground mt-6">{t("investment.confidential")}</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
