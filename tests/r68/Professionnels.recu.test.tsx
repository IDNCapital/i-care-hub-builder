import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, useNavigate, type NavigateFunction } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import Professionnels from "@/pages/Professionnels";

const doubles = vi.hoisted(() => ({ invoke: vi.fn(), conversion: vi.fn(), langue: "fr" }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { functions: { invoke: doubles.invoke } } }));
vi.mock("@/lib/analytics", () => ({ Analytics: { formSubmission: doubles.conversion } }));
vi.mock("@/components/Layout", () => ({ Layout: ({ children }: { children: ReactNode }) => <main>{children}</main> }));
vi.mock("@/components/SeoHead", () => ({ SeoHead: () => null }));
vi.mock("@/lib/projectImages", () => ({ getDefaultHero: () => "" }));
vi.mock("@/components/FadeImage", () => ({ FadeImage: () => null }));
vi.mock("@/hooks/useInstallation", () => ({ useProfessions: () => ({ data: [{ slug: "test", nom_inclusif_pluriel: "Profession fictive" }] }) }));
vi.mock("@/components/ui/select", () => ({
  Select: ({ children, value, disabled, onValueChange }: { children: ReactNode; value: string; disabled?: boolean; onValueChange: (value: string) => void }) =>
    <select value={value} disabled={disabled} onChange={e => onValueChange(e.target.value)}><option value=""/>{children}</select>,
  SelectTrigger: () => null, SelectValue: () => null, SelectContent: ({ children }: { children: ReactNode }) => <>{children}</>,
  SelectItem: ({ children, value }: { children: ReactNode; value: string }) => <option value={value}>{children}</option>,
}));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (cle: string) => cle, i18n: { language: doubles.langue } }) }));
vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

