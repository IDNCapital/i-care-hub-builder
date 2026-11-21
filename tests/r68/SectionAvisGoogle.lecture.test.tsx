// @vitest-environment jsdom
import { act, StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { SectionAvisGoogle } from "../../src/components/avis/SectionAvisGoogle";

const sdk = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: sdk }));

const A = "LIEU_FICTIF_A", B = "LIEU_FICTIF_B";
const projection = "place_id,rating,user_ratings_total,google_display_name,last_updated_at,google_url,reviews";
const lien = (id: string) => "https://www.google.com/maps/search/?api=1&query=fixture&query_place_id=" + id;
const avis = (text: string, jour = 1) => ({
  author: null, profile_photo_url: null, text, rating: 5,
  published_at: "2026-11-" + String(jour).padStart(2, "0") + "T12:00:00Z",
});
const ligne = (id = A, champs = {}) => ({
  place_id: id, rating: 4.5, user_ratings_total: 9, reviews: [avis("Texte de test " + id)],
  google_display_name: null, last_updated_at: "2026-11-20T01:00:00Z", google_url: lien(id), ...champs,
});
const recu = (data: unknown) => ({ status: 200, data, error: null });
const lectures: { lieu: string; signal?: AbortSignal; rendre: (value: unknown) => void }[] = [];
let conteneur: HTMLDivElement, racine: Root;
const texte = () => conteneur.textContent ?? "";
const href = () => conteneur.querySelector("a")?.getAttribute("href") ?? null;

