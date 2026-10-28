import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { localePath } from "@/lib/routes";
import { pageUrl } from "@/lib/siteUrl";
import { CarteCabinetsSection } from "@/components/CarteCabinetsSection";
import { usePraticiensPublics } from "@/hooks/usePraticiensPublics";
import {
  resolvePatientsIndexMode,
  SEUIL_OUVERTURE_INDEX_PATIENTS,
} from "@/config/patientsIndex";
import { PatientsAmorcage } from "@/components/patients/PatientsAmorcage";
import { PatientsOuvert } from "@/components/patients/PatientsOuvert";

/**
 * Index public /patients.
 *
 * Deux modes pré-rendus selon le seuil défini dans
 * `src/config/patientsIndex.ts` :
 *   - amorçage  → noindex,nofollow + page d'attente compteur N/8
 *   - ouvert    → index,follow + annuaire complet recherchable
 *
 * Override QA : variable d'env `VITE_FORCE_PATIENTS_INDEX_OPEN=true`.
 */
export default function Patients() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";
  const path = localePath(lang, "patients");
  const { data: praticiens, loading, error, retry } = usePraticiensPublics();
  const mode = !loading && !error ? resolvePatientsIndexMode(praticiens.length) : null;

  const seoTitle =
    mode === null
      ? "Espace Patients I-CA.RE | Annuaire"
      : mode === "ouvert"
      ? "Annuaire des praticiennes et praticiens I-CA.RE | Bordeaux"
      : "Espace Patients I-CA.RE | En cours de lancement";

  const seoDesc =
    mode === null
      ? "Consultez l'annuaire des praticiennes et praticiens I-CA.RE."
      : mode === "ouvert"
      ? "Trouvez une praticienne ou un praticien du soin, paramédical et bien-être à Bordeaux. Annuaire qualitatif I-CA.RE."
      : `L'annuaire I-CA.RE ouvre publiquement quand ${SEUIL_OUVERTURE_INDEX_PATIENTS} spécialistes ont validé leur fiche. Découvrez les premières fiches déjà publiées.`;

  // Balisage propre de l'annuaire, sur le motif de ProblematiquesIndex.tsx :
  // fil d'ariane et ItemList des fiches que la page liste. Le `name` reprend
  // exactement la chaîne affichée par CartePraticien, et rien d'autre que le
  // nom et l'URL de la fiche n'entre ici.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: lang === "fr" ? "Accueil" : "Home",
            item: pageUrl(localePath(lang, "home")),
          },
          { "@type": "ListItem", position: 2, name: "Patients", item: pageUrl(path) },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: praticiens.map((p, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: `${p.prenom} ${p.nom}`,
          url: pageUrl(`/praticien/${p.slug}`),
        })),
      },
    ],
  };

  return (
    <Layout>
      <SeoHead
        title={seoTitle}
        description={seoDesc}
        path={path}
        noIndex={mode !== "ouvert"}
      />
      {!loading && !error && praticiens.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {/* Marqueur data-praticiens-annuaire : nombre de fiches servies, une fois
          la requête aboutie. Le JSON-LD est rendu dans le corps, il n'existe
          que tant que ce composant rend : sans fait déclaré, la capture de
          prérendu ne peut pas distinguer « pas encore chargé » de « rien à
          montrer ». Il est posé ici, hors du branchement de mode et sans
          condition sur la longueur, pour que l'attente de prérendu soit
          inconditionnelle sur les deux routes. Voir ATTENTES_DOM dans
          scripts/prerender.mjs. */}
      {!loading && !error && <div hidden data-praticiens-annuaire={praticiens.length} />}
      {loading ? (
        <div role="status" className="pt-40 pb-40 flex items-center justify-center gap-3">
          <Loader2 aria-hidden="true" className="w-8 h-8 animate-spin text-muted-foreground" />
          <span>Chargement de l'annuaire…</span>
        </div>
      ) : error ? (
        <section className="pt-32 pb-20 px-4 max-w-3xl mx-auto space-y-4">
          <h1 className="font-heading text-3xl">Annuaire momentanément indisponible</h1>
          <p role="alert">Les fiches et leur nombre ne sont pas confirmés. Réessayez pour consulter l'annuaire.</p>
          <Button onClick={retry}>Réessayer l'annuaire</Button>
        </section>
      ) : mode === "ouvert" ? (
        <PatientsOuvert praticiens={praticiens} />
      ) : (
        <PatientsAmorcage praticiens={praticiens} />
      )}

      {/* Carte interactive des cabinets, conservée dans les deux modes */}
      <CarteCabinetsSection
        background="secondary"
        title={lang === "fr" ? "Trouver un cabinet près de chez vous" : "Find an office near you"}
        subtitle={
          lang === "fr"
            ? "Découvrez l'emplacement de nos cabinets de soin, paramédical et bien-être."
            : "Discover the location of our care, paramedical and wellbeing offices."
        }
      />
    </Layout>
  );
}
