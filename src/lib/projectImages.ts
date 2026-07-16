// Nansouty
import nansoutyAttente from "@/assets/nansouty/attente.webp";
import nansoutyCab1 from "@/assets/nansouty/cab1.webp";
import nansoutyCab2 from "@/assets/nansouty/cab2.webp";
import nansoutyFacade from "@/assets/nansouty/facade.webp";

// Jardin Public
import jardinPublicAttente from "@/assets/jardin-public/attente.webp";
import jardinPublicCab1 from "@/assets/jardin-public/cab1.webp";
import jardinPublicCab2 from "@/assets/jardin-public/cab2.webp";
import jardinPublicCab3 from "@/assets/jardin-public/cab3.webp";
import jardinPublicFacade from "@/assets/jardin-public/facade.webp";

// Pey Berland
import peyBerlandAttente from "@/assets/pey-berland/attente.webp";
import peyBerlandCab1 from "@/assets/pey-berland/cab1.webp";
import peyBerlandCab2 from "@/assets/pey-berland/cab2.webp";
import peyBerlandCab3 from "@/assets/pey-berland/cab3.webp";
import peyBerlandFacade from "@/assets/pey-berland/facade.webp";

// Chartrons
import chartronsPlan from "@/assets/chartrons/plan.webp";
import chartronsInsertionFacade from "@/assets/chartrons/insertion-facade.webp";
import chartronsProjectionCab1 from "@/assets/chartrons/projection-cab-1.webp";
import chartronsProjectionCab2 from "@/assets/chartrons/projection-cab-2.webp";

// Toulouse Capitole
import toulouseCapitoleFacade from "@/assets/toulouse-capitole/facade.png";

// Floirac
import floiracFacade from "@/assets/floirac/facade.png";

// Lormont
import lormontFacade from "@/assets/lormont/facade.webp";

// Portrait
import portraitDuo from "@/assets/portrait-duo.webp";

// ─── Hero images ────────────────────────────────────────
import heroHomeReelleAttente1 from "@/assets/hero/hero-home-reelle-attente-1.webp";
import heroHomeReelleCabinet1 from "@/assets/hero/hero-home-reelle-cabinet-1.webp";
import heroHomeReelleAttente2 from "@/assets/hero/hero-home-reelle-attente-2.webp";
import heroPraticiens from "@/assets/hero/hero-praticiens.webp";
import heroInvestissement from "@/assets/hero/hero-investissement.webp";

// ─── Types ───────────────────────────────────────────────

export interface ProjectImages {
  hero: string;
  gallery: string[];
}

export type PageContext =
  | "home"
  | "professionnels"
  | "investissement"
  | "approche";

// ─── Project image mapping (by slug) ─────────────────────

export const PROJECT_IMAGES: Record<string, ProjectImages> = {
  "i-ca-re-nansouty": {
    hero: nansoutyAttente,
    gallery: [nansoutyAttente, nansoutyCab1, nansoutyCab2, nansoutyFacade],
  },
  "i-ca-re-jardin-public": {
    hero: jardinPublicAttente,
    gallery: [jardinPublicAttente, jardinPublicCab1, jardinPublicCab2, jardinPublicCab3, jardinPublicFacade],
  },
  "i-ca-re-pey-berland": {
    hero: peyBerlandAttente,
    gallery: [peyBerlandAttente, peyBerlandCab1, peyBerlandCab2, peyBerlandCab3, peyBerlandFacade],
  },
  "i-ca-re-chartrons": {
    hero: chartronsInsertionFacade,
    gallery: [chartronsInsertionFacade, chartronsProjectionCab1, chartronsProjectionCab2, chartronsPlan],
  },
  "i-ca-re-toulouse-capitole": {
    hero: toulouseCapitoleFacade,
    gallery: [toulouseCapitoleFacade],
  },
  "i-ca-re-floirac": {
    hero: floiracFacade,
    gallery: [floiracFacade],
  },
  "i-ca-re-lormont": {
    hero: lormontFacade,
    gallery: [lormontFacade],
  },
};

// ─── Page-level default heroes ───────────────────────────

const PAGE_HEROES: Record<PageContext, string> = {
  home: chartronsInsertionFacade,
  professionnels: heroPraticiens,
  investissement: heroInvestissement,
  approche: nansoutyAttente,
};

