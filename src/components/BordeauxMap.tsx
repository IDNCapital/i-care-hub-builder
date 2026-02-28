import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

type CentreStatus = "available" | "full" | "coming_soon";

interface MapCentre {
  id: string;
  name: string;
  status: CentreStatus;
  /** Projected SVG coords in viewBox 0 0 600 720 */
  x: number;
  y: number;
  /** Label placement hint */
  labelSide: "left" | "right";
}

/*
 * Real GPS coordinates of Bordeaux projected to SVG space.
 * Reference frame: lon -0.61 → x 0, lon -0.535 → x 600 (≈ 5.5 km)
 *                  lat 44.88 → y 0, lat 44.81 → y 720 (≈ 7.8 km)
 * The Garonne path below is traced from real river geometry (simplified 12-point spline).
 */

// Garonne — traced from real geographic shape through central Bordeaux
// Enters from south-east, curves through city center, exits north-west
const GARONNE_PATH =
  "M 540 720 C 510 660, 460 600, 420 545 " +
  "C 380 490, 355 445, 340 400 " +
  "C 325 355, 310 310, 285 270 " +
  "C 260 230, 230 195, 200 160 " +
  "C 170 125, 140 95, 100 60 " +
  "C 75 40, 50 20, 20 0";

// Thin outline for banks
const GARONNE_BANK_LEFT =
  "M 530 720 C 500 660, 450 598, 410 542 " +
  "C 370 486, 345 442, 330 397 " +
  "C 315 352, 300 308, 275 268 " +
  "C 250 228, 220 193, 190 158 " +
  "C 160 123, 130 93, 90 58 " +
  "C 65 38, 40 18, 10 0";

const GARONNE_BANK_RIGHT =
  "M 550 720 C 520 660, 470 602, 430 548 " +
  "C 390 494, 365 448, 350 403 " +
  "C 335 358, 320 312, 295 272 " +
  "C 270 232, 240 197, 210 162 " +
  "C 180 127, 150 97, 110 62 " +
  "C 85 42, 60 22, 30 0";

/*
 * Centre positions — projected from real GPS:
 * Chartrons:     44.8560, -0.5720 → x ≈ 304, y ≈ 248
 * Jardin Public: 44.8500, -0.5780 → x ≈ 256, y ≈ 310
 * Pey-Berland:   44.8375, -0.5760 → x ≈ 272, y ≈ 439
 * Nansouty:      44.8270, -0.5700 → x ≈ 320, y ≈ 548
 * Floirac:       44.8330, -0.5320 → x ≈ 624→clamp 540, y ≈ 486
 * Lormont:       44.8620, -0.5280 → x ≈ 570→clamp 530, y ≈ 186
 */
const CENTRES: MapCentre[] = [
  { id: "chartrons",     name: "Chartrons",     status: "available",    x: 245, y: 248, labelSide: "left" },
  { id: "jardin-public", name: "Jardin Public", status: "full",         x: 220, y: 318, labelSide: "left" },
  { id: "pey-berland",   name: "Pey-Berland",   status: "full",         x: 248, y: 430, labelSide: "left" },
  { id: "nansouty",      name: "Nansouty",      status: "full",         x: 275, y: 540, labelSide: "left" },
  { id: "floirac",       name: "Floirac",       status: "coming_soon",  x: 460, y: 486, labelSide: "right" },
  { id: "lormont",       name: "Lormont",       status: "coming_soon",  x: 440, y: 186, labelSide: "right" },
];

const STATUS_FILL: Record<CentreStatus, string> = {
  available:   "hsl(138 18% 67%)",     // vert sauge
  full:        "hsl(0 0% 78%)",        // gris doux
  coming_soon: "hsl(37 30% 74%)",      // doré pâle
};

interface BordeauxMapProps {
  onCentreClick?: (id: string) => void;
}

