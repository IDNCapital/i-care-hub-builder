import { createContext, createElement, useContext, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { InstallationContentCommon, InstallationContentProfession, InstallationContentVille } from "@/types/installation";

// Les tables publiques d'installation ne sont pas toutes dans les types générés.
type SupabaseSansSchema = SupabaseClient;
const client = supabase as unknown as SupabaseSansSchema;

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

type Scope = { active: boolean; generations: Map<string, number> };
const LectureContext = createContext<Scope | null>(null);

/** Une visite partage ses références avec le formulaire, jamais avec une visite précédente. */
export function InstallationLecture({ visite, children }: { visite: string; children: ReactNode }) {
  const courant = useRef<{ visite: string; scope: Scope; client: QueryClient } | null>(null);
  if (!courant.current || courant.current.visite !== visite) {
    if (courant.current) courant.current.scope.active = false;
    courant.current = { visite, scope: { active: true, generations: new Map() }, client: new QueryClient({ defaultOptions: { queries: {
      retry: false, staleTime: Infinity, refetchOnWindowFocus: false, refetchOnReconnect: false,
    } } }) };
  }
  const { scope, client: queryClient } = courant.current;
  useLayoutEffect(() => {
    scope.active = true;
    return () => { scope.active = false; void queryClient.cancelQueries(); queryClient.clear(); };
  }, [queryClient, scope]);
  return createElement(LectureContext.Provider, { value: scope },
    createElement(QueryClientProvider, { client: queryClient, key: visite }, children));
}

type Reponse = { data: unknown; error: unknown; count: number | null; status: number };
type Liste = PromiseLike<Reponse> & { range: (from: number, to: number) => Liste; abortSignal: (signal: AbortSignal) => Liste };
type Garde = () => void;
const PAGE = 200;
const LIMITE = 5000;
const objet = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const texte = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const nullable = (v: unknown) => v === null || typeof v === "string";
const nombre = (v: unknown) => typeof v === "number" && Number.isFinite(v);
const invalide = () => new Error("Lecture publique incomplète ou incohérente");

async function listeComplete<T>(make: (head: boolean) => Liste, identite: (row: unknown) => string | null, garde: Garde, signal: AbortSignal): Promise<T[]> {
  const rows: T[] = [];
  const ids = new Set<string>();
  let total: number | undefined;
  let pages = 0;
  do {
    if (++pages > 100) throw invalide();
    garde();
    const res = await make(false).range(rows.length, rows.length + PAGE - 1).abortSignal(signal);
    garde();
    if (res.error !== null) throw res.error ?? invalide();
    if (![200, 206].includes(res.status) || !Array.isArray(res.data) || !Number.isInteger(res.count) || res.count! < 0 || res.count! > LIMITE) throw invalide();
    total ??= res.count!;
    if (total !== res.count || res.data.length > Math.min(PAGE, total - rows.length) || (rows.length < total && res.data.length === 0) || (total === 0 && res.status !== 200)) throw invalide();
    for (const row of res.data) {
      const id = identite(row);
      if (!id || ids.has(id)) throw invalide();
      ids.add(id);
      rows.push(row as T);
    }
  } while (rows.length < total);
  garde();
  const fin = await make(true).abortSignal(signal);
  garde();
  if (fin.error !== null) throw fin.error ?? invalide();
  if (![200, 206].includes(fin.status) || fin.count !== total || fin.data !== null) throw invalide();
  return rows;
}

async function unique<T>(query: PromiseLike<Reponse>, valide: (row: unknown) => boolean, garde: Garde): Promise<T | null> {
  garde();
  const res = await query;
  garde();
  if (res.error !== null) throw res.error ?? invalide();
  if (res.status !== 200 || (res.data === null ? res.count !== 0 : res.count !== 1 || !valide(res.data))) throw invalide();
  return res.data as T | null;
}

function useLecture<T>(key: string[], read: (garde: Garde, signal: AbortSignal) => Promise<T>, enabled = true) {
  const scope = useContext(LectureContext);
  const queryClient = useQueryClient();
  const localGenerations = useRef(new Map<string, number>());
  const generations = scope?.generations ?? localGenerations.current;
  const nom = JSON.stringify(key);
  const [reprise, setReprise] = useState(false);
  const query = useQuery({
    queryKey: key, enabled, retry: false,
    queryFn: ({ signal }) => {
      const generation = generations.get(nom) ?? 0;
      const garde = () => {
        if (signal.aborted || scope?.active === false || generation !== (generations.get(nom) ?? 0)) throw new Error("Lecture remplacée");
      };
      garde();
      return read(garde, signal);
    },
  });
  const active = () => scope?.active !== false;
  const retry = async () => {
    if (!active()) return;
    // Invalidation synchrone : une promesse déjà résolue ne peut poursuivre l'ancienne pagination.
    const generation = (generations.get(nom) ?? 0) + 1;
    generations.set(nom, generation);
    setReprise(true);
    await queryClient.cancelQueries({ queryKey: key, exact: true });
    if (!active() || generations.get(nom) !== generation) return;
    try { await query.refetch(); }
    finally { if (active() && generations.get(nom) === generation) setReprise(false); }
  };
  const isLoading = enabled && (query.isPending || query.isFetching || reprise);
  return { ...query, data: isLoading || query.isError ? undefined : query.data, isLoading, isError: !isLoading && query.isError, retry };
}

const projectionProfession = "id, slug, nom_masculin_singulier, nom_feminin_singulier, nom_inclusif_pluriel, ordre_affichage, actif, page_installation";
function professionValide(row: unknown, installation: boolean) {
  return objet(row) && texte(row.id) && texte(row.slug) && texte(row.nom_masculin_singulier) && texte(row.nom_feminin_singulier) && texte(row.nom_inclusif_pluriel) && nombre(row.ordre_affichage) && row.actif === true && typeof row.page_installation === "boolean" && (!installation || row.page_installation) ? row.id : null;
}
function professionsLecture(installation: boolean, garde: Garde, signal: AbortSignal) {
  return listeComplete<Profession>((head) => {
    let q = client.from("professions").select(projectionProfession, { count: "exact", head }).eq("actif", true);
    if (installation) q = q.eq("page_installation", true);
    return q.order("ordre_affichage", { ascending: true }).order("id", { ascending: true });
  }, row => professionValide(row, installation), garde, signal);
}
export function useProfessions() {
  return useLecture(["professions"], (garde, signal) => professionsLecture(false, garde, signal));
}
export function useProfessionsInstallation() {
  return useLecture(["professions", "page_installation"], (garde, signal) => professionsLecture(true, garde, signal));
}

const projectionCabinet = "id, slug, slug_installation, name, city, address, date_ouverture_cible, lat, lng, google_place_id";
function cabinetsLecture(ouverts: false, garde: Garde, signal: AbortSignal): Promise<CabinetPipeline[]>;
function cabinetsLecture(ouverts: true, garde: Garde, signal: AbortSignal): Promise<CabinetInstallation[]>;
function cabinetsLecture(ouverts: boolean, garde: Garde, signal: AbortSignal) {
  const statuts = ouverts ? ["en_travaux", "a_venir", "en_exploitation"] : ["en_travaux", "a_venir"];
  return listeComplete<CabinetInstallation>((head) => client.from("projets")
    .select(projectionCabinet + (ouverts ? ", status" : ""), { count: "exact", head })
    .in("status", statuts).not("slug_installation", "is", null)
    .order("date_ouverture_cible", { ascending: true }).order("id", { ascending: true }), row =>
    objet(row) && texte(row.id) && texte(row.slug) && texte(row.slug_installation) && texte(row.name) && texte(row.city) && nullable(row.address) && nullable(row.date_ouverture_cible) && nullable(row.google_place_id) && (row.lat === null || nombre(row.lat)) && (row.lng === null || nombre(row.lng)) && (!ouverts || statuts.includes(String(row.status))) ? row.id : null, garde, signal);
}
export function useCabinetsPipeline() {
  return useLecture(["cabinets-pipeline"], (garde, signal) => cabinetsLecture(false, garde, signal));
}
/** Un cabinet ouvert conserve ses pages d'installation (décision du 15/10/2026). */
export function useCabinetsInstallation() {
  return useLecture(["cabinets-installation"], (garde, signal) => cabinetsLecture(true, garde, signal));
}

export function useInstallationPage(professionSlug: string, villeSlug: string) {
  const enabled = !!professionSlug && !!villeSlug;
  const base = useLecture(["installation-page", professionSlug, villeSlug], (garde, signal) => unique<InstallationPage>(client.from("installation_pages").select("*", { count: "exact" }).eq("profession_slug", professionSlug).eq("ville_slug", villeSlug).abortSignal(signal).maybeSingle(), row =>
    objet(row) && row.profession_slug === professionSlug && row.ville_slug === villeSlug && row.url_path === `/sinstaller/${professionSlug}/${villeSlug}` && texte(row.profession_libelle) && nombre(row.profession_ordre) && texte(row.projet_id) && texte(row.profession_id) && texte(row.cabinet_nom_complet) && texte(row.cabinet_ville) && nullable(row.cabinet_adresse) && nullable(row.date_ouverture), garde), enabled);
  const ville = useLecture(["installation-ville", villeSlug], (garde, signal) => unique<InstallationContentVille>(client.from("installation_content_ville").select("ville_slug, cabinet_details_md, quartier_md, acces_md", { count: "exact" }).eq("ville_slug", villeSlug).abortSignal(signal).maybeSingle(), row =>
    objet(row) && row.ville_slug === villeSlug && nullable(row.cabinet_details_md) && nullable(row.quartier_md) && nullable(row.acces_md), garde), enabled);
  const profession = useLecture(["installation-profession", professionSlug], (garde, signal) => unique<InstallationContentProfession>(client.from("installation_content_profession").select("profession_slug, enjeux_md, patientele_md, pourquoi_idn_md", { count: "exact" }).eq("profession_slug", professionSlug).abortSignal(signal).maybeSingle(), row =>
    objet(row) && row.profession_slug === professionSlug && nullable(row.enjeux_md) && nullable(row.patientele_md) && nullable(row.pourquoi_idn_md), garde), enabled);
  const commun = useLecture(["installation-commun"], (garde, signal) => listeComplete<InstallationContentCommon>(head => client.from("installation_content_common").select("content_key, content_md, titre_section, ordre, actif", { count: "exact", head }).eq("actif", true).order("ordre", { ascending: true }).order("content_key", { ascending: true }), row =>
    objet(row) && texte(row.content_key) && typeof row.content_md === "string" && typeof row.titre_section === "string" && nombre(row.ordre) && row.actif === true ? row.content_key : null, garde, signal), enabled);
  return { ...base, data: base.data ? { ...base.data, contenuVille: ville.data, contenuProfession: profession.data, contenuCommun: commun.data } : null, lectures: { ville, profession, commun } };
}
