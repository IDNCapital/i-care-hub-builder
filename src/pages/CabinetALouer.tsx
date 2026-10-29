import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight, CalendarDays, MapPin, Ruler } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { FadeImage } from "@/components/FadeImage";
import { SinstallerLinksCabinet } from "@/components/SinstallerLinksCabinet";
import { useCabinetsInstallation } from "@/hooks/useInstallation";
import { cabinetNomCourt } from "@/lib/installation";
import { marqueAffichee } from "@/lib/brand";
import { pageUrl } from "@/lib/siteUrl";
import {
  GRILLE_TEMPS_PARTIEL,
  MENTION_TEMPS_PARTIEL,
  MENTION_TEMPS_PLEIN,
  cabinetALouerParSlug,
  cheminCabinetALouer,
  deProfession,
  formatDate,
  formatLoyer,
  fourchettes,
  libelleFormule,
  lienContactCabinet,
  resumeOffre,
  surfaceLot,
  type CabinetALouer as Cabinet,
  type LotALouer,
} from "@/lib/cabinetsALouer";
import NotFound from "./NotFound";

function statutLot(l: LotALouer, c: Cabinet): string {
  const ouvert = c.ouvert;
  if (c.disponibiliteLots) return c.disponibiliteLots;
  if (l.disponibleLe) return `Disponible le ${formatDate(l.disponibleLe)}`;
  if (l.statut === "libre") return ouvert ? "Libre" : "Libre, date de disponibilité à confirmer";
  if (l.statut === "en_travaux") return "En travaux, date à confirmer";
  return "Ouverture prévue en 2027";
}

/** Donnees structurees : le lieu (MedicalBusiness) et ses offres visibles, plus le fil d'Ariane. */
function jsonLd(c: Cabinet, chemin: string) {
  const offresTempsPlein = c.lots.map((l) => {
    const surface = surfaceLot(l);
    const offre: Record<string, unknown> = {
      "@type": "Offer",
      name: `${l.nombre ? `${l.nombre} cabinets` : l.libelle}${surface ? `, ${surface}` : ""}, ${MENTION_TEMPS_PLEIN}`,
      price: l.loyerMensuelEur,
      priceCurrency: "EUR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: l.loyerMensuelEur,
        priceCurrency: "EUR",
        unitText: "mois",
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
      },
      url: pageUrl(chemin),
    };
    if (l.disponibleLe && !c.disponibiliteLots) offre.availabilityStarts = l.disponibleLe;
    return offre;
  });
  const offresTempsPartiel = GRILLE_TEMPS_PARTIEL.map((g) => ({
    "@type": "Offer",
    name: `Temps partiel, ${libelleFormule(g).toLowerCase()}, ${MENTION_TEMPS_PARTIEL}`,
    price: g.loyerMensuelEur,
    priceCurrency: "EUR",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: g.loyerMensuelEur,
      priceCurrency: "EUR",
      unitText: "mois",
      referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
    },
    url: pageUrl(chemin),
  }));
  const offres = [...offresTempsPlein, ...offresTempsPartiel];
  const adresse: Record<string, unknown> = {
    "@type": "PostalAddress",
    addressLocality: c.ville,
    postalCode: c.codePostal,
    addressCountry: "FR",
  };
  adresse.streetAddress = c.rue;
  return [
    {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      name: c.nom,
      description: c.seoDescription,
      url: pageUrl(chemin),
      email: "contact@i-ca.re",
      address: adresse,
      areaServed: { "@type": "City", name: c.ville },
      makesOffer: offres,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: pageUrl("/") },
        {
          "@type": "ListItem",
          position: 2,
          name: c.region === "toulouse" ? "Location de cabinet à Toulouse" : "Location de cabinet à Bordeaux",
          item: pageUrl(c.region === "toulouse" ? "/location-cabinet-toulouse" : "/location-cabinet-bordeaux"),
        },
        { "@type": "ListItem", position: 3, name: `Cabinet à louer, ${c.nomCourt}`, item: pageUrl(chemin) },
      ],
    },
  ];
}

