import { useEffect, useRef, useState, useCallback } from "react";
import { HOME_HERO_SLIDES, HOME_HERO_SLIDES_MOBILE, type HeroSlide } from "@/lib/projectImages";

const SLIDE_DURATION = 9000;
const FADE_DURATION = 800;
const IDLE_FALLBACK_MS = 1200;
const START_SCALE = "scale(1.08)";

interface Props {
  lang: "fr" | "en";
}

export function HeroSlideshow({ lang }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [canLoadRest, setCanLoadRest] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const idleRef = useRef<number | ReturnType<typeof setTimeout> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imgElsRef = useRef<Record<number, HTMLImageElement>>({});

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setPrefersReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const slides: HeroSlide[] = isMobile ? HOME_HERO_SLIDES_MOBILE : HOME_HERO_SLIDES;
  const shouldAnimate = !prefersReduced;

  // ── Unlock rest of slides ──
  const unlockRest = useCallback(() => {
    setCanLoadRest(true);
    if (idleRef.current !== null) {
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleRef.current as number);
      } else {
        clearTimeout(idleRef.current as ReturnType<typeof setTimeout>);
      }
      idleRef.current = null;
    }
  }, []);

  const handleFirstLoad = useCallback(() => {
    setFirstLoaded(true);
    unlockRest();
  }, [unlockRest]);

  useEffect(() => {
    if (canLoadRest) return;
    if (typeof window.requestIdleCallback === "function") {
      idleRef.current = window.requestIdleCallback(() => unlockRest(), { timeout: IDLE_FALLBACK_MS });
    } else {
      idleRef.current = setTimeout(() => unlockRest(), IDLE_FALLBACK_MS);
    }
    return () => {
      if (idleRef.current !== null) {
        if (typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(idleRef.current as number);
        } else {
          clearTimeout(idleRef.current as ReturnType<typeof setTimeout>);
        }
      }
    };
  }, [canLoadRest, unlockRest]);

  useEffect(() => {
    if (!canLoadRest || slides.length < 2) return;
    const img = new Image();
    img.src = slides[1].src;
  }, [canLoadRest, slides]);

  // ── Timer ──
  useEffect(() => {
    if (!shouldAnimate || !canLoadRest) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % slides.length;
        const el = imgElsRef.current[next];
        if (el && typeof el.decode === "function") {
          el.decode().catch(() => {});
        }
        setPrevIndex(prev);
        if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = setTimeout(() => setPrevIndex(null), FADE_DURATION + 50);
        return next;
      });
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [shouldAnimate, canLoadRest, slides.length]);

  useEffect(() => {
    if (!canLoadRest || !shouldAnimate) return;
    const nextIndex = (activeIndex + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextIndex].src;
  }, [activeIndex, canLoadRest, shouldAnimate, slides]);

  // ── Preload first slide ──
  useEffect(() => {
    if (slides[0]) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = slides[0].src;
      link.setAttribute("fetchpriority", "high");
      link.type = "image/webp";
      document.head.appendChild(link);
      return () => { document.head.removeChild(link); };
    }
  }, [slides]);

  const renderSlides = canLoadRest ? slides : [slides[0]];

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* ── Placeholder: dominant color shown instantly, hides when image loads ── */}
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-out"
        style={{
          /* Warm stone/facade dominant colour from hero images */
          background: "linear-gradient(135deg, hsl(35 20% 45%) 0%, hsl(30 15% 55%) 50%, hsl(25 12% 40%) 100%)",
          opacity: firstLoaded ? 0 : 1,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {renderSlides.map((slide, i) => {
        const realIndex = canLoadRest ? i : 0;
        const isActive = realIndex === activeIndex;
        const isAnimated = isActive || realIndex === prevIndex;
        const alt = lang === "fr" ? slide.altFr : slide.altEn;

        return (
          <img
            key={slide.src}
            src={slide.src}
            alt={alt}
            ref={(el) => { if (el) imgElsRef.current[realIndex] = el; }}
            loading="eager"
            decoding="async"
            fetchPriority={realIndex === 0 ? "high" : "low"}
            sizes="100vw"
            onLoad={realIndex === 0 ? handleFirstLoad : undefined}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              opacity: isActive ? 1 : 0,
              transition: shouldAnimate
                ? `opacity ${FADE_DURATION}ms ease-in-out`
                : "none",
              transform: isAnimated ? undefined : `translate3d(0,0,0) ${START_SCALE}`,
              animation: shouldAnimate && isAnimated
                ? `heroKenBurns ${SLIDE_DURATION}ms ease-in-out forwards`
                : "none",
              willChange: isAnimated ? "opacity, transform" : "auto",
              backfaceVisibility: "hidden",
              transformOrigin: "center",
            }}
          />
        );
      })}

      {/* Overlay — anthracite gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(43,43,43,0.62) 0%, rgba(43,43,43,0.35) 45%, rgba(43,43,43,0.10) 75%, rgba(43,43,43,0) 100%)",
          zIndex: 2,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(246,245,240,0.06) 0%, rgba(246,245,240,0.03) 100%)",
          zIndex: 2,
        }}
      />
    </div>
  );
}
