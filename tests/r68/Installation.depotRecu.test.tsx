import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { FunctionsClient } from "@supabase/functions-js";
import { MemoryRouter, useNavigate, type NavigateFunction } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import FormulaireInteretInstallation from "@/components/FormulaireInteretInstallation";

const ports = vi.hoisted(() => ({ invoke: vi.fn(), measure: vi.fn(), lang: "fr" }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { functions: { invoke: ports.invoke } } }));
vi.mock("@/lib/analytics", () => ({ Analytics: { formSubmission: ports.measure } }));
vi.mock("@/hooks/useInstallation", () => ({ useProfessions: () => ({ data: [] }), useCabinetsInstallation: () => ({ data: [] }) }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ i18n: { language: ports.lang } }) }));

const id = "13207fb7-f141-489f-a1ab-02ee83447df2";
const good = (data: unknown = { ok: true, id }, status = 200) => ({ data, error: null, response: new Response("{}", { status }) });
function refused(data: unknown, status: number) {
  const response = new Response(JSON.stringify(data), { status });
  return { data: null, error: Object.assign(new Error("HTTP"), { context: response }), response };
}

let root: Root, host: HTMLElement, navigate: NavigateFunction;
function View() {
  navigate = useNavigate();
  return <FormulaireInteretInstallation professionSlug="psychologue" villeSlug="ville-fictive" />;
}
async function mount() {
  await act(async () => root.render(<MemoryRouter initialEntries={["/sinstaller/psychologue/ville-fictive"]}><View /></MemoryRouter>));
}
const field = (name: string) => host.querySelector<HTMLInputElement>(name)!;
const form = () => host.querySelector("form")!;
const submit = () => form().dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
const issue = () => host.querySelector('[role="alert"]')?.textContent;
async function type(name: string, text: string) {
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(field(name), text);
    field(name).dispatchEvent(new Event("input", { bubbles: true }));
  });
}
async function fill() {
  await type("#nom", "Fiche test"); await type("#email", "fiche@example.invalid");
  await act(async () => field("#consent").click());
}
beforeEach(() => {
  host = document.createElement("div"); document.body.append(host); root = createRoot(host);
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  for (const name of ["fetch", "XMLHttpRequest", "WebSocket", "EventSource"]) {
    vi.stubGlobal(name, vi.fn(() => { throw Error("Transport fermé"); }));
  }
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
  ports.invoke.mockReset(); ports.measure.mockReset(); ports.lang = "fr";
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it("rend la même confirmation publique pour les deux reçus natifs, avec une seule conversion", async () => {
  ports.invoke.mockResolvedValueOnce(good()).mockResolvedValueOnce(good({ ok: true, id: "honeypot" }));
  await mount(); await fill(); await act(async () => { submit(); submit(); });
  const first = host.innerHTML;
  expect(first).toContain("Merci pour votre demande");
  expect(first).not.toContain(id); expect(ports.measure).toHaveBeenCalledOnce();
  await act(async () => host.querySelector("button")!.click());
  expect(field("#nom").value).toBe(""); expect(ports.invoke).toHaveBeenCalledOnce();
  await fill(); await type('[name="website"]', "fixture");
  await act(async () => { submit(); });
  expect(host.innerHTML).toBe(first);
  expect(ports.invoke).toHaveBeenCalledTimes(2); expect(ports.measure).toHaveBeenCalledOnce();
});

it("accepte le véritable transport SDK après refus puis dépôt, sur fetch en mémoire", async () => {
  const fetchLocal = vi.fn()
    .mockResolvedValueOnce(new Response(JSON.stringify({ error: "rate_limited" }), { status: 429, headers: { "content-type": "application/json" } }))
    .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, id }), { status: 200, headers: { "content-type": "application/json" } }));
  const sdk = new FunctionsClient("https://fixture.invalid/functions/v1", { customFetch: fetchLocal });
  ports.invoke.mockImplementation((name, options) => sdk.invoke(name, options));
  await mount(); await fill(); await act(async () => { submit(); });
  expect(issue()).toContain("Trop de demandes"); expect(ports.measure).not.toHaveBeenCalled();
  await act(async () => { submit(); });
  expect(host.textContent).toContain("Merci pour votre demande");
  expect(fetchLocal).toHaveBeenCalledTimes(2); expect(ports.measure).toHaveBeenCalledOnce();
});

