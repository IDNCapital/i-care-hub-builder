const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hashBuffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

type LeadVerifie = {
  id: string;
  verified_at: string | null;
  access_token_expires_at: string | null;
};

type LireLead = (empreinte: string) => Promise<{
  data: LeadVerifie | null;
  error: unknown;
}>;

function json(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export async function controlerAccesInvestisseur(req: Request, lireLead: LireLead): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { access_token } = await req.json();
    if (typeof access_token !== "string" || access_token.length < 30) return json({ valid: false }, 200);

    const { data: lead, error } = await lireLead(await sha256(access_token));
    if (error) return json({ valid: false }, 500);
    if (lead === null) return json({ valid: false }, 200);
    if (!lead.id || !lead.verified_at) return json({ valid: false }, 500);

    if (lead.access_token_expires_at !== null) {
      const expiration = Date.parse(lead.access_token_expires_at);
      if (!Number.isFinite(expiration)) return json({ valid: false }, 500);
      if (expiration < Date.now()) return json({ valid: false, reason: "expired" }, 200);
    }
    return json({ valid: true }, 200);
  } catch {
    return json({ valid: false }, 500);
  }
}
