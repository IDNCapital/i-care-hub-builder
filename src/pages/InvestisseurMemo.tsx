import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  FileText,
  Phone,
  CheckCircle2,
  Landmark,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { BrandName, InlineBrand } from "@/components/BrandName";

type AccessState = "loading" | "granted" | "denied";

/**
 * Server-side token validation via check-investor-access edge function.
 * Falls back to denied if no token or validation fails.
 */
function useInvestorAccess(): AccessState {
  const [state, setState] = useState<AccessState>("loading");

  useEffect(() => {
    const token = localStorage.getItem("icare_investor_token");
    // Also support legacy sessionStorage for backward compat
    const legacyToken = sessionStorage.getItem("icare_investor_access") === "granted";

    if (!token && !legacyToken) {
      setState("denied");
      return;
    }

    // If only legacy access (no real token), deny: legacy is no longer trusted
    if (!token) {
      sessionStorage.removeItem("icare_investor_access");
      setState("denied");
      return;
    }

    // Validate token server-side
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    fetch(`https://${projectId}.supabase.co/functions/v1/check-investor-access`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ access_token: token }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.valid) {
          setState("granted");
        } else {
          // Token invalid or expired: clear it
          localStorage.removeItem("icare_investor_token");
          setState("denied");
        }
      })
      .catch(() => {
        setState("denied");
      });
  }, []);

  return state;
}

const keyMetrics = [
  { label: "Surface type par actif", value: "50 – 300 m² (RDC)" },
  { label: "Densité", value: "~5 cabinets / 100 m²" },
  { label: "Loyer moyen par cabinet", value: "600 – 800 € / mois" },
  { label: "Structure de financement", value: "dette senior + equity investisseur" },
];

const performanceTargets = [
  { label: "Rendement courant stabilisé", value: "6 – 7 % / an" },
  { label: "TRI cible annualisé", value: "~10 %" },
  { label: "Horizon de détention", value: "moyen-long terme" },
  { label: "Vacance cible structurelle", value: "< 5 %" },
];

const waterfallSteps = [
  {
    number: "01",
    title: "Remboursement intégral du capital",
    description:
      "L'investisseur récupère 100 % de son apport initial avant toute distribution de plus-value.",
  },
  {
    number: "02",
    title: "Rendement préférentiel (hurdle 6 %)",
    description:
      "L'investisseur perçoit un rendement prioritaire de 6 % annualisé sur son capital investi, avant tout partage avec le sponsor.",
  },
  {
    number: "03",
    title: "Partage des profits",
    description:
      "Au-delà du hurdle, les profits sont répartis entre l'investisseur et le sponsor selon une clé définie contractuellement, alignant les intérêts sur la performance réelle.",
  },
];

const riskMitigation = [
  {
    title: "Granularité locative",
    description:
      "Chaque actif comprend 7 à 10 cabinets indépendants. Le départ d'un locataire n'affecte qu'une fraction marginale du revenu global.",
  },
  {
    title: "Diversification sectorielle",
    description:
      "Les locataires exercent des professions variées (psychologues, ostéopathes, sophrologues, diététiciens…), réduisant la corrélation de vacance.",
  },
  {
    title: "Gestion locale active",
    description:
      "Gestion directe de l'exploitation, la maintenance et la commercialisation des actifs, sans intermédiaire, au plus près du terrain.",
  },
  {
    title: "Demande structurelle",
    description:
      "La demande de locaux adaptés au soin est portée par des tendances démographiques de long terme et une pénurie chronique d'offre conforme.",
  },
];

const governanceRoles = [
  {
    role: "Investisseur",
    contribution: "Apport en capital",
    details: [
      "Apport en equity sur chaque opération",
      "Rendement préférentiel prioritaire",
      "Remboursement intégral avant tout partage",
      "Reporting régulier et transparence",
    ],
  },
  {
    role: "sponsor",
    rolePrefix: true,
    contribution: "Apport en industrie",
    details: [
      "Sourcing et sélection des actifs",
      "Ingénierie, conception, pilotage des travaux",
      "Commercialisation et mise en location",
      "Gestion patrimoniale et exploitation",
    ],
  },
  {
    role: "Dette bancaire",
    contribution: "Financement senior au niveau projet",
    details: [
      "Levier au niveau de chaque actif",
      "Pas de recours sur l'investisseur",
      "Garantie hypothécaire sur l'actif",
      "Amortissement sur la durée de détention",
    ],
  },
];

