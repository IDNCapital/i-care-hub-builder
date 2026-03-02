import { useEffect, useRef, useState, useCallback } from "react";
import { HOME_HERO_SLIDES, HOME_HERO_SLIDES_MOBILE, type HeroSlide } from "@/lib/projectImages";

const SLIDE_DURATION = 9000;
const FADE_DURATION = 800;
const IDLE_FALLBACK_MS = 1200;

interface Props {
  lang: "fr" | "en";
}

export function HeroSlideshow({ lang }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canLoadRest, setCanLoadRest] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleRef = useRef<number | ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setPrefersReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const slides: HeroSlide[] = isMobile ? HOME_HERO_SLIDES_MOBILE : HOME_HERO_SLIDES;
  const shouldAnimate = !prefersReduced;

  // ── Unlock rest of slides after first image loads or idle ──
  const unlockRest = useCallback(() => {
    setCanLoadRest(true);
    // Cancel fallback if it's still pending
    if (idleRef.current !== null) {
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleRef.current as number);
      } else {
        clearTimeout(idleRef.current as ReturnType<typeof setTimeout>);
      }
      idleRef.current = null;
    }
  }, []);

  // Fallback: unlock via requestIdleCallback or setTimeout
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

  // ── Prefetch only slide 1 (next) after unlock ──
  useEffect(() => {
    if (!canLoadRest || slides.length < 2) return;
    const img = new Image();
    img.src = slides[1].src;
  }, [canLoadRest, slides]);

  // ── Slideshow timer ──
  const startTimer = useCallback(() => {
    if (!shouldAnimate || !canLoadRest) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
  }, [shouldAnimate, canLoadRest, slides.length]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  useEffect(() => {
    const onVisChange = () => {
      if (document.hidden) stopTimer();
      else startTimer();
    };
    document.addEventListener("visibilitychange", onVisChange);
    return () => document.removeEventListener("visibilitychange", onVisChange);
  }, [startTimer, stopTimer]);

  // Prefetch next slide ahead of transition
  useEffect(() => {
    if (!canLoadRest || !shouldAnimate) return;
    const nextIndex = (activeIndex + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextIndex].src;
  }, [activeIndex, canLoadRest, shouldAnimate, slides]);

  // ── Preload first slide via <link> ──
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

  // ── Which slides to render ──
  const renderSlides = canLoadRest ? slides : [slides[0]];

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {renderSlides.map((slide, i) => {
        // When only slide 0 is rendered, it's always active.
        // When all slides rendered, use activeIndex.
        const realIndex = canLoadRest ? i : 0;
        const isActive = realIndex === activeIndex;
        const alt = lang === "fr" ? slide.altFr : slide.altEn;
        return (
          <img
            key={slide.src}
            src={slide.src}
            alt={alt}
            loading={realIndex === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={realIndex === 0 ? "high" : "low"}
            sizes="100vw"
            onLoad={realIndex === 0 ? unlockRest : undefined}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: isActive ? 1 : 0,
              transition: shouldAnimate
                ? `opacity ${FADE_DURATION}ms ease-in-out`
                : "none",
              animation: shouldAnimate && isActive
                ? `heroKenBurns ${SLIDE_DURATION}ms ease-in-out forwards`
                : "none",
              willChange: isActive ? "opacity, transform" : "auto",
            }}
          />
        );
      })}

      {/* Overlay — anthracite gradient for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(43,43,43,0.62) 0%, rgba(43,43,43,0.35) 45%, rgba(43,43,43,0.10) 75%, rgba(43,43,43,0) 100%)",
        }}
      />
      {/* Very subtle cream veil for warmth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(246,245,240,0.06) 0%, rgba(246,245,240,0.03) 100%)",
        }}
      />
    </div>
  );
}
