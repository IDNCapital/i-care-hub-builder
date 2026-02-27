import { useState, useCallback, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FadeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Duration of the fade-in transition in ms (default 400) */
  fadeDuration?: number;
}

/**
 * Image component that fades in smoothly after loading.
 * Shows a subtle cream placeholder background while loading to prevent layout shift.
 * Defaults to loading="lazy" and decoding="async" unless overridden.
 */
export function FadeImage({
  className,
  fadeDuration = 400,
  loading = "lazy",
  decoding = "async",
  style,
  onLoad,
  ...props
}: FadeImageProps) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setLoaded(true);
      onLoad?.(e);
    },
    [onLoad]
  );

  return (
    <img
      {...props}
      loading={loading}
      decoding={decoding}
      onLoad={handleLoad}
      className={cn("bg-secondary", className)}
      style={{
        opacity: loaded ? 1 : 0,
        transition: `opacity ${fadeDuration}ms ease-out`,
        ...style,
      }}
    />
  );
}
