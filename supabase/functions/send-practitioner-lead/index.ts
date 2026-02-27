import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import nodemailer from "npm:nodemailer@6.9.16";

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
      first_name, last_name, email, phone, organisation, website,
      profession, city, neighbourhood, move_in_date, surface, message,
      lang, source_url, honeypot,
    } = body;

    // Honeypot anti-spam check
    if (honeypot) {
      return new Response(
        JSON.stringify({ status: "ok" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate required fields
    if (!first_name?.trim() || !last_name?.trim() || !email?.trim() || !phone?.trim() || !profession || !city?.trim()) {
      return new Response(
        JSON.stringify({ error: "missing_fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase().slice(0, 255);
    if (!emailRegex.test(cleanEmail)) {
      return new Response(
        JSON.stringify({ error: "invalid_email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Simple phone validation (allow digits, +, spaces, dashes, dots, parens)
    const cleanPhone = phone.trim().slice(0, 30);
    if (!/^[+\d\s.\-()]{6,30}$/.test(cleanPhone)) {
      return new Response(
        JSON.stringify({ error: "invalid_phone" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      requireEnv("SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY")
    );

    // Rate limit: 1 submission per email per 60 seconds
    const { data: recentLead } = await supabase
      .from("practitioner_leads")
      .select("id, last_email_sent_at")
      .eq("email", cleanEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentLead?.last_email_sent_at) {
      const lastSent = new Date(recentLead.last_email_sent_at).getTime();
      if (Date.now() - lastSent < 60_000) {
        return new Response(
          JSON.stringify({ error: "rate_limited" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const now = new Date().toISOString();
    const cleanFirstName = first_name.trim().slice(0, 100);
    const cleanLastName = last_name.trim().slice(0, 100);
    const cleanCity = city.trim().slice(0, 100);
    const locale = lang === "en" ? "en" : "fr";

    // Insert lead into DB
    const { error: insertError } = await supabase
      .from("practitioner_leads")
      .insert({
        first_name: cleanFirstName,
        last_name: cleanLastName,
        email: cleanEmail,
        phone: cleanPhone,
        organisation: organisation?.trim().slice(0, 200) || null,
        website: website?.trim().slice(0, 300) || null,
        profession,
        city: cleanCity,
        neighbourhood: neighbourhood?.trim().slice(0, 200) || null,
        move_in_date: move_in_date || null,
        surface: surface || null,
        message: message?.trim().slice(0, 2000) || null,
        lang: locale,
        source_url: source_url?.slice(0, 500) || null,
        consent: true,
        consent_at: now,
        last_email_sent_at: now,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      throw insertError;
    }

    // Setup SMTP
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

    // ── Email 1: Notification to contact@i-ca.re ──
    const professionLabel = profession;
    const notifSubject = `[I-CA.RE] Nouvelle demande cabinet – ${cleanCity} – ${professionLabel}`;
    const notifHtml = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
  <h1 style="font-size:20px;color:#2B2B2B;margin-bottom:24px;">Nouvelle demande de cabinet</h1>
  <table style="width:100%;border-collapse:collapse;font-size:14px;color:#374151;">
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;width:180px;">Prénom Nom</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${cleanFirstName} ${cleanLastName}</td></tr>
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Email</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;"><a href="mailto:${cleanEmail}" style="color:#2563eb;">${cleanEmail}</a></td></tr>
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Téléphone</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;"><a href="tel:${cleanPhone}" style="color:#2563eb;">${cleanPhone}</a></td></tr>
    ${organisation ? `<tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Organisation</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${organisation.trim()}</td></tr>` : ""}
    ${website ? `<tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Site web</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${website.trim()}</td></tr>` : ""}
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Profession</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${professionLabel}</td></tr>
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Ville</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${cleanCity}</td></tr>
    ${neighbourhood ? `<tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Quartier</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${neighbourhood.trim()}</td></tr>` : ""}
    ${move_in_date ? `<tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Date souhaitée</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${move_in_date}</td></tr>` : ""}
    ${surface ? `<tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Surface</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${surface}</td></tr>` : ""}
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Langue</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${locale.toUpperCase()}</td></tr>
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Source</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${source_url || "-"}</td></tr>
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Date</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}</td></tr>
  </table>
  ${message ? `<div style="margin-top:24px;padding:16px;background:#f9fafb;border-radius:8px;"><p style="font-size:13px;color:#6b7280;margin:0 0 8px;">Message :</p><p style="font-size:14px;color:#374151;margin:0;white-space:pre-wrap;">${message.trim()}</p></div>` : ""}
</div>
</body></html>`;

    await transporter.sendMail({
      from: `"${mailFromName}" <${mailFromEmail}>`,
      to: mailFromEmail,
      replyTo: `"${cleanFirstName} ${cleanLastName}" <${cleanEmail}>`,
      subject: notifSubject,
      html: notifHtml,
    });

    // ── Email 2: Acknowledgment to prospect ──
    const isFr = locale === "fr";
    const ackSubject = isFr
      ? "I-CA.RE – Nous avons bien reçu votre demande"
      : "I-CA.RE – We have received your enquiry";

    const ackHtml = isFr
      ? `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 24px;">
  <h1 style="font-size:22px;color:#2B2B2B;margin-bottom:8px;">I-CA.RE</h1>
  <p style="font-size:14px;color:#6b7280;margin-bottom:32px;">Espaces de soin et de bien-être</p>
  <h2 style="font-size:20px;color:#2B2B2B;margin-bottom:16px;">Bonjour ${cleanFirstName},</h2>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:16px;">
    Nous avons bien reçu votre demande de cabinet et nous vous en remercions.
  </p>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:16px;">
    Notre équipe étudie votre projet et reviendra vers vous <strong>sous 48h ouvrées</strong> avec une proposition adaptée à vos besoins.
  </p>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:24px;">
    En attendant, n'hésitez pas à consulter <a href="https://i-ca.re/projets" style="color:#2563eb;">nos projets</a> pour découvrir nos espaces.
  </p>
  <p style="font-size:15px;color:#374151;">À bientôt,<br><strong>L'équipe I-CA.RE</strong></p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
  <p style="font-size:12px;color:#9ca3af;">
    I-CA.RE — Espaces de soin et de bien-être<br>
    Bordeaux, France — <a href="https://i-ca.re" style="color:#9ca3af;">i-ca.re</a><br>
    <a href="mailto:contact@i-ca.re" style="color:#9ca3af;">contact@i-ca.re</a> — 06 49 80 80 97
  </p>
</div>
</body></html>`
      : `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 24px;">
  <h1 style="font-size:22px;color:#2B2B2B;margin-bottom:8px;">I-CA.RE</h1>
  <p style="font-size:14px;color:#6b7280;margin-bottom:32px;">Care & wellbeing spaces</p>
  <h2 style="font-size:20px;color:#2B2B2B;margin-bottom:16px;">Hello ${cleanFirstName},</h2>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:16px;">
    We have received your office enquiry and thank you for your interest.
  </p>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:16px;">
    Our team is reviewing your project and will get back to you <strong>within 48 business hours</strong> with a tailored proposal.
  </p>
  <p style="font-size:15px;color:#374151;line-height:1.6;margin-bottom:24px;">
    In the meantime, feel free to explore <a href="https://i-ca.re/en/projects" style="color:#2563eb;">our projects</a> to discover our spaces.
  </p>
  <p style="font-size:15px;color:#374151;">Best regards,<br><strong>The I-CA.RE Team</strong></p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px;">
  <p style="font-size:12px;color:#9ca3af;">
    I-CA.RE — Care & wellbeing spaces<br>
    Bordeaux, France — <a href="https://i-ca.re" style="color:#9ca3af;">i-ca.re</a><br>
    <a href="mailto:contact@i-ca.re" style="color:#9ca3af;">contact@i-ca.re</a> — 06 49 80 80 97
  </p>
</div>
</body></html>`;

    await transporter.sendMail({
      from: `"${mailFromName}" <${mailFromEmail}>`,
      to: cleanEmail,
      subject: ackSubject,
      html: ackHtml,
    });

    return new Response(
      JSON.stringify({ status: "ok" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("send-practitioner-lead error:", error);
    return new Response(
      JSON.stringify({ error: "internal_error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
