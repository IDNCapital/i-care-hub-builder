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
    console.log("[idnos-webhook] enabled env =", JSON.stringify(enabled));
    if (enabled === "false" || enabled === "FALSE") {
      console.log("[idnos-webhook] disabled, skipping");
      return;
    }
    const webhookUrl = Deno.env.get("IDN_OS_WEBHOOK_URL");
    const webhookSecret = Deno.env.get("IDN_OS_WEBHOOK_SECRET");
    console.log("[idnos-webhook] url present =", !!webhookUrl, "secret present =", !!webhookSecret);
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
      console.log("[idnos-webhook] sending to", webhookUrl?.slice(0, 50));
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
        console.log("[idnos-webhook] success, status =", resp.status, "duration =", durationMs);
        try {
          const auditRes = await supabase.from("icare_idnos_audit_log").insert({ event_type: "webhook_sent", function_name: functionName, description: `Webhook sent to IDN OS`, payload_json: { response_status: resp.status, duration_ms: durationMs } });
          console.log("[idnos-webhook] audit insert result:", JSON.stringify(auditRes));
        } catch (auditErr) { console.error("[idnos-webhook] audit insert error:", auditErr); }
      } else {
        const respText = await resp.text().catch(() => "");
        console.warn("[idnos-webhook] failed, status =", resp.status, "body =", respText.slice(0, 200));
        try {
          const auditRes = await supabase.from("icare_idnos_audit_log").insert({ event_type: "webhook_failed", function_name: functionName, description: `HTTP ${resp.status}`, payload_json: { error_message: respText.slice(0, 500), attempted_url: webhookUrl, response_status: resp.status } });
          console.log("[idnos-webhook] audit insert (fail) result:", JSON.stringify(auditRes));
        } catch (auditErr) { console.error("[idnos-webhook] audit insert error:", auditErr); }
      }
    } catch (fetchErr) {
      clearTimeout(timeout);
      const errMsg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
      console.error("[idnos-webhook] fetch error:", errMsg);
      try {
        const auditRes = await supabase.from("icare_idnos_audit_log").insert({ event_type: "webhook_failed", function_name: functionName, description: errMsg.slice(0, 200), payload_json: { error_message: errMsg, attempted_url: webhookUrl, response_status: null } });
        console.log("[idnos-webhook] audit insert (fetchErr) result:", JSON.stringify(auditRes));
      } catch (auditErr) { console.error("[idnos-webhook] audit insert error:", auditErr); }
    }
  } catch (_globalErr) {
    // Global catch: never interrupt the caller
    console.error("[idnos-webhook] unexpected error swallowed:", _globalErr);
  }
}
// ═══ End IDN OS Webhook helper ═══

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

