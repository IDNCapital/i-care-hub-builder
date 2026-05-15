// Edge Function : extract-praticien-tags
// Extrait via OpenAI gpt-4o-mini les tags filtrables (specialites_derivees,
// problematiques_derivees) depuis le matériel déclaratif d'un praticien
// (profession + spécialités/problématiques formelles + bio courte + bio longue).
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

// Dictionnaire de synonymes : variantes courantes → terme canonique de la taxonomie
const SYNONYM_MAP: Record<string, string> = {
  // Spécialités
  "thérapie brève self inductive": "TBSI",
  "tbsi": "TBSI",
  "thérapie brève systémique": "Thérapie brève",
  "emdr": "Thérapie EMDR",
  "psychothérapie": "Psychothérapie intégrative",
  // Problématiques
  "difficultés de concentration": "concentration",
  "troubles de l'attention": "concentration",
  "manque de confiance en soi": "estime de soi",
  "faible estime": "estime de soi",
  "perte de confiance": "estime de soi",
  "épuisement professionnel": "burn-out",
  "fatigue chronique au travail": "burn-out",
  "stress de performance": "anxiété de performance",
  "pression de performance": "anxiété de performance",
  "psychotraumatisme": "traumatismes",
  "trauma": "traumatismes",
  "tca": "troubles du comportement alimentaire",
  "troubles alimentaires": "troubles du comportement alimentaire",
};

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

function applySynonymMap(items: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    if (typeof item !== "string") continue;
    const norm = normalize(item);
    const mapped = SYNONYM_MAP[norm] ?? item;
    const key = normalize(mapped);
    if (!seen.has(key)) {
      out.push(mapped);
      seen.add(key);
    }
  }
  return out;
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

function unionAllowed(base: string[], extra: unknown, allowed: string[]): { merged: string[]; added: string[] } {
  const allowedNorm = new Map(allowed.map((a) => [normalize(a), a]));
  const merged = [...base];
  const seen = new Set(base.map((b) => normalize(b)));
  const added: string[] = [];
  if (Array.isArray(extra)) {
    for (const item of extra) {
      if (typeof item !== "string") continue;
      const canonical = allowedNorm.get(normalize(item));
      if (canonical && !seen.has(normalize(canonical))) {
        merged.push(canonical);
        added.push(canonical);
        seen.add(normalize(canonical));
      }
    }
  }
  return { merged, added };
}

