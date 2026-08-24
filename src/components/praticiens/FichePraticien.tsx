import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Praticien } from "@/pages/admin/AdminPraticiens";
import { SectionAvisGoogle } from "@/components/avis/SectionAvisGoogle";
import { marqueAffichee } from "@/lib/brand";

type Cabinet = {
  slug: string;
  name: string;
  city: string;
  address: string | null;
  show_address: boolean;
};

const COLORS = {
  anthracite: "#2B2B2B",
  green: "#9EB8A5",
  forest: "#1E392B",
  cream: "#F6F5F0",
  textMuted: "#6B6B6B",
};

function initiales(prenom: string, nom: string) {
  return `${(prenom?.[0] ?? "").toUpperCase()}${(nom?.[0] ?? "").toUpperCase()}`;
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

export function FichePraticien({
  praticien,
  isPreview = false,
}: {
  praticien: Praticien;
  isPreview?: boolean;
}) {
  const [cabinet, setCabinet] = useState<Cabinet | null>(null);

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
      .replace(/I[\u2010-\u2015-]?CA\.?RE/i, "")
      .trim()
      .replace(/\s+/g, "-");
    return cleaned;
  }, [cabinet]);

  const ctaLabel = praticien.lien_rdv ? "PRENDRE RENDEZ-VOUS" : "PRENDRE CONTACT";

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
                  {[
                    adresseLigne,
                    quartier ? `Cabinet I‑CA.RE ${quartier}` : "",
                  ]
                    .map((s) => (s ?? "").trim())
                    .filter((s) => s.length > 0)
                    .join(" · ")}
                </span>
              </div>
            )}

            {/* Bio */}
            {praticien.bio_longue && (
              <div className="mt-8" style={{ fontSize: "1rem" }}>
                {renderMarkdown(marqueAffichee(praticien.bio_longue))}
              </div>
            )}

            {/* Avis Google : composant partagé avec les fiches cabinet. */}
            <SectionAvisGoogle
              placeId={praticien.google_place_id}
              nomPourLien={`${praticien.prenom} ${praticien.nom}`}
            />


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
                    {marqueAffichee(cabinet.name)}
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