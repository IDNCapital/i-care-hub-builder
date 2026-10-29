/**
 * Pages « cabinet à louer », une par site en commercialisation.
 *
 * Lot ENTRANT-GOOGLE-PAGES-1, decision de Nicolas du 27/10/2026 (canal
 * « demande entrante »). Chiffres de la base IDN OS (tables projects et
 * project_units, lue en SELECT le 28/10/2026) ou du fichier d'annonces relu
 * ANNONCES_ET_PARRAINAGE_2026-10-27.md, identifiant de ligne a cote de chaque
 * valeur.
 *
 * Lot ENTRANT-GOOGLE-PAGES-1B, reponses de Nicolas du 29/10/2026 11:5x
 * (DECISIONS_ACQUISES.md, bloc 12:00), appliquees telles quelles :
 *  1. temps plein : « loyer hors charges, non assujetti à la TVA » ; temps
 *     partiel : « charges comprises » ;
 *  2. Le Bouscat : aucune mention d'etage ; « livraison de l'ensemble fin mars
 *     2027 » (les dates par bureau de la base ne sont plus publiees) ;
 *  3. Toulouse : « 5ter rue Mirepoix » ;
 *  4. Floirac : « surfaces de 12 à 20 m² » ;
 *  5. Jardin Public complet (bail Viaud a partir de mars) : page retiree ;
 *  6. grille a temps partiel 190, 340, 460 EUR par mois charges comprises pour
 *     1, 2, 3 jours fixes par semaine : fichier d'annonces (point 8, d'apres
 *     PRETS_A_ENVOYER_2026-10-08.md, ligne « grille I-CA.RE du 21/09 ») et page
 *     existante /cabinet-a-la-journee (grille identique sur tous les sites) ;
 *  7. professions : medical et paramedical au sens large, kinesitherapeutes
 *     compris.
 * Le parrainage n'apparait sur aucune page publique (decision du 27/10).
 */

import { PROJECT_IMAGES } from "@/lib/projectImages";

export type StatutLot = "libre" | "en_travaux" | "a_livrer";

export interface LotALouer {
  /** Libelle tel qu'en base (project_units.label), ou libelle generique quand la base n'en porte pas. */
  libelle: string;
  /** project_units.surface_m2 ; absent quand la base ne la renseigne pas. */
  surfaceM2?: number;
  /** Fourchette de surface donnee par Nicolas quand la base ne la porte pas (Floirac, 29/10/2026). */
  surfaceMinM2?: number;
  surfaceMaxM2?: number;
  /** project_units.monthly_rent_eur */
  loyerMensuelEur: number;
  /** project_units.status */
  statut: StatutLot;
  /** project_units.date_disponibilite (AAAA-MM-JJ) ; absent quand la base ne la porte pas. */
  disponibleLe?: string;
  /** Nombre de lots identiques regroupes sur une ligne (Floirac). */
  nombre?: number;
}

export interface VisuelSite {
  src: string;
  legende: string;
  /** true : visuel de projet (projection, insertion), jamais une photo du lieu. */
  projection: boolean;
}

export interface ProfessionCible {
  /** Ancre et valeur utm_content. */
  slug: string;
  singulier: string;
  pluriel: string;
}

/** Mention de loyer des lots a temps plein (reponse 1 de Nicolas, 29/10/2026). */
export const MENTION_TEMPS_PLEIN = "loyer hors charges, non assujetti à la TVA";
/** Mention des formules a temps partiel (reponse 1 de Nicolas, 29/10/2026). */
export const MENTION_TEMPS_PARTIEL = "charges comprises";

export interface FormuleTempsPartiel {
  /** Nombre de jours fixes par semaine. */
  jours: number;
  loyerMensuelEur: number;
}

/**
 * Grille a temps partiel, cabinet partage a la journee entiere, loue nu.
 * Source : fichier d'annonces relu (ANNONCES_ET_PARRAINAGE_2026-10-27.md, point 8 :
 * « 190, 340 et 460 euros par mois pour une, deux ou trois journées », d'apres
 * PRETS_A_ENVOYER_2026-10-08.md : « 190, 340, 460 EUR par mois charges comprises
 * pour 1, 2, 3 jours par semaine ») ; meme grille deja publiee sur
 * /cabinet-a-la-journee (« grille identique sur tous nos sites, dès l'ouverture
 * de chacun »). Reprise sur les pages par la reponse 6 de Nicolas du 29/10/2026.
 */