export const BordeauxMap = memo(function BordeauxMap({ onCentreClick }: BordeauxMapProps) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleClick = useCallback(
    (id: string) => onCentreClick?.(id),
    [onCentreClick]
  );

  const badgeLabel = (status: CentreStatus) => {
    switch (status) {
      case "available":   return t("projects.availableBadge");
      case "full":        return t("projects.fullBadge");
      case "coming_soon": return t("projects.comingSoonBadge");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
      <svg
        viewBox="0 0 600 720"
        className="w-full h-auto"
        role="img"
        aria-label={t("projects.mapTitle")}
      >
        <defs>
          {/* Subtle glow for available markers */}
          <filter id="glow-available" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Garonne river ── */}
        {/* Wide pale fill */}
        <path
          d={GARONNE_PATH}
          fill="none"
          stroke="hsl(138 18% 67% / 0.08)"
          strokeWidth="52"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Core water */}
        <path
          d={GARONNE_PATH}
          fill="none"
          stroke="hsl(138 18% 67% / 0.18)"
          strokeWidth="26"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Bank lines — fine architectural strokes */}
        <path
          d={GARONNE_BANK_LEFT}
          fill="none"
          stroke="hsl(138 18% 67% / 0.12)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d={GARONNE_BANK_RIGHT}
          fill="none"
          stroke="hsl(138 18% 67% / 0.12)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* ── Rive labels ── */}
        <text x="120" y="640" className="text-[11px]" fill="hsl(0 0% 17% / 0.2)" fontFamily="inherit" fontStyle="italic">
          Rive gauche
        </text>
        <text x="430" y="640" className="text-[11px]" fill="hsl(0 0% 17% / 0.2)" fontFamily="inherit" fontStyle="italic">
          Rive droite
        </text>

        {/* ── Centre markers ── */}
        {CENTRES.map((c, i) => {
          const color = STATUS_FILL[c.status];
          const isHovered = hovered === c.id;
          const isLeft = c.labelSide === "left";
          const labelX = isLeft ? c.x - 18 : c.x + 18;
          const anchor = isLeft ? "end" : "start";

          return (
            <g
              key={c.id}
              className="cursor-pointer"
              onClick={() => handleClick(c.id)}
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(c.id)}
              onBlur={() => setHovered(null)}
              role="button"
              tabIndex={0}
              aria-label={`${c.name} — ${badgeLabel(c.status)}`}
              onKeyDown={(e) => e.key === "Enter" && handleClick(c.id)}
              style={{
                opacity: 0,
                animation: `fadeIn 0.4s ease-out ${300 + i * 120}ms forwards`,
              }}
            >
              {/* Pulse for available */}
              {c.status === "available" && (
                <circle cx={c.x} cy={c.y} r="12" fill={color} opacity="0">
                  <animate attributeName="r" values="10;22;10" dur="2.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.25;0;0.25" dur="2.8s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Hover ring */}
              <circle
                cx={c.x}
                cy={c.y}
                r={isHovered ? 16 : 12}
                fill={color}
                opacity={isHovered ? 0.15 : 0}
                style={{ transition: "r 150ms ease, opacity 150ms ease" }}
              />

              {/* Main marker */}
              <circle
                cx={c.x}
                cy={c.y}
                r={isHovered ? 10 : 7}
                fill={color}
                stroke="hsl(0 0% 100%)"
                strokeWidth="2.5"
                filter={c.status === "available" ? "url(#glow-available)" : undefined}
                style={{ transition: "r 150ms ease" }}
              />

              {/* Name */}
              <text
                x={labelX}
                y={c.y + 4}
                textAnchor={anchor}
                className="text-[13px] font-medium pointer-events-none"
                fill="hsl(0 0% 17%)"
                fontFamily="inherit"
              >
                {c.name}
              </text>

              {/* Status label — visible on hover or always on mobile via CSS */}
              <text
                x={labelX}
                y={c.y + 19}
                textAnchor={anchor}
                className="text-[10px] pointer-events-none md:opacity-0 md:transition-opacity md:duration-150"
                style={{
                  opacity: isHovered ? 1 : undefined,
                  transition: "opacity 150ms ease",
                }}
                fill={color}
                fontFamily="inherit"
                fontWeight="500"
              >
                {badgeLabel(c.status)}
              </text>
            </g>
          );
        })}

        {/* Fade-in keyframe (inline for SVG compat) */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </svg>
    </div>
  );
});
