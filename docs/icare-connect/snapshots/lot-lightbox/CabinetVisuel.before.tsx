import { getCabinetVisuals } from "@/lib/projectImages";

interface CabinetVisuelProps {
  /** slug du projet (ex. "i-ca-re-chartrons"), issu de useCabinetsPipeline */
  projectSlug?: string | null;
  /** Texte alternatif complet, unique à la page appelante */
  alt: string;
  variant?: "detail" | "card";
  className?: string;
}

const GENERIC_CAPTION = "Visuel d'ambiance du réseau I‑CA.RE";

/**
 * Visuel d'un cabinet sur les pages d'installation.
 * Doctrine pattern B. Le fallback générique est toujours légendé comme tel :
 * ne jamais laisser croire qu'il s'agit d'une photo du cabinet concerné.
 */
export function CabinetVisuel({ projectSlug, alt, variant = "detail", className }: CabinetVisuelProps) {
  const { hero, gallery, isGeneric } = getCabinetVisuals(projectSlug);

  if (variant === "card") {
    return (
      <figure className={className}>
        <img
          src={hero}
          alt={isGeneric ? `${GENERIC_CAPTION} — ${alt}` : alt}
          loading="lazy"
          className="w-full aspect-[4/3] object-cover rounded-md"
        />
        {isGeneric && (
          <figcaption className="text-[11px] text-muted-foreground mt-1.5 italic">
            {GENERIC_CAPTION}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className={className}>
      <img
        src={hero}
        alt={isGeneric ? `${GENERIC_CAPTION} — ${alt}` : alt}
        loading="eager"
        className="w-full aspect-[16/9] object-cover rounded-lg"
      />
      {gallery.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {gallery.slice(0, 3).map((img, i) => (
            <img
              key={img}
              src={img}
              alt={`${alt} — vue ${i + 2}`}
              loading="lazy"
              className="w-full aspect-[4/3] object-cover rounded-md"
            />
          ))}
        </div>
      )}
      <figcaption className="text-xs text-muted-foreground mt-2 italic">
        {isGeneric ? GENERIC_CAPTION : alt}
      </figcaption>
    </figure>
  );
}