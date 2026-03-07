import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
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
import { useProject } from "@/hooks/useProjects";
import { Analytics } from "@/lib/analytics";
import { VisuelsAVenir } from "@/components/VisuelsAVenir";
import { getProjectHero, getProjectGallery } from "@/lib/projectImages";
import { FadeImage } from "@/components/FadeImage";
import { getCentreBySlug } from "@/lib/centres";

export default function ProjetDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = useProject(slug || "");
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

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

  useEffect(() => {
    if (project) {
      Analytics.projectView(project.name, project.slug, project.city);
    }
  }, [project]);

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-32 pb-16">
          <div className="container"><div className="h-[60vh] bg-secondary rounded-3xl animate-pulse" /></div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="pt-32 pb-16 text-center">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4">{t("projectDetail.notFound")}</h1>
            <p className="text-muted-foreground mb-8">{t("projectDetail.notFoundDesc")}</p>
            <Button asChild>
              <Link to={localePath(lang, "projects")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("projectDetail.backToProjects")}
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const statusColor = () => {
    switch (project.status) {
      case "en_exploitation": return "bg-green-500 text-background";
      case "en_travaux": return "bg-primary text-primary-foreground";
      default: return "bg-foreground text-background";
    }
  };

  const description = lang === "en" && project.long_description_en ? project.long_description_en : (project.long_description || project.short_description);
  const shortDesc = lang === "en" && project.short_description_en ? project.short_description_en : project.short_description;
  const features = lang === "en" && project.key_features_en ? project.key_features_en : project.key_features;

  return (
    <Layout>
      <Helmet>
        <title>{project.name} — I-CA.RE</title>
        <meta name="description" content={shortDesc} />
      </Helmet>

      <section className="relative h-[60vh] min-h-[400px]">
        {(() => {
          const heroSrc = getProjectHero(project.slug, project.hero_image_url);
          return heroSrc ? (
            <FadeImage src={heroSrc} alt={`${project.name} — ${project.city}`} className="w-full h-full object-cover" loading="eager" fadeDuration={500} />
          ) : (
            <VisuelsAVenir className="w-full h-full" />
          );
        })()}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="container">
            <Link to={localePath(lang, "projects")} className="inline-flex items-center text-sm text-background/80 hover:text-background mb-4 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("projectDetail.allProjects")}
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-sm font-medium px-4 py-1.5 rounded-full ${statusColor()}`}>{statusLabels[project.status]}</span>
              <span className="text-sm font-medium px-4 py-1.5 rounded-full bg-background/20 text-background backdrop-blur">{typologyLabels[project.typology]}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-2">{project.name}</h1>
            <div className="flex items-center gap-2 text-background/80">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{project.city}{project.show_address && project.address ? ` — ${project.address}` : ""}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 border-b border-border lg:hidden">
        <div className="container flex gap-3">
          <Button variant="hero" asChild className="flex-1"><Link to={localePath(lang, "contact")}>{t("projectDetail.requestAvailability")}</Link></Button>
          <Button variant="hero-outline" asChild className="flex-1"><Link to={localePath(lang, "contact")}>{t("projectDetail.scheduleVisit")}</Link></Button>
        </div>
      </section>

      {/* Full notice for completed centres */}
      {(() => {
        const centre = slug ? getCentreBySlug(slug) : undefined;
        if (!centre || centre.status !== "full") return null;
        return (
          <section className="pb-0 pt-8">
            <div className="container">
              <div className="bg-secondary border border-border rounded-2xl p-6 text-center max-w-3xl mx-auto">
                <p className="text-sm text-muted-foreground leading-relaxed">{t("projects.fullNotice")}</p>
                <Button size="sm" variant="outline" asChild className="mt-4">
                  <Link to={localePath(lang, "contact")}>
                    {t("common.contactUs")}
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        );
      })()}

      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
            <div className="bg-secondary rounded-2xl p-6 text-center">
              <Ruler className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold">{project.surface_m2}</p>
              <p className="text-sm text-muted-foreground">{t("projectDetail.surface")}</p>
            </div>
            <div className="bg-secondary rounded-2xl p-6 text-center">
              <Building2 className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold">{project.units_count}</p>
              <p className="text-sm text-muted-foreground">{t("projectDetail.offices")}</p>
            </div>
            <div className="bg-secondary rounded-2xl p-6 text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold">{project.delivery_date || "—"}</p>
              <p className="text-sm text-muted-foreground">{t("projectDetail.delivery")}</p>
            </div>
            <div className="bg-secondary rounded-2xl p-6 text-center">
              <Ruler className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-lg font-bold">600–800 €</p>
              <p className="text-sm text-muted-foreground">{t("projectDetail.rent")}</p>
              <p className="text-xs text-muted-foreground mt-1">{lang === "fr" ? "HT" : "excl."}</p>
            </div>
            <div className="bg-secondary rounded-2xl p-6 text-center">
              <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-lg font-semibold mb-1">{t("projectDetail.interested")}</p>
              <Button size="sm" asChild><Link to={localePath(lang, "contact")}>{t("common.contactUs")}</Link></Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-semibold mb-6">{t("projectDetail.conceptTitle")}</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="text-lg leading-relaxed whitespace-pre-line">{description}</p>
              </div>

              <div className="mt-10 bg-secondary rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">{t("projectDetail.architecturalQuality")}</h3>
                <p className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">{t("projectDetail.architecturalQualityDesc")}</p>
              </div>

              <div className="mt-6 bg-secondary rounded-2xl p-6">
                <p className="text-sm text-muted-foreground leading-relaxed">{t("projectDetail.rentDetails")}</p>
              </div>
              {(() => {
                const gallery = getProjectGallery(project.slug, project.image_gallery);
                return gallery.length > 0 ? (
                  <div className="mt-12">
                    <h3 className="text-2xl font-semibold mb-6">{t("projectDetail.gallery")}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {gallery.map((url, i) => (
                        <FadeImage key={i} src={url} alt={`${project.name} — ${i + 1}`} className="rounded-2xl w-full h-48 object-cover" />
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>

            <div>
              {features && features.length > 0 && (
                <div className="bg-secondary rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4">{t("projectDetail.keyFeatures")}</h3>
                  <ul className="space-y-3">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-secondary rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">{t("projectDetail.practicalInfo")}</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">{t("projectDetail.city")}</dt><dd className="font-medium">{project.city}</dd></div>
                  {project.show_address && project.address && (<div className="flex justify-between"><dt className="text-muted-foreground">{t("projectDetail.address")}</dt><dd className="font-medium text-right">{project.address}</dd></div>)}
                  <div className="flex justify-between"><dt className="text-muted-foreground">{t("projectDetail.surfaceLabel")}</dt><dd className="font-medium">{project.surface_m2} {lang === "fr" ? "m²" : "sqm"}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">{t("projectDetail.unitsLabel")}</dt><dd className="font-medium">{project.units_count}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">{t("projectDetail.typology")}</dt><dd className="font-medium">{typologyLabels[project.typology]}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">{t("projectDetail.status")}</dt><dd className="font-medium">{statusLabels[project.status]}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">{t("projectDetail.deliveryLabel")}</dt><dd className="font-medium">{project.delivery_date || "—"}</dd></div>
                </dl>
              </div>

              <div className="space-y-3">
                <Button variant="hero" asChild className="w-full">
                  <Link to={localePath(lang, "contact")}>{t("projectDetail.requestAvailability")}<ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button variant="hero-outline" asChild className="w-full">
                  <Link to={localePath(lang, "contact")}>{t("projectDetail.scheduleVisit")}<ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">{t("projectDetail.ctaTitle")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{t("projectDetail.ctaDesc")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <Link to={localePath(lang, "contact")}>{t("projectDetail.requestAvailability")}<ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to={`${localePath(lang, "professionals")}#candidature`}>{t("projectDetail.applyNow")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}