const id = "123e4567-e89b-42d3-a456-426614174000";
const positif = (data: unknown = { status: "ok", lead_id: id }, status = 200) => ({
  data, error: null, response: new Response(JSON.stringify(data), { status }),
});
function rejet(data: unknown, status: number) {
  const response = new Response(JSON.stringify(data), { status });
  return { data: null, error: { context: response }, response };
}
let host: HTMLDivElement, root: Root, naviguer: NavigateFunction;
function Navigation() { naviguer = useNavigate(); return null; }
const nom = () => host.querySelector<HTMLInputElement>("#firstName")!;
const envoyer = () => host.querySelector<HTMLButtonElement>("button[type=submit]")!;
const formulaire = () => host.querySelector<HTMLFormElement>("form")!;
const cliquer = async (bouton: HTMLElement) => { await act(async () => bouton.click()); };
const soumettre = () => formulaire().dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
async function saisir(cle: string, valeur: string) {
  const champ = host.querySelector(cle)!;
  const prototype = champ instanceof HTMLInputElement ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype;
  await act(async () => {
    Object.getOwnPropertyDescriptor(prototype, "value")!.set!.call(champ, valeur);
    champ.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
async function preparer() {
  const chemin = "/professionnels";
  window.history.replaceState({}, "", chemin);
  await act(async () => root.render(<MemoryRouter initialEntries={[chemin]}><Navigation /><Professionnels /></MemoryRouter>));
  await saisir("#firstName", "Identité fictive");
  await saisir("#lastName", "Famille fictive");
  await saisir("#phone", "0600000000");
  await saisir("#ville", "Ville fictive");
  await saisir("#message", "Message fictif");
  const selects = host.querySelectorAll("select");
  for (const [select, value] of [[selects[0], "test"], [selects[2], "1"]] as const) {
    await act(async () => { select.value = value; select.dispatchEvent(new Event("change", { bubbles: true })); });
  }
  await saisir("#email", "fixture@example.invalid");
  await cliquer(host.querySelector("#rgpd")!);
}
beforeEach(() => {
  host = document.createElement("div"); document.body.append(host); root = createRoot(host);
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  for (const port of ["fetch", "WebSocket", "XMLHttpRequest", "EventSource"]) {
    vi.stubGlobal(port, vi.fn(() => { throw Error("Port fermé"); }));
  }
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
  doubles.langue = "fr"; doubles.invoke.mockReset().mockResolvedValue(positif()); doubles.conversion.mockReset();
});
afterEach(async () => {
  await act(async () => root.unmount());
  expect(fetch).not.toHaveBeenCalled();
  expect(doubles.invoke.mock.calls.every(([action]) => action === "send-contact-lead")).toBe(true);
  host.remove(); vi.useRealTimers(); vi.unstubAllGlobals(); Reflect.deleteProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT");
});

it("montre le reçu courant et ne promet aucun courriel, y compris si la mesure échoue", async () => {
  doubles.conversion.mockImplementationOnce(() => { throw Error("Mesure indisponible"); });
  await preparer(); await act(async () => { soumettre(); soumettre(); });
  const { body } = doubles.invoke.mock.calls[0][1];
  expect(body).toMatchObject({ type: "cabinet_request", firstname: "Identité fictive", city: "Ville fictive",
    extra_data: { profession: "test", cabinet_count: "1" }, message: "Message fictif", language: "fr" });
  expect(host.querySelector("[role=status]")?.textContent).toContain(id);
  expect(host.querySelector("[role=status]")?.textContent).not.toMatch(/courriel|email/i);
  expect(nom().value).toBe("Identité fictive");
  expect(doubles.conversion).toHaveBeenCalledTimes(1); expect(envoyer().disabled).toBe(true);
  await act(async () => { soumettre(); }); expect(doubles.invoke).toHaveBeenCalledTimes(1);
  await cliquer(host.querySelector<HTMLButtonElement>("[role=status] button")!);
  expect(envoyer().disabled).toBe(false); expect(nom().value).toBe(""); expect(doubles.invoke).toHaveBeenCalledTimes(1);
});

it.each([
  ["corps vide", positif(null)], ["identifiant manquant", positif({ status: "ok" })],
  ["identifiant technique", positif({ status: "ok", lead_id: "unknown" })],
  ["corps ambigu", positif({ status: "ok", lead_id: id, error: null })], ["statut HTTP", positif(undefined, 201)],
  ["réponse sans HTTP", { data: { status: "ok", lead_id: id }, error: null }],
  ["contexte contradictoire", { ...rejet({ error: "invalid_email" }, 400), error: { context: new Response(null, { status: 400 }) } }],
  ["mauvais code", rejet({ error: ["invalid_email"] }, 400)], ["refus contradictoire", rejet({ error: "missing_fields", lead_id: id }, 400)],
  ["HTTP 500 potentiellement postérieur à l’insertion", rejet({ error: "internal_error" }, 500)],
])("conserve la saisie et ne rejoue pas un retour non confirmé : %s", async (_cas, reponse) => {
  doubles.invoke.mockResolvedValue(reponse); await preparer(); await act(async () => { soumettre(); });
  expect(host.querySelector("[role=alert]")?.textContent).toContain("Réception non confirmée");
  expect(nom().value).toBe("Identité fictive"); expect(envoyer().disabled).toBe(true);
  await act(async () => { soumettre(); }); expect(doubles.invoke).toHaveBeenCalledTimes(1);
  expect(doubles.conversion).not.toHaveBeenCalled();
});

it.each([["invalid_type", 400], ["missing_fields", 400], ["invalid_email", 400], ["invalid_phone", 400],
  ["invalid_profession", 400], ["rate_limited", 429]])("accepte le refus préalable %s", async (code, status) => {
  doubles.invoke.mockResolvedValue(rejet({ error: code }, Number(status)));
  await preparer(); await act(async () => { soumettre(); });
  expect(envoyer().disabled).toBe(false); expect(nom().value).toBe("Identité fictive");
  expect(host.querySelector("[role=alert]")?.textContent).toContain(status === 429 ? "professionals.formErrorRateLimit" : "refusée avant");
  expect(doubles.invoke).toHaveBeenCalledTimes(1); expect(doubles.conversion).not.toHaveBeenCalled();
});

it.each(["relais", "réseau"])("retient une réponse opaque du %s en anglais", async origine => {
  const recu = rejet({ error: "invalid_email" }, 400); recu.response.headers.set("x-relay-error", "true");
  if (origine === "réseau") doubles.invoke.mockRejectedValue(Error("Transport fictif"));
  else doubles.invoke.mockResolvedValue(recu);
  doubles.langue = "en"; await preparer(); await act(async () => { soumettre(); });
  expect(host.querySelector("[role=alert]")?.textContent).toContain("Receipt unconfirmed");
  expect(envoyer().disabled).toBe(true);
});

it.each([true, false])("borne la tentative et ignore un reçu en retard, minuteur déclenché %s", async minuterie => {
  await preparer(); vi.useFakeTimers(); let repondre!: (r: unknown) => void;
  doubles.invoke.mockImplementation(() => new Promise(resolve => { repondre = resolve; }));
  await act(async () => { soumettre(); soumettre(); });
  const signal = doubles.invoke.mock.calls[0][1].signal;
  if (minuterie) await act(async () => { await vi.advanceTimersByTimeAsync(15_000); });
  else vi.setSystemTime(Date.now() + 15_000);
  await act(async () => repondre(positif()));
  if (minuterie) expect(signal.aborted).toBe(true);
  expect(host.querySelector("[role=alert]")?.textContent).toContain("Réception non confirmée");
  expect(doubles.invoke).toHaveBeenCalledTimes(1); expect(doubles.conversion).not.toHaveBeenCalled();
});

it("une autre visite garde son brouillon si le reçu précédent arrive ensuite", async () => {
  let repondre!: (r: unknown) => void;
  doubles.invoke.mockImplementation(() => new Promise(resolve => { repondre = resolve; }));
  await preparer(); await act(async () => { soumettre(); });
  await act(async () => naviguer("/en/health-professionals?nouveau=1"));
  await saisir("#firstName", "Deuxième visite"); await act(async () => repondre(positif()));
  expect(nom().value).toBe("Deuxième visite"); expect(host.querySelector("[role=status]")).toBeNull();
  expect(doubles.invoke.mock.calls[0][1].signal.aborted).toBe(true);
  expect(doubles.conversion).not.toHaveBeenCalled();
});
