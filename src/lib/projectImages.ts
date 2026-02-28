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
import portraitNicolas from "@/assets/portrait-nicolas.jpg";

// ─── Generated hero images ──────────────────────────────
import heroHomeFacade1 from "@/assets/hero/hero-home-facade-1.webp";
import heroHomeAttente1 from "@/assets/hero/hero-home-attente-1.webp";
import heroHomeCabinet1 from "@/assets/hero/hero-home-cabinet-1.webp";
import heroHomeFacade2 from "@/assets/hero/hero-home-facade-2.webp";
import heroHomeAttente2 from "@/assets/hero/hero-home-attente-2.webp";
import heroHomeCabinet2 from "@/assets/hero/hero-home-cabinet-2.webp";
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
    hero: chartronsFacade,
    gallery: [chartronsFacade, chartronsPlan],
  },
};

// ─── Page-level default heroes ───────────────────────────

const PAGE_HEROES: Record<PageContext, string> = {
  home: heroHomeFacade1,
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
  /** Founder portrait on Notre Approche */
  portrait: portraitJazmin,
  /** Nicolas portrait on Notre Approche */
  portraitNicolas: portraitNicolas,
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
  { src: heroHomeFacade1,    altFr: "Façade élégante – I-CA.RE",                altEn: "Elegant facade – I-CA.RE" },
  { src: heroHomeAttente1,   altFr: "Salle d'attente chaleureuse – I-CA.RE",    altEn: "Warm waiting room – I-CA.RE" },
  { src: heroHomeCabinet1,   altFr: "Cabinet de soin – I-CA.RE",                altEn: "Care practice – I-CA.RE" },
  { src: heroHomeFacade2,    altFr: "Immeuble patrimonial – I-CA.RE",           altEn: "Heritage building – I-CA.RE" },
  { src: heroHomeAttente2,   altFr: "Espace d'accueil lumineux – I-CA.RE",      altEn: "Bright reception area – I-CA.RE" },
  { src: heroHomeCabinet2,   altFr: "Cabinet de bien-être – I-CA.RE",           altEn: "Wellbeing practice – I-CA.RE" },
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