it.each([
  ["identifiant absent", () => good({ ok: true })],
  ["identifiant invalide", () => good({ ok: true, id: "non-numero" })],
  ["forme contradictoire", () => good({ ok: true, id, error: "test" })],
  ["HTTP inattendu", () => good({ ok: true, id }, 201)],
  ["réponse de relais", () => ({ ...good(), response: new Response("{}", { headers: { "x-relay-error": "true" } }) })],
  ["réponse HTTP manquante", () => ({ ...good(), response: undefined })],
  ["erreur après dépôt possible", () => refused({ error: "internal_error" }, 500)],
  ["code non documenté", () => refused({ error: "rate_limited" }, 400)],
] as const)("garde le dépôt incertain, %s", async (_, reply) => {
  ports.invoke.mockResolvedValue(reply());
  await mount(); await fill(); await act(async () => { submit(); });
  expect(issue()).toContain("ne pouvons pas confirmer");
  expect(host.querySelector("form")).toBeNull(); expect(ports.measure).not.toHaveBeenCalled();
});

it.each([[400, "invalid_email"], [429, "rate_limited"]] as const)("rend le refus préalable authentifié (%s) et permet un nouvel envoi volontaire", async (status, code) => {
  ports.invoke.mockResolvedValueOnce(refused({ error: code }, status)).mockResolvedValueOnce(good());
  await mount(); await fill(); await act(async () => { submit(); });
  expect(issue()).toMatch(status === 429 ? /Trop de demandes/ : /Adresse email invalide/);
  expect(field("#nom").value).toBe("Fiche test");
  expect(ports.measure).not.toHaveBeenCalled();
  await act(async () => { submit(); }); expect(ports.invoke).toHaveBeenCalledTimes(2);
  expect(ports.measure).toHaveBeenCalledOnce();
});

it("après expiration garde l’issue incertaine et ignore le reçu tardif, même après une seconde préparation", async () => {
  vi.useFakeTimers();
  let complete!: (value: unknown) => void;
  ports.invoke.mockReturnValueOnce(new Promise(done => { complete = done; })).mockResolvedValueOnce(good());
  await mount(); await fill(); await act(async () => { submit(); submit(); });
  expect(ports.invoke).toHaveBeenCalledOnce();
  await act(async () => { vi.advanceTimersByTime(15_000); });
  expect(issue()).toContain("ne pouvons pas confirmer");
  ports.lang = "en"; await mount();
  expect(issue()).toContain("could not confirm"); expect(ports.invoke).toHaveBeenCalledOnce();
  await act(async () => host.querySelector("button")!.click());
  await act(async () => complete(good()));
  expect(form()).not.toBeNull(); expect(field("#nom").value).toBe("");
  expect(ports.measure).not.toHaveBeenCalled();
  await fill(); await act(async () => { submit(); });
  expect(ports.invoke).toHaveBeenCalledTimes(2); expect(ports.measure).toHaveBeenCalledOnce();
});

it("borne le temps mural même si le réveil de l’onglet retarde son timer", async () => {
  vi.useFakeTimers();
  let complete!: (value: unknown) => void;
  ports.invoke.mockReturnValue(new Promise(done => { complete = done; }));
  await mount(); await fill(); await act(async () => { submit(); });
  vi.setSystemTime(Date.now() + 16_000);
  await act(async () => complete(good()));
  expect(issue()).toContain("ne pouvons pas confirmer"); expect(ports.measure).not.toHaveBeenCalled();
});

it("écarte le retour d’une visite quittée même en revenant à la même adresse", async () => {
  let complete!: (value: unknown) => void;
  ports.invoke.mockReturnValue(new Promise(done => { complete = done; }));
  await mount(); await fill(); await act(async () => { submit(); });
  await act(async () => navigate("/projets/test"));
  await act(async () => navigate("/sinstaller/psychologue/ville-fictive"));
  await act(async () => complete(good()));
  expect(field("#nom").value).toBe(""); expect(host.querySelector('[role="status"]')).toBeNull();
  expect(ports.measure).not.toHaveBeenCalled();
});
