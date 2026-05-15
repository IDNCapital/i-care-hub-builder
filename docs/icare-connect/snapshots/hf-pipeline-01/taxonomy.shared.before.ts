// supabase/functions/_shared/taxonomy.ts
// MIRROR — keep in sync with src/lib/taxonomy.ts
// À chaque modification de la taxonomie : MAJ src/lib/taxonomy.ts ET ce fichier,
// puis incrémenter TAXONOMY_VERSION dans les deux fichiers à l'identique.
// L'Edge Function compare les versions et émet un console.warn en cas de divergence.

export const TAXONOMY_VERSION = "0ter-2026-05-15";

export const SPECIALITY_GROUPS: Record<string, string[]> = {
  "Soin psychique": [
    "Psychologie clinique",
    "Psychologie du travail",
    "Psychothérapie humaniste",
    "Psychothérapie intégrative",
    "Thérapie EMDR",
    "Thérapie brève",
    "TBSI",
    "Sophrologie",
    "Sophrothérapie",
    "Gestalt-thérapie",
    "Thérapie de couple",
    "Thérapie familiale",
    "Art-thérapie",
  ],
  "Soin du corps": [
    "Massage bien-être",
    "Kobido",
    "Réflexologie plantaire",
    "Shiatsu",
    "Breathwork",
  ],
  "Pratiques énergétiques": [
    "Reiki",
    "Rebirthing",
  ],
};

export const PROBLEMATIQUE_GROUPS: Record<string, string[]> = {
  "Stress et anxiété": [
    "anxiété",
    "anxiété de performance",
    "crises d'angoisse",
    "stress",
    "gestion des émotions",
    "surcharge mentale",
  ],
  "Travail": [
    "burn-out",
    "souffrance au travail",
    "transition professionnelle",
    "orientation professionnelle",
  ],
  "Vie et transitions": [
    "transitions de vie",
    "périodes de doute",
    "blocages personnels",
    "deuil",
  ],
  "Estime et confiance": [
    "estime de soi",
    "peur de l'échec",
    "manque de confiance",
  ],
  "Relations": [
    "difficultés relationnelles",
    "difficultés de couple",
    "difficultés familiales",
    "parentalité",
  ],
  "Corps et bien-être": [
    "douleur chronique",
    "relation au corps",
    "troubles du comportement alimentaire",
    "traumatismes",
    "troubles du sommeil",
  ],
  "Scolarité": [
    "stress scolaire",
    "difficultés de concentration",
    "phobie scolaire",
  ],
};

export const PUBLIC_CIBLE_GROUPS: Record<string, string[]> = {
  "Enfants": ["enfants"],
  "Adolescents": ["adolescents"],
  "Couples": ["couples"],
  "Familles": ["familles"],
};

export const SYNONYM_MAP: Record<string, string> = {
  "thérapie brève self inductive": "TBSI",
  "tbsi": "TBSI",
  "thérapie brève systémique": "Thérapie brève",
  "emdr": "Thérapie EMDR",
  "psychothérapie": "Psychothérapie intégrative",
  "art therapie": "Art-thérapie",
  "art-therapie": "Art-thérapie",
  "mediation artistique": "Art-thérapie",
  "therapie de couple": "Thérapie de couple",
  "therapie familiale": "Thérapie familiale",

  "troubles de l'attention": "difficultés de concentration",
  "concentration": "difficultés de concentration",
  "manque de confiance en soi": "manque de confiance",
  "faible estime": "estime de soi",
  "perte de confiance": "manque de confiance",
  "épuisement professionnel": "burn-out",
  "fatigue chronique au travail": "burn-out",
  "stress de performance": "anxiété de performance",
  "pression de performance": "anxiété de performance",
  "psychotraumatisme": "traumatismes",
  "trauma": "traumatismes",
  "tca": "troubles du comportement alimentaire",
  "troubles alimentaires": "troubles du comportement alimentaire",
  "insomnie": "troubles du sommeil",
  "troubles du couple": "difficultés de couple",
  "conflit familial": "difficultés familiales",
  "orientation": "orientation professionnelle",

  "enfant": "enfants",
  "ado": "adolescents",
  "adolescent": "adolescents",
  "couple": "couples",
  "famille": "familles",
};

export const ALL_SPECIALITIES: string[] = Array.from(
  new Set(Object.values(SPECIALITY_GROUPS).flat()),
);
export const ALL_PROBLEMATIQUES: string[] = Array.from(
  new Set(Object.values(PROBLEMATIQUE_GROUPS).flat()),
);
export const ALL_PUBLICS: string[] = Array.from(
  new Set(Object.values(PUBLIC_CIBLE_GROUPS).flat()),
);

export type TaxonomyDimension = "specialite" | "problematique" | "public";