function requireEnv(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

const CABINET_LABELS: Record<string, string> = {
  "i-ca-re-nansouty": "Nansouty",
  "i-ca-re-pey-berland": "Pey-Berland",
  "i-ca-re-jardin-public": "Jardin Public",
  "i-ca-re-chartrons": "Chartrons",
};

/** Envoi non bloquant du webhook CRM avec retries exponentiels. */
async function dispatchWebhook(opts: {
  webhookUrl: string;
  payload: Record<string, unknown>;
  supabase: ReturnType<typeof createClient>;
  demandeId: string;
}): Promise<void> {
  const { webhookUrl, payload, supabase, demandeId } = opts;
  const maxAttempts = 3;
  let lastError: string | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const resp = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-i-ca-re-source": "conciergerie",
        },
        body: JSON.stringify(payload),
      });
      if (resp.ok) {
        await supabase
          .from("demandes_conciergerie")
          .update({
            webhook_status: "ok",
            webhook_attempts: attempt,
            webhook_last_attempt_at: new Date().toISOString(),
            webhook_last_error: null,
          })
          .eq("id", demandeId);
        return;
      }
      lastError = `HTTP ${resp.status}: ${(await resp.text()).slice(0, 500)}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
    if (attempt < maxAttempts) {
      // backoff exponentiel : 500ms, 1500ms
      await new Promise((r) => setTimeout(r, 500 * Math.pow(3, attempt - 1)));
    }
  }

  await supabase
    .from("demandes_conciergerie")
    .update({
      webhook_status: "failed",
      webhook_attempts: maxAttempts,
      webhook_last_attempt_at: new Date().toISOString(),
      webhook_last_error: lastError?.slice(0, 1000) ?? "unknown",
    })
    .eq("id", demandeId);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json(405, { error: "method_not_allowed" });
  }

  try {
    const body = await req.json();
    const {
      prenom,
      nom,
      email,
      telephone,
      message,
      problematiques_pressenties,
      cabinet_prefere,
      consentement_rgpd,
      source,
      website, // honeypot
    } = body ?? {};

    // ── Honeypot : bot caught → faux succès silencieux
    if (website) {
      return json(200, { ok: true, id: "honeypot" });
    }

    // ── Validation
    if (consentement_rgpd !== true) {
      return json(400, { error: "consent_required" });
    }
    const cleanPrenom = String(prenom ?? "").trim().slice(0, 100);
    const cleanNom = String(nom ?? "").trim().slice(0, 100);
    const cleanEmail = String(email ?? "").trim().toLowerCase().slice(0, 255);
    const cleanTel = telephone ? String(telephone).trim().slice(0, 30) : null;
    const cleanMessage = String(message ?? "").trim().slice(0, 5000);
    const cleanCabinet = cabinet_prefere
      ? String(cabinet_prefere).trim().slice(0, 100)
      : null;
    const cleanProblematiques = Array.isArray(problematiques_pressenties)
      ? problematiques_pressenties
          .filter((p): p is string => typeof p === "string")
          .map((p) => p.trim().slice(0, 80))
          .filter(Boolean)
          .slice(0, 20)
      : [];
    const cleanSource = source ? String(source).slice(0, 500) : null;

    if (!cleanPrenom || !cleanNom) return json(400, { error: "missing_name" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return json(400, { error: "invalid_email" });
    }
    if (cleanMessage.length < 30) return json(400, { error: "message_too_short" });
    if (cleanTel && !/^[+\d\s.\-()]{6,30}$/.test(cleanTel)) {
      return json(400, { error: "invalid_phone" });
    }

    // ── IP hash
    const xff = req.headers.get("x-forwarded-for") ?? "";
    const ip = xff.split(",")[0]?.trim() || "unknown";
    const ipSalt = Deno.env.get("IP_HASH_SALT") ?? "i-ca-re-conciergerie-salt-v1";
    const ipHash = await sha256Hex(`${ipSalt}:${ip}`);
    const userAgent = (req.headers.get("user-agent") ?? "").slice(0, 500);

    // ── Supabase service role (bypass RLS)
    const supabase = createClient(
      requireEnv("SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    );

    // ── Rate limit : max 3 soumissions / heure / IP
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: recentCount } = await supabase
      .from("demandes_conciergerie")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", oneHourAgo);
    if ((recentCount ?? 0) >= 3) {
      return json(429, { error: "rate_limited" });
    }

    // ── Insert
    const { data: inserted, error: insertErr } = await supabase
      .from("demandes_conciergerie")
      .insert({
        prenom: cleanPrenom,
        nom: cleanNom,
        email: cleanEmail,
        telephone: cleanTel,
        message: cleanMessage,
        problematiques_pressenties: cleanProblematiques,
        cabinet_prefere: cleanCabinet,
        consentement_rgpd: true,
        source: cleanSource,
        user_agent: userAgent || null,
        ip_hash: ipHash,
        statut: "a_traiter",
        webhook_status: "pending",
      })
      .select("id, created_at")
      .single();
    if (insertErr || !inserted) {
      console.error("[submit-demande-conciergerie] insert error:", insertErr);
      return json(500, { error: "internal_error" });
    }
    const demandeId = inserted.id as string;

    // ── SMTP (Infomaniak — réutilise l'infra existante)
    let smtpReady = false;
    let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;
    let mailFromName = "I-CA.RE";
    let mailFromEmail = "no-reply@i-ca.re";
    try {
      const smtpHost = requireEnv("INFOMANIAK_SMTP_HOST");
      const smtpPort = Number(requireEnv("INFOMANIAK_SMTP_PORT"));
      const smtpUser = requireEnv("INFOMANIAK_SMTP_USER");
      const smtpPass = requireEnv("INFOMANIAK_SMTP_PASS");
      mailFromName = requireEnv("MAIL_FROM_NAME");
      mailFromEmail = requireEnv("MAIL_FROM_EMAIL");
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });
      smtpReady = true;
    } catch (e) {
      console.warn("[submit-demande-conciergerie] SMTP not configured:", e);
    }

    const cabinetLabel = cleanCabinet
      ? CABINET_LABELS[cleanCabinet] ?? cleanCabinet
      : "Sans préférence";
    const problematiquesHtml = cleanProblematiques.length
      ? cleanProblematiques.map((p) => `<li>${escapeHtml(p)}</li>`).join("")
      : "<li><em>Aucune sélection</em></li>";

    // ── Email 1 : accusé patient (charte I-CA.RE)
    if (smtpReady && transporter) {
      const ackHtml = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F6F5F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#2B2B2B;">
<div style="max-width:560px;margin:0 auto;padding:40px 24px;background:#ffffff;">
  <div style="text-align:center;margin-bottom:32px;">
    <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#9EB8A5;font-weight:600;margin:0 0 4px;">I-CA.RE</p>
    <p style="font-size:13px;color:#6b7280;margin:0;">Espaces de soin, paramédical et bien-être</p>
  </div>
  <h1 style="font-family:Georgia,serif;font-size:24px;font-weight:normal;color:#2B2B2B;margin:0 0 24px;">Bonjour ${escapeHtml(cleanPrenom)},</h1>
  <p style="font-size:15px;line-height:1.6;color:#2B2B2B;margin:0 0 16px;">
    Nous avons bien reçu votre demande&nbsp;: merci de votre confiance.
  </p>
  <p style="font-size:15px;line-height:1.6;color:#2B2B2B;margin:0 0 16px;">
    Notre équipe revient vers vous <strong>sous 48h ouvrées</strong> pour vous orienter vers la praticienne ou le praticien I-CA.RE qui correspond le mieux à votre besoin.
  </p>
  <div style="margin:32px 0;padding:20px 24px;background:#F6F5F0;border-left:3px solid #9EB8A5;">
    <p style="font-size:13px;color:#6b7280;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.05em;">Récapitulatif de votre demande</p>
    <p style="font-size:14px;color:#2B2B2B;margin:0;white-space:pre-wrap;">${escapeHtml(cleanMessage)}</p>
  </div>
  <p style="font-size:14px;color:#2B2B2B;margin:24px 0 4px;">À très vite,</p>
  <p style="font-size:14px;color:#2B2B2B;margin:0;"><strong>L'équipe I-CA.RE</strong></p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
  <p style="font-size:11px;color:#9ca3af;line-height:1.5;margin:0;">
    I-CA.RE — Bordeaux, France<br>
    <a href="https://i-ca.re" style="color:#9ca3af;text-decoration:none;">i-ca.re</a> · <a href="mailto:contact@i-ca.re" style="color:#9ca3af;text-decoration:none;">contact@i-ca.re</a>
  </p>
</div>
</body></html>`;
      try {
        await transporter.sendMail({
          from: `"${mailFromName}" <${mailFromEmail}>`,
          to: cleanEmail,
          subject: "Votre demande a bien été reçue — I-CA.RE",
          html: ackHtml,
        });
      } catch (e) {
        console.error("[submit-demande-conciergerie] ack mail error:", e);
      }

      // ── Email 2 : notification équipe interne
      const internalEmail = Deno.env.get("INTERNAL_NOTIFICATION_EMAIL") ?? mailFromEmail;
      const adminUrl = `https://i-ca.re/admin/demandes?id=${demandeId}`;
      const notifHtml = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:640px;margin:0 auto;padding:32px 24px;">
  <h1 style="font-size:20px;color:#2B2B2B;margin:0 0 8px;">Nouvelle demande conciergerie patient</h1>
  <p style="font-size:13px;color:#6b7280;margin:0 0 24px;">Reçue le ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;color:#2B2B2B;">
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;width:200px;">Demande ID</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-family:monospace;font-size:12px;">${demandeId}</td></tr>
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Nom</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(cleanPrenom)} ${escapeHtml(cleanNom)}</td></tr>
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Email</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;"><a href="mailto:${escapeHtml(cleanEmail)}" style="color:#2563eb;">${escapeHtml(cleanEmail)}</a></td></tr>
    ${cleanTel ? `<tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Téléphone</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;"><a href="tel:${escapeHtml(cleanTel)}" style="color:#2563eb;">${escapeHtml(cleanTel)}</a></td></tr>` : ""}
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;vertical-align:top;">Problématiques pressenties</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;"><ul style="margin:0;padding-left:18px;">${problematiquesHtml}</ul></td></tr>
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Cabinet préféré</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(cabinetLabel)}</td></tr>
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Source</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(cleanSource ?? "-")}</td></tr>
  </table>
  <div style="margin-top:20px;padding:16px;background:#F6F5F0;border-radius:6px;">
    <p style="font-size:12px;color:#6b7280;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
    <p style="font-size:14px;color:#2B2B2B;margin:0;white-space:pre-wrap;">${escapeHtml(cleanMessage)}</p>
  </div>
  <p style="margin:28px 0 0;">
    <a href="${adminUrl}" style="display:inline-block;background:#9EB8A5;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:600;">Ouvrir la fiche dans l'admin</a>
  </p>
