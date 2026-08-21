import { useTranslation } from "react-i18next";
import { getEquivalentPath } from "@/lib/routes";
import { assetUrl, pageUrl } from "@/lib/siteUrl";

const DEFAULT_OG_IMAGE = assetUrl("/og-i-ca-re.png");

// Dimensions et alternative textuelle de l'image par defaut. Elles etaient
// portees par le <Helmet> racine d'App.tsx, retire au meme lot. Sans Helmet,
// React 19 rend ces balises nativement et ne deduplique pas : une valeur par
// defaut posee a la racine s'AJOUTERAIT a celle de la page au lieu de lui ceder
// la place. Le seul emetteur possible est donc la page elle-meme.
// Exportees parce que PraticienPublic, qui n'utilise pas SeoHead, en heritait
// aussi par la racine.
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;
export const DEFAULT_OG_IMAGE_ALT =
  "I-CA.RE, Des lieux de soin pensés comme des lieux de vie";

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
 *
 * Rendu nativement : depuis React 19, <title>, <meta> et <link> sont hisses
 * dans le <head> depuis n'importe ou dans l'arbre, sans bibliotheque tierce.
 * React ne deduplique pas ; la deduplication du HTML servi est faite par
 * deduplicateHtml() dans scripts/prerender.mjs.
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
  // Les dimensions et l'alternative decrivent l'image effectivement posee :
  // celles de la page quand elle les fournit, celles de l'image par defaut
  // sinon. Une page qui donne son ogImage sans donner ses dimensions retombe
  // donc sur 1200x630, ce qui est exactement ce dont elle heritait de la racine.
  const imageWidth = ogImageWidth ?? DEFAULT_OG_IMAGE_WIDTH;
  const imageHeight = ogImageHeight ?? DEFAULT_OG_IMAGE_HEIGHT;
  const imageAlt = ogImageAlt ?? DEFAULT_OG_IMAGE_ALT;
  // x-default falls back to FR when available, otherwise to the current path.
  const xDefaultPath = frPath ?? path;

  return (
    <>
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
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:site_name" content="I-CA.RE" />
      <meta property="og:locale" content={lang === "fr" ? "fr_FR" : "en_GB"} />

      {/* Twitter / LinkedIn */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </>
  );
}
