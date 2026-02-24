import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
} from "lucide-react";
import heroBuilding from "@/assets/hero-building.jpg";

const modelStepsData = [
  {
    number: "01",
    titleKey: "acquisition",
    descKey: "acquisitionDesc",
  },
  {
    number: "02",
    titleKey: "requalification",
    descKey: "requalificationDesc",
  },
  {
    number: "03",
    titleKey: "stabilisation",
    descKey: "stabilisationDesc",
  },
  {
    number: "04",
    titleKey: "exit",
    descKey: "exitDesc",
  },
];

export default function Investissement() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const modelSteps = [
    {
      number: "01",
      title: lang === "en" ? "Acquisition" : "Acquisition",
      description: lang === "en"
        ? "Identification and acquisition of undervalued urban ground floors (vacant retail, obsolete premises) in areas with strong healthcare demand."
        : "Identification et sécurisation de rez-de-chaussée urbains sous-valorisés (commerces vacants, locaux obsolètes) dans des zones à forte demande de santé.",
    },
    {
      number: "02",
      title: lang === "en" ? "Requalification" : "Requalification",
      description: lang === "en"
        ? "Transformation into 7 to 10 healthcare and well-being offices (12–18 sqm each). Design optimised for confidentiality, acoustic performance and comfort."
        : "Transformation en 7 à 10 cabinets de santé et bien-être (12–18 m² chacun). Conception optimisée pour la confidentialité, la performance acoustique et le confort.",
    },
    {
      number: "03",
      title: lang === "en" ? "Stabilisation" : "Stabilisation",
      description: lang === "en"
        ? "Targeted leasing to healthcare professionals. Occupancy within 24 to 36 months. Granular multi-tenant structure reducing vacancy risk."
        : "Commercialisation ciblée auprès des professionnels de santé. Remplissage locatif en 24 à 36 mois. Structure multi-locataires granulaire réduisant le risque de vacance.",
    },
    {
      number: "04",
      title: lang === "en" ? "Exit" : "Cession",
      description: lang === "en"
        ? "Sale of the stabilised asset after 4 years. The sponsor leads the exit strategy in coordination with the investor."
        : "Revente de l'actif stabilisé après 4 ans. Le sponsor pilote la stratégie de sortie en coordination avec l'investisseur.",
    },
  ];

  const partnerEncarts = [
    {
      icon: Landmark,
      title: lang === "en" ? "Banks & Credit Institutions" : "Banques & établissements de crédit",
      description: lang === "en"
        ? "Structured operation financing, complete dossiers, sponsor-led. Each project includes senior debt (~60% LTV) at asset level."
        : "Financement d'opérations structurées, dossiers complets, sponsor-led. Chaque projet fait l'objet d'un montage avec dette senior (~60 % LTV) au niveau de l'actif.",
      cta: lang === "en" ? "Discuss Financing" : "Discuter d'un financement",
    },
    {
      icon: Search,
      title: lang === "en" ? "Estate Agents & Introducers" : "Agents immobiliers & apporteurs",
      description: lang === "en"
        ? "We are constantly sourcing 150 to 200 sqm undervalued ground floors in dense urban areas. Structured introduction fees."
        : "Nous recherchons en permanence des rez-de-chaussée de 150 à 200 m², sous-valorisés, en zone urbaine dense. Rémunération d'apport d'affaires structurée.",
      cta: lang === "en" ? "Submit a Property" : "Proposer un bien",
    },
    {
      icon: HandshakeIcon,
      title: lang === "en" ? "Landlords & Property Owners" : "Bailleurs & propriétaires",
      description: lang === "en"
        ? "Asset revaluation through complete requalification and multi-tenant leasing. Retain or sell a high-performing asset."
        : "Revalorisation de votre actif par une requalification complète et une commercialisation multi-locataires. Vous conservez ou cédez un bien performant.",
      cta: lang === "en" ? "Revalue My Asset" : "Revaloriser mon actif",
    },
  ];

  return (
    <Layout>
      <Helmet>
        <title>{lang === "en" ? "Healthcare Real Estate Investment — I-CA.RE" : "Investissement immobilier de santé — I-CA.RE"}</title>
        <meta
          name="description"
          content={lang === "en"
            ? "I-CA.RE transforms urban ground floors into healthcare spaces: 150–200 sqm, 7–10 offices, stabilisation in 24–36 months. Request our investment memo."
            : "I-CA.RE transforme des rez-de-chaussée urbains en espaces de santé : 150–200 m², 7–10 cabinets, stabilisation en 24–36 mois. Recevez notre note d'investissement."}
        />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center pt-20">
        <div className="absolute inset-0">
          <img src={heroBuilding} alt="" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/30" />
        </div>
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 border border-background/20 text-background/70 text-xs font-bold uppercase tracking-[0.1em] rounded-full mb-6 opacity-0 animate-fade-up">
              {t("investment.heroTag")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-background leading-tight mb-6 opacity-0 animate-fade-up stagger-1">
              {t("investment.heroTitle")}
            </h1>
            <p className="text-xl md:text-2xl text-background/70 leading-relaxed mb-10 opacity-0 animate-fade-up stagger-2">
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

      {/* Le concept */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="section-title mb-6">{t("investment.concept")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">{t("investment.conceptP1")}</p>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("investment.conceptP2")}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "150–200 m²", label: t("investment.surfacePerAsset") },
              { value: "7–10", label: t("investment.officesPerOp") },
              { value: "12–18 m²", label: t("investment.perOffice") },
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

      {/* Modèle d'exécution */}
      <section className="section-padding bg-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold mb-6 text-background">
              {t("investment.executionModel")}
            </h2>
            <p className="text-background/70 text-lg">{t("investment.executionModelDesc")}</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {modelSteps.map((step) => (
                <div key={step.number} className="relative bg-background/8 border border-background/15 rounded-xl p-8">
                  <span className="text-5xl font-heading font-bold text-primary/40 absolute top-6 right-8">{step.number}</span>
                  <h3 className="text-2xl font-heading font-semibold mb-4 text-background pr-16">{step.title}</h3>
                  <p className="text-background/70 leading-relaxed">{step.description}</p>
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
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">{t("investment.forInvestorsP1")}</p>
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
