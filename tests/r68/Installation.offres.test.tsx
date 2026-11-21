import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { onlineManager } from "@tanstack/react-query";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { CAPITOLE_ADRESSE, CAPITOLE_SLUG } from "@/lib/capitoleAdresse";
import SinstallerIndex from "@/pages/SinstallerIndex";
import SinstallerDetail from "@/pages/SinstallerDetail";

const lecture = vi.hoisted(() => ({ transport: vi.fn<typeof fetch>() }));
vi.mock("@/integrations/supabase/client", async () => {
  const { createClient } = await import("@supabase/supabase-js");
  return { supabase: createClient("https://fixture.invalid", "cle-fictive", {
    accessToken: async () => "session-fictive",
    global: { fetch: (input, options) => lecture.transport(input, options) },
  }) };
});
vi.mock("@/components/Layout", () => ({ Layout: ({ children }: { children: ReactNode }) => <main>{children}</main> }));
vi.mock("@/components/FormulaireInteretInstallation", () => ({
  FormulaireInteretInstallation: () => <form aria-label="Demande de dossier" />,
}));
vi.mock("@/pages/NotFound", () => ({ default: () => <p>Offre introuvable</p> }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ i18n: { language: "fr" }, t: (key: string) => key }) }));

const occupation = {
  id: "metier-1", slug: "soin", nom_masculin_singulier: "Soignant", nom_feminin_singulier: "Soignante",
  nom_inclusif_pluriel: "Soignants", ordre_affichage: 1, actif: true, page_installation: true,
};
const cabinet = {
  id: "projet-1", slug: CAPITOLE_SLUG, slug_installation: "toulouse-capitole", name: "Cabinet Capitole",
  city: "Toulouse", address: "Adresse historique fictive", date_ouverture_cible: null, lat: null, lng: null,
  google_place_id: null, status: "en_exploitation",
};
const offre = {
  profession_slug: occupation.slug, profession_libelle: occupation.nom_inclusif_pluriel, profession_ordre: 1,
  ville_slug: cabinet.slug_installation, cabinet_nom_complet: cabinet.name, cabinet_adresse: cabinet.address,
  cabinet_ville: cabinet.city, date_ouverture: null, url_path: "/sinstaller/soin/toulouse-capitole",
  projet_id: cabinet.id, profession_id: occupation.id,
};
type Ligne = Record<string, unknown>;
let tables: Record<string, Ligne[]>;
let app: Root;
let host: HTMLDivElement;
let requetes: Array<{ table: string; methode: string; url: URL }>;

function servir(input: RequestInfo | URL, options: RequestInit = {}) {
  const url = new URL(String(input));
  const table = url.pathname.split("/").at(-1)!;
  const methode = options.method ?? "GET";
  const rows = tables[table];
  if (!rows || !["HEAD", "GET"].includes(methode)) throw Error("Lecture hors périmètre");
  const headers = new Headers(options.headers);
  expect(headers.get("Prefer")).toContain("count=exact");
  expect(url.origin).toBe("https://fixture.invalid");
  expect(url.searchParams.get("select")).not.toBe("*");
  requetes.push({ table, methode, url });
  const index = Number(url.searchParams.get("offset") ?? 0);
  const source = rows.slice(index, index + 1);
  return new Response(methode === "HEAD" ? null : JSON.stringify(source), {
    status: rows.length > 1 ? 206 : 200,
    headers: { "Content-Type": "application/json", "Content-Range": rows.length ? index + "-" + index + "/" + rows.length : "*/0" },
  });
}

