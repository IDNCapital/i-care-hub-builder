import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, MapPin, Mail } from "lucide-react";

import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { useProjects } from "@/hooks/useProjects";
import { VisuelsAVenir } from "@/components/VisuelsAVenir";
import { getProjectHero } from "@/lib/projectImages";
import { FadeImage } from "@/components/FadeImage";
type CentreStatus = "available" | "full" | "coming_soon";

interface StaticCentre {
  id: string;
  name: string;
  address: string;
  status: CentreStatus;
  slug?: string;
}

/** Ordered: available first, then full, then coming_soon */
const STATIC_CENTRES: StaticCentre[] = [
  { id: "chartrons", name: "Chartrons", address: "20 cours Saint Louis, 33300 Bordeaux", status: "available", slug: "i-ca-re-chartrons" },
  { id: "nansouty", name: "Nansouty", address: "106b rue Bertrand de Goth, 33800 Bordeaux", status: "full", slug: "i-ca-re-nansouty" },
  { id: "jardin-public", name: "Jardin Public", address: "38 cours du Maréchal Foch, 33000 Bordeaux", status: "full", slug: "i-ca-re-jardin-public" },
  { id: "pey-berland", name: "Pey-Berland", address: "6 rue Père Louis de Jabrun, 33000 Bordeaux", status: "full", slug: "i-ca-re-pey-berland" },
  { id: "floirac", name: "Floirac", address: "23 avenue de la Libération, 33270 Floirac", status: "coming_soon" },
  { id: "lormont", name: "Lormont", address: "1 rue Marc Tallavi, 33310 Lormont", status: "coming_soon" },
];

const badgeStyles: Record<CentreStatus, string> = {
  available: "bg-primary/15 text-primary",
  full: "bg-muted text-muted-foreground",
  coming_soon: "bg-accent/25 text-accent-foreground",
};

export default function Projets() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";
  const { data: projects } = useProjects();

  const badgeLabel = (status: CentreStatus) => {
    switch (status) {
      case "available": return t("projects.availableBadge");
      case "full": return t("projects.fullBadge");
      case "coming_soon": return t("projects.comingSoonBadge");
    }
  };

  const getProject = (slug?: string) => {
    if (!slug || !projects) return null;
    return projects.find((p) => p.slug === slug) ?? null;
  };

  const getDescription = (project: any) => {
    if (lang === "en" && project.short_description_en) return project.short_description_en;
    return project.short_description;
  };

  return (
    <Layout>
      <Helmet>
        <title>{t("seo.projectsTitle")}</title>
        <meta name="description" content={t("seo.projectsDesc")} />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-up">
              {t("projects.title")}
            </h1>
            <p className="text-xl text-muted-foreground opacity-0 animate-fade-up stagger-1">
              {t("projects.subtitle")}
            </p>
            <p className="text-lg text-muted-foreground/80 mt-4 opacity-0 animate-fade-up stagger-2">
              {t("projects.introAnchor")}
            </p>
            <div className="flex flex-wrap gap-4 mt-8 opacity-0 animate-fade-up stagger-2">
              <Button variant="hero" asChild>
                <Link to={localePath(lang, "contact")}>
                  {t("projects.ctaAvailability")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Centre Cards */}
      <section className="section-padding bg-background">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4">
            {t("projects.mapTitle")}
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto text-sm">
            {t("projects.subtitle")}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {STATIC_CENTRES.map((centre) => {
              const project = getProject(centre.slug);
              const heroSrc = centre.slug ? getProjectHero(centre.slug, project?.hero_image_url) : null;

              return (
                <div
                  key={centre.id}
                  className="group bg-background rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image — clickable */}
                  <Link to={centre.slug ? `${localePath(lang, "projects")}/${centre.slug}` : localePath(lang, "contact")} className="block relative aspect-[4/3] overflow-hidden">
                    {heroSrc ? (
                      <FadeImage
                        src={heroSrc}
                        alt={`${centre.name} — I-CA.RE`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <VisuelsAVenir className="w-full h-full" />
                    )}
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${badgeStyles[centre.status]}`}>
                        {badgeLabel(centre.status)}
                      </span>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6 flex flex-col gap-3">
                    {centre.slug ? (
                      <Link to={`${localePath(lang, "projects")}/${centre.slug}`} className="hover:text-primary transition-colors">
                        <h3 className="text-xl font-semibold">{centre.name}</h3>
                      </Link>
                    ) : (
                      <h3 className="text-xl font-semibold">{centre.name}</h3>
                    )}

                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span className="text-sm">{centre.address}</span>
                    </div>

                    {centre.status === "available" && (
                      <p className="text-primary text-sm font-medium">
                        {t("projects.availableUnits")}
                      </p>
                    )}

                    {project && (
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {getDescription(project)}
                      </p>
                    )}

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-3 mt-2">
                      {centre.status === "available" && centre.slug && (
                        <>
                          <Button size="sm" asChild>
                            <Link to={`${localePath(lang, "projects")}/${centre.slug}`}>
                              {t("projects.viewSpace")}
                              <ArrowRight className="ml-1.5 h-4 w-4" />
                            </Link>
                          </Button>
                        </>
                      )}
                      {centre.status === "full" && centre.slug && (
                        <>
                          <Button size="sm" asChild>
                            <Link to={`${localePath(lang, "projects")}/${centre.slug}`}>
                              {t("projects.discoverSpace")}
                              <ArrowRight className="ml-1.5 h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={localePath(lang, "contact")}>
                              <Mail className="mr-1.5 h-4 w-4" />
                              {lang === "fr" ? "Être informé des disponibilités" : "Get notified of availability"}
                            </Link>
                          </Button>
                        </>
                      )}
                      {centre.status === "coming_soon" && (
                        <>
                          {centre.slug ? (
                            <Button size="sm" asChild>
                              <Link to={`${localePath(lang, "projects")}/${centre.slug}`}>
                                {t("projects.discoverProject")}
                                <ArrowRight className="ml-1.5 h-4 w-4" />
                              </Link>
                            </Button>
                          ) : null}
                          <Button variant="outline" size="sm" asChild>
                            <Link to={localePath(lang, "contact")}>
                              <Mail className="mr-1.5 h-4 w-4" />
                              {lang === "fr" ? "Être informé de l'ouverture" : "Get notified of opening"}
                            </Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">{t("projects.ctaBottom")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">{t("projects.ctaBottomDesc")}</p>
            <p className="text-sm text-muted-foreground mb-8">
              <Link to={localePath(lang, "locationBordeaux")} className="text-primary underline underline-offset-4 hover:text-primary/80">
                {lang === "fr" ? "Location de cabinets à Bordeaux" : "Office rental in Bordeaux"}
              </Link>
            </p>
            <Button variant="hero" asChild>
              <Link to={localePath(lang, "contact")}>
                {t("common.contactUs")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
