import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { FadeImage } from "@/components/FadeImage";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";

/* ── Types ─────────────────────────────────────────────── */

export interface TocItem {
  id: string;
  label: string;
}
export interface FaqItem {
  question: string;
  answer: React.ReactNode;
}
export interface KeyFigure {
  label: string;
  value: string;
}
export interface RelatedGuide {
  routeKey: string;
  title: string;
  description: string;
}

export interface InsightArticleTemplateProps {
  /* SEO */
  title: string;
  description: string;
  path: string;
  /* Hero */
  heroImage: string;
  heroImageAlt: string;
  /* Content */
  articleTitle: string;
  intro: React.ReactNode;
  takeaways: React.ReactNode[];
  toc: TocItem[];
  children: React.ReactNode;
  keyFigures?: KeyFigure[];
  faq: FaqItem[];
  /* CTA */
  ctaPrimaryRoute: string;
  ctaPrimaryLabel: string;
  ctaSecondaryRoute?: string;
  ctaSecondaryLabel?: string;
  /* Related */
  relatedGuides: RelatedGuide[];
}

/* ── Component ─────────────────────────────────────────── */

export function InsightArticleTemplate({
  title,
  description,
  path,
  heroImage,
  heroImageAlt,
  articleTitle,
  intro,
  takeaways,
  toc,
  children,
  keyFigures,
  faq,
  ctaPrimaryRoute,
  ctaPrimaryLabel,
  ctaSecondaryRoute,
  ctaSecondaryLabel,
  relatedGuides,
}: InsightArticleTemplateProps) {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const l =
    lang === "fr"
      ? {
          home: "Accueil",
          guides: "Guides pratiques",
          takeaways: "Ce qu'il faut retenir",
          toc: "Sommaire",
          figures: "Repères pratiques",
          faq: "Questions fréquentes",
          approach: "L'approche I‑CA.RE",
          approachText:
            "I‑CA.RE développe et structure des espaces de soins adaptés aux praticiens du soin, du paramédical et du bien-être. Chaque lieu est conçu avec une attention particulière portée à la qualité des espaces, à la fonctionnalité, à l'implantation locale et à la cohérence économique d'usage.",
          related: "Guides complémentaires",
          back: "Tous les guides",
          cta: "Vous cherchez un cabinet à Bordeaux\u00a0?",
          ctaText:
            "Découvrez les espaces I‑CA.RE et échangeons sur votre projet d'installation.",
        }
      : {
          home: "Home",
          guides: "Practical guides",
          takeaways: "Key takeaways",
          toc: "Contents",
          figures: "Key figures",
          faq: "Frequently asked questions",
          approach: "The I‑CA.RE approach",
          approachText:
            "I‑CA.RE develops and structures care spaces tailored to care, allied health and wellbeing practitioners. Each space is designed with particular attention to quality, functionality, local integration and economic coherence of use.",
          related: "Related guides",
          back: "All guides",
          cta: "Looking for an office in Bordeaux?",
          ctaText:
            "Discover I‑CA.RE spaces and let's discuss your project.",
        };

  return (
    <Layout>
      <SeoHead title={title} description={description} path={path} />

      <article>
        {/* ── Hero ──────────────────────────────────── */}
        <header className="relative h-[240px] md:h-[320px] overflow-hidden">
          <FadeImage
            src={heroImage}
            alt={heroImageAlt}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            fadeDuration={300}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/40 to-foreground/15" />
          <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl flex flex-col justify-end pb-7">
            {/* Breadcrumb */}
            <nav
              aria-label="fil d'Ariane"
              className="text-xs sm:text-sm text-primary-foreground/70 mb-3"
            >
              <Link
                to={localePath(lang, "home")}
                className="hover:text-primary-foreground transition-colors"
              >
                {l.home}
              </Link>
              <span className="mx-1.5">/</span>
              <Link
                to={localePath(lang, "insights")}
                className="hover:text-primary-foreground transition-colors"
              >
                {l.guides}
              </Link>
            </nav>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-primary-foreground leading-tight">
              {articleTitle}
            </h1>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl pt-8 pb-16">
          {/* ── Intro ────────────────────────────────── */}
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {intro}
          </p>

          {/* ── Takeaways ────────────────────────────── */}
          <aside className="bg-secondary border border-border rounded-lg p-5 sm:p-6 mb-10">
            <h2 className="text-base sm:text-lg font-heading font-bold mb-3">
              {l.takeaways}
            </h2>
            <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
              {takeaways.map((t, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <span className="text-primary mt-0.5 shrink-0">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </aside>

          {/* ── TOC ──────────────────────────────────── */}
          <nav className="border border-border rounded-lg p-4 sm:p-5 mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              {l.toc}
            </p>
            <ol className="space-y-1.5 text-sm">
              {toc.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-primary hover:underline"
                  >
                    {i + 1}. {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* ── Body ─────────────────────────────────── */}
          <div className="insight-body space-y-8">{children}</div>

          {/* ── Key figures ───────────────────────────── */}
          {keyFigures && keyFigures.length > 0 && (
            <aside className="bg-muted/60 border border-border rounded-lg p-5 sm:p-6 mt-10">
              <h2 className="text-base sm:text-lg font-heading font-bold mb-4">
                {l.figures}
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {keyFigures.map((fig, i) => (
                  <div key={i}>
                    <dt className="text-xs text-muted-foreground uppercase tracking-wide">
                      {fig.label}
                    </dt>
                    <dd className="font-bold text-foreground text-sm">
                      {fig.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          )}

          {/* ── FAQ ──────────────────────────────────── */}
          <section id="faq" className="mt-12 pt-8 border-t border-border">
            <h2 className="text-lg sm:text-xl font-heading font-bold mb-5">
              {l.faq}
            </h2>
            <Accordion type="multiple">
              {faq.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-sm sm:text-base font-semibold">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                      {item.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* ── CTA ──────────────────────────────────── */}
          <section className="mt-12 bg-foreground rounded-lg p-6 sm:p-8 text-center">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-primary-foreground mb-2">
              {l.cta}
            </h2>
            <p className="text-primary-foreground/75 text-sm sm:text-base mb-5 max-w-md mx-auto">
              {l.ctaText}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="gold" size="lg">
                <Link to={localePath(lang, ctaPrimaryRoute)}>
                  {ctaPrimaryLabel}
                </Link>
              </Button>
              {ctaSecondaryRoute && ctaSecondaryLabel && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link to={localePath(lang, ctaSecondaryRoute)}>
                    {ctaSecondaryLabel}
                  </Link>
                </Button>
              )}
            </div>
          </section>

          {/* ── I‑CA.RE approach ──────────────────────── */}
          <section className="mt-12 pt-8 border-t border-border">
            <h2 className="text-base sm:text-lg font-heading font-bold mb-3">
              {l.approach}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              {l.approachText}
            </p>
          </section>

          {/* ── Related guides ────────────────────────── */}
          <nav className="mt-10 pt-8 border-t border-border">
            <h2 className="text-base sm:text-lg font-heading font-bold mb-4">
              {l.related}
            </h2>
            <div className="grid gap-3">
              {relatedGuides.map((guide) => (
                <Link
                  key={guide.routeKey}
                  to={localePath(lang, guide.routeKey)}
                  className="block p-4 border border-border rounded-lg hover:bg-secondary/60 transition-colors"
                >
                  <p className="font-semibold text-sm text-foreground">
                    {guide.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {guide.description}
                  </p>
                </Link>
              ))}
            </div>
          </nav>

          {/* ── Back ─────────────────────────────────── */}
          <div className="mt-8">
            <Link
              to={localePath(lang, "insights")}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← {l.back}
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
}
