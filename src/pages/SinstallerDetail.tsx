import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Link, useParams } from "react-router-dom";
import { MapPin, ChevronRight } from "lucide-react";
import NotFound from "@/pages/NotFound";
import { useInstallationPage, useProfessions, useCabinetsPipeline } from "@/hooks/useInstallation";
import { ChargementPage } from "@/components/ChargementPage";
import { cabinetNomCourt, formatDateOuverture, aVille } from "@/lib/installation";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { FormulaireInteretInstallation } from "@/components/FormulaireInteretInstallation";
import { CabinetVisuel } from "@/components/CabinetVisuel";
import { getCabinetVisuals } from "@/lib/projectImages";
import { ICARE_TELEPHONE_E164 } from "@/lib/contact";
import { googleMapsPlaceUrl } from "@/lib/google-maps-url";
import { BASE_URL, assetUrl, pageUrl } from "@/lib/siteUrl";

function parsePostalAddress(address: string | null, city: string) {
  if (!address) return { streetAddress: "", postalCode: "", addressLocality: city };
  // Pattern : "5ter rue Mirepoix, 31000 Toulouse"
  const match = address.match(/^(.+?),\s*(\d{5})\s+(.+)$/);
  if (match) {
    return {
      streetAddress: match[1].trim(),
      postalCode: match[2],
      addressLocality: match[3].trim(),
    };
  }
  return { streetAddress: address, postalCode: "", addressLocality: city };
}

