const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function lireCible(texte: string): string | null {
  if (!texte.trim()) return null;
  const corps: unknown = JSON.parse(texte);
  if (typeof corps !== "object" || corps === null || Array.isArray(corps)) throw Error("Corps de lecture invalide");
  if (!("id" in corps)) return null;
  if (typeof corps.id !== "string" || !uuid.test(corps.id)) throw Error("Identifiant de demande invalide");
  return corps.id.toLowerCase();
}

type Lecture<T> = {
  eq(colonne: "id", valeur: string): { limit(nombre: number): T };
  order(colonne: "created_at", options: { ascending: boolean }): { limit(nombre: number): T };
};

export function selectionnerDemandes<T>(requete: Lecture<T>, cible: string | null): T {
  return cible === null
    ? requete.order("created_at", { ascending: false }).limit(500)
    : requete.eq("id", cible).limit(1);
}