// ─── Section-level images (for inline use) ───────────────

export const SECTION_IMAGES = {
  /** "Why choose I-CA.RE" section on homepage */
  homeWhyChoose: peyBerlandCab2,
  /** Societal impact section on homepage */
  homeImpact: nansoutyCab1,
  /** Founders duo portrait on Notre Approche */
  portraitDuo: portraitDuo,
  /** Method section on Notre Approche */
  approachMethod: peyBerlandFacade,
  /** Collectivités section on Notre Approche */
  approachCollectivites: nansoutyAttente,
} as const;

// ─── Home hero slideshow (alternating facades / interiors) ─

export interface HeroSlide {
  src: string;
  altFr: string;
  altEn: string;
}

/** Full set for desktop (6 slides, alternating facade ↔ interior) */
export const HOME_HERO_SLIDES: HeroSlide[] = [
  { src: chartronsInsertionFacade, altFr: "Façade du futur cabinet I-CA.RE Chartrons à Bordeaux (insertion 3D)", altEn: "Facade of the future I-CA.RE Chartrons practice in Bordeaux (3D rendering)" },
  { src: heroHomeReelleAttente1,   altFr: "Salle d'attente d'un cabinet I-CA.RE à Bordeaux",                     altEn: "Waiting room of an I-CA.RE practice in Bordeaux" },
  { src: chartronsProjectionCab1,  altFr: "Projection d'un cabinet du futur I-CA.RE Chartrons",                   altEn: "Rendering of a practice room, future I-CA.RE Chartrons" },
  { src: heroHomeReelleCabinet1,   altFr: "Cabinet de consultation I-CA.RE à Bordeaux",                           altEn: "I-CA.RE consultation room in Bordeaux" },
  { src: chartronsProjectionCab2,  altFr: "Projection d'un espace de consultation, futur cabinet Chartrons",      altEn: "Rendering of a consultation space, future Chartrons practice" },
  { src: heroHomeReelleAttente2,   altFr: "Espace d'accueil d'un cabinet I-CA.RE à Bordeaux",                     altEn: "Reception area of an I-CA.RE practice in Bordeaux" },
];

/** Reduced set for mobile (4 slides) */
export const HOME_HERO_SLIDES_MOBILE: HeroSlide[] = [
  HOME_HERO_SLIDES[0],
  HOME_HERO_SLIDES[1],
  HOME_HERO_SLIDES[2],
  HOME_HERO_SLIDES[3],
];

// ─── Helpers ─────────────────────────────────────────────

/** Default hero for a page context. Always returns a valid image. */
export function getDefaultHero(context: PageContext): string {
  return PAGE_HEROES[context] ?? peyBerlandAttente;
}

/** Get hero image for a project, falling back to DB url or undefined */
export function getProjectHero(slug: string, dbHeroUrl?: string | null): string | undefined {
  return PROJECT_IMAGES[slug]?.hero ?? dbHeroUrl ?? undefined;
}

/** Get gallery images, merging local + DB */
export function getProjectGallery(slug: string, dbGallery?: string[] | null): string[] {
  const local = PROJECT_IMAGES[slug]?.gallery ?? [];
  const db = dbGallery ?? [];
  return [...local, ...db.filter((url) => !local.includes(url))];
}

// ─── Visuels pour les pages d'installation (Lot 10.6) ────

export interface CabinetVisuals {
  /** Image principale à afficher */
  hero: string;
  /** Vignettes complémentaires (peut être vide) */
  gallery: string[];
  /** true = visuel d'ambiance générique, PAS une photo du cabinet */
  isGeneric: boolean;
}

/**
 * Visuels d'un cabinet pour les pages /sinstaller.
 * Retombe sur un visuel d'ambiance générique du réseau si le cabinet
 * n'a aucune photo (ex. Lormont). Ne réutilise JAMAIS la photo d'un
 * cabinet exploité pour illustrer un cabinet en travaux.
 */
export function getCabinetVisuals(projectSlug?: string | null): CabinetVisuals {
  const found = projectSlug ? PROJECT_IMAGES[projectSlug] : undefined;
  if (found) {
    return {
      hero: found.hero,
      gallery: found.gallery.filter((img) => img !== found.hero),
      isGeneric: false,
    };
  }
  return { hero: heroPraticiens, gallery: [], isGeneric: true };
}
