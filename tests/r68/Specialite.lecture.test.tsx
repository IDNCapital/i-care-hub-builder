import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import SpecialiteDetail from "../../src/pages/SpecialiteDetail";
import { pageUrl } from "../../src/lib/siteUrl";

type Table = "specialites" | "praticiens";
type Recu = { data: unknown; count: number | null; error: unknown; status: number };
type Lecture = (table: Table, head: boolean) => Promise<Recu>;

const banc = vi.hoisted(() => ({
  lire: vi.fn<Lecture>(),
}));
vi.mock("@/integrations/supabase/client", () => ({ supabase: {
  from(table: Table) {
    if (table !== "specialites" && table !== "praticiens") throw Error("Source inattendue");
    return {
      select(_cols: string, opts: { head: boolean; count: string }) {
        if (opts.count !== "exact") throw Error("Compte attendu");
        const req = {
          eq: () => req, order: () => req, range: () => req, abortSignal: () => req,
          then: (ok: (value: Recu) => unknown, ko: (error: unknown) => unknown) => banc.lire(table, opts.head).then(ok, ko),
        };
        return req;
      },
    };
  },
} }));
vi.mock("@/components/Layout", () => ({ Layout: ({ children }: { children: ReactNode }) => <main>{children}</main> }));
vi.mock("@/components/ChargementPage", () => ({ ChargementPage: () => <p>Chargement</p> }));
vi.mock("@/pages/NotFound", () => ({ default: () => <p>Spécialité introuvable</p> }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ i18n: { language: "fr" }, t: (s: string) => s }) }));
vi.mock("@/components/patients/CartePraticien", () => ({
  CartePraticien: ({ p }: { p: { slug: string } }) => <a href={`/praticien/${p.slug}`}>{p.slug}</a>,
}));

const specialite = { slug: "psychologue", nom: "Psychologue", description_courte: "Description fictive",
  description_longue: null, synonymes: [], cabinet_slug: null };
const praticien = { slug: "fiche-fictive", prenom: "Prénom", nom: "Exemple", profession: "Psychologue",
  photo_url: null, specialites: ["Psychologue"], problematiques: [], specialites_derivees: [],
  problematiques_derivees: [], problematiques_manuelles: [], publics_derives: [], cabinet_slug: "i-ca-re-nansouty" };

const lignes: Record<Table, unknown[]> = { specialites: [], praticiens: [] };
function succes(table: Table, head: boolean) {
  return Promise.resolve({ data: head ? null : lignes[table], count: lignes[table].length, error: null, status: 200 });
}
const panne = { data: null, error: { message: "Indisponible" }, count: null, status: 503 };
let racine: Root;
let conteneur: HTMLDivElement;
function VersAutre() {
  const navigate = useNavigate();
  return <><button onClick={() => navigate("/patients/specialite/autre")}>Changer de fiche</button>
    <button onClick={() => navigate("/patients")}>Quitter</button></>;
}
async function visiter(slug = "psychologue") {
  await act(async () => racine.render(<MemoryRouter initialEntries={[`/patients/specialite/${slug}`]}>
    <VersAutre /><Routes><Route path="/patients/specialite/:slug" element={<SpecialiteDetail />} /><Route path="/patients" element={<p>Annuaire</p>} /></Routes>
  </MemoryRouter>));
}
function texte() { return conteneur.textContent ?? ""; }
function profil() { return conteneur.querySelector('a[href^="/praticien/"]'); }
function canonique() { return document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href; }
async function clic(libelle: string) {
  const bouton = Array.from(conteneur.querySelectorAll("button")).find(b => b.textContent === libelle);
  expect(bouton).toBeDefined();
  await act(async () => bouton!.click());
}

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("fetch", vi.fn(() => { throw Error("Transport extérieur inattendu"); }));
  conteneur = document.createElement("div");
  document.body.append(conteneur);
  racine = createRoot(conteneur);
  lignes.specialites = [specialite];
  lignes.praticiens = [praticien];
  banc.lire.mockReset().mockImplementation(succes);
});
afterEach(async () => {
  await act(async () => racine.unmount());
  conteneur.remove();
  document.head.replaceChildren();
  expect(fetch).not.toHaveBeenCalled();
  vi.unstubAllGlobals();
});