export const GRILLE_TEMPS_PARTIEL: FormuleTempsPartiel[] = [
  { jours: 1, loyerMensuelEur: 190 },
  { jours: 2, loyerMensuelEur: 340 },
  { jours: 3, loyerMensuelEur: 460 },
];

export interface CabinetALouer {
  /** Segment d'URL : /cabinet-a-louer/<slug>/ */
  slug: string;
  /** Valeur du parametre source transmis au formulaire de contact. */
  source: string;
  /** Nom affiche et nom de fiche Google proposee. */
  nom: string;
  /** Nom court du lieu, utilise dans les titres. */
  nomCourt: string;
  /** Lieu avec sa preposition, tel qu'employe dans les titres : « aux Chartrons, Bordeaux ». */
  aLieu: string;
  /** Terme employe par l'annonce relue : « bureau » au Bouscat (point 12), « cabinet » ailleurs. */
  terme: "cabinet" | "bureau";
  /** Adresse publiable. */
  rue: string;
  codePostal: string;
  ville: string;
  region: "bordeaux" | "toulouse";
  /** Lieu en exploitation (Chartrons livre le 01/10/2026 selon la base). */
  ouvert: boolean;
  /** Slug du projet du site vitrine, pour les photos du depot et le lien vers la fiche lieu. */
  projetSlug: string;
  /** Titre court de l'annonce relue (bloc publiable). */
  titreAnnonce: string;
  /** Balise title de la page. */
  seoTitle: string;
  /** Meta description (155 caracteres environ). */
  seoDescription: string;
  /** Chapeau visible, repris des annonces relues. */
  chapeau: string;
  /** Points cles visibles, repris des annonces relues. */
  pointsCles: string[];
  /** Phrase de disponibilite visible. */
  disponibilite: string;
  /** Mention de disponibilite commune a tous les lots du site, quand elle remplace les dates par lot. */
  disponibiliteLots?: string;
  lots: LotALouer[];
  professions: ProfessionCible[];
  visuels: VisuelSite[];
}

// Professions : reponse 7 de Nicolas du 29/10/2026, « ouvert aux pro du médical
// et paramédical élargis », kinesitherapeutes compris. La liste reprend les six
// professions de l'annonce longue des Chartrons et l'elargit aux professions
// medicales et paramedicales courantes en cabinet.
const PROFESSIONS_ANNONCE: ProfessionCible[] = [
  { slug: "medecin", singulier: "médecin", pluriel: "médecins" },
  { slug: "kinesitherapeute", singulier: "kinésithérapeute", pluriel: "kinésithérapeutes" },
  { slug: "osteopathe", singulier: "ostéopathe", pluriel: "ostéopathes" },
  { slug: "psychologue", singulier: "psychologue", pluriel: "psychologues" },
  { slug: "psychotherapeute", singulier: "psychothérapeute", pluriel: "psychothérapeutes" },
  { slug: "orthophoniste", singulier: "orthophoniste", pluriel: "orthophonistes" },
  { slug: "infirmier", singulier: "infirmière ou infirmier", pluriel: "infirmières et infirmiers" },
  { slug: "sage-femme", singulier: "sage femme", pluriel: "sages femmes" },
  { slug: "dieteticien", singulier: "diététicienne ou diététicien", pluriel: "diététiciennes et diététiciens" },
  { slug: "ergotherapeute", singulier: "ergothérapeute", pluriel: "ergothérapeutes" },
  { slug: "psychomotricien", singulier: "psychomotricienne ou psychomotricien", pluriel: "psychomotriciennes et psychomotriciens" },
  { slug: "podologue", singulier: "pédicure podologue", pluriel: "pédicures podologues" },
  { slug: "orthoptiste", singulier: "orthoptiste", pluriel: "orthoptistes" },
  { slug: "sophrologue", singulier: "sophrologue", pluriel: "sophrologues" },
];

/** Point cle commun : reponse 7 de Nicolas du 29/10/2026. */
const POINT_PROFESSIONS =
  "Un lieu ouvert aux professionnels du médical et du paramédical au sens large : médecins, kinésithérapeutes, ostéopathes, psychologues, orthophonistes, infirmiers, sages femmes, diététiciens et autres praticiens de santé.";

