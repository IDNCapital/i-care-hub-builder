import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { googleMapsPlaceUrl } from "@/lib/google-maps-url";

/**
 * Section « Avis Google » partagée.
 *
 * Extraite des fiches praticien (Sprint 9) pour être montée aussi sur les
 * fiches cabinet /projets/[cabinet] (Sprint 10, lot 1). Un seul composant,
 * deux points de montage : ne pas en recréer un second ailleurs.
 *
 * Lecture : table publique `avis_google_cache`, clé `place_id`. Le
 * rafraîchissement est fait par l'Edge Function refresh-google-reviews,
 * jamais ici.
 *
 * Drapeau de couverture : la section ne rend rien tant que la ligne de cache
 * n'existe pas ou que `rating` est NULL. Avec `exigerAuMoinsUnAvis`, elle
 * exige en plus au moins un avis exploitable, ce qui interdit toute section
 * vide sur les cabinets sans fiche Google.
 *
 * Le composant ne rend ni meta, ni JSON-LD : les avis collectés
 * par un tiers ne sont pas balisés.
 */

export type AvisGoogleAvis = {
  author?: string;
  rating?: number;
  text?: string;
  published_at?: string;
  profile_photo_url?: string;
};

export type AvisGoogleCacheRow = {
  place_id: string;
  rating: number | null;
  user_ratings_total: number | null;
  google_display_name: string | null;
  last_updated_at: string;
  google_url: string | null;
  reviews: AvisGoogleAvis[] | null;
};

const COLORS = {
  anthracite: "#2B2B2B",
  green: "#9EB8A5",
  forest: "#1E392B",
  gold: "#D9C7A1",
  sageLight: "#E2EAE5",
  textMuted: "#6B6B6B",
};

const LABELS = {
  fr: {
    titre: "Avis Google",
    avisGoogle: (n: number) => `${n} avis Google`,
    surLeProfil: "Avis Google sur le profil",
    mentionSimple: "Avis Google",
    misAJourLe: "Mis à jour le",
    voirTous: "Voir tous les avis sur Google",
    voirPlus: "Voir plus",
    voirMoins: "Voir moins",
    anonyme: "Anonyme",
    surCinq: "sur 5",
    aujourdhui: "aujourd'hui",
  },
  en: {
    titre: "Google reviews",
    avisGoogle: (n: number) => `${n} Google reviews`,
    surLeProfil: "Google reviews for",
    mentionSimple: "Google reviews",
    misAJourLe: "Updated on",
    voirTous: "See all reviews on Google",
    voirPlus: "Show more",
    voirMoins: "Show less",
    anonyme: "Anonymous",
    surCinq: "out of 5",
    aujourdhui: "today",
  },
} as const;

type Lang = "fr" | "en";

function authorInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

/** Ancienneté d'un avis, en toutes lettres. Chaîne vide si la date est absente. */
function formatRelative(iso: string | undefined, lang: Lang): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  const t = LABELS[lang];
  if (days < 1) return t.aujourdhui;
  if (lang === "en") {
    if (days < 7) return `${days} d ago`;
    if (days < 30) return `${Math.floor(days / 7)} w ago`;
    if (days < 365) return `${Math.floor(days / 30)} mo ago`;
    const y = Math.floor(days / 365);
    return `${y} year${y > 1 ? "s" : ""} ago`;
  }
  if (days < 7) return `il y a ${days} j`;
  if (days < 30) return `il y a ${Math.floor(days / 7)} sem.`;
  if (days < 365) return `il y a ${Math.floor(days / 30)} mois`;
  const y = Math.floor(days / 365);
  return `il y a ${y} an${y > 1 ? "s" : ""}`;
}

