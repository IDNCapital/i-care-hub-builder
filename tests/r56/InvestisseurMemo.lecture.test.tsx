import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import InvestisseurMemo from "@/pages/InvestisseurMemo";

const langue = vi.hoisted(() => ({ language: "fr" }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ i18n: langue }) }));
vi.mock("@/components/Layout", () => ({ Layout: ({ children }: { children: ReactNode }) => <main>{children}</main> }));
const jeton = "acces-fictif-en-memoire-uniquement";
const cle = "icare_investor_token";
const lecture = vi.fn<typeof fetch>();
let support: HTMLDivElement;
let racine: Root;
function reponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
}
function ChangerVisite() {
  const aller = useNavigate();
  return <button id="visite-suivante" onClick={() => aller("?visite=suivante")}>Visite suivante</button>;
}
async function ouvrir() {
  const fr = langue.language === "fr";
  await act(async () => racine.render(
    <MemoryRouter initialEntries={[fr ? "/investissement/memo" : "/en/investment/memo"]}>
      <ChangerVisite /><Routes>
        <Route path={fr ? "/investissement/memo" : "/en/investment/memo"} element={<InvestisseurMemo />} />
        <Route path={fr ? "/investissement/interet" : "/en/investment/interest"} element={<p>Formulaire témoin</p>} />
      </Routes>
    </MemoryRouter>));
}
beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("fetch", lecture.mockReset());
  localStorage.clear(); sessionStorage.clear(); langue.language = "fr";
  support = document.createElement("div"); document.body.append(support); racine = createRoot(support);
});
afterEach(async () => {
  await act(async () => racine.unmount()); support.remove(); localStorage.clear(); sessionStorage.clear();
  vi.useRealTimers(); vi.unstubAllGlobals();
});

it.each(["fr", "en"])("affiche le mémo après le contrôle positif du jeton courant en %s", async lang => {
  langue.language = lang; localStorage.setItem(cle, jeton); lecture.mockResolvedValue(reponse({ valid: true }));
  await ouvrir();
  expect(lecture).toHaveBeenCalledTimes(1);
  const [url, options] = lecture.mock.calls[0];
  expect(String(url)).toMatch(/\/check-investor-access$/);
  expect(options?.method).toBe("POST");
  expect(JSON.parse(String(options?.body))).toEqual({ access_token: jeton });
  expect(support.querySelector("h1")).not.toBeNull();
  expect(support.querySelector('[role="alert"]')).toBeNull();
});

it("sans jeton actuel, revient au formulaire et retire seulement l’ancien marqueur local", async () => {
  sessionStorage.setItem("icare_investor_access", "granted"); await ouvrir();
  expect(lecture).not.toHaveBeenCalled();
  expect(sessionStorage.getItem("icare_investor_access")).toBeNull();
  expect(support.textContent).toContain("Formulaire témoin");
});

it.each([[500, false], [200, false], [200, "oui"], [201, true]])(
  "garde le jeton et le mémo fermé devant un reçu non concluant (%s, %s)", async (status, valid) => {
    localStorage.setItem(cle, jeton); lecture.mockResolvedValue(reponse({ valid }, Number(status))); await ouvrir();
    expect(support.querySelector("h1")).toBeNull(); expect(support.querySelector('[role="alert"]')).not.toBeNull();
    expect(localStorage.getItem(cle)).toBe(jeton); expect(lecture).toHaveBeenCalledTimes(1);
  });

it("respecte le reçu d’expiration du service et renvoie au formulaire", async () => {
  localStorage.setItem(cle, jeton); lecture.mockResolvedValue(reponse({ valid: false, reason: "expired" }));
  await ouvrir(); expect(localStorage.getItem(cle)).toBeNull(); expect(support.textContent).toContain("Formulaire témoin");
});

it("ignore le reçu de la lecture annulée lorsque le jeton local change", async () => {
  let terminer!: (reponse: Response) => void;
  localStorage.setItem(cle, jeton);
  lecture.mockImplementation(() => new Promise(resolve => { terminer = resolve; }));
  await ouvrir(); const signal = lecture.mock.calls[0][1]?.signal;
  await act(async () => {
    localStorage.setItem(cle, "autre-jeton-fictif");
    window.dispatchEvent(new StorageEvent("storage", { key: cle }));
    terminer(reponse({ valid: false, reason: "expired" }));
  });
  expect(signal?.aborted).toBe(true); expect(localStorage.getItem(cle)).toBe("autre-jeton-fictif");
  expect(support.querySelector("h1")).toBeNull(); expect(support.querySelector('[role="alert"]')).not.toBeNull();
});

it("attend une reprise explicite après expiration du délai et conserve le jeton", async () => {
  vi.useFakeTimers(); localStorage.setItem(cle, jeton);
  let terminer!: (reponse: Response) => void;
  lecture.mockImplementationOnce(() => new Promise(resolve => { terminer = resolve; }));
  await ouvrir(); await act(async () => { await vi.advanceTimersByTimeAsync(15000); terminer(reponse({ valid: true })); });
  expect(support.querySelector('[role="alert"]')).not.toBeNull(); expect(support.querySelector("h1")).toBeNull();
  expect(lecture).toHaveBeenCalledTimes(1); expect(localStorage.getItem(cle)).toBe(jeton);
  lecture.mockResolvedValueOnce(reponse({ valid: true }));
  await act(async () => support.querySelector<HTMLButtonElement>("main button")!.click());
  expect(lecture).toHaveBeenCalledTimes(2); expect(support.querySelector("h1")).not.toBeNull();
});

it.each([
  [{ valid: true, raison: "non confirmée" }, false], [{ valid: false, reason: "expired", autre: true }, false],
  [{ valid: true }, true],
])("ne donne pas d’effet aux données contradictoires ou au marqueur d’erreur du relais", async (corps, relais) => {
  localStorage.setItem(cle, jeton);
  const result = reponse(corps);
  if (relais) result.headers.set("x-relay-error", "true");
  lecture.mockResolvedValue(result); await ouvrir();
  expect(support.querySelector("h1")).toBeNull(); expect(localStorage.getItem(cle)).toBe(jeton);
  expect(support.querySelector('[role="alert"]')).not.toBeNull();
});

it("le remplacement de visite annule la première lecture, même en français sur le même chemin", async () => {
  localStorage.setItem(cle, jeton);
  let finir!: (r: Response) => void;
  lecture.mockImplementationOnce(() => new Promise(resolve => { finir = resolve; }));
  lecture.mockResolvedValueOnce(reponse({ valid: true })); await ouvrir();
  const signal = lecture.mock.calls[0][1]?.signal;
  await act(async () => (support.querySelector("#visite-suivante") as HTMLButtonElement).click());
  await act(async () => finir(reponse({ valid: false, reason: "expired" })));
  expect(signal?.aborted).toBe(true); expect(lecture).toHaveBeenCalledTimes(2);
  expect(localStorage.getItem(cle)).toBe(jeton); expect(support.querySelector("h1")).not.toBeNull();
});
