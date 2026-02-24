import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Heart,
  Building2,
  CheckCircle2,
} from "lucide-react";
import heroBuilding from "@/assets/hero-building.jpg";

const advantages = [
  {
    icon: Shield,
    title: "Résilience du secteur santé",
    description: "L'immobilier de santé est un actif défensif, peu corrélé aux cycles économiques. Les besoins en soins sont structurels et croissants.",
  },
  {
    icon: TrendingUp,
    title: "Rendements stables",
    description: "Des baux longs avec des locataires à faible risque de défaillance. Un taux de vacance historiquement très faible.",
  },
  {
    icon: Heart,
    title: "Impact sociétal mesurable",
    description: "Chaque investissement contribue directement à améliorer l'accès aux soins dans les territoires qui en ont besoin.",
  },
  {
    icon: Building2,
    title: "Expertise opérationnelle",
    description: "I-CA.RE apporte une expertise complète : sourcing, réhabilitation, commercialisation et gestion long terme.",
  },
];

const process = [
  { step: "01", title: "Sourcing & Analyse", description: "Identification d'opportunités à fort potentiel dans des zones en tension médicale. Due diligence approfondie." },
  { step: "02", title: "Structuration", description: "Montage juridique et financier adapté. Possibilité d'investissement en direct ou via des véhicules dédiés." },
  { step: "03", title: "Réalisation", description: "Pilotage des travaux de réhabilitation avec des partenaires de confiance. Suivi qualité et délais." },
  { step: "04", title: "Exploitation", description: "Commercialisation auprès des professionnels de santé. Gestion locative et technique sur le long terme." },
];

const keyFigures = [
  { value: "+50M€", label: "d'actifs sous gestion cible" },
  { value: "7-8%", label: "de rendement locatif brut" },
  { value: "9 ans", label: "durée moyenne des baux" },
  { value: "<3%", label: "taux de vacance historique" },
];

export default function Investissement() {
  return (
    <Layout>
      <Helmet>
        <title>Investissement — I-CA.RE</title>
        <meta name="description" content="Investissez dans l'immobilier de santé avec I-CA.RE. Un secteur résilient, des rendements stables, un impact sociétal concret." />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-medium mb-4 block">Investissement</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-up">
                Investissez dans l'immobilier de santé
              </h1>
              <p className="text-xl text-muted-foreground mb-8 opacity-0 animate-fade-up stagger-1">
                Un secteur résilient, des rendements stables, un impact sociétal concret. Découvrez les opportunités I-CA.RE.
              </p>
              <Button variant="hero" asChild className="opacity-0 animate-fade-up stagger-2">
                <Link to="/contact">
                  Demander un dossier investisseur
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div>
              <img src={heroBuilding} alt="Immeuble de santé I-CA.RE" className="rounded-3xl shadow-elevated w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Key Figures */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {keyFigures.map((figure) => (
              <div key={figure.label} className="text-center p-8 bg-secondary rounded-2xl">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{figure.value}</p>
                <p className="text-muted-foreground">{figure.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Healthcare Real Estate */}
      <section className="section-padding bg-foreground text-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
              Pourquoi l'immobilier de santé ?
            </h2>
            <p className="text-background/70 text-lg">
              Une classe d'actifs défensive avec un potentiel de croissance structurel.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((advantage) => (
              <div key={advantage.title} className="bg-background/10 backdrop-blur rounded-2xl p-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-5">
                  <advantage.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{advantage.title}</h3>
                <p className="text-background/70">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Comment nous structurons nos opérations</h2>
            <p className="section-subtitle mx-auto">
              Une approche rigoureuse du sourcing à la gestion.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((item) => (
              <div key={item.step} className="card-premium">
                <span className="text-primary text-4xl font-bold">{item.step}</span>
                <h3 className="text-xl font-semibold mt-4 mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Thesis */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="section-title">Notre thèse d'investissement</h2>
            </div>

            <div className="bg-background rounded-3xl p-8 md:p-12">
              <div className="space-y-6">
                {[
                  "Focus sur les zones en tension médicale avec forte demande structurelle",
                  "Actifs de taille intermédiaire (500-2000m²) offrant liquidité et diversification",
                  "Réhabilitation de qualité pour attirer et fidéliser les meilleurs praticiens",
                  "Baux commerciaux longs (6-9-12 ans) avec professionnels de santé libéraux",
                  "Gestion active des actifs pour optimiser la valeur sur le long terme",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-lg">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-title mb-6">Partenariat & structuration</h2>
              <p className="text-lg text-muted-foreground mb-6">
                I-CA.RE propose différentes modalités de partenariat adaptées à vos objectifs d'investissement :
              </p>
              <div className="space-y-4">
                {[
                  { title: "Co-investissement", desc: "Participation directe sur des opérations sélectionnées" },
                  { title: "Club deal", desc: "Véhicule dédié regroupant plusieurs investisseurs" },
                  { title: "Mandat de gestion", desc: "Gestion d'actifs santé pour le compte de tiers" },
                ].map((item) => (
                  <div key={item.title} className="bg-secondary rounded-xl p-4">
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-foreground text-background rounded-3xl p-8 md:p-12">
              <h3 className="text-2xl font-semibold mb-6">Profil type d'une opération</h3>
              <div className="space-y-4">
                {[
                  { label: "Ticket d'investissement", value: "500K€ - 3M€" },
                  { label: "Rendement cible", value: "7-8% brut" },
                  { label: "Horizon de détention", value: "7-10 ans" },
                  { label: "Localisation", value: "Nouvelle-Aquitaine, Occitanie" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center pb-4 border-b border-background/20">
                    <span className="text-background/70">{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Intéressé par nos opportunités ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Recevez notre dossier investisseur complet avec le détail de nos opérations en cours et nos projections financières.
            </p>
            <Button variant="hero" asChild>
              <Link to="/contact">
                Demander le dossier investisseur
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