/** Date de fraîcheur du cache. Chaîne vide si la date est inexploitable. */
function formatDateShort(iso: string | null | undefined, lang: Lang): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function StarsRow({
  value,
  size = 16,
  lang = "fr",
}: {
  value: number;
  size?: number;
  lang?: Lang;
}) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.25 && value - full < 0.75;
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${value} ${LABELS[lang].surCinq}`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = i < full || (i === full && hasHalf);
        return (
          <Star
            key={i}
            style={{
              width: size,
              height: size,
              color: COLORS.gold,
              fill: fill ? COLORS.gold : "transparent",
            }}
          />
        );
      })}
    </div>
  );
}

function ReviewItem({ review, lang }: { review: AvisGoogleAvis; lang: Lang }) {
  const [expanded, setExpanded] = useState(false);
  const t = LABELS[lang];
  const text = review.text ?? "";
  const long = text.length > 240;
  const author = review.author ?? t.anonyme;
  return (
    <div className="py-4">
      <div className="flex items-start gap-3">
        {review.profile_photo_url ? (
          <img
            src={review.profile_photo_url}
            alt=""
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
            style={{ backgroundColor: COLORS.sageLight, color: COLORS.forest }}
          >
            {authorInitials(author)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[0.95rem]" style={{ color: COLORS.anthracite }}>
              {author}
            </span>
            {typeof review.rating === "number" && (
              <StarsRow value={review.rating} size={13} lang={lang} />
            )}
          </div>
          <div className="text-[0.85rem] mt-0.5" style={{ color: COLORS.textMuted }}>
            {formatRelative(review.published_at, lang)}
          </div>
          <p
            className={`text-[0.95rem] leading-[1.6] mt-2 whitespace-pre-line ${expanded || !long ? "" : "line-clamp-3"}`}
            style={{ color: COLORS.anthracite }}
          >
            {text}
          </p>
          {long && (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="text-[0.85rem] mt-1.5 font-medium hover:underline"
              style={{ color: COLORS.green }}
            >
              {expanded ? t.voirMoins : t.voirPlus}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function SectionAvisGoogle({
  placeId,
  nomPourLien,
  lang = "fr",
  exigerAuMoinsUnAvis = false,
  className = "mt-12",
}: {
  /** Place ID Google du lieu. Sans lui, rien n'est rendu et rien n'est requêté. */
  placeId: string | null | undefined;
  /** Nom lisible utilisé comme requête de repli dans l'URL Google Maps. */
  nomPourLien: string;
  lang?: Lang;
  /** Couverture stricte : exige au moins un avis exploitable en plus de la note. */
  exigerAuMoinsUnAvis?: boolean;
  className?: string;
}) {
  const [cache, setCache] = useState<AvisGoogleCacheRow | null>(null);
  const t = LABELS[lang];

  useEffect(() => {
    if (!placeId) {
      setCache(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("avis_google_cache")
        .select("place_id,rating,user_ratings_total,google_display_name,last_updated_at,google_url,reviews")
        .eq("place_id", placeId)
        .maybeSingle();
      if (!cancelled) setCache((data ?? null) as AvisGoogleCacheRow | null);
    })();
    return () => {
      cancelled = true;
    };
  }, [placeId]);

  const topReviews: AvisGoogleAvis[] = useMemo(() => {
    if (!cache?.reviews) return [];
    return [...cache.reviews]
      .filter((r) => r.text)
      .sort((a, b) => {
        const da = a.published_at ? new Date(a.published_at).getTime() : 0;
        const db = b.published_at ? new Date(b.published_at).getTime() : 0;
        return db - da;
      })
      .slice(0, 3);
  }, [cache]);

  const couvert =
    !!placeId &&
    !!cache &&
    cache.rating != null &&
    (!exigerAuMoinsUnAvis || topReviews.length > 0);

  if (!couvert || !cache) return null;

  const dateMaj = formatDateShort(cache.last_updated_at, lang);
  const mapsUrl = googleMapsPlaceUrl(cache.google_display_name || nomPourLien, placeId);

  return (
    <section className={className}>
      <h2 className="font-heading" style={{ fontSize: "1.5rem", color: COLORS.anthracite }}>
        {t.titre}
      </h2>
      <div className="mt-4 flex items-center gap-3">
        <StarsRow value={cache.rating ?? 0} size={18} lang={lang} />
        <span
          className="font-heading"
          style={{ fontSize: "2rem", color: COLORS.anthracite, lineHeight: 1 }}
        >
          {lang === "fr"
            ? (cache.rating ?? 0).toFixed(1).replace(".", ",")
            : (cache.rating ?? 0).toFixed(1)}
        </span>
      </div>
      <div className="mt-1" style={{ fontSize: "0.9rem", color: COLORS.textMuted }}>
        {t.avisGoogle(cache.user_ratings_total ?? 0)}
      </div>

      {topReviews.length > 0 && (
        <div className="mt-4">
          {topReviews.map((r, i) => (
            <div
              key={i}
              style={{ borderTop: i === 0 ? "none" : "1px solid rgba(144, 169, 151, 0.2)" }}
            >
              <ReviewItem review={r} lang={lang} />
            </div>
          ))}
        </div>
      )}

      <div
        className="mt-6 pt-4 flex flex-col gap-2"
        style={{
          borderTop: "1px solid rgba(144, 169, 151, 0.2)",
          fontSize: "0.8rem",
          color: COLORS.textMuted,
        }}
      >
        {/* Mention de fraîcheur : retirée en entier si la date est inexploitable. */}
        {dateMaj && (
          <span>
            {cache.google_display_name ? (
              <>
                {t.surLeProfil} <em>{cache.google_display_name}</em>
              </>
            ) : (
              <>{t.mentionSimple}</>
            )}{" "}
            · {t.misAJourLe} {dateMaj}
          </span>
        )}
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: COLORS.green }}
          >
            {t.voirTous} →
          </a>
        )}
      </div>
    </section>
  );
}
