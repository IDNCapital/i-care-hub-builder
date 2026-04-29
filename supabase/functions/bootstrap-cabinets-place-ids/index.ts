import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-token, x-cron-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Hardcoded coordinates for the operated cabinets.
const CABINET_COORDS: Record<string, { lat: number; lng: number; cp: string[] }> = {
  "i-ca-re-nansouty":     { lat: 44.8197, lng: -0.5688, cp: ["33000", "33800"] },
  "i-ca-re-jardin-public":{ lat: 44.8456, lng: -0.5762, cp: ["33000"] },
  "i-ca-re-pey-berland":  { lat: 44.8378, lng: -0.5777, cp: ["33000"] },
};

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

// ───── HMAC admin-token verification ─────
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
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return b64urlEncode(new Uint8Array(sig));
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
  } catch { return false; }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const cronToken = Deno.env.get("CRON_TOKEN");
  const adminSecret = Deno.env.get("ADMIN_SESSION_SECRET");
  const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
  if (!cronToken || !adminSecret || !apiKey) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const providedCron = req.headers.get("x-cron-token");
  const providedAdmin = req.headers.get("x-admin-token");
  let authed = false;
  if (providedCron && constantTimeEqual(providedCron, cronToken)) authed = true;
  else if (await verifyAdminToken(providedAdmin, adminSecret)) authed = true;
  if (!authed) {
    await sleep(600);
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: cabinets, error } = await supabase
    .from("projets")
    .select("slug,name,status,google_place_id")
    .in("status", ["en_exploitation", "en_travaux"]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const results: Array<Record<string, unknown>> = [];

  for (const c of cabinets ?? []) {
    const coords = CABINET_COORDS[c.slug];
    if (!coords) {
      results.push({ slug: c.slug, name: c.name, status: "skipped_no_coords" });
      continue;
    }

    try {
      const body = {
        textQuery: c.name, // e.g. "I-CA.RE Nansouty"
        locationBias: {
          circle: {
            center: { latitude: coords.lat, longitude: coords.lng },
            radius: 500.0,
          },
        },
        languageCode: "fr",
        regionCode: "FR",
      };

      const res = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "places.id,places.displayName,places.formattedAddress,places.googleMapsUri",
          },
          body: JSON.stringify(body),
        },
      );

      if (!res.ok) {
        const text = await res.text();
        results.push({ slug: c.slug, name: c.name, status: "error", error: `HTTP ${res.status}: ${text.slice(0, 200)}` });
        await sleep(200);
        continue;
      }

      const data = await res.json();
      const places: any[] = data.places ?? [];

      // Filter by postal code, then prefer name containing "I-CA.RE" / "I‑CA.RE".
      const cpFiltered = places.filter((pl) =>
        typeof pl.formattedAddress === "string" &&
        coords.cp.some((cp) => pl.formattedAddress.includes(cp))
      );

      const brandRegex = /I[\u2010-\u2015\-]?CA\.?RE/i;
      const candidates = cpFiltered.length > 0 ? cpFiltered : places;
      const match =
        candidates.find((pl) => brandRegex.test(pl.displayName?.text ?? "")) ??
        candidates[0];

      if (!match) {
        results.push({
          slug: c.slug, name: c.name, status: "no_match",
          received: places.map((pl) => ({ id: pl.id, displayName: pl.displayName?.text, addr: pl.formattedAddress })),
        });
        await sleep(200);
        continue;
      }

      const placeId: string = match.id;
      const { error: upErr } = await supabase
        .from("projets")
        .update({ google_place_id: placeId })
        .eq("slug", c.slug);

      if (upErr) {
        results.push({ slug: c.slug, name: c.name, status: "error", error: `update: ${upErr.message}` });
      } else {
        results.push({
          slug: c.slug, name: c.name, status: "ok",
          place_id: placeId,
          matched_name: match.displayName?.text ?? null,
          formatted_address: match.formattedAddress ?? null,
          google_maps_uri: match.googleMapsUri ?? null,
        });
      }
    } catch (e) {
      results.push({ slug: c.slug, name: c.name, status: "error", error: (e as Error).message });
    }
    await sleep(200);
  }

  return new Response(JSON.stringify({ success: true, results }, null, 2), {
    status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
