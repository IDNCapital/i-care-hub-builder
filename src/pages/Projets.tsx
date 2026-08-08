import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { ArrowRight, MapPin, Mail } from "lucide-react";

import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { useProjects } from "@/hooks/useProjects";
import { VisuelsAVenir } from "@/components/VisuelsAVenir";
import { getProjectHero } from "@/lib/projectImages";
import { FadeImage } from "@/components/FadeImage";
import { STATIC_CENTRES, quarterLabel, type CentreStatus } from "@/lib/centres";
import { InlineBrand } from "@/components/BrandName";
import { CarteCabinetsSection } from "@/components/CarteCabinetsSection";

const badgeStyles: Record<CentreStatus, string> = {
  available: "bg-sage text-cream",
  full: "bg-cream text-anthracite",
  coming_soon: "bg-gold text-anthracite",
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
      <SeoHead
        title={t("seo.projectsTitle")}
        description={t("seo.projectsDesc")}
        path={lang === "fr" ? "/projets" : "/en/projects"}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-up">
              {t("projects.title")}
            </h1>
            <p className="text-xl text-muted-foreground opacity-0 animate-fade-up stagger-1">
              <InlineBrand>{t("projects.subtitle")}</InlineBrand>
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

      {/* Carte interactive des cabinets */}
      <CarteCabinetsSection
        background="secondary"
        title={lang === "fr" ? "Localiser nos cabinets" : "Locate our offices"}
        subtitle={
          lang === "fr"
            ? "Filtrez par ville, cliquez sur un marker pour voir le détail."
            : "Filter by city, click a marker to see details."
        }
      />

      {/* Centre Cards — by region */}
      <section className="section-padding bg-background">
        <div className="container space-y-16">
          {(["bordeaux", "toulouse"] as const).map((region) => {
            const centres = STATIC_CENTRES.filter((c) => c.region === region);
            if (centres.length === 0) return null;
            const heading = region === "bordeaux"
              ? (lang === "fr" ? "Nos implantations à Bordeaux Métropole" : "Our locations in Bordeaux Métropole")
              : (lang === "fr" ? "Nos implantations à Toulouse" : "Our locations in Toulouse");
            return (
              <div key={region}>
                <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4">{heading}</h2>
                <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto text-sm">
                  <InlineBrand>{t("projects.subtitle")}</InlineBrand>
                </p>
                {region === "toulouse" && (
                  <p className="text-center text-sm mb-8">
                    <Link
                      to={localePath(lang, "locationToulouse")}
                      className="text-primary underline underline-offset-4 hover:text-primary/80 inline-flex items-center gap-1"
                    >
                      {lang === "fr"
                        ? "Voir tous les cabinets à louer à Toulouse"
                        : "See all offices for rent in Toulouse"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </p>
                )}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {centres.map((centre) => {
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
                        alt={`${centre.name}, I-CA.RE`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <VisuelsAVenir className="w-full h-full" />
                    )}
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`text-sm font-bold uppercase tracking-wide px-3 py-1.5 rounded-full shadow-sm ${badgeStyles[centre.status]}`}>
                        {badgeLabel(centre.status)}{(() => {
                          if (centre.status !== "coming_soon") return "";
                          const q = quarterLabel(getProject(centre.slug)?.date_ouverture_cible, lang === "fr" ? "T" : "Q");
                          return q ? `, ${q}` : "";
                        })()}
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
                        {(() => {
                          const label = lang === "en"
                            ? (centre.availabilityLabelEn ?? centre.availabilityLabel)
                            : centre.availabilityLabel;
                          if (label) {
                            return `${t("projects.partTimePrefix")} ${label}`;
                          }
                          return t("projects.availableUnits");
                        })()}
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
            );
          })}
        </div>
      </section>
      <section className="section-padding">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">{t("projects.ctaBottom")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">{t("projects.ctaBottomDesc")}</p>
            <p className="text-sm text-muted-foreground mb-8">
              <Link to={localePath(lang, "locationBordeaux")} className="text-primary underline underline-offset-4 hover:text-primary/80">
                {lang === "fr" ? "Découvrez nos cabinets à louer à Bordeaux" : "Discover our offices for rent in Bordeaux"}
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
