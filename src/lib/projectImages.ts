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

export interface ProjectImages {
  hero: string;
  gallery: string[];
}

/**
 * Local image mapping by project slug.
 * Projects not listed here (e.g. Floirac, Lormont) have no images → "Visuels à venir".
 */
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

/** Get hero image for a project, falling back to DB url or undefined */
export function getProjectHero(slug: string, dbHeroUrl?: string | null): string | undefined {
  return PROJECT_IMAGES[slug]?.hero ?? dbHeroUrl ?? undefined;
}

/** Get gallery images, merging local + DB */
export function getProjectGallery(slug: string, dbGallery?: string[] | null): string[] {
  const local = PROJECT_IMAGES[slug]?.gallery ?? [];
  const db = dbGallery ?? [];
  // Prefer local, append any DB images not already present
  return [...local, ...db.filter((url) => !local.includes(url))];
}
