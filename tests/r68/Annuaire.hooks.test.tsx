import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { Database } from "../../src/integrations/supabase/types";
import { usePraticiensPublics } from "../../src/hooks/usePraticiensPublics";
import { useSpecialites } from "../../src/hooks/useSpecialites";

type Table = "praticiens" | "specialites";
type Appel = { table: Table; methode: string; params: URLSearchParams; signal: AbortSignal; prefer: string | null };
const tables: Table[] = ["praticiens", "specialites"];
const port = vi.hoisted(() => ({ client: null as SupabaseClient<Database> | null }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from(table: Table) {
    if (!port.client) throw Error("Client de recette absent");
    return port.client.from(table);
  } },
}));

const colonnes = {
  praticiens: "slug,prenom,nom,profession,photo_url,specialites,problematiques,specialites_derivees,problematiques_derivees,problematiques_manuelles,publics_derives,cabinet_slug",
  specialites: "slug,nom,description_courte,description_longue,synonymes,cabinet_slug",
};
function fiche(table: Table, n = 0): Record<string, unknown> {
  const slug = "fiche-" + n;
  if (table === "specialites") return { slug, nom: "Spécialité", description_courte: "Texte", description_longue: null, cabinet_slug: null, synonymes: [] };
  return { slug, prenom: "Prénom", nom: "Nom", profession: "Profession", photo_url: null, cabinet_slug: "cabinet",
    specialites: [], problematiques: [], specialites_derivees: [], problematiques_derivees: [],
    problematiques_manuelles: [], publics_derives: [] };
}
const recu = (data: unknown, range?: string, status = 200) => new Response(
  data === null ? null : JSON.stringify(data),
  { status, headers: range ? { "content-range": range, "content-type": "application/json" } : { "content-type": "application/json" } },
);
function differe() {
  let resoudre!: (r: Response) => void;
  const attente = new Promise<Response>(resolve => { resoudre = resolve; });
  return { attente, resoudre };
}
let root: Root | undefined;
let host: HTMLElement;
let appels: Appel[];
let reponses: Record<Table, Array<Response | Promise<Response>>>;
function emprunter(table: Table, lecture: ReturnType<typeof usePraticiensPublics> | ReturnType<typeof useSpecialites>) {
  return <section data-table={table}><output>{lecture.loading ? "attente" : lecture.error ? "inconnu" : "connu"}</output>
    <div>{lecture.data.map(ligne => <i key={ligne.slug}>{ligne.slug}</i>)}</div><button onClick={lecture.retry}>Reprendre</button></section>;
}
function Fiches() { return emprunter("praticiens", usePraticiensPublics()); }
function Specialites() { return emprunter("specialites", useSpecialites()); }
async function monter(...choix: Table[]) {
  await act(async () => {
    root = createRoot(host);
    root.render(<>{choix.includes("praticiens") && <Fiches />}{choix.includes("specialites") && <Specialites />}</>);
  });
}
const bloc = (table: Table) => host.querySelector<HTMLElement>(`[data-table="${table}"]`)!;
const etat = (table: Table) => bloc(table).querySelector("output")!.textContent;
const slugs = (table: Table) => [...bloc(table).querySelectorAll("i")].map(e => e.textContent);
async function reprendre(table: Table) { await act(async () => { bloc(table).querySelector("button")!.click(); }); }

beforeAll(() => {
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  const fetchFerme: typeof fetch = async (input, init) => {
    const url = new URL(String(input));
    const table = tables.find(t => url.pathname === "/rest/v1/" + t);
    const methode = init?.method ?? "GET";
    if (url.origin !== "https://recette.invalid" || !table || !["HEAD", "GET"].includes(methode) || init?.body || !init?.signal)
      throw Error("Transport hors périmètre de la recette");
    appels.push({ table, methode, params: url.searchParams, signal: init.signal, prefer: new Headers(init.headers).get("prefer") });
    const reply = reponses[table].shift();
    if (!reply) throw Error("Réponse synthétique manquante");
    return reply;
  };
  port.client = createClient<Database>("https://recette.invalid", "cle-de-recette", {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: fetchFerme },
  });
});
afterAll(() => { port.client = null; });
beforeEach(() => {
  vi.useFakeTimers();
  reponses = { praticiens: [], specialites: [] }; appels = [];
  host = document.createElement("div"); document.body.appendChild(host);
});
afterEach(async () => {
  await act(async () => { root?.unmount(); });
  root = undefined; host.remove(); vi.useRealTimers();
});