const healthcareDrivers = [
  {
    title: "Démographie structurelle",
    description:
      "Le vieillissement de la population et l'augmentation des maladies chroniques génèrent une demande croissante et non cyclique de soins de proximité.",
  },
  {
    title: "Pénurie d'offre adaptée",
    description:
      "Plus de 30 % des médecins généralistes partiront à la retraite d'ici 2030. Les locaux existants sont souvent vétustes, mal situés ou non conformes.",
  },
  {
    title: "Résilience locative",
    description:
      "Les professionnels de santé libéraux présentent un risque de défaillance très faible. Les baux sont longs et la vacance locative historiquement inférieure à 3 %.",
  },
  {
    title: "Soutien institutionnel",
    description:
      "Les politiques publiques encouragent activement la création de maisons et centres de santé, facilitant les partenariats avec les collectivités.",
  },
];

const investorProfiles = [
  {
    icon: Landmark,
    title: "Family offices",
    description:
      "Diversification patrimoniale dans un actif tangible à impact sociétal mesurable. L'investisseur apporte 100 % de l'equity ; le sponsor apporte l'industrie.",
    features: [
      "100 % de l'equity investisseur",
      "Revenus locatifs stables",
      "Gouvernance sponsor-led transparente",
    ],
  },
  {
    icon: Briefcase,
    title: "Investisseurs privés",
    description:
      "Accès à une classe d'actifs habituellement réservée aux institutionnels. Reporting dédié, structure entrepreneuriale, rendement régulier.",
    features: [
      "Rendement courant régulier",
      "Reporting transparent",
      "Accompagnement personnalisé",
    ],
  },
  {
    icon: UserCheck,
    title: "Partenaires stratégiques",
    description:
      "Co-développement d'opérations immobilières de santé. Synergies opérationnelles avec les acteurs de la construction, de l'architecture ou de la gestion d'actifs.",
    features: [
      "Co-investissement ou club deal",
      "Pipeline de projets qualifiés",
      "Structure entrepreneuriale, pas institutionnelle",
    ],
  },
];

