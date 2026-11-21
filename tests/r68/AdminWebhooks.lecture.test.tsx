import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import AdminWebhooks from "../../src/pages/admin/AdminWebhooks";

const port = vi.hoisted(() => ({ lire: vi.fn(), sessionLue: vi.fn(), token: "session-test" }));
vi.mock("@/lib/adminAuth", () => ({
  getAdminToken: () => { port.sessionLue(); return port.token; },
  adminLogout: () => { throw Error("Déconnexion hors scénario"); },
  callAdminFunction: (name: string, body: { limit: number }) => {
    expect(name).toBe("admin-get-audit-log");
    return port.lire(body.limit);
  },
}));
let element: HTMLDivElement;
let racine: Root;
beforeEach(() => {
  port.lire.mockReset();
  port.sessionLue.mockClear();
  port.token = "session-test";
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("fetch", vi.fn(() => { throw Error("Transport extérieur interdit"); }));
  vi.useFakeTimers();
  element = document.createElement("div");
  document.body.append(element);
  racine = createRoot(element);
});
afterEach(async () => {
  await act(async () => racine.unmount());
  element.remove();
  expect(fetch).not.toHaveBeenCalled();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
async function ouvrir() { await act(async () => racine.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AdminWebhooks /></MemoryRouter>)); }
function bouton(label: string) { return [...element.querySelectorAll("button")].find(b => b.textContent === label); }
it.each([50, 500])("borne la lecture %i indépendamment et ignore sa réponse tardive", async limite => {
  let finir!: (valeur: unknown) => void;
  port.lire.mockImplementation((n: number) => n === limite ? new Promise(resolve => { finir = resolve; }) : Promise.resolve({ rows: [] }));
  await ouvrir();
  const journal = limite === 50;
  const indisponible = journal ? "Journal indisponible" : "Statistiques indisponibles";
  const autreIndisponible = journal ? "Statistiques indisponibles" : "Journal indisponible";
  await act(async () => vi.advanceTimersByTimeAsync(15_000));
  expect(element.textContent).toContain(indisponible);
  expect(element.textContent).not.toContain(autreIndisponible);
  port.lire.mockResolvedValueOnce({ rows: [] });
  const relire = bouton(journal ? "Réessayer le journal" : "Réessayer les statistiques");
  expect(relire).toBeDefined();
  await act(async () => relire!.click());
  expect(element.textContent).not.toContain(indisponible);
  await act(async () => finir({ rows: null }));
  expect(element.textContent).not.toContain(indisponible);
  const limites = port.lire.mock.calls.map(([n]) => n);
  expect(limites.filter(n => n === limite)).toHaveLength(2);
  expect(limites.filter(n => n !== limite)).toHaveLength(1);
});
it("une source invalide garde l’autre rubrique consultable", async () => {
  port.lire.mockImplementation((n: number) => Promise.resolve(n === 500 ? { rows: [{}] } : { rows: [] }));
  await ouvrir();
  expect(element.textContent).toContain("Statistiques indisponibles");
  expect(bouton("Actualiser le journal")).toBeDefined();
  expect(bouton("Réessayer les statistiques")).toBeDefined();
});
it("retire les deux extraits à la perte de session", async () => {
  port.lire.mockResolvedValue({ rows: [] });
  await ouvrir();
  expect(bouton("Actualiser le journal")).toBeDefined();
  port.token = "";
  await act(async () => { window.dispatchEvent(new Event("focus")); });
  expect(element.textContent).toContain("Session admin absente ou expirée");
  expect(bouton("Actualiser le journal")).toBeUndefined();
  expect(port.lire).toHaveBeenCalledTimes(2);
});

it("un rendu sans montage garde le lecteur de session et son stockage au repos", () => {
  const html = renderToString(<MemoryRouter><AdminWebhooks /></MemoryRouter>);
  expect(port.sessionLue).not.toHaveBeenCalled();
  expect(html).toContain("Vérification de la session");
  expect(port.lire).not.toHaveBeenCalled();
});
