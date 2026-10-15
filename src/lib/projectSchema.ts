/**
 * Enrichissement optionnel du JSON-LD par projet.
 *
 * Adresse, code postal, ville, latitude et longitude sont lus depuis la table
 * `projets` (source de vérité unique). Ce fichier ne conserve que ce qui
 * n'existe pas en base : le nom et la description rédigés pour le JSON-LD.
 * L'absence d'une entrée n'est plus une condition d'existence du schema.
 */

export interface ProjectSchemaCopy {
  /** Override schema name; defaults to project.name */
  name: string;
  /** Long-form description used in JSON-LD only (not visible copy) */
  description: string;
}

export const PROJECT_SCHEMA_COPY: Record<string, ProjectSchemaCopy> = {
  "i-ca-re-nansouty": {
    name: "I-CA.RE Nansouty",
    description:
      "Lieu de soin partagé au cœur du quartier Nansouty à Bordeaux. 2 cabinets occupés par 5 psychothérapeutes. Géré par I-CA.RE, foncière familiale indépendante dédiée aux lieux de soin.",
  },
  "i-ca-re-jardin-public": {
    name: "I-CA.RE Jardin Public",
    description:
      "Lieu de soin et de bien-être face au Jardin Public de Bordeaux. 4 cabinets occupés par 5 praticiens (massage bien-être, naturopathie, psychothérapie, hypnothérapie, microblading). Géré par I-CA.RE, foncière familiale indépendante.",
  },
  "i-ca-re-pey-berland": {
    name: "I-CA.RE Pey-Berland",
    description:
      "Cabinet paramédical partagé au cœur historique de Bordeaux, à deux pas de la place Pey-Berland et de la cathédrale Saint-André. 5 cabinets occupés par 8 praticiens (psychologues, psychothérapeute, sophrologues). Géré par I-CA.RE, foncière familiale indépendante.",
  },
  "i-ca-re-chartrons": {
    name: "I-CA.RE Chartrons",
    description:
      "Lieu de soin ouvert au cœur des Chartrons à Bordeaux. 5 cabinets de 11 à 15 m² et une salle d'attente, livrés en octobre 2026. Géré par I-CA.RE, foncière familiale indépendante.",
  },
};

export function getProjectSchemaCopy(slug: string): ProjectSchemaCopy | undefined {
  return PROJECT_SCHEMA_COPY[slug];
}

/**
 * Découpe une adresse de la table `projets`, au format `RUE, CODEPOSTAL VILLE`.
 * Le code postal est la première séquence de 5 chiffres rencontrée, la voie la
 * portion précédant la première virgule.
 * Si le format ne correspond pas, `postalCode` est vide et `streetAddress`
 * reprend la chaîne complète : aucune valeur n'est inventée.
 */
export function parseAddress(address: string): { streetAddress: string; postalCode: string } {
  const raw = (address ?? "").trim();
  const postal = raw.match(/\b\d{5}\b/);
  const commaIndex = raw.indexOf(",");
  if (!postal || commaIndex === -1) {
    return { streetAddress: raw, postalCode: "" };
  }
  return {
    streetAddress: raw.slice(0, commaIndex).trim(),
    postalCode: postal[0],
  };
}

/**
 * Région administrative déduite du préfixe de département.
 * Table volontairement explicite, limitée aux départements exploités.
 * À étendre à chaque nouveau département : tout préfixe inconnu rend
 * `undefined`, et `addressRegion` est alors omis du JSON-LD.
 */
const REGION_BY_DEPARTMENT: Record<string, string> = {
  "33": "Nouvelle-Aquitaine",
  "31": "Occitanie",
};

export function regionFromPostalCode(postalCode: string): string | undefined {
  return REGION_BY_DEPARTMENT[(postalCode ?? "").slice(0, 2)];
}