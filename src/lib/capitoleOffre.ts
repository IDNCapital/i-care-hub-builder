/**
 * Offre de la page /projets/i-ca-re-toulouse-capitole.
 *
 * Lot SITE-CAPITOLE-VISUELS-1, decisions de Nicolas du 31/10/2026 :
 *  1. adresse « 5 ter rue de Mirepoix, 31000 Toulouse » partout ;
 *  2. temps plein : « loyer mensuel hors charges, TVA non applicable », cinq
 *     cabinets (surfaces et loyers ci dessous) ; temps partiel a la journee :
 *     190, 340, 460 EUR par mois charges comprises pour 1, 2, 3 jours par
 *     semaine ;
 *  3. galerie des dix projections IA (fichiers sous public/visuels/toulouse-capitole,
 *     legendes du fichier 06-legendes-10-images.txt), accueil et attente en tete ;
 *  4. carnet du projet en PDF de 12 pages, heberge sous public/documents ;
 *  5. section « Pour qui » ;
 *  6. image de partage et balises de page.
 *
 * Les lots et la grille a temps partiel sont repris de cabinetsALouer.ts, qui
 * porte deja ces valeurs (project_units, lus le 28/10/2026) : une seule source
 * dans le depot.
 *
 * Pour ce slug, l'adresse, le chapeau, la description longue et les points cles
 * affiches (et repris dans les donnees structurees) viennent de ce fichier, pas
 * de la base : la ligne public.projets peut porter une ancienne fiche sans que la
 * page l'affiche. La tuile de livraison de la fiche utilise aussi la date de ce
 * fichier. Les autres colonnes (nom, ville, statut, typologie, surface, nombre
 * de cabinets, coordonnees) restent lues en base.
 * Les mises a jour SQL du rapport du lot alignent la base sur ces textes.
 */

import { CABINETS_A_LOUER, GRILLE_TEMPS_PARTIEL, type LotALouer } from "@/lib/cabinetsALouer";
import { assetUrl } from "@/lib/siteUrl";
import { CAPITOLE_SLUG } from "@/lib/capitoleAdresse";

export { CAPITOLE_SLUG, CAPITOLE_ADRESSE, avecAdresseCapitole } from "@/lib/capitoleAdresse";

/** Livraison prevue en mars 2027 (decision du 31/10/2026), au format de projets.date_ouverture_cible. */
export const CAPITOLE_DATE_OUVERTURE = "2027-03-01";

export interface TextesCapitole {
  chapeau: string;
  description: string;
  pointsCles: string[];
}

/**
 * Textes de la fiche, identiques au SQL propose dans le rapport du lot (version
 * francaise, sans le point « Accueil et attente, cuisine commune ») ; la version
 * anglaise en est une traduction fidele, sans chiffre nouveau.
 */
export const CAPITOLE_TEXTES: Record<"fr" | "en", TextesCapitole> = {
  fr: {
    chapeau:
      "Cinq cabinets de praticien à louer au 5 ter rue de Mirepoix, Toulouse Capitole, de 11,32 à 14,39 m². Livraison prévue en mars 2027, visites possibles dès maintenant.",
    description:
      "Au 5 ter rue de Mirepoix, 31000 Toulouse, dans le secteur Capitole, I-CA.RE aménage un lieu partagé de cinq cabinets pour les professionnels du soin et du bien être, médical et paramédical, avec un accueil et attente et une cuisine commune.\n\nTemps plein, loyer mensuel hors charges, TVA non applicable : de 700 € à 800 € par mois selon le cabinet (11,32 à 14,39 m²). Temps partiel à la journée : 190 € par mois (1 jour par semaine), 340 € (2 jours), 460 € (3 jours), charges comprises. Les conditions détaillées sont communiquées avant tout engagement.\n\nLivraison prévue en mars 2027. Visites possibles dès maintenant.",
    pointsCles: [
      "5 cabinets de 11,32 à 14,39 m²",
      "Temps plein de 700 à 800 € par mois hors charges, TVA non applicable",
      "Temps partiel dès 190 € par mois, charges comprises",
      "Livraison prévue en mars 2027",
      "Visites possibles dès maintenant",
    ],
  },
  en: {
    chapeau:
      "Five practitioner offices to rent at 5 ter rue de Mirepoix, Toulouse Capitole, from 11.32 to 14.39 sqm. Delivery planned for March 2027, visits available now.",
    description:
      "At 5 ter rue de Mirepoix, 31000 Toulouse, in the Capitole area, I-CA.RE is fitting out a shared place with five offices for care and wellbeing professionals, medical and paramedical, with a reception and waiting area and a shared kitchen.\n\nFull time, monthly rent excluding charges, VAT not applicable: from €700 to €800 per month depending on the office (11.32 to 14.39 sqm). Part time by the day: €190 per month (1 day per week), €340 (2 days), €460 (3 days), charges included. Detailed terms are provided before any commitment.\n\nDelivery planned for March 2027. Visits available now.",
    pointsCles: [
      "5 offices from 11.32 to 14.39 sqm",
      "Full time from €700 to €800 per month excluding charges, VAT not applicable",
      "Part time from €190 per month, charges included",
      "Delivery planned for March 2027",
      "Visits available now",
    ],
  },
};

