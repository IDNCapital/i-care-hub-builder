import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { ArrowRight, ExternalLink } from "lucide-react";
import { SECTION_IMAGES } from "@/lib/projectImages";
import { FadeImage } from "@/components/FadeImage";

export default function NotreApproche() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  return (
    <Layout>
      <Helmet>
        <title>{t("seo.approachTitle")}</title>
        <meta name="description" content={t("seo.approachDesc")} />
      </Helmet>

      {/* 1 — Vision */}
      <section className="pt-32 pb-20 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 opacity-0 animate-fade-up">
              {t("approach.heroTitle")}
            </h1>
            <div className="space-y-5 text-lg text-muted-foreground leading-relaxed opacity-0 animate-fade-up stagger-1">
              <p>{t("approach.heroP1")}</p>
              <p>{t("approach.heroP2")}</p>
              <p>{t("approach.heroP3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Founders intro */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="section-title mb-6">{t("approach.foundersTitle")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("approach.foundersIntro")}
            </p>
          </div>

          {/* Jazmin */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <FadeImage
                src={SECTION_IMAGES.portrait}
                alt={`${t("approach.jazminName")} — ${t("approach.jazminRole")}`}
                className="rounded-3xl shadow-elevated w-full object-cover aspect-[4/3]"
              />
            </div>
            <div>
              <p className="text-primary font-medium mb-2">{t("approach.jazminRole")}</p>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">{t("approach.jazminName")}</h3>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>{t("approach.jazminP1")}</p>
                <p>{t("approach.jazminP2")}</p>
                <p>{t("approach.jazminP3")}</p>
              </div>
              <Button variant="outline" asChild className="mt-8">
                <a href="https://jazmincousins.com/" target="_blank" rel="noopener noreferrer">
                  {t("approach.jazminCta")}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Nicolas */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="lg:order-2">
              {/* Placeholder for Nicolas portrait — replace src once image is uploaded */}
              <div className="rounded-3xl shadow-elevated w-full aspect-[3/4] bg-muted flex items-center justify-center overflow-hidden">
                <span className="text-muted-foreground/40 text-sm italic">Photo à venir</span>
              </div>
            </div>
            <div className="lg:order-1">
              <p className="text-primary font-medium mb-2">{t("approach.nicolasRole")}</p>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">{t("approach.nicolasName")}</h3>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>{t("approach.nicolasP1")}</p>
                <p>{t("approach.nicolasP2")}</p>
                <p>{t("approach.nicolasP3")}</p>
                <p className="font-medium text-foreground italic">{t("approach.nicolasP4")}</p>
              </div>
              <Button variant="outline" asChild className="mt-8">
                <a href="https://rivage-ic.fr/" target="_blank" rel="noopener noreferrer">
                  {t("approach.nicolasCta")}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — Synthesis */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title mb-8">{t("approach.synthesisTitle")}</h2>
            <p className="text-lg text-muted-foreground mb-6">{t("approach.synthesisP1")}</p>
            <ul className="space-y-3 text-lg text-foreground mb-8 inline-block text-left">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                {t("approach.synthesisBullet1")}
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                {t("approach.synthesisBullet2")}
              </li>
            </ul>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>{t("approach.synthesisP2")}</p>
              <p className="font-medium text-foreground">{t("approach.synthesisP3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 — CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">{t("approach.ctaTitle")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{t("approach.ctaDesc")}</p>
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
