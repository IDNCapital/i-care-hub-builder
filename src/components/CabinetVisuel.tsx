import { useMemo, useState } from "react";
import { getCabinetVisuals } from "@/lib/projectImages";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";

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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const heroAlt = isGeneric ? `${GENERIC_CAPTION}, ${alt}` : alt;

  const lightboxImages: LightboxImage[] = useMemo(() => {
    const list: LightboxImage[] = [];
    const seen = new Set<string>();
    if (hero) {
      list.push({ src: hero, alt: heroAlt });
      seen.add(hero);
    }
    gallery.forEach((url, i) => {
      if (!seen.has(url)) {
        list.push({ src: url, alt: `${alt}, vue ${i + 2}` });
        seen.add(url);
      }
    });
    return list;
  }, [hero, gallery, heroAlt, alt]);

  const indexOfSrc = (src: string) => lightboxImages.findIndex((img) => img.src === src);

  if (variant === "card") {
    return (
      <figure className={className}>
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          aria-label={`Afficher en plein écran : ${heroAlt}`}
          className="block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-sage rounded-md"
        >
          <img
            src={hero}
            alt={heroAlt}
            loading="lazy"
            className="w-full aspect-[4/3] object-cover rounded-md"
          />
        </button>
        {isGeneric && (
          <figcaption className="text-[11px] text-muted-foreground mt-1.5 italic">
            {GENERIC_CAPTION}
          </figcaption>
        )}
        <Lightbox
          images={lightboxImages}
          openIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(i) => setLightboxIndex(i)}
        />
      </figure>
    );
  }

  return (
    <figure className={className}>
      <button
        type="button"
        onClick={() => setLightboxIndex(0)}
        aria-label={`Afficher en plein écran : ${heroAlt}`}
        className="block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-sage rounded-lg"
      >
        <img
          src={hero}
          alt={heroAlt}
          loading="eager"
          className="w-full aspect-[16/9] object-cover rounded-lg"
        />
      </button>
      {gallery.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {gallery.slice(0, 3).map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => {
                const idx = indexOfSrc(img);
                setLightboxIndex(idx >= 0 ? idx : 0);
              }}
              aria-label={`Afficher en plein écran : ${alt}, vue ${i + 2}`}
              className="block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-sage rounded-md"
            >
              <img
                src={img}
                alt={`${alt}, vue ${i + 2}`}
                loading="lazy"
                className="w-full aspect-[4/3] object-cover rounded-md"
              />
            </button>
          ))}
        </div>
      )}
      <figcaption className="text-xs text-muted-foreground mt-2 italic">
        {isGeneric ? GENERIC_CAPTION : alt}
      </figcaption>
      <Lightbox
        images={lightboxImages}
        openIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(i) => setLightboxIndex(i)}
      />
    </figure>
  );
}