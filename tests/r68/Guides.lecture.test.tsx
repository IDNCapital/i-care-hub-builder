import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { afterEach, beforeAll, beforeEach, expect, it, vi } from "vitest";
import ProblematiquesIndex from "@/pages/ProblematiquesIndex";
import ProblematiqueDetail from "@/pages/ProblematiqueDetail";

type Table = "problematiques" | "praticiens" | "articles";
type Appel = { table: Table; head: boolean; debut: number; url: URL; signal: AbortSignal; prefer: string | null };
const tables: Table[] = ["problematiques", "praticiens", "articles"];
const port = vi.hoisted(() => ({ from: null as null | ((table: Table) => unknown) }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from: (table: Table) => port.from!(table) } }));
vi.mock("@/components/Layout", () => ({ Layout: ({ children }: { children: ReactNode }) => <main>{children}</main> }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ i18n: { language: "fr" }, t: (key: string) => key }) }));
const guide = (slug: string, nom: string) => ({ slug, nom, description_courte: "Description de " + nom, description_longue: null, synonymes: [] });
const praticien = { slug: "soin", prenom: "Profil", nom: "Synthétique", profession: "Relaxologue", cabinet_slug: "cabinet",
  photo_url: null, specialites: [], specialites_derivees: [], problematiques_derivees: [], problematiques_manuelles: [],
  problematiques: ["Stress", "Sommeil"], publics_derives: [] };
