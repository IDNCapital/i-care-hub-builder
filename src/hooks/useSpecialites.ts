import { useLecturePubliqueComplete } from "@/hooks/usePraticiensPublics";
import { supabase } from "@/integrations/supabase/client";

export interface Specialite {
  slug: string;
  nom: string;
  description_courte: string;
  description_longue: string | null;
  synonymes: string[];
  cabinet_slug: string | null;
}

const requeteSpecialites = (debut: number, fin: number, head: boolean) => {
  const q = supabase.from("specialites").select("slug, nom, description_courte, description_longue, synonymes, cabinet_slug", { count: "exact", head })
    .eq("actif", true).order("nom", { ascending: true }).order("slug", { ascending: true });
  return head ? q : q.range(debut, fin);
};
const specialiteValide = (s: Record<string, unknown>) => typeof s.nom === "string" && typeof s.description_courte === "string"
  && (s.description_longue === null || typeof s.description_longue === "string") && (s.cabinet_slug === null || typeof s.cabinet_slug === "string")
  && Array.isArray(s.synonymes) && s.synonymes.every(v => typeof v === "string");

/** Taxonomie publique active complète, triée par nom puis slug unique. */
export function useSpecialites() {
  return useLecturePubliqueComplete<Specialite>(requeteSpecialites, specialiteValide);
}
