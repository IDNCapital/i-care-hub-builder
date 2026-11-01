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
 * Ces valeurs ne dependent pas de la base : la page reste juste meme avant les
 * mises a jour SQL proposees dans le rapport du lot.
 */

import { CABINETS_A_LOUER, GRILLE_TEMPS_PARTIEL, type LotALouer } from "@/lib/cabinetsALouer";
import { assetUrl } from "@/lib/siteUrl";

export const CAPITOLE_SLUG = "i-ca-re-toulouse-capitole";

export const CAPITOLE_ADRESSE = "5 ter rue de Mirepoix, 31000 Toulouse";

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

/**
 * Corrige l'adresse lue en base pour Toulouse Capitole (la ligne inseree le
 * 21/04/2026 portait le numero 5 sans « ter »). Sans effet sur les autres projets.
 */
export function avecAdresseCapitole<T extends { slug: string; address?: string | null }>(project: T): T {
  if (project.slug !== CAPITOLE_SLUG) return project;
  return { ...project, address: CAPITOLE_ADRESSE };
}
