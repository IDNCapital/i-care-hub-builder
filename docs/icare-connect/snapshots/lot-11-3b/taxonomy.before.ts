// src/lib/taxonomy.ts
// SOURCE DE VÉRITÉ UNIQUE pour la taxonomie de l'Espace Patients I-CA.RE.
// Toute modification ici impacte le filtre /patients ET l'extraction LLM.
// Le miroir Edge Function est dans supabase/functions/_shared/taxonomy.ts —
// quand vous modifiez ce fichier, propagez la même modification dans le miroir
// ET incrémentez TAXONOMY_VERSION dans les deux fichiers.

export const TAXONOMY_VERSION = "0ter-2026-05-15.2";

/**
 * Normalisation utilitaire : minuscules + retrait des diacritiques.
 * Utilisée pour comparer libellés utilisateur ↔ termes de la taxonomie.
 */
export const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/**
 * Libellés d'affichage des cabinets I-CA.RE (slug → nom court).
 */
export const CABINETS_LABEL: Record<string, string> = {
  "i-ca-re-nansouty": "Nansouty",
  "i-ca-re-pey-berland": "Pey-Berland",
  "i-ca-re-jardin-public": "Jardin Public",
  "i-ca-re-chartrons": "Chartrons",
};

export const SPECIALITY_GROUPS: Record<string, string[]> = {
  "Soin psychique": [
    "Psychologie clinique",
    "Psychologie du travail",
    "Psychothérapie humaniste",
    "Psychothérapie intégrative",
    "Thérapie EMDR",
    "Thérapie brève",
    "Thérapie cognitivo-comportementale (TCC)",
    "TBSI",
    "Sophrologie",
    "Sophrothérapie",
    "Gestalt-thérapie",
    "Thérapie de couple",
    "Thérapie familiale",
    "Art-thérapie",
    "Hypnothérapie",
    "EFT",
    "Psychotraumatologie",
  ],
  "Soin du corps": [
    "Massage bien-être",
    "Kobido",
    "Réflexologie plantaire",
    "Shiatsu",
    "Breathwork",
    "Fasciathérapie",
    "Fasciathérapie biodynamique",
  ],
  "Pratiques énergétiques": [
    "Reiki",
    "Rebirthing",
  ],
  "Périnatalité & parentalité": [
    "Sage-femme",
    "Accompagnement périnatal",
    "Yoga prénatal",
    "Préparation à la naissance",
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
    "prise de parole en public",
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
    "gestion de la douleur",
    "relation au corps",
    "troubles du comportement alimentaire",
    "traumatismes",
    "troubles du sommeil",
    "arrêt du tabac",
  ],
  "Scolarité": [
    "stress scolaire",
    "difficultés de concentration",
    "phobie scolaire",
  ],
  "Périnatalité": [
    "grossesse",
    "post-partum",
    "allaitement",
    "dépression post-partum",
    "sommeil du nourrisson",
    "diversification alimentaire",
    "gestion des émotions de l'enfant",
  ],
};

export const PUBLIC_CIBLE_GROUPS: Record<string, string[]> = {
  "Enfants": ["enfants"],
  "Adolescents": ["adolescents"],
  "Couples": ["couples"],
  "Familles": ["familles"],
  "Femmes enceintes": ["femmes enceintes"],
  "Jeunes parents": ["jeunes parents"],
  "Parents de jeunes enfants": ["parents de jeunes enfants"],
  "Sportifs": ["sportifs"],
};

// Termes implicites — silencieusement absorbés par l'extraction.
// Ne sont ni filtrés-in dans le résultat final, ni capturés comme candidats.
// "adultes" est le public par défaut, jamais explicité dans la taxonomie.
export const IMPLICIT_TERMS: Record<"specialites" | "problematiques" | "publics_cibles", string[]> = {
  publics_cibles: ["adultes"],
  specialites: [],
  problematiques: [],
};

// Dictionnaire de synonymes : variantes courantes → terme canonique de la taxonomie.
// Clés en minuscules sans accent ; matching après normalisation.
export const SYNONYM_MAP: Record<string, string> = {
  // Spécialités
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
  "hypnose": "Hypnothérapie",
  "hypnose ericksonienne": "Hypnothérapie",
  "tcc": "Thérapie cognitivo-comportementale (TCC)",
  "thérapie cognitivo-comportementale": "Thérapie cognitivo-comportementale (TCC)",
  "fasciatherapie": "Fasciathérapie",
  "fasciatherapie biodynamique": "Fasciathérapie biodynamique",
  "fascia biodynamique": "Fasciathérapie biodynamique",
  "preparation a la naissance": "Préparation à la naissance",
  "yoga prenatal": "Yoga prénatal",
  "accompagnement perinatal": "Accompagnement périnatal",
  "sage femme": "Sage-femme",

  // Problématiques
  "troubles de l'attention": "difficultés de concentration",
  "concentration": "difficultés de concentration",
  "manque de confiance en soi": "manque de confiance",
  "faible estime": "estime de soi",
  "perte de confiance": "manque de confiance",
  "épuisement professionnel": "burn-out",
  "burn-out professionnel": "burn-out",
  "burnout": "burn-out",
  "fatigue chronique au travail": "burn-out",
  "stress de performance": "anxiété de performance",
  "pression de performance": "anxiété de performance",
  "psychotraumatisme": "traumatismes",
  "trauma": "traumatismes",
  "tca": "troubles du comportement alimentaire",
  "troubles alimentaires": "troubles du comportement alimentaire",
  "troubles des conduites alimentaires": "troubles du comportement alimentaire",
  "insomnie": "troubles du sommeil",
  "troubles du couple": "difficultés de couple",
  "conflit familial": "difficultés familiales",
  "orientation": "orientation professionnelle",
  "douleur": "gestion de la douleur",
  "prise de parole": "prise de parole en public",
  "tabac": "arrêt du tabac",
  "sevrage tabagique": "arrêt du tabac",
  "post partum": "post-partum",
  "depression post-partum": "dépression post-partum",
  "depression post partum": "dépression post-partum",

  // Publics
  "enfant": "enfants",
  "ado": "adolescents",
  "adolescent": "adolescents",
  "couple": "couples",
  "famille": "familles",
  "femme enceinte": "femmes enceintes",
  "futurs parents": "jeunes parents",
  "jeune parent": "jeunes parents",
  "sportif": "sportifs",
  "athletes": "sportifs",
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
