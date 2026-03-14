import React from "react";
import { cn } from "@/lib/utils";

interface BrandNameProps {
  className?: string;
  variant?: "default" | "light" | "dark";
}

/**
 * Composant pour afficher le nom de marque I‑CA.RE avec la charte graphique correcte.
 * Utilise des tirets insécables (non-breaking hyphen) pour éviter toute césure.
 * Applique toujours la typographie Playfair Display (font-heading) pour respecter le logo.
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
    <span className={cn("whitespace-nowrap font-heading font-bold", className)}>
      <span className={colors.i}>I‑</span>
      <span className={colors.ca}>CA</span>
      <span className={colors.dot}>.</span>
      <span className={colors.re}>RE</span>
    </span>
  );
};

/**
 * Composant utilitaire qui prend un texte brut et remplace automatiquement
 * toutes les occurrences de "I-CA.RE" ou "I‑CA.RE" par le composant <BrandName /> stylisé.
 * À utiliser pour les chaînes de traduction ou texte inline contenant le nom de marque.
 */
interface InlineBrandProps {
  children: string;
  variant?: "default" | "light" | "dark";
  className?: string;
}

export const InlineBrand: React.FC<InlineBrandProps> = ({
  children,
  variant = "default",
  className,
}) => {
  const regex = /I[-‑]CA\.RE/g;
  const parts = children.split(regex);
  const matches = children.match(regex);

  if (!matches) return <>{children}</>;

  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <BrandName variant={variant} className={className} />
          )}
        </React.Fragment>
      ))}
    </>
  );
};
