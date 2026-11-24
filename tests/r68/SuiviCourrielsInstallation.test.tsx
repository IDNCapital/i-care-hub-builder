import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";
import AdminDemandesInstallation from "@/pages/admin/AdminDemandesInstallation";
import { SuiviCourrielsInstallation, type TracesCourrielsInstallation } from "@/components/admin/SuiviCourrielsInstallation";

const auth = vi.hoisted(() => ({ callAdminFunction: vi.fn(), getAdminToken: () => "fixture", adminLogout: vi.fn() }));
vi.mock("@/lib/adminAuth", () => auth);

function texte(traces: TracesCourrielsInstallation) {
  const div = document.createElement("div");
  div.innerHTML = renderToStaticMarkup(<SuiviCourrielsInstallation traces={traces} />);
  return div.textContent ?? "";
}

it("lit les deux horodatages historiques à l’heure de Paris", () => {
  const sortie = texte({ ack_sent_at: "2026-07-01T23:30:12.123456+00:00", notified_at: "2026-12-01T08:59:12Z" });
  expect(sortie).toMatch(/02\/07\/2026\D+01:30/);
  expect(sortie).toMatch(/01\/12\/2026\D+09:59/);
  expect(sortie).toContain("La réception dans chaque boîte reste à vérifier séparément.");
});
it.each([null, undefined])("accepte les données anciennes sans trace", valeur => {
  expect(texte({ ack_sent_at: valeur }).match(/Aucune trace d’envoi enregistrée/g)).toHaveLength(2);
});
it.each(["2026-02-30T12:00:00Z", "invalid", "2026-12-01", "", "2026-12-01T12:30:00"])("signale un horodatage illisible", valeur => {
  expect(texte({ notified_at: valeur })).toContain("Horodatage illisible");
});
it("conserve les deux étapes et un reçu antérieur malgré un incident", () => {
  const sortie = texte({ ack_sent_at: "2026-12-01T08:00:00Z", email_send_error: "ack: smtp_acceptation_non_confirmee / notification: smtp_destinataire_refuse" });
  expect(sortie).toContain("Envoi horodaté");
  expect(sortie).toContain("Accusé au candidat, l’acceptation par le serveur reste à confirmer.");
  expect(sortie).toContain("Notification à l’équipe, le serveur a refusé au moins un destinataire.");
});
it("signale les journaux anciens sans exposer leur contenu", () => {
  expect(texte({ email_send_error: "smtp_not_configured" })).toContain("Service de courriel non configuré");
  const sortie = texte({ email_send_error: "notification: fixture@site.invalid / ack: smtp_destinataire_refuse" });
  expect(sortie).toContain("Un incident de courriel");
  expect(sortie).not.toContain("fixture@site.invalid");
  expect(sortie).not.toContain("refusé au moins un destinataire");
});
it("ouvre la trace de la demande sélectionnée dans la vraie page par une seule lecture", async () => {
  const conteneur = document.createElement("div");
  document.body.append(conteneur);
  const root = createRoot(conteneur);
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const row = { id: "fictive", nom: "Demande de test", profession_slug: "test", ville_slug: null, email: "test@example.invalid", telephone: null, message: null, consentement_rgpd: true, source_path: null, statut: "nouvelle", notes_internes: null, created_at: "2026-11-21T12:00:00Z", ack_sent_at: "2026-12-01T11:30:00Z", notified_at: null, email_send_error: "notification: smtp_destinataire_refuse" };
  auth.callAdminFunction.mockResolvedValue({ demandes: [row] });
  try {
    await act(async () => root.render(<MemoryRouter><AdminDemandesInstallation /></MemoryRouter>));
    await act(async () => { conteneur.querySelector<HTMLElement>("tbody tr")!.click(); });
    const suivi = document.querySelector('[aria-label="Suivi des courriels"]');
    expect(suivi?.textContent).toContain("Envoi horodaté");
    expect(suivi?.textContent).toContain("Notification à l’équipe, le serveur a refusé au moins un destinataire.");
    expect(auth.callAdminFunction.mock.calls).toEqual([["admin-list-demandes-installation", {}]]);
  } finally {
    await act(async () => root.unmount());
    conteneur.remove();
    vi.unstubAllGlobals();
  }
});
