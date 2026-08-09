import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { getEquivalentPath } from "@/lib/routes";
import { assetUrl, pageUrl } from "@/lib/siteUrl";

const DEFAULT_OG_IMAGE = assetUrl("/og-i-ca-re.png");

interface SeoHeadProps {
  title: string;
  description: string;
  /** Current page path WITHOUT domain, e.g. "/projets" or "/en/projects" */
  path: string;
  /** OG image URL (absolute). Falls back to default. */
  ogImage?: string;
  /** OG image intrinsic width in px (only meaningful when ogImage is set). */
  ogImageWidth?: number;
  /** OG image intrinsic height in px (only meaningful when ogImage is set). */
  ogImageHeight?: number;
  /** Alt text for og:image / twitter:image:alt. */
  ogImageAlt?: string;
  /** Set to true for noindex pages (legal, cookies, etc.) */
  noIndex?: boolean;
}

/**
 * Unified SEO head component.
 * Adds: title, meta description, canonical, OG tags, hreflang alternates.
 */
export function SeoHead({
  title,
  description,
  path,
  ogImage,
  ogImageWidth,
  ogImageHeight,
  ogImageAlt,
  noIndex,
}: SeoHeadProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "fr";

  const canonical = pageUrl(path);
  const frPath = lang === "fr" ? path : getEquivalentPath(path, "fr");
  const enPath = lang === "en" ? path : getEquivalentPath(path, "en");
  const image = ogImage || DEFAULT_OG_IMAGE;
  // x-default falls back to FR when available, otherwise to the current path.
  const xDefaultPath = frPath ?? path;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Canonical */}
      <link rel="canonical" href={canonical} />

      {/* Hreflang */}
      {frPath && <link rel="alternate" hrefLang="fr" href={pageUrl(frPath)} />}
      {enPath && <link rel="alternate" hrefLang="en" href={pageUrl(enPath)} />}
      <link rel="alternate" hrefLang="x-default" href={pageUrl(xDefaultPath)} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      {ogImage && ogImageWidth ? (
        <meta property="og:image:width" content={String(ogImageWidth)} />
      ) : null}
      {ogImage && ogImageHeight ? (
        <meta property="og:image:height" content={String(ogImageHeight)} />
      ) : null}
      {ogImage && ogImageAlt ? (
        <meta property="og:image:alt" content={ogImageAlt} />
      ) : null}
      <meta property="og:site_name" content="I-CA.RE" />
      <meta property="og:locale" content={lang === "fr" ? "fr_FR" : "en_GB"} />

      {/* Twitter / LinkedIn */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {ogImage && ogImageAlt ? (
        <meta name="twitter:image:alt" content={ogImageAlt} />
      ) : null}

      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
}
