// One-shot backfill: re-extract tags for all validated active praticiens.
// Auth: Bearer must equal BOOTSTRAP_TOKEN. To delete after use.
import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const auth = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${Deno.env.get("BOOTSTRAP_TOKEN") ?? ""}`;
  if (!Deno.env.get("BOOTSTRAP_TOKEN") || auth !== expected) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { data, error } = await supabase
    .from("praticiens")
    .select("id, prenom, nom")
    .eq("statut_validation", "validee")
    .eq("actif", true);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const cron = Deno.env.get("CRON_TOKEN")!;
  const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/extract-praticien-tags`;
  const results: unknown[] = [];
  for (const p of data ?? []) {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-cron-token": cron },
      body: JSON.stringify({ praticien_id: p.id, force: true }),
    });
    const j = await r.json().catch(() => ({}));
    results.push({ id: p.id, name: `${p.prenom} ${p.nom}`, status: r.status, body: j });
  }
  return new Response(JSON.stringify({ count: results.length, results }), {
    status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
