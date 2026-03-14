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

export default function FAQ() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const questions = Array.from({ length: 8 }, (_, i) => ({
    q: t(`faq.q${i + 1}`),
    a: t(`faq.a${i + 1}`),
  }));

  return (
    <Layout>
      <SeoHead
        title={t("seo.faqTitle")}
        description={t("seo.faqDesc")}
        path={lang === "fr" ? "/questions-frequentes" : "/en/faq"}
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
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {item.a}
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
