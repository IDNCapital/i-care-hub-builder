import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { useEffect, useState } from "react";
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
import { ChargementPage } from "@/components/ChargementPage";
import { Analytics } from "@/lib/analytics";
import { VisuelsAVenir } from "@/components/VisuelsAVenir";
import { getProjectHero, getProjectGallery } from "@/lib/projectImages";
import { FadeImage } from "@/components/FadeImage";
import { getCentreBySlug, quarterLabel } from "@/lib/centres";
import { buildProjectStructuredData } from "@/lib/projectStructuredData";
import { BrandName } from "@/components/BrandName";
import { SectionPraticiensDuCabinet } from "@/components/SectionPraticiensDuCabinet";
import { cabinetNomCourt, hasInstallationPages } from "@/lib/installation";
import { SinstallerLinksCabinet } from "@/components/SinstallerLinksCabinet";
import { FormulaireInteretInstallation } from "@/components/FormulaireInteretInstallation";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";
import { assetUrl, pageUrl } from "@/lib/siteUrl";
import { SectionAvisGoogle } from "@/components/avis/SectionAvisGoogle";
import { marqueAffichee } from "@/lib/brand";

/**
 * OG images dédiées (1200×630) pour les pages /projets/[cabinet] exploitées.
 * Générées à partir du hero réel (photographe, Sprint 15) et stockées
 * dans public/og/. Les autres cabinets retombent sur DEFAULT_OG_IMAGE
 * via SeoHead. Alt descriptif et sobre par cabinet.
 */
const PROJECT_OG_IMAGES: Record<
  string,
  { ogImage: string; ogImageWidth: number; ogImageHeight: number; ogImageAlt: string }
> = {
  "i-ca-re-jardin-public": {
    ogImage: assetUrl("/og/og-jardin-public.png"),
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: "Cabinet I-CA.RE Jardin Public à Bordeaux, salle d'attente",
  },
  "i-ca-re-pey-berland": {
    ogImage: assetUrl("/og/og-pey-berland.png"),
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: "Cabinet I-CA.RE Pey-Berland à Bordeaux, salle d'attente",
  },
  "i-ca-re-nansouty": {
    ogImage: assetUrl("/og/og-nansouty.png"),
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: "Cabinet I-CA.RE Nansouty à Bordeaux, salle d'attente",
  },
};

