import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { ArticleCard, type ArticleCardData } from "@/components/ArticleCard";
import { supabase } from "@/integrations/supabase/client";
import { pageUrl } from "@/lib/siteUrl";

const CANONICAL_PATH = "/patients/articles";

export default function ArticlesIndex() {
  const [articles, setArticles] = useState<ArticleCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // La RLS ne renvoie que les articles au statut publié.
      const { data, error } = await supabase
        .from("articles")
        .select("slug, titre, chapo, published_at")
        .order("published_at", { ascending: false });
      if (cancelled) return;
      setArticles(error ? [] : ((data ?? []) as ArticleCardData[]));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: pageUrl("/") },
          { "@type": "ListItem", position: 2, name: "Espace Patients", item: pageUrl("/patients") },
          { "@type": "ListItem", position: 3, name: "Articles", item: pageUrl(CANONICAL_PATH) },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: articles.map((a, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: a.titre,
          url: pageUrl(`/patients/articles/${a.slug}`),
        })),
      },
    ],
  };

  return (
    <Layout>
      <SeoHead
        title="Articles et conseils bien-être | Espace Patients I-CA.RE"
        description="Les articles de l'Espace Patients I-CA.RE : repères clairs sur le soin, le paramédical et le bien-être, et orientation vers la bonne praticienne ou le bon praticien."
        path={CANONICAL_PATH}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="pt-28 pb-10 md:pt-32 md:pb-14 bg-cream">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <nav aria-label="Fil d'ariane" className="font-sans text-[12px] text-[#6B6B6B] mb-4">
            <a href="/patients" className="hover:text-sage hover:underline">Espace Patients</a>
            <span className="mx-2">›</span>
            <span>Articles</span>
          </nav>
          <p className="font-sans font-bold uppercase text-[11px] tracking-[0.2em] text-sage mb-4">
            Espace Patients
          </p>
          <h1 className="font-heading font-normal text-3xl md:text-5xl text-anthracite leading-tight mb-6 text-balance">
            Nos articles
          </h1>
          <p className="font-heading italic text-[18px] md:text-[22px] text-[#6B6B6B] leading-relaxed">
            Des repères clairs pour mieux comprendre votre besoin et trouver la personne qui vous accompagnera.
          </p>
        </div>
      </section>

      {/* Liste */}
      <section className="bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 max-w-5xl">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : articles.length === 0 ? (
            <div className="bg-cream rounded-2xl p-10 text-center">
              <p className="font-heading italic text-lg md:text-xl text-[#6B6B6B] mb-8">
                Nos premiers articles arrivent bientôt.
              </p>
              <Button variant="outline" size="lg" asChild>
                <a href="/patients/decrire-mon-besoin">Décrire mon besoin</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}