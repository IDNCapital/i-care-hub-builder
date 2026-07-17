import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  openIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * Lightbox plein écran réutilisable (doctrine pattern B).
 * Rendu via portal sur document.body.
 */
export function Lightbox({ images, openIndex, onClose, onNavigate }: LightboxProps) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const isOpen = openIndex !== null && images.length > 0;
  const current = isOpen ? images[openIndex as number] : null;
  const count = images.length;

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus close button next tick
    const raf = requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight" && count > 1) {
        e.preventDefault();
        onNavigate(((openIndex as number) + 1) % count);
      } else if (e.key === "ArrowLeft" && count > 1) {
        e.preventDefault();
        onNavigate(((openIndex as number) - 1 + count) % count);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(raf);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, openIndex, count, onClose, onNavigate]);

  if (!isOpen || !current) return null;

  const idx = openIndex as number;
  const goPrev = () => onNavigate((idx - 1 + count) % count);
  const goNext = () => onNavigate((idx + 1) % count);

  const node = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Visuel plein écran : ${current.alt}`}
      className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in motion-reduce:animate-none"
      style={{ backgroundColor: "hsl(0 0% 17% / 0.95)" }}
      onClick={onClose}
    >
      <button
        ref={closeBtnRef}
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Fermer le visuel plein écran"
        className="absolute top-4 right-4 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-anthracite transition-colors"
      >
        <X className="w-6 h-6" aria-hidden="true" />
      </button>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="Visuel précédent"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-anthracite transition-colors"
          >
            <ChevronLeft className="w-6 h-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="Visuel suivant"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-anthracite transition-colors"
          >
            <ChevronRight className="w-6 h-6" aria-hidden="true" />
          </button>
        </>
      )}

      <img
        src={current.src}
        alt={current.alt}
        onClick={(e) => e.stopPropagation()}
        className="object-contain"
        style={{ maxWidth: "92vw", maxHeight: "88vh" }}
      />

      {count > 1 && (
        <div className="absolute bottom-4 left-0 right-0 text-center font-body text-sm text-cream/90 pointer-events-none">
          {idx + 1} / {count}
        </div>
      )}
    </div>
  );

  return createPortal(node, document.body);
}