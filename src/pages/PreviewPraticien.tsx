import { useEffect, useState, type ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FichePraticien } from "@/components/praticiens/FichePraticien";
import type { Praticien } from "@/pages/admin/AdminPraticiens";

export default function PreviewPraticien() {
  const { slug, token } = useParams<{ slug: string; token: string }>();
  const [loading, setLoading] = useState(true);
  const [praticien, setPraticien] = useState<Praticien | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!slug || !token) {
        setError("missing");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.rpc("get_praticien_preview", {
        p_slug: slug,
        p_token: token,
      });
      if (cancelled) return;
      if (error) {
        setError(error.message);
      } else if (!data || (Array.isArray(data) && data.length === 0)) {
        setError("not_found");
      } else {
        const row = Array.isArray(data) ? data[0] : data;
        setPraticien(row as Praticien);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, token]);

  if (loading) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F6F5F0" }}
      >
        <Helmet>
          <meta name="robots" content="noindex,nofollow,noarchive" />
          <meta name="googlebot" content="noindex,nofollow,noarchive" />
          <title>Aperçu fiche · I-CA.RE</title>
        </Helmet>
        <div className="flex items-center gap-2 text-sm" style={{ color: "#6B6B6B" }}>
          <Loader2 className="w-4 h-4 animate-spin" /> Chargement de l'aperçu…
        </div>
      </main>
    );
  }

  if (error || !praticien) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-6"
        style={{ backgroundColor: "#F6F5F0" }}
      >
        <Helmet>
          <meta name="robots" content="noindex,nofollow,noarchive" />
          <meta name="googlebot" content="noindex,nofollow,noarchive" />
          <title>Lien expiré · I-CA.RE</title>
        </Helmet>
        <div
          className="max-w-md w-full text-center bg-white"
          style={{
            border: "1px solid #E2EAE5",
            padding: 32,
            borderRadius: 12,
          }}
        >
          <h1
            className="font-heading"
            style={{ fontSize: "1.5rem", color: "#2C2C2C" }}
          >
            Lien expiré ou invalide
          </h1>
          <p
            className="mt-3"
            style={{ fontSize: "0.95rem", color: "#6B6B6B", lineHeight: 1.6 }}
          >
            Le lien d'aperçu que vous avez utilisé n'est plus actif. Si vous
            attendiez de relire votre fiche, contactez-nous par email pour qu'on
            vous renvoie un lien à jour.
          </p>
          <Link
            to="/"
            className="inline-block mt-5 hover:underline"
            style={{ color: "#90A997", fontSize: "0.95rem" }}
          >
            Retour à l'accueil →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <meta name="googlebot" content="noindex,nofollow,noarchive" />
        <title>
          Aperçu fiche, {praticien.prenom} {praticien.nom} · I-CA.RE
        </title>
      </Helmet>

      {/* Bandeau sticky — variantes selon statut_validation */}
      {(() => {
        const statut = praticien.statut_validation;
        let bg = "#C2A46C";
        let fg = "#2C2C2C";
        let content: ReactNode = (
          <>
            <strong>🔍 APERÇU PRIVÉ</strong> : cette fiche n'est pas publique.
            Pour valider ou demander des modifications, répondez au message
            reçu par email.
          </>
        );
        if (statut === "validee") {
          bg = "#9EB8A5";
          fg = "#FFFFFF";
          content = (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span>
                  <strong>✓ FICHE VALIDÉE</strong> : lien public disponible :{" "}
                  <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                    i-ca.re/praticien/{praticien.slug}
                  </span>
                </span>
                <a
                  href={`/praticien/${praticien.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 whitespace-nowrap underline-offset-2 hover:underline"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.18)",
                    color: "#FFFFFF",
                    padding: "6px 12px",
                    borderRadius: 6,
                    fontWeight: 600,
                  }}
                >
                  Voir la version publique →
                </a>
              </div>
            </>
          );
        } else if (
          statut === "refusee" ||
          statut === "non_repondeuse" ||
          statut === "en_attente_infos" ||
          statut === "en_attente_resolution"
        ) {
          bg = "#6B6B6B";
          fg = "#FFFFFF";
          content = (
            <>
              <strong>📄 APERÇU NON PUBLIÉ</strong> : cette fiche existe en
              interne mais n'est pas en circulation publique.
            </>
          );
        }
        return (
          <div
            className="sticky top-0 z-50 w-full"
            style={{
              backgroundColor: bg,
              color: fg,
              padding: "12px 24px",
              fontSize: "0.875rem",
              lineHeight: 1.4,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
            role="status"
          >
            <div className="max-w-6xl mx-auto">{content}</div>
          </div>
        );
      })()}

      <FichePraticien praticien={praticien} isPreview />

      {/* Carte d'action — uniquement pour brouillon / preview_envoyee */}
      {(praticien.statut_validation === "brouillon" ||
        praticien.statut_validation === "preview_envoyee") && (
      <section style={{ backgroundColor: "#F6F5F0", paddingBottom: 64 }}>
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <div
            className="bg-white"
            style={{
              border: "1px solid #E2EAE5",
              padding: 24,
              borderRadius: 12,
            }}
          >
            <h3
              className="font-heading"
              style={{ fontSize: "1.25rem", color: "#2C2C2C" }}
            >
              Cette fiche vous convient ?
            </h3>
            <ul
              className="mt-4 space-y-2.5"
              style={{ fontSize: "0.95rem", color: "#2C2C2C", lineHeight: 1.6 }}
            >
              <li>
                ✓ Si tout est bon, répondez par email pour valider la
                publication
              </li>
              <li>
                ✏️ Si vous souhaitez des ajustements, indiquez-les dans votre
                réponse (texte, photo, etc.)
              </li>
              <li>
                🚫 Si vous préférez ne pas figurer, dites-le simplement, 
                aucune fiche n'est publiée sans votre accord explicite
              </li>
            </ul>
          </div>
        </div>
      </section>
      )}
    </>
  );
}