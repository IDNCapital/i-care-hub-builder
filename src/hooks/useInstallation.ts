import { supabase } from "@/integrations/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Ces tables d'installation ne figurent pas dans les types generes de
 * `Database` : le client doit donc etre lu sans son schema. Un client sans
 * generique, plutot qu'un `any`, garde le typage des methodes appelees
 * (`from`, `select`, `eq`, `order`, `maybeSingle`) au lieu de tout eteindre.
 */
type SupabaseSansSchema = SupabaseClient;
import { useQuery } from "@tanstack/react-query";
import type {
  InstallationContentCommon,
  InstallationContentProfession,
  InstallationContentVille,
} from "@/types/installation";
import { avecAdresseCapitole } from "@/lib/capitoleAdresse";

export interface Profession {
  id: string;
  slug: string;
  nom_masculin_singulier: string;
  nom_feminin_singulier: string;
  nom_inclusif_pluriel: string;
  ordre_affichage: number;
  actif: boolean;
  page_installation?: boolean;
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
  lat: number | null;
  lng: number | null;
  google_place_id: string | null;
}

export interface CabinetInstallation extends CabinetPipeline {
  status: string;
}

export function useProfessions() {
  return useQuery({
    queryKey: ["professions"],
    queryFn: async () => {
      const { data, error } = await (supabase as unknown as SupabaseSansSchema)
        .from("professions")
        .select("id, slug, nom_masculin_singulier, nom_feminin_singulier, nom_inclusif_pluriel, ordre_affichage, actif, page_installation")
        .eq("actif", true)
        .order("ordre_affichage", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Profession[];
    },
  });
}

/**
 * Professions disposant d'une page /sinstaller/[profession]/[ville] prérendue.
 * À utiliser pour tout maillage interne vers la matrice, afin de ne jamais
 * produire de lien vers une page non générée.
 */
export function useProfessionsInstallation() {
  return useQuery({
    queryKey: ["professions", "page_installation"],
    queryFn: async () => {
      const { data, error } = await (supabase as unknown as SupabaseSansSchema)
        .from("professions")
        .select("id, slug, nom_masculin_singulier, nom_feminin_singulier, nom_inclusif_pluriel, ordre_affichage, actif, page_installation")
        .eq("actif", true)
        .eq("page_installation", true)
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
        .select("id, slug, slug_installation, name, city, address, date_ouverture_cible, lat, lng, google_place_id")
        .in("status", ["en_travaux", "a_venir"])
        .not("slug_installation", "is", null)
        .order("date_ouverture_cible", { ascending: true });
      if (error) throw error;
      // Toulouse Capitole : adresse du 31/10/2026, independante de la ligne en base.
      return (data ?? []).map(avecAdresseCapitole) as unknown as CabinetPipeline[];
    },
  });
}

/**
 * Cabinets disposant de pages /sinstaller : en travaux, à venir, ou ouverts
 * (décision du 15/10/2026 : un cabinet ouvert garde ses pages d'installation).
 */
export function useCabinetsInstallation() {
  return useQuery({
    queryKey: ["cabinets-installation"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projets")
        .select("id, slug, slug_installation, name, city, address, date_ouverture_cible, lat, lng, google_place_id, status")
        .in("status", ["en_travaux", "a_venir", "en_exploitation"])
        .not("slug_installation", "is", null)
        .order("date_ouverture_cible", { ascending: true });
      if (error) throw error;
      // Toulouse Capitole : adresse du 31/10/2026, independante de la ligne en base.
      return (data ?? []).map(avecAdresseCapitole) as unknown as CabinetInstallation[];
    },
  });
}

export function useInstallationPage(professionSlug: string, villeSlug: string) {
  return useQuery({
    queryKey: ["installation-page", professionSlug, villeSlug],
    queryFn: async () => {
      const baseQuery = (supabase as unknown as SupabaseSansSchema)
        .from("installation_pages")
        .select("*")
        .eq("profession_slug", professionSlug)
        .eq("ville_slug", villeSlug)
        .maybeSingle();

      const villeQuery = (supabase as unknown as SupabaseSansSchema)
        .from("installation_content_ville")
        .select("ville_slug, cabinet_details_md, quartier_md, acces_md")
        .eq("ville_slug", villeSlug)
        .maybeSingle();

      const professionQuery = (supabase as unknown as SupabaseSansSchema)
        .from("installation_content_profession")
        .select("profession_slug, enjeux_md, patientele_md, pourquoi_idn_md")
        .eq("profession_slug", professionSlug)
        .maybeSingle();

      const commonQuery = (supabase as unknown as SupabaseSansSchema)
        .from("installation_content_common")
        .select("content_key, content_md, titre_section, ordre, actif")
        .eq("actif", true)
        .order("ordre", { ascending: true });

      const [baseRes, villeRes, professionRes, commonRes] = await Promise.all([
        baseQuery,
        villeQuery,
        professionQuery,
        commonQuery,
      ]);

      if (baseRes.error) throw baseRes.error;
      const base = baseRes.data as InstallationPage | null;
      if (!base) return null;

      let contenuVille: InstallationContentVille | null = null;
      if (villeRes.error) {
        console.error("[useInstallationPage] ville fetch error", villeRes.error);
      } else {
        contenuVille = (villeRes.data ?? null) as InstallationContentVille | null;
      }

      let contenuProfession: InstallationContentProfession | null = null;
      if (professionRes.error) {
        console.error("[useInstallationPage] profession fetch error", professionRes.error);
      } else {
        contenuProfession = (professionRes.data ?? null) as InstallationContentProfession | null;
      }

      let contenuCommun: InstallationContentCommon[] | null = null;
      if (commonRes.error) {
        console.error("[useInstallationPage] common fetch error", commonRes.error);
      } else {
        contenuCommun = (commonRes.data ?? []) as InstallationContentCommon[];
      }

      return {
        ...base,
        contenuVille,
        contenuProfession,
        contenuCommun,
      };
    },
    enabled: !!professionSlug && !!villeSlug,
  });
}