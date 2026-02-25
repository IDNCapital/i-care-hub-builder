import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token || token.length < 30) {
      return new Response(
        JSON.stringify({ error: "invalid_token" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokenHash = await sha256(token);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find lead with matching hash, not yet verified, not expired
    const { data: lead, error: findError } = await supabase
      .from("investor_leads")
      .select("id, verified_at, verification_expires_at")
      .eq("verification_token_hash", tokenHash)
      .is("verified_at", null)
      .maybeSingle();

    if (findError || !lead) {
      return new Response(
        JSON.stringify({ error: "invalid_or_expired" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check expiry
    if (lead.verification_expires_at && new Date(lead.verification_expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: "expired" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate access token
    const accessToken = crypto.randomUUID();
    const accessTokenHash = await sha256(accessToken);
    const accessExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // Mark as verified, clear verification hash, set access token
    const { error: updateError } = await supabase
      .from("investor_leads")
      .update({
        verified_at: new Date().toISOString(),
        verification_token_hash: null,
        access_token_hash: accessTokenHash,
        access_token_expires_at: accessExpires,
      })
      .eq("id", lead.id);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ status: "verified", access_token: accessToken }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("verify-investor-token error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