export default function SinstallerDetail() {
  const { profession, ville } = useParams<{ profession: string; ville: string }>();
  const { data, isLoading, isError } = useInstallationPage(profession ?? "", ville ?? "");
  const { data: professions } = useProfessions();
  const { data: pipelineCabinets } = useCabinetsPipeline();
  const projetCabinet = pipelineCabinets?.find((c) => c.slug_installation === ville);

  if (isLoading) {
    return (
      <Layout>
        <div className="container pt-32 pb-16">
          <p className="text-muted-foreground">Chargement…</p>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return <ChargementPage mode="error" />;
  }

  if (!data) {
    return <NotFound />;
  }

  const nomCourt = cabinetNomCourt(data.cabinet_nom_complet);
  const ouvertureLabel = formatDateOuverture(data.date_ouverture);
  const professionLower = data.profession_libelle.toLowerCase();
  const path = data.url_path;
  const canonical = pageUrl(path);
  const postal = parsePostalAddress(data.cabinet_adresse, data.cabinet_ville);
  const villeAvecPreposition = aVille(nomCourt);
  const visuels = getCabinetVisuals(projetCabinet?.slug);
  const visuelAlt = `Cabinet pour ${professionLower} à louer, I‑CA.RE ${nomCourt}`;

  const professionRow = professions?.find((p) => p.slug === data.profession_slug);
  const nomInclusifPluriel = professionRow?.nom_inclusif_pluriel ?? data.profession_libelle.toLowerCase();

  const contenuVille = data.contenuVille;
  const contenuProfession = data.contenuProfession;
  const contenuCommun = data.contenuCommun ?? [];

  const hasProfessionContent =
    !!contenuProfession?.enjeux_md ||
    !!contenuProfession?.patientele_md ||
    !!contenuProfession?.pourquoi_idn_md;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: pageUrl("/") },
      { "@type": "ListItem", position: 2, name: "S'installer", item: pageUrl("/sinstaller") },
      { "@type": "ListItem", position: 3, name: data.profession_libelle, item: pageUrl(`/sinstaller/${data.profession_slug}`) },
      { "@type": "ListItem", position: 4, name: nomCourt, item: canonical },
    ],
  };

  // MedicalBusiness : plus spécifique que LocalBusiness pour un cabinet de soin.
  // Champs émis uniquement s'ils existent réellement. Les cabinets pipeline ne sont
  // pas ouverts : ni openingHours, ni priceRange, ni aggregateRating ne sont déclarés.
  const hasMapUrl = googleMapsPlaceUrl(data.cabinet_nom_complet, projetCabinet?.google_place_id);
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: data.cabinet_nom_complet,
    // image émise uniquement si vraie photo du cabinet (pas de fallback générique)
    ...(visuels.isGeneric ? {} : { image: `${BASE_URL}${visuels.hero}` }),
    ...(projetCabinet ? { url: pageUrl(`/projets/${projetCabinet.slug}`) } : {}),
    telephone: ICARE_TELEPHONE_E164,
    address: {
      "@type": "PostalAddress",
      streetAddress: postal.streetAddress,
      postalCode: postal.postalCode,
      addressLocality: postal.addressLocality,
      addressCountry: "FR",
    },
    ...(projetCabinet?.lat != null && projetCabinet?.lng != null
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: projetCabinet.lat,
            longitude: projetCabinet.lng,
          },
        }
      : {}),
    ...(hasMapUrl ? { hasMap: hasMapUrl } : {}),
    parentOrganization: {
      "@type": "Organization",
      name: "I-CA.RE",
      url: pageUrl("/"),
    },
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Location de cabinet pour ${professionLower}`,
    provider: {
      "@type": "Organization",
      name: "I-CA.RE",
      url: pageUrl("/"),
      telephone: ICARE_TELEPHONE_E164,
    },
    areaServed: {
      "@type": "City",
      name: data.cabinet_ville,
    },
  };

  return (
    <Layout>
      <SeoHead
        title={`S'installer comme ${professionLower} ${villeAvecPreposition} | Cabinet I-CA.RE`}
        description={`Découvrez les opportunités d'installation pour ${professionLower} au Cabinet I-CA.RE de ${nomCourt}, ${data.cabinet_adresse ?? ""}. ${ouvertureLabel}. Demandez le dossier d'installation.`}
        path={path}
        ogImage={assetUrl(`/og/og-${ville}.png`)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      {/* Breadcrumb visuel */}
      <nav aria-label="Fil d'Ariane" className="container pt-28 pb-4">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <li><Link to="/" className="hover:text-primary">Accueil</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link to="/sinstaller/" className="hover:text-primary">S'installer</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li>{data.profession_libelle}</li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="text-foreground">{nomCourt}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="pb-16 bg-secondary">
        <div className="container max-w-4xl pt-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-normal mb-6">
            S'installer comme {professionLower} {villeAvecPreposition}
          </h1>
          <p className="text-lg text-muted-foreground flex items-start gap-2">
            <MapPin className="h-5 w-5 mt-1 shrink-0 text-primary" />
            <span>
              {data.cabinet_adresse}
              <br />
              <span className="text-primary font-medium">{ouvertureLabel}</span>
            </span>
          </p>
        </div>
      </section>

      {projetCabinet && (
        <section className="bg-background border-b border-border">
          <div className="container max-w-4xl py-4">
            <Link
              to={`/projets/${projetCabinet.slug}`}
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
              Voir le projet détaillé : {nomCourt}
            </Link>
          </div>
        </section>
      )}

      <section className="pt-10 bg-background">
        <div className="container max-w-4xl">
          <CabinetVisuel projectSlug={projetCabinet?.slug} alt={visuelAlt} variant="detail" />
        </div>
      </section>

      {/* Le cabinet */}
      <section className="section-padding bg-background">
        <div className="container max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-heading font-normal mb-6">
            Le cabinet
          </h2>
          {contenuVille?.cabinet_details_md ? (
            <MarkdownContent content={contenuVille.cabinet_details_md} />
          ) : (
            <p className="text-base text-muted-foreground leading-relaxed">
              Détails du cabinet en cours de préparation. Demandez le dossier d'installation
              pour recevoir les informations complètes.
            </p>
          )}
        </div>
      </section>

      {/* Le quartier */}
      {contenuVille?.quartier_md && (
        <section className="section-padding bg-secondary">
          <div className="container max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-heading font-normal mb-6">
              Le quartier
            </h2>
            <MarkdownContent content={contenuVille.quartier_md} />
          </div>
        </section>
      )}

      {/* Accès et environnement */}
      {contenuVille?.acces_md && (
        <section className="section-padding bg-background">
          <div className="container max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-heading font-normal mb-6">
              Accès et environnement
            </h2>
            <MarkdownContent content={contenuVille.acces_md} />
          </div>
        </section>
      )}

      {/* Exercer comme {profession} */}
      {hasProfessionContent && (
        <section className="section-padding bg-secondary">
          <div className="container max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-heading font-normal mb-6">
              Exercer comme {nomInclusifPluriel}
            </h2>
            {contenuProfession?.enjeux_md && (
              <MarkdownContent content={contenuProfession.enjeux_md} className="mb-8" />
            )}
            {contenuProfession?.patientele_md && (
              <MarkdownContent content={contenuProfession.patientele_md} className="mb-8" />
            )}
            {contenuProfession?.pourquoi_idn_md && (
              <MarkdownContent content={contenuProfession.pourquoi_idn_md} />
            )}
          </div>
        </section>
      )}

      {/* Pourquoi I-CA.RE */}
      <section className="section-padding bg-secondary">
        <div className="container max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-heading font-normal mb-10">
            Pourquoi I‑CA.RE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-heading font-normal mb-3">Foncière familiale indépendante</h3>
              <p className="text-sm text-muted-foreground">
                Une approche patrimoniale long terme, sans pression d'investisseurs externes.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-heading font-normal mb-3">Cabinets dédiés au soin et bien-être</h3>
              <p className="text-sm text-muted-foreground">
                Des espaces conçus pour les professions paramédicales et de bien-être,
                pensés pour la qualité de pratique.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-heading font-normal mb-3">Visibilité dans le réseau I‑CA.RE</h3>
              <p className="text-sm text-muted-foreground">
                Référencement dans l'annuaire patient I‑CA.RE et mise en avant via le réseau de cabinets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sections communes */}
      {contenuCommun.map((bloc, idx) => (
        <section
          key={bloc.content_key}
          className={`section-padding ${idx % 2 === 0 ? "bg-background" : "bg-secondary"}`}
        >
          <div className="container max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-heading font-normal mb-6">
              {bloc.titre_section}
            </h2>
            <MarkdownContent content={bloc.content_md} />
          </div>
        </section>
      ))}

      {/* Formulaire de demande */}
      <section id="demande" className="section-padding bg-background">
        <div className="container max-w-2xl">
          <div className="text-center mb-10">
            <p className="font-body text-xs uppercase font-bold tracking-[0.2em] text-primary mb-4">
              Prochaine étape
            </p>
            <h2 className="text-2xl md:text-3xl font-heading font-normal mb-4">
              Demander le dossier d'installation
            </h2>
            <p className="text-base text-muted-foreground">
              Recevez les informations détaillées : surfaces disponibles, conditions de
              location, équipements et planning précis. Notre équipe revient vers vous
              sous 48h ouvrées.
            </p>
          </div>
          <FormulaireInteretInstallation
            professionSlug={data.profession_slug}
            villeSlug={ville}
            professionLabel={data.profession_libelle}
            villeLabel={nomCourt}
          />
        </div>
      </section>
    </Layout>
  );
}