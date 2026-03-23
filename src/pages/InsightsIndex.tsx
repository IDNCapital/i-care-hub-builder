import { SeoHead } from "@/components/SeoHead";
import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { ArrowRight, MapPin, Euro, Ruler, Building2, Users, KeyRound } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BrandName } from "@/components/BrandName";
import { Helmet } from "react-helmet-async";

interface GuideLink {
  routeKey: string;
  icon: React.ElementType;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
}

const SECTIONS: { titleFr: string; titleEn: string; guides: GuideLink[] }[] = [
  {
    titleFr: "S'informer avant de s'installer",
    titleEn: "Before you set up",
    guides: [
      {
        routeKey: "insightsCabinetMedical",
        icon: MapPin,
        titleFr: "Comment trouver un cabinet médical ou paramédical à Bordeaux",
        titleEn: "How to find a medical or paramedical office in Bordeaux",
        descFr: "Emplacement, surface, budget, accessibilité, lieux mutualisés : les critères essentiels pour trouver un cabinet adapté à votre activité à Bordeaux.",
        descEn: "Location, size, budget, accessibility, shared spaces: the essential criteria for finding an office suited to your practice in Bordeaux.",
      },
      {
        routeKey: "insightsProfessions",
        icon: Users,
        titleFr: "Quelles professions peuvent partager un cabinet ou un espace de soins",
        titleEn: "Which professions can share an office or care space",
        descFr: "Psychologues, ostéopathes, diététiciens, sophrologues, naturopathes… Complémentarité, rythmes et confidentialité dans un cadre partagé.",
        descEn: "Psychologists, osteopaths, dietitians, sophrologists, naturopaths… Complementarity, schedules and confidentiality in a shared setting.",
      },
    ],
  },
  {
    titleFr: "Financement & démarches",
    titleEn: "Funding & decisions",
    guides: [
      {
        routeKey: "insightsBudget",
        icon: Euro,
        titleFr: "Quel budget prévoir pour ouvrir un cabinet à Bordeaux",
        titleEn: "What budget to plan for opening an office in Bordeaux",
        descFr: "Loyer, dépôt de garantie, travaux, mobilier, assurances, trésorerie : un tour d'horizon réaliste des coûts à anticiper, poste par poste.",
        descEn: "Rent, deposit, renovations, furniture, insurance, cash reserve: a realistic breakdown of costs to anticipate, item by item.",
      },
      {
        routeKey: "insightsLouerAcheter",
        icon: KeyRound,
        titleFr: "Faut-il louer ou acheter son cabinet médical ou paramédical",
        titleEn: "Should you rent or buy your medical office",
        descFr: "Souplesse, patrimoine, maturité professionnelle : les critères concrets pour choisir l'option la plus adaptée à votre situation.",
        descEn: "Flexibility, equity, professional maturity: the concrete criteria for choosing the option best suited to your situation.",
      },
    ],
  },
  {
    titleFr: "Aménager son cabinet",
    titleEn: "Fitting out your office",
    guides: [
      {
        routeKey: "insightsSurface",
        icon: Ruler,
        titleFr: "Quelle surface faut-il pour un cabinet médical ou paramédical",
        titleEn: "What size do you need for a medical or paramedical office",
        descFr: "De 11 à 18 m² selon votre métier : surfaces minimales réalistes, rôle des parties communes, erreurs de surdimensionnement à éviter.",
        descEn: "From 11 to 18 sqm depending on your profession: realistic minimum areas, the role of shared spaces, and oversizing mistakes to avoid.",
      },
      {
        routeKey: "insightsTransformer",
        icon: Building2,
        titleFr: "Peut-on transformer un local commercial en cabinet médical ou paramédical",
        titleEn: "Can you convert a commercial space into a medical office",
        descFr: "Urbanisme, destination du local, normes ERP, copropriété, acoustique, coût des travaux : les étapes et points de vigilance avant de se lancer.",
        descEn: "Planning rules, designated use, ERP standards, co-ownership, acoustics, renovation costs: the steps and checkpoints before starting.",
      },
    ],
  },
];

