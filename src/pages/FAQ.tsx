import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InlineBrand } from "@/components/BrandName";

/* Numero (1-based, faq.q2/faq.a2) de la question "Que comprend le loyer ?",
   seule reponse portant le lien vers l'offre a la journee. Compare a i + 1
   puisque questions est construit sur un index 0-based. Voir faq.a2DayOfficeLink. */
const RENT_INCLUDES_QUESTION_NUMBER = 2;

export default function FAQ() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const questions = Array.from({ length: 8 }, (_, i) => ({
    q: t(`faq.q${i + 1}`),
    a: t(`faq.a${i + 1}`),
  }));

  /* FAQ JSON-LD for SEO (rendered server-side via prerender) */
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <Layout>
      <SeoHead
        title={t("seo.faqTitle")}
        description={t("seo.faqDesc")}
        path={lang === "fr" ? "/questions-frequentes" : "/en/faq"}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-up">
              {t("faq.title")}
            </h1>
            <p className="text-xl text-muted-foreground opacity-0 animate-fade-up stagger-1">
              <InlineBrand>{t("faq.subtitle")}</InlineBrand>
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {questions.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`q${i}`}
                  className="bg-secondary rounded-2xl px-6 border-none"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline py-5">
                    <InlineBrand>{item.q}</InlineBrand>
                  </AccordionTrigger>
                  <AccordionContent
                    forceMount
                    className="text-muted-foreground leading-relaxed pb-5"
                  >
                    <InlineBrand>{item.a}</InlineBrand>
                    {i + 1 === RENT_INCLUDES_QUESTION_NUMBER && (
                      <>
                        {" "}
                        <Link
                          to={localePath(lang, "cabinetJournee")}
                          className="text-primary underline underline-offset-4 hover:text-primary/80"
                        >
                          {t("faq.a2DayOfficeLink")}
                        </Link>
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">{t("faq.ctaTitle")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{t("faq.ctaDesc")}</p>
            <Button variant="hero" asChild>
              <Link to={localePath(lang, "contact")}>
                {t("common.contactUs")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
