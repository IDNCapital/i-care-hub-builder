import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminDemandesInstallation from "@/pages/admin/AdminDemandesInstallation";

const auth = vi.hoisted(() => ({
  callAdminFunction: vi.fn(),
  getAdminToken: vi.fn(),
  adminLogout: vi.fn(),
}));
vi.mock("@/lib/adminAuth", () => auth);
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const row = {
  id: "fixture-a", profession_slug: "fixture", ville_slug: null,
  nom: "Installation fictive", email: "fixture@example.invalid",
  telephone: null, message: null, consentement_rgpd: true, source_path: null,
  statut: "nouvelle", notes_internes: null, created_at: "2026-11-21T12:00:00Z",
};

function attente() {
  let resolve!: (value: unknown) => void;
  const promise = new Promise<unknown>((done) => { resolve = done; });
  return { promise, resolve };
}

let root: Root;
let container: HTMLDivElement;
async function mount() {
  await act(async () => root.render(<MemoryRouter><AdminDemandesInstallation /></MemoryRouter>));
}
function bouton(nom: string) {
  const trouve = Array.from(document.querySelectorAll("button"))
    .find(el => el.textContent?.trim() === nom);
  if (!trouve) throw new Error("Bouton absent : " + nom);
  return trouve;
}
async function cliquer(el: HTMLElement) {
  await act(async () => { el.click(); });
}
beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers();
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  auth.getAdminToken.mockReturnValue("session-fictive");
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("Lectures des demandes d'installation", () => {
  it("distingue la lecture en cours et la réception vide dans la fenêtre des 500", async () => {
    const liste = attente();
    auth.callAdminFunction.mockReturnValue(liste.promise);
    await mount();
    expect(container.querySelector('[aria-label="Chargement des demandes"]')).toBeTruthy();
    expect(container.textContent).not.toContain("Aucune demande.");
    expect(auth.callAdminFunction.mock.calls).toEqual([["admin-list-demandes-installation", {}]]);
    await act(async () => liste.resolve({ demandes: [] }));
    expect(container.textContent).toContain("Aucune demande.");
    expect(container.textContent).toContain("0 affichées / 0 reçues");
    expect(container.textContent).toContain("Le serveur ne fournit pas de total global");
  });

  it.each([
    {}, { demandes: null }, { error: "refus", demandes: [] },
    { demandes: [{ ...row, statut: "inconnu" }] },
    { demandes: [{ ...row, consentement_rgpd: undefined }] },
    { demandes: [row, row] }, { demandes: Array(501).fill(row) },
  ])("ferme une réponse incomplète ou incohérente", async (recue) => {
    auth.callAdminFunction.mockResolvedValue(recue);
    await mount();
    expect(container.querySelector('[role="alert"]')).toBeTruthy();
    expect(container.textContent).toContain("Nombre de demandes inconnu");
    expect(container.textContent).not.toContain("Aucune demande.");
    expect(container.querySelector("tbody")).toBeNull();
  });

  it("signale la limite atteinte sur un extrait filtré", async () => {
    const demandes = Array.from({ length: 500 }, (_, n) => ({ ...row, id: String(n), statut: "fermee" }));
    auth.callAdminFunction.mockResolvedValue({ demandes });
    await mount();
    expect(container.textContent).toContain("0 affichées / 500 reçues");
    expect(container.textContent).toContain("Limite atteinte");
  });

  it("ferme une lecture privée de session et une réponse arrivée après changement de session", async () => {
    auth.getAdminToken.mockReturnValue(null);
    await mount();
    expect(auth.callAdminFunction).not.toHaveBeenCalled();
    expect(container.textContent).toContain("Session admin expirée");
    auth.getAdminToken.mockReturnValue("session-a");
    const pending = attente();
    auth.callAdminFunction.mockReturnValue(pending.promise);
    await cliquer(bouton("Réessayer la lecture"));
    auth.getAdminToken.mockReturnValue("session-b");
    await act(async () => pending.resolve({ demandes: [row] }));
    expect(container.textContent).toContain("Session admin modifiée");
    expect(container.textContent).not.toContain(row.nom);
  });

  it("rejette le résultat tardif de la première lecture après une reprise réussie", async () => {
    const premiere = attente();
    auth.callAdminFunction.mockReturnValueOnce(premiere.promise).mockResolvedValue({ demandes: [] });
    await mount();
    await act(async () => { vi.advanceTimersByTime(15_000); });
    expect(container.textContent).toContain("Lecture sans réponse sous 15 secondes");
    await cliquer(bouton("Réessayer la lecture"));
    await act(async () => premiere.resolve({ demandes: [row] }));
    expect(container.textContent).toContain("0 affichées / 0 reçues");
    expect(container.textContent).not.toContain(row.nom);
  });

  it("conserve le verrou du geste existant après relecture, sans nouvel appel de mutation", async () => {
    const ecriture = attente();
    auth.callAdminFunction.mockImplementation((nom: string) =>
      nom === "admin-list-demandes-installation" ? Promise.resolve({ demandes: [row] }) : ecriture.promise);
    await mount();
    await cliquer(container.querySelector("tbody tr")!);
    await cliquer(bouton("Enregistrer"));
    await cliquer(bouton("Actualiser"));
    await cliquer(container.querySelector("tbody tr")!);
    expect(bouton("Enregistrement…").disabled).toBe(true);
    await cliquer(bouton("Enregistrement…"));
    expect(auth.callAdminFunction.mock.calls.filter(([name]) => name === "admin-update-demande-installation"))
      .toEqual([["admin-update-demande-installation", { id: row.id, statut: "nouvelle", notes_internes: "" }]]);
    await act(async () => ecriture.resolve({ demande: row }));
    expect(bouton("Enregistrer").disabled).toBe(false);
  });
  it("la fin de la demande A libère seulement A après relecture des deux demandes", async () => {
    const a = attente();
    const b = attente();
    const deux = { ...row, id: "fixture-b", nom: "Autre demande fictive" };
    auth.callAdminFunction.mockImplementation((nom: string, corps: { id?: string }) =>
      nom === "admin-list-demandes-installation" ? Promise.resolve({ demandes: [row, deux] })
        : corps.id === row.id ? a.promise : b.promise);
    await mount();
    const ouvrir = async (index: number) => cliquer(container.querySelectorAll<HTMLElement>("tbody tr")[index]);
    await ouvrir(0);
    await cliquer(bouton("Enregistrer"));
    await cliquer(bouton("Fermer"));
    await ouvrir(1);
    await cliquer(bouton("Enregistrer"));
    await cliquer(bouton("Actualiser"));
    await act(async () => a.resolve({ demande: row }));
    await ouvrir(1);
    expect(bouton("Enregistrement…").disabled).toBe(true);
    await cliquer(bouton("Enregistrement…"));
    await cliquer(bouton("Fermer"));
    await ouvrir(0);
    expect(bouton("Enregistrer").disabled).toBe(false);
    expect(auth.callAdminFunction.mock.calls.filter(([nom]) => nom === "admin-update-demande-installation"))
      .toHaveLength(2);
    await act(async () => b.resolve({ demande: deux }));
  });
});
