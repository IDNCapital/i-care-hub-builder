import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  Building2,
  Users,
  MapPin,
  TrendingUp,
  Shield,
  CheckCircle2,
} from "lucide-react";
import neighborhood from "@/assets/neighborhood.jpg";

const benefits = [
  {
    icon: Users,
    title: "Service de santé local",
    description: "Ramenez des professionnels de santé dans votre commune et améliorez l'accès aux soins pour vos administrés.",
  },
  {
    icon: Building2,
    title: "Revalorisation du bâti",
    description: "Donnez une nouvelle vie à des bâtiments sous-utilisés ou dégradés grâce à une réhabilitation de qualité.",
  },
  {
    icon: TrendingUp,
    title: "Emploi & attractivité",
    description: "Créez de l'emploi local et renforcez l'attractivité de votre territoire pour les habitants et les entreprises.",
  },
  {
    icon: Shield,
    title: "Sécurité & pérennité",
    description: "Bénéficiez d'un opérateur solide qui s'engage sur le long terme dans la gestion et l'animation du lieu.",
  },
];

const method = [
  {
    step: "01",
    title: "Diagnostic territorial",
    description: "Nous analysons les besoins de santé de votre commune et identifions les opportunités foncières.",
  },
  {
    step: "02",
    title: "Montage du projet",
    description: "Conception architecturale, études de faisabilité, et structuration financière du projet.",
  },
  {
    step: "03",
    title: "Réalisation",
    description: "Travaux de réhabilitation ou construction, dans le respect du patrimoine et des délais.",
  },
  {
    step: "04",
    title: "Installation & animation",
    description: "Recherche de praticiens, installation et gestion du centre sur le long terme.",
  },
];

export default function Collectivites() {
  return (
    <Layout>
      <Helmet>
        <title>Collectivités — I-CA.RE</title>
        <meta name="description" content="I-CA.RE accompagne les collectivités dans la lutte contre les déserts médicaux. Découvrez comment nous pouvons vous aider." />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-medium mb-4 block">Pour les collectivités</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-up">
                Luttez contre la désertification médicale
              </h1>
              <p className="text-xl text-muted-foreground mb-8 opacity-0 animate-fade-up stagger-1">
                I-CA.RE vous accompagne dans la création de centres de santé attractifs pour les professionnels et accessibles pour vos habitants.
              </p>
              <Button variant="hero" asChild className="opacity-0 animate-fade-up stagger-2">
                <Link to="/contact">
                  Organiser un rendez-vous
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div>
              <img
                src={neighborhood}
                alt="Quartier avec services de santé"
                className="rounded-3xl shadow-elevated w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Challenge */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="section-title mb-6">Le défi de l'accès aux soins</h2>
            <p className="text-lg text-muted-foreground">
              Partout en France, des communes font face au départ de leurs médecins, à la fermeture de cabinets, à l'allongement des délais pour obtenir un rendez-vous. Les habitants s'inquiètent. Les élus cherchent des solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: "11%", label: "de la population vit dans un désert médical" },
              { value: "58%", label: "des communes rurales ont perdu au moins un médecin depuis 10 ans" },
              { value: "6 mois", label: "délai moyen pour un premier rendez-vous chez un spécialiste" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-8 bg-secondary rounded-2xl">
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Method */}
      <section className="section-padding bg-foreground text-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
              Notre méthode pour vous aider
            </h2>
            <p className="text-background/70 text-lg">
              Un accompagnement complet, de l'identification des besoins à l'ouverture du centre.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {method.map((item) => (
              <div key={item.step} className="bg-background/10 backdrop-blur rounded-2xl p-6">
                <span className="text-primary text-4xl font-bold">{item.step}</span>
                <h3 className="text-xl font-semibold mt-4 mb-3">{item.title}</h3>
                <p className="text-background/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Les bénéfices pour votre territoire</h2>
            <p className="section-subtitle mx-auto">
              Un projet I-CA.RE, c'est bien plus qu'un centre de santé.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="card-premium text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-5">
                  <benefit.icon className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-primary font-medium">Exemple de réalisation</span>
              <h2 className="section-title mt-2">Floirac : un centre de santé exemplaire</h2>
            </div>

            <div className="bg-background rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold mb-2">Le contexte</h3>
                  <p className="text-muted-foreground">
                    Commune de 17 000 habitants en périphérie de Bordeaux, Floirac faisait face à un manque criant de professionnels de santé, avec un seul médecin généraliste pour l'ensemble du territoire.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">La solution I-CA.RE</h3>
                  <p className="text-muted-foreground">
                    Réhabilitation d'un ancien local commercial de 800m² en pôle de santé pluridisciplinaire, avec 8 cabinets, salle d'attente commune et accessibilité PMR complète.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: "8", label: "cabinets" },
                  { value: "12", label: "praticiens" },
                  { value: "800m²", label: "de surface" },
                  { value: "2025", label: "ouverture" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-4 bg-secondary rounded-xl">
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
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
              Parlons de votre territoire
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Vous êtes élu, directeur de cabinet ou responsable de l'urbanisme ? Rencontrons-nous pour étudier les solutions adaptées à votre commune.
            </p>
            <Button variant="hero" asChild>
              <Link to="/contact">
                Organiser un rendez-vous institutionnel
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
