import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAdminAuthenticated } from "@/lib/adminAuth";

/**
 * Protège les routes /admin/*. Si pas de token valide en localStorage,
 * redirige vers /admin/login en conservant la route d'origine.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(isAdminAuthenticated());
  }, [location.pathname]);

  if (authed === null) return null;
  if (!authed) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}