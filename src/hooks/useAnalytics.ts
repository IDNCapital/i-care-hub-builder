import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Analytics } from "@/lib/analytics";
import { lireChoixMesure } from "@/lib/analyticsConsent";

/**
 * Tracks page views and scroll depth (50%) on every route change.
 * Only fires events if cookie consent was accepted.
 */
export function useAnalytics() {
  const location = useLocation();
  const scrollTrackedRef = useRef(false);

  useEffect(() => {
    const consent = lireChoixMesure().choix;
    if (consent !== "accepted") return;

    // Page view
    Analytics.pageView(location.pathname, document.title);
    scrollTrackedRef.current = false;

    // Scroll depth 50%
    const handleScroll = () => {
      if (lireChoixMesure().choix !== "accepted") return;
      if (scrollTrackedRef.current) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && scrollTop / docHeight >= 0.5) {
        Analytics.scrollDepth(50, location.pathname);
        scrollTrackedRef.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);
}