function visuelsDepuisDepot(projetSlug: string, legende: (src: string, i: number) => VisuelSite): VisuelSite[] {
  const galerie = PROJECT_IMAGES[projetSlug]?.gallery ?? [];
  return galerie.map((src, i) => legende(src, i));
}

/** Les fichiers nommes projection-* ou insertion-* sont des visuels de projet, pas des photos. */
function estProjection(src: string): boolean {
  return /(projection|insertion)/i.test(src);
}

export const CABINETS_A_LOUER: CabinetALouer[] = [
  {
    slug: "bordeaux-chartrons",
    ouvert: true,
    source: "page-cabinet-chartrons",
    nom: "I-CA.RE Chartrons",
    nomCourt: "Chartrons",
    aLieu: "aux Chartrons, Bordeaux",
    terme: "cabinet",
    rue: "20 cours Saint Louis",
    codePostal: "33300",
    ville: "Bordeaux",
    region: "bordeaux",
    projetSlug: "i-ca-re-chartrons",
    titreAnnonce: "Cabinet de praticien à louer aux Chartrons, Bordeaux : 11 à 13 m², dès 690 € par mois",
    seoTitle: "Cabinet à louer aux Chartrons, Bordeaux : 11 à 13 m², dès 690 € | I-CA.RE",
    seoDescription:
      "Deux cabinets de praticien à louer au 20 cours Saint Louis, Bordeaux Chartrons : 11,1 m² à 690 € et 13,1 m² à 790 € par mois hors charges. Visite sur rendez vous.",
    chapeau:
      "I-CA.RE ouvre aux praticiens indépendants un lieu partagé au 20 cours Saint Louis, 33300 Bordeaux, dans le quartier des Chartrons.",
    pointsCles: [
      POINT_PROFESSIONS,
      "Vous exercez dans un cadre professionnel, aux côtés d'autres praticiens, sans investir dans un local.",
      "Visite sur rendez vous.",
    ],
    disponibilite: "Deux cabinets libres.",
    lots: [
      // project_units 1e82c668-fda1-4a6c-824e-8a497c3337bd
      { libelle: "Cabinet 1", surfaceM2: 11.1, loyerMensuelEur: 690, statut: "libre" },
      // project_units e448d816-f9ce-4467-ada8-76086e467798
      { libelle: "Cabinet 5", surfaceM2: 13.1, loyerMensuelEur: 790, statut: "libre" },
    ],
    professions: PROFESSIONS_ANNONCE,
    // Photos reelles prises a la livraison (12/10/2026, commentaire de src/lib/projectImages.ts) et plan.
    visuels: visuelsDepuisDepot("i-ca-re-chartrons", (src, i) => ({
      src,
      legende: /plan/i.test(src) ? "Plan du lieu" : `Le lieu I-CA.RE Chartrons, photo ${i + 1}`,
      projection: false,
    })),
  },
  {
    slug: "le-bouscat",
    ouvert: false,
    source: "page-cabinet-le-bouscat",
    nom: "I-CA.RE Le Bouscat",
    nomCourt: "Le Bouscat",
    aLieu: "au Bouscat",
    terme: "bureau",
    rue: "212 avenue de la Libération Charles de Gaulle",
    codePostal: "33110",
    ville: "Le Bouscat",
    region: "bordeaux",
    projetSlug: "i-ca-re-le-bouscat",
    titreAnnonce: "Bureaux de praticiens au Bouscat : 10 à 20 m², livraison fin mars 2027",
    seoTitle: "Bureau de praticien à louer au Bouscat : 10 à 20 m², de 700 à 910 € | I-CA.RE",
    seoDescription:
      "Neuf bureaux de praticien à louer au 212 avenue de la Libération Charles de Gaulle, Le Bouscat : 10,4 à 19,8 m², de 700 à 910 € par mois hors charges, livraison fin mars 2027.",
    chapeau:
      "I-CA.RE aménage un nouveau lieu de santé et de bien être au 212 avenue de la Libération Charles de Gaulle, 33110 Le Bouscat.",
    pointsCles: [
      POINT_PROFESSIONS,
      "Un espace détente partagé, pour une pratique plus sereine entre deux consultations.",
      "Un cadre professionnel commun à plusieurs praticiens, sans investissement de départ dans un local.",
      "Visite sur rendez vous.",
    ],
    // Reponse 2 de Nicolas du 29/10/2026 : livraison de l'ensemble fin mars 2027 (remplace les dates par bureau).
    disponibilite: "Neuf bureaux libres. Livraison de l'ensemble fin mars 2027.",
    disponibiliteLots: "Livraison fin mars 2027",
    lots: [
      // project_units c4e112ad-b906-4e05-840c-48f08ddee506
      { libelle: "Bureau 1", surfaceM2: 13, loyerMensuelEur: 800, statut: "libre" },
      // project_units 55ae5e02-dec4-4c5c-900a-12f544befd98
      { libelle: "Bureau 2", surfaceM2: 14.3, loyerMensuelEur: 850, statut: "libre" },
      // project_units 798dc0fe-5f55-48c8-951d-24109f8dc7c7
      { libelle: "Bureau 4", surfaceM2: 11, loyerMensuelEur: 770, statut: "libre" },
      // project_units bf4bbb91-89f9-45a8-ae9c-3896054ab58b
      { libelle: "Bureau 5", surfaceM2: 10.4, loyerMensuelEur: 770, statut: "libre" },
      // project_units 832bade5-6455-4678-bf3c-f5c4c67dcf49
      { libelle: "Bureau 6", surfaceM2: 10.8, loyerMensuelEur: 700, statut: "libre" },
      // project_units 541181e9-1e2e-4d1e-a420-d730ba72f827
      { libelle: "Bureau 7", surfaceM2: 14.2, loyerMensuelEur: 790, statut: "libre" },
      // project_units b0c55436-73df-4e82-8dc3-3e3b1f21d33c
      { libelle: "Bureau 8", surfaceM2: 11.9, loyerMensuelEur: 730, statut: "libre" },
      // project_units 8f6b66c4-0ab0-49f7-bda4-f56f973d36f5
      { libelle: "Bureau 9", surfaceM2: 11.9, loyerMensuelEur: 730, statut: "libre" },
      // project_units 2914ea33-3ce7-483f-824e-36ffeb02f4b9
      { libelle: "Bureau 10", surfaceM2: 19.8, loyerMensuelEur: 910, statut: "libre" },
    ],
    professions: PROFESSIONS_ANNONCE,
    visuels: visuelsDepuisDepot("i-ca-re-le-bouscat", (src, i) => ({
      src,
      legende: estProjection(src)
        ? `Visuel de projet, non contractuel, I-CA.RE Le Bouscat ${i + 1}`
        : `I-CA.RE Le Bouscat, photo ${i + 1}`,
      projection: estProjection(src),
    })),
  },
  {
    slug: "toulouse-capitole",
    ouvert: false,
    source: "page-cabinet-toulouse-capitole",
    nom: "I-CA.RE Toulouse Capitole",
    nomCourt: "Toulouse Capitole",
    aLieu: "à Toulouse Capitole",
    terme: "cabinet",
    // Reponse 3 de Nicolas du 29/10/2026 : « 5ter » (base : « 5t »).
    rue: "5ter rue Mirepoix",
    codePostal: "31000",
    ville: "Toulouse",
    region: "toulouse",
    projetSlug: "i-ca-re-toulouse-capitole",
    titreAnnonce: "Cabinets de praticiens à louer à Toulouse Capitole, ouverture en mars 2027",
    seoTitle: "Cabinet à louer à Toulouse Capitole : 11 à 14 m², de 700 à 800 € | I-CA.RE",
    seoDescription:
      "Cinq cabinets de praticien à louer au 5ter rue Mirepoix, Toulouse Capitole : 11,32 à 14,39 m², de 700 à 800 € par mois hors charges, dès le 01/03/2027.",
    chapeau:
      "I-CA.RE ouvre un lieu partagé au 5ter rue Mirepoix, 31000 Toulouse, dans le secteur Capitole. Les cabinets sont en cours d'aménagement ; ouverture en mars 2027.",
    pointsCles: [
      "Cinq cabinets au rez de chaussée.",
      POINT_PROFESSIONS,
      "Un cadre professionnel partagé avec d'autres praticiens, en centre ville.",
      "Possibilité de réserver dès maintenant le cabinet de votre choix.",
    ],
    disponibilite: "Cinq cabinets en travaux, disponibles le 01/03/2027.",
    lots: [
      // project_units 31c1cd7d-59bb-4b24-b003-d90e9ec630a1
      { libelle: "Cabinet 1", surfaceM2: 14.39, loyerMensuelEur: 800, statut: "en_travaux", disponibleLe: "2027-03-01" },
      // project_units e7960eb4-e472-4ede-8680-8e47ec7442fe
      { libelle: "Cabinet 2", surfaceM2: 11.32, loyerMensuelEur: 700, statut: "en_travaux", disponibleLe: "2027-03-01" },
      // project_units b0617f7c-99ba-4b53-8edb-5e7d11566758
      { libelle: "Cabinet 3", surfaceM2: 11.72, loyerMensuelEur: 700, statut: "en_travaux", disponibleLe: "2027-03-01" },
      // project_units 91cf632b-aba2-450f-9bf9-f5bd689ef7af
      { libelle: "Cabinet 4", surfaceM2: 12.88, loyerMensuelEur: 750, statut: "en_travaux", disponibleLe: "2027-03-01" },
      // project_units ab75b442-aac9-4368-b1d1-78883eaa31d0
      { libelle: "Cabinet 5", surfaceM2: 12.66, loyerMensuelEur: 750, statut: "en_travaux", disponibleLe: "2027-03-01" },
    ],
    professions: PROFESSIONS_ANNONCE,
    visuels: visuelsDepuisDepot("i-ca-re-toulouse-capitole", () => ({
      src: PROJECT_IMAGES["i-ca-re-toulouse-capitole"].hero,
      legende: "Façade du bâtiment, 5ter rue Mirepoix, avant aménagement",
      projection: false,
    })),
  },
  {
    slug: "floirac",
    ouvert: false,
    source: "page-cabinet-floirac",
    nom: "I-CA.RE Floirac",
    nomCourt: "Floirac",
    aLieu: "à Floirac",
    terme: "cabinet",
    rue: "23 avenue de la Libération",
    codePostal: "33270",
    ville: "Floirac",
    region: "bordeaux",
    projetSlug: "i-ca-re-floirac",
    titreAnnonce: "15 cabinets de praticiens à Floirac, ouverture en 2027, 580 € par mois",
    seoTitle: "Cabinet à louer à Floirac, aux portes de Bordeaux : 580 € par mois | I-CA.RE",
    seoDescription:
      "Quinze cabinets de praticien de 12 à 20 m² au 23 avenue de la Libération, Floirac, à 580 € par mois hors charges. Ouverture prévue en 2027.",
    chapeau:
      "I-CA.RE prépare un lieu partagé au 23 avenue de la Libération, 33270 Floirac, aux portes de Bordeaux.",
    pointsCles: [
      "Des surfaces de 12 à 20 m².",
      POINT_PROFESSIONS,
      "Un cadre professionnel commun à plusieurs praticiens, sans investissement de départ dans un local.",
      "Ouverture prévue en 2027 ; les premiers inscrits choisissent leur cabinet.",
    ],
    disponibilite: "Quinze cabinets à livrer, ouverture prévue en 2027.",
    lots: [
      // project_units, 15 lignes du projet P_Floirac, toutes a 580 EUR, statut a_livrer
      // (identifiants listes dans la PR 44) ; surface non renseignee en base, fourchette
      // « surfaces de 12 à 20 m² » donnee par Nicolas le 29/10/2026 (reponse 4).
      { libelle: "Cabinet", surfaceMinM2: 12, surfaceMaxM2: 20, loyerMensuelEur: 580, statut: "a_livrer", nombre: 15 },
    ],
    professions: PROFESSIONS_ANNONCE,
    visuels: visuelsDepuisDepot("i-ca-re-floirac", (src, i) => ({
      src,
      legende: estProjection(src)
        ? `Visuel de projet, non contractuel, I-CA.RE Floirac ${i + 1}`
        : `I-CA.RE Floirac, photo ${i + 1}`,
      projection: estProjection(src),
    })),
  },
  // Jardin Public retire du lot : complet, bail Viaud a partir de mars (reponse 5 de
  // Nicolas du 29/10/2026). Page, fiche Google, sitemap et prerendu retires.
];

