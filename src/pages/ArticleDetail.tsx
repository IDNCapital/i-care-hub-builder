import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ChargementPage } from "@/components/ChargementPage";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { formatDatePublication } from "@/components/ArticleCard";
import { supabase } from "@/integrations/supabase/client";
import NotFound from "@/pages/NotFound";
import { pageUrl } from "@/lib/siteUrl";


interface ArticleRow {
  slug: string;
  titre: string;
  chapo: string;
  contenu: string;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  updated_at: string;
}


function initialSsrHead() {
  if (typeof document === "undefined") return { canonical: null as string | null, nodes: [] as { node: Element; markup: string }[] };
  const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? null;
  const nodes = canonical ? Array.from(document.head.querySelectorAll('title,meta[name="description"],meta[name="robots"],link[rel="canonical"],link[rel="alternate"],meta[property^="og:"],meta[name^="twitter:"]')).map(node => ({ node, markup: node.outerHTML })) : [];
  return { canonical, nodes };
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const [initial] = useState(() => ({
    pathname,
    ...initialSsrHead(),
  }));
  const [navigated, setNavigated] = useState(false);
  useEffect(() => { if (pathname !== initial.pathname) setNavigated(true); }, [pathname, initial.pathname]);
  const provisional = navigated || pathname !== initial.pathname || (initial.canonical !== null && initial.canonical !== new URL(pageUrl(pathname)).href);
  useLayoutEffect(() => {
    if (!initial.canonical || initial.canonical === new URL(pageUrl(pathname)).href) return;
    for (const { node, markup } of initial.nodes) {
      if (node.parentNode === document.head && node.outerHTML === markup) node.remove();
    }
  }, [initial, pathname]);
  return <ArticleCourant key={slug ?? ""} slug={slug} pathname={pathname} provisional={provisional} />;
}

function ArticleCourant({ slug, pathname, provisional }: { slug: string | undefined; pathname: string; provisional: boolean }) {
  const [article, setArticle] = useState<ArticleRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErrored(false);
    (async () => {
      try {
        // La RLS ne renvoie que les articles au statut publié.
        const { data, error, status } = await supabase
          .from("articles")
          .select("slug, titre, chapo, contenu, meta_title, meta_description, published_at, updated_at")
          .eq("slug", slug ?? "")
          .maybeSingle();
        if (cancelled) return;
        if (error !== null || status !== 200 || data === undefined) throw new Error("Article inconnu");
        if (data === null) {
          setArticle(null);
          return;
        }
        const row = data as ArticleRow;
        if (row.slug !== slug || typeof row.titre !== "string" || typeof row.chapo !== "string" || typeof row.contenu !== "string" || typeof row.updated_at !== "string" || [row.meta_title, row.meta_description, row.published_at].some(value => value !== null && typeof value !== "string")) throw new Error("Article incoherent");
        setArticle(row);
      } catch {
        if (!cancelled) { setErrored(true); setArticle(null); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading || errored) {
    return <>
      {provisional && <SeoHead title={loading ? "Chargement de l'article | I-CA.RE" : "Article indisponible | I-CA.RE"} description="Le contenu de cet article ne peut pas encore être confirmé." path={pathname} noIndex />}
      <p role={loading ? "status" : "alert"} className="sr-only">{loading ? "Chargement de l'article..." : "L'article est indisponible pour le moment."}</p>
      <ChargementPage mode={loading ? "loading" : "error"} />
    </>;
  }

  if (!article) {
    return <><link rel="canonical" href={pageUrl(pathname)} /><NotFound /></>;
  }

  const canonicalPath = `/patients/articles/${article.slug}`;
  const canonical = pageUrl(canonicalPath);
  const datePublication = formatDatePublication(article.published_at);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.titre,
        description: article.meta_description ?? article.chapo,
        datePublished: article.published_at ?? undefined,
        dateModified: article.updated_at,
        author: { "@type": "Organization", name: "I-CA.RE", url: pageUrl("/") },
        publisher: { "@type": "Organization", name: "I-CA.RE", url: pageUrl("/") },
        mainEntityOfPage: canonical,
        url: canonical,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: pageUrl("/") },
          { "@type": "ListItem", position: 2, name: "Espace Patients", item: pageUrl("/patients") },
          { "@type": "ListItem", position: 3, name: "Articles", item: pageUrl("/patients/articles") },
          { "@type": "ListItem", position: 4, name: article.titre, item: canonical },
        ],
      },
    ],
  };

  return (
    <Layout>
      <SeoHead
        title={article.meta_title ?? `${article.titre} | I-CA.RE`}
        description={article.meta_description ?? article.chapo}
        path={canonicalPath}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="pt-28 pb-10 md:pt-32 md:pb-14 bg-cream">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <nav aria-label="Fil d'ariane" className="font-sans text-[12px] text-[#6B6B6B] mb-4">
            <a href="/patients/" className="hover:text-sage hover:underline">Espace Patients</a>
            <span className="mx-2">›</span>
            <a href="/patients/articles/" className="hover:text-sage hover:underline">Articles</a>
            <span className="mx-2">›</span>
            <span>{article.titre}</span>
          </nav>
          <p className="font-sans font-bold uppercase text-[11px] tracking-[0.2em] text-sage mb-4">
            Espace Patients
          </p>
          <h1 className="font-heading font-normal text-3xl md:text-5xl text-anthracite leading-tight mb-6 text-balance">
            {article.titre}
          </h1>
          {datePublication && (
            <p className="font-sans text-[13px] text-[#6B6B6B] mb-6">Publié le {datePublication}</p>
          )}
          <p className="font-heading italic text-[18px] md:text-[22px] text-[#6B6B6B] leading-relaxed">
            {article.chapo}
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 max-w-3xl">
          <MarkdownContent content={article.contenu} />
        </div>
      </section>

      {/* Encadré conciergerie */}
      <section className="bg-background pb-16 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="rounded-2xl p-8 md:p-10 text-center" style={{ backgroundColor: "#E2EAE5" }}>
            <p className="font-sans font-bold uppercase text-[11px] tracking-[0.2em] text-sage mb-4">
              Conciergerie patients
            </p>
            <h2 className="font-heading font-normal text-2xl md:text-3xl text-anthracite mb-4 text-balance">
              Vous souhaitez être orientée ou orienté&nbsp;?
            </h2>
            <p className="font-sans text-base text-[#6B6B6B] leading-relaxed mb-8 max-w-xl mx-auto">
              Décrivez-nous votre besoin en quelques lignes. Nous vous indiquerons la praticienne ou le praticien I‑CA.RE le plus adapté.
            </p>
            <Button variant="gold" size="lg" asChild>
              <a href="/patients/decrire-mon-besoin/">Décrire mon besoin</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}