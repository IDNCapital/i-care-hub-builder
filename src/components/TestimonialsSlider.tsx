import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { InlineBrand } from "./BrandName";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  speciality: string;
  affiliation: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

export function TestimonialsSlider() {
  const { t } = useTranslation();

  const testimonials: Testimonial[] = [
    {
      quote: t("testimonials.items.0.quote"),
      name: t("testimonials.items.0.name"),
      title: t("testimonials.items.0.title"),
      speciality: t("testimonials.items.0.speciality"),
      affiliation: t("testimonials.items.0.affiliation"),
      location: t("testimonials.items.0.location"),
      address: t("testimonials.items.0.address"),
      phone: t("testimonials.items.0.phone"),
      email: t("testimonials.items.0.email"),
      website: t("testimonials.items.0.website"),
    },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [Autoplay({ delay: 9000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="section-padding bg-secondary">
      <div className="container">
        <h2 className="section-title text-center mb-16 md:mb-20">
          {t("testimonials.sectionTitle")}
        </h2>

        <div className="relative max-w-[880px] mx-auto">
          {/* Desktop arrows */}
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="hidden md:flex absolute -left-14 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full text-foreground/40 hover:text-foreground/70 transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="hidden md:flex absolute -right-14 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full text-foreground/40 hover:text-foreground/70 transition-colors z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slider */}
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {testimonials.map((item, i) => (
                <div
                  key={i}
                  className="flex-[0_0_100%] min-w-0 px-4 md:px-0"
                >
                  <div className="bg-card rounded-xl shadow-card p-6 md:p-8 relative">
                    {/* Decorative quote mark */}
                    <span
                      className="absolute top-4 left-6 md:top-6 md:left-8 font-heading text-[5rem] md:text-[7rem] leading-none text-accent/15 select-none pointer-events-none"
                      aria-hidden="true"
                    >
                      "
                    </span>

                    <blockquote className="relative z-10 pt-10 md:pt-14 font-body text-base md:text-lg leading-relaxed text-foreground/90 mb-8">
                      {item.quote}
                    </blockquote>

                    {/* Separator */}
                    <div className="h-px bg-foreground/[0.15] mb-6" />

                    {/* Signature */}
                    <div className="space-y-1">
                      <p className="font-body font-semibold text-foreground">
                        {item.name}
                      </p>
                      <p className="font-body text-sm text-foreground/80 italic">
                        {item.title}
                      </p>
                      <p className="font-body text-sm text-muted-foreground">
                        {item.speciality}
                      </p>
                      <p className="font-body text-sm text-muted-foreground">
                        {item.affiliation}
                      </p>
                    </div>

                    <div className="mt-4 space-y-0.5">
                      <p className="font-body text-sm font-medium text-foreground/80">
                        {item.location}
                      </p>
                      <p className="font-body text-xs text-muted-foreground">
                        {item.address}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground/70">
                      <span>{item.phone}</span>
                      <a
                        href={`mailto:${item.email}`}
                        className="hover:text-primary transition-colors"
                      >
                        {item.email}
                      </a>
                      <a
                        href={`https://${item.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {item.website}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          {scrollSnaps.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {scrollSnaps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors duration-300",
                    i === selectedIndex
                      ? "bg-primary"
                      : "bg-foreground/20"
                  )}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
