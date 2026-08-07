import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { useProfessionsInstallation, useCabinetsPipeline } from "@/hooks/useInstallation";
import { cabinetNomCourt, formatDateOuverture, installationUrl } from "@/lib/installation";
import { FormulaireInteretInstallation } from "@/components/FormulaireInteretInstallation";
import { CabinetVisuel } from "@/components/CabinetVisuel";

export default function SinstallerIndex() {
  const { data: professions = [] } = useProfessionsInstallation();
  const { data: cabinets = [] } = useCabinetsPipeline();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://i-ca.re/" },
      { "@type": "ListItem", position: 2, name: "S'installer", item: "https://i-ca.re/sinstaller" },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "S'installer en cabinet I-CA.RE",
    url: "https://i-ca.re/sinstaller",
    description:
      "Quatre cabinets I-CA.RE en cours d'ouverture en Nouvelle-Aquitaine et Occitanie. Trouvez l'espace adapté à votre pratique.",
  };

  return (
    <Layout>
      <SeoHead
        title="S'installer en cabinet I-CA.RE — Cabinets en ouverture à Bordeaux et Toulouse"
        description="Quatre cabinets I-CA.RE en cours d'ouverture en Nouvelle-Aquitaine et Occitanie. Découvrez les opportunités d'installation pour 9 professions du soin, paramédical et bien-être."
        path="/sinstaller"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(webPageJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-normal mb-6">
            S'installer en cabinet I‑CA.RE
          </h1>
          <p className="text-xl text-muted-foreground">
            Quatre cabinets en cours d'ouverture en Nouvelle-Aquitaine et Occitanie.
            Trouvez l'espace adapté à votre pratique.
          </p>
        </div>
      </section>

      {/* Villes pipeline */}
      <section className="section-padding bg-background">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-heading font-normal mb-10">
            Villes en cours d'ouverture
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cabinets.map((c) => (
              <article
                key={c.id}
                className="bg-secondary rounded-lg p-6 flex flex-col gap-3 border border-border"
              >
                <CabinetVisuel
                  projectSlug={c.slug}
                  alt={`Cabinet I‑CA.RE ${cabinetNomCourt(c.name)}`}
                  variant="card"
                  className="-mx-6 -mt-6 mb-1"
                />
                <h3 className="text-xl font-heading font-normal">
                  {cabinetNomCourt(c.name)}
                </h3>
                {c.address && (
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{c.address}</span>
                  </p>
                )}
                <p className="text-sm text-primary font-medium">
                  {formatDateOuverture(c.date_ouverture_cible)}
                </p>
                <a
                  href="#professions"
                  className="text-sm font-medium text-foreground underline underline-offset-4 mt-auto pt-2"
                >
                  Découvrir les opportunités
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Professions × villes */}
      <section id="professions" className="section-padding bg-secondary">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-heading font-normal mb-10">
            Professions accueillies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {professions.map((p) => (
              <article key={p.id} className="bg-background rounded-lg p-6 border border-border">
                <h3 className="text-lg font-heading font-normal mb-4">
                  {p.nom_inclusif_pluriel}
                </h3>
                <ul className="space-y-2">
                  {cabinets.map((c) => (
                    <li key={c.id}>
                      <Link
                        to={installationUrl(p.slug, c.slug_installation)}
                        className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1.5"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        {cabinetNomCourt(c.name)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire de demande */}
      <section id="demande" className="section-padding bg-background">
        <div className="container max-w-2xl">
          <div className="text-center mb-10">
            <p className="font-body text-xs uppercase font-bold tracking-[0.2em] text-primary mb-4">
              Vous souhaitez en savoir plus ?
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-normal mb-4">
              Demander le dossier d'installation
            </h2>
            <p className="text-base text-muted-foreground">
              Recevez les informations détaillées : surfaces disponibles, conditions de
              location, équipements et planning précis. Notre équipe revient vers vous
              sous 48h ouvrées.
            </p>
          </div>
          <FormulaireInteretInstallation />
        </div>
      </section>
    </Layout>
  );
}