async function monter(id: string | null = A, props = {}, strict = false) {
  const section = <SectionAvisGoogle placeId={id} nomPourLien="Lieu fictif" {...props} />;
  await act(async () => racine.render(strict ? <StrictMode>{section}</StrictMode> : section));
}
async function rendre(value: unknown, index = lectures.length - 1) {
  await act(async () => lectures[index].rendre(value));
}
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-21T12:00:00Z"));
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("fetch", vi.fn(() => { throw Error("Transport externe fermé"); }));
  lectures.length = 0;
  sdk.from.mockReset().mockImplementation((table: string) => {
    expect(table).toBe("avis_google_cache");
    let lieu: string, signal: AbortSignal | undefined;
    const requete = {
      select(champs: string) { expect(champs).toBe(projection); return requete; },
      eq(cle: string, valeur: string) { expect(cle).toBe("place_id"); lieu = valeur; return requete; },
      abortSignal(valeur: AbortSignal) { signal = valeur; return requete; },
      maybeSingle() { return new Promise(resolve => lectures.push({ lieu, signal, rendre: resolve })); },
    };
    return requete;
  });
  conteneur = document.createElement("div");
  document.body.appendChild(conteneur);
  racine = createRoot(conteneur);
});
afterEach(async () => {
  await act(async () => racine.unmount());
  expect(fetch).not.toHaveBeenCalled();
  conteneur.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

it.each([null, "", "  "])("une fiche sans lieu %j ne lit rien", async id => {
  await monter(id); expect(texte()).toBe(""); expect(sdk.from).not.toHaveBeenCalled();
});
it("publie le reçu du seul lieu lu, sans aucune identité d’auteur ni photo dans les fixtures", async () => {
  await monter();
  expect(texte()).toContain("Chargement");
  expect(lectures.map(r => r.lieu)).toEqual([A]);
  expect(lectures[0].signal?.aborted).toBe(false);
  await rendre(recu(ligne()));
  expect(texte()).toContain("4,5");
  expect(texte()).toContain("9 avis Google");
  expect(texte()).toContain("Anonyme");
  expect(texte()).toContain("Mis à jour le");
  expect(conteneur.querySelector("img")).toBeNull();
  expect(href()).toBe(lien(A));
  expect(conteneur.querySelector("a")?.rel).toBe("noopener noreferrer");
  expect(lectures[0].signal?.aborted).toBe(true);
  await monter(A, { lang: "en" });
  expect(texte()).toContain("Anonymous");
  expect(texte()).toContain("9 Google reviews");
  expect(lectures).toHaveLength(1);
});
it.each([
  ["ligne absente", null], ["note absente", ligne(A, { rating: null })],
])("masque une absence confirmée de couverture (%s)", async (_label, data) => {
  await monter(); await rendre(recu(data)); expect(texte()).toBe("");
});
it.each([
  ["lieu différent", ligne(B)], ["total négatif", ligne(A, { user_ratings_total: -1 })],
  ["total fractionnaire", ligne(A, { user_ratings_total: 1.5 })], ["note hors échelle", ligne(A, { rating: 6 })],
  ["avis mal formé", ligne(A, { reviews: [false] })], ["avis sans forme de liste", ligne(A, { reviews: {} })],
])("ne publie aucun contenu d’une ligne non recevable (%s)", async (_label, data) => {
  await monter(); await rendre(recu(data));
  expect(texte()).toContain("indisponibles"); expect(href()).toBeNull();
  expect(conteneur.querySelector("section")).toBeNull();
});
it("distingue total inconnu, total zéro et extraits sans texte exploitable", async () => {
  await monter();
  await rendre(recu(ligne(A, { user_ratings_total: null, reviews: [avis("  ")] })));
  expect(texte()).toContain("Nombre d'avis Google non disponible");
  expect(texte()).not.toContain("Anonyme");
  await monter(A, { exigerAuMoinsUnAvis: true }); expect(texte()).toBe("");
  await monter(B);
  await rendre(recu(ligne(B, { user_ratings_total: 0, reviews: [] })));
  expect(texte()).toContain("0 avis Google");
  expect(lectures.map(r => r.lieu)).toEqual([A, B]);
});
it("affiche au plus les trois extraits les plus récents, conserve le total reçu et l’anonymat", async () => {
  await monter(A, { exigerAuMoinsUnAvis: true });
  await rendre(recu(ligne(A, { reviews: [avis("alpha", 1), avis("delta", 4), avis("beta", 2), { ...avis("gamma", 3), author: "   " }] })));
  expect(Array.from(conteneur.querySelectorAll("section p"), p => p.textContent)).toEqual(["delta", "gamma", "beta"]);
  expect(texte().match(/Anonyme/g)).toHaveLength(3);
  expect(texte()).toContain("9 avis Google");
});
it.each([
  null, "https://example.invalid/faux", "https://www.google.com/accounts/fixture",
  lien(B), lien(A) + "&place_id=" + B, "https://maps.google.com/?q=place_id:" + B,
  "https://www.google.com/maps/dir/?api=1&destination_place_id=" + B,
  lien(A) + "&destination_place_id=" + B,
])("garde l’avis et retire le lien absent ou incompatible %j", async google_url => {
  await monter(); await rendre(recu(ligne(A, { google_url })));
  expect(texte()).toContain("Texte de test " + A);
  expect(texte()).toContain("Lien Google indisponible pour ce lieu");
  expect(href()).toBeNull();
});
it.each([
  "https://maps.google.com/?q=place_id%3ALIEU_FICTIF_A",
  "https://maps.google.com/?cid=000000000000000000",
  "https://maps.app.goo.gl/LIEN_FICTIF_A",
])("conserve à l’octet l’URL fournie par le cache de ce lieu %s", async google_url => {
  await monter(); await rendre(recu(ligne(A, { google_url })));
  expect(href()).toBe(google_url); expect(lectures).toHaveLength(1);
});
it("retire le contenu de A dès la sélection de B et ignore une réponse antérieure", async () => {
  await monter(A, {}, true);
  const dernierA = lectures.length - 1;
  expect(dernierA).toBeGreaterThan(0);
  await rendre(recu(ligne(A)), dernierA);
  expect(href()).toBe(lien(A));
  await monter(B, {}, true);
  expect(texte()).not.toContain(A); expect(href()).toBeNull();
  await rendre(recu(ligne(B)));
  await rendre(recu(ligne(A)), 0);
  expect(texte()).not.toContain(A); expect(href()).toBe(lien(B));
});
it("après un résultat non confirmé, rend la reprise à l’utilisateur", async () => {
  await monter();
  await rendre({ status: 200, data: ligne(), error: { message: "Reçu fictif incomplet" } });
  expect(texte()).toContain("indisponibles"); expect(href()).toBeNull();
  expect(lectures).toHaveLength(1);
  await act(async () => conteneur.querySelector("button")!.click());
  expect(lectures.map(r => r.lieu)).toEqual([A, A]);
  await rendre(recu(ligne())); expect(href()).toBe(lien(A));
});
it("interrompt la lecture à 15 secondes et ignore la réponse expirée après reprise", async () => {
  await monter();
  await act(async () => vi.advanceTimersByTime(14999)); expect(texte()).toContain("Chargement");
  await act(async () => vi.advanceTimersByTime(1)); expect(texte()).toContain("dépassé 15 secondes");
  expect(lectures[0].signal?.aborted).toBe(true); expect(lectures).toHaveLength(1);
  await act(async () => conteneur.querySelector("button")!.click());
  await rendre(recu(ligne(A, { reviews: [avis("Nouvelle lecture")] })), 1);
  await rendre(recu(ligne()), 0);
  expect(texte()).toContain("Nouvelle lecture"); expect(texte()).not.toContain("Texte de test");
});
it("la réponse arrivée à l’échéance avant le callback du minuteur reste expirée", async () => {
  await monter(); vi.setSystemTime(Date.now() + 15000);
  await rendre(recu(ligne()));
  expect(texte()).toContain("dépassé 15 secondes"); expect(href()).toBeNull();
});