const SYSTEM_PROMPT = `Tu es un assistant qui extrait des tags filtrables depuis le matériel déclaratif validé par un praticien du soin et du bien-être. Ce matériel comprend ses spécialités et problématiques formellement déclarées, sa bio courte et sa bio longue. Ta mission : produire la liste la plus complète possible des tags réellement applicables à ce praticien, sans inventer.

Règles strictes :

1. **PRIORITÉ ABSOLUE — Tags formellement déclarés.** Si le praticien a déclaré formellement une spécialité ou une problématique (sections SPÉCIALITÉS FORMELLEMENT DÉCLARÉES et PROBLÉMATIQUES FORMELLEMENT DÉCLARÉES), et que ce tag est présent dans les listes autorisées ci-dessous, tu DOIS l'inclure dans ta sortie. C'est une déclaration validée par le praticien lui-même, donc source de vérité prioritaire.

2. **Extraction depuis la bio.** En plus des tags formellement déclarés, extraire tous les tags supplémentaires affirmés ou clairement impliqués dans la bio courte et la bio longue. Exemples :
   - « accompagne enfants, adolescents et adultes » → extraire \`adolescents\` (public-cible reçu)
   - « spécialisée dans le stress scolaire » → extraire \`stress scolaire\`
   - « praticienne en sophrologie » → extraire \`Sophrologie\`

3. **Publics-cibles.** Le tag \`adolescents\` (dans la taxonomie autorisée) est à extraire dès que le praticien indique accompagner des enfants, ados, adolescents, jeunes, ou mineurs — c'est un public-cible, pas une problématique au sens strict. Logique identique pour tout autre tag de public-cible présent dans la taxonomie autorisée.

4. **Négations et exclusions.** Ne JAMAIS extraire un tag si le matériel nie ou exclut explicitement le sujet (ex : « je ne reçois pas de mineurs » → ne pas inclure \`adolescents\`).

5. **Synonymes et variantes.** Pour les concepts voisins, utiliser le terme canonique de la taxonomie autorisée. Tableau d'équivalences à appliquer :
   - difficultés de concentration, troubles de l'attention → \`concentration\`
   - manque de confiance en soi, faible estime → \`estime de soi\`
   - épuisement professionnel, fatigue chronique au travail → \`burn-out\`
   - stress de performance, pression de performance → \`anxiété de performance\`
   - couples, conjoint, vie de couple → ne pas extraire (hors taxonomie actuelle, à signaler dans notes)
   - thérapie familiale, dynamique familiale → ne pas extraire (hors taxonomie, à signaler dans notes)
   - art-thérapie, médiation artistique → ne pas extraire (hors taxonomie, à signaler dans notes)
   - psychotraumatisme, trauma → \`traumatismes\`
   - obésité, surpoids → ne pas extraire (hors taxonomie, à signaler dans notes)

6. **Ne JAMAIS retourner un tag absent des listes autorisées ci-dessous.** Si un concept est pertinent mais hors taxonomie, le mentionner dans le champ \`notes\`.

7. **Confiance.** \`confiance: "haute"\` si tous les tags sont fermement étayés par le matériel. \`"moyenne"\` si certaines extractions reposent sur des inférences raisonnables. \`"basse"\` si plusieurs tags sont incertains.

Champ \`notes\` : utiliser pour lister les concepts pertinents évoqués dans le matériel mais hors taxonomie actuelle (ex : « art-thérapie évoquée, hors taxonomie » ; « couples mentionnés, hors taxonomie »). Maximum 300 caractères. Vide si rien à signaler.

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
      "id, profession, specialites, problematiques, bio_courte, bio_courte_en, bio_longue, bio_longue_en, tags_bio_hash, tags_extraction_log",
    )
    .eq("id", praticienId)
    .maybeSingle();

  if (readErr || !praticien) {
    return new Response(JSON.stringify({ error: "Praticien introuvable" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const profession = (praticien.profession ?? "").trim();
  const declaredSpecs: string[] = Array.isArray(praticien.specialites)
    ? praticien.specialites.filter((x: unknown): x is string => typeof x === "string")
    : [];
  const declaredProbs: string[] = Array.isArray(praticien.problematiques)
    ? praticien.problematiques.filter((x: unknown): x is string => typeof x === "string")
    : [];
  const bioCourte = (praticien.bio_courte ?? "").trim();
  const bioLongue = (praticien.bio_longue ?? "").trim();
  const bioLongueEffective = bioLongue.length > 0 ? bioLongue : bioCourte;

  // Composite source
  const composite = [
    `PROFESSION DÉCLARÉE : ${profession || "Non renseignée"}`,
    "",
    "SPÉCIALITÉS FORMELLEMENT DÉCLARÉES (validées par le praticien) :",
    declaredSpecs.length > 0 ? declaredSpecs.join(", ") : "Aucune déclarée",
    "",
    "PROBLÉMATIQUES FORMELLEMENT DÉCLARÉES (validées par le praticien) :",
    declaredProbs.length > 0 ? declaredProbs.join(", ") : "Aucune déclarée",
    "",
    "BIO COURTE :",
    bioCourte || "Non renseignée",
    "",
    "BIO LONGUE :",
    bioLongueEffective || "Non renseignée",
  ].join("\n");

  const hasAnyMaterial =
    profession.length > 0 ||
    declaredSpecs.length > 0 ||
    declaredProbs.length > 0 ||
    bioCourte.length > 0 ||
    bioLongueEffective.length > 0;

  if (!hasAnyMaterial) {
    const log = appendLog(praticien.tags_extraction_log, {
      ts: new Date().toISOString(),
      status: "error",
      error: "Aucun matériel déclaratif disponible",
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
      JSON.stringify({ status: "error", error: "no_material" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const bioSource = "composite";
  const currentHash = await sha256Hex(`${bioSource}::${composite}`);

  // Idempotence
  if (!force && praticien.tags_bio_hash === currentHash) {
    const log = appendLog(praticien.tags_extraction_log, {
      ts: new Date().toISOString(),
      status: "skipped",
      reason: "hash_unchanged",
      bio_source: bioSource,
      bio_length: composite.length,
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
          { role: "user", content: composite },
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

    // Étape 1 : SYNONYM_MAP
    const specsAfterSyn = applySynonymMap(rawSpecs);
    const probsAfterSyn = applySynonymMap(rawProbs);

    // Étape 2 : intersectAllowed
    const specsAfterIntersect = intersectAllowed(specsAfterSyn, SPEC_ALLOWED);
    const probsAfterIntersect = intersectAllowed(probsAfterSyn, PROB_ALLOWED);

    // Étape 3 : Union avec déclarations formelles
    const specsUnion = unionAllowed(specsAfterIntersect, declaredSpecs, SPEC_ALLOWED);
    const probsUnion = unionAllowed(probsAfterIntersect, declaredProbs, PROB_ALLOWED);

    const specsClean = specsUnion.merged;
    const probsClean = probsUnion.merged;

    const specsFilteredOut = specsAfterSyn.filter(
      (t) => !specsAfterIntersect.some((c) => normalize(c) === normalize(t)),
    );
    const probsFilteredOut = probsAfterSyn.filter(
      (t) => !probsAfterIntersect.some((c) => normalize(c) === normalize(t)),
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
      bio_excerpt: composite.slice(0, 500),
      bio_length: composite.length,
      model_returned: { specialites: rawSpecs, problematiques: rawProbs },
      after_synonym_map: { specialites: specsAfterSyn, problematiques: probsAfterSyn },
      after_intersect_allowed: {
        specialites: specsAfterIntersect,
        problematiques: probsAfterIntersect,
      },
      model_returned_filtered_out: {
        specialites: specsFilteredOut,
        problematiques: probsFilteredOut,
      },
      added_from_declarations: {
        specialites: specsUnion.added,
        problematiques: probsUnion.added,
      },
      final: { specialites: specsClean, problematiques: probsClean },
      notes: typeof parsed.notes === "string" ? parsed.notes.slice(0, 300) : "",
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
      bio_length: composite.length,
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
