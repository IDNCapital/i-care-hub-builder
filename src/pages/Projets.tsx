import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, MapPin, Building2, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import { useProjects, STATUS_LABELS, TYPOLOGY_LABELS } from "@/hooks/useProjects";
import heroBuilding from "@/assets/hero-building.jpg";

export default function Projets() {
  const { data: projects, isLoading } = useProjects();
  const [filterCity, setFilterCity] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTypology, setFilterTypology] = useState("");

  const cities = useMemo(() => {
    if (!projects) return [];
    return [...new Set(projects.map((p) => p.city))].sort();
  }, [projects]);

  const filtered = useMemo(() => {
    if (!projects) return [];
    return projects.filter((p) => {
      if (filterCity && p.city !== filterCity) return false;
      if (filterStatus && p.status !== filterStatus) return false;
      if (filterTypology && p.typology !== filterTypology) return false;
      return true;
    });
  }, [projects, filterCity, filterStatus, filterTypology]);

  const statusColor = (status: string) => {
    switch (status) {
      case "en_exploitation":
        return "bg-green-500/20 text-green-800";
      case "en_travaux":
        return "bg-primary/20 text-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Nos Projets — I-CA.RE</title>
        <meta name="description" content="Découvrez les opérations immobilières de santé I-CA.RE : cabinets de 12 à 18 m², loyers de 600 à 800 €/mois, 5 cabinets pour 100 m². Bordeaux, Toulouse, Nouvelle-Aquitaine." />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-up">
              Nos Projets
            </h1>
            <p className="text-xl text-muted-foreground opacity-0 animate-fade-up stagger-1">
              Des espaces de santé granulaires : 5 cabinets pour 100 m², loyers de 600 à 800 €/mois, vacance maîtrisée par la structure multi-locataires.
            </p>
            <Button variant="hero" asChild className="mt-8 opacity-0 animate-fade-up stagger-2">
              <Link to="/contact">
                Demander une disponibilité
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="container">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filtrer :</span>
            </div>

            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border bg-background text-sm"
            >
              <option value="">Toutes les villes</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border bg-background text-sm"
            >
              <option value="">Tous les statuts</option>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <select
              value={filterTypology}
              onChange={(e) => setFilterTypology(e.target.value)}
              className="h-10 px-3 rounded-xl border border-border bg-background text-sm"
            >
              <option value="">Toutes les typologies</option>
              {Object.entries(TYPOLOGY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            {(filterCity || filterStatus || filterTypology) && (
              <button
                onClick={() => { setFilterCity(""); setFilterStatus(""); setFilterTypology(""); }}
                className="text-sm text-primary hover:underline"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-secondary rounded-3xl h-[480px] animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Aucun projet ne correspond à vos critères.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((project) => (
                <Link
                  key={project.id}
                  to={`/projets/${project.slug}`}
                  className="group bg-background rounded-3xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={project.hero_image_url || heroBuilding}
                      alt={`Vue extérieure du projet ${project.name} à ${project.city}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${statusColor(project.status)}`}>
                        {STATUS_LABELS[project.status]}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-background/90 text-foreground">
                        {TYPOLOGY_LABELS[project.typology]}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{project.city}</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {project.name}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.short_description}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex gap-4">
                        <span className="text-muted-foreground">{project.surface_m2} m²</span>
                        <span className="text-muted-foreground">{project.units_count} unités</span>
                      </div>
                      <span className="text-primary font-medium flex items-center gap-1">
                        Découvrir
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
