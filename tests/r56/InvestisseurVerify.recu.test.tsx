import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import InvestisseurVerify from "@/pages/InvestisseurVerify";
import InvestisseurMemo from "@/pages/InvestisseurMemo";

const langue = vi.hoisted(() => ({ language: "fr" }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ i18n: langue }) }));
vi.mock("@/components/Layout", () => ({ Layout: ({ children }: { children: ReactNode }) => <main>{children}</main> }));
const cle = "icare_investor_token";
const acces = "00000000-0000-4000-8000-000000000001";
const lecture = vi.fn<typeof fetch>();
let racine: Root;
let support: HTMLDivElement;
function reponse(corps: unknown, status = 200) {
  return new Response(JSON.stringify(corps), { status, headers: { "content-type": "application/json" } });
}
function Visite() {
  const aller = useNavigate();
  return <><button id="autre" onClick={() => aller("?token=deuxieme-lien-fictif")}>Autre lien fictif</button>
    <Routes>
      <Route path="/investissement/verify" element={<InvestisseurVerify />} />
      <Route path="/en/investment/verify" element={<InvestisseurVerify />} />
      <Route path="/investissement/memo" element={<InvestisseurMemo />} />
      <Route path="/en/investment/memo" element={<InvestisseurMemo />} />
      <Route path="/investissement/interet" element={<p>Formulaire témoin</p>} />
      <Route path="/en/investment/interest" element={<p>Formulaire témoin</p>} />
    </Routes></>;
}
async function ouvrir(recherche = "?token=premier-lien-fictif") {
  const chemin = (langue.language === "en" ? "/en/investment/verify" : "/investissement/verify") + recherche;
  await act(async () => racine.render(<MemoryRouter initialEntries={[chemin]}><Visite /></MemoryRouter>));
}
beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true); vi.stubGlobal("fetch", lecture.mockReset());
  localStorage.clear(); langue.language = "fr";
  support = document.createElement("div"); document.body.append(support); racine = createRoot(support);
});
afterEach(async () => {
  await act(async () => racine.unmount()); support.remove(); localStorage.clear();
  vi.useRealTimers(); vi.unstubAllGlobals();
});

it.each(["fr", "en"])("le lien confirmé mène au vrai mémo après le contrôle de la session en %s", async lang => {
  langue.language = lang; vi.useFakeTimers();
  lecture.mockImplementation(async (url, options) => {
    const chemin = new URL(String(url));
    if (chemin.pathname.endsWith("/verify-investor-token")) {
      expect(options?.method).toBe("GET");
      expect(chemin.searchParams.get("token")).toBe("premier-lien-fictif");
      return reponse({ status: "verified", access_token: acces });
    }
    expect(chemin.pathname).toMatch(/\/check-investor-access$/);
    expect(options?.method).toBe("POST"); expect(JSON.parse(String(options?.body))).toEqual({ access_token: acces });
    return reponse({ valid: true });
  });
  await ouvrir();
  expect(support.querySelector("h1")?.textContent).toMatch(/Email (confirmed|confirmé)/);
  expect(localStorage.getItem(cle)).toBe(acces);
  await act(async () => { await vi.advanceTimersByTimeAsync(3000); });
  expect(lecture).toHaveBeenCalledTimes(2);
  expect(support.querySelector("h1")).not.toBeNull();
  expect(support.querySelector("h1")?.textContent).not.toMatch(/Email (confirmed|confirmé)/);
});

it.each([
  [500, { error: "incident" }], [200, { status: "verified", access_token: "  " }],
  [201, { status: "verified", access_token: acces }], [200, { status: "verified", access_token: "x" }],
  [200, { status: "verified", access_token: acces, error: "indisponible" }],
])("ne confirme pas la lecture incertaine et permet de revenir au formulaire sans la rejouer", async (status, corps) => {
  lecture.mockResolvedValue(reponse(corps, Number(status))); await ouvrir();
  expect(support.querySelector('[role="alert"]')).not.toBeNull(); expect(localStorage.getItem(cle)).toBeNull();
  await act(async () => support.querySelector<HTMLButtonElement>("main button")!.click());
  expect(support.textContent).toContain("Formulaire témoin"); expect(lecture).toHaveBeenCalledTimes(1);
});

it.each([["expired", "expiré"], ["invalid_or_expired", "invalide"]])("respecte le refus explicite %s", async (motif, mot) => {
  lecture.mockResolvedValue(reponse({ error: motif }, 400)); await ouvrir();
  expect(support.querySelector("h1")?.textContent).toContain(mot);
  expect(lecture).toHaveBeenCalledTimes(1); expect(localStorage.getItem(cle)).toBeNull();
});

it("une URL sans lien ne contacte pas le service", async () => {
  await ouvrir(""); expect(lecture).not.toHaveBeenCalled(); expect(support.textContent).toContain("Lien invalide");
});

it("une réponse à l’ancienne visite ne remplace pas le reçu du lien courant", async () => {
  let terminer!: (r: Response) => void;
  lecture.mockImplementationOnce(() => new Promise(resolve => { terminer = resolve; }));
  lecture.mockResolvedValueOnce(reponse({ status: "verified", access_token: acces }));
  await ouvrir(); const signal = lecture.mock.calls[0][1]?.signal;
  await act(async () => (support.querySelector("#autre") as HTMLButtonElement).click());
  await act(async () => terminer(reponse({ status: "verified", access_token: "ancienne-session-fictive" })));
  expect(signal?.aborted).toBe(true); expect(localStorage.getItem(cle)).toBe(acces);
  expect(lecture).toHaveBeenCalledTimes(2);
});

it("au-delà de quinze secondes, ne stocke pas un résultat tardif et ne renvoie aucune demande", async () => {
  vi.useFakeTimers(); let terminer!: (r: Response) => void;
  lecture.mockImplementation(() => new Promise(resolve => { terminer = resolve; }));
  await ouvrir(); await act(async () => { await vi.advanceTimersByTimeAsync(15000); terminer(reponse({ status: "verified", access_token: acces })); });
  expect(support.querySelector('[role="alert"]')).not.toBeNull();
  expect(localStorage.getItem(cle)).toBeNull(); expect(lecture).toHaveBeenCalledTimes(1);
});

it("une réponse du relais ne sert pas de reçu, même si son corps a la forme attendue", async () => {
  const result = reponse({ status: "verified", access_token: acces });
  result.headers.set("x-relay-error", "true"); lecture.mockResolvedValue(result); await ouvrir();
  expect(support.querySelector('[role="alert"]')).not.toBeNull();
  expect(localStorage.getItem(cle)).toBeNull(); expect(lecture).toHaveBeenCalledTimes(1);
});
