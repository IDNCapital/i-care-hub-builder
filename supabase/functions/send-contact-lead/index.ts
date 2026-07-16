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

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing environment variable: ${name}`);
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
      function_name: "send-contact-lead",
      description: description.slice(0, 200),
      payload_json: payload,
    });
  } catch (_) { /* swallow */ }
}

const VALID_TYPES = ["praticien", "collectivite", "investisseur", "cabinet_request", "contact_general"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const {
      type, firstname, lastname, full_name, email, phone,
      organization, city, message, language, source_url,
      utm_source, utm_medium, utm_campaign, extra_data, honeypot,
    } = body;

    // ── Honeypot ──
    if (honeypot) {
      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Validate required fields ──
    if (!type || !VALID_TYPES.includes(type)) {
      return new Response(JSON.stringify({ error: "invalid_type" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!email?.trim() || !message?.trim() || !source_url || !language || !["fr", "en"].includes(language)) {
      return new Response(JSON.stringify({ error: "missing_fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase().slice(0, 255);
    if (!emailRegex.test(cleanEmail)) {
      return new Response(JSON.stringify({ error: "invalid_email" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (phone?.trim() && !/^[+\d\s.\-()]{6,30}$/.test(phone.trim())) {
      return new Response(JSON.stringify({ error: "invalid_phone" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Supabase client ──
    const supabase = createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"));

    // ── Rate limit: 1 per 30s per email ──
    const { data: recentLead } = await supabase
      .from("contact_leads")
      .select("id, last_email_sent_at")
      .eq("email", cleanEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentLead?.last_email_sent_at) {
      const lastSent = new Date(recentLead.last_email_sent_at).getTime();
      if (Date.now() - lastSent < 30_000) {
        return new Response(JSON.stringify({ error: "rate_limited" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const now = new Date().toISOString();
    const cleanFirstname = firstname?.trim().slice(0, 100) || null;
    const cleanLastname = lastname?.trim().slice(0, 100) || null;
    const cleanFullName = full_name?.trim().slice(0, 200) || null;
    const cleanPhone = phone?.trim().slice(0, 30) || null;
    const cleanOrg = organization?.trim().slice(0, 200) || null;
    const cleanCity = city?.trim().slice(0, 100) || null;
    const cleanMessage = message.trim().slice(0, 5000);
    const displayName = cleanFullName || [cleanFirstname, cleanLastname].filter(Boolean).join(" ") || cleanEmail;

    // ── Insert into DB ──
    const { data: inserted, error: insertError } = await supabase
      .from("contact_leads")
      .insert({
        type,
        firstname: cleanFirstname,
        lastname: cleanLastname,
        full_name: cleanFullName,
        email: cleanEmail,
        phone: cleanPhone,
        organization: cleanOrg,
        city: cleanCity,
        message: cleanMessage,
        language,
        source_url: source_url.slice(0, 500),
        utm_source: utm_source?.slice(0, 200) || null,
        utm_medium: utm_medium?.slice(0, 200) || null,
        utm_campaign: utm_campaign?.slice(0, 200) || null,
        extra_data: extra_data || {},
        consent: true,
        consent_at: now,
        last_email_sent_at: now,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw insertError;
    }

    const leadId = inserted?.id || "unknown";

    // ── SMTP setup ──
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
      auth: { user: smtpUser, pass: smtpPass },
    });

    // ── Email 1: Notification to contact@i-ca.re + CC ──
    const typeLabels: Record<string, string> = {
      praticien: "Praticien",
      collectivite: "Collectivité",
      investisseur: "Investisseur (contact)",
      cabinet_request: "Demande cabinet",
      contact_general: "Contact général",
    };
    const typeLabel = typeLabels[type] || type;
    const notifSubject = `[I-CA.RE] Nouvelle demande ${typeLabel} – ${cleanCity || "-"}`;

    // Build extra fields rows for cabinet_request
    let extraRows = "";
    if (extra_data && typeof extra_data === "object") {
      const fieldLabels: Record<string, string> = {
        profession: "Profession", neighbourhood: "Quartier", move_in_date: "Date souhaitée",
        cabinet_count: "Nb cabinets", cabinet_config: "Configuration", surface: "Surface",
        website: "Site web", organisation: "Organisation",
      };
      for (const [key, label] of Object.entries(fieldLabels)) {
        if (extra_data[key]) {
          extraRows += `<tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;width:180px;">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${String(extra_data[key])}</td></tr>`;
        }
      }
    }

    const notifHtml = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
  <h1 style="font-size:20px;color:#2B2B2B;margin-bottom:24px;">Nouvelle demande – ${typeLabel}</h1>
  <table style="width:100%;border-collapse:collapse;font-size:14px;color:#374151;">
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;width:180px;">Lead ID</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${leadId}</td></tr>
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Type</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${typeLabel}</td></tr>
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Nom</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${displayName}</td></tr>
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Email</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;"><a href="mailto:${cleanEmail}" style="color:#2563eb;">${cleanEmail}</a></td></tr>
    ${cleanPhone ? `<tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Téléphone</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;"><a href="tel:${cleanPhone}" style="color:#2563eb;">${cleanPhone}</a></td></tr>` : ""}
    ${cleanOrg ? `<tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Organisation</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${cleanOrg}</td></tr>` : ""}
    ${cleanCity ? `<tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Ville</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${cleanCity}</td></tr>` : ""}
    ${extraRows}
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Langue</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${language.toUpperCase()}</td></tr>
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Source</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${source_url}</td></tr>
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Date</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}</td></tr>
  </table>
  <div style="margin-top:24px;padding:16px;background:#f9fafb;border-radius:8px;">
    <p style="font-size:13px;color:#6b7280;margin:0 0 8px;">Message :</p>
    <p style="font-size:14px;color:#374151;margin:0;white-space:pre-wrap;">${cleanMessage}</p>
  </div>
