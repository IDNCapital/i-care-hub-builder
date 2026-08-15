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

/**
 * Une obligation de communication ou d'avis portant sur le contrat.
 *
 * Une entrée par profession, jamais une entrée pour plusieurs : les textes,
 * l'autorité destinataire et les délais diffèrent d'une profession à l'autre,
 * et aucune formulation générale n'est admise.
 */
export interface ObligationContrat {
  /**
   * Profession visée par cette obligation, telle que nommée par le texte. Au
   * singulier : un texte qui vise plusieurs professions produit autant d'entrées,
   * l'autorité destinataire et le délai pouvant différer de l'une à l'autre. La
   * source, elle, n'est écrite qu'une fois dans la bibliographie et se référence
   * par identifiant.
   */
  profession: string;
  /**
   * Instance destinataire du contrat pour cette profession, telle qu'elle se
   * nomme elle-même. Toutes les professions ne relèvent pas d'un ordre.
   */
  autorite: string;
  /** Article et intitulé, repris du corpus. */
  intitule: string;
  url: string;
  /** Délai applicable, en toutes lettres. Chaîne vide si le texte n'en fixe pas. */
  delai: string;
  /** Possibilité de soumettre un projet de contrat avant signature, et son délai de réponse. */
  avisAvantSignature: string;
  sources: string[];
}

/** Niveau auquel siège l'instance compétente. Il ne se déduit pas de la profession. */
export type NiveauInstance = "national" | "regional" | "interregional" | "departemental";

/**
 * Coordonnées d'une instance compétente.
 *
 * La compétence n'est pas toujours départementale : elle est régionale ou
 * interrégionale pour certaines professions. Et certaines professions ne
 * relèvent d'aucune instance.
 */
export interface InstanceCompetente {
  ordre: string;
  departement: "Gironde" | "Haute-Garonne";
  /** Niveau de l'instance, à afficher tel quel : il change d'une profession à l'autre. */
  niveau: NiveauInstance;
  /** Professions pour lesquelles cette instance est compétente. */
  professions: string[];
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
  instancesCompetentes: InstanceCompetente[];
  checklistAvantSignature: QuestionChecklist[];
  referencesFaq: ReferencesFaq[];
}

export const deontologie: DonneesDeontologie = {
  dateMiseAJour: "14 août 2026",
  mentionTransparence: "",
  bibliographie: {},
  statuts: [],
  niveauxIntegration: [
    { rang: 1, intitule: "Même immeuble", lecture: "Cabinets autonomes, baux distincts, patientèles et signalétiques séparées." },
    { rang: 2, intitule: "Parties communes", lecture: "Entrée, couloirs, sanitaires ou espace de convivialité partagés." },
    { rang: 3, intitule: "Espace d’attente", lecture: "Attente commune, ou sectorisée par groupes de cabinets." },
    { rang: 4, intitule: "Accueil et prise de rendez-vous", lecture: "Une personne ou un outil commun pour recevoir et planifier." },
    { rang: 5, intitule: "Cabinet utilisé à tour de rôle", lecture: "Une même pièce occupée successivement par plusieurs praticiens." },
    { rang: 6, intitule: "Marque, dossier ou parcours commun", lecture: "Une présentation ou une organisation qui donne le lieu comme un ensemble." },
  ],
  positionsOrdinales: [],
  obligationsContrat: [],
  instancesCompetentes: [],
  checklistAvantSignature: [
    { rang: 1, intitule: "Quelle est ma profession, et quel titre exact puis-je employer ?" },
    { rang: 2, intitule: "Mon exercice suppose-t-il une inscription ou un enregistrement, et est-il à jour ?" },
    { rang: 3, intitule: "Le cabinet qui m’est proposé est-il privatif et fermable ?" },
    { rang: 4, intitule: "Qui partage l’espace d’attente, et pour quelles activités ?" },
    { rang: 5, intitule: "Cet espace peut-il être sectorisé, et le plan annexé au bail le prévoit-il ?" },
    { rang: 6, intitule: "Les conversations sont-elles audibles depuis l’attente ou depuis le cabinet voisin ?" },
    { rang: 7, intitule: "Qui accède aux agendas, aux dossiers et aux outils informatiques ?" },
    { rang: 8, intitule: "La signalétique et l’annuaire du lieu m’identifient-ils individuellement ?" },
    { rang: 9, intitule: "Le loyer dépend-il de mon activité, de mes honoraires ou du nombre de patients ?" },
    { rang: 10, intitule: "Mon contrat doit-il être transmis à une instance, et laquelle ?" },
    { rang: 11, intitule: "La copropriété, l’urbanisme, le classement ERP et l’accessibilité sont-ils réglés pour ce local ?" },
    { rang: 12, intitule: "L’appellation du lieu peut-elle laisser croire à une équipe de soins constituée ?" },
  ],
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
