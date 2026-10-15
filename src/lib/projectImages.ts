// Nansouty
import nansoutyAttente from "@/assets/nansouty/attente.webp";
import nansoutyCab1 from "@/assets/nansouty/cab1.webp";
import nansoutyCab2 from "@/assets/nansouty/cab2.webp";
import nansoutyCab3 from "@/assets/nansouty/cab3.webp";
import nansoutyCab4 from "@/assets/nansouty/cab4.webp";
import nansoutyCoinEnfants from "@/assets/nansouty/coin-enfants.webp";
import nansoutyFacade from "@/assets/nansouty/facade.webp";

// Jardin Public
import jardinPublicAttente from "@/assets/jardin-public/attente.webp";
import jardinPublicAttente2 from "@/assets/jardin-public/attente-2.webp";
import jardinPublicCab1 from "@/assets/jardin-public/cab1.webp";
import jardinPublicCab2 from "@/assets/jardin-public/cab2.webp";
import jardinPublicDetailAttente from "@/assets/jardin-public/detail-attente.webp";
import jardinPublicFacade from "@/assets/jardin-public/facade.webp";

// Pey Berland
import peyBerlandAttente from "@/assets/pey-berland/attente.webp";
import peyBerlandAttente2 from "@/assets/pey-berland/attente-2.webp";
import peyBerlandCab1 from "@/assets/pey-berland/cab1.webp";
import peyBerlandCab2 from "@/assets/pey-berland/cab2.webp";
import peyBerlandCab3 from "@/assets/pey-berland/cab3.webp";
import peyBerlandDetailBureau from "@/assets/pey-berland/detail-bureau.webp";
import peyBerlandFacade from "@/assets/pey-berland/facade.webp";

// Chartrons
import chartronsPlan from "@/assets/chartrons/plan.webp";
// Photos réelles prises à la livraison (12/10/2026), à la place des visuels IA
import chartronsAttente1 from "@/assets/chartrons/attente-1.webp";
import chartronsAttente2 from "@/assets/chartrons/attente-2.webp";
import chartronsCab1 from "@/assets/chartrons/cab1.webp";
import chartronsCab2 from "@/assets/chartrons/cab2.webp";
import chartronsCab3 from "@/assets/chartrons/cab3.webp";
import chartronsCab4 from "@/assets/chartrons/cab4.webp";
import chartronsKitchenette from "@/assets/chartrons/kitchenette.webp";
import chartronsCouloir from "@/assets/chartrons/couloir.webp";
import chartronsFacade from "@/assets/chartrons/facade.webp";

// Toulouse Capitole
import toulouseCapitoleFacade from "@/assets/toulouse-capitole/facade.png";

// Floirac
import floiracInsertionFacade from "@/assets/floirac/insertion-facade.webp";
import floiracProjectionAttente from "@/assets/floirac/projection-attente.webp";
import floiracProjectionCab1 from "@/assets/floirac/projection-cab-1.webp";
import floiracProjectionCab2 from "@/assets/floirac/projection-cab-2.webp";

// Lormont
import lormontFacade from "@/assets/lormont/facade.webp";

// Le Bouscat
import leBouscatInsertionFacade from "@/assets/le-bouscat/insertion-facade.webp";
import leBouscatProjectionAttente from "@/assets/le-bouscat/projection-attente.webp";
import leBouscatProjectionCab from "@/assets/le-bouscat/projection-cab.webp";
import leBouscatProjectionCour from "@/assets/le-bouscat/projection-cour.webp";

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
    gallery: [nansoutyAttente, nansoutyCab1, nansoutyCab2, nansoutyCab3, nansoutyCab4, nansoutyCoinEnfants, nansoutyFacade],
  },
  "i-ca-re-jardin-public": {
    hero: jardinPublicAttente,
    gallery: [jardinPublicAttente, jardinPublicAttente2, jardinPublicCab1, jardinPublicCab2, jardinPublicDetailAttente, jardinPublicFacade],
  },
  "i-ca-re-pey-berland": {
    hero: peyBerlandAttente,
    gallery: [peyBerlandAttente, peyBerlandAttente2, peyBerlandCab1, peyBerlandCab2, peyBerlandCab3, peyBerlandDetailBureau, peyBerlandFacade],
  },
  "i-ca-re-chartrons": {
    hero: chartronsAttente1,
    gallery: [chartronsAttente1, chartronsAttente2, chartronsCab1, chartronsCab2, chartronsCab3, chartronsCab4, chartronsKitchenette, chartronsCouloir, chartronsFacade, chartronsPlan],
  },
  "i-ca-re-toulouse-capitole": {
    hero: toulouseCapitoleFacade,
    gallery: [toulouseCapitoleFacade],
  },
  "i-ca-re-floirac": {
    hero: floiracInsertionFacade,
    gallery: [floiracInsertionFacade, floiracProjectionAttente, floiracProjectionCab1, floiracProjectionCab2],
  },
  "i-ca-re-lormont": {
    hero: lormontFacade,
    gallery: [lormontFacade],
  },
  "i-ca-re-le-bouscat": {
    hero: leBouscatInsertionFacade,
    gallery: [leBouscatInsertionFacade, leBouscatProjectionAttente, leBouscatProjectionCab, leBouscatProjectionCour],
  },
};

// ─── Page-level default heroes ───────────────────────────

const PAGE_HEROES: Record<PageContext, string> = {
  home: chartronsFacade,
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
  { src: chartronsFacade,          altFr: "Façade du cabinet I‑CA.RE Chartrons à Bordeaux",                        altEn: "Facade of the I‑CA.RE Chartrons practice in Bordeaux" },
  { src: heroHomeReelleAttente1,   altFr: "Salle d'attente d'un cabinet I‑CA.RE à Bordeaux",                     altEn: "Waiting room of an I‑CA.RE practice in Bordeaux" },
  { src: chartronsCab1,            altFr: "Cabinet de consultation I‑CA.RE Chartrons à Bordeaux",                  altEn: "Consultation room, I‑CA.RE Chartrons in Bordeaux" },
  { src: heroHomeReelleCabinet1,   altFr: "Cabinet de consultation I‑CA.RE à Bordeaux",                           altEn: "I‑CA.RE consultation room in Bordeaux" },
  { src: chartronsAttente1,        altFr: "Salle d'attente du cabinet I‑CA.RE Chartrons à Bordeaux",               altEn: "Waiting room, I‑CA.RE Chartrons practice in Bordeaux" },
  { src: heroHomeReelleAttente2,   altFr: "Espace d'accueil d'un cabinet I‑CA.RE à Bordeaux",                     altEn: "Reception area of an I‑CA.RE practice in Bordeaux" },
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
