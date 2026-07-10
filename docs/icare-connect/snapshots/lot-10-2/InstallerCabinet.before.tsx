import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { ArrowRight, BookOpen, MapPin, Building2, Users, Euro, Ruler, KeyRound, Search, MessageSquare } from "lucide-react";
import { FadeImage } from "@/components/FadeImage";
import { getDefaultHero } from "@/lib/projectImages";
import { BrandName } from "@/components/BrandName";

const GUIDE_SECTIONS = {
  fr: [
    {
      title: "S'informer avant de s'installer",
      description: "Les fondamentaux pour bien préparer votre projet d'installation.",
      articles: [
        {
          routeKey: "insightsCabinetMedical",
          icon: MapPin,
          title: "Comment trouver un cabinet médical ou paramédical à Bordeaux",
          desc: "Emplacement, accessibilité, quartier : les critères essentiels pour choisir un cabinet adapté à votre pratique.",
        },
        {
          routeKey: "insightsProfessions",
          icon: Users,
          title: "Quelles professions peuvent partager un cabinet",
          desc: "Complémentarité des usages, rythmes, confidentialité : comment bien cohabiter dans un espace partagé.",
        },
      ],
    },
    {
      title: "Financement & démarches",
      description: "Budget, arbitrage location/achat et financement de votre installation.",
      articles: [
        {
          routeKey: "insightsBudget",
          icon: Euro,
          title: "Quel budget prévoir pour ouvrir un cabinet à Bordeaux",
          desc: "Loyer, dépôt de garantie, travaux, mobilier : un tour d'horizon réaliste des coûts, poste par poste.",
        },
        {
          routeKey: "insightsLouerAcheter",
          icon: KeyRound,
          title: "Faut-il louer ou acheter son cabinet",
          desc: "Souplesse, patrimoine, maturité professionnelle : les critères concrets pour choisir l'option adaptée.",
        },
      ],
    },
    {
      title: "Aménager son cabinet",
      description: "Surface, agencement et transformation de local : les repères pratiques.",
      articles: [
        {
          routeKey: "insightsSurface",
          icon: Ruler,
          title: "Quelle surface pour un cabinet médical ou paramédical",
          desc: "De 11 à 18 m² selon votre métier : surfaces minimales, parties communes, erreurs de surdimensionnement.",
        },
        {
          routeKey: "insightsTransformer",
          icon: Building2,
          title: "Transformer un local commercial en cabinet",
          desc: "Urbanisme, normes ERP, copropriété, acoustique : les étapes et points de vigilance avant de se lancer.",
        },
      ],
    },
  ],
  en: [
    {
      title: "Before you set up",
      description: "The fundamentals to prepare your practice setup project.",
      articles: [
        {
          routeKey: "insightsCabinetMedical",
          icon: MapPin,
          title: "How to find a medical or paramedical office in Bordeaux",
          desc: "Location, accessibility, neighbourhood: the essential criteria for choosing the right office.",
        },
        {
          routeKey: "insightsProfessions",
          icon: Users,
          title: "Which professions can share an office",
          desc: "Complementary practices, schedules, confidentiality: how to share a space successfully.",
        },
      ],
    },
    {
      title: "Funding & decisions",
      description: "Budget, rent-vs-buy decisions and financing your setup.",
      articles: [
        {
          routeKey: "insightsBudget",
          icon: Euro,
          title: "What budget to plan for opening an office in Bordeaux",
          desc: "Rent, deposit, renovations, furniture: a realistic cost breakdown, item by item.",
        },
        {
          routeKey: "insightsLouerAcheter",
          icon: KeyRound,
          title: "Should you rent or buy your office",
          desc: "Flexibility, equity, professional maturity: the concrete criteria for choosing the best option.",
        },
      ],
    },
    {
      title: "Fitting out your office",
      description: "Size, layout and space conversion: practical benchmarks.",
      articles: [
        {
          routeKey: "insightsSurface",
          icon: Ruler,
          title: "What size do you need for a medical office",
          desc: "From 11 to 18 sqm depending on your profession: minimum areas, shared spaces, oversizing mistakes.",
        },
        {
          routeKey: "insightsTransformer",
          icon: Building2,
          title: "Converting a commercial space into an office",
          desc: "Planning rules, ERP standards, co-ownership, acoustics: steps and checkpoints before starting.",
        },
      ],
    },
  ],
};

