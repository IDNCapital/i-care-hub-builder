import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { localePath } from "@/lib/routes";
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
  const { data: praticiens, loading } = usePraticiensPublics();
  const mode = resolvePatientsIndexMode(praticiens.length);

  const seoTitle =
    mode === "ouvert"
      ? "Annuaire des praticiennes et praticiens I-CA.RE — Bordeaux"
      : "Espace Patients I-CA.RE — En cours de lancement";

  const seoDesc =
    mode === "ouvert"
      ? "Trouvez une praticienne ou un praticien du soin, paramédical et bien-être à Bordeaux. Annuaire qualitatif I-CA.RE."
      : `L'annuaire I-CA.RE ouvre publiquement quand ${SEUIL_OUVERTURE_INDEX_PATIENTS} spécialistes ont validé leur fiche. Découvrez les premières fiches déjà publiées.`;

  return (
    <Layout>
      <SeoHead
        title={seoTitle}
        description={seoDesc}
        path={path}
        noIndex={mode === "amorcage"}
      />
      {loading ? (
        <div className="pt-40 pb-40 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : mode === "ouvert" ? (
        <PatientsOuvert praticiens={praticiens} />
      ) : (
        <PatientsAmorcage praticiens={praticiens} />
      )}

      {/* Carte interactive des cabinets — conservée dans les deux modes */}
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