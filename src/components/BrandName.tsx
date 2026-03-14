import React from "react";
import { cn } from "@/lib/utils";

interface BrandNameProps {
  className?: string;
  variant?: "default" | "light" | "dark";
}

/**
 * Composant pour afficher le nom de marque I‑CA.RE avec la charte graphique correcte.
 * Utilise des tirets insécables (non-breaking hyphen) pour éviter toute césure.
 */
export const BrandName: React.FC<BrandNameProps> = ({
  className,
  variant = "default",
}) => {
  const colorClasses = {
    default: {
      i: "text-primary",
      ca: "text-foreground",
      dot: "text-primary",
      re: "text-foreground",
    },
    light: {
      i: "text-primary",
      ca: "text-background",
      dot: "text-primary",
      re: "text-background",
    },
    dark: {
      i: "text-primary",
      ca: "text-foreground",
      dot: "text-primary",
      re: "text-foreground",
    },
  };

  const colors = colorClasses[variant];

  return (
    <span className={cn("whitespace-nowrap", className)}>
      <span className={colors.i}>I‑</span>
      <span className={colors.ca}>CA</span>
      <span className={colors.dot}>.</span>
      <span className={colors.re}>RE</span>
    </span>
  );
};