export default function CabinetALouer() {
  const { site } = useParams<{ site: string }>();
  const [params] = useSearchParams();
  const c = cabinetALouerParSlug(site);
  const { data: cabinetsInstallation } = useCabinetsInstallation();

  if (!c) return <NotFound />;

  const chemin = cheminCabinetALouer(c);
  const provenance = params.get("source");
  const f = fourchettes(c);
  const adresse = `${c.rue}, ${c.codePostal} ${c.ville}`;
  const installation = (cabinetsInstallation ?? []).find((x) => x.slug === c.projetSlug);
  const pageRegion = c.region === "toulouse" ? "/location-cabinet-toulouse" : "/location-cabinet-bordeaux";
  const nomAffiche = marqueAffichee(c.nom);
  const Terme = c.terme === "bureau" ? "Bureau" : "Cabinet";

  return (
    <Layout>
      <SeoHead title={c.seoTitle} description={c.seoDescription} path={chemin} />
      {jsonLd(c, chemin).map((bloc, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bloc) }} />
      ))}

      <nav aria-label="Fil d'Ariane" className="container pt-28 pb-4">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <li><Link to="/" className="hover:text-primary">Accueil</Link></li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to={pageRegion} className="hover:text-primary">
              {c.region === "toulouse" ? "Location de cabinet à Toulouse" : "Location de cabinet à Bordeaux"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground">{c.nomCourt}</li>
        </ol>
      </nav>

      <section className="pb-12">
        <div className="container max-w-5xl">
          <h1 className="text-3xl md:text-5xl font-heading font-bold leading-tight mb-5 break-words">
            {marqueAffichee(c.titreAnnonce)}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">{marqueAffichee(c.chapeau)}</p>
          <p className="flex items-start gap-2 text-base mb-8">
            <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" aria-hidden="true" />
            <span>{adresse}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" asChild>
              <Link to={lienContactCabinet(c, { provenance })}>
                Demander une visite
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="hero-outline" asChild>
              <Link to={`/projets/${c.projetSlug}`}>Découvrir le lieu {nomAffiche}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/50" aria-labelledby="offre">
        <div className="container max-w-5xl">
          <h2 id="offre" className="section-title">
            {f.nombreLots > 1 ? `${Terme === "Bureau" ? "Bureaux" : "Cabinets"} disponibles` : `${Terme} disponible`} {c.aLieu}
          </h2>
          <p className="text-muted-foreground mb-8 flex items-start gap-2">
            <CalendarDays className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" aria-hidden="true" />
            <span>{c.disponibilite}</span>
          </p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {c.lots.map((l) => (
              <li key={l.libelle} className="card-premium p-5">
                <h3 className="text-lg font-heading font-semibold mb-2">
                  {l.nombre ? `${l.nombre} cabinets` : l.libelle}
                </h3>
                <p className="text-2xl font-bold">{formatLoyer(l.loyerMensuelEur)}</p>
                <p className="text-xs text-muted-foreground mb-2">{MENTION_TEMPS_PLEIN}</p>
                {surfaceLot(l) && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Ruler className="w-4 h-4" aria-hidden="true" /> {surfaceLot(l)}
                  </p>
                )}
                <p className="text-sm mt-2">{statutLot(l, c)}</p>
              </li>
            ))}
          </ul>
          <ul className="mt-8 space-y-2 list-disc pl-5 text-muted-foreground">
            {c.pointsCles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-padding" aria-labelledby="temps-partiel">
        <div className="container max-w-5xl">
          <h2 id="temps-partiel" className="section-title">À temps partiel : la grille à la journée</h2>
          <p className="text-muted-foreground mb-6">
            Un cabinet partagé à la journée entière entre plusieurs praticiens, chacun sur ses jours fixes de la
            semaine, loué nu. Tarifs {MENTION_TEMPS_PARTIEL}.
          </p>
          <ul className="grid sm:grid-cols-3 gap-4">
            {GRILLE_TEMPS_PARTIEL.map((g) => (
              <li key={g.jours} className="card-premium p-5">
                <h3 className="text-lg font-heading font-semibold mb-2">{libelleFormule(g)}</h3>
                <p className="text-2xl font-bold">{formatLoyer(g.loyerMensuelEur)}</p>
                <p className="text-xs text-muted-foreground">{MENTION_TEMPS_PARTIEL}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm">
            <Link to="/cabinet-a-la-journee" className="font-semibold text-primary inline-flex items-center gap-1.5">
              Découvrir le cabinet à la journée <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      {c.visuels.length > 0 && (
        <section className="section-padding" aria-labelledby="visuels">
          <div className="container max-w-5xl">
            <h2 id="visuels" className="section-title">Le lieu en images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {c.visuels.slice(0, 6).map((v) => (
                <figure key={v.src}>
                  <FadeImage
                    src={v.src}
                    alt={marqueAffichee(v.legende)}
                    className="w-full aspect-[4/3] object-cover rounded-md"
                    fadeDuration={300}
                  />
                  <figcaption className="text-xs text-muted-foreground mt-1.5">
                    {marqueAffichee(v.legende)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-muted/50" aria-labelledby="professions">
        <div className="container max-w-5xl">
          <h2 id="professions" className="section-title">Selon votre profession</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {c.professions.map((p) => (
              <div key={p.slug} id={p.slug} className="scroll-mt-28">
                <h3 className="text-lg font-heading font-semibold mb-2">
                  {Terme} {deProfession(p.singulier)} à louer {c.aLieu}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {resumeOffre(c)}, ou à temps partiel dès {formatLoyer(GRILLE_TEMPS_PARTIEL[0].loyerMensuelEur)}{" "}
                  {MENTION_TEMPS_PARTIEL}, dans un lieu partagé ouvert aux {p.pluriel} et aux autres professionnels du
                  médical et du paramédical.
                </p>
                <Link
                  to={lienContactCabinet(c, { profession: p.slug, provenance })}
                  className="text-sm font-semibold text-primary inline-flex items-center gap-1.5"
                >
                  Demander une visite <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
          {installation?.slug_installation && (
            <SinstallerLinksCabinet
              className="mt-12"
              slugInstallation={installation.slug_installation}
              cabinetLabel={cabinetNomCourt(installation.name)}
            />
          )}
        </div>
      </section>

      <section className="section-padding" aria-labelledby="contact-cabinet">
        <div className="container max-w-3xl text-center">
          <h2 id="contact-cabinet" className="section-title">Visiter {c.nomCourt}</h2>
          <p className="text-muted-foreground mb-8">
            Le formulaire de contact du site transmet votre demande avec le nom du lieu.
          </p>
          <Button variant="hero" asChild>
            <Link to={lienContactCabinet(c, { provenance })}>
              Demander une visite
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
