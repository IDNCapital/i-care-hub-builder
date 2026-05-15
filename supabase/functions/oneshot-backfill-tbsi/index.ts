const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" };
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const url = Deno.env.get("SUPABASE_URL")!;
  const cron = Deno.env.get("CRON_TOKEN")!;
  const sr = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const r = await fetch(`${url}/rest/v1/praticiens?select=id&statut_validation=eq.validee&actif=eq.true`, {
    headers: { apikey: sr, Authorization: `Bearer ${sr}` },
  });
  const list = await r.json();
  const results: any[] = [];
  for (const p of list) {
    const resp = await fetch(`${url}/functions/v1/extract-praticien-tags`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-cron-token": cron },
      body: JSON.stringify({ praticien_id: p.id, force: true }),
    });
    results.push({ id: p.id, status: resp.status });
  }
  return new Response(JSON.stringify({ results }, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
