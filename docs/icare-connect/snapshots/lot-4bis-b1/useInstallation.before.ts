import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface Profession {
  id: string;
  slug: string;
  nom_masculin_singulier: string;
  nom_feminin_singulier: string;
  nom_inclusif_pluriel: string;
  ordre_affichage: number;
  actif: boolean;
}

export interface InstallationPage {
  profession_slug: string;
  profession_libelle: string;
  profession_ordre: number;
  ville_slug: string;
  cabinet_nom_complet: string;
  cabinet_adresse: string | null;
  cabinet_ville: string;
  date_ouverture: string | null;
  url_path: string;
  projet_id: string;
  profession_id: string;
}

export interface CabinetPipeline {
  id: string;
  slug: string;
  slug_installation: string;
  name: string;
  city: string;
  address: string | null;
  date_ouverture_cible: string | null;
}

export function useProfessions() {
  return useQuery({
    queryKey: ["professions"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("professions")
        .select("id, slug, nom_masculin_singulier, nom_feminin_singulier, nom_inclusif_pluriel, ordre_affichage, actif")
        .eq("actif", true)
        .order("ordre_affichage", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Profession[];
    },
  });
}

export function useCabinetsPipeline() {
  return useQuery({
    queryKey: ["cabinets-pipeline"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projets")
        .select("id, slug, slug_installation, name, city, address, date_ouverture_cible")
        .in("status", ["en_travaux", "a_venir"])
        .not("slug_installation", "is", null)
        .order("date_ouverture_cible", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as CabinetPipeline[];
    },
  });
}

export function useInstallationPage(professionSlug: string, villeSlug: string) {
  return useQuery({
    queryKey: ["installation-page", professionSlug, villeSlug],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("installation_pages")
        .select("*")
        .eq("profession_slug", professionSlug)
        .eq("ville_slug", villeSlug)
        .maybeSingle();
      if (error) throw error;
      return data as InstallationPage | null;
    },
    enabled: !!professionSlug && !!villeSlug,
  });
}