import { useEffect, useMemo, useRef, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
 * Drapeau de couverture : les avis ne sont rendus que si la ligne de cache
 * existe et que `rating` n'est pas NULL. Avec `exigerAuMoinsUnAvis`, la section
 * exige en plus au moins un avis exploitable, ce qui interdit toute section
 * vide sur les cabinets sans fiche Google. Une lecture en cours ou refusée
 * affiche un état neutre sans reprendre les avis ni le lien du lieu précédent.
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
    chargement: "Chargement des avis Google…",
    indisponibles: "Les avis Google sont indisponibles pour le moment.",
    reessayer: "Réessayer la lecture des avis",
    lienIndisponible: "Lien Google indisponible pour ce lieu.",
    nombreIndisponible: "Nombre d'avis Google non disponible.",
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
    chargement: "Loading Google reviews…",
    indisponibles: "Google reviews are unavailable right now.",
    reessayer: "Retry reading reviews",
    lienIndisponible: "Google link unavailable for this place.",
    nombreIndisponible: "Google review count unavailable.",
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

function cacheValide(value: unknown, placeId: string): value is AvisGoogleCacheRow {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const r = value as Record<string, unknown>;
  const texteOuNull = (v: unknown) => v === null || typeof v === "string";
  const note = (v: unknown) => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 5;
  if (
    r.place_id !== placeId ||
    (r.rating !== null && !note(r.rating)) ||
    (r.user_ratings_total !== null && (!Number.isSafeInteger(r.user_ratings_total) || Number(r.user_ratings_total) < 0)) ||
    !texteOuNull(r.google_display_name) || !texteOuNull(r.google_url) || typeof r.last_updated_at !== "string"
  ) return false;
  return r.reviews === null || (Array.isArray(r.reviews) && r.reviews.every(v => {
    if (!v || typeof v !== "object" || Array.isArray(v)) return false;
    const avis = v as Record<string, unknown>;
    return ["author", "text", "published_at", "profile_photo_url"].every(k => avis[k] === undefined || texteOuNull(avis[k])) && (avis.rating === undefined || avis.rating === null || note(avis.rating));
  }));
}

/** Le lien vient du cache de ce lieu ; aucun CID ou identifiant n'est calculé. */
function lienGoogleRecu(value: string | null, placeId: string): string | null {
  if (!value || value !== value.trim()) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
    const maps = url.pathname === "/maps" || url.pathname.startsWith("/maps/");
    if (!(["google.com", "www.google.com"].includes(url.hostname) && maps) && !(url.hostname === "maps.google.com" && (url.pathname === "/" || maps)) && !(url.hostname === "maps.app.goo.gl" && url.pathname.length > 1)) return null;
    const ids = ["query_place_id", "place_id"].flatMap(k => url.searchParams.getAll(k));
    for (const q of url.searchParams.getAll("q")) if (q.startsWith("place_id:")) ids.push(q.slice("place_id:".length));
    if (ids.some(id => id !== placeId)) return null;
    return value;
  } catch { return null; }
}

type SectionAvisGoogleProps = {
  /** Identifiant du lieu reçu de l'appelant, sans normalisation ni invention. */
  placeId: string | null | undefined;
  /** Nom lisible conservé dans le contrat des appelants. */
  nomPourLien: string;
  lang?: Lang;
  exigerAuMoinsUnAvis?: boolean;
  className?: string;
};

export function SectionAvisGoogle(props: SectionAvisGoogleProps) {
  if (typeof props.placeId !== "string" || !props.placeId.trim()) return null;
  return <AvisGoogleCourants key={props.placeId} {...props} placeId={props.placeId} />;
}

function AvisGoogleCourants({ placeId, lang = "fr", exigerAuMoinsUnAvis = false, className = "mt-12" }: SectionAvisGoogleProps & { placeId: string }) {
  const [lecture, setLecture] = useState<{ etat: "chargement" | "recu" | "erreur"; cache: AvisGoogleCacheRow | null }>({ etat: "chargement", cache: null });
  const [tentative, setTentative] = useState(0);
  const generation = useRef(0);
  const cache = lecture.cache;
  const t = LABELS[lang];

  useEffect(() => {
    let cancelled = false;
    const courante = ++generation.current;
    const active = () => !cancelled && generation.current === courante;
    (async () => {
      if (!active()) return;
      try {
        const r = await supabase
          .from("avis_google_cache")
          .select("place_id,rating,user_ratings_total,google_display_name,last_updated_at,google_url,reviews")
          .eq("place_id", placeId)
          .maybeSingle();
        if (!active()) return;
        if (!r || r.error !== null || r.status !== 200) throw new Error("Cache non confirmé");
        let cacheRecu: AvisGoogleCacheRow | null = null;
        if (r.data !== null) {
          if (!cacheValide(r.data, placeId)) throw new Error("Ligne de cache non confirmée");
          cacheRecu = r.data;
        }
        setLecture({ etat: "recu", cache: cacheRecu });
      } catch { if (active()) setLecture({ etat: "erreur", cache: null }); }
    })();
    return () => { cancelled = true; };
  }, [placeId, tentative]);

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

  if (lecture.etat !== "recu") return <div className={className}>
    <p role="status">{lecture.etat === "chargement" ? t.chargement : t.indisponibles}</p>
    {lecture.etat === "erreur" && <button type="button" className="mt-2 underline" onClick={() => {
      ++generation.current;
      setLecture({ etat: "chargement", cache: null });
      setTentative(n => n + 1);
    }}>{t.reessayer}</button>}
  </div>;
  if (!couvert || !cache) return null;

  const dateMaj = formatDateShort(cache.last_updated_at, lang);
  const mapsUrl = lienGoogleRecu(cache.google_url, placeId);

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
        {cache.user_ratings_total === null ? t.nombreIndisponible : t.avisGoogle(cache.user_ratings_total)}
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
        {mapsUrl ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: COLORS.green }}
          >
            {t.voirTous} →
          </a>
        ) : <span>{t.lienIndisponible}</span>}
      </div>
    </section>
  );
}
