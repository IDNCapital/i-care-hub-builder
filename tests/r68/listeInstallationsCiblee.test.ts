import type { Database } from "../../src/integrations/supabase/types";
import { expect, it, vi } from "vitest";
import { lireCible, selectionnerDemandes } from "../../supabase/functions/admin-list-demandes-installation/lecture";

const id = "aaaaaaaa-1111-4000-8000-111111111111";
function requete() {
  const limit = vi.fn((nombre: number) => nombre);
  return { eq: vi.fn(() => ({limit})), order: vi.fn(() => ({limit})), limit };
}
it.each(["", "{}"])("garde la liste historique pour un appel sans id", texte => {
  const q = requete(); expect(selectionnerDemandes(q,lireCible(texte))).toBe(500);
  expect(q.order).toHaveBeenCalledWith("created_at",{ascending:false}); expect(q.eq).not.toHaveBeenCalled();
});
it("filtre par l’UUID avant toute limite", () => {
  const q = requete(); expect(selectionnerDemandes(q,lireCible(JSON.stringify({id:id.toUpperCase()})))).toBe(1);
  expect(q.eq).toHaveBeenCalledWith("id",id); expect(q.order).not.toHaveBeenCalled(); expect(q.limit).toHaveBeenCalledWith(1);
});
it.each(['{"id":""}','{"id":null}','{"id":"malforme"}','[]','null','{'])("refuse un corps invalide", texte => {
  expect(() => lireCible(texte)).toThrow();
});

it("le SDK encode le filtre exact dans la requête à PostgREST", async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const requetes: URL[] = [];
  const client = createClient<Database>("https://test.invalid", "cle-fictive", {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: async (source) => {
      requetes.push(new URL(source instanceof Request ? source.url : source.toString()));
      return new Response("[]", {status: 200, headers: {"Content-Type":"application/json"}});
    }},
  });
  const { error } = await selectionnerDemandes(client.from("demandes_installation").select("*"), id);
  expect(error).toBeNull();
  expect(requetes).toHaveLength(1);
  expect(requetes[0].pathname).toBe("/rest/v1/demandes_installation");
  expect(requetes[0].searchParams.get("id")).toBe("eq." + id);
  expect(requetes[0].searchParams.get("limit")).toBe("1");
});
