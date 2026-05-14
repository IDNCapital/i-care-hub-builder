import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function b64urlEncode(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDecodeToString(s: string): string {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
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
async function verifyAdminToken(
  token: string | null,
  secret: string,
): Promise<boolean> {
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

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ALLOWED_STATUS = [
  "brouillon",
  "preview_envoyee",
  "validee",
  "refusee",
  "non_repondeuse",
  "en_attente_infos",
  "en_attente_resolution",
];

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
  if (!sessionSecret) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const token = req.headers.get("x-admin-token");
  const ok = await verifyAdminToken(token, sessionSecret);
  if (!ok) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Validation minimale
  const errors: string[] = [];
  const prenom = (body.prenom ?? "").toString().trim();
  const nom = (body.nom ?? "").toString().trim();
  const profession = (body.profession ?? "").toString().trim();
  const cabinet_slug = (body.cabinet_slug ?? "").toString().trim();
  let slug = (body.slug ?? "").toString().trim();
  if (!slug) slug = slugify(`${prenom} ${nom}`);
  if (!prenom) errors.push("prenom requis");
  if (!nom) errors.push("nom requis");
  if (!profession) errors.push("profession requise");
  if (!cabinet_slug) errors.push("cabinet requis");
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) errors.push("slug invalide");
  const statut_validation = (body.statut_validation ?? "brouillon").toString();
  if (!ALLOWED_STATUS.includes(statut_validation)) errors.push("statut invalide");
  if (errors.length > 0) {
    return new Response(JSON.stringify({ error: "Validation", details: errors }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Si update via id explicite, faire update; sinon upsert sur slug
  const id = body.id ? body.id.toString() : null;

  const row: Record<string, any> = {
    slug,
    cabinet_slug,
    prenom,
    nom,
    genre: body.genre ?? null,
    profession,
    specialites: Array.isArray(body.specialites) ? body.specialites : [],
    problematiques: Array.isArray(body.problematiques) ? body.problematiques : [],
    bio_courte: body.bio_courte ?? null,
    bio_courte_en: body.bio_courte_en ?? null,
    bio_longue: body.bio_longue ?? null,
    bio_longue_en: body.bio_longue_en ?? null,
    photo_url: body.photo_url ?? null,
    lien_rdv: body.lien_rdv ?? null,
    google_place_id: body.google_place_id || null,
    google_kgmid: body.google_kgmid || null,
    google_cid: body.google_cid || null,
    statut_validation,
    date_envoi_preview: body.date_envoi_preview || null,
    date_validation: body.date_validation || null,
    notes_internes: body.notes_internes ?? null,
    actif: body.actif === false ? false : true,
    ordre_affichage: Number.isFinite(body.ordre_affichage)
      ? Number(body.ordre_affichage)
      : 0,
  };

  let result;
  if (id) {
    const { data, error } = await supabase
      .from("praticiens")
      .update(row)
      .eq("id", id)
      .select()
      .single();
    result = { data, error };
  } else {
    const { data, error } = await supabase
      .from("praticiens")
      .upsert(row, { onConflict: "slug" })
      .select()
      .single();
    result = { data, error };
  }

  if (result.error) {
    return new Response(
      JSON.stringify({ error: result.error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // Fire-and-forget : extraction automatique des tags si la fiche est dans
  // un statut où l'extraction a du sens. Idempotent côté extracteur (hash bio).
  try {
    const praticienId = result.data?.id;
    const cronSecret = Deno.env.get("CRON_TOKEN");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    if (
      praticienId &&
      cronSecret &&
      supabaseUrl &&
      ["brouillon", "preview_envoyee", "validee"].includes(statut_validation)
    ) {
      // Pas de await : ne bloque pas la réponse admin
      fetch(`${supabaseUrl}/functions/v1/extract-praticien-tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cron-token": cronSecret,
        },
        body: JSON.stringify({ praticien_id: praticienId, force: false }),
      }).catch((err) => console.error("extract-praticien-tags fire-and-forget", err));
    }
  } catch (e) {
    console.error("extract trigger error", e);
  }

  return new Response(JSON.stringify({ data: result.data }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});