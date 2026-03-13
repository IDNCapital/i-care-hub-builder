import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { STATIC_CENTRES } from "@/lib/centres";
import { ArrowRight, MapPin } from "lucide-react";

export default function BlogTrouverCabinet() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const title = lang === "fr"
    ? "Comment trouver un cabinet à Bordeaux quand on est praticien ?"
    : "How to find a practice office in Bordeaux as a practitioner?";

  const metaDesc = lang === "fr"
    ? "Psychologue, thérapeute, ostéopathe ou professionnel du bien-être : découvrez comment trouver un cabinet à Bordeaux et les critères essentiels pour bien choisir votre lieu d'exercice."
    : "Psychologist, therapist, osteopath or wellbeing professional: discover how to find a practice office in Bordeaux and the key criteria for choosing the right space.";

  return (
    <Layout>
      <SeoHead
        title={`${title} | I-CA.RE`}
        description={metaDesc}
        path={lang === "fr" ? "/blog/trouver-cabinet-bordeaux-praticien" : "/en/blog/finding-office-bordeaux-practitioner"}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-primary/15 text-primary text-xs font-bold uppercase tracking-[0.1em] rounded-full mb-6">
              {lang === "fr" ? "Guide praticien" : "Practitioner guide"}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6 opacity-0 animate-fade-up">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed opacity-0 animate-fade-up stagger-1">
              {lang === "fr"
                ? "Vous êtes psychologue, thérapeute, ostéopathe ou professionnel du bien-être et vous cherchez un cabinet à louer à Bordeaux ? Ce guide vous accompagne dans votre recherche."
                : "Are you a psychologist, therapist, osteopath or wellbeing professional looking for an office in Bordeaux? This guide will help you in your search."}
            </p>
          </div>
        </div>
      </section>

      <article className="section-padding">
        <div className="container max-w-3xl">

          {/* Introduction */}
          <div className="prose-section mb-16">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {lang === "fr"
                ? "De nombreux praticiens du soin et du bien-être rencontrent les mêmes difficultés lorsqu'ils cherchent un cabinet de consultation à Bordeaux : les loyers sont élevés, les locaux rarement adaptés à la pratique thérapeutique, et l'isolement professionnel pèse au quotidien."
                : "Many care and wellbeing practitioners face the same challenges when looking for a consultation office in Bordeaux: high rents, premises rarely suited to therapeutic practice, and professional isolation that takes its toll."}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {lang === "fr"
                ? "Trouver un cabinet paramédical à Bordeaux qui réunit confidentialité, confort, accessibilité et loyer maîtrisé est un vrai parcours du combattant. Pourtant, la qualité du lieu d'exercice influence directement la relation thérapeutique et la réussite de votre activité."
                : "Finding a healthcare office in Bordeaux that combines confidentiality, comfort, accessibility and controlled rent is a real challenge. Yet the quality of your practice space directly influences the therapeutic relationship and the success of your activity."}
            </p>
          </div>

          {/* Section 1 */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">
              {lang === "fr"
                ? "Pourquoi il est difficile de trouver un cabinet de consultation à Bordeaux"
                : "Why finding a consultation office in Bordeaux is difficult"}
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                {lang === "fr"
                  ? "La métropole bordelaise connaît une forte tension immobilière. Les petites surfaces, idéales pour un cabinet thérapeute à Bordeaux, sont rares et souvent captées par d'autres usages commerciaux. Les locaux disponibles présentent fréquemment des défauts rédhibitoires pour l'exercice du soin."
                  : "The Bordeaux metropolitan area faces significant real estate pressure. Small spaces, ideal for a therapy office, are scarce and often taken by other commercial uses. Available premises frequently have deal-breaking flaws for care practice."}
              </p>
              <ul className="space-y-3 pl-5 list-disc marker:text-primary">
                <li>
                  {lang === "fr"
                    ? "Rareté des petits locaux adaptés (11 à 15 m²) en rez-de-chaussée"
                    : "Scarcity of suitable small premises (11 to 15 sqm) on the ground floor"}
                </li>
                <li>
                  {lang === "fr"
                    ? "Manque d'espaces spécifiquement pensés pour la consultation : isolation acoustique insuffisante, pas de salle d'attente, absence de conformité PMR"
                    : "Lack of spaces specifically designed for consultations: insufficient acoustic insulation, no waiting room, no disability access"}
                </li>
                <li>
                  {lang === "fr"
                    ? "Difficulté de trouver un environnement calme et professionnel qui favorise la confidentialité des échanges"
                    : "Difficulty finding a calm, professional environment that ensures the confidentiality of exchanges"}
                </li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">
              {lang === "fr"
                ? "Les critères essentiels pour choisir un cabinet"
                : "Essential criteria for choosing an office"}
            </h2>

            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  {lang === "fr" ? "Emplacement" : "Location"}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {lang === "fr"
                    ? "Un bon cabinet consultation à Bordeaux se situe dans un quartier vivant mais calme, bien desservi par les transports en commun et facilement accessible pour vos patients. Les quartiers centraux comme les Chartrons, Nansouty, Pey-Berland ou Jardin Public offrent cet équilibre idéal."
                    : "A good consultation office in Bordeaux is located in a vibrant yet calm neighbourhood, well served by public transport and easily accessible for your patients. Central neighbourhoods like Chartrons, Nansouty, Pey-Berland or Jardin Public offer this ideal balance."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  {lang === "fr" ? "Surface adaptée" : "Suitable surface area"}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {lang === "fr"
                    ? "Pour un cabinet de consultation individuel, une surface de 11 à 15 m² est idéale. Elle permet d'accueillir confortablement votre patient, de disposer votre mobilier et de conserver un espace aéré et apaisant. C'est la surface que proposent les cabinets I-CA.RE."
                    : "For an individual consultation office, a surface area of 11 to 15 sqm is ideal. It allows you to comfortably welcome your patient, arrange your furniture and maintain an airy, soothing space. This is the surface offered by I-CA.RE offices."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  {lang === "fr" ? "Salle d'attente" : "Waiting room"}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {lang === "fr"
                    ? "Une salle d'attente partagée est un vrai atout pour vos patients. Elle leur offre un espace d'accueil dédié, confortable et rassurant, qui contribue à la qualité perçue de votre pratique."
                    : "A shared waiting room is a real asset for your patients. It offers them a dedicated, comfortable and reassuring welcome area that contributes to the perceived quality of your practice."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  {lang === "fr" ? "Atmosphère du lieu" : "Atmosphere of the space"}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {lang === "fr"
                    ? "L'atmosphère de votre cabinet paramédical à Bordeaux joue un rôle essentiel dans la relation thérapeutique. Lumière naturelle, matériaux nobles, couleurs apaisantes, isolation phonique — chaque détail compte pour créer un cadre propice au soin."
                    : "The atmosphere of your healthcare office in Bordeaux plays an essential role in the therapeutic relationship. Natural light, quality materials, soothing colours, acoustic insulation — every detail matters in creating a space conducive to care."}
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">
              {lang === "fr"
                ? "Cabinet individuel ou espace partagé ?"
                : "Individual office or shared space?"}
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                {lang === "fr"
                  ? "Louer un cabinet à louer à Bordeaux en solo peut paraître rassurant, mais l'exercice isolé présente des limites : pas d'échanges entre pairs, coûts fixes plus élevés, gestion administrative chronophage."
                  : "Renting a solo office in Bordeaux may seem reassuring, but isolated practice has its limits: no peer exchanges, higher fixed costs, time-consuming administrative management."}
              </p>
              <p>
                {lang === "fr"
                  ? "Les espaces partagés et pluridisciplinaires offrent une alternative de plus en plus prisée par les praticiens :"
                  : "Shared, multidisciplinary spaces offer an increasingly popular alternative for practitioners:"}
              </p>
              <ul className="space-y-3 pl-5 list-disc marker:text-primary">
                <li>
                  {lang === "fr"
                    ? "Échanges entre praticiens de disciplines complémentaires (psychologues, ostéopathes, kinésithérapeutes, sophrologues…)"
                    : "Exchanges between practitioners of complementary disciplines (psychologists, osteopaths, physiotherapists, sophrologists…)"}
                </li>
                <li>
                  {lang === "fr"
                    ? "Mutualisation des espaces communs : salle d'attente, sanitaires, espace ménage"
                    : "Shared common areas: waiting room, facilities, cleaning"}
                </li>
                <li>
                  {lang === "fr"
                    ? "Dynamique professionnelle stimulante qui rompt l'isolement du praticien libéral"
                    : "A stimulating professional dynamic that breaks the isolation of self-employed practitioners"}
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 — Lieux I-CA.RE */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">
              {lang === "fr"
                ? "Les lieux I-CA.RE à Bordeaux"
                : "I-CA.RE spaces in Bordeaux"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {lang === "fr"
                ? "I-CA.RE propose aujourd'hui six lieux de soin dans la métropole bordelaise, chacun avec son identité propre. Nos cabinets de consultation à Bordeaux sont conçus pour répondre aux exigences des praticiens du soin et du bien-être."
                : "I-CA.RE currently offers six care spaces across the Bordeaux metropolitan area, each with its own identity. Our consultation offices in Bordeaux are designed to meet the requirements of care and wellbeing practitioners."}
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {STATIC_CENTRES.map((centre) => (
                <div key={centre.id} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-heading font-semibold text-foreground">{centre.name}</p>
                    <p className="text-sm text-muted-foreground">{centre.address}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground leading-relaxed">
              <Link
                to={localePath(lang, "locationBordeaux")}
                className="text-primary font-medium underline underline-offset-4 hover:text-primary/80"
              >
                {lang === "fr"
                  ? "Découvrez tous nos cabinets à louer à Bordeaux →"
                  : "Discover all our offices for rent in Bordeaux →"}
              </Link>
            </p>
          </section>

          {/* Section 5 — Conclusion */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">
              {lang === "fr" ? "Conclusion" : "Conclusion"}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {lang === "fr"
                ? "Un lieu de consultation doit être pensé pour la pratique et le bien-être des patients. L'isolation acoustique, la lumière naturelle, l'accessibilité et le cadre général ne sont pas des détails — ce sont les fondations d'une relation thérapeutique de qualité. Choisir un cabinet thérapeute à Bordeaux, c'est aussi choisir l'image que vous renvoyez à vos patients et les conditions dans lesquelles vous exercez au quotidien."
                : "A consultation space must be designed for practice and patient wellbeing. Acoustic insulation, natural light, accessibility and the overall setting are not details — they are the foundations of a quality therapeutic relationship. Choosing a therapy office in Bordeaux also means choosing the image you project to your patients and the conditions in which you practise daily."}
            </p>
          </section>

        </div>
      </article>

      {/* CTA */}
      <section className="section-padding bg-foreground">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4 text-background">
              {lang === "fr"
                ? "Vous cherchez un cabinet à Bordeaux ?"
                : "Looking for an office in Bordeaux?"}
            </h2>
            <p className="text-background/70 text-lg mb-8">
              {lang === "fr"
                ? "Contactez-nous pour échanger sur votre projet d'installation et découvrir les espaces I-CA.RE."
                : "Contact us to discuss your setup project and discover I-CA.RE spaces."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <Link to={localePath(lang, "contact")}>
                  {lang === "fr" ? "Échanger sur mon projet" : "Discuss My Project"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="hero-outline"
                className="border-background/30 text-background hover:bg-background/10"
                asChild
              >
                <Link to={localePath(lang, "locationBordeaux")}>
                  {lang === "fr" ? "Voir les cabinets disponibles" : "View available offices"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
