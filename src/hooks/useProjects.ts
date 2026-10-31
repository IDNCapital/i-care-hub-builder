import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";

export type Projet = Tables<"projets">;

export function useProjects() {
  return useQuery({
    queryKey: ["projets"],
    retry: false,
    queryFn: async ({ signal }) => {
      const echeance = Date.now() + 15_000;
      const transport = new AbortController();
      let terminee = false;
      let interrompre: ((raison: Error) => void) | null = null;
      const interruption = new Promise<never>((_resolve, reject) => { interrompre = reject; });
      const annuler = () => { terminee = true; transport.abort(); interrompre?.(new Error("Lecture du catalogue annulée.")); };
      const borne = setTimeout(() => {
        terminee = true;
        transport.abort();
        interrompre?.(new Error("Lecture complète du catalogue sans réponse sous 15 secondes."));
      }, 15_000);
      const courante = () => {
        if (terminee || signal.aborted) throw new Error("Lecture du catalogue annulée.");
        if (Date.now() >= echeance) throw new Error("Lecture complète du catalogue sans réponse sous 15 secondes.");
      };
      signal.addEventListener("abort", annuler, { once: true });
      const collecter = async () => {
        const projects: Projet[] = [];
        const ids = new Set<string>();
        let expectedCount: number | undefined;
        for (let page = 0; page < 50; page++) {
          courante();
          const { data, error, count } = await supabase
            .from("projets")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .order("id", { ascending: false })
            .range(projects.length, projects.length + 199)
            .abortSignal(transport.signal);
          courante();
          if (error) throw error;
          if (!Array.isArray(data) || data.length > 200 || !Number.isInteger(count) || count === null || count < 0 || count > 10000) {
            throw new Error("Catalogue non confirme");
          }
          if (expectedCount !== undefined && count !== expectedCount) throw new Error("Catalogue modifie pendant la lecture");
          expectedCount = count;
          for (const project of data) {
            if (!project || typeof project.id !== "string" || !project.id || ids.has(project.id)) throw new Error("Identite de cabinet non confirmee");
            ids.add(project.id);
          }
          projects.push(...data);
          if (projects.length > expectedCount) throw new Error("Catalogue incoherent");
          if (projects.length === expectedCount) { courante(); return projects; }
          if (data.length === 0) throw new Error("Catalogue incomplet");
        }
        throw new Error("Limite de lecture du catalogue atteinte");
      };
      try {
        if (signal.aborted) annuler();
        return await Promise.race([collecter(), interruption]);
      } finally {
        terminee = true;
        transport.abort();
        clearTimeout(borne);
        signal.removeEventListener("abort", annuler);
      }
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
