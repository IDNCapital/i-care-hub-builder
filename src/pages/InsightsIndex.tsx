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
    descFr: "Emplacement, surface, budget, accessibilité, lieux mutualisés : les critères essentiels pour trouver un cabinet adapté à votre activité à Bordeaux.",
    descEn: "Location, size, budget, accessibility, shared spaces: the essential criteria for finding an office suited to your practice in Bordeaux.",
  },
  {
    routeKey: "insightsBudget",
    titleFr: "Quel budget prévoir pour ouvrir un cabinet à Bordeaux",
    titleEn: "What budget to plan for opening an office in Bordeaux",
    descFr: "Loyer, dépôt de garantie, travaux, mobilier, assurances, trésorerie : un tour d'horizon réaliste des coûts à anticiper, poste par poste.",
    descEn: "Rent, deposit, renovations, furniture, insurance, cash reserve: a realistic breakdown of costs to anticipate, item by item.",
  },
  {
    routeKey: "insightsSurface",
    titleFr: "Quelle surface faut-il pour un cabinet médical ou paramédical",
    titleEn: "What size do you need for a medical or paramedical office",
    descFr: "De 11 à 18 m² selon votre métier : surfaces minimales réalistes, rôle des parties communes, erreurs de surdimensionnement à éviter.",
    descEn: "From 11 to 18 sqm depending on your profession: realistic minimum areas, the role of shared spaces, and oversizing mistakes to avoid.",
  },
  {
    routeKey: "insightsTransformer",
    titleFr: "Peut-on transformer un local commercial en cabinet médical ou paramédical",
    titleEn: "Can you convert a commercial space into a medical office",
    descFr: "Urbanisme, destination du local, normes ERP, copropriété, acoustique, coût des travaux : les étapes et points de vigilance avant de se lancer.",
    descEn: "Planning rules, designated use, ERP standards, co-ownership, acoustics, renovation costs: the steps and checkpoints before starting.",
  },
  {
    routeKey: "insightsProfessions",
    titleFr: "Quelles professions peuvent partager un cabinet ou un espace de soins",
    titleEn: "Which professions can share an office or care space",
    descFr: "Psychologues, ostéopathes, diététiciens, sophrologues, naturopathes… Complémentarité, rythmes et confidentialité dans un cadre partagé.",
    descEn: "Psychologists, osteopaths, dietitians, sophrologists, naturopaths… Complementarity, schedules and confidentiality in a shared setting.",
  },
  {
    routeKey: "insightsLouerAcheter",
    titleFr: "Faut-il louer ou acheter son cabinet médical ou paramédical",
    titleEn: "Should you rent or buy your medical office",
    descFr: "Souplesse, patrimoine, maturité professionnelle : les critères concrets pour choisir l'option la plus adaptée à votre situation.",
    descEn: "Flexibility, equity, professional maturity: the concrete criteria for choosing the option best suited to your situation.",
  },
];

export default function InsightsIndex() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  return (
    <Layout>
      <SeoHead
        title={lang === "fr" ? "Guides pratiques pour s'installer | I‑CA.RE" : "Practical guides for setting up | I‑CA.RE"}
        description={lang === "fr"
          ? "Guides concrets pour les praticiens du soin, du paramédical et du bien-être : trouver un cabinet, comprendre les coûts, choisir la bonne surface et préparer sereinement son installation."
          : "Practical guides for care, allied health and wellbeing practitioners: finding an office, understanding costs, choosing the right size and setting up with confidence."}
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
              ? "Vous êtes praticien du soin, du paramédical ou du bien-être et vous préparez votre installation ? Trouver le bon local, anticiper les coûts, comprendre les normes, choisir entre location et achat : chaque étape soulève des questions concrètes auxquelles il n'est pas toujours facile de répondre seul."
              : "Are you a care, allied health or wellbeing practitioner preparing to set up? Finding the right space, anticipating costs, understanding regulations, choosing between renting and buying: each step raises practical questions that are not always easy to answer alone."}
          </p>

          <p className="text-muted-foreground leading-relaxed mb-4">
            {lang === "fr"
              ? "Cette section regroupe des guides pratiques, rédigés pour vous aider à y voir plus clair. Chaque article traite d'une question précise, avec des informations factuelles, des repères concrets et des conseils issus de l'expérience terrain."
              : "This section gathers practical guides written to help you see more clearly. Each article addresses a specific question, with factual information, concrete benchmarks and advice drawn from real-world experience."}
          </p>

          <p className="text-sm text-muted-foreground leading-relaxed mb-12 italic">
            {lang === "fr"
              ? "Ces guides s'adressent en priorité aux praticiens qui préparent leur installation dans un cabinet individuel ou un espace de soins partagé, notamment à Bordeaux et en Nouvelle-Aquitaine."
              : "These guides are primarily intended for practitioners preparing to set up in a private office or shared care space, particularly in Bordeaux and Nouvelle-Aquitaine."}
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