export const CAPITOLE_SEO_TITRE = "Cabinets à louer Toulouse Capitole, 5 ter rue de Mirepoix | I-CA.RE";

export const CAPITOLE_SEO_DESCRIPTION =
  "Cinq cabinets de praticien à louer au 5 ter rue de Mirepoix, Toulouse Capitole, de 11 à 14 m². Livraison prévue en mars 2027, visites possibles dès maintenant.";

export const CAPITOLE_OG = {
  ogImage: assetUrl("/og/og-projet-toulouse-capitole.jpg"),
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "Projection IA de l'accueil et de l'attente, I-CA.RE Toulouse Capitole, 5 ter rue de Mirepoix",
};

export const CAPITOLE_TEMPS_PLEIN_TITRE = "Temps plein, loyer mensuel hors charges, TVA non applicable";

export const CAPITOLE_TEMPS_PARTIEL_TITRE = "Temps partiel à la journée";

export const CAPITOLE_TEMPS_PARTIEL_MENTION = "charges comprises";

export const CAPITOLE_CONDITIONS = "Les conditions détaillées sont communiquées avant tout engagement.";

export const CAPITOLE_LOTS: LotALouer[] =
  CABINETS_A_LOUER.find((c) => c.projetSlug === CAPITOLE_SLUG)?.lots ?? [];

export const CAPITOLE_GRILLE_TEMPS_PARTIEL = GRILLE_TEMPS_PARTIEL;

export const CAPITOLE_CARNET = {
  href: "/documents/i-ca-re-toulouse-capitole-carnet-projet.pdf",
  libelle: "Télécharger le carnet du projet (PDF, 12 pages)",
  nomFichier: "i-ca-re-toulouse-capitole-carnet-projet.pdf",
};

export const CAPITOLE_MENTION_PROJECTIONS =
  "Projections créées avec l'IA avant travaux, mobilier indicatif, surfaces projetées au plan, à confirmer à la livraison.";

export const CAPITOLE_MENTION_PROJECTIONS_EN =
  "AI generated projections made before works, indicative furniture, surfaces projected from the plan, to be confirmed on delivery.";

export const CAPITOLE_POUR_QUI_TITRE = "Pour qui";

export const CAPITOLE_POUR_QUI_METIERS = [
  "Psychologues",
  "Psychothérapeutes",
  "Ostéopathes",
  "Sophrologues",
  "Diététiciens",
];

export const CAPITOLE_POUR_QUI_ELARGI =
  "Et plus largement les professionnels du soin et du bien être, médical et paramédical.";

export interface ProjectionCapitole {
  /** Chemin sans extension, sous public/ ; les variantes .webp et .jpg existent toutes deux. */
  base: string;
  legende: string;
  legendeEn: string;
}

const DOSSIER = "/visuels/toulouse-capitole";

/**
 * Ordre d'affichage : la vue 06 (accueil et attente) en tete, puis la serie
 * dans l'ordre du fichier de legendes. Legendes reprises du fichier
 * 05_Textes_annonces/06-legendes-10-images.txt, sans leur numero.
 */
