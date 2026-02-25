import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import {
  Heart, Target, Users, Building2, HandHeart, Lightbulb, ArrowRight,
  Search, FileSearch, Ruler, HardHat, Settings, TrendingUp, Shield,
} from "lucide-react";
import { SECTION_IMAGES } from "@/lib/projectImages";

export default function NotreApproche() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const values = [
    { icon: Heart, title: t("approach.values.responsibility"), description: t("approach.values.responsibilityDesc") },
    { icon: Target, title: t("approach.values.impact"), description: t("approach.values.impactDesc") },
    { icon: HandHeart, title: t("approach.values.care"), description: t("approach.values.careDesc") },
    { icon: Lightbulb, title: t("approach.values.excellence"), description: t("approach.values.excellenceDesc") },
    { icon: Users, title: t("approach.values.pragmatism"), description: t("approach.values.pragmatismDesc") },
  ];

  const stepIcons = [Search, FileSearch, Ruler, HardHat, Users, Settings];
  const steps = Array.from({ length: 6 }, (_, i) => {
    const n = i + 1;
    const num = String(n).padStart(2, "0");
    return {
      icon: stepIcons[i],
      number: num,
      title: t(`approach.steps.s${n}Title`),
      description: t(`approach.steps.s${n}Desc`),
      details: [t(`approach.steps.s${n}d1`), t(`approach.steps.s${n}d2`), t(`approach.steps.s${n}d3`), t(`approach.steps.s${n}d4`)],
    };
  });

  const partners = [
    { name: "Rivage IC", role: t("approach.partners.rivage"), description: t("approach.partners.rivageDesc") },
    { name: "IDNéa", role: t("approach.partners.idnea"), description: t("approach.partners.idneaDesc") },
    { name: "Inside BAT", role: t("approach.partners.insidebat"), description: t("approach.partners.insidebatDesc") },
  ];

  const collectiviteBenefits = [
    { icon: Users, title: t("approach.collectivitesBenefits.service"), description: t("approach.collectivitesBenefits.serviceDesc") },
    { icon: Building2, title: t("approach.collectivitesBenefits.heritage"), description: t("approach.collectivitesBenefits.heritageDesc") },
    { icon: TrendingUp, title: t("approach.collectivitesBenefits.employment"), description: t("approach.collectivitesBenefits.employmentDesc") },
    { icon: Shield, title: t("approach.collectivitesBenefits.security"), description: t("approach.collectivitesBenefits.securityDesc") },
  ];

  const milestones = [
    { year: "2023", event: t("approach.milestones.2023") },
    { year: "2024", event: t("approach.milestones.2024") },
    { year: "2025", event: t("approach.milestones.2025") },
    { year: "2026", event: t("approach.milestones.2026") },
  ];

  const teamMembers = [
    { role: t("approach.team.direction"), desc: t("approach.team.directionDesc") },
    { role: t("approach.team.architecture"), desc: t("approach.team.architectureDesc") },
    { role: t("approach.team.works"), desc: t("approach.team.worksDesc") },
    { role: t("approach.team.commercial"), desc: t("approach.team.commercialDesc") },
  ];

  return (
    <Layout>
      <Helmet>
        <title>{t("seo.approachTitle")}</title>
        <meta name="description" content={t("seo.approachDesc")} />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 opacity-0 animate-fade-up">{t("approach.heroTitle")}</h1>
            <p className="text-xl text-muted-foreground opacity-0 animate-fade-up stagger-1">{t("approach.heroSubtitle")}</p>
            <Button variant="hero" asChild className="mt-8 opacity-0 animate-fade-up stagger-2">
              <Link to={localePath(lang, "contact")}>{t("approach.ctaTeam")}<ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Founder Vision */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img src={SECTION_IMAGES.portrait} alt={t("approach.founderName") + " — " + t("approach.founderRole")} className="rounded-3xl shadow-elevated w-full object-cover aspect-[4/3]" loading="lazy" />
              <p className="text-sm text-muted-foreground mt-3 text-center">{t("approach.founderName")} — {t("approach.founderRole")}</p>
            </div>
            <div>
              <h2 className="section-title mb-8">{t("approach.founderSectionTitle")}</h2>
              <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
                <p>{t("approach.founderIntro")}</p>
                <p>{t("approach.founderJazmin")}</p>
                <p>{t("approach.founderNicolas")}</p>
                <p className="font-medium text-foreground italic">{t("approach.founderAmbition")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Healthcare Challenges */}
      <section className="section-padding bg-foreground text-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">{t("approach.desertTitle")}</h2>
            <p className="text-background/70 text-lg">{t("approach.desertSubtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[{ value: t("approach.stat1Value"), label: t("approach.stat1Label") }, { value: t("approach.stat2Value"), label: t("approach.stat2Label") }, { value: t("approach.stat3Value"), label: t("approach.stat3Label") }].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-5xl md:text-6xl font-bold text-primary mb-4">{stat.value}</p>
                <p className="text-background/70">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="max-w-3xl mx-auto space-y-4 text-background/80 text-lg leading-relaxed">
            <p>{t("approach.desertP1")}</p>
            <p>{t("approach.desertP2")}</p>
          </div>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {milestones.map((m) => (
              <div key={m.year} className="text-center p-6 bg-background/10 rounded-xl">
                <p className="text-2xl font-bold text-primary">{m.year}</p>
                <p className="text-sm text-background/70 mt-2">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">{t("approach.valuesTitle")}</h2>
            <p className="section-subtitle mx-auto">{t("approach.valuesSubtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((v) => (
              <div key={v.title} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4"><v.icon className="w-8 h-8 text-foreground" /></div>
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Method */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="section-title mb-6">{t("approach.methodTitle")}</h2>
              <p className="text-lg text-muted-foreground">{t("approach.methodDesc")}</p>
            </div>
            <div><img src={SECTION_IMAGES.approachMethod} alt={lang === "fr" ? "Façade – I-CA.RE Pey Berland" : "Facade – I-CA.RE Pey Berland"} className="rounded-3xl shadow-elevated w-full object-cover aspect-[4/3]" loading="lazy" /></div>
          </div>
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={step.number} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center"><step.icon className="w-8 h-8 text-primary-foreground" /></div>
                    <span className="text-6xl font-bold text-muted/30">{step.number}</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                  <p className="text-lg text-muted-foreground mb-6">{step.description}</p>
                </div>
                <div className={`bg-secondary rounded-2xl p-8 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <h4 className="font-semibold mb-4">{t("approach.whatWeDo")}</h4>
                  <ul className="space-y-3">
                    {step.details.map((d) => (<li key={d} className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-primary" /><span>{d}</span></li>))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section-padding bg-foreground text-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">{t("approach.partnersTitle")}</h2>
            <p className="text-background/70 text-lg">{t("approach.partnersDesc")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {partners.map((p) => (
              <div key={p.name} className="bg-background/10 backdrop-blur rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-semibold mb-2">{p.name}</h3>
                <p className="text-primary font-medium mb-4">{p.role}</p>
                <p className="text-background/70">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-secondary">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">{t("approach.teamTitle")}</h2>
            <p className="section-subtitle mx-auto">{t("approach.teamSubtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((m) => (
              <div key={m.role} className="bg-background rounded-2xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{m.role}</h3>
                <p className="text-sm text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collectivités */}
      <section id="collectivites" className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            <div>
              <span className="text-primary font-medium mb-4 block">{t("approach.collectivitesTag")}</span>
              <h2 className="section-title mb-6">{t("approach.collectivitesTitle")}</h2>
              <p className="text-lg text-muted-foreground mb-8">{t("approach.collectivitesDesc")}</p>
              <Button asChild><Link to={localePath(lang, "contact")}>{t("approach.collectivitesCta")}<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            </div>
            <div><img src={SECTION_IMAGES.approachCollectivites} alt={lang === "fr" ? "Salle d'attente – I-CA.RE Nansouty" : "Waiting room – I-CA.RE Nansouty"} className="rounded-3xl shadow-elevated w-full object-cover aspect-[4/3]" loading="lazy" /></div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {collectiviteBenefits.map((b) => (
              <div key={b.title} className="card-premium text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-5"><b.icon className="w-8 h-8 text-foreground" /></div>
                <h3 className="text-xl font-semibold mb-3">{b.title}</h3>
                <p className="text-muted-foreground">{b.description}</p>
              </div>
            ))}
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-primary font-medium">{t("approach.caseStudyTag")}</span>
              <h3 className="text-2xl md:text-3xl font-semibold mt-2">{t("approach.caseStudyTitle")}</h3>
            </div>
            <div className="bg-secondary rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div><h4 className="font-semibold mb-2">{t("approach.caseStudyContext")}</h4><p className="text-muted-foreground">{t("approach.caseStudyContextDesc")}</p></div>
                <div><h4 className="font-semibold mb-2">{t("approach.caseStudySolution")}</h4><p className="text-muted-foreground">{t("approach.caseStudySolutionDesc")}</p></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[{ value: "5", label: t("approach.caseStudyStats.offices") }, { value: "8", label: t("approach.caseStudyStats.practitioners") }, { value: "90m²", label: t("approach.caseStudyStats.surface") }, { value: "✓", label: t("approach.caseStudyStats.opening") }].map((s) => (
                  <div key={s.label} className="text-center p-4 bg-background rounded-xl">
                    <p className="text-2xl font-bold text-primary">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="cta-section text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">{t("approach.ctaTitle")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{t("approach.ctaDesc")}</p>
            <Button variant="hero" asChild>
              <Link to={localePath(lang, "contact")}>{t("common.contactUs")}<ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}