export default function InstallerCabinet() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const title =
    lang === "fr"
      ? "S'installer comme praticien : guides et cabinets disponibles"
      : "Setting up as a practitioner: guides and available offices";

  const metaDesc =
    lang === "fr"
      ? "Guides pratiques, conseils concrets et cabinets disponibles pour aider les praticiens du soin et du bien-être à préparer leur installation à Bordeaux."
      : "Practical guides, concrete advice and available offices to help care and wellbeing practitioners set up in Bordeaux.";

  const heroImage = getDefaultHero("professionnels");
  const sections = GUIDE_SECTIONS[lang];

  const quickPaths = lang === "fr"
    ? [
        { icon: Search, label: "Voir les cabinets disponibles", routeKey: "locationBordeaux" },
        { icon: Euro, label: "Comprendre les budgets", routeKey: "insightsBudget" },
        { icon: MessageSquare, label: "Échanger sur mon projet", routeKey: "professionals", hash: "#candidature" },
      ]
    : [
        { icon: Search, label: "See available offices", routeKey: "locationBordeaux" },
        { icon: Euro, label: "Understand budgets", routeKey: "insightsBudget" },
        { icon: MessageSquare, label: "Discuss my project", routeKey: "professionals", hash: "#candidature" },
      ];

  return (
    <Layout>
      <SeoHead
        title={`${lang === "fr" ? "S'installer comme praticien" : "Setting up as a practitioner"} | I‑CA.RE`}
        description={metaDesc}
        path={lang === "fr" ? "/installer-cabinet-praticien" : "/en/setting-up-practice"}
      />

      {/* Hero — compact */}
      <section className="relative min-h-[44vh] flex items-center pt-20">
        <div className="absolute inset-0">
          <FadeImage
            src={heroImage}
            alt={title}
            className="w-full h-full object-cover"
            loading="eager"
            fadeDuration={500}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/30" />
        </div>
        <div className="container relative z-10 py-14 md:py-16">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-primary/15 text-primary text-xs font-bold uppercase tracking-[0.1em] rounded-full mb-4">
              {lang === "fr" ? "Ressources praticiens" : "Practitioner Resources"}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight mb-4">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
              {lang === "fr"
                ? <>Vous préparez votre installation ? <BrandName /> rassemble ici des guides concrets, des repères pratiques et des cabinets disponibles pour vous accompagner à chaque étape.</>
                : <><BrandName /> brings together practical guides, concrete benchmarks and available offices to support you at every stage of your setup.</>}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="hero" asChild>
                <Link to={`${localePath(lang, "professionals")}#candidature`}>
                  {lang === "fr" ? "Échanger sur mon projet" : "Discuss my project"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to={localePath(lang, "locationBordeaux")}>
                  {lang === "fr" ? "Voir les cabinets disponibles" : "See available offices"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Par où commencer */}
      <section className="py-10 md:py-12">
        <div className="container max-w-5xl">
          <h2 className="text-lg md:text-xl font-heading font-bold mb-4">
            {lang === "fr" ? "Par où commencer ?" : "Where to start?"}
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {quickPaths.map((item) => {
              const Icon = item.icon;
              const to = item.hash
                ? `${localePath(lang, item.routeKey)}${item.hash}`
                : localePath(lang, item.routeKey);
              return (
                <Link
                  key={item.routeKey}
                  to={to}
                  className="group flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold group-hover:text-primary transition-colors">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guide Sections — tighter */}
      {sections.map((section, idx) => (
        <section key={idx} className="py-10 md:py-14">
          <div className="container max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-1.5">{section.title}</h2>
            <p className="text-muted-foreground mb-6">{section.description}</p>
            <div className="grid md:grid-cols-2 gap-4">
              {section.articles.map((article) => {
                const Icon = article.icon;
                return (
                  <Link
                    key={article.routeKey}
                    to={localePath(lang, article.routeKey)}
                    className="group block rounded-xl border border-border bg-card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4.5 h-4.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-heading font-semibold mb-1.5 group-hover:text-primary transition-colors leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                          {article.desc}
                        </p>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                          {lang === "fr" ? "Lire le guide" : "Read the guide"}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* Cabinets disponibles */}
      <section className="py-10 md:py-14 bg-muted/30">
        <div className="container max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2">
                {lang === "fr" ? "Cabinets disponibles à Bordeaux" : "Available offices in Bordeaux"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {lang === "fr"
                  ? "Découvrez nos espaces de consultation à Bordeaux : cabinets privatifs, espaces mutualisés, environnement calme et professionnel. Chaque lieu est pensé pour le soin."
                  : "Discover our consultation spaces in Bordeaux: private offices, shared spaces, calm and professional environments. Each space is designed for care."}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button variant="hero" asChild>
                <Link to={localePath(lang, "locationBordeaux")}>
                  {lang === "fr" ? "Voir les cabinets" : "View offices"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { slug: "i-ca-re-chartrons", name: "I‑CA.RE Chartrons" },
              { slug: "i-ca-re-nansouty", name: "I‑CA.RE Nansouty" },
              { slug: "i-ca-re-jardin-public", name: "I‑CA.RE Jardin Public" },
            ].map((project) => (
              <Link
                key={project.slug}
                to={localePath(lang, "projectDetail", project.slug)}
                className="group block rounded-xl border border-border bg-card p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-heading font-semibold group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">Bordeaux</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final — compact */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-3">
              {lang === "fr"
                ? "Vous cherchez un cabinet adapté à votre pratique ?"
                : "Looking for an office that fits your practice?"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              {lang === "fr"
                ? "Échangeons sur votre projet d'installation. Nos équipes vous accompagnent pour trouver le lieu idéal."
                : "Let's discuss your project. Our team will help you find the ideal space."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" asChild>
                <Link to={`${localePath(lang, "professionals")}#candidature`}>
                  {lang === "fr" ? "Échanger sur mon projet" : "Discuss my project"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to={localePath(lang, "locationBordeaux")}>
                  {lang === "fr" ? "Cabinets à Bordeaux" : "Offices in Bordeaux"}
                </Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              <Link to={localePath(lang, "insights")} className="text-primary underline underline-offset-4 hover:text-primary/80">
                {lang === "fr" ? "Consulter tous les guides pratiques" : "Browse all practical guides"}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
