import { SeoHead } from "@/components/SeoHead";
import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";

const articles = [
  {
    routeKey: "insightsCabinetMedical",
    titleFr: "Comment trouver un cabinet médical ou paramédical à Bordeaux",
    titleEn: "How to find a medical or paramedical office in Bordeaux",
    descFr: "Emplacement, surface, budget, accessibilité : les critères essentiels pour trouver un cabinet adapté à votre activité à Bordeaux.",
    descEn: "Location, size, budget, accessibility: the essential criteria for finding an office suited to your practice in Bordeaux.",
  },
  {
    routeKey: "insightsBudget",
    titleFr: "Quel budget prévoir pour ouvrir un cabinet à Bordeaux",
    titleEn: "What budget to plan for opening an office in Bordeaux",
    descFr: "Loyer, travaux, charges, mobilier, assurances : un tour d'horizon réaliste des coûts à anticiper pour s'installer.",
    descEn: "Rent, renovations, charges, furniture, insurance: a realistic overview of costs to plan for when setting up.",
  },
  {
    routeKey: "insightsSurface",
    titleFr: "Quelle surface faut-il pour un cabinet médical ou paramédical",
    titleEn: "What size do you need for a medical or paramedical office",
    descFr: "Surface minimale, optimisation de l'espace, parties communes : comment dimensionner votre cabinet sans surdimensionner vos coûts.",
    descEn: "Minimum area, space optimisation, shared areas: how to size your office without oversizing your costs.",
  },
  {
    routeKey: "insightsTransformer",
    titleFr: "Peut-on transformer un local commercial en cabinet médical ou paramédical",
    titleEn: "Can you convert a commercial space into a medical office",
    descFr: "Urbanisme, normes ERP, copropriété, coût des travaux : ce qu'il faut savoir avant de transformer un local.",
    descEn: "Planning rules, ERP standards, co-ownership, renovation costs: what you need to know before converting a space.",
  },
  {
    routeKey: "insightsProfessions",
    titleFr: "Quelles professions peuvent partager un cabinet ou un espace de soins",
    titleEn: "Which professions can share an office or care space",
    descFr: "Complémentarité, rythmes, confidentialité : les métiers compatibles avec un exercice mutualisé dans des cabinets de 11 à 18 m².",
    descEn: "Complementarity, schedules, confidentiality: professions compatible with shared practice in 11–18 sqm offices.",
  },
  {
    routeKey: "insightsLouerAcheter",
    titleFr: "Faut-il louer ou acheter son cabinet médical ou paramédical",
    titleEn: "Should you rent or buy your medical office",
    descFr: "Souplesse, patrimoine, visibilité à long terme : les critères pour faire le bon choix selon votre situation professionnelle.",
    descEn: "Flexibility, wealth building, long-term visibility: the criteria for making the right choice for your situation.",
  },
];

export default function InsightsIndex() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  return (
    <Layout>
      <SeoHead
        title={lang === "fr" ? "Insights — S'installer comme praticien | I‑CA.RE" : "Insights — Setting up as a practitioner | I‑CA.RE"}
        description={lang === "fr"
          ? "Guides pratiques pour les praticiens : trouver un cabinet, comprendre les coûts, choisir la bonne surface et s'installer sereinement."
          : "Practical guides for practitioners: finding an office, understanding costs, choosing the right size and setting up with confidence."}
        path={lang === "fr" ? "/insights" : "/en/insights"}
      />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            {lang === "fr"
              ? "Guides pratiques pour s'installer comme praticien"
              : "Practical guides for setting up as a practitioner"}
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            {lang === "fr"
              ? "Vous êtes praticien du soin, du paramédical ou du bien-être et vous cherchez à vous installer ? Cette section regroupe des ressources concrètes pour vous aider à comprendre le marché, anticiper les coûts et faire les bons choix."
              : "Are you a care, allied health or wellbeing practitioner looking to set up? This section gathers practical resources to help you understand the market, anticipate costs and make the right decisions."}
          </p>

          <p className="text-muted-foreground leading-relaxed mb-12">
            {lang === "fr"
              ? "Chaque article traite d'une question précise, avec des informations factuelles et des repères concrets."
              : "Each article addresses a specific question, with factual information and concrete benchmarks."}
          </p>

          <div className="grid gap-6">
            {articles.map((article) => (
              <Link
                key={article.routeKey}
                to={localePath(lang, article.routeKey)}
                className="block p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-heading font-bold mb-2">
                  {lang === "fr" ? article.titleFr : article.titleEn}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {lang === "fr" ? article.descFr : article.descEn}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
