import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";

interface RelatedLink {
  routeKey: string;
  labelFr: string;
  labelEn: string;
}

interface InsightLayoutProps {
  title: string;
  description: string;
  path: string;
  children: React.ReactNode;
  relatedLinks?: RelatedLink[];
}

export function InsightLayout({ title, description, path, children, relatedLinks }: InsightLayoutProps) {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  return (
    <Layout>
      <SeoHead title={title} description={description} path={path} />
      <article className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          {children}

          {/* I-CA.RE positioning block */}
          <section className="mt-16 pt-8 border-t border-border">
            <h2 className="text-xl font-heading font-bold mb-3">
              {lang === "fr" ? "L'approche I‑CA.RE" : "The I‑CA.RE approach"}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {lang === "fr"
                ? "I‑CA.RE développe et structure des espaces de soins adaptés aux praticiens du soin, du paramédical et du bien-être. Chaque lieu est conçu avec une attention particulière portée à la qualité des espaces, à la fonctionnalité, à l'implantation locale et à la cohérence économique d'usage."
                : "I‑CA.RE develops and structures care spaces tailored to care, allied health and wellbeing practitioners. Each space is designed with particular attention to quality, functionality, local integration and economic coherence of use."}
            </p>
          </section>

          {/* Related links */}
          {relatedLinks && relatedLinks.length > 0 && (
            <nav className="mt-12 pt-8 border-t border-border">
              <h2 className="text-lg font-heading font-bold mb-4">
                {lang === "fr" ? "Articles connexes" : "Related articles"}
              </h2>
              <ul className="space-y-2">
                {relatedLinks.map((link) => (
                  <li key={link.routeKey}>
                    <Link
                      to={localePath(lang, link.routeKey)}
                      className="text-primary hover:underline"
                    >
                      {lang === "fr" ? link.labelFr : link.labelEn}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Back to insights */}
          <div className="mt-8">
            <Link
              to={localePath(lang, "insights")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← {lang === "fr" ? "Tous les guides" : "All guides"}
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
}
