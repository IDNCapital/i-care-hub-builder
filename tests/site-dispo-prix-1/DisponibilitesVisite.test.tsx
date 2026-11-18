// @vitest-environment jsdom
/**
 * Lot SITE-DISPO-PRIX-1 : disponibilites, prix et demande de visite sur l'accueil.
 * Comme tests/advisor-readers, ce fichier n'est pas joue par la CI (vitest et
 * Testing Library ne sont pas des dependances du depot). Rejeu :
 * npm install --no-save vitest@3.2.4 @testing-library/react@16.3.0 @testing-library/dom@10.4.0
 * puis npx vitest run tests/site-dispo-prix-1
 * Aucun appel reseau : le client Supabase et la mesure d'audience sont des doubles.
 */
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const ports = vi.hoisted(() => ({
  appels: [] as { nom: string; corps: Record<string, unknown> }[],
  reponse: { data: { status: "ok" }, error: null } as { data: unknown; error: unknown },
  mesures: [] as string[],
}));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => { throw Error("client reel interdit"); } }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: {
      invoke: async (nom: string, opts: { body: Record<string, unknown> }) => {
        ports.appels.push({ nom, corps: opts.body });
        return ports.reponse;
      },
    },
    from: () => { throw Error("lecture de table interdite dans ce composant"); },
  },
}));
vi.mock("@/lib/analytics", () => ({ Analytics: { formSubmission: (f: string) => ports.mesures.push(f) } }));

import { CABINETS_A_LOUER, DATE_RELEVE_DISPONIBILITES, resumeOffre, type CabinetALouer } from "@/lib/cabinetsALouer";
import {
  LIEU_A_CONSEILLER,
  corpsDemandeVisite,
  lieuxAccueil,
  premiereDateVisite,
  verifierSaisie,
  type SaisieVisite,
} from "@/lib/demandeVisite";
import { SectionDisponibilitesVisite } from "@/components/accueil/DisponibilitesVisite";

// Radix Checkbox mesure sa taille : double minimal, comme tests/advisor/icare_navigation_mobile.test.tsx.
globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} } as unknown as typeof ResizeObserver;

const NBSP = /[\u00a0\u202f]/g;
const texte = (el: HTMLElement | null) => (el?.textContent ?? "").replace(NBSP, " ");
const monter = (lieux?: CabinetALouer[]) =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <SectionDisponibilitesVisite {...(lieux ? { lieux } : {})} />
    </MemoryRouter>,
  );
const champ = (id: string) => document.getElementById(id) as HTMLInputElement;
const saisir = (id: string, value: string) => fireEvent.change(champ(id), { target: { value } });
const DATE_OK = "2031-01-15";

function remplir(valeurs: Partial<Record<string, string>> = {}) {
  const v = {
    "visite-lieu": "le-bouscat",
    "visite-nom": "Personne Fictive",
    "visite-email": "personne@example.invalid",
    "visite-source": "linkedin",
    "visite-date": DATE_OK,
    "visite-moment": "matin",
    ...valeurs,
  };
  for (const [id, value] of Object.entries(v)) if (value !== undefined) saisir(id, value);
}
const accepter = () => fireEvent.click(screen.getByRole("checkbox"));
const envoyer = () => fireEvent.click(screen.getByRole("button", { name: /Demander la visite/ }));

beforeEach(() => {
  ports.appels = [];
  ports.mesures = [];
  ports.reponse = { data: { status: "ok" }, error: null };
});
afterEach(() => cleanup());

describe("lieux affiches (filtre des projets clos)", () => {
  it("D1 garde Le Bouscat et Toulouse Capitole, ni Chartrons (aucun lot libre au releve) ni Floirac", () => {
    expect(lieuxAccueil().map((c) => c.slug)).toEqual(["le-bouscat", "toulouse-capitole"]);
    expect(CABINETS_A_LOUER.map((c) => c.slug)).toContain("bordeaux-chartrons");
    expect(lieuxAccueil().some((c) => /floirac/i.test(c.slug + c.projetSlug + c.nom))).toBe(false);
  });

  it("D2 rejoue le filtre : un lieu Floirac injecte dans la liste reste exclu", () => {
    const intrus = { ...CABINETS_A_LOUER[0], slug: "floirac", projetSlug: "i-ca-re-floirac", nom: "I-CA.RE Floirac" };
    const intrus2 = { ...CABINETS_A_LOUER[0], slug: "autre", projetSlug: "i-ca-re-floirac", nom: "Autre" };
    expect(lieuxAccueil([...CABINETS_A_LOUER, intrus, intrus2]).map((c) => c.slug)).not.toContain("floirac");
    expect(lieuxAccueil([intrus2])).toEqual([]);
  });

  it("D3 conservation : cabinets rendus = lots des lieux publics, aucun mot Floirac dans la section", () => {
    monter();
    const listes = screen.getAllByRole("list", { name: /^Cabinets disponibles/ });
    expect(listes).toHaveLength(2);
    const attendus = lieuxAccueil().reduce((n, c) => n + c.lots.length, 0);
    expect(listes.reduce((n, l) => n + within(l).getAllByRole("listitem").length, 0)).toBe(attendus);
    expect(attendus).toBe(9 + 4);
    expect(texte(document.body)).not.toMatch(/floirac/i);
  });
});

