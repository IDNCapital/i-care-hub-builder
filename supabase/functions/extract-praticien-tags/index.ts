// Edge Function : extract-praticien-tags
// Extrait via OpenAI gpt-4o-mini les tags filtrables (specialites_derivees,
// problematiques_derivees) depuis la bio d'un praticien.
// Authentification : header x-cron-token comparé en constant-time à CRON_TOKEN.

import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-cron-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// MIRROR — keep in sync with src/components/patients/PatientsOuvert.tsx
const SPECIALITY_GROUPS: Record<string, string[]> = {
  "Soin psychique": [
    "Psychologie clinique",
    "Psychologie du travail",
    "Psychothérapie humaniste",
    "Psychothérapie intégrative",
    "Thérapie EMDR",
    "Thérapie brève",
    "Sophrologie",
    "Sophrothérapie",
    "Gestalt-thérapie",
  ],
  "Soin du corps": [
    "Massage bien-être",
    "Kobido",
    "Réflexologie plantaire",
    "Shiatsu",
    "Breathwork",
  ],
  "Pratiques énergétiques": ["Reiki", "Rebirthing", "TBSI"],
  "Enfance et adolescence": ["Stress scolaire enfants & ados"],
};

const PROBLEMATIQUE_GROUPS: Record<string, string[]> = {
  "Stress et anxiété": [
    "anxiété",
    "anxiété de performance",
    "stress",
    "surcharge émotionnelle",
    "régulation émotionnelle",
  ],
  "Travail et orientation": [
    "burn-out",
    "souffrance au travail",
    "stress au travail",
    "transition professionnelle",
    "orientation",
  ],
  "Vie et transitions": [
    "transitions de vie",
    "périodes de doute",
    "questionnements",
    "situations complexes",
    "parcours de vie difficiles",
    "blocages persistants",
    "difficultés personnelles",
  ],
  "Estime et rapport à soi": [
    "estime de soi",
    "peur de l'échec",
    "relation au corps",
    "souffrance psychique",
    "difficultés relationnelles",
    "parentalité",
  ],
  "Enfants et adolescents": [
    "adolescents",
    "stress scolaire",
    "tensions liées à la pression scolaire",
    "concentration",
  ],
  "Corps et émotions": [
    "douleur chronique",
    "détente",
    "relaxation",
    "relâchement des tensions",
    "bien-être global",
    "traumatismes",
    "troubles émotionnels",
    "troubles du comportement alimentaire",
    "TCA",
  ],
};

const SPEC_ALLOWED = Array.from(new Set(Object.values(SPECIALITY_GROUPS).flat()));
const PROB_ALLOWED = Array.from(new Set(Object.values(PROBLEMATIQUE_GROUPS).flat()));

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
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

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function intersectAllowed(received: unknown, allowed: string[]): string[] {
  if (!Array.isArray(received)) return [];
  const allowedNorm = new Map(allowed.map((a) => [normalize(a), a]));
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of received) {
    if (typeof item !== "string") continue;
    const canonical = allowedNorm.get(normalize(item));
    if (canonical && !seen.has(canonical)) {
      out.push(canonical);
      seen.add(canonical);
    }
  }
  return out;
}

const SYSTEM_PROMPT = `Tu es un assistant qui extrait des tags filtrables depuis la biographie d'un praticien du soin et du bien-être. Tu ne dois JAMAIS inventer un tag absent de la taxonomie autorisée fournie.

Règles strictes :
1. N'extraire que les tags affirmés explicitement ou clairement impliqués dans la bio (ex. : "j'accompagne enfants et ados" → adolescents)
2. Ne PAS extraire un tag si la bio le nie ou l'exclut (ex. : "je ne reçois pas de mineurs" → ne pas inclure adolescents)
3. Ne PAS extraire un tag sur la base d'une mention indirecte d'une seule occurrence ambiguë
4. En cas de doute sur un tag, ne pas l'inclure
5. Retourner uniquement les tags présents dans les listes autorisées ci-dessous

SPÉCIALITÉS AUTORISÉES : ${SPEC_ALLOWED.join(", ")}
PROBLÉMATIQUES AUTORISÉES : ${PROB_ALLOWED.join(", ")}`;

