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

export const STATUS_LABELS: Record<string, string> = {
  en_exploitation: "En exploitation",
  en_travaux: "En développement",
  a_venir: "À venir",
};

export const TYPOLOGY_LABELS: Record<string, string> = {
  cabinet_medical: "Cabinet médical",
  pole_pluridisciplinaire: "Pôle pluridisciplinaire",
  coworking_sante: "Coworking santé",
  centre_paramedical: "Centre paramédical",
  maison_de_sante: "Maison de santé",
};
