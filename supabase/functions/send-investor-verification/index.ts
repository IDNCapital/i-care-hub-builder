import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import nodemailer from "npm:nodemailer@6.9.16";

// ═══ IDN OS Webhook — IC-05 added 2026-05-03 ═══
// See docs/icare-connect/snapshot-pre-icare-connect-2026-05.md for rollback
async function notifyIdnOs(
  supabase: ReturnType<typeof createClient>,
  functionName: string,
  eventType: string,
  sourceTable: string,
  sourceId: string,
  payload: Record<string, unknown>,
): Promise<void> {
  try {
    const enabled = Deno.env.get("IDN_OS_WEBHOOK_ENABLED");
    if (enabled === "false" || enabled === "FALSE") {
      console.log("[idnos-webhook] disabled, skipping");
      return;
    }
    const webhookUrl = Deno.env.get("IDN_OS_WEBHOOK_URL");
    const webhookSecret = Deno.env.get("IDN_OS_WEBHOOK_SECRET");
    if (!webhookUrl || !webhookSecret) {
      console.warn("[idnos-webhook] missing URL or SECRET, logging and skipping");
      try {
        await supabase.from("icare_idnos_audit_log").insert({
          event_type: "webhook_config_missing",
          function_name: functionName,
          description: `Missing ${!webhookUrl ? "IDN_OS_WEBHOOK_URL" : ""} ${!webhookSecret ? "IDN_OS_WEBHOOK_SECRET" : ""}`.trim(),
        });
      } catch (_) { /* swallow */ }
      return;
    }
    const body = JSON.stringify({
      event_type: eventType,
      source_table: sourceTable,
      source_id: sourceId,
      payload,
      sent_at: new Date().toISOString(),
    });
    const keyData = new TextEncoder().encode(webhookSecret);
    const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
    const hmacHex = [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, "0")).join("");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const start = Date.now();
    try {
      const resp = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Icare-Signature": hmacHex },
        body,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const durationMs = Date.now() - start;
      if (resp.ok) {
        try { await supabase.from("icare_idnos_audit_log").insert({ event_type: "webhook_sent", function_name: functionName, description: `Webhook sent to IDN OS`, payload_json: { response_status: resp.status, duration_ms: durationMs } }); } catch (_) { /* swallow */ }
      } else {
        const respText = await resp.text().catch(() => "");
        try { await supabase.from("icare_idnos_audit_log").insert({ event_type: "webhook_failed", function_name: functionName, description: `HTTP ${resp.status}`, payload_json: { error_message: respText.slice(0, 500), attempted_url: webhookUrl, response_status: resp.status } }); } catch (_) { /* swallow */ }
      }
    } catch (fetchErr) {
      clearTimeout(timeout);
      const errMsg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
      try { await supabase.from("icare_idnos_audit_log").insert({ event_type: "webhook_failed", function_name: functionName, description: errMsg.slice(0, 200), payload_json: { error_message: errMsg, attempted_url: webhookUrl, response_status: null } }); } catch (_) { /* swallow */ }
    }
  } catch (_globalErr) {
    console.error("[idnos-webhook] unexpected error swallowed:", _globalErr);
  }
}
// ═══ End IDN OS Webhook helper ═══

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

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function maskEmail(e: string): string {
  const at = e.indexOf("@");
  if (at <= 0) return "***";
  return `${e.slice(0, Math.min(3, at))}***@${e.slice(at + 1)}`;
}
async function auditEmailFailed(
  supabase: ReturnType<typeof createClient>,
  description: string,
  payload: Record<string, unknown>,
): Promise<void> {
  try {
    await supabase.from("icare_idnos_audit_log").insert({
      event_type: "email_failed",
      function_name: "send-investor-verification",
      description: description.slice(0, 200),
      payload_json: payload,
    });
  } catch (_) { /* swallow */ }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const {
      first_name,
      last_name,
      email,
      phone,
      profile_type,
      ticket_range,
      area_interest,
      message,
      locale,
      source_page,
    } = body;

    // Validate required fields
    if (!first_name?.trim() || !last_name?.trim() || !email?.trim() || !profile_type || !ticket_range) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase().slice(0, 255);
    if (!emailRegex.test(cleanEmail)) {
      return new Response(
        JSON.stringify({ error: "Invalid email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      requireEnv("SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY")
    );

    // Check if lead already exists
    const { data: existingLead } = await supabase
      .from("investor_leads")
      .select("id, verified_at, last_email_sent_at")
      .eq("email", cleanEmail)
      .maybeSingle();

    // Rate limit: max 1 email per 60 seconds
    if (existingLead?.last_email_sent_at) {
      const lastSent = new Date(existingLead.last_email_sent_at).getTime();
      if (Date.now() - lastSent < 60_000) {
        return new Response(
          JSON.stringify({ status: "email_already_sent" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // If already verified, grant access directly
    if (existingLead?.verified_at) {
      // Generate new access token
      const accessToken = crypto.randomUUID();
      const accessTokenHash = await sha256(accessToken);
      const accessExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      await supabase
        .from("investor_leads")
        .update({
          access_token_hash: accessTokenHash,
          access_token_expires_at: accessExpires,
        })
        .eq("id", existingLead.id);

      return new Response(
        JSON.stringify({ status: "already_verified", access_token: accessToken }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomUUID();
    const tokenHash = await sha256(verificationToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const now = new Date().toISOString();

    const leadData = {
      first_name: first_name.trim().slice(0, 100),
      last_name: last_name.trim().slice(0, 100),
      email: cleanEmail,
      phone: phone?.trim().slice(0, 30) || null,
      profile_type,
      ticket_range,
      area_interest: area_interest?.trim().slice(0, 200) || null,
      message: message?.trim().slice(0, 2000) || null,
      consent: true,
      consent_at: now,
      source_page: source_page || "/investissement",
      verification_token_hash: tokenHash,
      verification_sent_at: now,
      verification_expires_at: expiresAt,
      last_email_sent_at: now,
    };

    if (existingLead) {
      // Update existing unverified lead
      await supabase
        .from("investor_leads")
        .update(leadData)
        .eq("id", existingLead.id);
    } else {
      // Insert new lead
      const { error: insertError } = await supabase
        .from("investor_leads")
        .insert(leadData);

      if (insertError) {
        // Handle unique constraint (duplicate email race condition)
        if (insertError.code === "23505") {
          // Re-fetch and update
          const { data: raceLead } = await supabase
            .from("investor_leads")
            .select("id")
            .eq("email", cleanEmail)
            .single();

          if (raceLead) {
            await supabase
              .from("investor_leads")
              .update(leadData)
              .eq("id", raceLead.id);
          }
        } else {
          throw insertError;
        }
      }
    }

    const verificationBase = requireEnv("VERIFICATION_LINK_BASE").trim();
    const verifyPath = locale === "en" ? "/en/investment/verify" : "/fr/investissement/verify";
    const verificationLink = new URL(
      `${verifyPath}?token=${verificationToken}`,
      verificationBase
    ).toString();

    const isFr = locale !== "en";
    const subject = isFr
      ? "Confirmez votre accès à la note d'investissement I-CA.RE"
      : "Confirm your access to the I-CA.RE investment memo";

    const htmlBody = isFr
      ? `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <h1 style="font-size:22px;color:#2B2B2B;margin-bottom:8px;">I-CA.RE</h1>
    <p style="font-size:14px;color:#6b7280;margin-bottom:32px;">Immobilier de soin et de bien-être</p>
    <h2 style="font-size:20px;color:#2B2B2B;margin-bottom:16px;">Bonjour ${first_name.trim()},</h2>
    <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:24px;">
      Merci pour votre intérêt. Pour accéder à notre note d'investissement détaillée, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous.
    </p>
    <a href="${verificationLink}" style="display:inline-block;background:#2B2B2B;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">
      Confirmer mon accès
    </a>
    <p style="font-size:13px;color:#9ca3af;margin-top:32px;line-height:1.5;">
      Ce lien est valide pendant 24 heures. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
    </p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
    <p style="font-size:12px;color:#9ca3af;">
      I-CA.RE — Rénovation de lieux de soin et de bien-être<br>
      Bordeaux, France — <a href="https://i-ca.re" style="color:#9ca3af;">i-ca.re</a>
    </p>
  </div>
</body>
</html>`
      : `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <h1 style="font-size:22px;color:#2B2B2B;margin-bottom:8px;">I-CA.RE</h1>
    <p style="font-size:14px;color:#6b7280;margin-bottom:32px;">Care & wellbeing real estate</p>
    <h2 style="font-size:20px;color:#2B2B2B;margin-bottom:16px;">Hello ${first_name.trim()},</h2>
    <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:24px;">
      Thank you for your interest. To access our detailed investment memo, please confirm your email address by clicking the button below.
    </p>
    <a href="${verificationLink}" style="display:inline-block;background:#2B2B2B;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">
      Confirm my access
    </a>
    <p style="font-size:13px;color:#9ca3af;margin-top:32px;line-height:1.5;">
      This link is valid for 24 hours. If you did not request this, please ignore this email.
    </p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
    <p style="font-size:12px;color:#9ca3af;">
      I-CA.RE — Care & wellbeing real estate renovation<br>
      Bordeaux, France — <a href="https://i-ca.re" style="color:#9ca3af;">i-ca.re</a>
    </p>
  </div>
</body>
</html>`;

    const smtpHost = requireEnv("INFOMANIAK_SMTP_HOST");
    const smtpPort = Number(requireEnv("INFOMANIAK_SMTP_PORT"));
    const smtpUser = requireEnv("INFOMANIAK_SMTP_USER");
    const smtpPass = requireEnv("INFOMANIAK_SMTP_PASS");
    const mailFromName = requireEnv("MAIL_FROM_NAME");
    const mailFromEmail = requireEnv("MAIL_FROM_EMAIL");

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    try {
      await transporter.sendMail({
        from: `"${mailFromName}" <${mailFromEmail}>`,
        to: cleanEmail,
        subject,
        html: htmlBody,
      });
    } catch (mailErr) {
      const errMsg = mailErr instanceof Error ? mailErr.message : String(mailErr);
      await auditEmailFailed(supabase, "échec envoi lien de vérification investisseur", {
        error_message: errMsg.slice(0, 500),
        lead_email: maskEmail(cleanEmail),
        stage: "verification",
      });
      throw mailErr;
    }

    // Get the lead ID for webhook
    const { data: webhookLead } = await supabase
      .from("investor_leads")
      .select("id")
      .eq("email", cleanEmail)
      .single();
    const investorLeadId = existingLead?.id || webhookLead?.id || "unknown";

    // IDN OS webhook added 2026-05-03 — see docs/icare-connect/snapshot-pre-icare-connect-2026-05.md for rollback
    try {
      await notifyIdnOs(
        supabase,
        "send-investor-verification",
        "lead_created",
        "investor_leads",
        investorLeadId,
        { first_name: first_name.trim(), last_name: last_name.trim(), email: cleanEmail, profile_type, ticket_range, priority: "urgent" },
      );
    } catch (e) {
      console.error("[send-investor-verification] webhook error swallowed:", e);
    }

    return new Response(
      JSON.stringify({ status: "verification_sent" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("send-investor-verification error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
