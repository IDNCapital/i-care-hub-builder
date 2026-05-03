import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-idnos-signature",
};

// ═══ Whitelist of fields IDN OS is allowed to push ═══
const ALLOWED_FIELDS: Record<string, string> = {
  bio_courte: "modifiable depuis IDN OS",
  bio_longue: "modifiable depuis IDN OS",
  specialites: "modifiable depuis IDN OS (array)",
  problematiques: "modifiable depuis IDN OS (array)",
  lien_rdv: "modifiable depuis IDN OS (URL)",
  photo_url: "modifiable depuis IDN OS",
};

// ═══ Fields explicitly FORBIDDEN from push — reject with 400 ═══
const FORBIDDEN_FIELDS = [
  "slug",
  "prenom",
  "nom",
  "profession",
  "cabinet_slug",
  "statut_validation",
  "actif",
];

async function verifyHmac(
  rawBody: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  // Support optional "sha256=" prefix (aligned with icare-webhook-receiver on IDN OS)
  const sig = signature.startsWith("sha256=") ? signature.slice(7) : signature;
  const keyData = new TextEncoder().encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const computed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(rawBody),
  );
  const computedHex = [...new Uint8Array(computed)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  // Constant-time-ish comparison (both are hex strings of same algo)
  if (computedHex.length !== sig.length) return false;
  let mismatch = 0;
  for (let i = 0; i < computedHex.length; i++) {
    mismatch |= computedHex.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return mismatch === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // ── Kill switch: endpoint disabled unless IDN_OS_PUSH_LIVE=true ──
  const pushLive = Deno.env.get("IDN_OS_PUSH_LIVE");
  if (pushLive !== "true") {
    return new Response(
      JSON.stringify({
        error: "Push endpoint not yet activated. Set IDN_OS_PUSH_LIVE=true to activate.",
      }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    // ── 1. Verify HMAC signature ──
    const rawBody = await req.text();
    const signature = req.headers.get("X-IDNOS-Signature") || "";
    const secret = Deno.env.get("IDN_OS_WEBHOOK_SECRET");

    if (!secret) {
      console.error("[receive-praticien-update] IDN_OS_WEBHOOK_SECRET not configured");
      return new Response(
        JSON.stringify({ error: "Server misconfiguration" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing X-IDNOS-Signature header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const valid = await verifyHmac(rawBody, signature, secret);
    if (!valid) {
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── Parse body ──
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { praticien_slug, fields_to_update, validated_by, validated_at } = body as {
      praticien_slug?: string;
      fields_to_update?: Record<string, unknown>;
      validated_by?: string;
      validated_at?: string;
    };

    if (!praticien_slug || typeof praticien_slug !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid praticien_slug" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!fields_to_update || typeof fields_to_update !== "object" || Array.isArray(fields_to_update)) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid fields_to_update" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── 2. Check for forbidden fields ──
    const forbiddenPresent = Object.keys(fields_to_update).filter((k) =>
      FORBIDDEN_FIELDS.includes(k),
    );
    if (forbiddenPresent.length > 0) {
      return new Response(
        JSON.stringify({
          error: `Forbidden fields cannot be modified via push: ${forbiddenPresent.join(", ")}`,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── 3. Filter to allowed fields only ──
    const updatePayload: Record<string, unknown> = {};
    const unknownFields: string[] = [];
    for (const [key, value] of Object.entries(fields_to_update)) {
      if (key in ALLOWED_FIELDS) {
        updatePayload[key] = value;
      } else {
        unknownFields.push(key);
      }
    }

    if (Object.keys(updatePayload).length === 0) {
      return new Response(
        JSON.stringify({
          error: "No allowed fields to update",
          unknown_fields: unknownFields,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── 4. Lookup praticien ──
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: praticien, error: lookupErr } = await supabase
      .from("praticiens")
      .select("id")
      .eq("slug", praticien_slug)
      .maybeSingle();

    if (lookupErr || !praticien) {
      return new Response(
        JSON.stringify({ error: `Praticien not found: ${praticien_slug}` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── 5. Update praticien ──
    const { error: updateErr } = await supabase
      .from("praticiens")
      .update(updatePayload)
      .eq("id", praticien.id);

    if (updateErr) {
      console.error("[receive-praticien-update] update failed:", updateErr);
      return new Response(
        JSON.stringify({ error: "Failed to update praticien" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── 6. Log revision ──
    const { error: revisionErr } = await supabase
      .from("praticien_revisions")
      .insert({
        praticien_id: praticien.id,
        modified_at: validated_at || new Date().toISOString(),
        modified_by_external: "idn_os",
        changes: {
          fields: updatePayload,
          validated_by: validated_by || null,
          ...(unknownFields.length > 0 ? { ignored_fields: unknownFields } : {}),
        },
      });

    if (revisionErr) {
      console.error("[receive-praticien-update] revision insert failed:", revisionErr);
      // Non-blocking — the update already succeeded
    }

    console.log(
      `[receive-praticien-update] Updated praticien ${praticien_slug} (${praticien.id}), fields: ${Object.keys(updatePayload).join(", ")}`,
    );

    return new Response(
      JSON.stringify({
        success: true,
        praticien_id: praticien.id,
        updated_at: new Date().toISOString(),
        updated_fields: Object.keys(updatePayload),
        ...(unknownFields.length > 0 ? { ignored_fields: unknownFields } : {}),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[receive-praticien-update] unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});