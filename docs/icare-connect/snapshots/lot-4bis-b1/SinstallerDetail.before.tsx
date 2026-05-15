import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, ChevronRight } from "lucide-react";
import NotFound from "@/pages/NotFound";
import { useInstallationPage } from "@/hooks/useInstallation";
import { cabinetNomCourt, formatDateOuverture } from "@/lib/installation";

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
  const { data, isLoading } = useInstallationPage(profession ?? "", ville ?? "");

  if (isLoading) {
    return (
      <Layout>
        <div className="container pt-32 pb-16">
          <p className="text-muted-foreground">Chargement…</p>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return <NotFound />;
  }

  const nomCourt = cabinetNomCourt(data.cabinet_nom_complet);
  const ouvertureLabel = formatDateOuverture(data.date_ouverture);
  const professionLower = data.profession_libelle.toLowerCase();
  const path = data.url_path;
  const canonical = `https://i-ca.re${path}`;
  const postal = parsePostalAddress(data.cabinet_adresse, data.cabinet_ville);

  const subjectMail = encodeURIComponent(
    `Installation ${data.profession_libelle} - ${nomCourt}`
  );
  const mailto = `mailto:contact@i-ca.re?subject=${subjectMail}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://i-ca.re/" },
      { "@type": "ListItem", position: 2, name: "S'installer", item: "https://i-ca.re/sinstaller" },
      { "@type": "ListItem", position: 3, name: data.profession_libelle, item: `https://i-ca.re/sinstaller/${data.profession_slug}` },
      { "@type": "ListItem", position: 4, name: nomCourt, item: canonical },
    ],
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: data.cabinet_nom_complet,
    address: {
      "@type": "PostalAddress",
      streetAddress: postal.streetAddress,
      postalCode: postal.postalCode,
      addressLocality: postal.addressLocality,
      addressCountry: "FR",
    },
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Location de cabinet pour ${professionLower}`,
    provider: {
      "@type": "Organization",
      name: "I-CA.RE",
      url: "https://i-ca.re",
    },
    areaServed: {
      "@type": "City",
      name: data.cabinet_ville,
    },
  };

  return (
    <Layout>
      <SeoHead
        title={`S'installer comme ${professionLower} à ${nomCourt} — Cabinet I-CA.RE`}
        description={`Découvrez les opportunités d'installation pour ${professionLower} au Cabinet I-CA.RE de ${nomCourt}, ${data.cabinet_adresse ?? ""}. ${ouvertureLabel}. Demandez le dossier d'installation.`}
        path={path}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(localBusinessJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceJsonLd)}</script>
      </Helmet>

      {/* Breadcrumb visuel */}
      <nav aria-label="Fil d'Ariane" className="container pt-28 pb-4">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <li><Link to="/" className="hover:text-primary">Accueil</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link to="/sinstaller" className="hover:text-primary">S'installer</Link></li>
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
            S'installer comme {professionLower} à {nomCourt}
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

      {/* Le cabinet */}
      <section className="section-padding bg-background">
        <div className="container max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-heading font-normal mb-6">
            Le cabinet
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Détails complets en cours de préparation. Demandez le dossier d'installation
            pour recevoir les informations détaillées : surfaces disponibles, conditions
            de location, équipements et planning précis.
          </p>
        </div>
      </section>

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
                Référencement dans l'annuaire patient I-CA.RE et mise en avant via le réseau de cabinets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-background">
        <div className="container max-w-3xl text-center">
          <Button variant="hero" asChild>
            <a href={mailto}>
              <Mail className="mr-2 h-5 w-5" />
              Demander le dossier d'installation
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
}