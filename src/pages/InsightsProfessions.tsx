import { InsightLayout } from "@/components/InsightLayout";
import { useTranslation } from "react-i18next";

export default function InsightsProfessions() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const relatedLinks = [
    { routeKey: "insightsCabinetMedical", labelFr: "Trouver un cabinet médical à Bordeaux", labelEn: "Finding a medical office in Bordeaux" },
    { routeKey: "insightsSurface", labelFr: "Quelle surface pour un cabinet", labelEn: "What size for an office" },
    { routeKey: "insightsLouerAcheter", labelFr: "Louer ou acheter son cabinet", labelEn: "Rent or buy your office" },
  ];

  if (lang === "en") {
    return (
      <InsightLayout
        title="Which professions can share a care office | I‑CA.RE"
        description="Complementarity, schedules, confidentiality: which care, allied health and wellbeing professions are compatible with shared offices of 11 to 18 sqm."
        path="/en/insights/professions-sharing-office"
        relatedLinks={relatedLinks}
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">Which professions can share an office or care space</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">Sharing an office between practitioners is an efficient and increasingly popular model. But not all professions are equally suited. The key is complementarity, schedule compatibility and respect for patient confidentiality.</p>

        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold mb-4">Key takeaways</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Successful sharing relies on complementarity, not competition</li>
            <li>Compatible schedules maximise occupancy and reduce costs</li>
            <li>Confidentiality must be maintained at all times</li>
            <li>Shared waiting areas and facilities improve the patient experience</li>
            <li>Offices of 11 to 18 sqm work well for most seated-practice professions</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">The logic of complementarity</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">The most successful shared spaces bring together practitioners whose services complement each other — a psychologist alongside an osteopath, a dietitian near a naturopath. This creates natural referral pathways and enriches the patient offering without direct competition.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Schedule compatibility</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Different professions often have different peak hours. Some practitioners work mornings, others evenings; some work weekends. Diverse schedules ensure the space is well used throughout the week, optimising costs for everyone.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Confidentiality considerations</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Patient confidentiality is non-negotiable. Sound insulation between offices, discreet waiting areas and clear boundaries between practitioners' spaces are essential. A well-designed shared space addresses these needs structurally.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">The atmosphere of the space</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A calm, professional atmosphere is a shared concern. All occupants benefit from a coherent environment — quality finishes, a clean waiting area, a professional entrance. This is easier to achieve collectively than individually.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Shared areas</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A well-maintained waiting room, accessible facilities and a shared entrance enhance the overall quality. These elements are often hard to justify for a single practitioner but become viable — and valuable — in a shared setting.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Professions compatible with 11–18 sqm shared offices</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">The following professions are well suited to shared offices in the 11 to 18 sqm range with access to common areas:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground leading-relaxed">
            <li>Psychologists and psychotherapists</li>
            <li>Osteopaths</li>
            <li>Sophrologists</li>
            <li>Dietitians and nutritionists</li>
            <li>Speech therapists</li>
            <li>Occupational therapists</li>
            <li>Psychomotor therapists</li>
            <li>Sexologists</li>
            <li>Naturopaths</li>
            <li>Specialist nurses (depending on practice type)</li>
            <li>Wellbeing practitioners compatible with a professional healthcare setting</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2 italic">Note: professions requiring large floor areas or heavy equipment (such as physiotherapy) are generally not suited to this model.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Frequently asked questions</h2>
          <div className="space-y-6">
            <div><p className="font-semibold mb-1">Can two practitioners share the same office?</p><p className="text-muted-foreground leading-relaxed">Yes, provided they work at different times. This is a common and effective model that maximises space utilisation.</p></div>
            <div><p className="font-semibold mb-1">How is confidentiality maintained?</p><p className="text-muted-foreground leading-relaxed">Acoustic insulation, private offices and staggered appointment times ensure patient privacy even in a shared environment.</p></div>
            <div><p className="font-semibold mb-1">Are wellbeing practitioners accepted?</p><p className="text-muted-foreground leading-relaxed">Yes, provided their practice is compatible with a professional healthcare setting — seriousness, discretion and respect for the shared environment are key.</p></div>
            <div><p className="font-semibold mb-1">What happens if schedules conflict?</p><p className="text-muted-foreground leading-relaxed">A clear booking system and upfront scheduling agreements prevent conflicts. Most shared spaces provide a digital booking tool.</p></div>
            <div><p className="font-semibold mb-1">Can I personalise a shared office?</p><p className="text-muted-foreground leading-relaxed">Personal touches are usually welcome within agreed limits — artwork, small furniture items, personal equipment. The key is maintaining a coherent overall aesthetic.</p></div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
          <p className="text-muted-foreground leading-relaxed">Sharing a care space works best when professions complement each other, schedules align and confidentiality is built into the design. For practitioners working in offices of 11 to 18 sqm, it offers significant advantages in cost, quality and patient experience.</p>
        </section>
      </InsightLayout>
    );
  }

  return (
    <InsightLayout
      title="Quelles professions peuvent partager un cabinet | I‑CA.RE"
      description="Complémentarité, rythmes, confidentialité : les professions du soin, du paramédical et du bien-être compatibles avec des cabinets partagés de 11 à 18 m²."
      path="/insights/professions-partage-cabinet"
      relatedLinks={relatedLinks}
    >
      <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">Quelles professions peuvent partager un cabinet ou un espace de soins</h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-4">Le partage de cabinet entre praticiens est un modèle efficace et de plus en plus courant. Mais toutes les professions ne s'y prêtent pas de la même façon. L'essentiel est la complémentarité, la compatibilité des rythmes et le respect de la confidentialité.</p>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold mb-4">Ce qu'il faut retenir</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Un bon partage repose sur la complémentarité, pas sur la concurrence</li>
          <li>Des rythmes compatibles maximisent l'occupation et réduisent les coûts</li>
          <li>La confidentialité doit être assurée en permanence</li>
          <li>Les espaces d'attente et sanitaires partagés améliorent l'expérience du patient / client</li>
          <li>Des cabinets de 11 à 18&nbsp;m² conviennent à la plupart des exercices en consultation</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">La logique de complémentarité</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les lieux mutualisés les plus réussis réunissent des praticiens dont les services se complètent — un psychologue aux côtés d'un ostéopathe, un diététicien près d'un naturopathe. Cela crée des parcours d'adressage naturels et enrichit l'offre de soins sans concurrence directe.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Compatibilité des rythmes</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les différentes professions ont souvent des pics d'activité distincts. Certains praticiens exercent le matin, d'autres le soir&nbsp;; certains travaillent le week-end. Des rythmes variés permettent une bonne utilisation de l'espace toute la semaine, optimisant les coûts pour tous.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Confidentialité</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">La confidentialité du patient / client est non négociable. L'isolation acoustique entre cabinets, des salles d'attente discrètes et des limites claires entre les espaces de chaque praticien sont essentielles. Un lieu bien conçu intègre ces besoins structurellement.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">L'ambiance du lieu</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Une atmosphère calme et professionnelle est un enjeu partagé. Tous les occupants bénéficient d'un environnement cohérent — finitions de qualité, salle d'attente propre, entrée professionnelle. C'est plus facile à atteindre collectivement qu'individuellement.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les parties communes</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Une salle d'attente entretenue, des sanitaires accessibles et une entrée partagée renforcent la qualité globale. Ces éléments sont souvent difficiles à justifier pour un praticien seul mais deviennent viables — et précieux — dans un cadre mutualisé.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Professions compatibles avec des cabinets de 11 à 18&nbsp;m²</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les professions suivantes sont bien adaptées à un exercice en cabinet partagé de 11 à 18&nbsp;m² avec accès à des parties communes&nbsp;:</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground leading-relaxed">
          <li>Psychologues et psychothérapeutes</li>
          <li>Ostéopathes</li>
          <li>Sophrologues</li>
          <li>Diététiciens et nutritionnistes</li>
          <li>Orthophonistes</li>
          <li>Ergothérapeutes</li>
          <li>Psychomotriciens</li>
          <li>Sexologues</li>
          <li>Naturopathes</li>
          <li>Infirmiers spécialisés (selon le type d'exercice)</li>
          <li>Praticiens du bien-être compatibles avec un cadre professionnel de santé</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-2 italic">Note&nbsp;: les professions nécessitant de grands espaces ou des équipements lourds (comme la kinésithérapie) ne sont généralement pas adaptées à ce modèle.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Questions fréquentes</h2>
        <div className="space-y-6">
          <div><p className="font-semibold mb-1">Deux praticiens peuvent-ils partager le même cabinet&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Oui, à condition d'exercer à des horaires différents. C'est un modèle courant et efficace qui maximise l'utilisation de l'espace.</p></div>
          <div><p className="font-semibold mb-1">Comment la confidentialité est-elle assurée&nbsp;?</p><p className="text-muted-foreground leading-relaxed">L'isolation acoustique, des cabinets privatifs et le décalage des rendez-vous garantissent la discrétion, même dans un environnement partagé.</p></div>
          <div><p className="font-semibold mb-1">Les praticiens du bien-être sont-ils acceptés&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Oui, à condition que leur pratique soit compatible avec un cadre professionnel de santé — sérieux, discrétion et respect de l'environnement partagé sont essentiels.</p></div>
          <div><p className="font-semibold mb-1">Que se passe-t-il en cas de conflit d'agenda&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Un système de réservation clair et des accords de planning en amont préviennent les conflits. La plupart des espaces mutualisés proposent un outil de réservation numérique.</p></div>
          <div><p className="font-semibold mb-1">Peut-on personnaliser un cabinet partagé&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Les touches personnelles sont généralement bienvenues dans des limites convenues — cadres, petits meubles, matériel personnel. L'essentiel est de maintenir une esthétique d'ensemble cohérente.</p></div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
        <p className="text-muted-foreground leading-relaxed">Le partage d'un espace de soins fonctionne au mieux lorsque les professions se complètent, les rythmes s'harmonisent et la confidentialité est intégrée dès la conception. Pour les praticiens exerçant dans des cabinets de 11 à 18&nbsp;m², ce modèle offre des avantages significatifs en termes de coût, de qualité et d'expérience patient / client.</p>
      </section>
    </InsightLayout>
  );
}
