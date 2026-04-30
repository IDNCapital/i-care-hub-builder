import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PraticienCabinetPublic {
  slug: string;
  prenom: string;
  nom: string;
  profession: string;
  photo_url: string | null;
  specialites: string[];
  problematiques: string[];
  google_place_id: string | null;
}

/**
 * Récupère les praticiens VALIDÉS et ACTIFS pour un cabinet donné,
 * triés alphabétiquement par nom de famille.
 * Retourne [] si aucun praticien validé.
 */
export function usePraticiensCabinet(cabinetSlug: string | undefined) {
  const [data, setData] = useState<PraticienCabinetPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cabinetSlug) {
      setData([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data: rows, error } = await supabase
        .from("praticiens")
        .select("slug, prenom, nom, profession, photo_url, specialites, problematiques, google_place_id")
        .eq("cabinet_slug", cabinetSlug)
        .eq("statut_validation", "validee")
        .eq("actif", true)
        .order("nom", { ascending: true });
      if (cancelled) return;
      if (error) {
        setData([]);
      } else {
        setData((rows ?? []) as PraticienCabinetPublic[]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [cabinetSlug]);

  return { data, loading };
}