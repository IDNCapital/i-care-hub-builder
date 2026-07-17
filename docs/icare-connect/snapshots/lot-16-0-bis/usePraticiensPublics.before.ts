import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PraticienPublic {
  slug: string;
  prenom: string;
  nom: string;
  profession: string;
  photo_url: string | null;
  specialites: string[];
  problematiques: string[];
  specialites_derivees: string[];
  problematiques_derivees: string[];
  publics_derives: string[];
  cabinet_slug: string;
}

/**
 * Récupère TOUS les praticiens validés et actifs (annuaire public global),
 * triés alphabétiquement par nom de famille. Utilisé par l'index /patients.
 */
export function usePraticiensPublics() {
  const [data, setData] = useState<PraticienPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data: rows, error } = await supabase
        .from("praticiens")
        .select(
          "slug, prenom, nom, profession, photo_url, specialites, problematiques, specialites_derivees, problematiques_derivees, publics_derives, cabinet_slug",
        )
        .eq("statut_validation", "validee")
        .eq("actif", true)
        .order("nom", { ascending: true });
      if (cancelled) return;
      if (error) setData([]);
      else setData((rows ?? []) as PraticienPublic[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading };
}