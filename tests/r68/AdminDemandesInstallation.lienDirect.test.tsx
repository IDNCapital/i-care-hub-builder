import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import AdminDemandesInstallation from "@/pages/admin/AdminDemandesInstallation";
import { AdminGuard } from "@/components/AdminGuard";

const auth = vi.hoisted(() => ({ callAdminFunction: vi.fn(), getAdminToken: vi.fn(), adminLogout: vi.fn(), isAdminAuthenticated: vi.fn() }));
vi.mock("@/lib/adminAuth", () => auth);
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
const id = "11111111-1111-4000-8000-111111111111";
const voisin = "22222222-2222-4000-8000-222222222222";
const chemin = "/admin/demandes-installation";
const demande = {
  id, profession_slug: "fixture", ville_slug: null, nom: "Dossier fermé", email: "praticien@example.invalid",
  telephone: null, message: null, consentement_rgpd: true, source_path: null, statut: "fermee",
  notes_internes: "Note fictive", created_at: "2026-11-22T12:00:00Z",
};
let root: Root;
let conteneur: HTMLDivElement;
function Navigation() {
  const lieu = useLocation();
  const nav = useNavigate();
  return <><output>{lieu.pathname + lieu.search}</output><button onClick={() => nav(chemin + "?id=" + voisin)}>Suivant</button></>;
}
function Retour() {
  const lieu = useLocation();
  return <output>{lieu.state?.from}</output>;
}
async function ouvrir(url = chemin + "?id=" + id) {
  await act(async () => root.render(<MemoryRouter initialEntries={[url]}>
    <Routes><Route path={chemin} element={<AdminGuard><Navigation /><AdminDemandesInstallation /></AdminGuard>} />
      <Route path="/admin/login" element={<Retour />} /></Routes></MemoryRouter>));
}
function bouton(texte: string) {
  const bouton = Array.from(document.querySelectorAll("button")).find(b => b.textContent?.trim() === texte);
  if (!bouton) throw Error("Bouton absent " + texte);
  return bouton;
}
beforeEach(() => {
  vi.resetAllMocks(); auth.getAdminToken.mockReturnValue("session-fictive"); auth.isAdminAuthenticated.mockReturnValue(true);
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT",true);
  conteneur = document.createElement("div"); document.body.append(conteneur); root = createRoot(conteneur);
});
afterEach(async () => { await act(async () => root.unmount()); conteneur.remove(); vi.unstubAllGlobals(); });

it("retrouve par son identifiant une demande fermée puis rend la liste en conservant les autres paramètres", async () => {
  auth.callAdminFunction.mockImplementation(async (_nom, corps) => ({ demandes: corps.id ? [demande] : [] }));
  await ouvrir(chemin + "?source=courriel&id=" + id);
  expect(document.querySelector('[role="dialog"]')?.textContent).toContain("Dossier fermé");
  expect(conteneur.textContent).not.toContain("500 demandes");
  expect(auth.callAdminFunction.mock.calls).toEqual([["admin-list-demandes-installation", {id}]]);
  await act(async () => { bouton("Fermer").click(); });
  expect(document.querySelector('[role="dialog"]')).toBeNull();
  expect(document.querySelector("output")?.textContent).toBe(chemin + "?source=courriel");
  expect(auth.callAdminFunction.mock.calls.slice(-1)[0]).toEqual(["admin-list-demandes-installation", {}]);
});
it("la connexion reçoit la destination complète", async () => {
  auth.isAdminAuthenticated.mockReturnValue(false);
  await ouvrir(); expect(document.querySelector("output")?.textContent).toBe(chemin + "?id=" + id);
  expect(auth.callAdminFunction).not.toHaveBeenCalled();
});
it("un reçu pour un autre identifiant ne divulgue aucun dossier", async () => {
  auth.callAdminFunction.mockResolvedValue({demandes:[{...demande,id:voisin}]});
  await ouvrir(); expect(document.querySelector('[role="dialog"]')).toBeNull();
  expect(document.querySelector('[role="alert"]')?.textContent).toMatch(/incohérent/i);
  expect(conteneur.textContent).not.toContain(demande.nom);
});
it("un dossier absent offre un retour à la liste", async () => {
  auth.callAdminFunction.mockResolvedValue({demandes:[]});
  await ouvrir(); expect(conteneur.textContent).toMatch(/demande introuvable/i);
  await act(async () => { bouton("Toutes les demandes").click(); });
  expect(document.querySelector("output")?.textContent).toBe(chemin);
});
it("une réponse tardive ne remplace pas la deuxième demande", async () => {
  let finir!: (valeur: unknown) => void;
  auth.callAdminFunction.mockImplementation((_nom, corps) => corps.id === id ? new Promise(resolve => { finir = resolve; }) : Promise.resolve({demandes:[{...demande,id:voisin,nom:"Second dossier"}]}));
  await ouvrir(); await act(async () => { bouton("Suivant").click(); });
  await act(async () => { finir({demandes:[demande]}); });
  expect(document.querySelector('[role="dialog"]')?.textContent).toContain("Second dossier");
  expect(document.body.textContent).not.toContain(demande.nom);
});
