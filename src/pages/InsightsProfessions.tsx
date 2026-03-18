import { InsightLayout } from "@/components/InsightLayout";
import { useTranslation } from "react-i18next";

export default function InsightsProfessions() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const relatedLinks = [
    { routeKey: "insightsSurface", labelFr: "Quelle surface pour un cabinet", labelEn: "What size for an office" },
    { routeKey: "insightsBudget", labelFr: "Quel budget pour un cabinet à Bordeaux", labelEn: "What budget for an office in Bordeaux" },
    { routeKey: "insightsCabinetMedical", labelFr: "Trouver un cabinet médical à Bordeaux", labelEn: "Finding a medical office in Bordeaux" },
  ];

  if (lang === "en") {
    return (
      <InsightLayout
        title="Which professions can share a care office | I‑CA.RE"
        description="Psychologists, osteopaths, dietitians, sophrologists, naturopaths and more: which care and wellbeing professions work best in shared offices of 11 to 18 sqm."
        path="/en/insights/professions-sharing-office"
        relatedLinks={relatedLinks}
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">Which professions can share an office or care space</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">Sharing an office between care and wellbeing practitioners is an efficient, increasingly popular model. But not all professions are equally suited. Success depends on complementarity of services, compatibility of schedules and respect for patient / client confidentiality. Understanding which professions work well together — and why — helps you choose the right shared space for your practice.</p>

        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold mb-4">Key takeaways</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Successful sharing relies on complementarity of services, not competition</li>
            <li>Diverse schedules maximise occupancy and reduce costs for everyone</li>
            <li>Patient / client confidentiality must be built into the design of the space</li>
            <li>Shared waiting areas and facilities improve the overall experience</li>
            <li>Offices of 11 to 18 sqm work well for most consultation-based professions</li>
            <li>The atmosphere of the space matters — a calm, professional environment benefits all occupants</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">What makes professions compatible in a shared space</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">The best shared care spaces bring together practitioners whose services complement each other without competing. A psychologist alongside an osteopath, a dietitian near a naturopath, a sophrologist near a psychomotor therapist — these combinations create natural referral pathways and enrich the offering for patients / clients.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">Three key criteria determine compatibility:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
            <li><strong>Complementarity:</strong> services that complement rather than duplicate each other</li>
            <li><strong>Schedule diversity:</strong> different peak hours allow better space utilisation</li>
            <li><strong>Shared values:</strong> a common standard of professionalism, discretion and respect</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Schedule compatibility: a key factor</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Different professions often have different peak periods. Some practitioners see patients mainly in the morning, others in the evening. Some work Saturdays, others only weekdays. This natural diversity means the space is well used throughout the week, optimising costs for everyone.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">In a well-balanced shared space, a single office can serve two or even three practitioners on different schedules — multiplying the value of the space without any compromise on quality.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Confidentiality: a non-negotiable requirement</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Patient / client confidentiality must be absolute. This means effective acoustic insulation between offices, discreet waiting areas, staggered appointment times to avoid overlap, and clear physical boundaries between practitioners' spaces.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">A well-designed shared space addresses these needs structurally — through construction quality, layout choices and operational rules — rather than leaving them to individual practitioners to manage.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">The atmosphere of the space</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A calm, professional atmosphere is a shared asset. All occupants benefit from a coherent environment — quality finishes, a clean welcoming waiting area, a professional entrance, appropriate lighting and temperature. This standard is much easier to achieve and maintain collectively than individually.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">The ambiance of the space directly affects patient / client trust and comfort. Practices associated with care, wellbeing and health all benefit from an environment that communicates seriousness, warmth and attention to detail.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Shared areas: the quality multiplier</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A well-maintained waiting room, accessible facilities, a professional entrance and quality signage enhance every practitioner's image. These elements are often hard to justify for a single practitioner but become viable — and genuinely valuable — when shared.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">Shared areas also reduce administrative burden: cleaning, maintenance, waste management and building insurance are handled collectively.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Professions well suited to shared offices of 11 to 18 sqm</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">The following professions are well suited to shared offices in the 11 to 18 sqm range with access to quality common areas:</p>

          <h3 className="text-lg font-heading font-semibold mt-6 mb-2">Mental health and talking therapies</h3>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-4">
            <li>Psychologists and psychotherapists (11–13 sqm)</li>
            <li>Sexologists (11–13 sqm)</li>
            <li>Counsellors and mediators (11–13 sqm)</li>
          </ul>

          <h3 className="text-lg font-heading font-semibold mt-6 mb-2">Manual and body-based therapies</h3>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-4">
            <li>Osteopaths (14–18 sqm)</li>
            <li>Sophrologists (11–14 sqm)</li>
            <li>Reflexologists and manual therapists (12–15 sqm)</li>
          </ul>

          <h3 className="text-lg font-heading font-semibold mt-6 mb-2">Nutrition and lifestyle</h3>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-4">
            <li>Dietitians and nutritionists (11–14 sqm)</li>
            <li>Naturopaths (11–14 sqm)</li>
          </ul>

          <h3 className="text-lg font-heading font-semibold mt-6 mb-2">Rehabilitation and development</h3>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-4">
            <li>Speech therapists (12–16 sqm)</li>
            <li>Occupational therapists (13–16 sqm)</li>
            <li>Psychomotor therapists (13–16 sqm)</li>
          </ul>

          <h3 className="text-lg font-heading font-semibold mt-6 mb-2">Other compatible professions</h3>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-4">
            <li>Specialist nurses — depending on practice type (12–15 sqm)</li>
            <li>Wellbeing practitioners compatible with a professional healthcare setting (11–14 sqm)</li>
          </ul>

          <p className="text-sm text-muted-foreground italic">Note: professions requiring very large floor areas, heavy equipment or high patient throughput (such as physiotherapy) are generally not suited to this model of shared offices of 11 to 18 sqm.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Common mistakes to avoid</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Sharing with a practitioner whose services directly compete with yours</li>
            <li>Neglecting acoustic insulation — confidentiality failures damage trust</li>
            <li>Assuming schedules will align without explicit agreements</li>
            <li>Ignoring the overall atmosphere and quality standards of the space</li>
            <li>Joining a shared space without clear rules on cleaning, maintenance and bookings</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Frequently asked questions</h2>
          <div className="space-y-6">
            <div><p className="font-semibold mb-1">Can two practitioners share the same office?</p><p className="text-muted-foreground leading-relaxed">Yes, provided they work at different times. Time-sharing a single office is a common, cost-effective model that maximises space utilisation — one practitioner uses mornings, another afternoons, for example.</p></div>
            <div><p className="font-semibold mb-1">How is patient confidentiality maintained?</p><p className="text-muted-foreground leading-relaxed">Through acoustic insulation between offices, private consultation rooms, staggered appointment times and clear operational boundaries. A well-designed space integrates these protections structurally.</p></div>
            <div><p className="font-semibold mb-1">Are wellbeing practitioners accepted in healthcare spaces?</p><p className="text-muted-foreground leading-relaxed">Yes, provided their practice is compatible with a professional healthcare setting. The criteria are seriousness, discretion, respect for the shared environment and alignment with the overall quality standard of the space.</p></div>
            <div><p className="font-semibold mb-1">What if schedules conflict?</p><p className="text-muted-foreground leading-relaxed">A clear booking system and upfront scheduling agreements prevent conflicts. Most well-managed shared spaces provide a digital booking tool and clear rules for scheduling.</p></div>
            <div><p className="font-semibold mb-1">Can I personalise a shared office?</p><p className="text-muted-foreground leading-relaxed">Personal touches are generally welcome within agreed limits — artwork, small items, personal equipment. The key is maintaining a coherent, professional aesthetic across the space.</p></div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
          <p className="text-muted-foreground leading-relaxed">Sharing a care space works best when professions complement each other, schedules align and confidentiality is built into the design. For practitioners working in offices of 11 to 18 sqm with access to quality common areas, it offers significant advantages in cost, patient experience and professional environment.</p>
        </section>
      </InsightLayout>
    );
  }

  return (
    <InsightLayout
      title="Quelles professions peuvent partager un cabinet | I‑CA.RE"
      description="Psychologues, ostéopathes, diététiciens, sophrologues, naturopathes… Complémentarité, rythmes et confidentialité dans des cabinets partagés de 11 à 18 m²."
      path="/insights/professions-partage-cabinet"
      relatedLinks={relatedLinks}
    >
      <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">Quelles professions peuvent partager un cabinet ou un espace de soins</h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-4">Le partage de cabinet entre praticiens du soin et du bien-être est un modèle efficace et de plus en plus courant. Mais toutes les professions ne s'y prêtent pas de la même façon. Le succès repose sur la complémentarité des services, la compatibilité des rythmes et le respect de la confidentialité. Comprendre quelles professions fonctionnent bien ensemble — et pourquoi — aide à choisir le bon espace partagé.</p>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold mb-4">Ce qu'il faut retenir</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Un bon partage repose sur la complémentarité des services, pas sur la concurrence</li>
          <li>Des rythmes variés maximisent l'occupation et réduisent les coûts pour tous</li>
          <li>La confidentialité du patient / client doit être intégrée dès la conception du lieu</li>
          <li>Les espaces d'attente et sanitaires partagés améliorent l'expérience globale</li>
          <li>Des cabinets de 11 à 18&nbsp;m² conviennent à la plupart des exercices en consultation</li>
          <li>L'ambiance du lieu compte — un environnement calme et professionnel profite à tous les occupants</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Qu'est-ce qui rend des professions compatibles en espace partagé</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les espaces de soins mutualisés les plus réussis réunissent des praticiens dont les services se complètent sans se concurrencer. Un psychologue aux côtés d'un ostéopathe, un diététicien près d'un naturopathe, un sophrologue près d'un psychomotricien — ces combinaisons créent des parcours d'adressage naturels et enrichissent l'offre pour les patient / clients.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Trois critères déterminent la compatibilité&nbsp;:</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
          <li><strong>Complémentarité&nbsp;:</strong> des services qui se complètent plutôt que se dupliquent</li>
          <li><strong>Diversité des rythmes&nbsp;:</strong> des pics d'activité différents permettent une meilleure utilisation du lieu</li>
          <li><strong>Valeurs partagées&nbsp;:</strong> un standard commun de professionnalisme, de discrétion et de respect</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">La compatibilité des rythmes&nbsp;: un facteur clé</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les différentes professions ont souvent des pics d'activité distincts. Certains praticiens reçoivent principalement le matin, d'autres le soir. Certains travaillent le samedi, d'autres uniquement en semaine. Cette diversité naturelle assure une bonne utilisation du lieu tout au long de la semaine, optimisant les coûts pour chacun.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Dans un espace bien équilibré, un même cabinet peut servir à deux voire trois praticiens sur des créneaux différents — multipliant la valeur du lieu sans aucun compromis sur la qualité.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">La confidentialité&nbsp;: une exigence non négociable</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">La confidentialité du patient / client doit être absolue. Cela passe par une isolation acoustique efficace entre cabinets, des espaces d'attente discrets, un décalage des rendez-vous pour éviter les croisements, et des limites physiques claires entre les espaces de chaque praticien.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Un espace bien conçu intègre ces protections structurellement — par la qualité de construction, les choix d'agencement et les règles de fonctionnement — plutôt que de laisser chaque praticien les gérer individuellement.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">L'ambiance du lieu</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Une atmosphère calme et professionnelle est un bien partagé. Tous les occupants bénéficient d'un environnement cohérent — finitions de qualité, salle d'attente accueillante et propre, entrée professionnelle, éclairage et température appropriés. Ce standard est bien plus facile à atteindre et à maintenir collectivement qu'individuellement.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">L'ambiance du lieu influence directement la confiance et le confort du patient / client. Les pratiques liées au soin, au bien-être et à la santé bénéficient toutes d'un environnement qui communique sérieux, chaleur et attention au détail.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les parties communes&nbsp;: le multiplicateur de qualité</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Une salle d'attente entretenue, des sanitaires accessibles, une entrée professionnelle et une signalétique de qualité renforcent l'image de chaque praticien. Ces éléments sont souvent difficiles à justifier seul mais deviennent viables — et réellement précieux — en mutualisé.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Les parties communes allègent aussi la charge administrative&nbsp;: ménage, entretien, gestion des déchets et assurance du bâtiment sont gérés collectivement.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Professions compatibles avec des cabinets de 11 à 18&nbsp;m²</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les professions suivantes sont bien adaptées à un exercice en cabinet partagé de 11 à 18&nbsp;m² avec accès à des parties communes de qualité&nbsp;:</p>

        <h3 className="text-lg font-heading font-semibold mt-6 mb-2">Santé mentale et thérapies par la parole</h3>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-4">
          <li>Psychologues et psychothérapeutes (11–13&nbsp;m²)</li>
          <li>Sexologues (11–13&nbsp;m²)</li>
          <li>Conseillers et médiateurs (11–13&nbsp;m²)</li>
        </ul>

        <h3 className="text-lg font-heading font-semibold mt-6 mb-2">Thérapies manuelles et corporelles</h3>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-4">
          <li>Ostéopathes (14–18&nbsp;m²)</li>
          <li>Sophrologues (11–14&nbsp;m²)</li>
          <li>Réflexologues et thérapeutes manuels (12–15&nbsp;m²)</li>
        </ul>

        <h3 className="text-lg font-heading font-semibold mt-6 mb-2">Nutrition et hygiène de vie</h3>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-4">
          <li>Diététiciens et nutritionnistes (11–14&nbsp;m²)</li>
          <li>Naturopathes (11–14&nbsp;m²)</li>
        </ul>

        <h3 className="text-lg font-heading font-semibold mt-6 mb-2">Rééducation et développement</h3>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-4">
          <li>Orthophonistes (12–16&nbsp;m²)</li>
          <li>Ergothérapeutes (13–16&nbsp;m²)</li>
          <li>Psychomotriciens (13–16&nbsp;m²)</li>
        </ul>

        <h3 className="text-lg font-heading font-semibold mt-6 mb-2">Autres professions compatibles</h3>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-4">
          <li>Infirmiers spécialisés — selon le type d'exercice (12–15&nbsp;m²)</li>
          <li>Praticiens du bien-être compatibles avec un cadre professionnel de santé (11–14&nbsp;m²)</li>
        </ul>

        <p className="text-sm text-muted-foreground italic">Note&nbsp;: les professions nécessitant de très grands espaces, des équipements lourds ou un flux important de patient / clients (comme la kinésithérapie) ne sont généralement pas adaptées à ce modèle de cabinets de 11 à 18&nbsp;m².</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les erreurs fréquentes à éviter</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Partager avec un praticien dont les services concurrencent directement les vôtres</li>
          <li>Négliger l'isolation acoustique — les manquements à la confidentialité détruisent la confiance</li>
          <li>Supposer que les plannings s'harmoniseront sans accord explicite</li>
          <li>Ignorer l'ambiance générale et le niveau de qualité de l'espace</li>
          <li>Rejoindre un espace partagé sans règles claires sur le ménage, l'entretien et les réservations</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Questions fréquentes</h2>
        <div className="space-y-6">
          <div><p className="font-semibold mb-1">Deux praticiens peuvent-ils partager le même cabinet&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Oui, à condition d'exercer à des horaires différents. Le partage en temps d'un même cabinet est un modèle courant et économique — un praticien le matin, un autre l'après-midi, par exemple.</p></div>
          <div><p className="font-semibold mb-1">Comment la confidentialité est-elle assurée&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Par l'isolation acoustique entre cabinets, des salles de consultation privatives, le décalage des rendez-vous et des limites opérationnelles claires. Un espace bien conçu intègre ces protections structurellement.</p></div>
          <div><p className="font-semibold mb-1">Les praticiens du bien-être sont-ils acceptés dans les espaces de santé&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Oui, à condition que leur pratique soit compatible avec un cadre professionnel de santé. Les critères sont le sérieux, la discrétion, le respect de l'environnement partagé et l'alignement avec le standard de qualité du lieu.</p></div>
          <div><p className="font-semibold mb-1">Que se passe-t-il en cas de conflit d'agenda&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Un système de réservation clair et des accords de planning en amont préviennent les conflits. La plupart des espaces bien gérés proposent un outil de réservation numérique et des règles claires.</p></div>
          <div><p className="font-semibold mb-1">Peut-on personnaliser un cabinet partagé&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Les touches personnelles sont généralement bienvenues dans des limites convenues — cadres, petits objets, matériel personnel. L'essentiel est de maintenir une esthétique professionnelle cohérente dans l'ensemble de l'espace.</p></div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
        <p className="text-muted-foreground leading-relaxed">Le partage d'un espace de soins fonctionne au mieux lorsque les professions se complètent, les rythmes s'harmonisent et la confidentialité est intégrée dès la conception. Pour les praticiens exerçant dans des cabinets de 11 à 18&nbsp;m² avec accès à des parties communes de qualité, ce modèle offre des avantages significatifs en termes de coût, d'expérience patient / client et d'environnement professionnel.</p>
      </section>
    </InsightLayout>
  );
}
