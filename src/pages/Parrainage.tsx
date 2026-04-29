import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/SeoHead";
import { localePath } from "@/lib/routes";

export default function Parrainage() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";
  const path = localePath(lang, "parrainage");

  const t = lang === "fr"
    ? {
        title: "Parrainage — Bientôt en ligne",
        seoTitle: "Parrainage — I-CA.RE",
        seoDesc: "Le programme de parrainage I-CA.RE arrive prochainement.",
        sub: "Recommandez un confrère, partagez l'aventure.",
        body: "Notre programme de parrainage est en cours de finalisation. Il permettra à nos locataires de recommander un confrère ou une consœur en quelques clics. Vous souhaitez en savoir plus dès maintenant ? Contactez notre équipe.",
        cta: "Nous contacter",
      }
    : {
        title: "Referral Programme — Coming Soon",
        seoTitle: "Referral Programme — I-CA.RE",
        seoDesc: "The I-CA.RE referral programme is launching soon.",
        sub: "Recommend a colleague, share the journey.",
        body: "Our referral programme is being finalised. It will let our tenants recommend a colleague in a few clicks. Want to know more today? Get in touch with our team.",
        cta: "Contact us",
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
            <Link to={localePath(lang, "contact")}>{t.cta}</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}