const JSON_SCHEMA = {
  name: "praticien_tags",
  strict: true,
  schema: {
    type: "object",
    properties: {
      specialites: { type: "array", items: { type: "string" } },
      problematiques: { type: "array", items: { type: "string" } },
      confiance: { type: "string", enum: ["haute", "moyenne", "basse"] },
      notes: { type: "string" },
    },
    required: ["specialites", "problematiques", "confiance", "notes"],
    additionalProperties: false,
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const cronSecret = Deno.env.get("CRON_TOKEN");
  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  if (!cronSecret || !openaiKey) {
    return new Response(JSON.stringify({ error: "Server misconfigured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const provided = req.headers.get("x-cron-token") ?? "";
  if (!constantTimeEqual(provided, cronSecret)) {
    await new Promise((r) => setTimeout(r, 600));
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: { praticien_id?: string; force?: boolean };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const praticienId = body.praticien_id;
  const force = body.force === true;
  if (!praticienId || typeof praticienId !== "string") {
    return new Response(JSON.stringify({ error: "praticien_id requis" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: praticien, error: readErr } = await supabase
    .from("praticiens")
    .select(
      "id, bio_courte, bio_longue, tags_bio_hash, tags_extraction_log, specialites_derivees, problematiques_derivees",
    )
    .eq("id", praticienId)
    .maybeSingle();

  if (readErr || !praticien) {
    return new Response(JSON.stringify({ error: "Praticien introuvable" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const bioConcat = `${praticien.bio_courte ?? ""}\n---\n${praticien.bio_longue ?? ""}`;
  const currentHash = await sha256Hex(bioConcat);

  // Idempotence
  if (!force && praticien.tags_bio_hash === currentHash) {
    const log = appendLog(praticien.tags_extraction_log, {
      ts: new Date().toISOString(),
      status: "skipped",
      reason: "hash_unchanged",
    });
    await supabase
      .from("praticiens")
      .update({
        tags_extraction_status: "skipped",
        tags_extracted_at: new Date().toISOString(),
        tags_extraction_log: log,
      })
      .eq("id", praticienId);
    return new Response(
      JSON.stringify({ status: "skipped", reason: "hash_unchanged" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // Cas bio vide → on persiste pending vide
  if (!bioConcat.trim() || bioConcat.trim() === "---") {
    const log = appendLog(praticien.tags_extraction_log, {
      ts: new Date().toISOString(),
      status: "skipped",
      reason: "empty_bio",
    });
    await supabase
      .from("praticiens")
      .update({
        tags_extraction_status: "skipped",
        tags_bio_hash: currentHash,
        tags_extracted_at: new Date().toISOString(),
        tags_extraction_log: log,
      })
      .eq("id", praticienId);
    return new Response(JSON.stringify({ status: "skipped", reason: "empty_bio" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Appel OpenAI
  try {
    const aiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0,
        response_format: { type: "json_schema", json_schema: JSON_SCHEMA },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: bioConcat },
        ],
      }),
    });

    if (!aiResp.ok) {
      const txt = await aiResp.text();
      console.error("OpenAI error", aiResp.status, txt.slice(0, 200));
      throw new Error(`OpenAI ${aiResp.status}`);
    }
    const aiJson = await aiResp.json();
    const content = aiJson?.choices?.[0]?.message?.content;
    if (typeof content !== "string") throw new Error("No content");
    const parsed = JSON.parse(content);

    const specsClean = intersectAllowed(parsed.specialites, SPEC_ALLOWED);
    const probsClean = intersectAllowed(parsed.problematiques, PROB_ALLOWED);
    const confiance = ["haute", "moyenne", "basse"].includes(parsed.confiance)
      ? parsed.confiance
      : "basse";
    const status = confiance === "basse" ? "review" : "success";

    const log = appendLog(praticien.tags_extraction_log, {
      ts: new Date().toISOString(),
      status,
      confiance,
      specialites_count: specsClean.length,
      problematiques_count: probsClean.length,
    });

    const { error: updErr } = await supabase
      .from("praticiens")
      .update({
        specialites_derivees: specsClean,
        problematiques_derivees: probsClean,
        tags_bio_hash: currentHash,
        tags_extraction_status: status,
        tags_extracted_at: new Date().toISOString(),
        tags_extraction_log: log,
      })
      .eq("id", praticienId);
    if (updErr) throw updErr;

    return new Response(
      JSON.stringify({
        status,
        specialites: specsClean,
        problematiques: probsClean,
        confiance,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("extract-praticien-tags failure", e instanceof Error ? e.message : e);
    const log = appendLog(praticien.tags_extraction_log, {
      ts: new Date().toISOString(),
      status: "error",
      error: e instanceof Error ? e.message : "unknown",
    });
    await supabase
      .from("praticiens")
      .update({
        tags_extraction_status: "error",
        tags_extracted_at: new Date().toISOString(),
        tags_extraction_log: log,
      })
      .eq("id", praticienId);
    return new Response(
      JSON.stringify({ status: "error", error: "extraction_failed" }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

function appendLog(prev: unknown, entry: Record<string, unknown>): unknown[] {
  const arr = Array.isArray(prev) ? [...prev] : [];
  arr.push(entry);
  return arr.slice(-10);
}