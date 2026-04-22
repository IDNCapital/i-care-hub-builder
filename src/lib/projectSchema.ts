/**
 * Per-project LocalBusiness schema data.
 * Only slugs listed here get a LocalBusiness JSON-LD injected on their detail page.
 * Common fields (email, priceRange, areaServed, openingHours, etc.) are merged
 * in `ProjetDetail.tsx`.
 */

export interface LocalBusinessData {
  /** Override schema name; defaults to project.name */
  name: string;
  streetAddress: string;
  postalCode: string;
  addressLocality: string;
  latitude: number;
  longitude: number;
  /** Long-form description used in JSON-LD only (not visible copy) */
  description: string;
}

export const PROJECT_LOCAL_BUSINESS: Record<string, LocalBusinessData> = {
  "i-ca-re-nansouty": {
    name: "I-CA.RE Nansouty",
    streetAddress: "106 bis rue Bertrand de Goth",
    postalCode: "33800",
    addressLocality: "Bordeaux",
    latitude: 44.8193865,
    longitude: -0.5768714,
    description:
      "Lieu de soin partagé au cœur du quartier Nansouty à Bordeaux. 2 cabinets occupés par 5 psychothérapeutes. Géré par I-CA.RE, foncière familiale indépendante dédiée aux lieux de soin.",
  },
  "i-ca-re-jardin-public": {
    name: "I-CA.RE Jardin Public",
    streetAddress: "38 cours du Maréchal Foch",
    postalCode: "33000",
    addressLocality: "Bordeaux",
    latitude: 44.8483117,
    longitude: -0.5750835,
    description:
      "Lieu de soin et de bien-être face au Jardin Public de Bordeaux. 4 cabinets occupés par 5 praticiens (massage bien-être, naturopathie, psychothérapie, hypnothérapie, microblading). Géré par I-CA.RE, foncière familiale indépendante.",
  },
  "i-ca-re-pey-berland": {
    name: "I-CA.RE Pey-Berland",
    streetAddress: "6 rue Père Louis de Jabrun",
    postalCode: "33000",
    addressLocality: "Bordeaux",
    latitude: 44.8396644,
    longitude: -0.5763384,
    description:
      "Cabinet paramédical partagé au cœur historique de Bordeaux, à deux pas de la place Pey-Berland et de la cathédrale Saint-André. 5 cabinets occupés par 8 praticiens (psychologues, psychothérapeute, sophrologues). Géré par I-CA.RE, foncière familiale indépendante.",
  },
  "i-ca-re-chartrons": {
    name: "I-CA.RE Chartrons",
    streetAddress: "20 cours Saint-Louis",
    postalCode: "33300",
    addressLocality: "Bordeaux",
    latitude: 44.8565286,
    longitude: -0.5706501,
    description:
      "Lieu de soin en cours de livraison au cœur des Chartrons à Bordeaux. 5 cabinets, permis accepté, travaux T2 2026, ouverture Q4 2026. Géré par I-CA.RE, foncière familiale indépendante.",
  },
};

export function getLocalBusinessData(slug: string): LocalBusinessData | undefined {
  return PROJECT_LOCAL_BUSINESS[slug];
}