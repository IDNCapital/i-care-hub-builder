import { act, StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import AdminDemandes from "../../src/pages/admin/AdminDemandes";

const port = vi.hoisted(() => ({ lire: vi.fn(), modifier: vi.fn(), session: "session-de-test" }));
vi.mock("@/lib/adminAuth", () => ({
  getAdminToken: () => port.session,
  adminLogout: () => { throw Error("Déconnexion hors du scénario"); },
  callAdminFunction: (nom: string, entree: unknown) => {
    if (nom === "admin-update-demande") return port.modifier(entree);
    expect(nom).toBe("admin-list-demandes");
    expect(entree).toEqual({});
    return port.lire();
  },
}));

let element: HTMLDivElement;
let racine: Root;
beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("fetch", vi.fn(() => { throw Error("Transport extérieur interdit"); }));
  port.session = "session-de-test";
  port.lire.mockReset();
  port.modifier.mockReset();
  element = document.createElement("div");
  document.body.append(element);
  racine = createRoot(element);
});
afterEach(async () => {
  await act(async () => racine.unmount());
  element.remove();
  expect(fetch).not.toHaveBeenCalled();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
async function ouvrir() { await act(async () => racine.render(<AdminDemandes />)); }
function reprise() {
  const bouton = [...element.querySelectorAll("button")].find(b => b.textContent === "Réessayer");
  expect(bouton).toBeDefined();
  return act(async () => bouton!.click());
}
const demande = {
  id: "00000000-0000-4000-8000-000000000003", prenom: "Prénom test", nom: "Demande test",
  email: "exemple@example.invalid", telephone: null, message: "Message de test",
  problematiques_pressenties: [], cabinet_prefere: null, source: null, statut: "a_traiter",
  notes_internes: null, webhook_status: "ok", webhook_attempts: 1, webhook_last_error: null,
  created_at: "2026-11-21T08:00:00Z",
};

const vide = "Aucune demande dans l'extrait reçu.";
it("distingue le vrai vide reçu de l’attente sans réponse", async () => {
  let ancien!: (value: unknown) => void;
  port.lire.mockReturnValueOnce(new Promise(resolve => { ancien = resolve; }));
  await ouvrir();
  expect(element.querySelector('[role="status"]')?.textContent).toContain("Chargement");
  await act(async () => vi.advanceTimersByTimeAsync(15_000));
  expect(element.querySelector('[role="alert"]')?.textContent).toContain("indisponibles");
  expect(element.textContent).not.toContain(vide);
  port.lire.mockResolvedValueOnce({ demandes: [] });
  await reprise();
  expect(element.textContent).toContain(vide);
  await act(async () => ancien({ demandes: "invalide" }));
  expect(element.textContent).toContain(vide);
  expect(port.lire).toHaveBeenCalledTimes(2);
});
it.each([{ demandes: [{}] }, { demandes: null }, {}])("un extrait incomplet permet de relire sans afficher un zéro", async data => {
  port.lire.mockResolvedValueOnce(data);
  await ouvrir();
  expect(element.querySelector('[role="alert"]')).not.toBeNull();
  expect(element.textContent).not.toContain(vide);
  port.lire.mockResolvedValueOnce({ demandes: [] });
  await reprise();
  expect(element.textContent).toContain(vide);
});
it("retire une liste déjà reçue lorsque la session expire", async () => {
  port.lire.mockResolvedValueOnce({ demandes: [] });
  await ouvrir();
  expect(element.textContent).toContain(vide);
  port.session = "";
  await act(async () => { window.dispatchEvent(new Event("focus")); });
  expect(element.textContent).not.toContain(vide);
  expect(element.querySelector('[role="alert"]')).not.toBeNull();
  expect(port.lire).toHaveBeenCalledTimes(1);
});

it("ne masque pas une ligne valide et refuse les doublons et le statut de forme ambiguë", async () => {
  port.lire.mockResolvedValueOnce({ demandes: [{ ...demande, webhook_status: ["ok"] }] });
  await ouvrir();
  expect(element.querySelector('[role="alert"]')).not.toBeNull();
  port.lire.mockResolvedValueOnce({ demandes: [demande, demande] });
  await reprise();
  expect(element.querySelector('[role="alert"]')).not.toBeNull();
  port.lire.mockResolvedValueOnce({ demandes: [demande] });
  await reprise();
  expect(element.textContent).toContain("Demande test");
  expect(element.textContent).toContain("Extrait reçu : 1 demande");
});

async function ouvrirDemande() {
  port.lire.mockResolvedValueOnce({ demandes: [demande] });
  await ouvrir();
  const nom = [...element.querySelectorAll("button")].find(b => b.textContent?.includes("Demande test"));
  await act(async () => nom!.click());
  const sauver = [...document.querySelectorAll("button")].find(b => b.textContent?.includes("Enregistrer"));
  expect(sauver).toBeDefined();
  return sauver!;
}
it("le brouillon d’une session remplacée ne part pas sous une autre identité", async () => {
  const sauver = await ouvrirDemande();
  port.session = "autre-session";
  await act(async () => sauver.click());
  expect(port.modifier).not.toHaveBeenCalled();
  expect(element.querySelector('[role="alert"]')).not.toBeNull();
});
it("deux gestes synchrones ne transmettent le brouillon qu’une fois", async () => {
  const sauver = await ouvrirDemande();
  let finir!: (v: unknown) => void;
  port.modifier.mockReturnValue(new Promise(resolve => { finir = resolve; }));
  await act(async () => { sauver.click(); sauver.click(); });
  expect(port.modifier).toHaveBeenCalledTimes(1);
  expect(port.modifier).toHaveBeenCalledWith({ id: demande.id, statut: demande.statut, notes_internes: "" });
  port.session = "autre-session";
  await act(async () => finir({ demande }));
  expect(document.querySelector('[role="dialog"]')).toBeNull();
});
it("le montage StrictMode retire la première lecture avant le transport", async () => {
  port.lire.mockResolvedValue({ demandes: [demande] });
  await act(async () => racine.render(<StrictMode><AdminDemandes /></StrictMode>));
  expect(element.textContent).toContain("Demande test");
  expect(port.lire).toHaveBeenCalledTimes(1);
});
