import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ExternalLink, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Praticien } from "@/pages/admin/AdminPraticiens";
import { googleMapsPlaceUrl } from "@/lib/google-maps-url";

type Cabinet = {
  slug: string;
  name: string;
  city: string;
  address: string | null;
  show_address: boolean;
};

type CachedReview = {
  author?: string;
  rating?: number;
  text?: string;
  published_at?: string;
  profile_photo_url?: string;
};

type AvisCacheRow = {
  place_id: string;
  rating: number | null;
  user_ratings_total: number | null;
  google_display_name: string | null;
  last_updated_at: string;
  google_url: string | null;
  reviews: CachedReview[] | null;
};

const COLORS = {
  anthracite: "#2C2C2C",
  green: "#90A997",
  forest: "#1E392B",
  cream: "#F6F5F0",
  gold: "#C2A46C",
  sageLight: "#E2EAE5",
  textMuted: "#6B6B6B",
};

function initiales(prenom: string, nom: string) {
  return `${(prenom?.[0] ?? "").toUpperCase()}${(nom?.[0] ?? "").toUpperCase()}`;
}

function authorInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

function formatRelativeFr(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return "aujourd'hui";
  if (days < 7) return `il y a ${days} j`;
  if (days < 30) {
    const w = Math.floor(days / 7);
    return `il y a ${w} sem.`;
  }
  if (days < 365) {
    const m = Math.floor(days / 30);
    return `il y a ${m} mois`;
  }
  const y = Math.floor(days / 365);
  return `il y a ${y} an${y > 1 ? "s" : ""}`;
}

function formatDateShortFr(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** Tiny markdown renderer: paragraphs, **bold**, "- item" lists. */
function renderMarkdown(text: string): ReactNode {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let key = 0;

  const flushPara = () => {
    if (para.length === 0) return;
    blocks.push(
      <p key={`p-${key++}`} className="mb-4 leading-[1.7]" style={{ color: COLORS.anthracite }}>
        {renderInline(para.join(" "))}
      </p>,
    );
    para = [];
  };
  const flushList = () => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={`u-${key++}`} className="mb-4 ml-5 list-disc space-y-1.5" style={{ color: COLORS.anthracite }}>
        {list.map((item, i) => (
          <li key={i} className="leading-[1.7]">{renderInline(item)}</li>
        ))}
      </ul>,
    );
    list = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      flushPara();
      continue;
    }
    const li = line.match(/^[-*]\s+(.*)$/);
    if (li) {
      flushPara();
      list.push(li[1]);
    } else {
      flushList();
      para.push(line);
    }
  }
  flushList();
  flushPara();
  return blocks;
}

function renderInline(s: string): ReactNode {
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={i}>{p.slice(2, -2)}</strong>;
    }
    return <span key={i}>{p}</span>;
  });
}

