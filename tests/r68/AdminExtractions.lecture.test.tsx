// @vitest-environment jsdom
import { act, StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import AdminExtractions from "../../src/pages/admin/AdminExtractions";

const ports = vi.hoisted(() => ({ invoke: vi.fn(), erreur: vi.fn(), succes: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { functions: { invoke: ports.invoke } } }));
vi.mock("sonner", () => ({ toast: { error: ports.erreur, success: ports.succes } }));

const praticien = (id = "fixture-1") => ({
  id, slug: id, prenom: "Camille", nom: id, profession: "Profession de test", cabinet_slug: "cabinet-test",
  tags_extraction_status: "error", tags_extracted_at: "2026-11-20T09:00:00Z",
  tags_extraction_log: [{ status: "error", reason: "Source fictive" }],
});
type Reponse = { data: unknown; error: unknown };
const reponse = (data: unknown): Reponse => ({ data, error: null });
const lectures: (() => Promise<Reponse>)[] = [];
const noms: string[] = [];
let host: HTMLDivElement, racine: Root | null;
function session(valeur: string) {
  localStorage.setItem("icare_admin_token", JSON.stringify({ token: valeur, exp: Date.now() / 1000 + 3600 }));
}
function suspendue() {
  let rendre!: (r: Reponse) => void;
  const attente = new Promise<Reponse>(resolve => { rendre = resolve; });
  lectures.push(() => attente);
  return rendre;
}
async function monter(strict = false) {
  const vue = <MemoryRouter initialEntries={["/admin/extractions"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes><Route path="/admin/extractions" element={<AdminExtractions />} /><Route path="/admin/login" element={<p>Connexion de test</p>} /></Routes>
  </MemoryRouter>;
  await act(async () => racine!.render(strict ? <StrictMode>{vue}</StrictMode> : vue));
}
async function clic(libelle: string) {
  const bouton = Array.from(host.querySelectorAll("button")).find(el => el.textContent?.trim() === libelle);
  expect(bouton?.disabled).toBe(false);
  await act(async () => bouton!.click());
}
const texte = () => host.textContent ?? "";
const alerte = () => host.querySelector('[role="alert"]')?.textContent ?? "";

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("fetch", vi.fn(() => { throw Error("Transport fermé"); }));
  lectures.length = 0; noms.length = 0;
  ports.invoke.mockReset().mockImplementation((name: string, options: { body: unknown; headers: Record<string, string> }) => {
    noms.push(name);
    if (name !== "admin-list-praticiens") throw Error("Action non admise dans ce test de lecture");
    expect(options.body).toEqual({});
    expect(options.headers["x-admin-token"]).toBeTruthy();
    const lire = lectures.shift();
    if (!lire) throw Error("Réponse de test non prévue");
    return lire();
  });
  ports.erreur.mockClear(); ports.succes.mockClear();
  session("visite-de-test-A");
  host = document.createElement("div");
  document.body.appendChild(host);
  racine = createRoot(host);
});
afterEach(async () => {
  if (racine) await act(async () => racine!.unmount());
  host.remove(); localStorage.clear();
  expect(noms.every(n => n === "admin-list-praticiens")).toBe(true);
  expect(ports.succes).not.toHaveBeenCalled();
  expect(fetch).not.toHaveBeenCalled();
  vi.useRealTimers(); vi.unstubAllGlobals();
});

it("distingue une liste validée vide du nombre global de fiches", async () => {
  lectures.push(async () => reponse({ praticiens: [] }));
  await monter();
  expect(texte()).toContain("Erreurs (0)");
  expect(texte()).toContain("Aucune fiche dans cet état.");
  expect(texte()).toContain("Le serveur ne fournit pas de total global.");
  expect(noms).toEqual(["admin-list-praticiens"]);
});

it.each([
  ["liste manquante", {}], ["mauvais type", { praticiens: {} }],
  ["identité répétée", { praticiens: [praticien(), praticien()] }],
  ["statut inconnu", { praticiens: [{ ...praticien(), tags_extraction_status: "indéfini" }] }],
  ["date invalide", { praticiens: [{ ...praticien(), tags_extracted_at: "hier" }] }],
  ["journal de forme objet", { praticiens: [{ ...praticien(), tags_extraction_log: {} }] }],
  ["dernier message booléen", { praticiens: [{ ...praticien(), tags_extraction_log: [false] }] }],
  ["dernier message nul", { praticiens: [{ ...praticien(), tags_extraction_log: [null] }] }],
  ["dernier message illisible", { praticiens: [{ ...praticien(), tags_extraction_log: [{ specialites_count: -1 }] }] }],
  ["erreur applicative", { error: "Réponse indisponible", praticiens: [] }],
])("un retour avec %s garde les compteurs inconnus", async (_nom, data) => {
  lectures.push(async () => reponse(data));
  await monter();
  expect(alerte()).toContain("Impossible de charger");
  expect(texte()).toContain("Erreurs (?)");
  expect(texte()).not.toContain("Aucune fiche dans cet état.");
  expect(texte()).not.toContain("Relancer");
});

it("affiche le nom et le dernier état puis retire la liste pendant un rafraîchissement", async () => {
  lectures.push(async () => reponse({ praticiens: [praticien()] }));
  const terminer = suspendue();
  await monter();
  expect(texte()).toContain("fixture-1");
  expect(texte()).toContain("Source fictive");
  await clic("Rafraîchir");
  expect(texte()).toContain("Erreurs (?)");
  expect(texte()).not.toContain("fixture-1");
  await act(async () => terminer(reponse({ praticiens: [] })));
  expect(texte()).toContain("Erreurs (0)");
});

it("à quinze secondes la lecture passe à inconnu puis la reprise ignore un ancien succès", async () => {
  const tardive = suspendue();
  lectures.push(async () => reponse({ praticiens: [praticien("nouveau")] }));
  await monter();
  await act(async () => vi.advanceTimersByTimeAsync(14999));
  expect(alerte()).toBe("");
  expect(texte()).toContain("Erreurs (?)");
  await act(async () => vi.advanceTimersByTimeAsync(1));
  expect(alerte()).toContain("15 secondes");
  expect(noms).toHaveLength(1);
  await clic("Réessayer la lecture");
  expect(texte()).toContain("nouveau");
  await act(async () => tardive(reponse({ praticiens: [praticien("ancien-reçu")] })));
  expect(texte()).not.toContain("ancien-reçu");
  expect(texte()).toContain("Erreurs (1)");
  expect(noms).toHaveLength(2);
});

it("ne transporte aucune lecture sans session", async () => {
  localStorage.clear();
  await monter();
  expect(texte()).toContain("Connexion de test");
  expect(noms).toEqual([]);
});

it("une réponse de la session précédente ne fournit aucune fiche à la nouvelle session", async () => {
  const tardive = suspendue();
  await monter();
  session("visite-de-test-B");
  await act(async () => tardive(reponse({ praticiens: [praticien()] })));
  expect(alerte()).toContain("Session admin modifiée");
  expect(texte()).not.toContain("fixture-1");
  expect(texte()).toContain("Erreurs (?)");
});

it.each([
  [{ specialites_count: 2 }, "2 spé", "0 pb"],
  [{ problematiques_count: 4 }, "4 pb", "0 spé"],
  [{ specialites_count: 0 }, "0 spé", "0 pb"],
  [{ problematiques_count: 0 }, "0 pb", "0 spé"],
])("le résumé conserve uniquement les compteurs reçus", async (entree, present, absent) => {
  lectures.push(async () => reponse({ praticiens: [{ ...praticien(), tags_extraction_log: [entree] }] }));
  await monter();
  expect(texte()).toContain(String(present));
  expect(texte()).not.toContain(String(absent));
  expect(texte()).toContain("Erreurs (1)");
});

it("un journal vide valide conserve le statut reçu", async () => {
  lectures.push(async () => reponse({ praticiens: [{ ...praticien(), tags_extraction_log: [] }] }));
  await monter();
  expect(texte()).toContain("Erreurs (1)");
  expect(alerte()).toBe("");
});

it.each(["focus", "storage", "navigation de la fiche"])("retire l’ancien extrait sur %s si la session a changé", async evenement => {
  lectures.push(async () => reponse({ praticiens: [praticien()] }));
  await monter();
  expect(texte()).toContain("fixture-1");
  session("visite-de-test-B");
  if (evenement === "navigation de la fiche") await clic("Voir fiche");
  else await act(async () => { window.dispatchEvent(new Event(evenement)); });
  expect(alerte()).toContain("Session admin modifiée");
  expect(texte()).not.toContain("fixture-1");
  expect(noms).toEqual(["admin-list-praticiens"]);
});

it("ignore un échec tardif après démontage sans notifier ni réessayer", async () => {
  const tardive = suspendue();
  await monter();
  await act(async () => racine!.unmount());
  racine = null;
  await act(async () => tardive({ data: null, error: { message: "Indisponible" } }));
  expect(ports.erreur).not.toHaveBeenCalled();
  expect(noms).toHaveLength(1);
});

it("en mode strict seule la visite active peut recevoir la liste", async () => {
  lectures.push(async () => reponse({ praticiens: [praticien()] }));
  await monter(true);
  expect(texte()).toContain("Erreurs (1)");
  expect(texte()).toContain("fixture-1");
  expect(noms).toEqual(["admin-list-praticiens"]);
});