function DataTable({ title, rows }: { title: string; rows: { label: string; value: string }[] }) {
  return (
    <div>
      <h3 className="text-lg font-heading font-semibold mb-4">{title}</h3>
      <div className="bg-background rounded-xl border border-border overflow-hidden">
        {rows.map((item, index) => (
          <div
            key={item.label}
            className={`flex justify-between items-center px-6 py-4 ${
              index < rows.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span className="text-muted-foreground text-sm">{item.label}</span>
            <span className="font-semibold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InvestisseurMemo() {
  const accessState = useInvestorAccess();
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  if (accessState === "denied") {
    return <Navigate to={localePath(lang, "investmentInterest")} replace />;
  }

  if (accessState === "loading") {
    return (
      <Layout>
        <Helmet>
          <title>Note d'investissement | I‑CA.RE</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <section className="pt-32 pb-20">
          <div className="container flex justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Note d'investissement | I‑CA.RE</title>
        <meta name="description" content="Note d'investissement I‑CA.RE : approche patrimoniale, mutualisation du risque locatif, gouvernance et feuille de route." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-primary/15 text-primary text-xs font-bold uppercase tracking-[0.1em] rounded-full mb-6">
              Espace investisseurs, Confidentiel
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              Note d'investissement
            </h1>
            <p className="text-xl text-muted-foreground">
              Approche patrimoniale, mutualisation du risque, gouvernance et feuille de route.
            </p>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "6–7 %", label: "rendement courant stabilisé" },
              { value: "~10 %", label: "TRI cible annualisé" },
              { value: "6 %", label: "hurdle préférentiel" },
              { value: "< 5 %", label: "vacance cible structurelle" },
            ].map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                  {metric.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi la santé */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="section-title mb-6">Pourquoi l'immobilier de santé ?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              L'immobilier de santé de proximité se distingue par des fondamentaux solides : une demande portée par des tendances démographiques de long terme, une offre structurellement insuffisante et des locataires à risque de défaillance très faible.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {healthcareDrivers.map((driver, index) => (
              <div key={driver.title} className="bg-card rounded-xl p-8 border border-border">
                <div className="flex items-start gap-4">
                  <span className="text-4xl font-heading font-bold text-primary/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">{driver.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{driver.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analyse de profondeur de marché */}
      <section className="section-padding bg-card">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title mb-6 text-center">Analyse de profondeur de marché</h2>
            <p className="text-muted-foreground text-center mb-12">
              La demande de locaux de santé et de bien-être repose sur des données démographiques vérifiables et une dynamique de marché structurelle.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="bg-background rounded-xl border border-border p-6">
                <p className="text-3xl font-heading font-bold text-foreground mb-1">77 000</p>
                <p className="text-sm text-muted-foreground mb-4">psychologues en exercice en France</p>
                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Occitanie</span>
                    <span className="font-semibold text-foreground">117,6 / 100 000 hab.</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Nouvelle-Aquitaine</span>
                    <span className="font-semibold text-foreground">108,6 / 100 000 hab.</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">Source : DREES 2024</p>
              </div>
              <div className="bg-background rounded-xl border border-border p-6">
                <p className="text-3xl font-heading font-bold text-foreground mb-1">53 Md€</p>
                <p className="text-sm text-muted-foreground mb-4">marché français du bien-être</p>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Croissance annuelle</span>
                    <span className="font-semibold text-foreground">+7 % / an</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">Marché en expansion structurelle.</p>
              </div>
            </div>
            <div className="bg-background rounded-xl border border-border p-8 text-center">
              <p className="text-lg text-muted-foreground mb-4">
                Un actif <BrandName /> nécessite <span className="font-semibold text-foreground">7 à 10 praticiens</span> pour atteindre son remplissage cible.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Sur un bassin de 100 000 habitants, la profondeur de marché représente <span className="text-2xl font-heading font-bold text-primary">20 à 30×</span> nos besoins.
              </p>
              <p className="text-xs text-muted-foreground">
                Chaque opération fait l'objet d'une étude de marché locale dédiée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modèle économique */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title mb-6 text-center">Modèle économique</h2>
            <p className="text-muted-foreground text-center mb-12">
              Une approche patrimoniale fondée sur des actifs granulaires, un rendement courant régulier et une mutualisation structurelle du risque locatif.
            </p>
            <div className="space-y-8">
              <DataTable title="Caractéristiques d'un actif type" rows={keyMetrics} />
              <DataTable title="Objectifs de performance" rows={performanceTargets} />
            </div>
            <p className="text-xs text-muted-foreground mt-6 text-center">
              Données indicatives. Les performances passées ne préjugent pas des performances futures. Les objectifs ne constituent pas une garantie.
            </p>
          </div>
        </div>
      </section>

      {/* Gouvernance */}
      <section className="section-padding bg-card">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="section-title mb-6 text-center">Gouvernance et répartition des rôles</h2>
            <p className="text-muted-foreground text-center mb-4">
              Une structure entrepreneuriale claire : l'investisseur apporte le capital, <BrandName /> apporte l'industrie. Le sponsor conserve la majorité en gouvernance pour garantir la discipline d'exécution.
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Il ne s'agit pas d'un fonds institutionnel, mais d'opérations entrepreneuriales structurées projet par projet.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {governanceRoles.map((item) => (
              <div key={item.role} className="bg-background border border-border rounded-xl p-8">
                <h3 className="text-xl font-heading font-semibold mb-2">
                  {(item as any).rolePrefix ? <><BrandName /> (sponsor)</> : item.role}
                </h3>
                <p className="text-sm font-semibold text-primary mb-5">{item.contribution}</p>
                <ul className="space-y-3">
                  {item.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mutualisation du risque */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="section-title mb-6 text-center">Mutualisation du risque locatif</h2>
            <p className="text-muted-foreground text-center text-lg">
              La granularité des actifs <BrandName /> constitue un mécanisme de protection intrinsèque du rendement.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {riskMitigation.map((item, index) => (
              <div key={item.title} className="bg-card rounded-xl p-8 border border-border">
                <div className="flex items-start gap-4">
                  <span className="text-4xl font-heading font-bold text-primary/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waterfall */}
      <section className="section-padding bg-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold mb-6 text-background">
              Structure de distribution
            </h2>
            <p className="text-background/70 text-lg">
              Un mécanisme d'alignement des intérêts entre investisseur et sponsor, avec priorité absolue au remboursement du capital investi.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {waterfallSteps.map((step) => (
                <div key={step.number} className="relative bg-background/8 border border-background/15 rounded-xl p-8">
                  <span className="text-5xl font-heading font-bold text-primary/40 absolute top-6 right-8">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-heading font-semibold mb-4 text-background pr-16">
                    {step.title}
                  </h3>
                  <p className="text-background/70 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feuille de route */}
      <section className="section-padding bg-card">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="section-title mb-6 text-center">Feuille de route 2026–2028</h2>
            <p className="text-muted-foreground text-center">
              Un plan de développement progressif, ancré dans les métropoles du Grand Sud-Ouest.
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="bg-background rounded-xl border border-border p-8">
              <span className="text-xs font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full bg-primary/15 text-primary inline-block mb-4">Phase 1</span>
              <h3 className="text-2xl font-heading font-bold mb-2">2026</h3>
              <p className="text-sm font-semibold text-foreground mb-4">Consolidation</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">4 à 5 opérations sur Bordeaux Métropole.</p>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bordeaux Métropole</span>
                  <span className="font-semibold">4–5 ops</span>
                </div>
              </div>
            </div>
            <div className="bg-background rounded-xl border border-border p-8">
              <span className="text-xs font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full bg-primary/15 text-primary inline-block mb-4">Phase 2</span>
              <h3 className="text-2xl font-heading font-bold mb-2">2027</h3>
              <p className="text-sm font-semibold text-foreground mb-4">Scaling</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">10 à 12 opérations sur trois métropoles.</p>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bordeaux</span>
                  <span className="font-semibold">4–5 ops</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Toulouse</span>
                  <span className="font-semibold">3–4 ops</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bayonne / BAB</span>
                  <span className="font-semibold">2–3 ops</span>
                </div>
              </div>
            </div>
            <div className="bg-background rounded-xl border border-border p-8">
              <span className="text-xs font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full bg-primary/15 text-primary inline-block mb-4">Phase 3</span>
              <h3 className="text-2xl font-heading font-bold mb-2">2028</h3>
              <p className="text-sm font-semibold text-foreground mb-4">Expansion régionale</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">Portefeuille stabilisé, extension géographique.</p>
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">Nouvelles métropoles envisagées :</p>
                <p className="text-sm mt-1">La Rochelle, Nantes, Rennes</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-8 text-center max-w-2xl mx-auto">
            Plan indicatif. La croissance reste contrôlée, entrepreneuriale et concentrée sur des marchés maîtrisés.
          </p>
        </div>
      </section>

      {/* Profils investisseurs */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="section-title mb-6">Profils d'investisseurs</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              <BrandName /> s'adresse à des investisseurs qui recherchent un actif tangible, à rendement régulier, porteur de sens.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {investorProfiles.map((profile) => (
              <div key={profile.title} className="bg-card border border-border rounded-xl p-8 hover:shadow-card transition-shadow duration-500">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-6">
                  <profile.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{profile.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{profile.description}</p>
                <ul className="space-y-3">
                  {profile.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
              Échangeons sur vos objectifs
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Planifiez un entretien confidentiel avec notre équipe pour approfondir le modèle <BrandName />.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <Link to={localePath(lang, "contact")}>
                  <Phone className="mr-2 h-5 w-5" />
                  {lang === "en" ? "Schedule a confidential call" : "Planifier un échange confidentiel"}
                </Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-6">
              Confidentialité garantie. Aucun engagement.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
