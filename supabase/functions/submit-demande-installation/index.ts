import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import nodemailer from "npm:nodemailer@6.9.16";

// ─────────────────────────────────────────────────────────────────────
// submit-demande-installation
// Clone du pattern éprouvé submit-demande-conciergerie :
//   - Honeypot (champ `website`)
//   - Rate-limit 5/h par IP (hash salé)
//   - Validation stricte côté serveur
//   - Insert en service_role (bypass RLS)
//   - Double email transactionnel via SMTP Infomaniak (nodemailer)
// Aucune donnée nominative n'est logguée : seuls les codes d'erreur
// structurants sont écrits via console.error.
// ─────────────────────────────────────────────────────────────────────

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
      profession_slug,
      ville_slug,
      nom,
      email,
      telephone,
      message,
      consentement_rgpd,
      source_path,
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
    const cleanProfession = String(profession_slug ?? "").trim().slice(0, 100);
    const cleanVille = ville_slug
      ? String(ville_slug).trim().slice(0, 100)
      : null;
    const cleanNom = String(nom ?? "").trim().slice(0, 100);
    const cleanEmail = String(email ?? "").trim().toLowerCase().slice(0, 255);
    const cleanTel = telephone ? String(telephone).trim().slice(0, 30) : null;
    const cleanMessage = message
      ? String(message).trim().slice(0, 2000)
      : null;
    const cleanSource = source_path ? String(source_path).slice(0, 500) : null;

    if (!cleanProfession) return json(400, { error: "missing_profession" });
    if (cleanNom.length < 2) return json(400, { error: "invalid_name" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return json(400, { error: "invalid_email" });
    }
    if (cleanTel && !/^[+\d\s.\-()]{6,20}$/.test(cleanTel)) {
      return json(400, { error: "invalid_phone" });
    }

    // ── IP hash
    const xff = req.headers.get("x-forwarded-for") ?? "";
    const ip = xff.split(",")[0]?.trim() || "unknown";
    const ipSalt = Deno.env.get("IP_HASH_SALT") ?? "i-ca-re-installation-salt-v1";
    const ipHash = await sha256Hex(`${ipSalt}:${ip}`);
    const userAgent = (req.headers.get("user-agent") ?? "").slice(0, 500);

    // ── Supabase service role (bypass RLS)
    const supabase = createClient(
      requireEnv("SUPABASE_URL"),
      requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    );

    // ── Vérification profession_slug existe et est active
    const { data: professionRow, error: profErr } = await supabase
      .from("professions")
      .select("slug, nom_inclusif_pluriel, actif")
      .eq("slug", cleanProfession)
      .maybeSingle();
    if (profErr) {
      console.error("[submit-demande-installation] profession lookup error:", profErr);
      return json(500, { error: "internal_error" });
    }
    if (!professionRow || professionRow.actif === false) {
      return json(400, { error: "invalid_profession" });
    }
    const professionLabel =
      (professionRow.nom_inclusif_pluriel as string | null) ?? cleanProfession;

    // ── Vérification ville_slug (slug_installation d'un projet pipeline)
    let villeLabel: string | null = null;
    if (cleanVille) {
      const { data: projetRow, error: projErr } = await supabase
        .from("projets")
        .select("slug_installation, name")
        .eq("slug_installation", cleanVille)
        .maybeSingle();
      if (projErr) {
        console.error("[submit-demande-installation] projet lookup error:", projErr);
        return json(500, { error: "internal_error" });
      }
      if (!projetRow) {
        return json(400, { error: "invalid_ville" });
      }
      villeLabel = (projetRow.name as string | null) ?? cleanVille;
    }

    // ── Rate limit : max 5 soumissions / heure / IP
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: recentCount } = await supabase
      .from("demandes_installation")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", oneHourAgo);
    if ((recentCount ?? 0) >= 5) {
      return json(429, { error: "rate_limited" });
    }

    // ── Insert
    const { data: inserted, error: insertErr } = await supabase
      .from("demandes_installation")
      .insert({
        profession_slug: cleanProfession,
        ville_slug: cleanVille,
        nom: cleanNom,
        email: cleanEmail,
        telephone: cleanTel,
        message: cleanMessage,
        consentement_rgpd: true,
        source_path: cleanSource,
        user_agent: userAgent || null,
        ip_hash: ipHash,
        statut: "nouvelle",
      })
      .select("id, created_at")
      .single();
    if (insertErr || !inserted) {
      console.error("[submit-demande-installation] insert error:", insertErr);
      return json(500, { error: "internal_error" });
    }
    const demandeId = inserted.id as string;

    // ── SMTP (Infomaniak — même infra que submit-demande-conciergerie)
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
      console.warn("[submit-demande-installation] SMTP not configured:", e);
    }

    if (smtpReady && transporter) {
      // ── Email 1 : accusé candidat (vouvoiement, ton charté I-CA.RE)
      const ackHtml = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F6F5F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#2B2B2B;">
<div style="max-width:560px;margin:0 auto;padding:40px 24px;background:#ffffff;">
  <div style="text-align:center;margin-bottom:32px;">
    <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#9EB8A5;font-weight:600;margin:0 0 4px;">I-CA.RE</p>
    <p style="font-size:13px;color:#6b7280;margin:0;">Espaces de soin, paramédical et bien-être</p>
  </div>
  <h1 style="font-family:Georgia,serif;font-size:24px;font-weight:normal;color:#2B2B2B;margin:0 0 24px;">Bonjour ${escapeHtml(cleanNom)},</h1>
  <p style="font-size:15px;line-height:1.6;color:#2B2B2B;margin:0 0 16px;">
    Nous avons bien reçu votre demande d'installation en cabinet I-CA.RE. Merci de l'intérêt que vous portez à notre projet.
  </p>
  <p style="font-size:15px;line-height:1.6;color:#2B2B2B;margin:0 0 16px;">
    Notre équipe revient vers vous <strong>sous 48h ouvrées</strong> avec les informations détaillées sur les espaces disponibles, les conditions de location et le planning d'ouverture.
  </p>
  <div style="margin:32px 0;padding:20px 24px;background:#F6F5F0;border-left:3px solid #9EB8A5;">
    <p style="font-size:13px;color:#6b7280;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.05em;">Récapitulatif</p>
    <p style="font-size:14px;color:#2B2B2B;margin:0 0 4px;"><strong>Profession :</strong> ${escapeHtml(professionLabel)}</p>
    ${villeLabel ? `<p style="font-size:14px;color:#2B2B2B;margin:0 0 4px;"><strong>Cabinet visé :</strong> ${escapeHtml(villeLabel)}</p>` : ""}
    ${cleanMessage ? `<p style="font-size:14px;color:#2B2B2B;margin:8px 0 0;white-space:pre-wrap;">${escapeHtml(cleanMessage)}</p>` : ""}
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
          subject: "Votre demande d'installation a bien été reçue — I-CA.RE",
          html: ackHtml,
        });
      } catch (e) {
        console.error("[submit-demande-installation] ack mail error:", e);
      }

      // ── Email 2 : notification équipe interne
      const internalEmail = Deno.env.get("INTERNAL_NOTIFICATION_EMAIL") ?? mailFromEmail;
      const adminUrl = `https://i-ca.re/admin/demandes?id=${demandeId}`;
      const sourceLink = cleanSource
        ? `<a href="https://i-ca.re${escapeHtml(cleanSource)}" style="color:#2563eb;">${escapeHtml(cleanSource)}</a>`
        : "-";
      const notifHtml = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:640px;margin:0 auto;padding:32px 24px;">
  <h1 style="font-size:20px;color:#2B2B2B;margin:0 0 8px;">Nouvelle demande d'installation praticien</h1>
  <p style="font-size:13px;color:#6b7280;margin:0 0 24px;">Reçue le ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;color:#2B2B2B;">
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;width:200px;">Demande ID</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-family:monospace;font-size:12px;">${demandeId}</td></tr>
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Nom</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(cleanNom)}</td></tr>
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Email</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;"><a href="mailto:${escapeHtml(cleanEmail)}" style="color:#2563eb;">${escapeHtml(cleanEmail)}</a></td></tr>
    ${cleanTel ? `<tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Téléphone</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;"><a href="tel:${escapeHtml(cleanTel)}" style="color:#2563eb;">${escapeHtml(cleanTel)}</a></td></tr>` : ""}
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Profession</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(professionLabel)} <code style="font-size:11px;color:#6b7280;">(${escapeHtml(cleanProfession)})</code></td></tr>
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Cabinet visé</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${villeLabel ? `${escapeHtml(villeLabel)} <code style="font-size:11px;color:#6b7280;">(${escapeHtml(cleanVille!)})</code>` : "<em>Aucun (demande depuis l'index)</em>"}</td></tr>
    <tr><td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">Page source</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${sourceLink}</td></tr>
  </table>
  ${cleanMessage ? `<div style="margin-top:20px;padding:16px;background:#F6F5F0;border-radius:6px;">
    <p style="font-size:12px;color:#6b7280;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
    <p style="font-size:14px;color:#2B2B2B;margin:0;white-space:pre-wrap;">${escapeHtml(cleanMessage)}</p>
  </div>` : ""}
  <p style="margin:28px 0 0;">
    <a href="${adminUrl}" style="display:inline-block;background:#9EB8A5;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:14px;font-weight:600;">Ouvrir dans l'admin</a>
  </p>
</div>
</body></html>`;
      try {
        await transporter.sendMail({
          from: `"${mailFromName}" <${mailFromEmail}>`,
          to: internalEmail,
          replyTo: `"${escapeHtml(cleanNom)}" <${cleanEmail}>`,
          subject: `[I-CA.RE] Nouvelle demande installation — ${cleanNom} · ${professionLabel}${villeLabel ? ` · ${villeLabel}` : ""}`,
          html: notifHtml,
        });
      } catch (e) {
        console.error("[submit-demande-installation] internal mail error:", e);
      }
    }

    return json(200, { ok: true, id: demandeId });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[submit-demande-installation] unhandled:", msg);
    return json(500, { error: "internal_error" });
  }
});