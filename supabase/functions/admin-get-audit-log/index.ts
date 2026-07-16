// Edge Function : admin-get-audit-log
// Lecture (service_role) du journal `icare_idnos_audit_log`.
// Auth admin HMAC (header x-admin-token) — même pattern que admin-delete-praticien.

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

const ALLOWED_EVENT_TYPES = new Set([
  "snapshot", "edge_function_modified", "rollback",
  "webhook_added", "webhook_removed", "verification",
  "webhook_sent", "webhook_failed", "webhook_config_missing",
  "debug_ping", "email_failed", "praticien_deleted",
]);

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

  let body: { limit?: number; event_type?: string; event_types?: string[]; since?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const rawLimit = Number(body.limit);
  const limit = Number.isFinite(rawLimit) && rawLimit > 0
    ? Math.min(500, Math.floor(rawLimit))
    : 100;

  const admin = createClient(supabaseUrl, serviceRoleKey);
  let query = admin
    .from("icare_idnos_audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (typeof body.event_type === "string" && ALLOWED_EVENT_TYPES.has(body.event_type)) {
    query = query.eq("event_type", body.event_type);
  } else if (Array.isArray(body.event_types) && body.event_types.length > 0) {
    const filtered = body.event_types.filter((t) => typeof t === "string" && ALLOWED_EVENT_TYPES.has(t));
    if (filtered.length > 0) query = query.in("event_type", filtered);
  }

  if (typeof body.since === "string") {
    // Basic ISO-8601 sanity; pass through as-is to Postgres timestamptz comparison.
    if (/^\d{4}-\d{2}-\d{2}T/.test(body.since)) {
      query = query.gte("created_at", body.since);
    }
  }

  const { data, error } = await query;
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ rows: data ?? [] }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});