const article = (slug: string) => ({ slug, titre: "Conseil " + slug, chapo: "Résumé", published_at: null });
const reponse = (lignes: unknown, count?: number, status = 200) => new Response(lignes === null ? null : JSON.stringify(lignes), {
  status, headers: count === undefined ? {} : { "content-range": "*/" + count, "content-type": "application/json" },
});
const differe = () => {
  let resoudre!: (r: Response) => void;
  const attente = new Promise<Response>(r => { resoudre = r; });
  return { attente, resoudre };
};
let repondre: (q: Appel) => Promise<Response> | Response;
let observations: Appel[];
let donnees: Record<Table, Record<string, unknown>[]>;
let racine: Root;
let host: HTMLElement;
const appels = (table: Table) => observations.filter(q => q.table === table);
function normale(q: Appel) {
  const liste = donnees[q.table];
  return reponse(q.head ? null : liste.slice(q.debut, q.debut + 200), liste.length);
}
beforeAll(() => {
  const client = createClient("https://guides.invalid", "recette", { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: {
    fetch: async (input, init) => {
      const url = new URL(String(input));
      const table = tables.find(t => url.pathname === "/rest/v1/" + t);
      if (!table || url.origin !== "https://guides.invalid" || !["GET", "HEAD"].includes(init?.method ?? "GET") || init?.body || !init?.signal) throw Error("Transport inattendu");
      const q = { table, head: init.method === "HEAD", debut: Number(url.searchParams.get("offset")), url, signal: init.signal, prefer: new Headers(init.headers).get("prefer") };
      observations.push(q);
      return repondre(q);
    },
  } });
  port.from = table => client.from(table);
});
beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("fetch", vi.fn(() => { throw Error("Transport non autorisé"); }));
  vi.useFakeTimers(); observations = []; repondre = normale;
  donnees = { problematiques: [guide("stress", "Stress"), guide("sommeil", "Sommeil"), guide("parentalite","Parentalité")],
    praticiens: [praticien], articles: [article("initial")] };
  host = document.createElement("div"); document.body.append(host); racine = createRoot(host);
});
afterEach(async () => {
  await act(async () => racine.unmount()); host.remove(); document.head.replaceChildren();
  expect(fetch).not.toHaveBeenCalled(); vi.unstubAllGlobals(); vi.useRealTimers();
});
const routes = "/patients/problematiques";
function Navigation() {
  const aller = useNavigate();
  return <><button onClick={() => aller(routes + "/sommeil")}>Visiter sommeil</button>
    <button onClick={() => aller("/ailleurs")}>Quitter le guide</button>
    <Routes><Route path={routes} element={<ProblematiquesIndex />} /><Route path={routes + "/:slug"} element={<ProblematiqueDetail />} />
      <Route path="/ailleurs" element={<p>Autre rubrique</p>} /></Routes></>;
}
async function visiter(slug = "") {
  await act(async () => { racine.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }} initialEntries={[routes + (slug ? "/" + slug : "")]}><Navigation /></MemoryRouter>); });
}
async function cliquer(titre: string) {
  const bouton = [...host.querySelectorAll("button")].find(b => b.textContent?.includes(titre));
  expect(bouton).toBeDefined(); await act(async () => { bouton!.click(); });
}
const marqueur = () => host.querySelector("[data-problematiques-publiees]")?.getAttribute("data-problematiques-publiees");
const cartes = () => host.querySelectorAll('a[href^="/praticien/"]');
const texte = () => host.textContent ?? "";
it("liste seulement les guides associés après réception des praticiens et taxonomies actifs", async () => {
  const fin = differe();
  repondre = q => q.table === "problematiques" && q.head ? fin.attente : normale(q);
  await visiter();
  expect(marqueur()).toBeUndefined(); expect(host.querySelector("script")).toBeNull();
  expect(host.querySelector('a[href*="/problematiques/stress"]')).toBeNull();
  await act(async () => { fin.resoudre(reponse(null, 3)); });
  expect(marqueur()).toBe("2");
  expect(host.querySelector('a[href*="/problematiques/stress"]')).not.toBeNull();
  expect(host.querySelector('a[href*="/problematiques/parentalite"]')).toBeNull();
  for (const q of appels("problematiques")) {
    expect(q.url.searchParams.get("actif")).toBe("eq.true");
    expect(q.url.searchParams.get("select")).toBe("slug,nom,description_courte,description_longue,synonymes");
    expect(q.url.searchParams.get("order")).toBe("nom.asc,slug.asc"); expect(q.prefer).toBe("count=exact");
  }
  expect(appels("articles")).toEqual([]);
});
it.each(["problematiques", "praticiens"] as Table[])("reprend seulement %s après un échec de l’index", async table => {
  repondre = q => q.table === table ? reponse({ message: "Indisponible" }, undefined, 403) : normale(q);
  await visiter();
  expect(host.querySelector('[role="alert"]')).not.toBeNull(); expect(marqueur()).toBeUndefined();
  const autre = table === "problematiques" ? "praticiens" : "problematiques";
  const nombre = appels(autre).length; repondre = normale; await cliquer("Réessayer");
  expect(marqueur()).toBe("2"); expect(appels(autre)).toHaveLength(nombre);
});
it("confirme un index réellement vide", async () => {
  donnees.praticiens = []; await visiter();
  expect(marqueur()).toBe("0"); expect(host.querySelector('[role="alert"]')).toBeNull();
});
it("lit uniquement les articles publiés associés au slug du guide, sur toutes les tranches", async () => {
  donnees.articles = Array.from({ length: 201 }, (_, i) => article("article-" + i)); await visiter("stress");
  expect(host.querySelector('a[href="/patients/articles/article-200"]')).not.toBeNull(); expect(cartes()).toHaveLength(1);
  expect(appels("articles").map(q => [q.head, q.debut])).toEqual([[false, 0], [false, 200], [true, 0]]);
  for (const q of appels("articles")) {
    expect(q.url.searchParams.get("statut")).toBe("eq.publie");
    expect(q.url.searchParams.get("problematiques_associees")).toBe("cs.{stress}");
    expect(q.url.searchParams.get("select")).toBe("slug,titre,chapo,published_at");
    expect(q.url.searchParams.get("order")).toBe("published_at.desc,slug.asc");
  }
});
it.each(["refus", "fin absente", "doublon", "données incomplètes", "délai"])("une lecture d’articles en échec laisse le guide et ses praticiens disponibles (%s)", async cause => {
  const lent = differe();
  repondre = q => {
    if (q.table !== "articles") return normale(q);
    if (cause === "délai") return lent.attente;
    if (cause === "refus") return reponse({ message: "non reçu" }, undefined, 403);
    if (cause === "fin absente") return q.head ? reponse(null) : normale(q);
    if (cause === "doublon") return reponse([article("a"), article("a")], 2);
    return reponse([{ ...article("a"), chapo: 12 }], 1);
  };
  await visiter("stress");
  if (cause === "délai") await act(async () => { await vi.advanceTimersByTimeAsync(15000); });
  expect(texte()).toContain("articles liés à cette problématique sont indisponibles");
  expect(cartes()).toHaveLength(1);
  expect(host.querySelector('a[href^="/patients/articles/"]')).toBeNull();
  const n = appels("praticiens").length + appels("problematiques").length;
  repondre = normale; await cliquer("Réessayer les articles");
  expect(texte()).toContain("Conseil initial");
  expect(appels("praticiens").length + appels("problematiques").length).toBe(n);
  if (cause === "délai") await act(async () => { lent.resoudre(reponse([article("tardif")], 1)); });
  expect(texte()).not.toContain("Conseil tardif");
});
it("ne rend ni les cartes ni les articles de la fiche précédente après navigation", async () => {
  await visiter("stress"); expect(texte()).toContain("Conseil initial");
  donnees.articles = [article("sommeil")];
  const fin = differe(); repondre = q => q.table === "problematiques" && q.head ? fin.attente : normale(q);
  await cliquer("Visiter sommeil");
  expect(texte()).not.toContain("Conseil initial"); expect(cartes()).toHaveLength(0);
  expect(host.querySelector('script[type="application/ld+json"]')).toBeNull(); expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  await act(async () => { fin.resoudre(reponse(null, 3)); });
  expect(texte()).toContain("Conseil sommeil"); expect(document.title).toContain("Sommeil");
});
it("distingue un guide absent d’un refus connu pendant l’attente", async () => {
  const attente = differe();
  repondre = q => q.table === "problematiques" ? reponse({ message: "indisponible" }, undefined, 403) :
    q.table === "praticiens" ? attente.attente : normale(q);
  await visiter("inconnu");
  expect(texte()).toContain("indisponible"); expect(texte()).not.toContain("404");
  repondre = normale; await cliquer("Réessayer"); await act(async () => { attente.resoudre(reponse([praticien], 1)); });
  expect(texte()).toContain("404");
});
it("retire la tête prérendue au départ avant réception du guide", async () => {
  document.head.innerHTML = '<title>Guide Stress</title><link rel="canonical" href="https://i-ca.re/patients/problematiques/stress/"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex, noarchive">';
  repondre = () => new Promise(() => {});
  await visiter("stress"); expect(document.title).toBe("Guide Stress");
  await cliquer("Quitter le guide");
  expect(document.title).not.toBe("Guide Stress"); expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  expect(document.head.querySelector('meta[name="viewport"]')).not.toBeNull();
  expect(document.head.querySelector('meta[name="robots"][content="noindex, noarchive"]')).not.toBeNull();
});
it("valide les titres libres au prérendu sans changer les données structurées", async () => {
  donnees.problematiques[0] = { ...guide("stress", "Stress <test>"), synonymes: ["Stress"] };
  await visiter("stress");
  const contenu = host.querySelector('script[type="application/ld+json"]')!.textContent!;
  expect(contenu).not.toContain("<"); expect(JSON.parse(contenu)["@graph"][1].name).toBe("Stress <test>");
  expect(host.querySelector("h1")?.textContent).toBe("Stress <test>");
});

it("reprend les balises du guide confirmé sur le même document prérendu", async () => {
  document.head.innerHTML = '<title>Guide précédent</title><meta name="description" content="Ancienne"><link rel="canonical" href="https://i-ca.re/patients/problematiques/stress/"><meta name="robots" content="noindex, nofollow">';
  await visiter("stress");
  expect(document.head.querySelectorAll("title")).toHaveLength(1);
  expect(document.title).toContain("Stress");
  expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
  expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
  expect(document.head.querySelector('meta[name="robots"][content="noindex, nofollow"]')).toBeNull();
});
