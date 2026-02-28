import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";

export interface MapCentre {
  id: string;
  name: string;
  status: "available" | "full" | "coming_soon";
  /** SVG coordinates (viewBox 0 0 400 500) */
  x: number;
  y: number;
}

const CENTRES: MapCentre[] = [
  { id: "chartrons",     name: "Chartrons",     status: "available",    x: 165, y: 175 },
  { id: "jardin-public", name: "Jardin Public", status: "full",         x: 195, y: 220 },
  { id: "pey-berland",   name: "Pey-Berland",   status: "full",         x: 200, y: 275 },
  { id: "nansouty",      name: "Nansouty",      status: "full",         x: 215, y: 330 },
  { id: "floirac",       name: "Floirac",       status: "coming_soon",  x: 305, y: 290 },
  { id: "lormont",       name: "Lormont",       status: "coming_soon",  x: 290, y: 155 },
];

const statusColor: Record<string, string> = {
  available: "hsl(138 18% 67%)",      // sage
  full: "hsl(0 0% 75%)",              // gris doux
  coming_soon: "hsl(37 30% 74%)",     // doré pâle
};

const statusPulse: Record<string, boolean> = {
  available: true,
  full: false,
  coming_soon: false,
};

interface BordeauxMapProps {
  onCentreClick?: (id: string) => void;
}

export const BordeauxMap = memo(function BordeauxMap({ onCentreClick }: BordeauxMapProps) {
  const { t } = useTranslation();

  const handleClick = useCallback(
    (id: string) => {
      onCentreClick?.(id);
    },
    [onCentreClick]
  );

  const badgeLabel = (status: string) => {
    switch (status) {
      case "available": return t("projects.availableBadge");
      case "full": return t("projects.fullBadge");
      case "coming_soon": return t("projects.comingSoonBadge");
      default: return "";
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <svg
        viewBox="0 0 400 500"
        className="w-full h-auto"
        role="img"
        aria-label={t("projects.mapTitle")}
      >
        {/* Garonne river — simplified curve */}
        <path
          d="M 120 60 C 140 120, 170 160, 185 200 C 200 240, 210 280, 220 320 C 235 370, 250 400, 270 460"
          fill="none"
          stroke="hsl(138 18% 67% / 0.2)"
          strokeWidth="28"
          strokeLinecap="round"
        />
        <path
          d="M 120 60 C 140 120, 170 160, 185 200 C 200 240, 210 280, 220 320 C 235 370, 250 400, 270 460"
          fill="none"
          stroke="hsl(138 18% 67% / 0.12)"
          strokeWidth="50"
          strokeLinecap="round"
        />

        {/* Labels — Rive gauche / Rive droite */}
        <text x="100" y="420" className="fill-muted-foreground/40 text-[11px]" fontFamily="inherit">Rive gauche</text>
        <text x="290" y="420" className="fill-muted-foreground/40 text-[11px]" fontFamily="inherit">Rive droite</text>

        {/* Centre markers */}
        {CENTRES.map((c) => {
          const color = statusColor[c.status];
          const labelLeft = c.x > 250;
          return (
            <g
              key={c.id}
              className="cursor-pointer"
              onClick={() => handleClick(c.id)}
              role="button"
              tabIndex={0}
              aria-label={`${c.name} — ${badgeLabel(c.status)}`}
              onKeyDown={(e) => e.key === "Enter" && handleClick(c.id)}
            >
              {/* Pulse ring for available */}
              {statusPulse[c.status] && (
                <circle cx={c.x} cy={c.y} r="16" fill={color} opacity="0.25">
                  <animate attributeName="r" values="10;20;10" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Main dot */}
              <circle
                cx={c.x}
                cy={c.y}
                r="8"
                fill={color}
                stroke="white"
                strokeWidth="2.5"
                className="transition-transform duration-200 hover:scale-125 origin-center"
                style={{ transformOrigin: `${c.x}px ${c.y}px` }}
              />
              {/* Label */}
              <text
                x={labelLeft ? c.x - 14 : c.x + 14}
                y={c.y + 4}
                textAnchor={labelLeft ? "end" : "start"}
                className="fill-foreground text-[12px] font-medium pointer-events-none"
                fontFamily="inherit"
              >
                {c.name}
              </text>
              {/* Status badge */}
              <text
                x={labelLeft ? c.x - 14 : c.x + 14}
                y={c.y + 18}
                textAnchor={labelLeft ? "end" : "start"}
                className="text-[9px] pointer-events-none"
                fill={color}
                fontFamily="inherit"
              >
                {badgeLabel(c.status)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
});
