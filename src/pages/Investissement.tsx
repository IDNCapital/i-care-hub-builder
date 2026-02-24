import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FileText,
  Phone,
  CheckCircle2,
  Landmark,
  Briefcase,
  UserCheck,
} from "lucide-react";
import heroBuilding from "@/assets/hero-building.jpg";

const financialModel = [
  { label: "Surface type", value: "180 m² (RDC)" },
  { label: "Acquisition", value: "500 000 €" },
  { label: "Travaux + ingénierie", value: "200 000 €" },
  { label: "Investissement total", value: "700 000 €" },
  { label: "Dette bancaire (60 %)", value: "420 000 €" },
  { label: "Apport investisseur (40 %)", value: "280 000 €" },
];

const revenueModel = [
  { label: "Loyer moyen par cabinet", value: "700 € / mois" },
  { label: "Nombre de cabinets", value: "9" },
  { label: "Loyers bruts annuels", value: "75 600 €" },
  { label: "Net après vacance et charges", value: "~70 000 € / an" },
  { label: "Cash-flow net après dette", value: "~40 000 € / an" },
];

const exitScenario = [
  { label: "Horizon de sortie cible", value: "4 ans" },
  { label: "Valeur de sortie estimée", value: "800 000 – 900 000 €" },
  { label: "TRI investisseur net cible", value: "15 – 18 %" },
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
    title: "Partage 80 / 20 jusqu'à 15 % de TRI",
    description:
      "Au-delà du hurdle, les profits sont répartis à 80 % pour l'investisseur et 20 % pour le sponsor, jusqu'à atteindre un TRI de 15 %.",
  },
  {
    number: "04",
    title: "Super promote au-delà de 15 %",
    description:
      "Au-delà de 15 % de TRI, les profits excédentaires sont partagés 50 / 50 entre l'investisseur et le sponsor.",
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
      "Diversification patrimoniale dans un actif tangible à impact sociétal mesurable. L'investisseur apporte 100 % de l'equity ; I-CA.RE apporte l'industrie.",
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
      "Accès à une classe d'actifs habituellement réservée aux institutionnels. Ticket d'entrée adapté, reporting dédié, structure entrepreneuriale.",
    features: [
      "Ticket à partir de 280 K€",
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

const governanceRoles = [
  {
    role: "Investisseur",
    contribution: "100 % de l'equity (40 % du total)",
    details: [
      "Apport en capital sur chaque opération",
      "Rendement préférentiel (hurdle 6 %)",
      "Priorité au remboursement intégral du capital",
      "Reporting régulier et droit de regard",
    ],
  },
  {
    role: "I-CA.RE (sponsor)",
    contribution: "100 % de l'industrie",
    details: [
      "Développement et sourcing des actifs",
      "Ingénierie, conception, pilotage des travaux",
      "Commercialisation et mise en location",
      "Asset management et stratégie de sortie",
    ],
  },
  {
    role: "Dette bancaire",
    contribution: "≈ 60 % LTV au niveau projet",
    details: [
      "Financement senior au niveau de chaque opération",
      "Pas de recours sur l'investisseur",
      "Garantie hypothécaire sur l'actif",
      "Amortissement sur la durée de détention",
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

export default function Investissement() {
  return (
    <Layout>
      <Helmet>
        <title>Investissement immobilier de santé — I-CA.RE</title>
        <meta
          name="description"
          content="Investissez dans l'immobilier de santé de proximité : TRI cible 15-18 %, structure de waterfall alignée, dette senior 60 %. Découvrez le modèle I-CA.RE."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center pt-20">
        <div className="absolute inset-0">
          <img
            src={heroBuilding}
            alt="Immeuble de santé I-CA.RE en cours de rénovation"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/30" />
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 border border-background/20 text-background/70 text-xs font-bold uppercase tracking-[0.1em] rounded-full mb-6 opacity-0 animate-fade-up">
              Investissement immobilier de santé
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-background leading-tight mb-6 opacity-0 animate-fade-up stagger-1">
              Un modèle d'investissement clair, aligné et discipliné
            </h1>
            <p className="text-xl md:text-2xl text-background/70 leading-relaxed mb-10 opacity-0 animate-fade-up stagger-2">
              Immobilier de santé de proximité. TRI cible 15–18 %. Structure waterfall avec hurdle 6 %.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up stagger-3">
              <Button
                variant="hero"
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link to="/contact">
                  <FileText className="mr-2 h-5 w-5" />
                  Recevoir la note d'investissement
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-background/30 text-background hover:bg-background hover:text-foreground"
              >
                <Link to="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Planifier un échange confidentiel
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Bar */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "280 K€", label: "ticket investisseur" },
              { value: "15–18 %", label: "TRI net cible" },
              { value: "6 %", label: "hurdle préférentiel" },
              { value: "4 ans", label: "horizon de sortie" },
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

      {/* Pourquoi la santé ? */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="section-title mb-6">
              Pourquoi l'immobilier de santé ?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              L'immobilier de santé de proximité se distingue par des
              fondamentaux solides : une demande portée par des tendances
              démographiques de long terme, une offre structurellement
              insuffisante et des locataires à risque de défaillance très faible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {healthcareDrivers.map((driver, index) => (
              <div
                key={driver.title}
                className="bg-card rounded-xl p-8 border border-border"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl font-heading font-bold text-primary/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">
                      {driver.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {driver.description}
                    </p>
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
            <h2 className="section-title mb-6 text-center">
              Analyse de profondeur de marché
            </h2>
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
                <p className="text-xs text-muted-foreground mt-4">Marché en expansion structurelle, alimentant la demande de locaux adaptés.</p>
              </div>
            </div>

            <div className="bg-background rounded-xl border border-border p-8 text-center">
              <p className="text-lg text-muted-foreground mb-4">
                Un actif I-CA.RE nécessite <span className="font-semibold text-foreground">7 à 10 praticiens</span> pour atteindre son remplissage cible.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Sur un bassin de 100 000 habitants, la profondeur de marché représente <span className="text-2xl font-heading font-bold text-primary">20 à 30×</span> nos besoins.
              </p>
              <p className="text-xs text-muted-foreground">
                Ratio calculé sur la base des densités régionales de psychologues et praticiens du bien-être. Chaque opération fait l'objet d'une étude de marché locale dédiée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modèle financier */}
      <section className="section-padding bg-card">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title mb-6 text-center">
              Modèle financier type
            </h2>
            <p className="text-muted-foreground text-center mb-12">
              Opération type : 180 m² en rez-de-chaussée, 9 cabinets, financement mixte dette/equity.
            </p>

            <div className="space-y-8">
              <DataTable title="Structure d'investissement" rows={financialModel} />
              <DataTable title="Revenus locatifs" rows={revenueModel} />
              <DataTable title="Scénario de sortie" rows={exitScenario} />
            </div>

            <p className="text-xs text-muted-foreground mt-6 text-center">
              Données indicatives basées sur une opération type. Les performances passées ne préjugent pas des performances futures. Chaque opération fait l'objet d'un mémorandum dédié.
            </p>
          </div>
        </div>
      </section>

      {/* Gouvernance & rôles */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="section-title mb-6 text-center">
              Gouvernance et répartition des rôles
            </h2>
            <p className="text-muted-foreground text-center mb-4">
              Une structure entrepreneuriale claire : l'investisseur apporte le capital, I-CA.RE apporte l'industrie. Le sponsor conserve la majorité en gouvernance pour garantir la discipline d'exécution.
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Il ne s'agit pas d'un fonds institutionnel, mais d'opérations entrepreneuriales structurées projet par projet.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {governanceRoles.map((item) => (
              <div
                key={item.role}
                className="bg-card border border-border rounded-xl p-8"
              >
                <h3 className="text-xl font-heading font-semibold mb-2">{item.role}</h3>
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

      {/* Waterfall */}
      <section className="section-padding bg-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold mb-6 text-background">
              Structure de distribution (waterfall)
            </h2>
            <p className="text-background/70 text-lg">
              Un mécanisme d'alignement des intérêts entre investisseur et sponsor, avec priorité absolue au remboursement du capital investi.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {waterfallSteps.map((step) => (
                <div
                  key={step.number}
                  className="relative bg-background/8 border border-background/15 rounded-xl p-8"
                >
                  <span className="text-5xl font-heading font-bold text-primary/40 absolute top-6 right-8">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-heading font-semibold mb-4 text-background pr-16">
                    {step.title}
                  </h3>
                  <p className="text-background/70 leading-relaxed">
                    {step.description}
                  </p>
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
            <h2 className="section-title mb-6 text-center">
              Feuille de route 2026–2028
            </h2>
            <p className="text-muted-foreground text-center">
              Un plan de développement progressif, ancré dans les métropoles du Grand Sud-Ouest.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="bg-background rounded-xl border border-border p-8">
              <span className="text-xs font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full bg-primary/15 text-primary inline-block mb-4">Phase 1</span>
              <h3 className="text-2xl font-heading font-bold mb-2">2026</h3>
              <p className="text-sm font-semibold text-foreground mb-4">Consolidation</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                4 à 5 opérations concentrées sur Bordeaux Métropole. Validation du modèle opérationnel à l'échelle.
              </p>
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
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                10 à 12 opérations réparties sur trois métropoles du Grand Sud-Ouest.
              </p>
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
              <p className="text-sm font-semibold text-foreground mb-4">Sortie portefeuille</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Cession du portefeuille stabilisé. Ouverture sélective de nouvelles géographies.
              </p>
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">Pistes d'expansion :</p>
                <p className="text-sm mt-1">La Rochelle, Nantes, Rennes</p>
                <p className="text-xs text-muted-foreground mt-2">Formats élargis possibles (modèle clinique privée)</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-8 text-center max-w-2xl mx-auto">
            Plan indicatif. I-CA.RE ne revendique pas de déploiement national. La croissance reste contrôlée, entrepreneuriale et concentrée sur des marchés maîtrisés.
          </p>
        </div>
      </section>

      {/* Profil investisseur */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="section-title mb-6">Profils d'investisseurs</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I-CA.RE s'adresse à des investisseurs qui recherchent un actif
              tangible, à rendement régulier, porteur de sens. Nous adaptons nos
              modalités de partenariat à chaque profil.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {investorProfiles.map((profile) => (
              <div
                key={profile.title}
                className="bg-card border border-border rounded-xl p-8 hover:shadow-card transition-shadow duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-6">
                  <profile.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{profile.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {profile.description}
                </p>
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
              Recevez notre mémorandum d'investissement détaillé ou planifiez un
              entretien confidentiel avec notre équipe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <Link to="/contact">
                  <FileText className="mr-2 h-5 w-5" />
                  Recevoir le mémorandum
                </Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Planifier un échange confidentiel
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
