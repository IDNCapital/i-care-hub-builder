import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, MapPin, Building2, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { useProjects } from "@/hooks/useProjects";
import { VisuelsAVenir } from "@/components/VisuelsAVenir";
import { getProjectHero } from "@/lib/projectImages";
import { FadeImage } from "@/components/FadeImage";

export default function Projets() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";
  const { data: projects, isLoading } = useProjects();

  const [filterCity, setFilterCity] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterTypology, setFilterTypology] = useState("");

  const statusLabels: Record<string, string> = {
    en_exploitation: t("statusLabels.en_exploitation"),
    en_travaux: t("statusLabels.en_travaux"),
    a_venir: t("statusLabels.a_venir"),
  };

  const typologyLabels: Record<string, string> = {
    cabinet_medical: t("typologyLabels.cabinet_medical"),
    pole_pluridisciplinaire: t("typologyLabels.pole_pluridisciplinaire"),
    coworking_sante: t("typologyLabels.coworking_sante"),
    centre_paramedical: t("typologyLabels.centre_paramedical"),
    maison_de_sante: t("typologyLabels.maison_de_sante"),
  };

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
      case "en_exploitation": return "bg-green-500/20 text-green-800";
      case "en_travaux": return "bg-primary/20 text-foreground";
      default: return "bg-muted text-muted-foreground";
    }
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

      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-up">{t("projects.title")}</h1>
            <p className="text-xl text-muted-foreground opacity-0 animate-fade-up stagger-1">{t("projects.subtitle")}</p>
            <Button variant="hero" asChild className="mt-8 opacity-0 animate-fade-up stagger-2">
              <Link to={localePath(lang, "contact")}>
                {t("projects.ctaAvailability")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 border-b border-border">
        <div className="container">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">{t("projects.filter")}</span>
            </div>
            <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)} className="h-10 px-3 rounded-xl border border-border bg-background text-sm">
              <option value="">{t("projects.allCities")}</option>
              {cities.map((city) => (<option key={city} value={city}>{city}</option>))}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-10 px-3 rounded-xl border border-border bg-background text-sm">
              <option value="">{t("projects.allStatuses")}</option>
              {Object.entries(statusLabels).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
            </select>
            <select value={filterTypology} onChange={(e) => setFilterTypology(e.target.value)} className="h-10 px-3 rounded-xl border border-border bg-background text-sm">
              <option value="">{t("projects.allTypologies")}</option>
              {Object.entries(typologyLabels).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
            </select>
            {(filterCity || filterStatus || filterTypology) && (
              <button onClick={() => { setFilterCity(""); setFilterStatus(""); setFilterTypology(""); }} className="text-sm text-primary hover:underline">{t("projects.reset")}</button>
            )}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (<div key={i} className="bg-secondary rounded-3xl h-[480px] animate-pulse" />))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">{t("projects.noResults")}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((project) => (
                <Link key={project.id} to={`${localePath(lang, "projects")}/${project.slug}`} className="group bg-background rounded-3xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {(() => {
                      const heroSrc = getProjectHero(project.slug, project.hero_image_url);
                      return heroSrc ? (
                        <>
                          <FadeImage src={heroSrc} alt={`${project.name} — ${project.city}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-4 left-4">
                            <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${statusColor(project.status)}`}>{statusLabels[project.status]}</span>
                          </div>
                          <div className="absolute top-4 right-4">
                            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-background/90 text-foreground">{typologyLabels[project.typology]}</span>
                          </div>
                        </>
                      ) : (
                        <VisuelsAVenir className="w-full h-full" />
                      );
                    })()}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{project.city}</span>
                    </div>
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{project.name}</h2>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{getDescription(project)}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex gap-4">
                        <span className="text-muted-foreground">{project.surface_m2} {lang === "fr" ? "m²" : "sqm"}</span>
                        <span className="text-muted-foreground">{project.units_count} {t("projects.units")}</span>
                      </div>
                      <span className="text-primary font-medium flex items-center gap-1">
                        {t("common.discover")}
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