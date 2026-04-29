import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PRATICIENS_BOOTSTRAP = [
  {
    prenom: "Cécile", nom: "Denis", profession: "Naturopathe",
    specialites: ["Fasciathérapie"], cabinet_slug: "i-ca-re-jardin-public",
    nom_gbp: "Cécile Denis Fasciathérapie Naturopathie Bordeaux",
    cabinet_lat: 44.8483, cabinet_lng: -0.5777, cabinet_cp: "33000",
  },
  {
    prenom: "Sylvette", nom: "Quérion", profession: "Praticienne bien-être",
    specialites: [], cabinet_slug: "i-ca-re-jardin-public",
    nom_gbp: "Sylvette Quérion Bordeaux",
    cabinet_lat: 44.8483, cabinet_lng: -0.5777, cabinet_cp: "33000",
  },
  {
    prenom: "Charlotte", nom: "Darquier", profession: "Psychopraticienne",
    specialites: ["Gestalt-thérapie"], cabinet_slug: "i-ca-re-jardin-public",
    nom_gbp: "Charlotte Darquier Psychopraticienne Gestalt thérapie Bordeaux",
    cabinet_lat: 44.8483, cabinet_lng: -0.5777, cabinet_cp: "33000",
  },
  {
    prenom: "Valérie", nom: "Plaisant", profession: "Praticienne bien-être",
    specialites: ["Massage"], cabinet_slug: "i-ca-re-jardin-public",
    nom_gbp: "Ôm Zen Massage Bordeaux Formation",
    cabinet_lat: 44.8483, cabinet_lng: -0.5777, cabinet_cp: "33000",
  },
  {
    prenom: "Marine", nom: "Les Enfants", profession: "Praticienne",
    specialites: [], cabinet_slug: "i-ca-re-pey-berland",
    nom_gbp: "Marine Les Enfant Bordeaux",
    cabinet_lat: 44.8397, cabinet_lng: -0.5789, cabinet_cp: "33000",
  },
  {
    prenom: "Léa", nom: "Sgiaravello", profession: "Psychologue",
    specialites: [], cabinet_slug: "i-ca-re-pey-berland",
    nom_gbp: "Léa Sgiaravello Psychologue Bordeaux",
    cabinet_lat: 44.8397, cabinet_lng: -0.5789, cabinet_cp: "33000",
  },
  {
    prenom: "Loubna", nom: "Lamri", profession: "Sophrologue",
    specialites: ["Psychopraticienne", "Breathwork"], cabinet_slug: "i-ca-re-pey-berland",
    nom_gbp: "Loubna Lamri Sophrologue Psychopraticienne Breathwork Bordeaux",
    cabinet_lat: 44.8397, cabinet_lng: -0.5789, cabinet_cp: "33000",
  },
  {
    prenom: "Vanessa", nom: "Marty", profession: "Psychologue",
    specialites: [], cabinet_slug: "i-ca-re-pey-berland",
    nom_gbp: "Vanessa Marty Psychologue Bordeaux",
    cabinet_lat: 44.8397, cabinet_lng: -0.5789, cabinet_cp: "33000",
  },
  {
    prenom: "Elodie", nom: "Morre", profession: "Praticienne",
    specialites: [], cabinet_slug: "i-ca-re-pey-berland",
    nom_gbp: "Elodie Morre Bordeaux",
    cabinet_lat: 44.8397, cabinet_lng: -0.5789, cabinet_cp: "33000",
  },
  {
    prenom: "Alex", nom: "Constantin", profession: "Psychologue",
    specialites: ["Psychologie du travail"], cabinet_slug: "i-ca-re-pey-berland",
    nom_gbp: "Alex Constantin Bordeaux",
    cabinet_lat: 44.8397, cabinet_lng: -0.5789, cabinet_cp: "33000",
  },
  {
    prenom: "Manon", nom: "Arnaud", profession: "Psychothérapeute",
    specialites: ["Psychothérapie intégrative & humaniste", "TCA"],
    cabinet_slug: "i-ca-re-nansouty",
    nom_gbp: "Manon Arnaud Psychothérapie intégrative humaniste TCA Bordeaux",
    cabinet_lat: 44.8193, cabinet_lng: -0.5794, cabinet_cp: "33800",
  },
  {
    prenom: "Jazmin", nom: "Cousins", profession: "Psychothérapeute",
    specialites: ["Psychothérapie brève adulte", "Accompagnement enfant ado"],
    cabinet_slug: "i-ca-re-nansouty",
    nom_gbp: "Jazmin Cousins Psychothérapie brève Adulte enfants Bordeaux",
    cabinet_lat: 44.8193, cabinet_lng: -0.5794, cabinet_cp: "33800",
  },
  {
    prenom: "Fanny", nom: "Nombret", profession: "Psychologue",
    specialites: [], cabinet_slug: "i-ca-re-nansouty",
    nom_gbp: "Fanny Nombret Psychologue Bordeaux",
    cabinet_lat: 44.8193, cabinet_lng: -0.5794, cabinet_cp: "33800",
  },
  {
    prenom: "Clotilde", nom: "Monteilhet", profession: "Sophrologue",
    specialites: ["Stress scolaire enfants & ados"], cabinet_slug: "i-ca-re-nansouty",
    nom_gbp: "Clotilde Monteilhet Sophrologue Stress Enfants Ados Bordeaux",
    cabinet_lat: 44.8193, cabinet_lng: -0.5794, cabinet_cp: "33800",
  },
];

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Auth: Bearer BOOTSTRAP_TOKEN
  const expectedToken = Deno.env.get("BOOTSTRAP_TOKEN");
  const authHeader = req.headers.get("authorization") ?? "";
  const provided = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!expectedToken || !provided || provided !== expectedToken) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const apiKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Missing GOOGLE_PLACES_API_KEY" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const ok: any[] = [];
  const no_match: any[] = [];
  const errors: any[] = [];

  for (const p of PRATICIENS_BOOTSTRAP) {
    try {
      const body = {
        textQuery: p.nom_gbp,
        locationBias: {
          circle: {
            center: { latitude: p.cabinet_lat, longitude: p.cabinet_lng },
            radius: 500.0,
          },
        },
        languageCode: "fr",
      };

      const res = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "places.id,places.displayName,places.rating,places.userRatingCount,places.formattedAddress,places.googleMapsUri,places.reviews",
          },
          body: JSON.stringify(body),
        },
      );

      if (!res.ok) {
        const text = await res.text();
        errors.push({ praticien: `${p.prenom} ${p.nom}`, error: `HTTP ${res.status}: ${text}` });
        await sleep(200);
        continue;
      }

      const data = await res.json();
      const places: any[] = data.places ?? [];

      const match = places.find((pl) =>
        typeof pl.formattedAddress === "string" &&
        pl.formattedAddress.includes(p.cabinet_cp)
      );

      if (!match) {
        no_match.push({
          praticien: `${p.prenom} ${p.nom}`,
          raison: `Aucun résultat avec CP ${p.cabinet_cp}`,
          results_received: places.map((pl) => ({
            id: pl.id,
            displayName: pl.displayName?.text,
            formattedAddress: pl.formattedAddress,
          })),
        });
        await sleep(200);
        continue;
      }

      const slug = slugify(`${p.prenom} ${p.nom}`);
      const placeId = match.id;
      const displayName = match.displayName?.text ?? null;
      const rating = match.rating ?? null;
      const userRatingsTotal = match.userRatingCount ?? null;
      const googleUrl = match.googleMapsUri ?? null;
      const compactReviews = (match.reviews ?? []).map((r: any) => ({
        author: r.authorAttribution?.displayName ?? null,
        rating: r.rating ?? null,
        text: r.text?.text ?? r.originalText?.text ?? null,
        published_at: r.publishTime ?? null,
      }));

      // Upsert praticien (on slug)
      const { error: upPraticienErr } = await supabase
        .from("praticiens")
        .upsert(
          {
            slug,
            cabinet_slug: p.cabinet_slug,
            prenom: p.prenom,
            nom: p.nom,
            genre: "F",
            profession: p.profession,
            specialites: p.specialites,
            problematiques: [],
            google_place_id: placeId,
            statut_validation: "brouillon",
            actif: true,
          },
          { onConflict: "slug" },
        );

      if (upPraticienErr) {
        errors.push({
          praticien: `${p.prenom} ${p.nom}`,
          error: `praticiens upsert: ${upPraticienErr.message}`,
        });
        await sleep(200);
        continue;
      }

      // Upsert avis_google_cache (on place_id)
      const { error: upCacheErr } = await supabase
        .from("avis_google_cache")
        .upsert(
          {
            place_id: placeId,
            rating,
            user_ratings_total: userRatingsTotal,
            google_display_name: displayName,
            google_url: googleUrl,
            reviews: compactReviews,
            last_updated_at: new Date().toISOString(),
          },
          { onConflict: "place_id" },
        );

      if (upCacheErr) {
        errors.push({
          praticien: `${p.prenom} ${p.nom}`,
          error: `avis_google_cache upsert: ${upCacheErr.message}`,
        });
        await sleep(200);
        continue;
      }

      ok.push({
        praticien: `${p.prenom} ${p.nom}`,
        place_id: placeId,
        rating,
        user_ratings_total: userRatingsTotal,
        google_display_name: displayName,
      });
    } catch (e) {
      errors.push({
        praticien: `${p.prenom} ${p.nom}`,
        error: (e as Error).message,
      });
    }
    await sleep(200);
  }

  const result = {
    ok,
    no_match,
    errors,
    summary: {
      total: PRATICIENS_BOOTSTRAP.length,
      ok: ok.length,
      no_match: no_match.length,
      errors: errors.length,
    },
  };

  return new Response(JSON.stringify(result, null, 2), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});