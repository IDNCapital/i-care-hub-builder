import { useMemo, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProblematiques } from "@/hooks/useProblematiques";
import { norm } from "@/lib/taxonomy";
import { pageUrl } from "@/lib/siteUrl";


export default function ProblematiquesIndex() {
  const { data: problematiques, loading } = useProblematiques();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return problematiques;
    return problematiques.filter((p) => {
      if (norm(p.nom).includes(q)) return true;
      return (p.synonymes ?? []).some((s) => norm(s).includes(q));
    });
  }, [problematiques, query]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Patients", item: pageUrl("/patients") },
          { "@type": "ListItem", position: 2, name: "Problématiques", item: pageUrl("/patients/problematiques") },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: problematiques.map((p, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: p.nom,
          url: pageUrl(`/patients/problematiques/${p.slug}`),
        })),
      },
    ],
  };

  return (
    <Layout>
      <SeoHead
        title="Problématiques accompagnées par nos praticiennes et praticiens | I-CA.RE Bordeaux"
        description="Explorez par problématique et trouvez la praticienne ou le praticien I-CA.RE qui vous correspond à Bordeaux : stress, anxiété, sommeil, deuil, parentalité et plus."
        path="/patients/problematiques"
      />
      {problematiques.length > 0 && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Hero compact */}
      <section className="pt-28 pb-8 md:pt-32 md:pb-10 bg-cream">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <nav
            aria-label="Fil d'ariane"
            className="font-sans text-[12px] text-[#6B6B6B] mb-4"
          >
            <a href="/patients" className="hover:text-sage hover:underline">
              Patients
            </a>
            <span className="mx-2">›</span>
            <span>Problématiques</span>
          </nav>
          <p className="font-sans font-bold uppercase text-[11px] tracking-[0.2em] text-sage mb-4">
            Espace Patients
          </p>
          <h1 className="font-heading font-normal text-3xl md:text-5xl text-anthracite leading-tight mb-3 text-balance">
            Par où commencer&nbsp;? Explorez par problématique
          </h1>
          <p className="font-heading italic text-[18px] md:text-[20px] text-[#6B6B6B]">
            Une entrée simple pour trouver la praticienne ou le praticien qui vous accompagnera.
          </p>
        </div>
      </section>

      {/* Recherche + grille */}
      <section className="bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-5xl">
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une problématique…"
              aria-label="Rechercher une problématique"
              className="pl-9 bg-background border-[#BFBFBF] focus-visible:ring-sage focus-visible:ring-2 focus-visible:ring-offset-0"
            />
          </div>

          {loading ? (
            <div className="py-20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-cream rounded-2xl p-10 text-center">
              <p className="font-heading italic text-xl text-[#6B6B6B]">
                Aucune problématique ne correspond à votre recherche.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <a
                  key={p.slug}
                  href={`/patients/problematiques/${p.slug}`}
                  className="group flex flex-col bg-background border border-border rounded-2xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-card hover:border-sage focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                >
                  <h2 className="font-heading font-normal text-[22px] leading-tight text-anthracite mb-2">
                    {p.nom}
                  </h2>
                  <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed">
                    {p.description_courte}
                  </p>
                  <span className="mt-4 font-sans text-[13px] text-sage font-medium group-hover:underline">
                    Voir les praticiennes et praticiens →
                  </span>
                </a>
              ))}
            </div>
          )}
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
            Décrivez-nous votre besoin en quelques lignes. Nous vous orienterons vers la praticienne ou le praticien I‑CA.RE le plus adapté.
          </p>
          <Button variant="gold" size="lg" asChild>
            <a href="/patients/decrire-mon-besoin">Décrire mon besoin</a>
          </Button>
        </div>
      </section>
    </Layout>
  );
}