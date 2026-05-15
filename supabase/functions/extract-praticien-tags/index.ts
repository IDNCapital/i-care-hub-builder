// Edge Function : extract-praticien-tags
// Lot 0ter — Extraction LLM 3 dimensions (spécialités, problématiques, publics-cibles)
// + capture des candidats hors-taxonomie dans la table taxonomy_candidates.
// Auth : header x-cron-token comparé en constant-time à CRON_TOKEN.

import { createClient } from "npm:@supabase/supabase-js@2.45.0";
import {
  ALL_PROBLEMATIQUES,
  ALL_PUBLICS,
  ALL_SPECIALITIES,
  IMPLICIT_TERMS,
  SYNONYM_MAP,
  TAXONOMY_VERSION,
} from "../_shared/taxonomy.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-cron-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
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

function unionAllowed(
  base: string[],
  extra: unknown,
  allowed: string[],
): { merged: string[]; added: string[] } {
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

type Dim = "specialite" | "problematique" | "public";

function parseCandidates(notes: string): Array<{ term: string; dimension: Dim }> {
  if (!notes) return [];
  const re = /\[CANDIDAT-(specialite|problematique|public)\]\s*([^\[\n,;]+)/gi;
  const out: Array<{ term: string; dimension: Dim }> = [];
  const seen = new Set<string>();
  for (const m of notes.matchAll(re)) {
    const dim = m[1].toLowerCase() as Dim;
    const term = m[2].trim().replace(/[.;]+$/, "");
    if (!term) continue;
    const key = `${dim}::${normalize(term)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ term, dimension: dim });
  }
  return out;
}

const SYSTEM_PROMPT = `Tu es un assistant qui extrait des tags filtrables depuis le matériel déclaratif validé par un praticien du soin et du bien-être. Tu produis TROIS listes SÉPARÉES :

1. **specialites** : méthodes thérapeutiques pratiquées (psychothérapie, sophrologie, EMDR, etc.)
2. **problematiques** : ce que le praticien traite (anxiété, burn-out, douleur chronique, etc.)
3. **publics_cibles** : publics que le praticien reçoit explicitement (enfants, adolescents, couples, familles)

Règles strictes :

R1. **Priorité absolue — Tags formellement déclarés.** Les tags présents dans les sections SPÉCIALITÉS FORMELLEMENT DÉCLARÉES et PROBLÉMATIQUES FORMELLEMENT DÉCLARÉES doivent être inclus s'ils figurent dans les listes autorisées correspondantes.

R2. **Extraction depuis bio.** Extraire en plus tous les tags supplémentaires affirmés ou clairement impliqués par les bios courte et longue.

R3. **Publics-cibles dans une dimension dédiée.** Les tags \`enfants\`, \`adolescents\`, \`couples\`, \`familles\` se placent UNIQUEMENT dans \`publics_cibles\`, JAMAIS dans \`problematiques\`. Règle : « j'accompagne X » → X est un public. « je traite Y » → Y est une problématique.

R4. **Négations et exclusions.** Si le matériel exclut explicitement un sujet/public (« je ne reçois pas de mineurs »), ne pas l'extraire.

R5. **Synonymes.** Utiliser uniquement les termes canoniques des listes autorisées. Un dictionnaire de post-traitement côté code rabat les variantes courantes — pas de reformulations gratuites de ta part.

R6. **Ne JAMAIS retourner un tag absent des listes autorisées.** Si un concept pertinent est hors taxonomie, le mentionner dans \`notes\` avec un préfixe explicite : \`[CANDIDAT-specialite] thérapie de groupe\` ou \`[CANDIDAT-problematique] phobie sociale\` ou \`[CANDIDAT-public] seniors\`. Sépare plusieurs candidats par des virgules ou retours à la ligne. C'est ainsi que la taxonomie s'enrichit.

R7. **Confiance.** \`haute\` si tags fermement étayés. \`moyenne\` si inférences raisonnables. \`basse\` si plusieurs incertitudes.

SPÉCIALITÉS AUTORISÉES : ${ALL_SPECIALITIES.join(", ")}

PROBLÉMATIQUES AUTORISÉES : ${ALL_PROBLEMATIQUES.join(", ")}

PUBLICS-CIBLES AUTORISÉS : ${ALL_PUBLICS.join(", ")}`;

const JSON_SCHEMA = {
  name: "praticien_tags",
  strict: true,
  schema: {
    type: "object",
    properties: {
      specialites: { type: "array", items: { type: "string" } },
      problematiques: { type: "array", items: { type: "string" } },
      publics_cibles: { type: "array", items: { type: "string" } },
      confiance: { type: "string", enum: ["haute", "moyenne", "basse"] },
      notes: { type: "string" },
    },
    required: [
      "specialites",
      "problematiques",
      "publics_cibles",
      "confiance",
      "notes",
    ],
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
      taxonomy_version: TAXONOMY_VERSION,
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
  const currentHash = await sha256Hex(`${TAXONOMY_VERSION}::${bioSource}::${composite}`);

  if (!force && praticien.tags_bio_hash === currentHash) {
    const log = appendLog(praticien.tags_extraction_log, {
      ts: new Date().toISOString(),
      status: "skipped",
      reason: "hash_unchanged",
      taxonomy_version: TAXONOMY_VERSION,
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
    const rawPubs = Array.isArray(parsed.publics_cibles)
      ? parsed.publics_cibles.filter((x: unknown): x is string => typeof x === "string")
      : [];

    // SYNONYM_MAP
    const specsAfterSyn = applySynonymMap(rawSpecs);
    const probsAfterSyn = applySynonymMap(rawProbs);
    const pubsAfterSyn = applySynonymMap(rawPubs);

    // intersectAllowed
    const specsAfterIntersect = intersectAllowed(specsAfterSyn, ALL_SPECIALITIES);
    const probsAfterIntersect = intersectAllowed(probsAfterSyn, ALL_PROBLEMATIQUES);
    const pubsAfterIntersect = intersectAllowed(pubsAfterSyn, ALL_PUBLICS);

    // Union avec déclarations formelles (specialités + problématiques uniquement)
    const specsUnion = unionAllowed(specsAfterIntersect, declaredSpecs, ALL_SPECIALITIES);
    const probsUnion = unionAllowed(probsAfterIntersect, declaredProbs, ALL_PROBLEMATIQUES);

    const specsClean = specsUnion.merged;
    const probsClean = probsUnion.merged;
    const pubsClean = pubsAfterIntersect;

    const specsFilteredOut = specsAfterSyn.filter(
      (t) => !specsAfterIntersect.some((c) => normalize(c) === normalize(t)),
    );
    const probsFilteredOut = probsAfterSyn.filter(
      (t) => !probsAfterIntersect.some((c) => normalize(c) === normalize(t)),
    );
    const pubsFilteredOut = pubsAfterSyn.filter(
      (t) => !pubsAfterIntersect.some((c) => normalize(c) === normalize(t)),
    );

    const confiance = ["haute", "moyenne", "basse"].includes(parsed.confiance)
      ? parsed.confiance
      : "basse";
    const status = confiance === "basse" ? "review" : "success";

    const llmNotes = typeof parsed.notes === "string" ? parsed.notes.slice(0, 500) : "";

    // Capture des candidats hors-taxonomie sur les 3 dimensions
    // Source = termes renvoyés par le LLM mais filtrés-out à l'étape intersect.
    // Les IMPLICIT_TERMS sont silencieusement absorbés (ni final, ni candidat).
    const dimensionSources: Array<{
      dimension: Dim;
      filteredOut: string[];
      implicit: string[];
      shortTag: "spe" | "prb" | "pub";
    }> = [
      { dimension: "specialite", filteredOut: specsFilteredOut, implicit: IMPLICIT_TERMS.specialites, shortTag: "spe" },
      { dimension: "problematique", filteredOut: probsFilteredOut, implicit: IMPLICIT_TERMS.problematiques, shortTag: "prb" },
      { dimension: "public", filteredOut: pubsFilteredOut, implicit: IMPLICIT_TERMS.publics_cibles, shortTag: "pub" },
    ];

    const capturedCandidates: Array<{ term: string; dimension: Dim }> = [];
    const noteSegments: string[] = [];
    const seenCapture = new Set<string>();
    for (const src of dimensionSources) {
      const implicitNorm = new Set(src.implicit.map((t) => normalize(t)));
      for (const term of src.filteredOut) {
        const normTerm = normalize(term);
        if (!normTerm) continue;
        if (implicitNorm.has(normTerm)) continue;
        const key = `${src.dimension}::${normTerm}`;
        if (seenCapture.has(key)) continue;
        seenCapture.add(key);
        try {
          await supabase.rpc("upsert_taxonomy_candidate", {
            p_term: term,
            p_term_normalized: normTerm,
            p_dimension: src.dimension,
            p_praticien_id: praticienId,
          });
          capturedCandidates.push({ term, dimension: src.dimension });
          noteSegments.push(`[CANDIDAT-${src.shortTag}] ${term}`);
        } catch (err) {
          console.error(
            "upsert_taxonomy_candidate failed",
            err instanceof Error ? err.message : err,
          );
        }
      }
    }
    const notes = noteSegments.length > 0
      ? noteSegments.join(" | ")
      : llmNotes;

    const log = appendLog(praticien.tags_extraction_log, {
      ts: new Date().toISOString(),
      status,
      confiance,
      taxonomy_version: TAXONOMY_VERSION,
      bio_source: bioSource,
      bio_excerpt: composite.slice(0, 500),
      bio_length: composite.length,
      model_returned: {
        specialites: rawSpecs,
        problematiques: rawProbs,
        publics_cibles: rawPubs,
      },
      after_synonym_map: {
        specialites: specsAfterSyn,
        problematiques: probsAfterSyn,
        publics_cibles: pubsAfterSyn,
      },
      after_intersect_allowed: {
        specialites: specsAfterIntersect,
        problematiques: probsAfterIntersect,
        publics_cibles: pubsAfterIntersect,
      },
      model_returned_filtered_out: {
        specialites: specsFilteredOut,
        problematiques: probsFilteredOut,
        publics_cibles: pubsFilteredOut,
      },
      added_from_declarations: {
        specialites: specsUnion.added,
        problematiques: probsUnion.added,
      },
      final: {
        specialites: specsClean,
        problematiques: probsClean,
        publics_cibles: pubsClean,
      },
      candidates_captured: capturedCandidates,
      specialites_count: specsClean.length,
      problematiques_count: probsClean.length,
      publics_count: pubsClean.length,
      notes,
    });

    const { error: updErr } = await supabase
      .from("praticiens")
      .update({
        specialites_derivees: specsClean,
        problematiques_derivees: probsClean,
        publics_derives: pubsClean,
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
        publics_cibles: pubsClean,
        confiance,
        candidates_captured: capturedCandidates.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("extract-praticien-tags failure", e instanceof Error ? e.message : e);
    const log = appendLog(praticien.tags_extraction_log, {
      ts: new Date().toISOString(),
      status: "error",
      taxonomy_version: TAXONOMY_VERSION,
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