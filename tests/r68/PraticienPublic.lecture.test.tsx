import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PraticienPublic from "@/pages/PraticienPublic";

const { from } = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { from } }));
vi.mock("@/components/avis/SectionAvisGoogle", () => ({ SectionAvisGoogle: () => null }));

type Resultat = { data: unknown; error: unknown };
type Demande = { table: string; colonnes: string; filtres: Record<string, unknown>; signal: AbortSignal };
const demandes: Demande[] = [];
let repondre: (demande: Demande) => Promise<Resultat>;
let racine: Root;
let support: HTMLDivElement;

function profil(slug: string) {
  return { slug, prenom: slug, nom: "Exemple", cabinet_slug: "cab-" + slug, profession: "Test",
    specialites: [], bio_courte: null, bio_longue: null, photo_url: null, google_place_id: null, lien_rdv: null };
}
function cabinet(slug: string) {
  return { slug, name: "I-CA.RE " + slug, city: "Ville test", address: "Adresse masquée", show_address: false };
}
function recu(demande: Demande) {
  const slug = String(demande.filtres.slug);
  return Promise.resolve({ data: demande.table === "praticiens" ? profil(slug) : cabinet(slug), error: null });
}
function Parcours() {
  const aller = useNavigate();
  return <><button onClick={() => aller("/praticien/beta")}>Autre profil</button>
    <Routes><Route path="/praticien/:slug" element={<PraticienPublic />} /></Routes></>;
}
async function ouvrir() {
  await act(async () => racine.render(<MemoryRouter initialEntries={["/praticien/alpha"]}><Parcours /></MemoryRouter>));
}
async function cliquer(label: string) {
  const bouton = Array.from(support.querySelectorAll("button")).find(n => n.textContent === label);
  expect(bouton).toBeDefined();
  await act(async () => bouton!.click());
}
function personne() {
  const script = support.querySelector('script[type="application/ld+json"]');
  return script ? JSON.parse(script.textContent || "{}") : null;
}

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  demandes.length = 0;
  repondre = recu;
  from.mockReset().mockImplementation((table: string) => {
    if (table !== "praticiens" && table !== "projets") throw Error("Source inattendue");
    const filtres: Record<string, unknown> = {};
    let colonnes = "", signal: AbortSignal;
    const requete = {
      select(champs: string) { colonnes = champs; return this; },
      eq(cle: string, valeur: unknown) { filtres[cle] = valeur; return this; },
      abortSignal(s: AbortSignal) { signal = s; return this; },
      maybeSingle() {
        const demande = { table, filtres, colonnes, signal };
        demandes.push(demande);
        return repondre(demande);
      },
    };
    return requete;
  });
  support = document.createElement("div");
  document.body.appendChild(support);
  racine = createRoot(support);
});
afterEach(async () => {
  await act(async () => racine.unmount());
  support.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("Fiche du praticien de la visite courante", () => {
  it("charge uniquement les champs publics et utilise le même cabinet pour la page et les métadonnées", async () => {
    await ouvrir();
    expect(demandes.map(d => d.table)).toEqual(["praticiens", "projets"]);
    expect(demandes[0].filtres).toEqual({ slug: "alpha", statut_validation: "validee", actif: true });
    expect(demandes[0].colonnes.split(",").sort()).toEqual([
      "bio_courte", "bio_longue", "cabinet_slug", "google_place_id", "lien_rdv", "nom", "photo_url", "prenom",
      "profession", "slug", "specialites",
    ]);
    expect(demandes[1].filtres.slug).toBe("cab-alpha");
    expect(personne().name).toBe("alpha Exemple");
    expect(support.textContent).not.toContain("Adresse masquée");
  });

  it.each(["praticiens", "projets"])("une ancienne réponse %s ne remplace pas la visite suivante", async table => {
    let finir!: (resultat: Resultat) => void;
    repondre = d => d.table === table && String(d.filtres.slug).endsWith("alpha")
      ? new Promise(resolve => { finir = resolve; }) : recu(d);
    await ouvrir();
    const ancienne = demandes[demandes.length - 1];
    await cliquer("Autre profil");
    expect(ancienne.signal.aborted).toBe(true);
    await act(async () => finir(await recu(ancienne)));
    expect(personne().name).toBe("beta Exemple");
    expect(support.textContent).not.toContain("alpha Exemple");
  });

  it("un profil absent n’interroge pas les cabinets et une erreur de transport autorise une reprise", async () => {
    repondre = async () => ({ data: null, error: { message: "indisponible" } });
    await ouvrir();
    expect(support.querySelector('[role="alert"]')).not.toBeNull();
    repondre = async () => ({ data: null, error: null });
    await cliquer("Réessayer");
    expect(support.textContent).toContain("Cette fiche n'est pas disponible");
    expect(demandes.map(d => d.table)).toEqual(["praticiens", "praticiens"]);
  });

  it("conserve un seul budget de quinze secondes quand le cabinet commence après le profil", async () => {
    vi.useFakeTimers();
    repondre = d => d.table === "praticiens" ? new Promise(resolve => {
      setTimeout(async () => resolve(await recu(d)), 10000);
    }) : new Promise(() => {});
    await ouvrir();
    await act(async () => { await vi.advanceTimersByTimeAsync(10000); });
    expect(demandes).toHaveLength(2);
    await act(async () => { await vi.advanceTimersByTimeAsync(5000); });
    expect(support.querySelector('[role="alert"]')?.textContent).toContain("15 secondes");
    expect(demandes[1].signal.aborted).toBe(true);
    expect(personne()).toBeNull();
    repondre = recu;
    await cliquer("Réessayer");
    expect(personne().name).toBe("alpha Exemple");
  });

  it("conserve une fiche publique sans cabinet confirmé et refuse un cabinet différent", async () => {
    repondre = d => d.table === "projets" ? Promise.resolve({ data: null, error: null }) : recu(d);
    await ouvrir();
    expect(personne().worksFor).toBeUndefined();
    expect(support.textContent).toContain("Aucun cabinet associé");
    repondre = d => d.table === "projets" ? Promise.resolve({ data: cabinet("hors-scope"), error: null }) : recu(d);
    await cliquer("Autre profil");
    expect(support.querySelector('[role="alert"]')).not.toBeNull();
    expect(personne()).toBeNull();
  });
});
