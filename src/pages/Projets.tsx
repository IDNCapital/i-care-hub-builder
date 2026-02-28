import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, MapPin } from "lucide-react";
import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { useProjects } from "@/hooks/useProjects";
import { VisuelsAVenir } from "@/components/VisuelsAVenir";
import { getProjectHero } from "@/lib/projectImages";
import { FadeImage } from "@/components/FadeImage";
import { BordeauxMap } from "@/components/BordeauxMap";

/** Map centre-id → project slug in Supabase */
const CENTRE_SLUG: Record<string, string> = {
  chartrons: "i-ca-re-chartrons",
  nansouty: "i-ca-re-nansouty",
  "jardin-public": "i-ca-re-jardin-public",
  "pey-berland": "i-ca-re-pey-berland",
};

type CentreStatus = "available" | "full" | "coming_soon";

interface StaticCentre {
  id: string;
  name: string;
  status: CentreStatus;
  desc?: string;
  slug?: string;
}

const STATIC_CENTRES: StaticCentre[] = [
  { id: "chartrons", name: "Chartrons", status: "available", slug: "i-ca-re-chartrons" },
  { id: "nansouty", name: "Nansouty", status: "full", slug: "i-ca-re-nansouty" },
  { id: "jardin-public", name: "Jardin Public", status: "full", slug: "i-ca-re-jardin-public" },
  { id: "pey-berland", name: "Pey-Berland", status: "full", slug: "i-ca-re-pey-berland" },
  { id: "floirac", name: "Floirac", status: "coming_soon" },
  { id: "lormont", name: "Lormont", status: "coming_soon" },
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
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToCentre = useCallback((id: string) => {
    const el = cardRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

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

      {/* Map */}
      <section className="section-padding bg-background">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4">
            {t("projects.mapTitle")}
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto text-sm">
            {t("projects.subtitle")}
          </p>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {(["available", "full", "coming_soon"] as CentreStatus[]).map((s) => (
              <div key={s} className="flex items-center gap-2 text-sm">
                <span className={`w-3 h-3 rounded-full ${
                  s === "available" ? "bg-primary" : s === "full" ? "bg-muted-foreground/40" : "bg-accent"
                }`} />
                <span className="text-muted-foreground">{badgeLabel(s)}</span>
              </div>
            ))}
          </div>

          <BordeauxMap onCentreClick={scrollToCentre} />
        </div>
      </section>

      {/* Centre Cards */}
      <section className="section-padding">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {STATIC_CENTRES.map((centre) => {
              const project = getProject(centre.slug);
              const heroSrc = centre.slug ? getProjectHero(centre.slug, project?.hero_image_url) : null;

              return (
                <div
                  key={centre.id}
                  ref={(el) => { cardRefs.current[centre.id] = el; }}
                  className="group bg-background rounded-3xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
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
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">Bordeaux</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {centre.name}
                    </h3>

                    {centre.status === "available" && (
                      <p className="text-primary text-sm font-medium mb-4">
                        {t("projects.availableUnits")}
                      </p>
                    )}

                    {project && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {getDescription(project)}
                      </p>
                    )}

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-3 mt-auto">
                      {centre.slug ? (
                        <>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`${localePath(lang, "projects")}/${centre.slug}`}>
                              {t("projects.viewSpace")}
                            </Link>
                          </Button>
                          {centre.status === "available" && (
                            <Button size="sm" asChild>
                              <Link to={localePath(lang, "contact")}>
                                {t("projects.findOffice")}
                                <ArrowRight className="ml-1.5 h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">
                          {t("projects.comingSoonBadge")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
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