</div>
</body></html>`;
      try {
        await transporter.sendMail({
          from: `"${mailFromName}" <${mailFromEmail}>`,
          to: internalEmail,
          replyTo: `"${escapeHtml(cleanPrenom)} ${escapeHtml(cleanNom)}" <${cleanEmail}>`,
          subject: `[I-CA.RE] Nouvelle demande conciergerie — ${cleanPrenom} ${cleanNom}`,
          html: notifHtml,
        });
      } catch (e) {
        console.error("[submit-demande-conciergerie] internal mail error:", e);
      }
    }

    // ── Webhook CRM optionnel
    const webhookUrl = Deno.env.get("CONCIERGERIE_WEBHOOK_URL");
    if (webhookUrl) {
      const payload = {
        id: demandeId,
        prenom: cleanPrenom,
        nom: cleanNom,
        email: cleanEmail,
        telephone: cleanTel,
        message: cleanMessage,
        problematiques_pressenties: cleanProblematiques,
        cabinet_prefere: cleanCabinet,
        created_at: inserted.created_at,
      };
      // fire-and-forget : ne bloque pas la réponse au client
      dispatchWebhook({ webhookUrl, payload, supabase, demandeId }).catch((e) =>
        console.error("[submit-demande-conciergerie] webhook dispatcher crashed:", e),
      );
    }
    // Si CONCIERGERIE_WEBHOOK_URL absent : on ne touche pas à webhook_status
    // (= reste 'pending' par défaut, comme attendu par le brief).

    // IDN OS webhook added 2026-05-03 — see docs/icare-connect/snapshot-pre-icare-connect-2026-05.md for rollback
    try {
      await notifyIdnOs(
        supabase,
        "submit-demande-conciergerie",
        "lead_created",
        "demandes_conciergerie",
        demandeId,
        { prenom: cleanPrenom, nom: cleanNom, email: cleanEmail, telephone: cleanTel, cabinet_prefere: cleanCabinet, created_at: inserted.created_at },
      );
    } catch (e) {
      console.error("[submit-demande-conciergerie] webhook error swallowed:", e);
    }

    return json(200, { ok: true, id: demandeId });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[submit-demande-conciergerie] unhandled:", msg);
    return json(500, { error: "internal_error" });
  }
});