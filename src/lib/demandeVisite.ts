/**
 * Lot SITE-DISPO-PRIX-1 (audit acquisition du 18/11/2026, demande D3).
 *
 * Disponibilites et prix sur la page d'accueil, et demande de visite qui
 * enregistre la source declaree et le creneau souhaite.
 *
 * Donnees : aucune lecture nouvelle. Les lieux, cabinets et loyers sont ceux de
 * src/lib/cabinetsALouer.ts (CABINETS_A_LOUER, deja publies sur les pages
 * /cabinet-a-louer/<site>), recopies de la base IDN OS (project_units) par les
 * lots precedents. Le site n'a aucun acces a project_units : voir le compte
 * rendu du lot pour le besoin de lecture en direct.
 *
 * Envoi : la fonction existante send-contact-lead, sans changement de
 * destination. La source et le creneau voyagent dans extra_data (colonne jsonb
 * existante de contact_leads) et dans le texte du message, que la notification
 * interne reprend deja.
 */

import { CABINETS_A_LOUER, type CabinetALouer } from "@/lib/cabinetsALouer";
import { isPublicProjectOffer } from "@/lib/publicProjectOffer";

/**
 * Lieux affiches sur l'accueil. Double garde : CABINETS_A_LOUER filtre deja les
 * projets clos (Floirac, arbitrage du 18/11/2026 : opération abandonnee), le
 * filtre est rejoue ici pour qu'un ajout futur ne puisse pas le contourner.
 */
export function lieuxAccueil(cabinets: readonly CabinetALouer[] = CABINETS_A_LOUER): CabinetALouer[] {
  return cabinets.filter(
    (c) => isPublicProjectOffer(c.projetSlug) && isPublicProjectOffer(c.slug) && c.lots.length > 0,
  );
}

export interface OptionCode {
  code: string;
  libelle: string;
}

/** Comment le praticien a connu I-CA.RE (source declaree, obligatoire). */
export const SOURCES_CONNAISSANCE: OptionCode[] = [
  { code: "recherche_google", libelle: "Recherche Google" },
  { code: "fiche_google", libelle: "Fiche Google ou Google Maps" },
  { code: "linkedin", libelle: "LinkedIn" },
  { code: "annonce", libelle: "Annonce en ligne (Caducee, Leboncoin ou autre)" },
  { code: "recommandation_praticien", libelle: "Recommandation d'un praticien" },
  { code: "bouche_a_oreille", libelle: "Bouche à oreille" },
  { code: "passage", libelle: "En passant devant un lieu I-CA.RE" },
  { code: "autre", libelle: "Autre" },
];

/** Moments de visite proposes, avec la date souhaitee. */
export const MOMENTS_VISITE: OptionCode[] = [
  { code: "matin", libelle: "Matin (9 h à 12 h)" },
  { code: "midi", libelle: "Pause de midi (12 h à 14 h)" },
  { code: "apres_midi", libelle: "Après midi (14 h à 18 h)" },
  { code: "fin_de_journee", libelle: "Fin de journée (après 18 h)" },
];

/** Valeur du choix « pas encore de lieu ». */
export const LIEU_A_CONSEILLER = "a_conseiller";

export interface SaisieVisite {
  lieu: string;
  nom: string;
  email: string;
  telephone: string;
  source: string;
  sourcePrecision: string;
  date: string;
  moment: string;
  message: string;
  consentement: boolean;
}

export type ChampVisite = "lieu" | "nom" | "email" | "telephone" | "source" | "sourcePrecision" | "date" | "moment" | "consentement";

/** Ordre de lecture du formulaire, pour placer le focus sur la premiere erreur. */
export const ORDRE_CHAMPS: ChampVisite[] = [
  "lieu", "nom", "email", "telephone", "source", "sourcePrecision", "date", "moment", "consentement",
];

const pad = (n: number) => String(n).padStart(2, "0");

/** Date locale AAAA-MM-JJ. */
export function isoLocal(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Premiere date de visite proposable : le lendemain du jour donne. */
export function premiereDateVisite(aujourdhui: Date): string {
  const d = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), aujourdhui.getDate() + 1);
  return isoLocal(d);
}