describe("prix affiches", () => {
  it("P1 chaque lot porte son loyer propre hors charges, la grille a temps partiel est 190, 340, 460", () => {
    monter();
    expect(screen.queryByRole("article", { name: /Chartrons/ })).toBeNull();
    const bouscat = texte(screen.getByRole("article", { name: /Le Bouscat/ }));
    for (const p of ["800", "850", "770", "700", "790", "730", "910"]) expect(bouscat).toContain(`${p} € par mois`);
    expect(bouscat).toContain("Livraison fin mars 2027");
    const toulouse = texte(screen.getByRole("article", { name: /Toulouse Capitole/ }));
    expect(toulouse).toContain("Disponible le 01/03/2027");
    expect(toulouse).toContain("loyer hors charges, non assujetti à la TVA");
    expect(toulouse).not.toContain("Cabinet 3");
    for (const p of ["800", "700", "750"]) expect(toulouse).toContain(`${p} € par mois`);
    const page = texte(document.body);
    for (const p of ["190", "340", "460"]) expect(page).toContain(`${p} € par mois`);
    expect(page).toContain("charges comprises");
  });

  it("P3 releves du 19/11/2026 : Le Bouscat 9 bureaux de 700 a 910, Toulouse 4 cabinets de 700 a 800", () => {
    const par = (slug: string) => lieuxAccueil().find((c) => c.slug === slug)!;
    expect(par("le-bouscat").lots.map((l) => l.libelle)).toEqual(
      ["Bureau 1", "Bureau 2", "Bureau 4", "Bureau 5", "Bureau 6", "Bureau 7", "Bureau 8", "Bureau 9", "Bureau 10"],
    );
    expect(par("le-bouscat").lots.map((l) => l.loyerMensuelEur)).toEqual([800, 850, 770, 770, 700, 790, 730, 730, 910]);
    expect(par("toulouse-capitole").lots.map((l) => [l.libelle, l.loyerMensuelEur])).toEqual(
      [["Cabinet 1", 800], ["Cabinet 2", 700], ["Cabinet 4", 750], ["Cabinet 5", 750]],
    );
  });

  it("P4 la date de releve est une constante et s'affiche sur l'accueil", () => {
    expect(DATE_RELEVE_DISPONIBILITES).toBe("2026-11-19");
    monter();
    expect(texte(document.getElementById("disponibilites"))).toContain("Disponibilités relevées le 19/11/2026");
  });

  it("P5 Chartrons : aucun lot a temps plein, resume sans prix ni infini", () => {
    const chartrons = CABINETS_A_LOUER.find((c) => c.slug === "bordeaux-chartrons")!;
    expect(chartrons.lots).toEqual([]);
    expect(resumeOffre(chartrons)).toBe("Aucun cabinet à temps plein disponible");
    expect(JSON.stringify(chartrons)).not.toMatch(/790|Infinity/);
  });

  it("P2 aucun lieu public : la section ne s'affiche pas", () => {
    monter([]);
    expect(document.getElementById("disponibilites")).toBeNull();
  });
});

