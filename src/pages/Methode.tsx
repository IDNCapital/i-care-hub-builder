import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  Search,
  FileSearch,
  Ruler,
  HardHat,
  Users,
  Settings,
} from "lucide-react";
import renovationBeforeAfter from "@/assets/renovation-before-after.jpg";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Identification",
    description: "Nous identifions les territoires en tension médicale et les bâtiments à fort potentiel de transformation.",
    details: [
      "Analyse des besoins de santé locaux",
      "Cartographie des déserts médicaux",
      "Sourcing d'opportunités foncières",
      "Dialogue avec les élus locaux",
    ],
  },
  {
    icon: FileSearch,
    number: "02",
    title: "Diagnostic",
    description: "Nous réalisons une étude approfondie du bâtiment et de son environnement pour valider le potentiel du projet.",
    details: [
      "Audit technique du bâtiment",
      "Étude de marché",
      "Analyse réglementaire",
      "Faisabilité économique",
    ],
  },
  {
    icon: Ruler,
    number: "03",
    title: "Conception",
    description: "Nos partenaires architectes (Rivage IC et IDNéa) conçoivent des espaces optimisés pour la santé.",
    details: [
      "Plans fonctionnels métiers",
      "Parcours patient optimisé",
      "Accessibilité PMR",
      "Normes sanitaires",
    ],
  },
  {
    icon: HardHat,
    number: "04",
    title: "Travaux",
    description: "Notre partenaire Inside BAT pilote les travaux de réhabilitation avec exigence et respect des délais.",
    details: [
      "Maîtrise d'œuvre intégrée",
      "Suivi qualité permanent",
      "Respect du patrimoine",
      "Livraison clé en main",
    ],
  },
  {
    icon: Users,
    number: "05",
    title: "Commercialisation",
    description: "Nous recrutons les professionnels de santé et constituons une équipe pluridisciplinaire équilibrée.",
    details: [
      "Sourcing ciblé par profession",
      "Accompagnement installation",
      "Constitution d'équipe",
      "Intégration locale",
    ],
  },
  {
    icon: Settings,
    number: "06",
    title: "Installation & Gestion",
    description: "Nous accompagnons l'ouverture et assurons la gestion technique et locative sur le long terme.",
    details: [
      "Maintenance préventive",
      "Services mutualisés",
      "Animation du collectif",
      "Évolution des espaces",
    ],
  },
];

const partners = [
  {
    name: "Rivage IC",
    role: "Architecture & conception",
    description: "Cabinet d'architecture spécialisé dans les projets de santé et de bien-être.",
  },
  {
    name: "IDNéa",
    role: "Ingénierie & design",
    description: "Bureau d'études techniques pour l'optimisation des espaces de santé.",
  },
  {
    name: "Inside BAT",
    role: "Travaux & réalisation",
    description: "Entreprise générale de bâtiment, experte en réhabilitation de qualité.",
  },
];

export default function Methode() {
  return (
    <Layout>
      <Helmet>
        <title>Notre Méthode — I-CA.RE</title>
        <meta name="description" content="Découvrez la méthode I-CA.RE : 6 étapes pour transformer un bâtiment en lieu de santé moderne et attractif." />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-up">
              La Méthode I-CA.RE
            </h1>
            <p className="text-xl text-muted-foreground opacity-0 animate-fade-up stagger-1">
              Une approche structurée, de l'identification du besoin à l'ouverture du centre de santé.
            </p>
          </div>
        </div>
      </section>

      {/* Process Visual */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="section-title mb-6">6 étapes pour réussir</h2>
              <p className="text-lg text-muted-foreground">
                Chaque projet I-CA.RE suit une méthodologie éprouvée qui garantit la qualité de réalisation et le succès de l'exploitation. Du sourcing à la gestion, nous maîtrisons l'ensemble de la chaîne de valeur.
              </p>
            </div>
            <div>
              <img
                src={renovationBeforeAfter}
                alt="Avant/après rénovation I-CA.RE"
                className="rounded-3xl shadow-elevated w-full"
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <span className="text-6xl font-bold text-muted/30">{step.number}</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                  <p className="text-lg text-muted-foreground mb-6">{step.description}</p>
                </div>
                <div className={`bg-secondary rounded-2xl p-8 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <h4 className="font-semibold mb-4">Ce que nous faisons :</h4>
                  <ul className="space-y-3">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section-padding bg-foreground text-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
              Nos partenaires clés
            </h2>
            <p className="text-background/70 text-lg">
              Nous nous entourons des meilleurs experts pour garantir l'excellence de nos réalisations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <div key={partner.name} className="bg-background/10 backdrop-blur rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-semibold mb-2">{partner.name}</h3>
                <p className="text-primary font-medium mb-4">{partner.role}</p>
                <p className="text-background/70">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Vous avez un projet ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Que vous soyez professionnel de santé, élu ou investisseur, parlons de votre projet.
            </p>
            <Button variant="hero" asChild>
              <Link to="/contact">
                Nous contacter
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
