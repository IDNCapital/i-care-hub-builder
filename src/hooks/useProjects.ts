import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";

export type Projet = Tables<"projets">;

export function useProjects() {
  return useQuery({
    queryKey: ["projets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Projet[];
    },
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ["projets", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projets")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as Projet | null;
    },
    enabled: !!slug,
  });
}

/**
 * Les libellés de statut et de typologie sont portés par i18n
 * (clés `statusLabels.*` et `typologyLabels.*`), source unique.
 */
