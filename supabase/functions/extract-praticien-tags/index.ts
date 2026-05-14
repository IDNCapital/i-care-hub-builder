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
const SYSTEM_PROMPT = `Tu es un assistant qui extrait des tags filtrables depuis la biographie d'un praticien du soin et du bien-être. Ta mission : tagger tout ce que la biographie affirme positivement sur la pratique du praticien, sans rien inventer ni présumer.

Règles strictes :
1. Extraire tous les tags affirmés ou clairement impliqués dans la bio, même quand l'affirmation est brève. Exemple : « accompagne enfants, adolescents et adultes » → extraire \`adolescents\`. Exemple : « spécialisée dans le stress scolaire » → extraire \`stress scolaire\`.
2. Ne JAMAIS extraire un tag si la bio le nie, l'exclut, ou en restreint la portée. Exemples : « je ne reçois pas de mineurs » → ne pas inclure \`adolescents\`. « uniquement adultes » → ne pas inclure de problématiques liées aux enfants.
3. Extraire les tags publics-cibles (\`adolescents\`) ET les tags de problématiques (\`burn-out\`, \`anxiété\`, etc.) dès qu'ils sont nommés ou paraphrasés clairement.
4. Si la bio parle d'une problématique en termes voisins mais non identiques (ex : « difficultés au travail » pour \`souffrance au travail\`), extraire le tag de la taxonomie le plus proche.
5. Ne JAMAIS retourner un tag absent des listes autorisées ci-dessous.
6. Si confiance dans une extraction est faible (formulation très vague, ou métaphorique), positionner \`confiance: "moyenne"\` ou \`"basse"\` selon l'ampleur. Un seul cas faible suffit à baisser la confiance globale.

Champ \`notes\` : utiliser pour signaler toute ambiguïté importante ou choix de tagging non évident. Maximum 200 caractères. Laisser vide si aucune note utile.

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
      "id, bio_courte, bio_courte_en, bio_longue, bio_longue_en, tags_bio_hash, tags_extraction_log, specialites_derivees, problematiques_derivees",
    )
    .eq("id", praticienId)
    .maybeSingle();

  if (readErr || !praticien) {
    return new Response(JSON.stringify({ error: "Praticien introuvable" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Sélection du texte source soumis à OpenAI : bio longue FR > courte FR > courte EN > historique
  const candidates: Array<{ source: string; value: string | null | undefined }> = [
    { source: "bio_longue_fr", value: praticien.bio_longue },
    { source: "bio_courte_fr", value: praticien.bio_courte },
    { source: "bio_courte_en", value: praticien.bio_courte_en },
  ];
  let bioSource: string | null = null;
  let bioText = "";
  for (const c of candidates) {
    const v = (c.value ?? "").trim();
    if (c.source === "bio_longue_fr" ? v.length > 50 : v.length > 0) {
      bioSource = c.source;
      bioText = v;
      break;
    }
  }

  if (!bioSource) {
    const log = appendLog(praticien.tags_extraction_log, {
      ts: new Date().toISOString(),
      status: "error",
      error: "Aucune bio disponible pour cette fiche",
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
      JSON.stringify({ status: "error", error: "no_bio" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const currentHash = await sha256Hex(`${bioSource}::${bioText}`);

  // Idempotence
  if (!force && praticien.tags_bio_hash === currentHash) {
    const log = appendLog(praticien.tags_extraction_log, {
      ts: new Date().toISOString(),
      status: "skipped",
      reason: "hash_unchanged",
      bio_source: bioSource,
      bio_length: bioText.length,
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
          { role: "user", content: bioText },
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

    const rawSpecs = Array.isArray(parsed.specialites)
      ? parsed.specialites.filter((x: unknown): x is string => typeof x === "string")
      : [];
    const rawProbs = Array.isArray(parsed.problematiques)
      ? parsed.problematiques.filter((x: unknown): x is string => typeof x === "string")
      : [];
    const specsClean = intersectAllowed(rawSpecs, SPEC_ALLOWED);
    const probsClean = intersectAllowed(rawProbs, PROB_ALLOWED);
    const specsFilteredOut = rawSpecs.filter(
      (t) => !specsClean.some((c) => normalize(c) === normalize(t)),
    );
    const probsFilteredOut = rawProbs.filter(
      (t) => !probsClean.some((c) => normalize(c) === normalize(t)),
    );
    const confiance = ["haute", "moyenne", "basse"].includes(parsed.confiance)
      ? parsed.confiance
      : "basse";
    const status = confiance === "basse" ? "review" : "success";

    const log = appendLog(praticien.tags_extraction_log, {
      ts: new Date().toISOString(),
      status,
      confiance,
      bio_source: bioSource,
      bio_excerpt: bioText.slice(0, 500),
      bio_length: bioText.length,
      model_returned: { specialites: rawSpecs, problematiques: rawProbs },
      model_returned_filtered_out: {
        specialites: specsFilteredOut,
        problematiques: probsFilteredOut,
      },
      final: { specialites: specsClean, problematiques: probsClean },
      notes: typeof parsed.notes === "string" ? parsed.notes.slice(0, 200) : "",
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
      bio_source: bioSource,
      bio_length: bioText.length,
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