</div>
</body></html>`;

    try {
      await transporter.sendMail({
        from: `"${mailFromName}" <${mailFromEmail}>`,
        to: mailFromEmail,
        cc: "n.idelot@idn-capital.fr",
        replyTo: `"${displayName}" <${cleanEmail}>`,
        subject: notifSubject,
        html: notifHtml,
      });
      console.log(`[send-contact-lead] Notification sent for lead ${leadId} (${type})`);
    } catch (smtpErr: unknown) {
      const errMsg = smtpErr instanceof Error ? smtpErr.message : String(smtpErr);
      console.error(`[send-contact-lead] SMTP notification error for lead ${leadId}:`, errMsg);
      await supabase.from("contact_leads").update({ email_send_error: `notification: ${errMsg}` }).eq("id", leadId);
      await auditEmailFailed(supabase, "échec envoi notification interne (contact)", {
        error_message: errMsg.slice(0, 500),
        lead_id: leadId,
        recipient: maskEmail(mailFromEmail),
        stage: "notification",
      });
    }

    // ── Email 2: Acknowledgment to prospect ──
    const isFr = language === "fr";
    const ackSubject = isFr
      ? "I-CA.RE – Nous avons bien reçu votre message"
      : "I-CA.RE – We received your message";

    const ackHtml = isFr
      ? `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 24px;">
  <h1 style="font-size:22px;color:#2B2B2B;margin-bottom:8px;">I-CA.RE</h1>
  <p style="font-size:14px;color:#6b7280;margin-bottom:32px;">Espaces de soin et de bien-être</p>
  <h2 style="font-size:20px;color:#2B2B2B;margin-bottom:16px;">Bonjour${cleanFirstname ? ` ${cleanFirstname}` : ""},</h2>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:16px;">Nous avons bien reçu votre message et nous vous en remercions.</p>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:16px;">Notre équipe reviendra vers vous <strong>sous 48h ouvrées</strong>.</p>
  <p style="font-size:15px;color:#374151;">À bientôt,<br><strong>L'équipe I-CA.RE</strong></p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
  <p style="font-size:12px;color:#9ca3af;">I-CA.RE — Espaces de soin et de bien-être<br>Bordeaux, France — <a href="https://i-ca.re" style="color:#9ca3af;">i-ca.re</a><br><a href="mailto:contact@i-ca.re" style="color:#9ca3af;">contact@i-ca.re</a> — 06 49 80 80 97</p>
</div>
</body></html>`
      : `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 24px;">
  <h1 style="font-size:22px;color:#2B2B2B;margin-bottom:8px;">I-CA.RE</h1>
  <p style="font-size:14px;color:#6b7280;margin-bottom:32px;">Care & wellbeing spaces</p>
  <h2 style="font-size:20px;color:#2B2B2B;margin-bottom:16px;">Hello${cleanFirstname ? ` ${cleanFirstname}` : ""},</h2>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:16px;">We have received your message and thank you for reaching out.</p>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:16px;">Our team will get back to you <strong>within 2 business days</strong>.</p>
  <p style="font-size:15px;color:#374151;">Best regards,<br><strong>The I-CA.RE Team</strong></p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
  <p style="font-size:12px;color:#9ca3af;">I-CA.RE — Care & wellbeing spaces<br>Bordeaux, France — <a href="https://i-ca.re" style="color:#9ca3af;">i-ca.re</a><br><a href="mailto:contact@i-ca.re" style="color:#9ca3af;">contact@i-ca.re</a> — 06 49 80 80 97</p>
</div>
</body></html>`;

    try {
      await transporter.sendMail({
        from: `"${mailFromName}" <${mailFromEmail}>`,
        to: cleanEmail,
        subject: ackSubject,
        html: ackHtml,
      });
      console.log(`[send-contact-lead] Ack sent to ${cleanEmail} for lead ${leadId}`);
    } catch (ackErr: unknown) {
      const errMsg = ackErr instanceof Error ? ackErr.message : String(ackErr);
      console.error(`[send-contact-lead] SMTP ack error for lead ${leadId}:`, errMsg);
      // Update error but don't fail the whole request
      await supabase.from("contact_leads").update({
        email_send_error: `ack: ${errMsg}`,
      }).eq("id", leadId);
      await auditEmailFailed(supabase, "échec envoi accusé contact", {
        error_message: errMsg.slice(0, 500),
        lead_id: leadId,
        recipient: maskEmail(cleanEmail),
        stage: "ack",
      });
    }

    // IDN OS webhook added 2026-05-03 — see docs/icare-connect/snapshot-pre-icare-connect-2026-05.md for rollback
    try {
      await notifyIdnOs(
        supabase,
        "send-contact-lead",
        "lead_created",
        "contact_leads",
        leadId,
        { type, firstname: cleanFirstname, lastname: cleanLastname, email: cleanEmail, phone: cleanPhone, city: cleanCity, language },
      );
    } catch (e) {
      console.error("[send-contact-lead] webhook error swallowed:", e);
    }

    return new Response(
      JSON.stringify({ status: "ok", lead_id: leadId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("[send-contact-lead] Unhandled error:", errMsg);
    return new Response(
      JSON.stringify({ error: "internal_error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
