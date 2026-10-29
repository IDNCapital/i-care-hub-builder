import { Link } from "react-router-dom";
import { usePraticiensCabinet } from "@/hooks/usePraticiensCabinet";
import { CartePraticienPublic } from "@/components/CartePraticienPublic";
import { pageUrl } from "@/lib/siteUrl";
import { marqueAffichee } from "@/lib/brand";

interface Props {
  cabinetSlug: string;
  cabinetNomCourt: string;
  cabinetUrl: string;
}

/**
 * Section secondaire orientée patient, affichée en bas des pages
 * /projets/[slug]. Masquée si aucun praticien validé.
 * Inclut un schema.org MedicalBusiness avec serviceProvider.
 */
export function SectionPraticiensDuCabinet({
  cabinetSlug,
  cabinetNomCourt,
  cabinetUrl,
}: Props) {
  const { data: praticiens, loading, error, retry } = usePraticiensCabinet(cabinetSlug);

  // Marqueur data-praticiens-cabinet : il porte le nombre de fiches rendues,
  // et vaut "0" quand la requete a abouti sans resultat. Sans lui, deux etats
  // sont indiscernables depuis le DOM, "la requete court encore" et "elle a
  // fini, il n'y a personne", et le prerendu ne peut pas savoir s'il doit
  // attendre. Le JSON-LD de cette section vit dans le corps depuis le lot 2 :
  // il n'existe que tant que la section rend, la capture doit donc attendre un
  // fait declare et non une duree. Voir ATTENTES_DOM dans scripts/prerender.mjs.
  if (loading) return <div role="status" className="container py-8 text-sm text-muted-foreground">Chargement du réseau de ce cabinet…</div>;
  if (error) return (
    <div role="alert" className="container py-8 text-center space-y-3">
      <p className="text-sm text-muted-foreground">Le réseau de ce cabinet n'a pas pu être reçu. Sa présence reste inconnue.</p>
      <button type="button" onClick={() => void retry()} className="inline-flex min-h-11 items-center underline underline-offset-2 rounded focus:outline-none focus:ring-2 focus:ring-primary">
        Réessayer le réseau
      </button>
    </div>
  );
  if (praticiens.length === 0) return <div hidden data-praticiens-cabinet="0" />;

  const max = Math.min(praticiens.length, 8);
  const visibles = praticiens.slice(0, max);

  const medicalSpecialty = Array.from(
    new Set(
      praticiens.flatMap((p) => [
        ...(p.specialites ?? []),
        ...(p.specialites_derivees ?? []),
      ]),
    ),
  ).filter((s) => typeof s === "string" && s.trim().length > 0);

  const medicalBusinessLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: cabinetNomCourt,
    url: cabinetUrl,
    ...(medicalSpecialty.length > 0 ? { medicalSpecialty } : {}),
    serviceProvider: visibles.map((p) => ({
      "@type": "Person",
      name: `${p.prenom} ${p.nom}`,
      jobTitle: p.profession,
      url: pageUrl(`/praticien/${p.slug}`),
      ...(p.photo_url ? { image: p.photo_url } : {}),
    })),
  };

  return (
    <section
      className="section-padding bg-secondary/40 border-t border-border"
      data-praticiens-cabinet={visibles.length}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalBusinessLd).replace(/</g, "\\u003c") }}
      />
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="font-body text-xs uppercase font-bold tracking-[0.2em] text-primary mb-4">
            Praticiennes et praticiens du cabinet
          </p>
          <h2 className="font-heading font-normal text-3xl md:text-4xl text-foreground mb-4">
            Le réseau présent dans ce lieu
          </h2>
          <p className="font-body text-base text-muted-foreground leading-relaxed">
            Les spécialistes accueillant des consultations ouvertes au public à {marqueAffichee(cabinetNomCourt)}.
          </p>
        </div>

        {praticiens.length > max && (
          <p className="text-center text-sm text-muted-foreground mb-6">
            Les {max} premières fiches sont affichées sur {praticiens.length} praticiens du cabinet.
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibles.map((p) => (
            <CartePraticienPublic
              key={p.slug}
              nom={`${p.prenom} ${p.nom}`}
              photoUrl={p.photo_url}
              specialite={p.profession}
              problematiquesPrincipales={p.problematiques}
              href={`/praticien/${p.slug}`}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/patients/"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Voir l'ensemble du réseau à Bordeaux →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SectionPraticiensDuCabinet;