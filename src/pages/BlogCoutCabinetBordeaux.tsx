import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { FadeImage } from "@/components/FadeImage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import cab1Image from "@/assets/pey-berland/cab1.webp";
import jardinAttenteImage from "@/assets/jardin-public/attente.webp";

export default function BlogCoutCabinetBordeaux() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const title =
    lang === "fr"
      ? "Combien coûte un cabinet de consultation à Bordeaux ? | I-CA.RE"
      : "How much does a consultation office cost in Bordeaux? | I-CA.RE";

  const metaDesc =
    lang === "fr"
      ? "Loyer, surface, charges : découvrez le coût réel d'un cabinet de consultation à Bordeaux et comment choisir un lieu adapté à votre pratique."
      : "Rent, size, charges: discover the real cost of a consultation office in Bordeaux and how to choose a space suited to your practice.";

  const path =
    lang === "fr"
      ? "/blog/combien-coute-cabinet-consultation-bordeaux"
      : "/en/blog/consultation-office-cost-bordeaux";

  const faqItems =
    lang === "fr"
      ? [
          {
            q: "Quel est le loyer moyen d'un cabinet à Bordeaux ?",
            a: "Il varie selon l'emplacement et les prestations, mais se situe généralement entre 600 € et 800 € par mois pour un cabinet de consultation optimisé de 11 à 15 m².",
          },
          {
            q: "Quelle surface pour un cabinet de consultation ?",
            a: "Entre 11 et 15 m² suffisent dans un espace bien conçu. L'essentiel est la qualité de l'aménagement : acoustique, luminosité, circulation et intimité.",
          },
          {
            q: "Peut-on partager un cabinet entre praticiens ?",
            a: "Oui, de nombreux praticiens choisissent des espaces mutualisés pour optimiser les coûts et bénéficier d'un environnement professionnel structuré avec salle d'attente et entretien des espaces communs.",
          },
        ]
      : [
          {
            q: "What is the average rent for an office in Bordeaux?",
            a: "It varies by location and amenities, but typically ranges from €600 to €800 per month for an optimised 11 to 15 m² consultation office.",
          },
          {
            q: "What size is needed for a consultation office?",
            a: "Between 11 and 15 m² is sufficient in a well-designed space. What matters most is the quality of the fit-out: acoustics, natural light, circulation and privacy.",
          },
          {
            q: "Can practitioners share an office?",
            a: "Yes, many practitioners choose shared spaces to optimise costs and benefit from a structured professional environment with a waiting room and maintained common areas.",
          },
        ];

  return (
    <Layout>
      <SeoHead title={title} description={metaDesc} path={path} />

      <article className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          {/* H1 */}
          <h1 className="text-3xl sm:text-4xl font-heading font-bold leading-tight mb-6">
            {lang === "fr"
              ? "Combien coûte un cabinet de consultation à Bordeaux ?"
              : "How much does a consultation office cost in Bordeaux?"}
          </h1>

          {/* Introduction */}
          <p className="text-muted-foreground leading-relaxed mb-4">
            {lang === "fr"
              ? "Lorsque l'on souhaite s'installer comme praticien à Bordeaux, la question du coût du cabinet revient immédiatement. Psychologues, thérapeutes, ostéopathes ou professionnels du bien-être se retrouvent souvent face à des offres très différentes, difficiles à comparer."
              : "When looking to set up a practice in Bordeaux, the cost of the office is one of the first questions. Psychologists, therapists, osteopaths and wellbeing professionals often face very different offers that are hard to compare."}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {lang === "fr"
              ? "Au-delà du loyer affiché, il est essentiel de comprendre ce que recouvre réellement le coût d'un cabinet de consultation. Un espace mal adapté peut rapidement devenir contraignant, tandis qu'un lieu bien conçu peut améliorer durablement la qualité de votre pratique."
              : "Beyond the advertised rent, it is essential to understand what the cost of a consultation office truly covers. A poorly adapted space can quickly become restrictive, while a well-designed space can lastingly improve the quality of your practice."}
          </p>

          {/* Image 1 */}
          <FadeImage
            src={cab1Image}
            alt={lang === "fr" ? "Cabinet de consultation à Bordeaux, I‑CA.RE" : "Consultation office in Bordeaux, I‑CA.RE"}
            className="w-full rounded-lg mb-10 aspect-[16/10] object-cover"
          />

          {/* Section: Ce qui compose le coût */}
          <h2 className="text-2xl font-heading font-bold mt-10 mb-4">
            {lang === "fr"
              ? "Ce qui compose réellement le coût d'un cabinet"
              : "What actually makes up the cost of an office"}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {lang === "fr"
              ? "Le coût d'un cabinet de consultation ne se limite pas à son loyer. Il faut prendre en compte plusieurs éléments :"
              : "The cost of a consultation office is not limited to rent. Several elements must be considered:"}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
            <li>{lang === "fr" ? "Le loyer mensuel" : "Monthly rent"}</li>
            <li>{lang === "fr" ? "Les charges (énergie, entretien, parties communes)" : "Charges (energy, maintenance, common areas)"}</li>
            <li>{lang === "fr" ? "Les éventuels travaux d'aménagement" : "Potential fit-out works"}</li>
            <li>{lang === "fr" ? "L'équipement (mobilier, acoustique, éclairage)" : "Equipment (furniture, acoustics, lighting)"}</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {lang === "fr"
              ? "Un cabinet à louer à Bordeaux peut sembler abordable à première vue, mais devenir coûteux une fois tous ces éléments intégrés. C'est pourquoi il est important d'évaluer le coût global avant de s'engager."
              : "An office for rent in Bordeaux may seem affordable at first glance, but become costly once all these elements are factored in. This is why evaluating the total cost before committing is important."}
          </p>

          {/* Section: Surface */}
          <h2 className="text-2xl font-heading font-bold mt-10 mb-4">
            {lang === "fr"
              ? "Surface utile vs surface réelle"
              : "Usable area vs actual area"}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {lang === "fr"
              ? "Un cabinet de consultation n'a pas besoin d'être grand pour être fonctionnel. En pratique, une surface de 11 à 15 m² est souvent suffisante pour accueillir un patient dans de bonnes conditions."
              : "A consultation office does not need to be large to be functional. In practice, 11 to 15 m² is often sufficient to see a patient in proper conditions."}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {lang === "fr"
              ? "L'essentiel est ailleurs : qualité acoustique, organisation des espaces, présence d'une salle d'attente et circulation fluide."
              : "What matters most lies elsewhere: acoustic quality, space organisation, a waiting room and smooth circulation."}
          </p>

          {/* Highlight box */}
          <div className="bg-secondary border border-border rounded-lg p-5 mb-8">
            <p className="font-semibold text-foreground mb-1">
              {lang === "fr" ? "À retenir :" : "Key takeaway:"}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {lang === "fr"
                ? "Un cabinet paramédical bien conçu de 12 m² est souvent plus efficace qu'un espace de 25 m² mal organisé. La qualité de l'aménagement prime sur la surface brute."
                : "A well-designed 12 m² allied health office is often more effective than a poorly organised 25 m² space. The quality of the fit-out matters more than raw square footage."}
            </p>
          </div>

          {/* Section: Emplacement */}
          <h2 className="text-2xl font-heading font-bold mt-10 mb-4">
            {lang === "fr"
              ? "L'importance de l'emplacement à Bordeaux"
              : "The importance of location in Bordeaux"}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {lang === "fr"
              ? "À Bordeaux, l'emplacement influence fortement le coût d'un cabinet thérapeute ou paramédical :"
              : "In Bordeaux, location strongly influences the cost of a therapy or allied health office:"}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
            <li>{lang === "fr" ? "Centre-ville : plus cher mais plus visible" : "City centre: more expensive but more visible"}</li>
            <li>{lang === "fr" ? "Quartiers résidentiels : plus calmes et souvent plus adaptés au soin" : "Residential areas: quieter and often better suited to care"}</li>
            <li>{lang === "fr" ? "Rive droite : opportunités en développement" : "Right bank: developing opportunities"}</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {lang === "fr"
              ? "Des quartiers comme les Chartrons, Nansouty ou le Jardin Public offrent un bon équilibre entre accessibilité, cadre de vie et qualité d'accueil pour un cabinet de consultation à Bordeaux."
              : "Neighbourhoods such as Chartrons, Nansouty or Jardin Public offer a good balance between accessibility, living environment and reception quality for a consultation office in Bordeaux."}
          </p>

          {/* Section: Individuel vs partagé */}
          <h2 className="text-2xl font-heading font-bold mt-10 mb-4">
            {lang === "fr"
              ? "Cabinet individuel ou espace partagé ?"
              : "Individual office or shared space?"}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {lang === "fr"
              ? "Deux modèles existent pour s'installer comme praticien à Bordeaux :"
              : "Two models exist for setting up as a practitioner in Bordeaux:"}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
            <li>{lang === "fr" ? "Le cabinet individuel, souvent plus isolé et plus coûteux en charges" : "The individual office, often more isolated and more costly in charges"}</li>
            <li>{lang === "fr" ? "Les espaces partagés entre plusieurs praticiens" : "Shared spaces between multiple practitioners"}</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-3">
            {lang === "fr"
              ? "Les lieux mutualisés permettent :"
              : "Shared spaces allow you to:"}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-6">
            <li>{lang === "fr" ? "De partager les charges courantes" : "Share running costs"}</li>
            <li>{lang === "fr" ? "De bénéficier d'une salle d'attente commune" : "Benefit from a shared waiting room"}</li>
            <li>{lang === "fr" ? "De travailler dans un environnement professionnel structuré" : "Work in a structured professional environment"}</li>
          </ul>

          {/* Image 2 */}
          <FadeImage
            src={jardinAttenteImage}
            alt={lang === "fr" ? "Salle d'attente dans un lieu de soin I‑CA.RE à Bordeaux" : "Waiting room in an I‑CA.RE care space in Bordeaux"}
            className="w-full rounded-lg mb-10 aspect-[16/10] object-cover"
          />

          {/* Section: Pourquoi un lieu bien conçu */}
          <h2 className="text-2xl font-heading font-bold mt-10 mb-4">
            {lang === "fr"
              ? "Pourquoi un lieu bien conçu change tout"
              : "Why a well-designed space changes everything"}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {lang === "fr"
              ? "Un cabinet de consultation ne doit pas être improvisé. La qualité du lieu influence directement :"
              : "A consultation office should not be improvised. The quality of the space directly influences:"}
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
            <li>{lang === "fr" ? "La relation avec le patient" : "The relationship with the patient"}</li>
            <li>{lang === "fr" ? "Le sentiment de confidentialité" : "The sense of confidentiality"}</li>
            <li>{lang === "fr" ? "Le confort de travail au quotidien" : "Daily working comfort"}</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {lang === "fr"
              ? "Chez I‑CA.RE, les espaces sont pensés spécifiquement pour les praticiens du soin et du bien-être : acoustique maîtrisée, ambiance apaisante, implantation en quartier vivant."
              : "At I‑CA.RE, spaces are designed specifically for care and wellbeing practitioners: controlled acoustics, calming atmosphere, location in vibrant neighbourhoods."}
          </p>

          {/* Conclusion */}
          <h2 className="text-2xl font-heading font-bold mt-10 mb-4">
            {lang === "fr" ? "Conclusion" : "Conclusion"}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {lang === "fr"
              ? "Le coût d'un cabinet à Bordeaux ne doit pas être analysé uniquement à travers son loyer. Il s'agit avant tout de trouver un espace adapté à votre pratique, à votre patientèle et à votre manière d'exercer."
              : "The cost of an office in Bordeaux should not be analysed solely through its rent. It is above all about finding a space suited to your practice, your patients and the way you work."}
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8">
            {lang === "fr"
              ? "Un lieu bien conçu permet de travailler dans de bonnes conditions et de construire une activité stable dans le temps."
              : "A well-designed space allows you to work in good conditions and build a stable practice over time."}
          </p>

          {/* CTA Box */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 sm:p-8 mb-12">
            <h3 className="text-xl font-heading font-bold mb-2">
              {lang === "fr"
                ? "Vous cherchez un cabinet à Bordeaux ?"
                : "Looking for an office in Bordeaux?"}
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {lang === "fr"
                ? "Découvrez les lieux I‑CA.RE et échangeons sur votre projet d'installation."
                : "Discover I‑CA.RE spaces and let's discuss your practice project."}
            </p>
            <Button asChild variant="default" size="lg">
              <Link to={localePath(lang, "locationBordeaux")}>
                {lang === "fr" ? "Échanger sur mon projet" : "Discuss my project"}
              </Link>
            </Button>
          </div>

          {/* Internal links */}
          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              to={localePath(lang, "locationBordeaux")}
              className="text-sm text-primary hover:underline"
            >
              {lang === "fr" ? "Location de cabinet à Bordeaux →" : "Office rental in Bordeaux →"}
            </Link>
            <Link
              to={localePath(lang, "professionals")}
              className="text-sm text-primary hover:underline"
            >
              {lang === "fr" ? "Nos espaces pour les praticiens →" : "Our spaces for practitioners →"}
            </Link>
            <Link
              to={localePath(lang, "projects")}
              className="text-sm text-primary hover:underline"
            >
              {lang === "fr" ? "Nos lieux de soin →" : "Our care spaces →"}
            </Link>
          </div>

          {/* FAQ */}
          <h2 className="text-2xl font-heading font-bold mt-10 mb-4">
            {lang === "fr" ? "Questions fréquentes" : "Frequently asked questions"}
          </h2>

          <Accordion type="single" collapsible className="mb-10">
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent
                  forceMount
                  className="text-muted-foreground leading-relaxed"
                >
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Related insights */}
          <nav className="mt-8 pt-8 border-t border-border">
            <h2 className="text-lg font-heading font-bold mb-4">
              {lang === "fr" ? "Guides pratiques" : "Practical guides"}
            </h2>
            <ul className="space-y-2">
              <li>
                <Link to={localePath(lang, "insightsBudget")} className="text-primary hover:underline">
                  {lang === "fr" ? "Quel budget pour ouvrir un cabinet à Bordeaux ?" : "What budget for opening an office in Bordeaux?"}
                </Link>
              </li>
              <li>
                <Link to={localePath(lang, "insightsSurface")} className="text-primary hover:underline">
                  {lang === "fr" ? "Quelle surface pour un cabinet médical ou paramédical ?" : "What size for a medical or allied health office?"}
                </Link>
              </li>
              <li>
                <Link to={localePath(lang, "insightsProfessions")} className="text-primary hover:underline">
                  {lang === "fr" ? "Quelles professions peuvent partager un cabinet ?" : "Which professions can share an office?"}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </article>
    </Layout>
  );
}