function StarsRow({ value, size = 16 }: { value: number; size?: number }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.25 && value - full < 0.75;
  const total = 5;
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${value} sur 5`}>
      {Array.from({ length: total }).map((_, i) => {
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

function ReviewItem({ review }: { review: CachedReview }) {
  const [expanded, setExpanded] = useState(false);
  const text = review.text ?? "";
  const long = text.length > 240;
  const author = review.author ?? "Anonyme";
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
            {typeof review.rating === "number" && <StarsRow value={review.rating} size={13} />}
          </div>
          <div className="text-[0.85rem] mt-0.5" style={{ color: COLORS.textMuted }}>
            {formatRelativeFr(review.published_at)}
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
              {expanded ? "Voir moins" : "Voir plus"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function FichePraticien({
  praticien,
  isPreview = false,
}: {
  praticien: Praticien;
  isPreview?: boolean;
}) {
  const [cabinet, setCabinet] = useState<Cabinet | null>(null);
  const [cache, setCache] = useState<AvisCacheRow | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("projets")
        .select("slug,name,city,address,show_address")
        .eq("slug", praticien.cabinet_slug)
        .maybeSingle();
      if (!cancelled) setCabinet((data ?? null) as Cabinet | null);
    })();
    return () => {
      cancelled = true;
    };
  }, [praticien.cabinet_slug]);

  useEffect(() => {
    if (!praticien.google_place_id) {
      setCache(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("avis_google_cache")
        .select("place_id,rating,user_ratings_total,google_display_name,last_updated_at,google_url,reviews")
        .eq("place_id", praticien.google_place_id!)
        .maybeSingle();
      if (!cancelled) setCache((data ?? null) as AvisCacheRow | null);
    })();
    return () => {
      cancelled = true;
    };
  }, [praticien.google_place_id]);

  const surtitre = useMemo(() => {
    const s = praticien.specialites?.[0] ?? praticien.profession;
    return (s || "").toUpperCase();
  }, [praticien.specialites, praticien.profession]);

  const sousTitre = useMemo(() => {
    if (praticien.specialites && praticien.specialites.length > 0) {
      return praticien.specialites.join(", ");
    }
    return praticien.profession;
  }, [praticien.specialites, praticien.profession]);

  const adresseLigne = useMemo(() => {
    if (!cabinet) return "";
    const parts: string[] = [];
    if (cabinet.show_address && cabinet.address) parts.push(cabinet.address);
    return parts.filter(Boolean).join(" · ");
  }, [cabinet]);

  /**
   * "Quartier" derived from the cabinet name by stripping the I-CA.RE brand prefix.
   * Examples:
   *  - "I-CA.RE Pey Berland"  -> "Pey-Berland"
   *  - "I‑CA.RE Saint-Michel" -> "Saint-Michel"
   * If nothing remains after stripping the brand, returns "".
   */
  const quartier = useMemo(() => {
    if (!cabinet?.name) return "";
    const cleaned = cabinet.name
      .replace(/I[\u2010-\u2015\-]?CA\.?RE/i, "")
      .trim()
      .replace(/\s+/g, "-");
    return cleaned;
  }, [cabinet]);

  const showReviewsBlock =
    !!praticien.google_place_id && !!cache && cache.rating != null;
  const topReviews: CachedReview[] = useMemo(() => {
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

  const ctaLabel = praticien.lien_rdv ? "PRENDRE RENDEZ-VOUS" : "CONTACTER LE PRATICIEN";

  return (
    <article
      className="font-sans"
      style={{ backgroundColor: COLORS.cream, color: COLORS.anthracite }}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-16">
        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row md:gap-10 lg:gap-14">
          {/* LEFT */}
          <aside className="md:w-[340px] md:shrink-0">
            <div className="md:sticky md:top-6 space-y-4">
              <div
                className="overflow-hidden bg-white"
                style={{ borderRadius: 16, aspectRatio: "1 / 1" }}
              >
                {praticien.photo_url ? (
                  <img
                    src={praticien.photo_url}
                    alt={`${praticien.prenom} ${praticien.nom}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: COLORS.forest }}
                  >
                    <span
                      className="font-heading text-white"
                      style={{ fontSize: "4rem" }}
                    >
                      {initiales(praticien.prenom, praticien.nom)}
                    </span>
                  </div>
                )}
              </div>

              {praticien.lien_rdv ? (
                <a
                  href={praticien.lien_rdv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 font-bold text-white uppercase transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: COLORS.green,
                    padding: "14px 28px",
                    letterSpacing: "0.1em",
                    fontSize: "0.875rem",
                    borderRadius: 6,
                  }}
                >
                  {ctaLabel}
                  <ExternalLink style={{ width: 14, height: 14 }} />
                </a>
              ) : (
                <a
                  href="#contact-praticien"
                  className="w-full inline-flex items-center justify-center gap-2 font-bold text-white uppercase transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: COLORS.green,
                    padding: "14px 28px",
                    letterSpacing: "0.1em",
                    fontSize: "0.875rem",
                    borderRadius: 6,
                  }}
                >
                  {ctaLabel}
                </a>
              )}
            </div>
          </aside>

          {/* RIGHT */}
          <div className="flex-1 mt-8 md:mt-0 min-w-0">
            <div
              className="font-sans font-bold uppercase"
              style={{
                color: COLORS.green,
                fontSize: "0.8rem",
                letterSpacing: "0.15em",
              }}
            >
              {surtitre}
            </div>
            <h1
              className="font-heading mt-2"
              style={{ fontSize: "3rem", lineHeight: 1.1, color: COLORS.anthracite }}
            >
              {praticien.prenom} {praticien.nom}
            </h1>
            <p className="mt-2" style={{ fontSize: "1rem", color: COLORS.textMuted }}>
              {sousTitre}
            </p>

            {cabinet && (
              <div
                className="mt-4 flex items-start gap-2"
                style={{ fontSize: "0.95rem", color: COLORS.anthracite }}
              >
                <MapPin style={{ width: 16, height: 16, marginTop: 4, color: COLORS.green }} />
                <span>
                  {[adresseLigne, quartier, cabinet.city]
                    .map((s) => (s ?? "").trim())
                    .filter((s) => s.length > 0)
                    .join(" · ")}
                </span>
              </div>
            )}

            {/* Bio */}
            {praticien.bio_longue && (
              <div className="mt-8" style={{ fontSize: "1rem" }}>
                {renderMarkdown(praticien.bio_longue)}
              </div>
            )}

            {/* Avis Google */}
            {showReviewsBlock && cache && (
              <section className="mt-12">
                <h2
                  className="font-heading"
                  style={{ fontSize: "1.5rem", color: COLORS.anthracite }}
                >
                  Avis Google
                </h2>
                <div className="mt-4 flex items-center gap-3">
                  <StarsRow value={cache.rating ?? 0} size={18} />
                  <span
                    className="font-heading"
                    style={{ fontSize: "2rem", color: COLORS.anthracite, lineHeight: 1 }}
                  >
                    {(cache.rating ?? 0).toFixed(1).replace(".", ",")}
                  </span>
                </div>
                <div className="mt-1" style={{ fontSize: "0.9rem", color: COLORS.textMuted }}>
                  {cache.user_ratings_total ?? 0} avis Google
                </div>

                {topReviews.length > 0 && (
                  <div className="mt-4">
                    {topReviews.map((r, i) => (
                      <div
                        key={i}
                        style={{
                          borderTop:
                            i === 0 ? "none" : `1px solid rgba(144, 169, 151, 0.2)`,
                        }}
                      >
                        <ReviewItem review={r} />
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className="mt-6 pt-4 flex flex-col gap-2"
                  style={{
                    borderTop: `1px solid rgba(144, 169, 151, 0.2)`,
                    fontSize: "0.8rem",
                    color: COLORS.textMuted,
                  }}
                >
                  <span>
                    Avis Google sur le profil{" "}
                    <em>{cache.google_display_name ?? "—"}</em> · Mis à jour le{" "}
                    {formatDateShortFr(cache.last_updated_at)}
                  </span>
                  {(() => {
                    const mapsUrl = googleMapsPlaceUrl(
                      cache.google_display_name || `${praticien.prenom} ${praticien.nom}`,
                      praticien.google_place_id,
                    );
                    return mapsUrl ? (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                        style={{ color: COLORS.green }}
                      >
                        Voir tous les avis sur Google →
                      </a>
                    ) : null;
                  })()}
                </div>
              </section>
            )}

            {/* Cabinet */}
            <section className="mt-12 pt-8" style={{ borderTop: `1px solid rgba(144, 169, 151, 0.25)` }}>
              <h2
                className="font-heading"
                style={{ fontSize: "1.5rem", color: COLORS.anthracite }}
              >
                Cabinet
              </h2>
              {cabinet ? (
                <p className="mt-3">
                  <Link
                    to={`/projets/${cabinet.slug}`}
                    className="hover:underline"
                    style={{ color: COLORS.green, fontSize: "1rem" }}
                  >
                    {cabinet.name}
                  </Link>
                </p>
              ) : (
                <p className="mt-3" style={{ color: COLORS.textMuted, fontSize: "0.95rem" }}>
                  {praticien.cabinet_slug}
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}

export default FichePraticien;