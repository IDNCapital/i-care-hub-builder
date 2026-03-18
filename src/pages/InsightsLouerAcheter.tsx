import { InsightLayout } from "@/components/InsightLayout";
import { useTranslation } from "react-i18next";

export default function InsightsLouerAcheter() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const relatedLinks = [
    { routeKey: "insightsBudget", labelFr: "Quel budget pour un cabinet à Bordeaux", labelEn: "What budget for an office in Bordeaux" },
    { routeKey: "insightsCabinetMedical", labelFr: "Trouver un cabinet médical à Bordeaux", labelEn: "Finding a medical office in Bordeaux" },
    { routeKey: "insightsProfessions", labelFr: "Professions compatibles avec le partage", labelEn: "Professions compatible with sharing" },
  ];

  if (lang === "en") {
    return (
      <InsightLayout
        title="Should you rent or buy your medical office | I‑CA.RE"
        description="Flexibility, wealth building, long-term visibility: the criteria for choosing between renting and buying a medical or paramedical office."
        path="/en/insights/rent-or-buy-office"
        relatedLinks={relatedLinks}
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">Should you rent or buy your medical or paramedical office</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">Deciding whether to rent or buy is one of the most significant choices when setting up. Both options have genuine advantages. The right answer depends on your professional maturity, your financial situation and your long-term plans.</p>

        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold mb-4">Key takeaways</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Renting offers flexibility, particularly at the start of your career</li>
            <li>Buying allows you to build equity but requires significant capital</li>
            <li>Shared spaces offer the advantages of renting with enhanced quality</li>
            <li>Your decision should be based on your professional strategy, not financial speculation</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Advantages of renting</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Renting requires a lower initial outlay and offers greater flexibility. You can change location as your practice evolves, test a neighbourhood before committing long-term, and focus your capital on equipment and patient acquisition rather than property.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Limitations of renting</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Rent is a recurring cost that doesn't build equity. You are dependent on the landlord for the condition of the premises and may face rent increases or non-renewal of the lease. Customisation options may also be limited.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Advantages of buying</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Buying allows you to build professional equity over time. Mortgage payments can be comparable to rent, and you gain full control over the premises. It can also provide tax advantages depending on your structure (SCI, personal ownership).</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Limitations of buying</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Buying ties up significant capital upfront — deposit, notary fees, potential renovation costs. It reduces your mobility and adds management responsibilities (maintenance, co-ownership, insurance). Selling can take time if circumstances change.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Flexibility at the start of your career</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">For practitioners just starting out, renting is usually the wisest choice. It limits financial risk, allows you to test your practice model and preserves cash for patient acquisition and professional development.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Long-term visibility</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Once your practice is established and your location confirmed, buying becomes a relevant option. Long-term visibility in the same location strengthens your reputation and patient loyalty.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">The shared-space compromise</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Shared care spaces offer many of the advantages of renting — flexibility, lower initial cost, shared charges — while providing a quality of environment that is hard to achieve individually. They allow you to focus on your practice rather than property management.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Choosing based on professional maturity</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">The decision should align with your professional stage. Early career: rent or shared space. Established practice: consider buying if the location is confirmed. The key is to base the decision on your practice needs, not on property market speculation.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Frequently asked questions</h2>
          <div className="space-y-6">
            <div><p className="font-semibold mb-1">Is renting a waste of money?</p><p className="text-muted-foreground leading-relaxed">No. Renting preserves your capital, offers flexibility and avoids the risks of property ownership. It is often the most rational choice early in a career.</p></div>
            <div><p className="font-semibold mb-1">When should I consider buying?</p><p className="text-muted-foreground leading-relaxed">When your practice is stable, your location is confirmed and you have the financial capacity to invest without compromising your activity.</p></div>
            <div><p className="font-semibold mb-1">Can I buy through a company structure?</p><p className="text-muted-foreground leading-relaxed">Yes, purchasing through an SCI or other structure can offer tax and estate planning advantages. Consult an accountant or notary.</p></div>
            <div><p className="font-semibold mb-1">Are shared spaces a good long-term option?</p><p className="text-muted-foreground leading-relaxed">Yes. Many practitioners use shared spaces throughout their career, benefiting from quality premises, shared costs and a professional environment without property concerns.</p></div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
          <p className="text-muted-foreground leading-relaxed">The rent-or-buy decision should serve your professional project, not the other way around. Start with the option that preserves your flexibility and focus on what matters most: building a successful practice.</p>
        </section>
      </InsightLayout>
    );
  }

  return (
    <InsightLayout
      title="Faut-il louer ou acheter son cabinet médical | I‑CA.RE"
      description="Souplesse, patrimoine, visibilité : les critères pour choisir entre location et achat d'un cabinet médical ou paramédical."
      path="/insights/louer-ou-acheter-cabinet"
      relatedLinks={relatedLinks}
    >
      <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">Faut-il louer ou acheter son cabinet médical ou paramédical</h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-4">Le choix entre louer et acheter est l'une des décisions les plus structurantes lors d'une installation. Les deux options ont de vrais avantages. La bonne réponse dépend de votre maturité professionnelle, de votre situation financière et de vos projections à long terme.</p>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold mb-4">Ce qu'il faut retenir</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>La location offre de la souplesse, en particulier en début de carrière</li>
          <li>L'achat permet de constituer un patrimoine mais mobilise un capital important</li>
          <li>Les espaces mutualisés offrent les avantages de la location avec une qualité renforcée</li>
          <li>Votre décision doit reposer sur votre stratégie professionnelle, pas sur la spéculation</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les avantages de la location</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">La location nécessite un investissement initial plus faible et offre une plus grande flexibilité. Vous pouvez changer de lieu au fil de l'évolution de votre activité, tester un quartier avant de vous engager sur le long terme, et concentrer votre capital sur l'équipement et le développement de votre patientèle.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les limites de la location</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Le loyer est une charge récurrente qui ne constitue pas de patrimoine. Vous dépendez du bailleur pour l'état du local et pouvez subir des hausses de loyer ou un non-renouvellement du bail. Les possibilités de personnalisation peuvent aussi être limitées.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les avantages de l'achat</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">L'achat permet de constituer un patrimoine professionnel dans le temps. Les mensualités de crédit peuvent être comparables à un loyer, et vous bénéficiez d'un contrôle total sur le local. L'achat peut aussi offrir des avantages fiscaux selon votre structure (SCI, propriété personnelle).</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les limites de l'achat</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">L'achat immobilise un capital important en amont — apport, frais de notaire, travaux éventuels. Il réduit votre mobilité et ajoute des responsabilités de gestion (entretien, copropriété, assurances). La revente peut prendre du temps si les circonstances changent.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">La souplesse en début d'activité</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Pour les praticiens en début de carrière, la location est généralement le choix le plus sage. Elle limite le risque financier, permet de tester son modèle d'exercice et préserve la trésorerie pour le développement de l'activité.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">La visibilité à long terme</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Lorsque votre activité est établie et votre emplacement confirmé, l'achat devient une option pertinente. La visibilité à long terme dans un même lieu renforce votre notoriété et la fidélité de votre patientèle.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Le compromis des espaces mutualisés</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les espaces de soins mutualisés offrent de nombreux avantages de la location — flexibilité, coût d'entrée réduit, charges partagées — tout en proposant une qualité d'environnement difficile à atteindre individuellement. Ils permettent de se concentrer sur sa pratique plutôt que sur la gestion immobilière.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Choisir selon sa maturité professionnelle</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">La décision doit être alignée avec votre stade professionnel. Début de carrière&nbsp;: location ou espace mutualisé. Exercice établi&nbsp;: envisager l'achat si l'emplacement est confirmé. L'essentiel est de fonder la décision sur vos besoins d'exercice, pas sur la spéculation immobilière.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Questions fréquentes</h2>
        <div className="space-y-6">
          <div><p className="font-semibold mb-1">Louer, c'est jeter de l'argent par les fenêtres&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Non. La location préserve votre capital, offre de la flexibilité et évite les risques liés à la propriété. C'est souvent le choix le plus rationnel en début de carrière.</p></div>
          <div><p className="font-semibold mb-1">Quand envisager l'achat&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Lorsque votre activité est stable, votre emplacement confirmé et que vous avez la capacité financière d'investir sans compromettre votre exercice.</p></div>
          <div><p className="font-semibold mb-1">Peut-on acheter via une structure&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Oui, l'achat via une SCI ou une autre structure peut offrir des avantages fiscaux et patrimoniaux. Consultez un comptable ou un notaire.</p></div>
          <div><p className="font-semibold mb-1">Les espaces mutualisés sont-ils une bonne option à long terme&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Oui. De nombreux praticiens utilisent des espaces mutualisés tout au long de leur carrière, bénéficiant de locaux de qualité, de coûts partagés et d'un cadre professionnel sans les contraintes de la propriété.</p></div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
        <p className="text-muted-foreground leading-relaxed">La décision de louer ou d'acheter doit servir votre projet professionnel, et non l'inverse. Commencez par l'option qui préserve votre flexibilité et concentrez-vous sur l'essentiel&nbsp;: bâtir une pratique pérenne.</p>
      </section>
    </InsightLayout>
  );
}
