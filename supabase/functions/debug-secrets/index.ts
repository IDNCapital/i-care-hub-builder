Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" } });
  }
  return new Response(JSON.stringify({
    enabled: Deno.env.get("IDN_OS_WEBHOOK_ENABLED") ?? null,
    url_starts_with: (Deno.env.get("IDN_OS_WEBHOOK_URL") || "").slice(0, 40),
    secret_length: (Deno.env.get("IDN_OS_WEBHOOK_SECRET") || "").length,
  }), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
});