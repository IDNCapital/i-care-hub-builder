import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" } });
  }
  const results: Record<string, unknown> = {};

  // 1. Check secrets
  const webhookUrl = Deno.env.get("IDN_OS_WEBHOOK_URL") || "";
  const webhookSecret = Deno.env.get("IDN_OS_WEBHOOK_SECRET") || "";
  results.enabled = Deno.env.get("IDN_OS_WEBHOOK_ENABLED");
  results.url_starts_with = webhookUrl.slice(0, 60);
  results.secret_length = webhookSecret.length;

  // 2. Test fetch to webhook URL
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const resp = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type: "debug_ping", sent_at: new Date().toISOString() }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const text = await resp.text();
    results.webhook_status = resp.status;
    results.webhook_response = text.slice(0, 300);
  } catch (e) {
    results.webhook_error = e instanceof Error ? e.message : String(e);
  }

  // 3. Test audit log insert
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data, error } = await supabase.from("icare_idnos_audit_log").insert({
      event_type: "debug_ping",
      function_name: "debug-secrets",
      description: "Test insert from debug function",
    }).select("id").single();
    results.audit_insert_ok = !error;
    results.audit_insert_id = data?.id ?? null;
    results.audit_insert_error = error ? error.message : null;
  } catch (e) {
    results.audit_insert_exception = e instanceof Error ? e.message : String(e);
  }

  return new Response(JSON.stringify(results, null, 2), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
});