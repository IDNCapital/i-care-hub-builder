import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FichePraticien } from "@/components/praticiens/FichePraticien";
import type { Praticien } from "@/pages/admin/AdminPraticiens";
import { pageUrl } from "@/lib/siteUrl";
import {
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_WIDTH,
} from "@/components/SeoHead";

type CabinetForLd = {
  name: string;
  city: string;
  address: string | null;
  show_address: boolean;
};

export default function PraticienPublic() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [praticien, setPraticien] = useState<Praticien | null>(null);
  const [cabinet, setCabinet] = useState<CabinetForLd | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [errored, setErrored] = useState(false);
  const handleBack = () => {
    // Si l'utilisateur a un historique dans l'app, on revient en arrière.
    // Sinon (arrivée directe via Google), on retombe sur la fiche cabinet ou l'accueil.
    if (window.history.length > 1) {
      navigate(-1);
    } else if (praticien?.cabinet_slug) {
      navigate(`/projets/${praticien.cabinet_slug}`);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("praticiens")
        .select("*")
        .eq("slug", slug)
        .eq("statut_validation", "validee")
        .eq("actif", true)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        setErrored(true);
        setLoading(false);
        return;
      }
      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setPraticien(data as Praticien);
      const { data: cab } = await supabase
        .from("projets")
        .select("name,city,address,show_address")
        .eq("slug", (data as Praticien).cabinet_slug)
        .maybeSingle();
      if (!cancelled) setCabinet((cab ?? null) as CabinetForLd | null);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <main
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F6F5F0" }}
      >
        <div className="flex items-center gap-2 text-sm" style={{ color: "#6B6B6B" }}>
          <Loader2 className="w-4 h-4 animate-spin" /> Chargement…
        </div>
      </main>
    );
  }

  if (errored) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-6"
        style={{ backgroundColor: "#F6F5F0" }}
      >
        <div
          className="max-w-md w-full text-center bg-white"
          style={{ border: "1px solid #E2EAE5", padding: 32, borderRadius: 12 }}
        >
          <h2 className="font-heading" style={{ fontSize: "1.5rem", color: "#2B2B2B" }}>
            Le contenu n'a pas pu être chargé.
          </h2>
          <p className="font-sans mt-3" style={{ color: "#6B6B6B", fontSize: "0.95rem" }}>
            Vérifiez votre connexion, puis réessayez.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-block mt-6 rounded font-sans font-bold uppercase tracking-[0.1em] text-[12px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9EB8A5]"
            style={{ backgroundColor: "#D9C7A1", color: "#2B2B2B", padding: "12px 24px" }}
          >
            Réessayer
          </button>
        </div>
      </main>
    );
  }

  if (notFound || !praticien) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-6"
        style={{ backgroundColor: "#F6F5F0" }}
      >
        <title>Fiche indisponible · I-CA.RE</title>
        <meta name="robots" content="noindex,follow" />
        <div
          className="max-w-md w-full text-center bg-white"
          style={{ border: "1px solid #E2EAE5", padding: 32, borderRadius: 12 }}
        >
          <h1 className="font-heading" style={{ fontSize: "1.5rem", color: "#2B2B2B" }}>
            Cette fiche n'est pas disponible.
          </h1>
          <Link
            to="/"
            className="inline-block mt-5 hover:underline"
            style={{ color: "#9EB8A5", fontSize: "0.95rem" }}
          >
            Retour à l'accueil →
          </Link>
        </div>
      </main>
    );
  }

  const fullName = `${praticien.prenom} ${praticien.nom}`;
  const ville = cabinet?.city ?? "";
  const title = `${fullName}, ${praticien.profession}${ville ? ` à ${ville}` : ""} · I-CA.RE`;
  const description = praticien.bio_courte ?? `${fullName}, ${praticien.profession}${ville ? ` à ${ville}` : ""}.`;
  const canonical = pageUrl(`/praticien/${praticien.slug}`);
  const image = praticien.photo_url ?? "https://i-ca.re/og-i-ca-re.png";

  // Quartier derived from cabinet name (strips "I-CA.RE" prefix)
  const quartier = cabinet?.name
    ? cabinet.name.replace(/I[\u2010-\u2015\-]?CA\.?RE/i, "").trim()
    : "";

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: fullName,
    jobTitle: praticien.profession,
    image,
    description,
    url: canonical,
  };
  if (cabinet) {
    const address: Record<string, string> = { "@type": "PostalAddress", addressCountry: "FR" };
    if (cabinet.show_address && cabinet.address) address.streetAddress = cabinet.address;
    if (cabinet.city) address.addressLocality = cabinet.city;
    if (quartier) address.addressRegion = quartier;
    jsonLd.worksFor = {
      "@type": "MedicalBusiness",
      name: cabinet.name,
      address,
    };
  }

  return (
    <>
      {/* Le head est rendu nativement par React 19. Le JSON-LD, lui, reste
          dans le corps : React ne hisse que les balises de metadonnees, pas
          les balises de script. Les robots le lisent ou qu'il soit. */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href={canonical} />
      {/* Fiche uniquement francaise : autoreference fr + x-default, aucun hreflang en. */}
      <link rel="alternate" hrefLang="fr" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />
      <meta property="og:type" content="profile" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {/* Heritees de la racine retiree au lot 1. Elles decrivent l'image par
          defaut et non la photo de la fiche : valeur reprise telle quelle pour
          que le retrait ne change aucune balise servie. Defaut connu, non
          corrige, a arbitrer au lot 3. */}
      <meta property="og:image:width" content={String(DEFAULT_OG_IMAGE_WIDTH)} />
      <meta property="og:image:height" content={String(DEFAULT_OG_IMAGE_HEIGHT)} />
      <meta property="og:image:alt" content={DEFAULT_OG_IMAGE_ALT} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="I-CA.RE" />
      <meta property="og:locale" content="fr_FR" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={DEFAULT_OG_IMAGE_ALT} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        className="w-full"
        style={{ backgroundColor: "#F6F5F0", borderBottom: "1px solid #E2EAE5" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Revenir à la page précédente"
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9EB8A5] rounded"
            style={{ color: "#2B2B2B" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>
      </div>
      <FichePraticien praticien={praticien} isPreview={false} />
    </>
  );
}
