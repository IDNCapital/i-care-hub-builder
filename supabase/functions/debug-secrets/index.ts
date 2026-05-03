Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" } });
  }
  const secret = Deno.env.get("IDN_OS_WEBHOOK_SECRET") || "";
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  const hex = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
  return new Response(JSON.stringify({
    length: secret.length,
    first_4: secret.slice(0, 4),
    last_4: secret.slice(-4),
    sha256_first_8: hex.slice(0, 8),
  }), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
});