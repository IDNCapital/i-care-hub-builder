import { useTranslation } from "react-i18next";
import { ImageOff } from "lucide-react";

interface VisuelsAVenirProps {
  className?: string;
}

export function VisuelsAVenir({ className = "" }: VisuelsAVenirProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "fr";

  return (
    <div
      className={`flex flex-col items-center justify-center bg-background border border-foreground/15 rounded-xl ${className}`}
    >
      <ImageOff className="w-10 h-10 text-muted-foreground/40 mb-3" />
      <p className="text-sm font-semibold text-foreground">
        {lang === "en" ? "Visuals coming soon" : "Visuels à venir"}
      </p>
      <p className="text-xs text-muted-foreground mt-1 max-w-[220px] text-center">
        {lang === "en"
          ? "Visuals will be added as the project progresses."
          : "Les visuels seront ajoutés au fil de l'avancement du projet."}
      </p>
    </div>
  );
}
