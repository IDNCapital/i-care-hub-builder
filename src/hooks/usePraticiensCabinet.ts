import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PraticienCabinetPublic {
  slug: string;
  prenom: string;
  nom: string;
  profession: string;
  photo_url: string | null;
  specialites: string[];
  problematiques: string[];
  specialites_derivees: string[];
  google_place_id: string | null;
}

type Visit = { cabinetSlug: string | undefined };
type Receipt = { visit: Visit; status: "loading" | "error" } |
  { visit: Visit; status: "ready"; data: PraticienCabinetPublic[] };
const PAGE_SIZE = 200;
const MAX_PAGES = 50;
const MAX_ROWS = 10000;

function receivedRow(value: unknown): value is PraticienCabinetPublic {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const row = value as Record<string, unknown>;
  return typeof row.slug === "string" && row.slug.trim().length > 0 &&
    ["prenom", "nom", "profession"].every(k => typeof row[k] === "string") &&
    ["photo_url", "google_place_id"].every(k => row[k] === null || typeof row[k] === "string") &&
    ["specialites", "problematiques", "specialites_derivees"].every(k =>
      Array.isArray(row[k]) && row[k].every(value => typeof value === "string"));
}

async function readCabinet(cabinetSlug: string, current: () => boolean) {
  const all: PraticienCabinetPublic[] = [];
  const slugs = new Set<string>();
  let expected: number | null = null;
  for (let page = 0; page < MAX_PAGES; page++) {
    if (!current()) return null;
    const { data, error, count } = await supabase
      .from("praticiens")
      .select("slug, prenom, nom, profession, photo_url, specialites, problematiques, specialites_derivees, google_place_id", { count: "exact" })
      .eq("cabinet_slug", cabinetSlug)
      .eq("statut_validation", "validee")
      .eq("actif", true)
      .order("nom", { ascending: true })
      .order("slug", { ascending: true })
      .range(all.length, all.length + PAGE_SIZE - 1);
    if (!current()) return null;
    if (error || !Array.isArray(data) || !Number.isSafeInteger(count) ||
        count < 0 || count > MAX_ROWS || data.length > PAGE_SIZE) throw new Error("Receipt unknown");
    if (expected !== null && count !== expected) throw new Error("Receipt changed");
    expected = count;
    for (const value of data as unknown[]) {
      if (!receivedRow(value) || slugs.has(value.slug)) throw new Error("Receipt invalid");
      slugs.add(value.slug);
      all.push(value);
    }
    if (all.length > count) throw new Error("Receipt inconsistent");
    if (all.length === count) return all;
    if (data.length === 0) throw new Error("Receipt incomplete");
  }
  throw new Error("Receipt limit");
}

/** Collection publiée entière du cabinet courant, avec reprise explicite.
 * Le slug UNIQUE départage les noms égaux. Un compte stable ne constitue
 * pas un instantané transactionnel ; aucune page partielle n'est publiée. */
export function usePraticiensCabinet(cabinetSlug: string | undefined) {
  const visit = useMemo<Visit>(() => ({ cabinetSlug }), [cabinetSlug]);
  const currentVisit = useRef(visit);
  currentVisit.current = visit;
  const activeVisit = useRef<Visit | null>(null);
  const generation = useRef(0);
  const [receipt, setReceipt] = useState<Receipt>({ visit, status: "loading" });

  const retry = useCallback(async () => {
    if (currentVisit.current !== visit || activeVisit.current !== visit) return;
    const attempt = ++generation.current;
    const current = () => currentVisit.current === visit && activeVisit.current === visit && generation.current === attempt;
    setReceipt({ visit, status: "loading" });
    try {
      const slug = visit.cabinetSlug;
      if (typeof slug !== "string" || slug.trim().length === 0) throw new Error("Cabinet unknown");
      const data = await readCabinet(slug, current);
      if (data && current()) setReceipt({ visit, status: "ready", data });
    } catch {
      if (current()) setReceipt({ visit, status: "error" });
    }
  }, [visit]);
  const cancel = useCallback(() => {
    if (activeVisit.current === visit) { activeVisit.current = null; ++generation.current; }
  }, [visit]);
  useEffect(() => {
    activeVisit.current = visit;
    void retry();
    return cancel;
  }, [visit, retry, cancel]);

  // L'identité de visite change aussi lors d'un retour A/B/A : un ancien
  // reçu A ne peut pas réapparaître au premier rendu du nouveau A.
  const current = receipt.visit === visit ? receipt : null;
  return {
    data: current?.status === "ready" ? current.data : [],
    loading: !current || current.status === "loading",
    error: current?.status === "error",
    retry,
  };
}
