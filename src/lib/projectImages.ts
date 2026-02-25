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
import chartronsFacade from "@/assets/chartrons/facade.webp";
import chartronsPlan from "@/assets/chartrons/plan.webp";

// Portrait
import portraitJazmin from "@/assets/portrait-jazmin.webp";

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
    hero: chartronsFacade,
    gallery: [chartronsFacade, chartronsPlan],
  },
};

// ─── Page-level default heroes ───────────────────────────

const PAGE_HEROES: Record<PageContext, string> = {
  home: peyBerlandAttente,
  professionnels: peyBerlandCab1,
  investissement: nansoutyFacade,
  approche: nansoutyAttente,
};

// ─── Section-level images (for inline use) ───────────────

export const SECTION_IMAGES = {
  /** "Why choose I-CA.RE" section on homepage */
  homeWhyChoose: peyBerlandCab2,
  /** Societal impact section on homepage */
  homeImpact: nansoutyCab1,
  /** Founder portrait on Notre Approche */
  portrait: portraitJazmin,
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

/** Full set for desktop (7 slides, alternating facade ↔ interior) */
export const HOME_HERO_SLIDES: HeroSlide[] = [
  { src: peyBerlandAttente,     altFr: "Salle d'attente – I-CA.RE Pey Berland",   altEn: "Waiting room – I-CA.RE Pey Berland" },
  { src: nansoutyFacade,        altFr: "Façade – I-CA.RE Nansouty",               altEn: "Facade – I-CA.RE Nansouty" },
  { src: jardinPublicCab2,      altFr: "Cabinet – I-CA.RE Jardin Public",          altEn: "Office – I-CA.RE Jardin Public" },
  { src: peyBerlandFacade,      altFr: "Façade – I-CA.RE Pey Berland",            altEn: "Facade – I-CA.RE Pey Berland" },
  { src: nansoutyCab1,          altFr: "Cabinet – I-CA.RE Nansouty",              altEn: "Office – I-CA.RE Nansouty" },
  { src: jardinPublicAttente,   altFr: "Salle d'attente – I-CA.RE Jardin Public", altEn: "Waiting room – I-CA.RE Jardin Public" },
  { src: peyBerlandCab1,        altFr: "Cabinet – I-CA.RE Pey Berland",           altEn: "Office – I-CA.RE Pey Berland" },
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