describe.each(tables)("lecteur public %s, SDK natif et React", table => {
  it("confirme 201 lignes sur deux tranches et un compte final, sans colonnes internes", async () => {
    reponses[table].push(recu(Array.from({ length: 200 }, (_, i) => fiche(table, i)), "0-199/201", 206),
      recu([fiche(table, 200)], "200-200/201", 206), recu(null, "0-0/201", 206));
    await monter(table);
    expect(etat(table)).toBe("connu");
    expect(slugs(table)).toEqual(Array.from({ length: 201 }, (_, i) => "fiche-" + i));
    expect(appels.map(a => [a.methode, a.params.get("offset"), a.params.get("limit")]))
      .toEqual([["GET", "0", "200"], ["GET", "200", "200"], ["HEAD", null, null]]);
    for (const a of appels) {
      expect(a.table).toBe(table);
      expect(a.params.get("select")).toBe(colonnes[table]);
      expect(a.params.get("actif")).toBe("eq.true");
      expect(a.params.get("statut_validation")).toBe(table === "praticiens" ? "eq.validee" : null);
      expect(a.params.get("order")).toBe("nom.asc,slug.asc");
      expect(a.prefer).toContain("count=exact");
      expect(a.signal.aborted).toBe(true);
    }
  });
  it("publie un vrai zéro après le compte final", async () => {
    reponses[table].push(recu([], "*/0"), recu(null, "*/0"));
    await monter(table);
    expect(etat(table)).toBe("connu"); expect(slugs(table)).toEqual([]);
    expect(appels.map(a => a.methode)).toEqual(["GET", "HEAD"]);
  });
  it("prend l’offset réellement lu si le serveur plafonne la tranche", async () => {
    reponses[table].push(recu([fiche(table)], "0-0/2", 206), recu([fiche(table, 1)], "1-1/2", 206), recu(null, "0-0/2", 206));
    await monter(table);
    expect(slugs(table)).toEqual(["fiche-0", "fiche-1"]); expect(appels[1].params.get("offset")).toBe("1");
  });
  it.each([
    ["compte absent", () => [recu([])]],
    ["compte supérieur au plafond", () => [recu([], "*/20001")]],
    ["réponse non tabulaire", () => [recu({ result: [] }, "0-0/1")]],
    ["statut HTTP de refus", () => [recu({ message: "Refus synthétique" }, undefined, 403)]],
    ["arrêt prématuré", () => [recu([fiche(table)], "0-0/2"), recu([], "*/2")]],
    ["double entre pages", () => [recu([fiche(table)], "0-0/2"), recu([fiche(table)], "1-1/2")]],
    ["compte changé entre pages", () => [recu([fiche(table)], "0-0/2"), recu([fiche(table, 1)], "1-1/3")]],
    ["compte final changé", () => [recu([fiche(table)], "0-0/1"), recu(null, "*/0")]],
    ["compte final absent", () => [recu([fiche(table)], "0-0/1"), recu(null)]],
    ["fiche sans identifiant", () => [recu([{ ...fiche(table), slug: " " }], "0-0/1")]],
    ["champ répété de mauvais type", () => [recu([{ ...fiche(table), [table === "praticiens" ? "publics_derives" : "synonymes"]: [5] }], "0-0/1")]],
  ] satisfies Array<[string, () => Response[]]>)("écarte la liste entière si %s", async (_nom, fournir) => {
    reponses[table].push(...fournir()); await monter(table);
    expect(etat(table)).toBe("inconnu"); expect(slugs(table)).toEqual([]);
    expect(appels.every(a => a.signal.aborted)).toBe(true);
  });
  it.each(["GET", "HEAD"])("ferme après 15 s y compris sur %s, ignore le retour tardif après une reprise", async methode => {
    const lent = differe();
    if (methode === "HEAD") reponses[table].push(recu([fiche(table, 52)], "0-0/1"));
    reponses[table].push(lent.attente);
    await monter(table);
    expect(etat(table)).toBe("attente"); expect(slugs(table)).toEqual([]);
    const ancien = appels.at(-1)!;
    expect(ancien.methode).toBe(methode);
    await act(async () => { await vi.advanceTimersByTimeAsync(15000); });
    expect(ancien.signal.aborted).toBe(true); expect(etat(table)).toBe("inconnu");
    reponses[table].push(recu([fiche(table, 9)], "0-0/1"), recu(null, "0-0/1"));
    await reprendre(table);
    expect(etat(table)).toBe("connu"); expect(slugs(table)).toEqual(["fiche-9"]);
    await act(async () => { lent.resoudre(methode === "HEAD" ? recu(null, "0-0/1") : recu([fiche(table, 52)], "0-0/1")); });
    expect(slugs(table)).toEqual(["fiche-9"]);
    expect(appels.at(-1)!.signal).not.toBe(ancien.signal);
  });
  it("partage la même échéance entre la dernière page et la confirmation finale", async () => {
    const page = differe();
    const fin = differe();
    reponses[table].push(page.attente, fin.attente);
    await monter(table);
    await act(async () => { await vi.advanceTimersByTimeAsync(14900); page.resoudre(recu([fiche(table)], "0-0/1")); });
    expect(appels.map(a => a.methode)).toEqual(["GET", "HEAD"]); expect(etat(table)).toBe("attente");
    await act(async () => { await vi.advanceTimersByTimeAsync(100); });
    expect(etat(table)).toBe("inconnu");
    await act(async () => { fin.resoudre(recu(null, "0-0/1")); });
    expect(etat(table)).toBe("inconnu"); expect(slugs(table)).toEqual([]);
  });
  it("garde la borne de 100 pages même si le serveur livre une seule fiche à la fois", async () => {
    for (let i = 0; i < 100; i++) reponses[table].push(recu([fiche(table, i)], i + "-" + i + "/101", 206));
    await monter(table);
    expect(etat(table)).toBe("inconnu"); expect(slugs(table)).toEqual([]);
    expect(appels).toHaveLength(100); expect(appels.at(-1)?.params.get("offset")).toBe("99");
  });
  it("annule au démontage avant la confirmation finale", async () => {
    const lent = differe();
    reponses[table].push(recu([fiche(table)], "0-0/1"), lent.attente); await monter(table);
    expect(etat(table)).toBe("attente"); expect(slugs(table)).toEqual([]);
    await act(async () => { root!.unmount(); root = undefined; });
    expect(appels.at(-1)!.signal.aborted).toBe(true);
    await act(async () => { lent.resoudre(recu(null, "0-0/1")); });
    expect(host.childNodes.length).toBe(0); expect(appels.length).toBe(2);
  });
});
it("reprend uniquement les spécialités, en laissant disponibles les praticiens confirmés", async () => {
  reponses.praticiens.push(recu([fiche("praticiens")], "0-0/1"), recu(null, "0-0/1"));
  reponses.specialites.push(recu([], "*/0"), recu(null));
  await monter(...tables);
  expect(etat("praticiens")).toBe("connu"); expect(etat("specialites")).toBe("inconnu");
  reponses.specialites.push(recu([], "*/0"), recu(null, "*/0")); await reprendre("specialites");
  expect(etat("specialites")).toBe("connu"); expect(slugs("praticiens")).toEqual(["fiche-0"]);
  expect(appels.filter(a => a.table === "praticiens")).toHaveLength(2);
});
