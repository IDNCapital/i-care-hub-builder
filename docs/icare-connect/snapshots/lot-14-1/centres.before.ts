export type CentreStatus = "available" | "full" | "coming_soon";

export interface StaticCentre {
  id: string;
  name: string;
  address: string;
  status: CentreStatus;
  slug?: string;
  region: "bordeaux" | "toulouse";
  openingLabel?: string;
}

/** Ordered: available first, then full, then coming_soon */
export const STATIC_CENTRES: StaticCentre[] = [
  { id: "chartrons", name: "Chartrons", address: "20 cours Saint Louis, 33300 Bordeaux", status: "available", slug: "i-ca-re-chartrons", region: "bordeaux", openingLabel: "Q4 2026" },
  { id: "nansouty", name: "Nansouty", address: "106 bis rue Bertrand de Goth, 33800 Bordeaux", status: "full", slug: "i-ca-re-nansouty", region: "bordeaux" },
  { id: "jardin-public", name: "Jardin Public", address: "38 cours du Maréchal Foch, 33000 Bordeaux", status: "full", slug: "i-ca-re-jardin-public", region: "bordeaux" },
  { id: "pey-berland", name: "Pey-Berland", address: "6 rue Père Louis de Jabrun, 33000 Bordeaux", status: "full", slug: "i-ca-re-pey-berland", region: "bordeaux" },
  { id: "floirac", name: "Floirac", address: "23 avenue de la Libération, 33270 Floirac", status: "coming_soon", slug: "i-ca-re-floirac", region: "bordeaux", openingLabel: "Q4 2026" },
  { id: "lormont", name: "Lormont", address: "1 rue Marc Tallavi, 33310 Lormont", status: "coming_soon", slug: "i-ca-re-lormont", region: "bordeaux", openingLabel: "Q2 2027" },
  { id: "toulouse-capitole", name: "Toulouse Capitole", address: "5 rue de Mirepoix, 31000 Toulouse", status: "coming_soon", slug: "i-ca-re-toulouse-capitole", region: "toulouse", openingLabel: "Q4 2026" },
];

export function getCentreBySlug(slug: string): StaticCentre | undefined {
  return STATIC_CENTRES.find((c) => c.slug === slug);
}
