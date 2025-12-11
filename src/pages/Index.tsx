import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Building2,
  Heart,
  MapPin,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Accessibility,
  Home,
  BadgeEuro,
} from "lucide-react";
import heroBuilding from "@/assets/hero-building.jpg";
import medicalOffice from "@/assets/medical-office.jpg";
import healthcareProfessional from "@/assets/healthcare-professional.jpg";

const services = [
  {
    icon: Building2,
    title: "Rénovation & Modernisation",
    description: "Transformation de bâtiments existants en espaces de santé modernes et fonctionnels.",
  },
  {
    icon: Users,
    title: "Conception Centrée Usagers",
    description: "Des espaces pensés pour le confort des praticiens et le bien-être des patients.",
  },
  {
    icon: Home,
    title: "Mise à Disposition de Cabinets",
    description: "Locaux clés en main, prêts à exercer, dans des emplacements stratégiques.",
  },
  {
    icon: Sparkles,
    title: "Gestion Intégrée Long Terme",
    description: "Maintenance, services et accompagnement pour vous concentrer sur votre métier.",
  },
];

const benefits = [
  {
    icon: Building2,
    title: "Cabinets Modernes & Ergonomiques",
    description: "Espaces pensés pour votre pratique quotidienne.",
  },
  {
    icon: Accessibility,
    title: "Accessibilité PMR",
    description: "Conformité totale aux normes d'accessibilité.",
  },
  {
    icon: MapPin,
    title: "Emplacements Stratégiques",
    description: "Au cœur des quartiers, proches des habitants.",
  },
  {
    icon: BadgeEuro,
    title: "Encadrement des Loyers",
    description: "Tarifs maîtrisés pour une installation sereine.",
  },
];

const projects = [
  {
    name: "Floirac",
    location: "Gironde",
    status: "En cours",
    progress: 65,
    description: "Centre de santé pluridisciplinaire de 800m²",
  },
  {
    name: "Bordeaux Bastide",
    location: "Gironde",
    status: "Livré",
    progress: 100,
    description: "Réhabilitation d'un immeuble historique",
  },
  {
    name: "Toulouse Saint-Cyprien",
    location: "Haute-Garonne",
    status: "Études",
    progress: 25,
    description: "Pôle paramédical de proximité",
  },
];

const impacts = [
  { value: "87%", label: "des Français concernés par les déserts médicaux" },
  { value: "6M", label: "de personnes sans médecin traitant en France" },
  { value: "+30%", label: "de départs en retraite de médecins d'ici 2030" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0">
          <img
            src={heroBuilding}
            alt="Centre de santé I-CA.RE"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-3 mb-6 opacity-0 animate-fade-up">
              {["Impact local", "Excellence technique", "Confort des praticiens", "Réhabilitation responsable"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary/20 text-foreground text-sm font-medium rounded-full"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 opacity-0 animate-fade-up stagger-1">
              Nous rénovons et transformons des lieux de santé
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8 opacity-0 animate-fade-up stagger-2">
              Pour offrir aux professionnels un cadre de travail exemplaire et aux habitants un accès facilité à des soins de qualité.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up stagger-3">
              <Button variant="hero" asChild>
                <Link to="/professionnels">
                  Professionnels de santé — Rejoindre I-CA.RE
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to="/collectivites">
                  Collectivités & Investisseurs — Collaborer
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="section-title">Ce que nous faisons</h2>
            <p className="section-subtitle mx-auto">
              Une approche globale pour créer des lieux de santé modernes, accessibles et durables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="card-premium opacity-0 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-5">
                  <service.icon className="w-7 h-7 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose I-CA.RE */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-title mb-6">
                Pourquoi les professionnels choisissent I-CA.RE
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Des espaces conçus avec et pour les professionnels de santé.
                Chaque détail est pensé pour faciliter votre quotidien.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="mt-8" asChild>
                <Link to="/professionnels">
                  Découvrir tous les avantages
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <img
                src={medicalOffice}
                alt="Cabinet médical moderne I-CA.RE"
                className="rounded-3xl shadow-elevated w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-background rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">+50 praticiens</p>
                    <p className="text-sm text-muted-foreground">nous font confiance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding bg-foreground text-background">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
                Nos projets en cours
              </h2>
              <p className="text-background/70 text-lg max-w-xl">
                Des transformations concrètes au service des territoires et de la santé de proximité.
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-6 md:mt-0 border-background/30 text-background hover:bg-background hover:text-foreground"
              asChild
            >
              <Link to="/projets">Voir tous les projets</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.name}
                className="bg-background/10 backdrop-blur rounded-2xl p-6 hover:bg-background/15 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/20 text-primary">
                    {project.status}
                  </span>
                  <span className="text-sm text-background/60">{project.location}</span>
                </div>
                <h3 className="text-2xl font-semibold mb-2">{project.name}</h3>
                <p className="text-background/70 mb-6">{project.description}</p>
                <div className="progress-bar bg-background/20">
                  <div
                    className="progress-bar-fill bg-primary"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="text-sm text-background/50 mt-2">{project.progress}% avancement</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Societal Impact */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img
                src={healthcareProfessional}
                alt="Professionnel de santé dans un cabinet I-CA.RE"
                className="rounded-3xl shadow-elevated w-full"
              />
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="section-title mb-6">Notre impact sociétal</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Face à la désertification médicale, nous agissons concrètement. Chaque projet I-CA.RE contribue à rapprocher les soins des habitants.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                {impacts.map((impact) => (
                  <div key={impact.label} className="text-center">
                    <p className="text-3xl md:text-4xl font-bold text-primary mb-2">
                      {impact.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{impact.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {[
                  "Lutte contre les déserts médicaux",
                  "Revalorisation du patrimoine bâti",
                  "Développement territorial durable",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <Button className="mt-8" asChild>
                <Link to="/vision">
                  Découvrir notre vision
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
              Prêt à rejoindre un cabinet I-CA.RE ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Exercez dans des locaux modernes, au cœur des quartiers, avec un accompagnement dédié.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <Link to="/professionnels#candidature">
                  Déposer ma candidature
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