export function cabinetALouerParSlug(slug: string | undefined): CabinetALouer | undefined {
  return CABINETS_A_LOUER.find((c) => c.slug === slug);
}

export function cheminCabinetALouer(c: CabinetALouer): string {
  return `/cabinet-a-louer/${c.slug}`;
}

/**
 * Lien vers le formulaire de contact existant (/contact), qui prerempli deja la
 * demande de visite par le parametre `centre`. Le parametre `source` identifie
 * la page ; il voyage dans source_url, et utm_source le range dans sa colonne
 * dediee sans modifier le formulaire. `provenance` reprend le `source` d'arrivee
 * (par exemple la fiche Google) dans utm_campaign.
 */
export function lienContactCabinet(c: CabinetALouer, opts: { profession?: string; provenance?: string | null } = {}): string {
  const p = new URLSearchParams();
  p.set("centre", c.nom);
  p.set("source", c.source);
  p.set("utm_source", c.source);
  p.set("utm_medium", "page-cabinet-a-louer");
  const provenance = (opts.provenance ?? "").replace(/[^a-z0-9-]/gi, "").slice(0, 80);
  if (provenance) p.set("utm_campaign", provenance);
  if (opts.profession) p.set("utm_content", opts.profession);
  return `/contact?${p.toString()}`;
}

