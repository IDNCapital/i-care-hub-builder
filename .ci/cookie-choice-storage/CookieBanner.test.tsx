import { act, type ComponentType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, useNavigate, type NavigateFunction } from "react-router-dom";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import { beforeEach, afterEach, describe, expect, it, vi, type MockInstance } from "vitest";
import fr from "../../src/locales/fr.json";
import en from "../../src/locales/en.json";
const h = vi.hoisted(() => ({ load: vi.fn(), remove: vi.fn(), pageView: vi.fn(), scrollDepth: vi.fn() }));
vi.mock("@/lib/analytics", () => ({ loadGTM: h.load, removeGTM: h.remove, Analytics: { pageView: h.pageView, scrollDepth: h.scrollDepth } }));
let CookieBanner: ComponentType, useAnalytics: () => void, navigate: NavigateFunction;
function Sonde() { useAnalytics(); navigate = useNavigate(); return null; }

let root: Root | undefined, host: HTMLDivElement, valeur: string | null;
let lire: MockInstance<Storage["getItem"]>, ecrire: MockInstance<Storage["setItem"]>;
const erreurs: unknown[] = [];
function erreur(event: ErrorEvent) { erreurs.push(event.error); event.preventDefault(); }
async function monter(lang: "fr" | "en" = "fr", hook = false) {
  const i18n = createInstance();
  await i18n.init({ lng: lang, fallbackLng: "fr", resources: { fr: { translation: fr }, en: { translation: en } }, interpolation: { escapeValue: false } });
  host = document.createElement("div"); document.body.append(host); root = createRoot(host);
  await act(async () => root!.render(<I18nextProvider i18n={i18n}><MemoryRouter initialEntries={["/depart"]}>{hook ? <Sonde /> : null}<CookieBanner /></MemoryRouter></I18nextProvider>));
}
async function choisir(texte: string) {
  const bouton = [...host.querySelectorAll("button")].find((b) => b.textContent === texte);
  expect(bouton).toBeTruthy();
  await act(async () => bouton!.click());
}
beforeEach(async () => {
  vi.resetModules();
  CookieBanner = (await import("../../src/components/CookieBanner")).CookieBanner;
  useAnalytics = (await import("../../src/hooks/useAnalytics")).useAnalytics;
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  valeur = null; erreurs.length = 0;
  lire = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => valeur);
  ecrire = vi.spyOn(Storage.prototype, "setItem").mockImplementation((_k, v) => { valeur = v; });
  vi.stubGlobal("fetch", vi.fn(() => { throw Error("Reseau interdit"); }));
  window.addEventListener("error", erreur);
});
afterEach(async () => {
  if (root) await act(async () => root!.unmount());
  root = undefined; host?.remove();
  window.removeEventListener("error", erreur);
  expect(erreurs).toEqual([]);
  expect(fetch).not.toHaveBeenCalled();
  vi.restoreAllMocks(); vi.unstubAllGlobals();
  h.load.mockReset(); h.remove.mockReset(); h.pageView.mockReset(); h.scrollDepth.mockReset();
});
describe("Choix des cookies sous refus Storage", () => {
  it("rend les deux choix lorsque la lecture du stockage est refusee", async () => {
    lire.mockImplementation(() => { throw Error("lecture refusee"); });
    await monter();
    expect(host.querySelectorAll("button")).toHaveLength(2);
    expect(h.load).not.toHaveBeenCalled();
  });
  it("applique le refus courant meme quand son ecriture est refusee", async () => {
    await monter();
    ecrire.mockImplementation(() => { throw Error("ecriture refusee"); });
    await choisir("Refuser");
    expect(h.remove).toHaveBeenCalled();
    expect(host.textContent).toContain("pas pu être enregistré");
  });

  it.each([null, "", "true", "accepted ", "opaque"])("ne charge rien par defaut pour %s", async (valeurLue) => {
    valeur = valeurLue;
    await monter("fr", true);
    expect(host.querySelectorAll("button")).toHaveLength(2);
    expect(h.load).not.toHaveBeenCalled();
    expect(h.pageView).not.toHaveBeenCalled();
    expect(ecrire).not.toHaveBeenCalled();
  });

  it.each(["accepted", "refused"] as const)("respecte le choix persistant exact %s sans reecriture", async (choix) => {
    valeur = choix;
    await monter("fr", true);
    expect(host.querySelectorAll("button")).toHaveLength(0);
    expect(ecrire).not.toHaveBeenCalled();
    expect(h.load).toHaveBeenCalledTimes(choix === "accepted" ? 1 : 0);
    expect(h.pageView).toHaveBeenCalledTimes(choix === "accepted" ? 1 : 0);
  });

  it.each(["Accepter", "Refuser"])("recoit la persistance apres %s et garde la cle contractuelle", async (bouton) => {
    await monter();
    await choisir(bouton);
    const attendu = bouton === "Accepter" ? "accepted" : "refused";
    expect(ecrire).toHaveBeenCalledWith("cookie-consent", attendu);
    expect(lire).toHaveBeenLastCalledWith("cookie-consent");
    expect(valeur).toBe(attendu);
    expect(host.querySelectorAll("button")).toHaveLength(0);
    expect(h.load).toHaveBeenCalledTimes(bouton === "Accepter" ? 1 : 0);
  });

  it.each(["Accepter", "Refuser"])("applique %s apres une lecture et une ecriture refusees", async (bouton) => {
    lire.mockImplementation(() => { throw Error("lecture refusee"); });
    ecrire.mockImplementation(() => { throw Error("ecriture refusee"); });
    await monter("fr", true);
    expect(h.load).not.toHaveBeenCalled();
    await choisir(bouton);
    expect(host.textContent).toContain(bouton === "Accepter" ? "accepté pour cette visite" : "refusé pour cette visite");
    expect(host.textContent).toContain("après actualisation");
    expect(host.querySelectorAll("button")).toHaveLength(2);
    expect(h.load).toHaveBeenCalledTimes(bouton === "Accepter" ? 1 : 0);
  });

  it("ne declare pas memorise un set silencieux qui ne change pas la valeur", async () => {
    await monter();
    ecrire.mockImplementation(() => {});
    await choisir("Accepter");
    expect(host.textContent).toContain("pas pu être enregistré");
    expect(h.load).toHaveBeenCalledTimes(1);
    expect(valeur).toBeNull();
  });

  it("ne declare pas memorise un choix dont la relecture est refusee", async () => {
    await monter();
    lire.mockImplementation(() => { throw Error("relecture refusee"); });
    await choisir("Refuser");
    expect(valeur).toBe("refused");
    expect(host.textContent).toContain("pas pu être enregistré");
    expect(h.load).not.toHaveBeenCalled();
  });

  it("localise les choix, le recu et le lien contractuel anglais", async () => {
    await monter("en");
    expect(host.textContent).toContain(en.cookies.message);
    expect(host.querySelector("a")?.getAttribute("href")).toBe("/en/cookies");
    ecrire.mockImplementation(() => { throw Error("refus"); });
    await choisir("Reject");
    expect(host.textContent).toContain("rejected for this visit");
    expect(host.textContent).toContain("could not be saved");
    expect(host.textContent).toContain("earlier choice");
    expect(host.querySelector('[role="status"]')?.getAttribute("aria-live")).toBe("polite");
  });

  it("conserve le texte et le lien contractuels francais", async () => {
    await monter();
    expect(host.textContent).toContain(fr.cookies.message);
    expect(host.querySelector("a")?.textContent).toBe(fr.cookies.learnMore);
    expect(host.querySelector("a")?.getAttribute("href")).toBe("/cookies");
  });

  it("ferme les anciens evenements apres un refus non memorise puis une navigation", async () => {
    lire.mockImplementation(() => { throw Error("lecture initiale refusee"); });
    await monter("fr", true);
    expect(h.pageView).not.toHaveBeenCalled();
    valeur = "accepted"; lire.mockImplementation(() => valeur);
    await act(async () => navigate("/consentement-lu"));
    expect(h.pageView).toHaveBeenCalledWith("/consentement-lu", document.title);
    ecrire.mockImplementation(() => { throw Error("refus non memorise"); });
    await choisir("Refuser");
    expect(valeur).toBe("accepted");
    Object.defineProperty(window, "scrollY", { configurable: true, value: 400 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 500 });
    Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 1000 });
    await act(async () => window.dispatchEvent(new Event("scroll")));
    await act(async () => navigate("/apres-refus"));
    expect(h.scrollDepth).not.toHaveBeenCalled();
    expect(h.pageView).toHaveBeenCalledTimes(1);
    expect(h.load).not.toHaveBeenCalled();
    expect(host.textContent).toContain("refusé pour cette visite");
  });

  it("autorise le choix explicite courant apres acceptation non memorisee", async () => {
    await monter("fr", true);
    valeur = "refused";
    ecrire.mockImplementation(() => { throw Error("refus stockage"); });
    await choisir("Accepter");
    await act(async () => navigate("/apres-acceptation"));
    expect(valeur).toBe("refused");
    expect(h.load).toHaveBeenCalledTimes(1);
    expect(h.pageView).toHaveBeenCalledWith("/apres-acceptation", document.title);
  });

  it("garde les payloads et le seuil de scroll sous consentement valide", async () => {
    valeur = "accepted";
    await monter("fr", true);
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 500 });
    Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 1000 });
    Object.defineProperty(window, "scrollY", { configurable: true, value: 200 });
    await act(async () => window.dispatchEvent(new Event("scroll")));
    expect(h.scrollDepth).not.toHaveBeenCalled();
    Object.defineProperty(window, "scrollY", { configurable: true, value: 300 });
    await act(async () => window.dispatchEvent(new Event("scroll")));
    await act(async () => window.dispatchEvent(new Event("scroll")));
    expect(h.scrollDepth.mock.calls).toEqual([[50, "/depart"]]);
    expect(h.pageView.mock.calls).toEqual([["/depart", document.title]]);
    await act(async () => navigate("/nouvelle-page"));
    await act(async () => window.dispatchEvent(new Event("scroll")));
    expect(h.scrollDepth.mock.calls).toEqual([[50, "/depart"], [50, "/nouvelle-page"]]);
    expect(h.pageView).toHaveBeenLastCalledWith("/nouvelle-page", document.title);
  });
});

it("contre revue : le refus persistant ulterieur ferme la mesure apres une acceptation", async () => {
  await monter("fr", true);
  await choisir("Accepter");
  expect(valeur).toBe("accepted");
  expect(h.pageView).not.toHaveBeenCalled();
  valeur = "refused";
  await act(async () => navigate("/after-another-context-refused"));
  expect(h.pageView).not.toHaveBeenCalled();
  lire.mockImplementation(() => { throw Error("lecture devenue indisponible"); });
  await act(async () => navigate("/after-refusal-then-storage-error"));
  expect(h.pageView).not.toHaveBeenCalled();
});