it("n'affiche que le profil et les métadonnées reçus pour cette spécialité", async () => {
  document.head.innerHTML = '<title>Accueil</title><meta name="description" content="Accueil"><meta name="viewport" content="initial">';
  await visiter();
  expect(profil()?.getAttribute("href")).toBe("/praticien/fiche-fictive");
  expect(canonique()).toBe(pageUrl("/patients/specialite/psychologue"));
  expect(document.head.querySelectorAll("title")).toHaveLength(1);
  expect(document.title).toContain("Psychologue");
  expect(document.head.querySelector('meta[name="viewport"]')).not.toBeNull();
  expect(conteneur.querySelector('script[type="application/ld+json"]')?.textContent).toContain("ItemList");
});

it("garde le noindex et le parcours de contact pour un zéro confirmé", async () => {
  lignes.praticiens = [];
  await visiter();
  expect(texte()).toContain("Nous n'avons pas encore");
  expect(document.head.querySelector('meta[name="robots"]')?.getAttribute("content")).toContain("noindex");
  expect(profil()).toBeNull();
  expect(conteneur.querySelector('script[type="application/ld+json"]')?.textContent).not.toContain("ItemList");
});
it("la spécialité absente est confirmée par les lecteurs", async () => {
  await visiter("inconnue");
  expect(texte()).toContain("Spécialité introuvable");
  expect(profil()).toBeNull();
});

it.each(["specialites", "praticiens"] as const)("reprend seulement la source défaillante %s", async source => {
  banc.lire.mockImplementation((table, head) => table === source ? Promise.resolve(panne) : succes(table, head));
  document.head.innerHTML = `<title>Ancienne réception</title><link rel="canonical" href="${pageUrl("/patients/specialite/psychologue")}">`;
  await visiter();
  expect(texte()).toContain(source === "specialites" ? "Spécialités indisponibles" : "Praticiens indisponibles");
  expect(texte()).not.toContain("Spécialité introuvable");
  expect(canonique()).toBeUndefined();
  expect(profil()).toBeNull();
  const autreAvant = banc.lire.mock.calls.filter(([t]) => t !== source).length;
  banc.lire.mockImplementation(succes);
  await clic("Réessayer la lecture");
  expect(banc.lire.mock.calls.filter(([t]) => t !== source)).toHaveLength(autreAvant);
  expect(profil()).not.toBeNull();
});

it("retire le profil et le head de A dès la visite B", async () => {
  await visiter();
  expect(profil()).not.toBeNull();
  banc.lire.mockImplementation((table, head) => table === "specialites" ? new Promise(() => {}) : succes(table, head));
  await clic("Changer de fiche");
  expect(texte()).toContain("Chargement");
  expect(profil()).toBeNull();
  expect(canonique()).toBeUndefined();
  expect(conteneur.querySelector("script")).toBeNull();
});

it("signale une panne connue même pendant l’attente de l’autre source", async () => {
  banc.lire.mockImplementation(table => table === "specialites" ? Promise.resolve(panne) : new Promise(() => {}));
  await visiter();
  expect(texte()).toContain("Spécialités indisponibles");
  expect(texte()).not.toContain("Praticiens indisponibles");
  expect(canonique()).toBeUndefined();
});

it("retire le head prérendu de la fiche quittée pendant une attente initiale", async () => {
  document.head.innerHTML = `<title>Fiche initiale</title><link rel="canonical" href="${pageUrl("/patients/specialite/psychologue")}">`;
  banc.lire.mockImplementation(() => new Promise(() => {}));
  await visiter();
  expect(canonique()).toBe(pageUrl("/patients/specialite/psychologue"));
  await clic("Quitter");
  expect(texte()).toContain("Annuaire");
  expect(canonique()).toBeUndefined();
  expect(document.title).not.toContain("Fiche initiale");
});

it("sérialise fidèlement un libellé contenant une comparaison", async () => {
  lignes.specialites = [{ ...specialite, description_courte: "Accompagnement des enfants < 12 ans" }];
  await visiter();
  const script = conteneur.querySelector('script[type="application/ld+json"]')?.textContent;
  expect(script).toBeTruthy();
  expect(script).not.toContain("<");
  const graph: { description?: string }[] = JSON.parse(script!)["@graph"];
  expect(graph.some(item => item.description === "Accompagnement des enfants < 12 ans")).toBe(true);
});
