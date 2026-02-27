import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import nodemailer from "npm:nodemailer@6.9.16";

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
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

const PROFILE_LABELS: Record<string, string> = {
  family_office: "Family Office",
  investisseur_prive: "Investisseur privé",
  cgp: "CGP / Conseiller en gestion de patrimoine",
  banque: "Banque / Établissement financier",
  autre: "Autre",
};

const NOTIFICATION_TO = "n.idelot@idn-capital.fr";

async function sendInternalNotification(lead: Record<string, unknown>) {
  try {
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

    const now = new Date();
    const dateStr = now.toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

    const profileLabel = PROFILE_LABELS[lead.profile_type as string] || lead.profile_type;

    const lines = [
      `Date : ${dateStr}`,
      `Source : site i-ca.re (formulaire Investissement)`,
      `Email vérifié : OUI`,
      ``,
      `--- Informations du prospect ---`,
      ``,
      `Nom : ${lead.first_name} ${lead.last_name}`,
      `Email : ${lead.email}`,
      lead.phone ? `Téléphone : ${lead.phone}` : null,
      `Profil : ${profileLabel}`,
      `Ticket : ${lead.ticket_range}`,
      lead.area_interest ? `Zone d'intérêt : ${lead.area_interest}` : null,
      lead.source_page ? `Page source : ${lead.source_page}` : null,
      `Inscription : ${lead.created_at ? new Date(lead.created_at as string).toLocaleString("fr-FR", { timeZone: "Europe/Paris" }) : "N/A"}`,
    ].filter(Boolean);

    if (lead.message) {
      lines.push("", "--- Message ---", "", lead.message as string);
    }

    const textBody = lines.join("\n");

    const htmlBody = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <h1 style="font-size:18px;color:#2B2B2B;margin-bottom:4px;">🔔 Nouvel investisseur qualifié</h1>
    <p style="font-size:13px;color:#6b7280;margin-bottom:24px;">Email vérifié le ${dateStr}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#374151;">
      <tr><td style="padding:8px 12px;font-weight:600;color:#6b7280;width:140px;vertical-align:top;">Nom</td><td style="padding:8px 12px;">${lead.first_name} ${lead.last_name}</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:8px 12px;font-weight:600;color:#6b7280;">Email</td><td style="padding:8px 12px;"><a href="mailto:${lead.email}" style="color:#2563eb;">${lead.email}</a></td></tr>
      ${lead.phone ? `<tr><td style="padding:8px 12px;font-weight:600;color:#6b7280;">Téléphone</td><td style="padding:8px 12px;">${lead.phone}</td></tr>` : ""}
      <tr style="background:#f9fafb;"><td style="padding:8px 12px;font-weight:600;color:#6b7280;">Profil</td><td style="padding:8px 12px;">${profileLabel}</td></tr>
      <tr><td style="padding:8px 12px;font-weight:600;color:#6b7280;">Ticket</td><td style="padding:8px 12px;">${lead.ticket_range}</td></tr>
      ${lead.area_interest ? `<tr style="background:#f9fafb;"><td style="padding:8px 12px;font-weight:600;color:#6b7280;">Zone d'intérêt</td><td style="padding:8px 12px;">${lead.area_interest}</td></tr>` : ""}
      <tr><td style="padding:8px 12px;font-weight:600;color:#6b7280;">Page source</td><td style="padding:8px 12px;">${lead.source_page || "N/A"}</td></tr>
      <tr style="background:#f9fafb;"><td style="padding:8px 12px;font-weight:600;color:#6b7280;">Inscription</td><td style="padding:8px 12px;">${lead.created_at ? new Date(lead.created_at as string).toLocaleString("fr-FR", { timeZone: "Europe/Paris" }) : "N/A"}</td></tr>
    </table>
    ${lead.message ? `<div style="margin-top:20px;padding:16px;background:#f3f4f6;border-radius:8px;"><p style="font-size:13px;font-weight:600;color:#6b7280;margin:0 0 8px;">Message</p><p style="font-size:14px;color:#374151;margin:0;white-space:pre-wrap;">${lead.message}</p></div>` : ""}
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0 12px;">
    <p style="font-size:11px;color:#9ca3af;">Notification automatique — I-CA.RE</p>
  </div>
</body>
</html>`;

    await transporter.sendMail({
      from: `"${mailFromName}" <${mailFromEmail}>`,
      to: NOTIFICATION_TO,
      subject: "[I-CA.RE] Nouvel investisseur qualifié (email vérifié)",
      text: textBody,
      html: htmlBody,
    });

    console.log("Internal notification sent to", NOTIFICATION_TO);
    return true;
  } catch (err) {
    console.error("Failed to send internal notification:", err);
    return false;
  }
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
      .select("id, first_name, last_name, email, phone, profile_type, ticket_range, area_interest, message, source_page, created_at, verified_at, verification_expires_at, notified_at")
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

    // Send internal notification (only if not already notified)
    if (!lead.notified_at) {
      const sent = await sendInternalNotification(lead);
      if (sent) {
        await supabase
          .from("investor_leads")
          .update({ notified_at: new Date().toISOString() })
          .eq("id", lead.id);
      }
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
