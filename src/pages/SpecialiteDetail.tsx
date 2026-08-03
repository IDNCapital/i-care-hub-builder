import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ChargementPage } from "@/components/ChargementPage";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { useSpecialites } from "@/hooks/useSpecialites";
import { usePraticiensPublics } from "@/hooks/usePraticiensPublics";
import { CartePraticien } from "@/components/patients/CartePraticien";
import { matchSpecialite, CABINETS_LABEL } from "@/lib/taxonomy";
import NotFound from "@/pages/NotFound";

const BASE_URL = "https://i-ca.re";

function truncateDesc(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.–—-]+$/, "") + "…";
}

export default function SpecialiteDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: specialites, loading: loadingS, error: errorS } = useSpecialites();
  const { data: praticiens, loading: loadingPr, error: errorPr } = usePraticiensPublics();

  const specialite = useMemo(
    () => specialites.find((s) => s.slug === slug),
    [specialites, slug],
  );

  const matchingPraticiens = useMemo(() => {
    if (!specialite) return [];
    return praticiens.filter((pr) => matchSpecialite(pr, specialite));
  }, [praticiens, specialite]);

  if (loadingS || loadingPr) {
    return <ChargementPage mode="loading" />;
  }

  if (errorS || errorPr) {
    return <ChargementPage mode="error" />;
  }

  if (!specialite) {
    return <NotFound />;
  }

  const canonicalPath = `/patients/specialite/${specialite.slug}`;
  const cabinetLabel = specialite.cabinet_slug ? CABINETS_LABEL[specialite.cabinet_slug] : null;
  const h1 = cabinetLabel
    ? `${specialite.nom} à ${cabinetLabel}, Bordeaux`
    : `${specialite.nom} à Bordeaux`;
  const title = cabinetLabel
    ? `${specialite.nom} à ${cabinetLabel} (Bordeaux) : praticiennes et praticiens I-CA.RE`
    : `${specialite.nom} à Bordeaux : praticiennes et praticiens I-CA.RE`;
  const description = truncateDesc(specialite.description_courte, 155);
  const noIndex = matchingPraticiens.length === 0;

  const graph: unknown[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Patients", item: `${BASE_URL}/patients` },
        { "@type": "ListItem", position: 2, name: "Annuaire", item: `${BASE_URL}/patients` },
        {
          "@type": "ListItem",
          position: 3,
          name: cabinetLabel ? h1 : specialite.nom,
          item: `${BASE_URL}${canonicalPath}`,
        },
      ],
    },
    {
      "@type": "CollectionPage",
      name: h1,
      url: `${BASE_URL}${canonicalPath}`,
      description: specialite.description_courte,
    },
  ];
  if (matchingPraticiens.length > 0) {
    graph.push({
      "@type": "ItemList",
      itemListElement: matchingPraticiens.map((pr, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: `${pr.prenom} ${pr.nom}`,
        url: `${BASE_URL}/praticien/${pr.slug}`,
      })),
    });
  }
  const jsonLd = { "@context": "https://schema.org", "@graph": graph };

  return (
    <Layout>
      <SeoHead title={title} description={description} path={canonicalPath} noIndex={noIndex} />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="pt-28 pb-10 md:pt-32 md:pb-14 bg-cream">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <nav aria-label="Fil d'ariane" className="font-sans text-[12px] text-[#6B6B6B] mb-4">
            <a href="/patients" className="hover:text-sage hover:underline">Patients</a>
            <span className="mx-2">›</span>
            <a href="/patients" className="hover:text-sage hover:underline">Annuaire</a>
            <span className="mx-2">›</span>
            <span>{specialite.nom}</span>
          </nav>
          <p className="font-sans font-bold uppercase text-[11px] tracking-[0.2em] text-sage mb-4">
            Espace Patients
          </p>
          <h1 className="font-heading font-normal text-3xl md:text-5xl text-anthracite leading-tight mb-6 text-balance">
            {h1}
          </h1>
          <p className="font-heading italic text-[18px] md:text-[22px] text-[#6B6B6B] leading-relaxed">
            {specialite.description_courte}
          </p>
        </div>
      </section>

      {/* Description longue (optionnelle) */}
      {specialite.description_longue && (
        <section className="bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 max-w-3xl">
            <MarkdownContent content={specialite.description_longue} />
          </div>
        </section>
      )}

      {/* Praticiennes et praticiens */}
      <section className="bg-background border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 max-w-5xl">
          <h2 className="font-heading font-normal text-2xl md:text-3xl text-anthracite mb-8 text-balance">
            Nos praticiennes et praticiens
          </h2>
          {matchingPraticiens.length === 0 ? (
            <div className="bg-cream rounded-2xl p-10 text-center">
              <p className="font-heading italic text-lg md:text-xl text-[#6B6B6B] mb-8">
                Nous n'avons pas encore de {specialite.nom.toLowerCase()} dans nos cabinets. Décrivez-nous votre besoin, nous vous orienterons.
              </p>
              <Button variant="gold" size="lg" asChild>
                <a href="/patients/decrire-mon-besoin">Décrire mon besoin</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingPraticiens.map((pr) => (
                <CartePraticien key={pr.slug} p={pr} />
              ))}
            </div>
          )}

          {/* Maillage vers problématiques */}
          <div className="mt-10 text-center">
            <a
              href="/patients/problematiques"
              className="font-sans text-sm md:text-base text-sage hover:underline whitespace-nowrap"
            >
              Explorer aussi par problématique →
            </a>
          </div>
        </div>
      </section>

      {/* CTA conciergerie */}
      <section className="py-20 bg-cream border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <p className="font-sans font-bold uppercase text-[11px] tracking-[0.2em] text-sage mb-6">
            Conciergerie patients
          </p>
          <h2 className="font-heading font-normal text-3xl md:text-4xl text-anthracite mb-6 text-balance">
            Vous cherchez la bonne personne pour vous accompagner&nbsp;?
          </h2>
          <p className="font-sans text-base md:text-lg text-[#6B6B6B] leading-relaxed mb-10 max-w-2xl mx-auto">
            Décrivez-nous votre besoin en quelques lignes. Nous vous orienterons vers la praticienne ou le praticien I-CA.RE le plus adapté.
          </p>
          <Button variant="gold" size="lg" asChild>
            <a href="/patients/decrire-mon-besoin">Décrire mon besoin</a>
          </Button>
        </div>
      </section>
    </Layout>
  );
}