async function afficher(chemin: string) {
  await act(async () => {
    app.render(<MemoryRouter initialEntries={[chemin]}>
      <Routes>
        <Route path="/sinstaller" element={<SinstallerIndex />} />
        <Route path="/sinstaller/:profession/:ville" element={<SinstallerDetail />} />
      </Routes>
    </MemoryRouter>);
  });
}
async function attendre(verifier: () => void) {
  await vi.waitFor(async () => {
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 5)); });
    verifier();
  }, { timeout: 1800 });
}
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  host = document.createElement("div"); document.body.append(host); app = createRoot(host);
  tables = {
    projets: [cabinet], professions: [occupation], installation_pages: [offre],
    installation_content_ville: [], installation_content_profession: [], installation_content_common: [],
  };
  requetes = [];
  lecture.transport.mockReset().mockImplementation(async (input, options) => servir(input, options));
  vi.stubGlobal("fetch", vi.fn(() => { throw Error("Tout transport extérieur au double est fermé"); }));
});
afterEach(async () => {
  await act(async () => app.unmount());
  onlineManager.setOnline(true);
  expect(fetch).not.toHaveBeenCalled();
  host.remove(); vi.useRealTimers(); vi.unstubAllGlobals();
  Reflect.deleteProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT");
});

it("compose l’index des seules offres publiables après les pages et le contrôle HEAD", async () => {
  tables.projets.push({ ...cabinet, id: "retire", slug: "floirac", name: "Ancienne offre", slug_installation: "ville-fermee" });
  await afficher("/sinstaller");
  await attendre(() => expect(host.querySelector('a[href="/sinstaller/soin/toulouse-capitole"]')).not.toBeNull());
  expect(host.textContent).toContain(CAPITOLE_ADRESSE);
  expect(host.textContent).not.toContain("Ancienne offre");
  expect(requetes.filter(r => r.table === "projets").map(r => r.methode)).toEqual(["GET", "GET", "HEAD"]);
  expect(requetes[0].url.searchParams.get("order")).toMatch(/,id\.asc$/);
});
it("relie la vue de l’offre, le cabinet et sa profession et respecte l’adresse décidée", async () => {
  await afficher(offre.url_path);
  await attendre(() => expect(host.textContent).toContain(CAPITOLE_ADRESSE));
  expect(host.textContent).not.toContain(cabinet.address);
  expect(host.querySelector("form")).not.toBeNull();
  const requete = requetes.find(r => r.table === "installation_pages")!.url.searchParams;
  expect(requete.get("ville_slug")).toBe("eq.toulouse-capitole");
  expect(requete.get("profession_slug")).toBe("eq.soin");
  expect(requete.get("select")?.split(",").sort()).toEqual(Object.keys(offre).sort());
});
it.each(["floirac", "i-ca-re-floirac"])("ne lit aucune donnée d’une offre retirée (%s)", async (ville) => {
  await afficher("/sinstaller/soin/" + ville);
  expect(host.textContent).toContain("Offre introuvable");
  expect(lecture.transport).not.toHaveBeenCalled();
  expect(host.querySelector("form")).toBeNull();
});
it("distingue la panne d’un complément de l’offre reçue, puis reprend cette seule source", async () => {
  let disponible = false;
  lecture.transport.mockImplementation(async (input, options) => {
    if (String(input).includes("/installation_content_ville?") && !disponible)
      return new Response(JSON.stringify({ message: "Service fictif indisponible" }), { status: 403 });
    return servir(input, options);
  });
  await afficher(offre.url_path);
  await attendre(() => expect(host.textContent).toContain("Réessayer"));
  expect(host.querySelector("form")).not.toBeNull();
  const base = requetes.filter(r => r.table === "installation_pages").length;
  disponible = true;
  const bouton = [...host.querySelectorAll("button")].find(b => b.textContent?.includes("Réessayer"))!;
  await act(async () => bouton.click());
  await attendre(() => expect(host.textContent).not.toContain("Réessayer"));
  expect(requetes.filter(r => r.table === "installation_pages")).toHaveLength(base);
});
it("borne aussi une lecture bloquée au départ quand le navigateur annonce hors ligne", async () => {
  vi.useFakeTimers(); onlineManager.setOnline(false);
  lecture.transport.mockImplementation(() => new Promise(() => {}));
  await afficher("/sinstaller");
  expect(lecture.transport).toHaveBeenCalled();
  await act(async () => { await vi.advanceTimersByTimeAsync(15_001); });
  await act(async () => { await vi.advanceTimersByTimeAsync(2); });
  expect(host.textContent).toContain("Les cabinets ne peuvent pas être chargés.");
  expect(host.textContent).not.toContain("Aucun cabinet proposé actuellement.");
});
