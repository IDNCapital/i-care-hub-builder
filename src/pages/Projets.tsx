import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, MapPin, CheckCircle2 } from "lucide-react";
import renovationBeforeAfter from "@/assets/renovation-before-after.jpg";
import heroBuilding from "@/assets/hero-building.jpg";

const projects = [
  {
    name: "Floirac",
    location: "Gironde",
    status: "En cours",
    progress: 65,
    surface: "800 m²",
    professions: ["Médecin généraliste", "Infirmier", "Kiné", "Psychologue"],
    description: "Centre de santé pluridisciplinaire au cœur d'un quartier en pleine revitalisation. Réhabilitation d'un ancien bâtiment commercial en pôle de santé moderne.",
    features: ["8 cabinets", "Salle d'attente commune", "Accès PMR", "Parking 15 places"],
    delivery: "T3 2025",
    image: heroBuilding,
  },
  {
    name: "Bordeaux Bastide",
    location: "Gironde",
    status: "Livré",
    progress: 100,
    surface: "450 m²",
    professions: ["Psychologue", "Orthophoniste", "Diététicien"],
    description: "Réhabilitation d'un immeuble historique du quartier de la Bastide. Conservation du patrimoine architectural avec mise aux normes modernes.",
    features: ["5 cabinets", "Espaces communs", "Fibre optique", "Transport à proximité"],
    delivery: "Disponible",
    image: renovationBeforeAfter,
  },
  {
    name: "Toulouse Saint-Cyprien",
    location: "Haute-Garonne",
    status: "Études",
    progress: 25,
    surface: "600 m²",
    professions: ["Toutes professions"],
    description: "Pôle paramédical de proximité dans un quartier populaire de Toulouse. Projet en phase d'études, ouvert à toutes les professions de santé.",
    features: ["6 cabinets prévus", "Terrasse commune", "Parking souterrain"],
    delivery: "2026",
    image: heroBuilding,
  },
];

export default function Projets() {
  return (
    <Layout>
      <Helmet>
        <title>Nos Projets — I-CA.RE</title>
        <meta name="description" content="Découvrez les projets de réhabilitation de centres de santé I-CA.RE à Bordeaux, Toulouse et dans toute la Nouvelle-Aquitaine." />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-up">
              Nos Projets
            </h1>
            <p className="text-xl text-muted-foreground opacity-0 animate-fade-up stagger-1">
              Des transformations concrètes au service des territoires et de la santé de proximité.
            </p>
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section className="section-padding">
        <div className="container">
          <div className="space-y-24">
            {projects.map((project, index) => (
              <div key={project.name} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative">
                    <img
                      src={project.image}
                      alt={`Projet ${project.name}`}
                      className="rounded-3xl shadow-elevated w-full"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`text-sm font-medium px-4 py-2 rounded-full ${
                        project.status === "Livré" 
                          ? "bg-green-500 text-background" 
                          : project.status === "En cours"
                          ? "bg-primary text-primary-foreground"
                          : "bg-foreground text-background"
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{project.name}</h2>
                  <p className="text-lg text-muted-foreground mb-6">{project.description}</p>

                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-secondary rounded-xl p-4">
                      <p className="text-sm text-muted-foreground">Surface</p>
                      <p className="font-semibold">{project.surface}</p>
                    </div>
                    <div className="bg-secondary rounded-xl p-4">
                      <p className="text-sm text-muted-foreground">Livraison</p>
                      <p className="font-semibold">{project.delivery}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Professions recherchées :</p>
                    <div className="flex flex-wrap gap-2">
                      {project.professions.map((prof) => (
                        <span key={prof} className="px-3 py-1 bg-primary/20 text-foreground text-sm rounded-full">
                          {prof}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-3">Caractéristiques :</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {project.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Avancement</span>
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>

                  <Button asChild>
                    <Link to="/professionnels#candidature">
                      Candidater pour ce projet
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
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
              Un projet dans votre ville ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Nous étudions en permanence de nouvelles opportunités. Contactez-nous pour nous parler de votre territoire.
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