describe("demande de visite", () => {
  it("F1 formulaire vide : refus par champ, focus sur le lieu, aucun envoi", async () => {
    monter();
    envoyer();
    await waitFor(() => expect(champ("visite-lieu").getAttribute("aria-invalid")).toBe("true"));
    expect(document.activeElement).toBe(champ("visite-lieu"));
    for (const id of ["visite-nom", "visite-email", "visite-source", "visite-date", "visite-moment", "visite-consentement"]) {
      expect(champ(id).getAttribute("aria-invalid")).toBe("true");
      expect(document.getElementById(champ(id).getAttribute("aria-describedby")!)).not.toBeNull();
    }
    expect(ports.appels).toEqual([]);
  });

  it("F2 le bouton d'une carte preselectionne son lieu", async () => {
    monter();
    const carte = screen.getByRole("article", { name: /Toulouse Capitole/ });
    fireEvent.click(within(carte).getByRole("link", { name: /Demander une visite/ }));
    await waitFor(() => expect(champ("visite-lieu").value).toBe("toulouse-capitole"));
  });

  it("F3 envoi : fonction existante, source et creneau dans extra_data et dans le message", async () => {
    monter();
    remplir({ "visite-telephone": "06 00 00 00 00" });
    saisir("visite-message", "Psychologue, deux jours par semaine.");
    accepter();
    envoyer();
    await screen.findByRole("status");
    expect(ports.appels).toHaveLength(1);
    const { nom, corps } = ports.appels[0];
    expect(nom).toBe("send-contact-lead");
    expect(corps).toMatchObject({
      type: "praticien",
      full_name: "Personne Fictive",
      email: "personne@example.invalid",
      phone: "06 00 00 00 00",
      language: "fr",
      honeypot: "",
      utm_medium: "formulaire-visite-accueil",
      extra_data: {
        formulaire: "visite-accueil",
        lieu: "le-bouscat",
        lieu_nom: "I-CA.RE Le Bouscat",
        source_declaree: "linkedin",
        source_declaree_libelle: "LinkedIn",
        creneau_date: DATE_OK,
        creneau_moment: "matin",
      },
    });
    const message = String(corps.message);
    expect(message).toContain("Lieu : I-CA.RE Le Bouscat");
    expect(message).toContain("Créneau souhaité : 15/01/2031, matin (9 h à 12 h)");
    expect(message).toContain("Connu par : LinkedIn");
    expect(message).toContain("Psychologue, deux jours par semaine.");
    expect(ports.mesures).toEqual(["visite-accueil"]);
  });

  it("F4 source « Autre » sans precision : refus, aucun envoi ; avec precision : envoyee", async () => {
    monter();
    remplir({ "visite-source": "autre" });
    accepter();
    envoyer();
    await waitFor(() => expect(champ("visite-source-precision").getAttribute("aria-invalid")).toBe("true"));
    expect(ports.appels).toEqual([]);
    saisir("visite-source-precision", "Salon professionnel");
    envoyer();
    await screen.findByRole("status");
    expect(ports.appels[0].corps.extra_data).toMatchObject({ source_declaree: "autre", source_precision: "Salon professionnel" });
  });

  it("F5 date passee refusee", async () => {
    monter();
    remplir({ "visite-date": "2020-01-01" });
    accepter();
    envoyer();
    await waitFor(() => expect(champ("visite-date").getAttribute("aria-invalid")).toBe("true"));
    expect(ports.appels).toEqual([]);
  });

  it("F6 refus du serveur : message lisible, formulaire conserve", async () => {
    ports.reponse = { data: { error: "rate_limited" }, error: null };
    monter();
    remplir();
    accepter();
    envoyer();
    expect(texte(await screen.findByRole("alert"))).toContain("Réessayez dans une minute");
    expect(champ("visite-nom").value).toBe("Personne Fictive");
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("F7 lieu « conseillez moi » accepte, sans lieu precis", async () => {
    monter();
    remplir({ "visite-lieu": LIEU_A_CONSEILLER });
    accepter();
    envoyer();
    await screen.findByRole("status");
    expect(ports.appels[0].corps.extra_data).toMatchObject({ lieu: LIEU_A_CONSEILLER, lieu_nom: "Lieu à conseiller" });
  });
});

describe("fonctions pures", () => {
  const base: SaisieVisite = {
    lieu: "le-bouscat", nom: "Nom", email: "a@b.fr", telephone: "", source: "annonce", sourcePrecision: "",
    date: DATE_OK, moment: "fin_de_journee", message: "", consentement: true,
  };

  it("U1 premiere date proposable : le lendemain, passage de mois compris", () => {
    expect(premiereDateVisite(new Date(2026, 10, 18, 23, 30))).toBe("2026-11-19");
    expect(premiereDateVisite(new Date(2026, 11, 31, 8, 0))).toBe("2027-01-01");
  });

  it("U2 saisie complete acceptee ; lieu inconnu (Floirac) refuse", () => {
    expect(verifierSaisie(base, "2026-11-19")).toEqual({});
    expect(verifierSaisie({ ...base, lieu: "floirac" }, "2026-11-19")).toHaveProperty("lieu");
  });

  it("U3 parametres utm d'arrivee conserves", () => {
    const c = corpsDemandeVisite(base, { sourceUrl: "https://i-ca.re/?utm_source=gbp", recherche: "?utm_source=gbp&utm_medium=fiche&utm_campaign=c1", honeypot: "" });
    expect(c).toMatchObject({ utm_source: "gbp", utm_medium: "fiche", utm_campaign: "c1", source_url: "https://i-ca.re/?utm_source=gbp" });
  });
});
