import { InsightArticleTemplate } from "@/components/InsightArticleTemplate";
import { useTranslation } from "react-i18next";
import peyBerlandCab2 from "@/assets/pey-berland/cab2.webp";

export default function InsightsProfessions() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const relatedGuides =
    lang === "fr"
      ? [
          { routeKey: "insightsSurface", title: "Quelle surface pour un cabinet", description: "De 11 à 18 m² selon votre métier : les fourchettes réalistes." },
          { routeKey: "insightsBudget", title: "Quel budget pour un cabinet à Bordeaux", description: "Loyer, dépôt, travaux : tour d'horizon détaillé des coûts." },
          { routeKey: "insightsCabinetMedical", title: "Trouver un cabinet médical à Bordeaux", description: "Emplacement, surface, normes : guide complet." },
        ]
      : [
          { routeKey: "insightsSurface", title: "What size for an office", description: "From 11 to 18 sqm: realistic ranges by profession." },
          { routeKey: "insightsBudget", title: "What budget for an office in Bordeaux", description: "Rent, deposit, renovations: detailed cost breakdown." },
          { routeKey: "insightsCabinetMedical", title: "Finding a medical office in Bordeaux", description: "Location, size, standards: a complete guide." },
        ];

  const keyFigures =
    lang === "fr"
      ? [
          { label: "Santé mentale", value: "11–13 m²" },
          { label: "Thérapies manuelles", value: "12–18 m²" },
          { label: "Nutrition", value: "11–14 m²" },
          { label: "Rééducation", value: "12–16 m²" },
          { label: "Partage d'un cabinet", value: "2–3 praticiens possibles" },
          { label: "Clé du succès", value: "Complémentarité des services" },
        ]
      : [
          { label: "Mental health", value: "11–13 sqm" },
          { label: "Manual therapies", value: "12–18 sqm" },
          { label: "Nutrition", value: "11–14 sqm" },
          { label: "Rehabilitation", value: "12–16 sqm" },
          { label: "Office sharing", value: "2–3 practitioners possible" },
          { label: "Key to success", value: "Complementary services" },
        ];

  const faq =
    lang === "fr"
      ? [
          { question: "Deux praticiens peuvent-ils partager le même cabinet\u00a0?", answer: "Oui, à condition d'exercer à des horaires différents. Le partage en temps est un modèle courant et économique." },
          { question: "Comment la confidentialité est-elle assurée\u00a0?", answer: "Par l'isolation acoustique, des salles privatives, le décalage des rendez-vous et des limites opérationnelles claires." },
          { question: "Les praticiens du bien-être sont-ils acceptés\u00a0?", answer: "Oui, à condition que leur pratique soit compatible avec un cadre professionnel de santé." },
          { question: "Que se passe-t-il en cas de conflit d'agenda\u00a0?", answer: "Un système de réservation clair et des accords de planning en amont préviennent les conflits." },
          { question: "Peut-on personnaliser un cabinet partagé\u00a0?", answer: "Oui, dans des limites convenues (cadres, petits objets, matériel personnel) en maintenant une esthétique professionnelle cohérente." },
        ]
      : [
          { question: "Can two practitioners share the same office?", answer: "Yes, provided they work at different times. Time-sharing is a common, cost-effective model." },
          { question: "How is patient confidentiality maintained?", answer: "Through acoustic insulation, private rooms, staggered appointments and clear operational boundaries." },
          { question: "Are wellbeing practitioners accepted?", answer: "Yes, provided their practice is compatible with a professional healthcare setting." },
          { question: "What if schedules conflict?", answer: "A clear booking system and upfront scheduling agreements prevent conflicts." },
          { question: "Can I personalise a shared office?", answer: "Personal touches are welcome within agreed limits, maintaining a coherent professional aesthetic." },
        ];

  if (lang === "en") {
    return (
      <InsightArticleTemplate
        title="Which professions can share a care office | I‑CA.RE"
        description="Psychologists, osteopaths, dietitians, sophrologists, naturopaths and more: which care and wellbeing professions work best in shared offices of 11 to 18 sqm."
        path="/en/insights/professions-sharing-office"
        heroImage={peyBerlandCab2}
        heroImageAlt="Professional shared consultation space – I-CA.RE Bordeaux"
        articleTitle="Which professions can share an office or care space"
        intro="Sharing an office between care and wellbeing practitioners is an efficient, increasingly popular model. But not all professions are equally suited. Success depends on complementarity of services, compatibility of schedules and respect for confidentiality."
        takeaways={[
          "Successful sharing relies on complementarity, not competition",
          "Diverse schedules maximise occupancy and reduce costs",
          "Patient confidentiality must be built into the design",
          "Shared waiting areas and facilities improve the overall experience",
          "Offices of 11 to 18 sqm work well for most consultation-based professions",
          "The atmosphere of the space matters, calm and professional benefits all",
        ]}
        toc={[
          { id: "compatibility", label: "What makes professions compatible" },
          { id: "schedules", label: "Schedule compatibility: a key factor" },
          { id: "confidentiality", label: "Confidentiality: non-negotiable" },
          { id: "atmosphere", label: "The atmosphere of the space" },
          { id: "common-areas", label: "Shared areas: the quality multiplier" },
          { id: "professions-list", label: "Professions suited to 11–18 sqm offices" },
          { id: "mistakes", label: "Common mistakes to avoid" },
        ]}
        keyFigures={keyFigures}
        faq={faq}
        ctaPrimaryRoute="locationBordeaux"
        ctaPrimaryLabel="Find an office"
        ctaSecondaryRoute="contact"
        ctaSecondaryLabel="Get in touch"
        relatedGuides={relatedGuides}
      >
        <section id="compatibility">
          <h2 className="text-xl font-heading font-bold mb-3">What makes professions compatible in a shared space</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">The best shared spaces bring together complementary practitioners, psychologist alongside osteopath, dietitian near naturopath. Three criteria matter:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li><strong>Complementarity:</strong> services that complement, not duplicate</li>
            <li><strong>Schedule diversity:</strong> different peak hours for better utilisation</li>
            <li><strong>Shared values:</strong> a common standard of professionalism</li>
          </ul>
        </section>

        <section id="schedules">
          <h2 className="text-xl font-heading font-bold mb-3">Schedule compatibility: a key factor</h2>
          <p className="text-muted-foreground leading-relaxed">Different professions have different peak periods. This natural diversity means the space is well used throughout the week. A single office can serve two or three practitioners on different schedules.</p>
        </section>

        <section id="confidentiality">
          <h2 className="text-xl font-heading font-bold mb-3">Confidentiality: a non-negotiable requirement</h2>
          <p className="text-muted-foreground leading-relaxed">Effective acoustic insulation between offices, discreet waiting areas, staggered appointments, and clear physical boundaries. A well-designed space addresses these needs structurally.</p>
        </section>

        <section id="atmosphere">
          <h2 className="text-xl font-heading font-bold mb-3">The atmosphere of the space</h2>
          <p className="text-muted-foreground leading-relaxed">A calm, professional atmosphere is a shared asset. Quality finishes, a clean waiting area, appropriate lighting, this standard is easier to achieve collectively.</p>
        </section>

        <section id="common-areas">
          <h2 className="text-xl font-heading font-bold mb-3">Shared areas: the quality multiplier</h2>
          <p className="text-muted-foreground leading-relaxed">A well-maintained waiting room, accessible facilities and quality signage enhance every practitioner's image. Shared areas also reduce administrative burden.</p>
        </section>

        <section id="professions-list">
          <h2 className="text-xl font-heading font-bold mb-3">Professions well suited to shared offices of 11 to 18 sqm</h2>
          <h3 className="text-base font-heading font-semibold mt-5 mb-2">Mental health and talking therapies</h3>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-4">
            <li>Psychologists and psychotherapists (11–13 sqm)</li>
            <li>Sexologists (11–13 sqm)</li>
            <li>Counsellors and mediators (11–13 sqm)</li>
          </ul>
          <h3 className="text-base font-heading font-semibold mt-5 mb-2">Manual and body-based therapies</h3>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-4">
            <li>Osteopaths (14–18 sqm)</li>
            <li>Sophrologists (11–14 sqm)</li>
            <li>Reflexologists (12–15 sqm)</li>
          </ul>
          <h3 className="text-base font-heading font-semibold mt-5 mb-2">Nutrition and lifestyle</h3>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-4">
            <li>Dietitians and nutritionists (11–14 sqm)</li>
            <li>Naturopaths (11–14 sqm)</li>
          </ul>
          <h3 className="text-base font-heading font-semibold mt-5 mb-2">Rehabilitation and development</h3>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-4">
            <li>Speech therapists (12–16 sqm)</li>
            <li>Occupational therapists (13–16 sqm)</li>
            <li>Psychomotor therapists (13–16 sqm)</li>
          </ul>
          <p className="text-xs text-muted-foreground italic">Note: professions requiring very large areas or heavy equipment are generally not suited to this model.</p>
        </section>

        <section id="mistakes">
          <h2 className="text-xl font-heading font-bold mb-3">Common mistakes to avoid</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Sharing with a directly competing practitioner</li>
            <li>Neglecting acoustic insulation, confidentiality failures damage trust</li>
            <li>Assuming schedules will align without explicit agreements</li>
            <li>Ignoring the overall atmosphere and quality standards</li>
            <li>Joining without clear rules on cleaning, maintenance and bookings</li>
          </ul>
        </section>
      </InsightArticleTemplate>
    );
  }

  return (
    <InsightArticleTemplate
      title="Quelles professions peuvent partager un cabinet | I‑CA.RE"
      description="Psychologues, ostéopathes, diététiciens, sophrologues, naturopathes… Complémentarité, rythmes et confidentialité dans des cabinets partagés de 11 à 18 m²."
      path="/insights/professions-partage-cabinet"
      heroImage={peyBerlandCab2}
      heroImageAlt="Espace de consultation partagé professionnel – I-CA.RE Bordeaux"
      articleTitle="Quelles professions peuvent partager un cabinet ou un espace de soins"
      intro={<>Le partage de cabinet entre praticiens du soin et du bien-être est un modèle efficace et de plus en plus courant. Mais toutes les professions ne s'y prêtent pas de la même façon. Le succès repose sur la complémentarité des services, la compatibilité des rythmes et le respect de la confidentialité.</>}
      takeaways={[
        "Un bon partage repose sur la complémentarité, pas la concurrence",
        "Des rythmes variés maximisent l'occupation et réduisent les coûts",
        "La confidentialité du patient doit être intégrée dès la conception",
        "Les espaces d'attente et sanitaires partagés améliorent l'expérience",
        "Des cabinets de 11 à 18\u00a0m² conviennent à la plupart des consultations",
        "L'ambiance du lieu compte, un environnement calme profite à tous",
      ]}
      toc={[
        { id: "compatibilite", label: "Qu'est-ce qui rend des professions compatibles" },
        { id: "rythmes", label: "La compatibilité des rythmes" },
        { id: "confidentialite", label: "La confidentialité : une exigence non négociable" },
        { id: "ambiance", label: "L'ambiance du lieu" },
        { id: "parties-communes", label: "Les parties communes : le multiplicateur de qualité" },
        { id: "liste-professions", label: "Professions compatibles avec des cabinets de 11 à 18 m²" },
        { id: "erreurs", label: "Les erreurs fréquentes à éviter" },
      ]}
      keyFigures={keyFigures}
      faq={faq}
      ctaPrimaryRoute="locationBordeaux"
      ctaPrimaryLabel="Trouver un cabinet"
      ctaSecondaryRoute="contact"
      ctaSecondaryLabel="Nous contacter"
      relatedGuides={relatedGuides}
    >
      <section id="compatibilite">
        <h2 className="text-xl font-heading font-bold mb-3">Qu'est-ce qui rend des professions compatibles en espace partagé</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les espaces les plus réussis réunissent des praticiens complémentaires, psychologue aux côtés d'un ostéopathe, diététicien près d'un naturopathe. Trois critères&nbsp;:</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li><strong>Complémentarité&nbsp;:</strong> services qui se complètent plutôt que se dupliquent</li>
          <li><strong>Diversité des rythmes&nbsp;:</strong> pics d'activité différents</li>
          <li><strong>Valeurs partagées&nbsp;:</strong> professionnalisme, discrétion et respect</li>
        </ul>
      </section>

      <section id="rythmes">
        <h2 className="text-xl font-heading font-bold mb-3">La compatibilité des rythmes&nbsp;: un facteur clé</h2>
        <p className="text-muted-foreground leading-relaxed">Les différentes professions ont des pics d'activité distincts. Cette diversité assure une bonne utilisation du lieu. Un même cabinet peut servir à deux voire trois praticiens sur des créneaux différents.</p>
      </section>

      <section id="confidentialite">
        <h2 className="text-xl font-heading font-bold mb-3">La confidentialité&nbsp;: une exigence non négociable</h2>
        <p className="text-muted-foreground leading-relaxed">Isolation acoustique efficace, espaces d'attente discrets, décalage des rendez-vous, limites physiques claires. Un espace bien conçu intègre ces protections structurellement.</p>
      </section>

      <section id="ambiance">
        <h2 className="text-xl font-heading font-bold mb-3">L'ambiance du lieu</h2>
        <p className="text-muted-foreground leading-relaxed">Une atmosphère calme et professionnelle profite à tous. Finitions de qualité, salle d'attente accueillante, éclairage approprié, ce standard est plus facile à atteindre collectivement.</p>
      </section>

      <section id="parties-communes">
        <h2 className="text-xl font-heading font-bold mb-3">Les parties communes&nbsp;: le multiplicateur de qualité</h2>
        <p className="text-muted-foreground leading-relaxed">Salle d'attente entretenue, sanitaires accessibles, entrée professionnelle et signalétique de qualité renforcent l'image de chaque praticien. Les parties communes allègent aussi la charge administrative.</p>
      </section>

      <section id="liste-professions">
        <h2 className="text-xl font-heading font-bold mb-3">Professions compatibles avec des cabinets de 11 à 18&nbsp;m²</h2>
        <h3 className="text-base font-heading font-semibold mt-5 mb-2">Santé mentale et thérapies par la parole</h3>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-4">
          <li>Psychologues et psychothérapeutes (11–13&nbsp;m²)</li>
          <li>Sexologues (11–13&nbsp;m²)</li>
          <li>Conseillers et médiateurs (11–13&nbsp;m²)</li>
        </ul>
        <h3 className="text-base font-heading font-semibold mt-5 mb-2">Thérapies manuelles et corporelles</h3>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-4">
          <li>Ostéopathes (14–18&nbsp;m²)</li>
          <li>Sophrologues (11–14&nbsp;m²)</li>
          <li>Réflexologues et thérapeutes manuels (12–15&nbsp;m²)</li>
        </ul>
        <h3 className="text-base font-heading font-semibold mt-5 mb-2">Nutrition et hygiène de vie</h3>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-4">
          <li>Diététiciens et nutritionnistes (11–14&nbsp;m²)</li>
          <li>Naturopathes (11–14&nbsp;m²)</li>
        </ul>
        <h3 className="text-base font-heading font-semibold mt-5 mb-2">Rééducation et développement</h3>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-4">
          <li>Orthophonistes (12–16&nbsp;m²)</li>
          <li>Ergothérapeutes (13–16&nbsp;m²)</li>
          <li>Psychomotriciens (13–16&nbsp;m²)</li>
        </ul>
        <p className="text-xs text-muted-foreground italic">Note&nbsp;: les professions nécessitant de très grands espaces ou des équipements lourds ne sont généralement pas adaptées à ce modèle.</p>
      </section>

      <section id="erreurs">
        <h2 className="text-xl font-heading font-bold mb-3">Les erreurs fréquentes à éviter</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Partager avec un praticien dont les services concurrencent les vôtres</li>
          <li>Négliger l'isolation acoustique, la confidentialité est non négociable</li>
          <li>Supposer que les plannings s'harmoniseront sans accord explicite</li>
          <li>Ignorer l'ambiance générale et le niveau de qualité</li>
          <li>Rejoindre un espace sans règles claires sur le ménage et les réservations</li>
        </ul>
      </section>
    </InsightArticleTemplate>
  );
}
