import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isPublicProjectOffer } from "@/lib/publicProjectOffer";

export function WithdrawnOfferContactGuard({ children }: { children: ReactNode }) {
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  const centre = (params.get("centre") ?? "").trim();
  const withdrawnCentre = centre === "I-CA.RE Floirac" || centre === "Floirac" || !isPublicProjectOffer(centre);
  const withdrawnSource = params.get("source") === "page-cabinet-floirac" || params.get("utm_source") === "page-cabinet-floirac";
  // An explicit different centre takes precedence over old campaign attribution.
  const withdrawnRequest = centre ? withdrawnCentre : withdrawnSource;

  if (withdrawnRequest) {
    return <Navigate to={pathname.startsWith("/en/") ? "/en/projects" : "/projets"} replace />;
  }
  return <>{children}</>;
}