export default function ProjetDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, isError } = useProject(slug || "");
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  if (isError) {
    return <ChargementPage mode="error" />;
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
  // Libellé de livraison dérivé de projets.date_ouverture_cible (source de vérité unique)
  const deliveryLabel =
    quarterLabel(project.date_ouverture_cible, lang === "fr" ? "T" : "Q") ??
    t("projectDetail.deliveryUnknown");

  const enquiryTarget = lang === "fr" && hasInstallationPages(project.status) && project.slug_installation
    ? "#demande-installation"
    : `${localePath(lang, "contact")}?centre=${encodeURIComponent(project.name)}`;

  const heroSrc = getProjectHero(project.slug, project.hero_image_url);
  const gallery = getProjectGallery(project.slug, project.image_gallery);
  const lightboxImages: LightboxImage[] = (() => {
    const list: LightboxImage[] = [];
    const seen = new Set<string>();
    if (heroSrc) {
      list.push({ src: heroSrc, alt: marqueAffichee(`${project.name}, ${project.city}`) });
      seen.add(heroSrc);
    }
    gallery.forEach((url, i) => {
      if (!seen.has(url)) {
        list.push({ src: url, alt: marqueAffichee(`${project.name}, ${i + 1}`) });
        seen.add(url);
      }
    });
    return list;
  })();

  const galleryIndexInLightbox = (url: string) => lightboxImages.findIndex((img) => img.src === url);

  return (
    <Layout>
      <SeoHead
        title={`${project.name} | I-CA.RE`}
        description={shortDesc}
        path={lang === "fr" ? `/projets/${slug}` : `/en/projects/${slug}`}
        {...(PROJECT_OG_IMAGES[project.slug] ?? {})}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProjectStructuredData({
          project,
          description,
          canonicalPath: lang === "fr" ? `/projets/${slug}` : `/en/projects/${slug}`,
          heroPath: heroSrc,
        })).replace(/</g, "\\u003c") }}
      />

      <section className="relative h-[60vh] min-h-[400px]">
        {heroSrc ? (
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            aria-label={marqueAffichee(`Afficher en plein écran : ${project.name}, ${project.city}`)}
            className="absolute inset-0 w-full h-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-inset"
          >
            <FadeImage src={heroSrc} alt={marqueAffichee(`${project.name}, ${project.city}`)} className="w-full h-full object-cover" loading="eager" fadeDuration={500} />
          </button>
        ) : (
          <VisuelsAVenir className="w-full h-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 pb-12 pointer-events-none">
          <div className="container">
            <Link to={localePath(lang, "projects")} className="pointer-events-auto inline-flex items-center text-sm text-background/80 hover:text-background mb-4 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("projectDetail.allProjects")}
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-sm font-medium px-4 py-1.5 rounded-full ${statusColor()}`}>{statusLabels[project.status]}</span>
              <span className="text-sm font-medium px-4 py-1.5 rounded-full bg-background/20 text-background backdrop-blur">{typologyLabels[project.typology]}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-2">{marqueAffichee(project.name)}</h1>
            <div className="flex items-center gap-2 text-background/80">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{project.city}{project.show_address && project.address ? `, ${project.address}` : ""}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 border-b border-border">
        <div className="container max-w-3xl mb-5">
          <p className="text-lg leading-relaxed">{shortDesc}</p>
          <p className="text-sm font-medium mt-3">{t("projectDetail.contactPromise")}</p>
        </div>
        <div className="container flex flex-wrap gap-3 max-w-3xl">
          <Button variant="hero" asChild className="flex-1"><Link to={enquiryTarget} onClick={() => { if (enquiryTarget.startsWith("#")) document.getElementById("demande-installation")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{t("projectDetail.requestAvailability")}</Link></Button>
          <Button variant="hero-outline" asChild className="flex-1"><Link to={enquiryTarget} onClick={() => { if (enquiryTarget.startsWith("#")) document.getElementById("demande-installation")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{t("projectDetail.visitRequest")}</Link></Button>
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
                  <Link to={enquiryTarget} onClick={() => { if (enquiryTarget.startsWith("#")) document.getElementById("demande-installation")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
                    {t("common.contactUs")}
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Availability notice for centres with a partial availability */}
      {(() => {
        const centre = slug ? getCentreBySlug(slug) : undefined;
        if (!centre || centre.status !== "available" || !centre.availabilityLabel) return null;
        const label = lang === "en" ? (centre.availabilityLabelEn ?? centre.availabilityLabel) : centre.availabilityLabel;
        return (
          <section className="pb-0 pt-8">
            <div className="container">
              <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 text-center max-w-3xl mx-auto">
                <p className="text-base font-heading text-foreground mb-2">{t("projects.availabilityNoticeTitle")}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{t("projects.availabilityNoticeBody", { label })}</p>
                <Button size="sm" variant="outline" asChild className="mt-4">
                  <Link to={enquiryTarget} onClick={() => { if (enquiryTarget.startsWith("#")) document.getElementById("demande-installation")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
                    {t("projectDetail.visitRequest")}
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
              <p className="text-3xl font-bold">{deliveryLabel}</p>
              <p className="text-sm text-muted-foreground">{t("projectDetail.delivery")}</p>
            </div>
            <div className="bg-secondary rounded-2xl p-6 text-center">
              <Ruler className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-lg font-bold">{t("projectDetail.rentOnRequest")}</p>
              <p className="text-sm text-muted-foreground">{t("projectDetail.rent")}</p>

            </div>
            <div className="bg-secondary rounded-2xl p-6 text-center">
              <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-lg font-semibold mb-1">{t("projectDetail.interested")}</p>
              <Button size="sm" asChild><Link to={enquiryTarget} onClick={() => { if (enquiryTarget.startsWith("#")) document.getElementById("demande-installation")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{t("common.contactUs")}</Link></Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-semibold mb-6">{t("projectDetail.conceptTitle")}</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="text-lg leading-relaxed whitespace-pre-line">{marqueAffichee(description)}</p>
              </div>

              <div className="mt-10 bg-secondary rounded-2xl p-6">
                <h3 className="text-xl font-semibold mb-4">{t("projectDetail.architecturalQuality")}</h3>
                <p className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">{t("projectDetail.architecturalQualityDesc")}</p>
              </div>

              <div className="mt-6 bg-secondary rounded-2xl p-6">
                <p className="text-sm text-muted-foreground leading-relaxed">{t("projectDetail.rentDetails")}</p>
              </div>
              {(() => {
                return gallery.length > 0 ? (
                  <div className="mt-12">
                    <h3 className="text-2xl font-semibold mb-6">{t("projectDetail.gallery")}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {gallery.map((url, i) => {
                        const alt = marqueAffichee(`${project.name}, ${i + 1}`);
                        const idx = galleryIndexInLightbox(url);
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setLightboxIndex(idx >= 0 ? idx : 0)}
                            aria-label={`Afficher en plein écran : ${alt}`}
                            className="cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-sage rounded-2xl"
                          >
                            <FadeImage src={url} alt={alt} className="rounded-2xl w-full h-48 object-cover" />
                          </button>
                        );
                      })}
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
                  <div className="flex justify-between"><dt className="text-muted-foreground">{t("projectDetail.deliveryLabel")}</dt><dd className="font-medium">{deliveryLabel}</dd></div>
                </dl>
              </div>

              <div className="space-y-3">
                <Button variant="hero" asChild className="w-full">
                  <Link to={enquiryTarget} onClick={() => { if (enquiryTarget.startsWith("#")) document.getElementById("demande-installation")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{t("projectDetail.requestAvailability")}<ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button variant="hero-outline" asChild className="w-full">
                  <Link to={enquiryTarget} onClick={() => { if (enquiryTarget.startsWith("#")) document.getElementById("demande-installation")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{t("projectDetail.visitRequest")}<ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*
        Avis Google du cabinet. Couverture stricte : ligne de cache présente,
        note non NULL et au moins un avis. Les cabinets sans fiche Google ne
        rendent donc aucune section, pas même un titre.
      */}
      <SectionAvisGoogle
        placeId={project.google_place_id}
        nomPourLien={project.name}
        lang={lang}
        exigerAuMoinsUnAvis
        className="container max-w-3xl section-padding"
      />

      {lang === "fr" && hasInstallationPages(project.status) && project.slug_installation && (
        <section className="section-padding bg-secondary">
          <div className="container max-w-4xl">
            <p className="font-body text-xs uppercase font-bold tracking-[0.2em] text-primary mb-3">
              S'installer ici
            </p>
            <SinstallerLinksCabinet
              slugInstallation={project.slug_installation}
              cabinetLabel={project.name.replace(/^Cabinet I[‑-]CA\.RE\s*/i, "").trim() || project.name}
            />
          </div>
        </section>
      )}

      {lang === "fr" && hasInstallationPages(project.status) && project.slug_installation && (
        <section id="demande-installation" className="section-padding scroll-mt-24">
          <div className="container max-w-3xl">
            <p className="font-body text-xs uppercase font-bold tracking-[0.2em] text-primary mb-3">
              Votre installation
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-normal text-foreground mb-4">
              Visiter ce lieu et préparer votre installation
            </h2>
            <p className="text-base text-muted-foreground mb-8">
              {project.status === "en_exploitation" ? (
                <>Ce cabinet <BrandName /> est ouvert. Laissez-nous quelques informations pour recevoir les disponibilités de bureaux et les conditions de location.</>
              ) : (
                <>Ce cabinet <BrandName /> est en pré-lancement. Laissez-nous quelques informations pour recevoir en priorité les disponibilités de bureaux, les conditions de location et le planning d'ouverture prévisionnel.</>
              )}
            </p>
            <p className="text-base font-medium mb-6">{t("projectDetail.contactPromise")}</p>
            <FormulaireInteretInstallation
              villeSlug={project.slug_installation}
              villeLabel={cabinetNomCourt(project.name)}
            />
          </div>
        </section>
      )}

      <section className="section-padding">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">{t("projectDetail.ctaTitle")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">{t("projectDetail.ctaDesc")}</p>
            <p className="text-sm text-muted-foreground mb-4">
              <Link to={localePath(lang, "locationBordeaux")} className="text-primary underline underline-offset-4 hover:text-primary/80">
                {lang === "fr" ? <>Voir tous les cabinets <BrandName /> à Bordeaux</> : <>View all <BrandName /> offices in Bordeaux</>}
              </Link>
            </p>
            {/* Page ressources monolingue francaise : lien borne a la langue, comme le bloc S'installer ici. */}
            {lang === "fr" && (
              <p className="text-sm text-muted-foreground mb-8">
                La mixité d’un lieu soulève des questions propres à chaque profession.{" "}
                <Link
                  to="/ressources/exercer-en-lieu-pluridisciplinaire/"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Exercer en lieu pluridisciplinaire
                </Link>
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <Link to={enquiryTarget} onClick={() => { if (enquiryTarget.startsWith("#")) document.getElementById("demande-installation")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>{t("projectDetail.requestAvailability")}<ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to={`${localePath(lang, "professionals")}#candidature`}>{t("projectDetail.applyNow")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {slug && (
        <SectionPraticiensDuCabinet
          cabinetSlug={slug}
          cabinetNomCourt={project.name.replace(/^Cabinet I[‑-]CA\.RE\s*/i, "").trim() || project.name}
          cabinetUrl={pageUrl(lang === "fr" ? `/projets/${slug}` : `/en/projects/${slug}`)}
        />
      )}

      <Lightbox
        images={lightboxImages}
        openIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(i) => setLightboxIndex(i)}
      />
    </Layout>
  );
}
