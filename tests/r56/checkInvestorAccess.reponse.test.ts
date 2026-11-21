// @vitest-environment node
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { controlerAccesInvestisseur } from "../../supabase/functions/check-investor-access/controle_acces";

const token = "capacité synthétique pour les essais locaux";
const lead = { id: "fixture", verified_at: "2020-01-01T00:00:00Z", access_token_expires_at: null as string | null };
const requete = (body: unknown) => new Request("https://fixture.invalid/controler", {
  method: "POST", body: JSON.stringify(body),
});

describe("réponse de lecture investisseur", () => {
  it("réserve le booléen vrai au lead confirmé et transmet uniquement une empreinte au lecteur", async () => {
    const lire = vi.fn().mockResolvedValue({ data: lead, error: null });
    const rep = await controlerAccesInvestisseur(requete({ access_token: token }), lire);
    expect(lire).toHaveBeenCalledExactlyOnceWith(createHash("sha256").update(token).digest("hex"));
    expect(rep.status).toBe(200);
    expect(await rep.json()).toEqual({ valid: true });
  });

  it.each([
    ["aucune ligne", null, null, 200, { valid: false }],
    ["ligne expirée", { ...lead, access_token_expires_at: "2001-01-01T00:00:00Z" }, null, 200, { valid: false, reason: "expired" }],
    ["ligne future", { ...lead, access_token_expires_at: "2098-01-01T00:00:00Z" }, null, 200, { valid: true }],
    ["lecture indisponible", null, { message: "fixture confidentielle" }, 500, { valid: false }],
    ["donnée accompagnée d’une erreur", lead, { message: "fixture confidentielle" }, 500, { valid: false }],
    ["ligne incomplète", { ...lead, verified_at: null }, null, 500, { valid: false }],
    ["date illisible", { ...lead, access_token_expires_at: "illisible" }, null, 500, { valid: false }],
  ] as const)("%s", async (_label, data, error, status, attendu) => {
    const rep = await controlerAccesInvestisseur(requete({ access_token: token }), async () => ({ data, error }));
    expect(rep.status).toBe(status);
    expect(await rep.json()).toEqual(attendu);
  });

  it("garde la même réponse générique en cas d’exception", async () => {
    const rep = await controlerAccesInvestisseur(requete({ access_token: token }), async () => { throw Error("fixture"); });
    expect(rep.status).toBe(500);
    expect(await rep.json()).toEqual({ valid: false });
  });

  it.each([null, 42, "court"])("garde les entrées incomplètes hors base", async access_token => {
    const lire = vi.fn();
    const rep = await controlerAccesInvestisseur(requete({ access_token }), lire);
    expect(lire).not.toHaveBeenCalled();
    expect(rep.status).toBe(200);
    expect(await rep.json()).toEqual({ valid: false });
  });

  it.each([["OPTIONS", 200], ["GET", 405]] as const)("préserve le contrat HTTP %s", async (method, status) => {
    const lire = vi.fn();
    const rep = await controlerAccesInvestisseur(new Request("https://fixture.invalid", { method }), lire);
    expect(rep.status).toBe(status);
    expect(rep.headers.get("access-control-allow-origin")).toBe("*");
    expect(lire).not.toHaveBeenCalled();
  });

  it("conserve le lecteur du serveur, ses deux filtres et son sélecteur unique", () => {
    const fichier = readFileSync(new URL("../../supabase/functions/check-investor-access/index.ts", import.meta.url), "utf8");
    expect(fichier).toContain('Deno.serve(req => controlerAccesInvestisseur(req,');
    expect(fichier).toContain('.from("investor_leads")');
    expect(fichier).toContain('.select("id, verified_at, access_token_expires_at")');
    expect(fichier).toContain('.eq("access_token_hash", tokenHash)');
    expect(fichier).toContain('.not("verified_at", "is", null)');
    expect(fichier).toContain('.maybeSingle()');
  });
});
