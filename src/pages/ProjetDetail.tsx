import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Ruler,
  Building2,
  Calendar,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { useProject, STATUS_LABELS, TYPOLOGY_LABELS } from "@/hooks/useProjects";
import { Analytics } from "@/lib/analytics";
import heroBuilding from "@/assets/hero-building.jpg";

export default function ProjetDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useProject(slug || "");

  useEffect(() => {
    if (project) {
      Analytics.projectView(project.name, project.slug, project.city);
    }
  }, [project]);

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-32 pb-16">
          <div className="container">
            <div className="h-[60vh] bg-secondary rounded-3xl animate-pulse" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="pt-32 pb-16 text-center">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4">Projet introuvable</h1>
            <p className="text-muted-foreground mb-8">Ce projet n'existe pas ou a été déplacé.</p>
            <Button asChild>
              <Link to="/projets">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux projets
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const statusColor = () => {
    switch (project.status) {
      case "en_exploitation":
        return "bg-green-500 text-background";
      case "en_travaux":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-foreground text-background";
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>{project.name} — I-CA.RE</title>
        <meta name="description" content={project.short_description} />
      </Helmet>

      {/* Hero Image */}
      <section className="relative h-[60vh] min-h-[400px]">
        <img
          src={project.hero_image_url || heroBuilding}
          alt={`Vue principale du projet ${project.name} — espace de santé à ${project.city}`}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="container">
            <Link to="/projets" className="inline-flex items-center text-sm text-background/80 hover:text-background mb-4 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tous les projets
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-sm font-medium px-4 py-1.5 rounded-full ${statusColor()}`}>
                {STATUS_LABELS[project.status]}
              </span>
              <span className="text-sm font-medium px-4 py-1.5 rounded-full bg-background/20 text-background backdrop-blur">
                {TYPOLOGY_LABELS[project.typology]}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-2">
              {project.name}
            </h1>
            <div className="flex items-center gap-2 text-background/80">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">
                {project.city}
                {project.show_address && project.address ? ` — ${project.address}` : ""}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA above the fold on mobile */}
      <section className="py-6 border-b border-border lg:hidden">
        <div className="container flex gap-3">
          <Button variant="hero" asChild className="flex-1">
            <Link to="/contact">
              Demander une disponibilité
            </Link>
          </Button>
          <Button variant="hero-outline" asChild className="flex-1">
            <Link to="/contact">
              Planifier une visite
            </Link>
          </Button>
        </div>
      </section>

      {/* Key Data */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
            <div className="bg-secondary rounded-2xl p-6 text-center">
              <Ruler className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold">{project.surface_m2}</p>
              <p className="text-sm text-muted-foreground">m² de surface</p>
            </div>
            <div className="bg-secondary rounded-2xl p-6 text-center">
              <Building2 className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold">{project.units_count}</p>
              <p className="text-sm text-muted-foreground">cabinets (12–18 m²)</p>
            </div>
            <div className="bg-secondary rounded-2xl p-6 text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold">{project.delivery_date || "—"}</p>
              <p className="text-sm text-muted-foreground">livraison</p>
            </div>
            <div className="bg-secondary rounded-2xl p-6 text-center">
              <Ruler className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-lg font-bold">600–800 €</p>
              <p className="text-sm text-muted-foreground">loyer / cabinet / mois</p>
            </div>
            <div className="bg-secondary rounded-2xl p-6 text-center">
              <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-lg font-semibold mb-1">Intéressé ?</p>
              <Button size="sm" asChild>
                <Link to="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>

          {/* Concept & Vision */}
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-semibold mb-6">Concept & vision architecturale</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="text-lg leading-relaxed whitespace-pre-line">
                  {project.long_description || project.short_description}
                </p>
              </div>

              {/* Image Gallery */}
              {project.image_gallery && project.image_gallery.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-2xl font-semibold mb-6">Galerie</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {project.image_gallery.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`${project.name} — vue intérieure ${i + 1} de l'espace de santé`}
                        className="rounded-2xl w-full h-48 object-cover"
                        loading="lazy"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              {/* Key Features */}
              {project.key_features && project.key_features.length > 0 && (
                <div className="bg-secondary rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4">Caractéristiques clés</h3>
                  <ul className="space-y-3">
                    {project.key_features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Practical Info */}
              <div className="bg-secondary rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Informations pratiques</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Ville</dt>
                    <dd className="font-medium">{project.city}</dd>
                  </div>
                  {project.show_address && project.address && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Adresse</dt>
                      <dd className="font-medium text-right">{project.address}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Surface</dt>
                    <dd className="font-medium">{project.surface_m2} m²</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Unités</dt>
                    <dd className="font-medium">{project.units_count}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Typologie</dt>
                    <dd className="font-medium">{TYPOLOGY_LABELS[project.typology]}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Statut</dt>
                    <dd className="font-medium">{STATUS_LABELS[project.status]}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Livraison</dt>
                    <dd className="font-medium">{project.delivery_date || "—"}</dd>
                  </div>
                </dl>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <Button variant="hero" asChild className="w-full">
                  <Link to="/contact">
                    Demander une disponibilité
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="hero-outline" asChild className="w-full">
                  <Link to="/contact">
                    Planifier une visite
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Ce projet vous intéresse ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Contactez-nous pour obtenir le dossier complet, planifier une visite ou réserver votre cabinet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <Link to="/contact">
                  Demander une disponibilité
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to="/professionnels#candidature">
                  Déposer ma candidature
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
