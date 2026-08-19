import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ChargementPage } from "@/components/ChargementPage";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { ArticleCard, type ArticleCardData } from "@/components/ArticleCard";
import { supabase } from "@/integrations/supabase/client";
import { useProblematiques } from "@/hooks/useProblematiques";
import { usePraticiensPublics } from "@/hooks/usePraticiensPublics";
import { CartePraticien } from "@/components/patients/CartePraticien";
import { norm, getPraticienProblematiqueTags } from "@/lib/taxonomy";
import NotFound from "@/pages/NotFound";
import { pageUrl } from "@/lib/siteUrl";


function truncateDesc(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.–—-]+$/, "") + "…";
}

export default function ProblematiqueDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: problematiques, loading: loadingP, error: errorP } = useProblematiques();
  const { data: praticiens, loading: loadingPr, error: errorPr } = usePraticiensPublics();
  const [articles, setArticles] = useState<ArticleCardData[]>([]);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      // La RLS ne renvoie que les articles au statut publié.
      const { data, error } = await supabase
        .from("articles")
        .select("slug, titre, chapo, published_at")
        .contains("problematiques_associees", [slug])
        .order("published_at", { ascending: false });
      if (cancelled) return;
      setArticles(error ? [] : ((data ?? []) as ArticleCardData[]));
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const problematique = useMemo(
    () => problematiques.find((p) => p.slug === slug),
    [problematiques, slug],
  );

  const matchingPraticiens = useMemo(() => {
    if (!problematique) return [];
    const targets = [problematique.nom, ...(problematique.synonymes ?? [])].map(norm);
    return praticiens.filter((pr) => {
      const source = getPraticienProblematiqueTags(pr);
      return source.some((tag) => targets.includes(norm(tag)));
    });
  }, [praticiens, problematique]);

  if (loadingP || loadingPr) {
    return <ChargementPage mode="loading" />;
  }

  if (errorP || errorPr) {
    return <ChargementPage mode="error" />;
  }

  if (!problematique) {
    return <NotFound />;
  }

  const canonicalPath = `/patients/problematiques/${problematique.slug}`;
  const title = `${problematique.nom} : trouver une praticienne ou un praticien à Bordeaux | I-CA.RE`;
  const description = truncateDesc(problematique.description_courte, 155);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Patients", item: pageUrl("/patients") },
          { "@type": "ListItem", position: 2, name: "Problématiques", item: pageUrl("/patients/problematiques") },
          { "@type": "ListItem", position: 3, name: problematique.nom, item: pageUrl(canonicalPath) },
        ],
      },
      {
        "@type": "MedicalCondition",
        name: problematique.nom,
        description: problematique.description_courte,
        url: pageUrl(canonicalPath),
      },
      ...(matchingPraticiens.length > 0
        ? [
            {
              "@type": "ItemList",
              itemListElement: matchingPraticiens.map((pr, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                name: `${pr.prenom} ${pr.nom}`,
                url: pageUrl(`/praticien/${pr.slug}`),
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <Layout>
      <SeoHead title={title} description={description} path={canonicalPath} />
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
            <a href="/patients/problematiques" className="hover:text-sage hover:underline">Problématiques</a>
            <span className="mx-2">›</span>
            <span>{problematique.nom}</span>
          </nav>
          <p className="font-sans font-bold uppercase text-[11px] tracking-[0.2em] text-sage mb-4">
            Problématique
          </p>
          <h1 className="font-heading font-normal text-3xl md:text-5xl text-anthracite leading-tight mb-6 text-balance">
            {problematique.nom}
          </h1>
          <p className="font-heading italic text-[18px] md:text-[22px] text-[#6B6B6B] leading-relaxed">
            {problematique.description_courte}
          </p>
        </div>
      </section>

      {/* Description longue (optionnelle) */}
      {problematique.description_longue && (
        <section className="bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 max-w-3xl">
            <MarkdownContent content={problematique.description_longue} />
          </div>
        </section>
      )}

      {/* Praticiennes et praticiens */}
      <section className="bg-background border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 max-w-5xl">
          <h2 className="font-heading font-normal text-2xl md:text-3xl text-anthracite mb-8 text-balance">
            Praticiennes et praticiens qui accompagnent cette problématique
          </h2>
          {matchingPraticiens.length === 0 ? (
            <div className="bg-cream rounded-2xl p-10 text-center">
              <p className="font-heading italic text-lg md:text-xl text-[#6B6B6B] mb-8">
                Nos praticiennes et praticiens n'affichent pas encore cette problématique.
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
        </div>
      </section>

      {/* Pour aller plus loin (maillage articles) */}
      {articles.length > 0 && (
        <section className="bg-background border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 max-w-5xl">
            <h2 className="font-heading font-normal text-2xl md:text-3xl text-anthracite mb-8 text-balance">
              Pour aller plus loin
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

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