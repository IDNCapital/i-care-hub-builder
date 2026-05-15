// Edge Function : admin-delete-praticien
// Suppression DEFINITIVE d'une fiche praticien. Auth admin HMAC + double confirmation serveur.
// Garde-fou : refuse si la fiche est live (statut_validation='validee' ET actif=true).

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function b64urlDecodeToString(s: string): string {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
function b64urlEncode(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function hmacSign(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message),
  );
  return b64urlEncode(new Uint8Array(sig));
}
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
async function verifyAdminToken(token: string | null, secret: string): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [h, p, s] = parts;
  const expected = await hmacSign(secret, `${h}.${p}`);
  if (!constantTimeEqual(expected, s)) return false;
  try {
    const payload = JSON.parse(b64urlDecodeToString(p));
    if (typeof payload.exp !== "number") return false;
    if (payload.exp < Math.floor(Date.now() / 1000)) return false;
    if (payload.scope !== "admin") return false;
    return true;
  } catch {
    return false;
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function extractStoragePath(publicUrl: string, bucket: string): string | null {
  try {
    const u = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${bucket}/`;
    const idx = u.pathname.indexOf(marker);
    if (idx === -1) return null;
    const path = u.pathname.slice(idx + marker.length);
    return path ? decodeURIComponent(path) : null;
  } catch {
    return null;
  }
}

async function audit(
  client: ReturnType<typeof createClient>,
  description: string,
  payload: Record<string, unknown>,
) {
  try {
    await client.from("icare_idnos_audit_log").insert({
      event_type: "praticien_deleted",
      function_name: "admin-delete-praticien",
      description,
      triggered_by: "admin",
      payload_json: payload,
    });
  } catch (e) {
    console.error("audit_log insert failed", e);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const sessionSecret = Deno.env.get("ADMIN_SESSION_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!sessionSecret || !supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const adminToken = req.headers.get("x-admin-token");
  const tokenOk = await verifyAdminToken(adminToken, sessionSecret);
  if (!tokenOk) {
    await new Promise((r) => setTimeout(r, 600));
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: { praticien_id?: string; confirmation?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const praticienId = (body.praticien_id ?? "").trim();
  const confirmation = body.confirmation ?? "";
  if (!UUID_RE.test(praticienId)) {
    return new Response(JSON.stringify({ error: "praticien_id invalide" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!constantTimeEqual(confirmation, "SUPPRIMER")) {
    return new Response(JSON.stringify({ error: "Confirmation invalide" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey);

  const { data: fiche, error: fetchErr } = await admin
    .from("praticiens")
    .select("id, prenom, nom, slug, photo_url, statut_validation, actif")
    .eq("id", praticienId)
    .maybeSingle();
  if (fetchErr) {
    return new Response(JSON.stringify({ error: fetchErr.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!fiche) {
    return new Response(JSON.stringify({ error: "Fiche introuvable" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const isLive =
    fiche.statut_validation === "validee" && fiche.actif === true;
  const allowed =
    ["brouillon", "refusee"].includes(fiche.statut_validation) ||
    fiche.actif === false;
  if (isLive || !allowed) {
    return new Response(
      JSON.stringify({ error: "Désactivez la fiche avant suppression." }),
      {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // 1) Photo storage
  let photoRemoved = false;
  if (fiche.photo_url) {
    const path = extractStoragePath(fiche.photo_url, "praticiens-photos");
    if (path) {
      const { error: rmErr } = await admin.storage
        .from("praticiens-photos")
        .remove([path]);
      if (rmErr) {
        console.error("photo remove failed", path, rmErr);
      } else {
        photoRemoved = true;
      }
    }
  }

  // 2) Nettoyage taxonomy_candidates : retirer l'UUID des tableaux
  try {
    const { data: candidats } = await admin
      .from("taxonomy_candidates")
      .select("id, praticiens_ids")
      .contains("praticiens_ids", [praticienId]);
    for (const c of candidats ?? []) {
      const next = (c.praticiens_ids ?? []).filter(
        (x: string) => x !== praticienId,
      );
      await admin
        .from("taxonomy_candidates")
        .update({ praticiens_ids: next })
        .eq("id", c.id);
    }
  } catch (e) {
    console.error("taxonomy_candidates cleanup failed", e);
  }

  // 3) DELETE physique
  const { error: delErr } = await admin
    .from("praticiens")
    .delete()
    .eq("id", praticienId);
  if (delErr) {
    return new Response(JSON.stringify({ error: delErr.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  await audit(admin, `Suppression définitive ${fiche.prenom} ${fiche.nom}`, {
    praticien_id: praticienId,
    slug: fiche.slug,
    statut_validation: fiche.statut_validation,
    actif: fiche.actif,
    photo_removed: photoRemoved,
    deleted_at: new Date().toISOString(),
  });

  return new Response(
    JSON.stringify({ success: true, photo_removed: photoRemoved }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});