import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Specialite {
  slug: string;
  nom: string;
  description_courte: string;
  description_longue: string | null;
  synonymes: string[];
  cabinet_slug: string | null;
}

/**
 * Lit la taxonomie des spécialités patient (RLS : actif=true côté serveur).
 * Tri alphabétique par nom.
 */
export function useSpecialites() {
  const [data, setData] = useState<Specialite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data: rows, error } = await supabase
        .from("specialites")
        .select("slug, nom, description_courte, description_longue, synonymes, cabinet_slug")
        .order("nom", { ascending: true });
      if (cancelled) return;
      if (error) setData([]);
      else setData((rows ?? []) as Specialite[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading };
}