const FAQ_ITEMS = {
  fr: [
    { q: "À qui s'adressent ces guides ?", a: "Aux praticiens du soin, du paramédical et du bien-être qui préparent leur installation en cabinet individuel ou en espace partagé, notamment à Bordeaux et en Nouvelle-Aquitaine." },
    { q: "Quel budget minimum prévoir pour s'installer ?", a: "En espace mutualisé, comptez entre 1 500 et 3 000 € pour démarrer (dépôt + mobilier léger). En cabinet seul, le budget initial se situe plutôt entre 10 000 et 30 000 € selon l'ampleur des travaux." },
    { q: "Quelle surface pour un cabinet de consultation ?", a: "Entre 11 et 18 m² selon votre profession. Un psychologue a besoin de 11 à 14 m², un ostéopathe de 14 à 18 m². Les parties communes (attente, sanitaires) peuvent être mutualisées." },
    { q: "Peut-on exercer dans un local commercial ?", a: "Oui, sous conditions : le local doit être compatible avec un usage de soins (destination urbanisme, normes ERP, accessibilité PMR). Des travaux sont souvent nécessaires." },
    { q: "Quels sont les avantages d'un espace partagé ?", a: "Charges réduites, salle d'attente commune, environnement professionnel structuré, moindre isolement et possibilité de démarrer son activité sans investissement lourd." },
    { q: "Vaut-il mieux louer ou acheter son cabinet ?", a: "En début d'activité, la location offre plus de souplesse. L'achat peut se justifier après plusieurs années d'exercice, lorsque la situation financière est stabilisée et les besoins bien identifiés." },
    { q: "Comment choisir le bon quartier à Bordeaux ?", a: "Privilégiez l'accessibilité (transports, stationnement), la cohérence avec votre patientèle cible et la qualité d'ambiance du quartier. Les Chartrons, Nansouty et le Jardin Public sont des secteurs appréciés des praticiens." },
    { q: "I‑CA.RE accompagne-t-il les praticiens dans leur installation ?", a: "Oui. I‑CA.RE propose des espaces de consultation prêts à exercer à Bordeaux, conçus spécifiquement pour les praticiens du soin et du bien-être." },
  ],
  en: [
    { q: "Who are these guides for?", a: "Care, allied health and wellbeing practitioners preparing to set up in a private office or shared care space, particularly in Bordeaux and Nouvelle-Aquitaine." },
    { q: "What is the minimum budget to get started?", a: "In a shared space, expect €1,500–3,000 to start (deposit + basic furniture). For a standalone office, initial budgets range from €10,000 to €30,000 depending on renovation scope." },
    { q: "What size for a consultation office?", a: "Between 11 and 18 sqm depending on your profession. A psychologist needs 11–14 sqm, an osteopath 14–18 sqm. Common areas (waiting room, toilets) can be shared." },
    { q: "Can you practise in a commercial space?", a: "Yes, under certain conditions: the space must be compatible with care use (planning designation, ERP standards, disabled access). Renovations are often required." },
    { q: "What are the advantages of a shared space?", a: "Lower overheads, shared waiting area, structured professional environment, less isolation and the ability to start without heavy investment." },
    { q: "Should you rent or buy your office?", a: "When starting out, renting offers more flexibility. Buying may make sense after several years of practice, once finances are stable and needs are well identified." },
    { q: "How to choose the right neighbourhood in Bordeaux?", a: "Prioritise accessibility (transport, parking), alignment with your target patients and neighbourhood ambiance. Chartrons, Nansouty and Jardin Public are popular with practitioners." },
    { q: "Does I‑CA.RE help practitioners set up?", a: "Yes. I‑CA.RE offers ready-to-use consultation spaces in Bordeaux, specifically designed for care and wellbeing practitioners." },
  ],
};

