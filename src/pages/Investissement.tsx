import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Users2,
  Building2,
  CheckCircle2,
  FileText,
  Phone,
  BarChart3,
  Landmark,
  Briefcase,
  UserCheck,
} from "lucide-react";
import heroBuilding from "@/assets/hero-building.jpg";

const healthcaseDrivers = [
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

const modelSteps = [
  {
    number: "01",
    title: "Acquisition",
    description:
      "Identification et sécurisation d'actifs immobiliers à fort potentiel dans des zones en tension médicale. Audit technique, juridique et réglementaire approfondi.",
  },
  {
    number: "02",
    title: "Transformation",
    description:
      "Réhabilitation architecturale avec nos partenaires spécialisés. Conception d'espaces conformes aux normes sanitaires, ergonomiques et accessibles.",
  },
  {
    number: "03",
    title: "Mise en exploitation",
    description:
      "Commercialisation ciblée auprès des professionnels de santé. Constitution d'une offre pluridisciplinaire équilibrée adaptée au bassin de population.",
  },
  {
    number: "04",
    title: "Stabilisation",
    description:
      "Gestion locative et technique sur le long terme. Maintenance préventive, animation du collectif de praticiens et optimisation continue de la valeur d'usage.",
  },
];

const investorProfiles = [
  {
    icon: Landmark,
    title: "Family offices",
    description:
      "Recherche de diversification patrimoniale dans un actif tangible à impact sociétal mesurable. Horizon long terme, revenus récurrents.",
    features: [
      "Actif tangible et résilient",
      "Revenus locatifs stables",
      "Valorisation patrimoniale",
    ],
  },
  {
    icon: Briefcase,
    title: "Investisseurs privés",
    description:
      "Accès à une classe d'actifs habituellement réservée aux institutionnels. Ticket d'entrée adapté et accompagnement dédié.",
    features: [
      "Ticket accessible dès 500K€",
      "Reporting transparent",
      "Accompagnement personnalisé",
    ],
  },
  {
    icon: UserCheck,
    title: "Partenaires stratégiques",
    description:
      "Co-développement de programmes immobiliers de santé. Synergies opérationnelles avec les acteurs de la construction, de l'architecture ou de la gestion d'actifs.",
    features: [
      "Co-investissement ou club deal",
      "Mandat de gestion possible",
      "Pipeline de projets qualifiés",
    ],
  },
];

const operationProfile = [
  { label: "Ticket d'investissement", value: "500K€ – 3M€" },
  { label: "Rendement locatif cible", value: "6 – 8 % brut" },
  { label: "Durée moyenne des baux", value: "6 – 9 ans" },
  { label: "Horizon de détention", value: "7 – 10 ans" },
  { label: "Taille des actifs", value: "400 – 2 000 m²" },
  { label: "Géographie", value: "Nouvelle-Aquitaine, Occitanie" },
];

export default function Investissement() {
  return (
    <Layout>
      <Helmet>
        <title>Investissement immobilier de santé — I-CA.RE</title>
        <meta
          name="description"
          content="Investissez dans l'immobilier de santé nouvelle génération : actifs résilients, rendement locatif 6-8 %, vacance inférieure à 3 %. Découvrez le modèle I-CA.RE."
        />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center pt-20">
        <div className="absolute inset-0">
          <img
            src={heroBuilding}
            alt="Immeuble de santé I-CA.RE en cours de rénovation à Bordeaux"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/40" />
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 border border-background/30 text-background/80 text-sm font-medium rounded-full mb-6 opacity-0 animate-fade-up">
              Investissement immobilier de santé
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight mb-6 opacity-0 animate-fade-up stagger-1">
              Investir dans l'immobilier de santé nouvelle génération
            </h1>
            <p className="text-xl md:text-2xl text-background/70 leading-relaxed mb-10 opacity-0 animate-fade-up stagger-2">
              Des actifs sécurisés, durables et à forte valeur d'usage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up stagger-3">
              <Button
                variant="hero"
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link to="/contact">
                  <FileText className="mr-2 h-5 w-5" />
                  Télécharger la note d'investissement
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
      <section className="py-8 bg-secondary border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "<3%", label: "vacance locative" },
              { value: "6–9 ans", label: "durée moyenne des baux" },
              { value: "3", label: "opérations en portefeuille" },
              { value: "1 850 m²", label: "de surfaces gérées" },
            ].map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-foreground">
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
            {healthcaseDrivers.map((driver, index) => (
              <div
                key={driver.title}
                className="bg-secondary rounded-2xl p-8 border border-border"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl font-bold text-primary/30">
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

      {/* Notre modèle */}
      <section className="section-padding bg-foreground text-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
              Notre modèle opérationnel
            </h2>
            <p className="text-background/70 text-lg">
              Une chaîne de valeur intégrée, de l'acquisition à la gestion long
              terme.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {modelSteps.map((step) => (
                <div
                  key={step.number}
                  className="relative bg-background/8 border border-background/15 rounded-2xl p-8"
                >
                  <span className="text-5xl font-bold text-primary/40 absolute top-6 right-8">
                    {step.number}
                  </span>
                  <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-background/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
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
                className="bg-background border border-border rounded-2xl p-8 hover:shadow-card transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                  <profile.icon className="w-7 h-7 text-foreground" />
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

      {/* Profil type d'opération */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title mb-6 text-center">
              Profil type d'une opération
            </h2>
            <p className="text-muted-foreground text-center mb-12">
              Paramètres indicatifs, susceptibles de varier selon les
              caractéristiques de chaque projet.
            </p>

            <div className="bg-background rounded-2xl border border-border overflow-hidden">
              {operationProfile.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex justify-between items-center px-8 py-5 ${
                    index < operationProfile.length - 1
                      ? "border-b border-border"
                      : ""
                  }`}
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              Les performances passées ne préjugent pas des performances futures.
              Ces données sont fournies à titre indicatif.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Échangeons sur vos objectifs
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Recevez notre note d'investissement détaillée ou planifiez un
              entretien confidentiel avec notre équipe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <Link to="/contact">
                  <FileText className="mr-2 h-5 w-5" />
                  Télécharger la note d'investissement
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
