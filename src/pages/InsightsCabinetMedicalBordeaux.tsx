import { InsightLayout } from "@/components/InsightLayout";
import { useTranslation } from "react-i18next";

export default function InsightsCabinetMedicalBordeaux() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const relatedLinks = [
    { routeKey: "insightsBudget", labelFr: "Quel budget prévoir pour un cabinet à Bordeaux", labelEn: "What budget to plan for an office in Bordeaux" },
    { routeKey: "insightsSurface", labelFr: "Quelle surface pour un cabinet médical", labelEn: "What size for a medical office" },
    { routeKey: "insightsLouerAcheter", labelFr: "Faut-il louer ou acheter son cabinet", labelEn: "Should you rent or buy your office" },
  ];

  if (lang === "en") {
    return (
      <InsightLayout
        title="How to find a medical or paramedical office in Bordeaux | I‑CA.RE"
        description="A practical guide for practitioners looking for a medical or paramedical office in Bordeaux: location, size, budget, regulations, shared spaces."
        path="/en/insights/medical-office-bordeaux"
        relatedLinks={relatedLinks}
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">
          How to find a medical or paramedical office in Bordeaux
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed mb-4">
          Finding a medical office in Bordeaux requires anticipating several factors: location, size, overall budget and regulatory constraints. The market is tight, particularly for small spaces suited to healthcare professions.
        </p>

        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold mb-4">Key takeaways</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Favour spaces between 12 and 20 sqm suited to your practice</li>
            <li>Choose a location consistent with your patient base rather than a premium address</li>
            <li>Anticipate regulatory constraints (ERP, accessibility)</li>
            <li>Include renovation costs in your overall budget</li>
            <li>Consider shared care spaces to optimise your set-up</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Why the market is tight in Bordeaux</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">The Bordeaux market is under pressure for small spaces suited to healthcare professions. Available units between 10 and 25 sqm are rare, and existing premises often require work to meet current standards.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Choosing the right location</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A good location must be consistent with your activity. A busy high street is not always the best fit. It is often preferable to locate near other health professionals, transport links or residential areas.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">What size for an office</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">The ideal size for an office is generally between 12 and 20 sqm. Optimising space and having access to shared areas allows you to work effectively without oversizing costs.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Accessibility and ERP standards</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Accessibility standards are a key factor. A non-compliant space can generate significant renovation work. It is therefore essential to integrate this constraint from the start.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">What budget to plan</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">The overall budget goes beyond rent or purchase price. You need to factor in renovations, charges, taxation and potential vacancy periods.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">In Bordeaux, typical ranges observed are: average area 12 to 18 sqm, monthly rent between €400 and €900, renovation costs between €500 and €1,500 per sqm.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">The benefits of shared spaces</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Shared care spaces offer a compelling alternative. They reduce costs, improve the patient experience and create synergies between practitioners.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Common mistakes to avoid</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Certain mistakes should be avoided: choosing a space on impulse alone, underestimating renovation work, ignoring regulatory constraints or oversizing the area.</p>
          <p className="text-muted-foreground leading-relaxed">A structured approach helps secure your set-up and ensure the long-term viability of your practice.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Frequently asked questions</h2>
          <div className="space-y-6">
            <div><p className="font-semibold mb-1">What size for a medical office?</p><p className="text-muted-foreground leading-relaxed">In practice, 12 to 15 sqm is often sufficient for many professions, provided you have access to shared areas (waiting room, facilities).</p></div>
            <div><p className="font-semibold mb-1">What budget to plan in Bordeaux?</p><p className="text-muted-foreground leading-relaxed">The budget depends on the type and condition of the premises. You should generally anticipate an overall cost including rent (€400–900), renovations (€500–1,500/sqm) and charges.</p></div>
            <div><p className="font-semibold mb-1">Can you convert a commercial space into an office?</p><p className="text-muted-foreground leading-relaxed">Yes, but you need to check planning rules, the designated use of the premises and applicable ERP standards.</p></div>
            <div><p className="font-semibold mb-1">Should you buy or rent your office?</p><p className="text-muted-foreground leading-relaxed">Both approaches have their merits. Renting offers more flexibility; buying builds equity. Shared spaces often offer a good compromise.</p></div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mb-3">Key figures</h2>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Optimal area: 12 to 20 sqm</li>
            <li>Rent: €400 to €900</li>
            <li>Renovations: €500 to €1,500/sqm</li>
            <li>Favour shared spaces</li>
            <li>Anticipate ERP standards</li>
          </ul>
        </section>
      </InsightLayout>
    );
  }

  return (
    <InsightLayout
      title="Comment trouver un cabinet médical ou paramédical à Bordeaux | I‑CA.RE"
      description="Guide pratique pour trouver un cabinet médical ou paramédical à Bordeaux : emplacement, surface, budget, normes, lieux mutualisés."
      path="/insights/cabinet-medical-bordeaux"
      relatedLinks={relatedLinks}
    >
      <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">
        Comment trouver un cabinet médical ou paramédical à Bordeaux
      </h1>

      <p className="text-lg text-muted-foreground leading-relaxed mb-4">
        Trouver un cabinet médical à Bordeaux nécessite d'anticiper plusieurs paramètres&nbsp;: emplacement, surface, budget global et contraintes réglementaires. Le marché est tendu, en particulier pour les petites surfaces adaptées aux professions de santé.
      </p>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold mb-4">Ce qu'il faut retenir</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Privilégier des surfaces entre 12 et 20&nbsp;m² adaptées à votre activité</li>
          <li>Choisir un emplacement cohérent avec votre patientèle plutôt qu'un emplacement premium</li>
          <li>Anticiper les contraintes réglementaires (ERP, accessibilité)</li>
          <li>Intégrer le coût des travaux dans votre budget global</li>
          <li>Envisager des lieux mutualisés pour optimiser votre installation</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Pourquoi le marché est tendu à Bordeaux</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Le marché bordelais est tendu sur les petites surfaces adaptées aux professions de santé. Les biens disponibles entre 10 et 25&nbsp;m² sont rares, et les locaux existants nécessitent souvent des travaux pour répondre aux normes.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Quel emplacement choisir</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Un bon emplacement doit être cohérent avec votre activité. Une rue très passante n'est pas toujours pertinente. Il est souvent préférable de s'implanter à proximité d'autres professionnels de santé, de transports ou de zones résidentielles.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Quelle surface pour un cabinet</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">La surface idéale pour un cabinet se situe généralement entre 12 et 20&nbsp;m². L'optimisation des espaces et l'accès à des parties communes permettent de travailler efficacement sans surdimensionner les coûts.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Accessibilité et normes ERP</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les normes d'accessibilité sont un point structurant. Un local non conforme peut générer des travaux importants. Il est donc essentiel d'intégrer cette contrainte dès le départ.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Quel budget prévoir</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Le budget global ne se limite pas au loyer ou au prix d'acquisition. Il faut intégrer les travaux, les charges, la fiscalité et les périodes éventuelles de vacance.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">À Bordeaux, les ordres de grandeur observés sont les suivants&nbsp;: surface moyenne de 12 à 18&nbsp;m², loyer mensuel entre 400 et 900&nbsp;euros, coût de travaux entre 500 et 1&nbsp;500&nbsp;euros par mètre carré.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">L'intérêt des lieux mutualisés</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les lieux de soins mutualisés constituent une alternative pertinente. Ils permettent de réduire les coûts, d'améliorer l'expérience patient / client et de créer des synergies entre praticiens.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les erreurs fréquentes à éviter</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Certaines erreurs doivent être évitées&nbsp;: choisir un local uniquement sur un coup de cœur, sous-estimer les travaux, ignorer les contraintes réglementaires ou surdimensionner la surface.</p>
        <p className="text-muted-foreground leading-relaxed">Une approche structurée permet de sécuriser son installation et d'assurer la pérennité de son activité.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Questions fréquentes</h2>
        <div className="space-y-6">
          <div><p className="font-semibold mb-1">Quelle surface pour un cabinet médical&nbsp;?</p><p className="text-muted-foreground leading-relaxed">En pratique, une surface de 12 à 15&nbsp;m² est souvent suffisante pour de nombreuses professions, à condition d'avoir accès à des espaces communs (salle d'attente, sanitaires).</p></div>
          <div><p className="font-semibold mb-1">Quel budget prévoir à Bordeaux&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Le budget dépend du type de local et de son état. Il faut généralement anticiper un coût global intégrant loyer (400 à 900&nbsp;€), travaux (500 à 1&nbsp;500&nbsp;€/m²) et charges.</p></div>
          <div><p className="font-semibold mb-1">Peut-on transformer un local commercial en cabinet&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Oui, mais cela nécessite de vérifier les règles d'urbanisme, la destination du local et les normes ERP applicables.</p></div>
          <div><p className="font-semibold mb-1">Faut-il acheter ou louer son cabinet&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Les deux approches ont leurs avantages. La location offre plus de flexibilité, l'achat permet de constituer un patrimoine. Les lieux mutualisés offrent souvent un bon compromis.</p></div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-heading font-bold mb-3">Points clés à retenir</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>Surface optimale&nbsp;: 12 à 20&nbsp;m²</li>
          <li>Loyer&nbsp;: 400 à 900&nbsp;€</li>
          <li>Travaux&nbsp;: 500 à 1&nbsp;500&nbsp;€/m²</li>
          <li>Privilégier les lieux mutualisés</li>
          <li>Anticiper les normes ERP</li>
        </ul>
      </section>
    </InsightLayout>
  );
}