/** AAAA-MM-JJ vers JJ/MM/AAAA. */
export function dateFr(iso: string): string {
  const [a, m, j] = iso.split("-");
  return `${j}/${m}/${a}`;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Meme motif que la fonction send-contact-lead.
const TELEPHONE = /^[+\d\s.\-()]{6,30}$/;

/** Controle de la saisie ; renvoie le message de chaque champ refuse. */
export function verifierSaisie(
  s: SaisieVisite,
  dateMin: string,
  lieux: readonly CabinetALouer[] = lieuxAccueil(),
): Partial<Record<ChampVisite, string>> {
  const e: Partial<Record<ChampVisite, string>> = {};
  if (s.lieu !== LIEU_A_CONSEILLER && !lieux.some((c) => c.slug === s.lieu)) e.lieu = "Choisissez le lieu à visiter.";
  if (s.nom.trim().length < 2) e.nom = "Indiquez votre nom.";
  if (!EMAIL.test(s.email.trim())) e.email = "Indiquez une adresse email valide.";
  if (s.telephone.trim() && !TELEPHONE.test(s.telephone.trim())) e.telephone = "Indiquez un numéro de téléphone valide.";
  if (!SOURCES_CONNAISSANCE.some((o) => o.code === s.source)) e.source = "Dites nous comment vous avez connu I-CA.RE.";
  else if (s.source === "autre" && !s.sourcePrecision.trim()) e.sourcePrecision = "Précisez comment vous avez connu I-CA.RE.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s.date) || s.date < dateMin) e.date = `Choisissez une date à partir du ${dateFr(dateMin)}.`;
  if (!MOMENTS_VISITE.some((o) => o.code === s.moment)) e.moment = "Choisissez un moment de la journée.";
  if (!s.consentement) e.consentement = "Votre accord est nécessaire pour traiter la demande.";
  return e;
}

const libelle = (liste: OptionCode[], code: string) => liste.find((o) => o.code === code)?.libelle ?? code;

export function nomLieu(slug: string, lieux: readonly CabinetALouer[] = lieuxAccueil()): string {
  if (slug === LIEU_A_CONSEILLER) return "Lieu à conseiller";
  return lieux.find((c) => c.slug === slug)?.nom ?? slug;
}

/**
 * Corps envoye a send-contact-lead. Champs et type deja acceptes par la
 * fonction (type « praticien », extra_data libre) : aucune modification cote
 * serveur n'est requise.
 */
export function corpsDemandeVisite(
  s: SaisieVisite,
  contexte: { sourceUrl: string; recherche: string; honeypot: string },
  lieux: readonly CabinetALouer[] = lieuxAccueil(),
) {
  const lieuNom = nomLieu(s.lieu, lieux);
  const sourceLibelle = libelle(SOURCES_CONNAISSANCE, s.source);
  const momentLibelle = libelle(MOMENTS_VISITE, s.moment);
  const precision = s.source === "autre" ? s.sourcePrecision.trim().slice(0, 200) : "";
  const lignes = [
    "Demande de visite depuis la page d'accueil.",
    `Lieu : ${lieuNom}`,
    `Créneau souhaité : ${dateFr(s.date)}, ${momentLibelle.charAt(0).toLowerCase()}${momentLibelle.slice(1)}`,
    `Connu par : ${sourceLibelle}${precision ? ` (${precision})` : ""}`,
  ];
  const libre = s.message.trim();
  if (libre) lignes.push("", libre);
  const params = new URLSearchParams(contexte.recherche);
  return {
    type: "praticien",
    full_name: s.nom.trim(),
    email: s.email.trim(),
    phone: s.telephone.trim() || null,
    organization: null,
    message: lignes.join("\n").slice(0, 5000),
    language: "fr",
    source_url: contexte.sourceUrl,
    honeypot: contexte.honeypot,
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || "formulaire-visite-accueil",
    utm_campaign: params.get("utm_campaign") || undefined,
    extra_data: {
      formulaire: "visite-accueil",
      lieu: s.lieu,
      lieu_nom: lieuNom,
      source_declaree: s.source,
      source_declaree_libelle: sourceLibelle,
      ...(precision ? { source_precision: precision } : {}),
      creneau_date: s.date,
      creneau_moment: s.moment,
      creneau_libelle: `${dateFr(s.date)}, ${momentLibelle}`,
    },
  };
}
