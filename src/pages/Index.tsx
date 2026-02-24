import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
  { icon: Building2, title: "Acquisition & Requalification", description: "Nous identifions des rez-de-chaussée urbains sous-valorisés — commerces vacants, locaux obsolètes — et les transformons en espaces de santé performants." },
  { icon: Users, title: "Conception Centrée Usagers", description: "Chaque espace est conçu pour la confidentialité, la performance acoustique et le confort des praticiens comme des patients." },
  { icon: Home, title: "Cabinets Clés en Main", description: "7 à 10 cabinets par actif, prêts à exercer, dans des emplacements de proximité au cœur des quartiers." },
  { icon: Sparkles, title: "Stabilisation & Gestion", description: "Remplissage locatif en 24 à 36 mois, gestion intégrée long terme, puis cession après 4 ans." },
];

const benefits = [
  { icon: Building2, title: "150–200 m² optimisés", description: "Surfaces de rez-de-chaussée pensées pour la santé et le bien-être." },
  { icon: Accessibility, title: "Accessibilité PMR", description: "Conformité totale aux normes d'accessibilité." },
  { icon: MapPin, title: "Emplacements de Proximité", description: "Au cœur des quartiers, proches des habitants." },
  { icon: BadgeEuro, title: "Loyers Maîtrisés", description: "Tarifs encadrés pour une installation sereine." },
];

const projects = [
  { name: "Floirac", location: "Gironde", status: "En cours", progress: 65, description: "Requalification d'un RDC de 180 m² en 9 cabinets de santé (12–18 m²)" },
  { name: "Bordeaux Bastide", location: "Gironde", status: "Livré", progress: 100, description: "Transformation d'un local vacant en 8 cabinets, loyers 600–800 €/mois" },
  { name: "Toulouse Saint-Cyprien", location: "Haute-Garonne", status: "Études", progress: 25, description: "Conversion d'un commerce obsolète en espace paramédical de 150 m²" },
];

const impacts = [
  { value: "87%", label: "des Français concernés par les déserts médicaux" },
  { value: "6M", label: "de personnes sans médecin traitant en France" },
  { value: "+30%", label: "de départs en retraite de médecins d'ici 2030" },
];

export default function Index() {
  return (
    <Layout>
      <Helmet>
        <title>I-CA.RE — Rénovation de lieux de santé | Cabinets médicaux clé en main</title>
        <meta name="description" content="I-CA.RE transforme des rez-de-chaussée urbains en espaces de santé et de bien-être : 150–200 m², 7 à 10 cabinets, confidentialité et confort acoustique. Bordeaux et Toulouse." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0">
          <img src={heroBuilding} alt="Façade d'un espace de santé I-CA.RE rénové en rez-de-chaussée" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/30" />
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight mb-6 opacity-0 animate-fade-up">
              Nous transformons des rez-de-chaussée urbains en espaces de santé et de bien-être
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-4 opacity-0 animate-fade-up stagger-1">
              150 à 200 m² conçus pour la confidentialité, la performance acoustique et le confort. 7 à 10 cabinets par actif, au cœur des quartiers.
            </p>

            <p className="text-base text-muted-foreground/70 font-heading italic mb-10 opacity-0 animate-fade-up stagger-2">
              Des lieux de soin, pensés comme des lieux de vie
            </p>

            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-up stagger-3">
              <Button variant="hero" asChild>
                <Link to="/professionnels">
                  Professionnels de santé
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to="/notre-approche">
                  Découvrir notre approche
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
              Nous acquérons des locaux sous-valorisés, les requalifions en espaces de santé, les stabilisons en 24 à 36 mois, puis les cédons après 4 ans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={service.title} className="card-premium opacity-0 animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-5">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
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
              <h2 className="section-title mb-6">Pourquoi les professionnels choisissent I-CA.RE</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Des espaces de 150 à 200 m² pensés avec et pour les praticiens. Chaque détail — acoustique, confidentialité, ergonomie — est conçu pour faciliter votre exercice quotidien.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="w-11 h-11 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold font-heading mb-1 text-sm">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
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
              <img src={medicalOffice} alt="Intérieur lumineux d'un cabinet médical I-CA.RE avec mobilier ergonomique" className="rounded-xl shadow-card w-full" loading="lazy" />
              <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">7–10 cabinets</p>
                    <p className="text-xs text-muted-foreground">par actif transformé</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding bg-foreground">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold mb-4 text-background">
                Nos opérations
              </h2>
              <p className="text-background/60 text-lg max-w-xl">
                Des transformations granulaires, locales et maîtrisées — au service de la santé de proximité.
              </p>
            </div>
            <Button variant="outline" className="mt-6 md:mt-0 border-background/20 text-background hover:bg-background hover:text-foreground" asChild>
              <Link to="/projets">Voir tous les projets</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.name} className="bg-background/8 backdrop-blur rounded-xl p-6 hover:bg-background/12 transition-colors duration-500">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full bg-primary/20 text-primary">
                    {project.status}
                  </span>
                  <span className="text-xs text-background/50">{project.location}</span>
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2 text-background">{project.name}</h3>
                <p className="text-background/60 text-sm mb-6">{project.description}</p>
                <div className="progress-bar bg-background/15">
                  <div className="progress-bar-fill bg-primary" style={{ width: `${project.progress}%` }} />
                </div>
                <p className="text-xs text-background/40 mt-2">{project.progress}% avancement</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Societal Impact */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <img src={healthcareProfessional} alt="Professionnelle de santé accueillant un patient dans un cabinet I-CA.RE" className="rounded-xl shadow-card w-full" loading="lazy" />
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="section-title mb-6">Notre impact local</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Face à la désertification médicale, nous agissons à l'échelle du quartier. Chaque opération I-CA.RE requalifie un local vacant et rapproche les soins des habitants.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                {impacts.map((impact) => (
                  <div key={impact.label} className="text-center">
                    <p className="text-2xl md:text-3xl font-heading font-bold text-primary mb-2">{impact.value}</p>
                    <p className="text-xs text-muted-foreground">{impact.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {["Requalification de locaux vacants en espaces de santé", "Revalorisation du patrimoine bâti de proximité", "Développement territorial durable et entrepreneurial"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <Button className="mt-8" asChild>
                <Link to="/notre-approche">
                  Découvrir notre approche
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
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
              Prêt à exercer dans un espace I-CA.RE ?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Intégrez un cabinet clé en main, au cœur d'un quartier, dans un espace conçu pour votre pratique.
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
