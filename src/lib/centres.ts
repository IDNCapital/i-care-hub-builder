export type CentreStatus = "available" | "full" | "coming_soon";

export interface StaticCentre {
  id: string;
  name: string;
  address: string;
  status: CentreStatus;
  slug?: string;
  region: "bordeaux" | "toulouse";
  /** Précision affichée quand une disponibilité partielle existe (ex. temps partiel) */
  availabilityLabel?: string;
  /** Version EN du availabilityLabel */
  availabilityLabelEn?: string;
}

/**
 * Trimestre d'une date ISO "YYYY-MM-DD" issue de projets.date_ouverture_cible.
 * style "Q" → "Q4 2026" (badges), style "T" → "T4 2026" (carte, convention FR).
 * Source de vérité unique : la base. Parse par chaîne, sans new Date().
 */
export function quarterLabel(dateStr: string | null | undefined, style: "Q" | "T"): string | null {
  if (!dateStr) return null;
  const [y, m] = dateStr.split("-").map(Number);
  if (!y || !m || m < 1 || m > 12) return null;
  return `${style}${Math.ceil(m / 3)} ${y}`;
}

export function openingForecastLabel(dateStr: string | null | undefined): string {
  const t = quarterLabel(dateStr, "T");
  return t ? `Ouverture prévue ${t}` : "Ouverture à venir";
}

/**
 * Ordered: available first, then full, then coming_soon
 *
 * Dates d'ouverture : dérivées de projets.date_ouverture_cible via
 * quarterLabel/openingForecastLabel.
 */
export const STATIC_CENTRES: StaticCentre[] = [
  { id: "chartrons", name: "Chartrons", address: "20 cours Saint Louis, 33300 Bordeaux", status: "available", slug: "i-ca-re-chartrons", region: "bordeaux" },
  { id: "jardin-public", name: "Jardin Public", address: "38 cours du Maréchal Foch, 33000 Bordeaux", status: "available", slug: "i-ca-re-jardin-public", region: "bordeaux", availabilityLabel: "Bureau 3 : les lundis, les mardis et un samedi sur deux", availabilityLabelEn: "Office 3: Mondays, Tuesdays and every other Saturday" },
  { id: "nansouty", name: "Nansouty", address: "106 bis rue Bertrand de Goth, 33800 Bordeaux", status: "full", slug: "i-ca-re-nansouty", region: "bordeaux" },
  { id: "pey-berland", name: "Pey-Berland", address: "6 rue Père Louis de Jabrun, 33000 Bordeaux", status: "full", slug: "i-ca-re-pey-berland", region: "bordeaux" },
  { id: "floirac", name: "Floirac", address: "23 avenue de la Libération, 33270 Floirac", status: "coming_soon", slug: "i-ca-re-floirac", region: "bordeaux" },
  { id: "lormont", name: "Lormont", address: "1 rue Marc Tallavi, 33310 Lormont", status: "coming_soon", slug: "i-ca-re-lormont", region: "bordeaux" },
  { id: "toulouse-capitole", name: "Toulouse Capitole", address: "5 rue de Mirepoix, 31000 Toulouse", status: "coming_soon", slug: "i-ca-re-toulouse-capitole", region: "toulouse" },
  { id: "le-bouscat", name: "Le Bouscat", address: "212 avenue de la Libération Charles de Gaulle, 33110 Le Bouscat", status: "coming_soon", slug: "i-ca-re-le-bouscat", region: "bordeaux" },
];

export function getCentreBySlug(slug: string): StaticCentre | undefined {
  return STATIC_CENTRES.find((c) => c.slug === slug);
}

/**
 * Nombre de centres STATIC_CENTRES situés dans la métropole bordelaise
 * (region === "bordeaux"). Source de vérité unique pour tout texte qui
 * annonce ce nombre, plutôt qu'un chiffre écrit en dur dans une page.
 */
export function bordeauxCentresCount(): number {
  // Lieux ouverts (disponibles ou complets) : un lieu « a venir » ne se compte
  // pas comme un lieu de soin propose aujourd'hui (relecture WEB-DETTES-1).
  return STATIC_CENTRES.filter((c) => c.region === "bordeaux" && c.status !== "coming_soon").length;
}

/** Lieux bordelais annonces et non encore ouverts. */
export function bordeauxCentresComingCount(): number {
  return STATIC_CENTRES.filter((c) => c.region === "bordeaux" && c.status === "coming_soon").length;
}

const COUNT_WORDS_FR = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix"];
const COUNT_WORDS_EN = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

/**
 * Libellé en toutes lettres du nombre de centres de la métropole bordelaise,
 * dérivé de bordeauxCentresCount(). Retombe sur le chiffre si le compte
 * dépasse le lexique couvert.
 */
export function bordeauxCentresCountLabel(lang: "fr" | "en"): string {
  const n = bordeauxCentresCount();
  const words = lang === "en" ? COUNT_WORDS_EN : COUNT_WORDS_FR;
  return words[n] ?? String(n);
}

/**
 * Libellé et classe de badge de statut d'un centre, factorisés depuis
 * LocationCabinetBordeaux.tsx, CabinetALaJournee.tsx et Projets.tsx où ils
 * étaient dupliqués (dette WEB-STATUS-HELPERS-DUPLIQUES). Les classes de
 * contraste sont celles corrigées en PR20 (commit 678447d) : badge
 * « Disponible » en anthracite sur sauge, seuil de contraste 4,5 pour 1.
 */
export function centreStatusLabel(status: CentreStatus, t: (key: string) => string): string {
  if (status === "available") return t("projects.availableBadge");
  if (status === "full") return t("projects.fullBadge");
  return t("projects.comingSoonBadge");
}

export function centreStatusBadgeClass(status: CentreStatus): string {
  if (status === "available") return "bg-sage text-anthracite";
  if (status === "full") return "bg-cream text-anthracite border border-anthracite/60";
  return "bg-gold text-anthracite";
}
