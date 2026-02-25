import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

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
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
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

    // Send verification email via Infomaniak SMTP
    const verificationLink = `https://i-ca.re/${locale === "en" ? "en" : "fr"}/investissement/verify?token=${verificationToken}`;

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

    const smtpClient = new SmtpClient();

    await smtpClient.connectTLS({
      hostname: "mail.infomaniak.com",
      port: 465,
      username: Deno.env.get("INFOMANIAK_SMTP_USER")!,
      password: Deno.env.get("INFOMANIAK_SMTP_PASS")!,
    });

    await smtpClient.send({
      from: Deno.env.get("INFOMANIAK_SMTP_USER")!,
      to: cleanEmail,
      subject,
      content: "",
      html: htmlBody,
    });

    await smtpClient.close();

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
