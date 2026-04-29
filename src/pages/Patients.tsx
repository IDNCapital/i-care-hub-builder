import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/SeoHead";
import { localePath } from "@/lib/routes";

export default function Patients() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";
  const path = localePath(lang, "patients");

  const t = lang === "fr"
    ? {
        title: "Espace Patients — Bientôt en ligne",
        seoTitle: "Espace Patients — I-CA.RE",
        seoDesc: "Notre annuaire qualitatif des praticiens du soin et du bien-être ouvre prochainement.",
        sub: "Trouvez votre praticien à Bordeaux.",
        body: "Notre annuaire qualitatif des praticiens du soin et du bien-être ouvre prochainement. Vous souhaitez prendre rendez-vous avec un praticien I-CA.RE dès maintenant ? Découvrez nos cabinets et leurs locataires.",
        cta: "Voir nos cabinets",
      }
    : {
        title: "Patient Area — Coming Soon",
        seoTitle: "Patient Area — I-CA.RE",
        seoDesc: "Our curated directory of care and wellbeing practitioners is opening soon.",
        sub: "Find your practitioner in Bordeaux.",
        body: "Our curated directory of care and wellbeing practitioners is opening soon. Want to book an appointment with an I-CA.RE practitioner today? Explore our spaces and their tenants.",
        cta: "View our spaces",
      };

  return (
    <Layout>
      <SeoHead title={t.seoTitle} description={t.seoDesc} path={path} noIndex />
      <section className="pt-32 pb-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-6 text-balance">
            {t.title}
          </h1>
          <p className="font-heading italic text-2xl md:text-3xl text-foreground/80 mb-8 text-balance">
            {t.sub}
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            {t.body}
          </p>
          <Button variant="gold" size="lg" asChild>
            <Link to={localePath(lang, "projects")}>{t.cta}</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}