import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Problematique {
  slug: string;
  nom: string;
  description_courte: string;
  description_longue: string | null;
  synonymes: string[];
}

/**
 * Lit la taxonomie des problématiques patient (RLS : actif=true côté serveur).
 * Tri alphabétique par nom.
 */
export function useProblematiques() {
  const [data, setData] = useState<Problematique[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(false);
      const { data: rows, error } = await supabase
        .from("problematiques")
        .select("slug, nom, description_courte, description_longue, synonymes")
        .order("nom", { ascending: true });
      if (cancelled) return;
      if (error) {
        setData([]);
        setError(true);
      }
      else setData((rows ?? []) as Problematique[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}