export const CAPITOLE_PROJECTIONS: ProjectionCapitole[] = [
  {
    base: `${DOSSIER}/mirepoix-06-accueil-attente-1600`,
    legende: "Accueil et attente. Le premier contact avec le lieu, pensé comme un temps d'accueil.",
    legendeEn: "Reception and waiting area. The first contact with the place, designed as a moment of welcome.",
  },
  {
    base: `${DOSSIER}/mirepoix-01-cabinet-01-1600`,
    legende: "Cabinet 01, vue d'ensemble. Un petit canapé, un fauteuil et des textiles pour recevoir dans un cadre chaleureux.",
    legendeEn: "Office 01, overview. A small sofa, an armchair and textiles to welcome clients in a warm setting.",
  },
  {
    base: `${DOSSIER}/mirepoix-02-cabinet-02-1600`,
    legende: "Cabinet 02. Deux fauteuils enveloppants et des tables basses pour les échanges.",
    legendeEn: "Office 02. Two enveloping armchairs and coffee tables for conversations.",
  },
  {
    base: `${DOSSIER}/mirepoix-03-cabinet-03-1600`,
    legende: "Cabinet 03, vue d'angle et espace d'entretien. Une autre perspective pour se projeter dans les échanges avec ses patients ou clients.",
    legendeEn: "Office 03, corner view and consultation area. Another perspective on sessions with patients or clients.",
  },
  {
    base: `${DOSSIER}/mirepoix-04-cabinet-04-1600`,
    legende: "Cabinet 04. Cloisons blanc cassé et sol gris bleuté esprit parquet vieilli composent l'ambiance prévue.",
    legendeEn: "Office 04. Off white partitions and a blue grey aged parquet style floor set the planned atmosphere.",
  },
  {
    base: `${DOSSIER}/mirepoix-05-cabinet-05-1600`,
    legende: "Cabinet 05. Cinquième cabinet du projet, dans la même palette douce.",
    legendeEn: "Office 05. The fifth office of the project, in the same soft palette.",
  },
  {
    base: `${DOSSIER}/mirepoix-07-salon-attente-1600`,
    legende: "Coin attente. Le bras étroit de l'attente vers l'entrée, avec une assise compacte et un décor de nuages.",
    legendeEn: "Waiting corner. The narrow part of the waiting area towards the entrance, with compact seating and a cloud decor.",
  },
  {
    base: `${DOSSIER}/mirepoix-08-circulation-1600`,
    legende: "Circulation. Le chemin qui relie les cabinets et les espaces partagés.",
    legendeEn: "Corridor. The path linking the offices and the shared spaces.",
  },
  {
    base: `${DOSSIER}/mirepoix-09-cuisine-commune-1600`,
    legende: "Cuisine commune. Un espace partagé prévu pour le quotidien des professionnels.",
    legendeEn: "Shared kitchen. A shared space planned for the practitioners' daily life.",
  },
  {
    base: `${DOSSIER}/mirepoix-10-cabinet-01-sans-mobilier-1600`,
    legende: "Cabinet 01 sans mobilier. La pièce dégagée laisse lire les finitions projetées.",
    legendeEn: "Office 01 without furniture. The empty room shows the planned finishes.",
  },
];

/** Format francais d'une surface : 14,39 m². */
export function formatSurface(m2: number): string {
  return `${m2.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²`;
}

/** Format francais d'un loyer entier : 800 €. */
export function formatLoyer(eur: number): string {
  return `${eur.toLocaleString("fr-FR")} €`;
}

/**
 * « 190 € par mois (1 jour par semaine), 340 € (2 jours), 460 € (3 jours),
 * charges comprises », formulation decidee le 31/10/2026, construite depuis la grille.
 */
export function phraseTempsPartielCapitole(): string {
  const parties = CAPITOLE_GRILLE_TEMPS_PARTIEL.map((f, i) =>
    i === 0
      ? `${formatLoyer(f.loyerMensuelEur)} par mois (${f.jours} jour${f.jours > 1 ? "s" : ""} par semaine)`
      : `${formatLoyer(f.loyerMensuelEur)} (${f.jours} jour${f.jours > 1 ? "s" : ""})`,
  );
  return `${parties.join(", ")}, ${CAPITOLE_TEMPS_PARTIEL_MENTION}.`;
}
