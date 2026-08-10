import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-token, x-cron-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CACHE_TTL_MS = 6 * 24 * 60 * 60 * 1000; // 6 days

// ─────── HMAC admin-token helpers (same scheme as admin-* functions) ───────
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
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
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

type Praticien = { id: string; slug: string; google_place_id: string };
type Detail = {
  slug: string;
  status: "refreshed" | "skipped_cache_fresh" | "error";
  rating?: number;
  count?: number;
  error?: string;
};

async function fetchGooglePlace(placeId: string, apiKey: string) {
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`;
  const resp = await fetch(url, {
    method: "GET",
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "id,displayName,rating,userRatingCount,reviews,googleMapsUri",
    },
  });
  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(`Google Places ${resp.status}: ${text.slice(0, 200)}`);
  }
  return JSON.parse(text);
}

function normalizeReviews(reviews: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(reviews)) return [];
  return reviews.slice(0, 5).map((r: any) => ({
    author: r?.authorAttribution?.displayName ?? null,
    profile_photo_url: r?.authorAttribution?.photoUri ?? null,
    rating: typeof r?.rating === "number" ? r.rating : null,
    text: r?.text?.text ?? r?.originalText?.text ?? null,
    relative_time: r?.relativePublishTimeDescription ?? null,
    published_at: r?.publishTime ?? null,
  }));
}

async function refreshOne(
  supabase: ReturnType<typeof createClient>,
  apiKey: string,
  prat: Praticien,
  force: boolean,
): Promise<Detail> {
  try {
    if (!force) {
      const { data: cur } = await supabase
        .from("avis_google_cache")
        .select("last_updated_at")
        .eq("place_id", prat.google_place_id)
        .maybeSingle();
      if (cur?.last_updated_at) {
        const ageMs = Date.now() - new Date(cur.last_updated_at).getTime();
        if (ageMs < CACHE_TTL_MS) {
          return { slug: prat.slug, status: "skipped_cache_fresh" };
        }
      }
    }

    const place = await fetchGooglePlace(prat.google_place_id, apiKey);
    const reviews = normalizeReviews(place?.reviews);
    const row = {
      place_id: prat.google_place_id,
      rating: typeof place?.rating === "number" ? place.rating : null,
      user_ratings_total:
        typeof place?.userRatingCount === "number" ? place.userRatingCount : null,
      reviews,
      google_display_name: place?.displayName?.text ?? null,
      google_url: place?.googleMapsUri ?? null,
      last_updated_at: new Date().toISOString(),
      last_error: null,
      last_error_at: null,
    };

    const { error } = await supabase
      .from("avis_google_cache")
      .upsert(row, { onConflict: "place_id" });
    if (error) throw new Error(`Upsert failed: ${error.message}`);

    console.log(`[refresh] ${prat.slug} ✓ rating=${row.rating} count=${row.user_ratings_total}`);
    return {
      slug: prat.slug,
      status: "refreshed",
      rating: row.rating ?? undefined,
      count: row.user_ratings_total ?? undefined,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[refresh] ${prat.slug} ✗ ${msg}`);
    // Do not erase existing reviews — only annotate the error.
    await supabase
      .from("avis_google_cache")
      .update({ last_error: msg, last_error_at: new Date().toISOString() })
      .eq("place_id", prat.google_place_id);
    return { slug: prat.slug, status: "error", error: msg };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const startedAt = Date.now();

  // Authentication: x-cron-token (batch) OR x-admin-token (manual targeted).
  const cronToken = Deno.env.get("CRON_TOKEN");
  const adminSecret = Deno.env.get("ADMIN_SESSION_SECRET");
  const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
  if (!cronToken || !adminSecret || !apiKey) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const providedCron = req.headers.get("x-cron-token");
  const providedAdmin = req.headers.get("x-admin-token");

  let mode: "cron" | "admin" | null = null;
  if (providedCron && constantTimeEqual(providedCron, cronToken)) {
    mode = "cron";
  } else if (await verifyAdminToken(providedAdmin, adminSecret)) {
    mode = "admin";
  }

  if (!mode) {
    await new Promise((r) => setTimeout(r, 600));
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Parse optional body { place_id }
  let bodyPlaceId: string | null = null;
  try {
    const body = await req.json().catch(() => null);
    if (body && typeof body.place_id === "string" && body.place_id.length > 0) {
      bodyPlaceId = body.place_id;
    }
  } catch {
    /* no body */
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Load praticiens
  let query = supabase
    .from("praticiens")
    .select("id,slug,google_place_id")
    .not("google_place_id", "is", null)
    .eq("actif", true)
    .in("statut_validation", ["validee", "brouillon", "preview_envoyee"]);

  if (bodyPlaceId) query = query.eq("google_place_id", bodyPlaceId);

  const { data: pratsRaw, error: listErr } = await query;
  if (listErr) {
    return new Response(JSON.stringify({ error: listErr.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const prats = (pratsRaw ?? []) as Praticien[];

  // Force refresh when targeting a specific place_id (manual mode) OR when admin without filter? -> spec: targeted = force.
  const force = bodyPlaceId !== null;

  const details: Detail[] = [];
  for (const p of prats) {
    if (!p.google_place_id) continue;
    const d = await refreshOne(supabase, apiKey, p, force);
    details.push(d);
  }

  const summary = {
    total_praticiens: prats.length,
    refreshed: details.filter((d) => d.status === "refreshed").length,
    skipped_cache_fresh: details.filter((d) => d.status === "skipped_cache_fresh").length,
    errors: details.filter((d) => d.status === "error").length,
  };

  console.log(`[refresh-google-reviews] mode=${mode} ${JSON.stringify(summary)}`);

  return new Response(
    JSON.stringify({
      success: true,
      mode,
      summary,
      details,
      duration_ms: Date.now() - startedAt,
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
