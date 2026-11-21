import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

import { controlerAccesInvestisseur } from "./controle_acces.ts";

Deno.serve(req => controlerAccesInvestisseur(req, async tokenHash => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  return await supabase
    .from("investor_leads")
    .select("id, verified_at, access_token_expires_at")
    .eq("access_token_hash", tokenHash)
    .not("verified_at", "is", null)
    .maybeSingle();
}));
