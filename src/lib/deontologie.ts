/**
 * Références déontologiques de la page
 * /ressources/exercer-en-lieu-pluridisciplinaire/
 *
 * Pattern O de la doctrine IDN (V1.13) : ce fichier est livré vide au Lot 1
 * et rempli au Lot 3, exclusivement depuis le corpus validé hors développement.
 *
 * Règle de rendu : toute entrée non renseignée est masquée, titre compris.
 * Aucun texte de repli, aucun tiret cadratin, aucune mention « à venir ».
 *
 * Règle de remplissage (Lot 3) : chaque entrée porte son identifiant de
 * bibliographie (T pour les textes, O pour les positions ordinales, A pour les
 * autorités administratives), son intitulé exact, son URL officielle et sa date.
 * Cinq familles de sources sont admises et aucune autre :
 *   1. textes législatifs et réglementaires publiés sur Légifrance ;
 *   2. positions publiées par un conseil national d'ordre, datées ;
 *   3. positions publiées par un conseil départemental de Gironde ou de
 *      Haute-Garonne, datées et identifiées comme départementales ;
 *   4. pages officielles des autorités administratives nationales du corpus ;
 *   5. portails officiels des ARS Nouvelle-Aquitaine et Occitanie.
 * Les fiches d'autres conseils départementaux sont exclues de la page.
 */

/** Niveau d'attribution d'une affirmation. Ne jamais présenter un registre pour un autre. */
export type Registre = "droit" | "ordinal" | "prudence";

/** Une source citable, indexée par son identifiant de bibliographie. */
export interface SourceReference {
  /** Identifiant de bibliographie du corpus validé, par exemple "T09", "O05", "A07". */
  id: string;
  /** Intitulé exact tel qu'il figure au corpus. */
  intitule: string;
  /** URL officielle complète. */
  url: string;
  registre: Registre;
  /** Date de la source ou de sa dernière vérification, en toutes lettres. */
  date: string;
}

/** Un des trois statuts juridiques exposés en section « Trois statuts sous un seul mot ». */
export interface StatutJuridique {
  cle: "professions-de-sante" | "titres-reglementes" | "pratiques-non-reglementees";
  /** Professions ou pratiques citées, dans l'ordre d'affichage. Aucune ne s'ajoute hors corpus. */
  professions: string[];
  /** Identifiants de bibliographie appuyant ce statut. */
  sources: string[];
}

/** Un palier de la grille de lecture par degré d'intégration. */
export interface NiveauIntegration {
  rang: number;
  intitule: string;
  /** Lecture factuelle du palier, reprise du corpus, sans conclusion d'autorisation. */
  lecture: string;
}

/** Une position publiée par un ordre professionnel. */
export interface PositionOrdinale {
  /** Ordre concerné, tel qu'il se nomme lui-même. */
  ordre: string;
  intitule: string;
  /** Date de publication ou d'adoption, en toutes lettres. */
  date: string;
  url: string;
  /** Portée : nationale ou départementale. Une position départementale se signale comme telle. */
  portee: "nationale" | "departementale";
  sources: string[];
}

/** Une obligation de communication ou d'avis portant sur le contrat. */
export interface ObligationContrat {
  /** Professions visées par cette obligation, telles que nommées par le texte. */
  professions: string[];
  /** Article et intitulé, repris du corpus. */
  intitule: string;
  url: string;
  /** Délai applicable, en toutes lettres. Chaîne vide si le texte n'en fixe pas. */
  delai: string;
  /** Possibilité de soumettre un projet de contrat avant signature, et son délai de réponse. */
  avisAvantSignature: string;
  sources: string[];
}

/** Coordonnées d'un conseil départemental compétent. */
export interface ConseilDepartemental {
  ordre: string;
  departement: "Gironde" | "Haute-Garonne";
  adresse: string;
  telephone: string;
  email: string;
  url: string;
  /** Date de vérification des coordonnées, en toutes lettres. Sans elle, l'entrée n'est pas affichée. */
  dateVerification: string;
}

/** Une question de la checklist « Avant de signer ». */
export interface QuestionChecklist {
  rang: number;
  intitule: string;
}

/** Références rattachées à une question fréquente, par clé de question. */
export interface ReferencesFaq {
  /** Clé de la question, identique à celle du composant de FAQ. */
  cle: string;
  sources: string[];
}

export interface DonneesDeontologie {
  /** Date de dernière mise à jour du contenu de la page, en toutes lettres. */
  dateMiseAJour: string;
  /**
   * Formule de transparence proposée au corpus, à valider par Nico avant affichage.
   * Chaîne vide tant qu'elle n'est pas validée.
   */
  mentionTransparence: string;
  /** Bibliographie indexée par identifiant. Source unique de toute référence affichée. */
  bibliographie: Record<string, SourceReference>;
  statuts: StatutJuridique[];
  niveauxIntegration: NiveauIntegration[];
  positionsOrdinales: PositionOrdinale[];
  obligationsContrat: ObligationContrat[];
  conseilsDepartementaux: ConseilDepartemental[];
  checklistAvantSignature: QuestionChecklist[];
  referencesFaq: ReferencesFaq[];
}

export const deontologie: DonneesDeontologie = {
  dateMiseAJour: "",
  mentionTransparence: "",
  bibliographie: {},
  statuts: [],
  niveauxIntegration: [],
  positionsOrdinales: [],
  obligationsContrat: [],
  conseilsDepartementaux: [],
  checklistAvantSignature: [],
  referencesFaq: [],
};

/**
 * Résout une liste d'identifiants en sources affichables.
 * Un identifiant absent de la bibliographie est ignoré silencieusement :
 * une référence incomplète ne s'affiche jamais à moitié.
 */
export function resoudreSources(ids: string[]): SourceReference[] {
  return ids
    .map((id) => deontologie.bibliographie[id])
    .filter((source): source is SourceReference => Boolean(source));
}