export default function InsightsIndex() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const faqItems = FAQ_ITEMS[lang];

  /* FAQ JSON-LD */
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <Layout>
      <SeoHead
        title={lang === "fr" ? "Guides pratiques pour s'installer | I‑CA.RE" : "Practical guides for setting up | I‑CA.RE"}
        description={lang === "fr"
          ? "Guides concrets pour les praticiens du soin, du paramédical et du bien-être : trouver un cabinet, comprendre les coûts, choisir la bonne surface et préparer sereinement son installation."
          : "Practical guides for care, allied health and wellbeing practitioners: finding an office, understanding costs, choosing the right size and setting up with confidence."}
        path={lang === "fr" ? "/insights" : "/en/insights"}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <div className="pt-28 pb-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            {lang === "fr"
              ? "Guides pratiques pour s'installer comme praticien"
              : "Practical guides for setting up as a practitioner"}
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-3">
            {lang === "fr"
              ? "Vous êtes praticien du soin, du paramédical ou du bien-être et vous préparez votre installation ? Trouver le bon local, anticiper les coûts, comprendre les normes, choisir entre location et achat : chaque étape soulève des questions concrètes auxquelles il n'est pas toujours facile de répondre seul."
              : "Are you a care, allied health or wellbeing practitioner preparing to set up? Finding the right space, anticipating costs, understanding regulations, choosing between renting and buying: each step raises practical questions that are not always easy to answer alone."}
          </p>

          <p className="text-muted-foreground leading-relaxed mb-3">
            {lang === "fr"
              ? "Cette section regroupe des guides pratiques, rédigés pour vous aider à y voir plus clair. Chaque article traite d'une question précise, avec des informations factuelles, des repères concrets et des conseils issus de l'expérience terrain."
              : "This section gathers practical guides written to help you see more clearly. Each article addresses a specific question, with factual information, concrete benchmarks and advice drawn from real-world experience."}
          </p>

          <p className="text-sm text-muted-foreground leading-relaxed mb-10 italic">
            {lang === "fr"
              ? "Ces guides s'adressent en priorité aux praticiens qui préparent leur installation dans un cabinet individuel ou un espace de soins partagé, notamment à Bordeaux et en Nouvelle-Aquitaine."
              : "These guides are primarily intended for practitioners preparing to set up in a private office or shared care space, particularly in Bordeaux and Nouvelle-Aquitaine."}
          </p>

          {/* Sections with H2 */}
          {SECTIONS.map((section, idx) => (
            <div key={idx} className="mb-10">
              <h2 className="text-2xl font-heading font-bold mb-4 pb-2 border-b border-border">
                {lang === "fr" ? section.titleFr : section.titleEn}
              </h2>
              <div className="grid gap-4">
                {section.guides.map((guide) => {
                  const Icon = guide.icon;
                  return (
                    <Link
                      key={guide.routeKey}
                      to={localePath(lang, guide.routeKey)}
                      className="group flex items-start gap-3.5 p-4 rounded-xl border border-border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                        <Icon className="w-4.5 h-4.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-heading font-semibold mb-1 group-hover:text-primary transition-colors leading-snug">
                          {lang === "fr" ? guide.titleFr : guide.titleEn}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-1.5">
                          {lang === "fr" ? guide.descFr : guide.descEn}
                        </p>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                          {lang === "fr" ? "Lire le guide" : "Read the guide"}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* FAQ */}
          <div className="mt-10">
            <h2 className="text-2xl font-heading font-bold mb-4 pb-2 border-b border-border">
              {lang === "fr" ? "Questions fréquentes" : "Frequently asked questions"}
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`}>
                  <AccordionTrigger className="text-left text-sm sm:text-base font-heading font-semibold">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <p className="text-muted-foreground mb-3">
              {lang === "fr"
                ? "Vous cherchez un cabinet adapté à votre pratique à Bordeaux ?"
                : "Looking for an office suited to your practice in Bordeaux?"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={localePath(lang, "locationBordeaux")}
                className="text-primary font-semibold underline underline-offset-4 hover:text-primary/80"
              >
                {lang === "fr" ? "Cabinets disponibles à Bordeaux" : "Available offices in Bordeaux"}
              </Link>
              <span className="hidden sm:inline text-muted-foreground">·</span>
              <Link
                to={localePath(lang, "installerCabinet")}
                className="text-primary font-semibold underline underline-offset-4 hover:text-primary/80"
              >
                {lang === "fr" ? "S'installer comme praticien" : "Setting up as a practitioner"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