const nf = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 2 });

export function formatSurface(m2: number): string {
  return `${nf(m2)} m²`;
}

export function formatLoyer(eur: number): string {
  return `${nf(eur)} € par mois`;
}

/** AAAA-MM-JJ vers JJ/MM/AAAA, par chaine, sans fuseau. */
export function formatDate(iso: string): string {
  const [a, m, j] = iso.split("-");
  return `${j}/${m}/${a}`;
}

/** Fourchettes calculees sur les lots publies (min et max des lignes ci dessus). */
export function fourchettes(c: CabinetALouer) {
  const loyers = c.lots.map((l) => l.loyerMensuelEur);
  const surfaces = c.lots
    .flatMap((l) => [l.surfaceM2, l.surfaceMinM2, l.surfaceMaxM2])
    .filter((s): s is number => typeof s === "number");
  return {
    loyerMin: Math.min(...loyers),
    loyerMax: Math.max(...loyers),
    surfaceMin: surfaces.length ? Math.min(...surfaces) : undefined,
    surfaceMax: surfaces.length ? Math.max(...surfaces) : undefined,
    nombreLots: c.lots.reduce((n, l) => n + (l.nombre ?? 1), 0),
  };
}

/** Resume de l'offre en une phrase, calcule sur les lots publies. */
export function resumeOffre(c: CabinetALouer): string {
  const f = fourchettes(c);
  const parties: string[] = [];
  if (f.surfaceMin !== undefined && f.surfaceMax !== undefined) {
    parties.push(
      f.surfaceMin === f.surfaceMax
        ? formatSurface(f.surfaceMin)
        : `de ${nf(f.surfaceMin)} à ${formatSurface(f.surfaceMax)}`,
    );
  }
  parties.push(
    (f.loyerMin === f.loyerMax ? formatLoyer(f.loyerMin) : `de ${nf(f.loyerMin)} à ${formatLoyer(f.loyerMax)}`) +
      ` (${MENTION_TEMPS_PLEIN})`,
  );
  const texte = parties.join(", ");
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}


/** Surface affichee d'un lot : surface exacte de la base, ou fourchette donnee par Nicolas. */
export function surfaceLot(l: LotALouer): string | undefined {
  if (l.surfaceM2 !== undefined) return formatSurface(l.surfaceM2);
  if (l.surfaceMinM2 !== undefined && l.surfaceMaxM2 !== undefined) {
    return `de ${nf(l.surfaceMinM2)} à ${formatSurface(l.surfaceMaxM2)}`;
  }
  return undefined;
}

/** « de » ou « d' » devant un nom de profession (elision devant voyelle ou h muet). */
export function deProfession(nom: string): string {
  return /^[aeiouyhéèêâîôû]/i.test(nom) ? `d'${nom}` : `de ${nom}`;
}

/** Libelle d'une formule a temps partiel : « Un jour fixe par semaine ». */
export function libelleFormule(f: FormuleTempsPartiel): string {
  const n = ["", "Un", "Deux", "Trois"][f.jours] ?? String(f.jours);
  return `${n} ${f.jours > 1 ? "jours fixes" : "jour fixe"} par semaine`;
}
