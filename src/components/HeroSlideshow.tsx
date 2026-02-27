import { useEffect, useRef, useState, useCallback } from "react";
import { HOME_HERO_SLIDES, HOME_HERO_SLIDES_MOBILE, type HeroSlide } from "@/lib/projectImages";

const SLIDE_DURATION = 9000;
const FADE_DURATION = 800;

interface Props {
  lang: "fr" | "en";
}

export function HeroSlideshow({ lang }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [readySlides, setReadySlides] = useState<Set<number>>(new Set([0]));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setPrefersReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const slides: HeroSlide[] = isMobile ? HOME_HERO_SLIDES_MOBILE : HOME_HERO_SLIDES;
  const shouldAnimate = !prefersReduced;

  // Preload next slide image before transitioning
  const preloadSlide = useCallback((index: number) => {
    if (readySlides.has(index)) return;
    const img = new Image();
    img.src = slides[index].src;
    img.onload = () => {
      setReadySlides((prev) => new Set(prev).add(index));
    };
  }, [slides, readySlides]);

  const startTimer = useCallback(() => {
    if (!shouldAnimate) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % slides.length;
        return next;
      });
    }, SLIDE_DURATION);
  }, [shouldAnimate, slides.length]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Preload the next slide ahead of time
  useEffect(() => {
    if (!shouldAnimate) return;
    const nextIndex = (activeIndex + 1) % slides.length;
    preloadSlide(nextIndex);
  }, [activeIndex, shouldAnimate, slides.length, preloadSlide]);

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

  // Preload first image via link tag
  useEffect(() => {
    if (slides[0]) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = slides[0].src;
      document.head.appendChild(link);
      return () => { document.head.removeChild(link); };
    }
  }, [slides]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {slides.map((slide, i) => {
        const isActive = i === activeIndex;
        const alt = lang === "fr" ? slide.altFr : slide.altEn;
        return (
          <img
            key={slide.src}
            src={slide.src}
            alt={alt}
            loading={i === 0 ? "eager" : "lazy"}
            decoding={i === 0 ? "sync" : "async"}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: isActive ? 1 : 0,
              transition: shouldAnimate
                ? `opacity ${FADE_DURATION}ms ease-in-out`
                : "none",
              transform: shouldAnimate && isActive ? undefined : "scale(1)",
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
