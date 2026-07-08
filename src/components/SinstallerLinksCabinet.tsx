import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProfessions } from "@/hooks/useInstallation";
import { installationUrl } from "@/lib/installation";

interface SinstallerLinksCabinetProps {
  slugInstallation: string;
  cabinetLabel: string;
  className?: string;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Maillage interne : 1 lien /sinstaller par profession active, pour un cabinet donné.
 * Doctrine pattern B — utilisé sur /projets/[pipeline], /location-cabinet-toulouse,
 * /location-cabinet-bordeaux. FR-only (la matrice /sinstaller est FR-only).
 */
export function SinstallerLinksCabinet({
  slugInstallation,
  cabinetLabel,
  className,
}: SinstallerLinksCabinetProps) {
  const { data: professions } = useProfessions();

  if (!slugInstallation || !professions || professions.length === 0) return null;

  return (
    <div className={className}>
      <h3 className="text-lg md:text-xl font-heading font-normal mb-5">
        S'installer à {cabinetLabel} selon votre profession
      </h3>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
        {professions.map((p) => (
          <li key={p.slug}>
            <Link
              to={installationUrl(p.slug, slugInstallation)}
              className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5 text-primary/60 group-hover:translate-x-0.5 transition-transform" />
              <span>{cap(p.nom_inclusif_pluriel)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}