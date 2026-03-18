import { InsightLayout } from "@/components/InsightLayout";
import { useTranslation } from "react-i18next";

export default function InsightsLouerAcheter() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const relatedLinks = [
    { routeKey: "insightsBudget", labelFr: "Quel budget pour un cabinet à Bordeaux", labelEn: "What budget for an office in Bordeaux" },
    { routeKey: "insightsSurface", labelFr: "Quelle surface pour un cabinet", labelEn: "What size for an office" },
    { routeKey: "insightsCabinetMedical", labelFr: "Trouver un cabinet médical à Bordeaux", labelEn: "Finding a medical office in Bordeaux" },
  ];

  if (lang === "en") {
    return (
      <InsightLayout
        title="Should you rent or buy your medical office | I‑CA.RE"
        description="Flexibility, equity, professional maturity, shared spaces: the concrete criteria for choosing between renting and buying a medical or paramedical office."
        path="/en/insights/rent-or-buy-office"
        relatedLinks={relatedLinks}
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">Should you rent or buy your medical or paramedical office</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">Rent or buy? It's one of the most frequently asked questions when setting up a practice. There is no universal right answer — the best choice depends on where you are in your career, your financial situation and your long-term vision. What matters is making a decision based on your professional needs, not on property market pressure or conventional wisdom.</p>

        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold mb-4">Key takeaways</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Renting offers maximum flexibility — ideal for early-career practitioners</li>
            <li>Buying builds professional equity but requires significant capital and reduces mobility</li>
            <li>Shared care spaces combine the flexibility of renting with enhanced quality of environment</li>
            <li>The decision should follow your professional strategy, not property speculation</li>
            <li>Many successful practitioners rent or use shared spaces throughout their entire career</li>
            <li>Consider the total cost of ownership, not just the monthly payment</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Renting: flexibility and focus</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Renting requires a lower initial outlay and preserves your financial flexibility. You can change location as your practice evolves, test a neighbourhood, adjust your space as your needs change, and focus your energy and capital on what matters most — building your patient / client base and developing your skills.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">Typical advantages of renting:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
            <li>Lower barrier to entry — deposit of 1 to 3 months' rent vs significant capital for purchase</li>
            <li>Geographic mobility — you can relocate if your patient / client catchment changes</li>
            <li>Predictable costs — rent and charges are known in advance</li>
            <li>No property management burden — the landlord handles structural maintenance</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">The real limitations of renting</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Rent is a recurring cost that doesn't build equity. You may face rent increases, non-renewal or restrictions on customisation. You are also dependent on the landlord for the condition and maintenance of the premises.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">However, these limitations are often overstated. A well-negotiated lease with a reasonable term provides stability. And the capital you don't invest in property can be deployed elsewhere — professional development, equipment, marketing or financial reserves.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Buying: stability and equity</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Buying allows you to build professional equity over time. Mortgage payments can be comparable to rent, and you gain full control over the premises — layout, renovations, signage. Over the long term, ownership eliminates rent exposure and creates an asset.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">Typical advantages of buying:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
            <li>Asset building — each payment contributes to your professional estate</li>
            <li>Full control — renovate, customise and adapt without restrictions</li>
            <li>No rent increases — fixed mortgage payments (for fixed-rate loans)</li>
            <li>Potential tax advantages — depending on your structure (SCI, personal ownership)</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">The real limitations of buying</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Buying ties up significant capital — deposit (typically 10–20%), notary fees (7–8%), potential renovation costs. It reduces your mobility and adds management responsibilities: maintenance, co-ownership charges, insurance, and potential vacancy if you need to sell.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">The total cost of ownership — purchase price, interest, maintenance, taxes, eventual resale costs — is often higher than it appears when comparing to monthly rent. A fair comparison requires accounting for all these elements.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Early career: prioritise flexibility</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">For practitioners at the beginning of their career, renting or using a shared space is almost always the wisest choice. It limits financial risk, allows you to test your practice model, and preserves capital for patient / client acquisition and professional development.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">Committing to a property purchase before your practice is established and your location confirmed is one of the most common financial mistakes early-career practitioners make.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Established practice: consider buying if conditions align</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Once your practice is stable, your patient / client base established and your location confirmed over several years, buying becomes a legitimate option. Long-term visibility in the same location strengthens your reputation, and mortgage payments build an asset rather than being a pure expense.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">The right time to buy is when you can do so without compromising your practice cash flow or your capacity to invest in professional development.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Shared care spaces: the third option</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Shared care spaces offer a compelling alternative that combines the flexibility of renting with a quality of environment that is very difficult to achieve individually. They pool renovation costs, common areas, maintenance and administration — allowing you to focus on your practice rather than property management.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">For many practitioners — at every career stage — shared spaces represent the optimal balance between cost, quality, flexibility and professionalism. They eliminate the rent-or-buy dilemma entirely for those who prioritise practice quality over property ownership.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">A comparison framework</h2>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
            <li><strong>Renting:</strong> low entry cost, high flexibility, no equity building, dependent on landlord</li>
            <li><strong>Buying:</strong> high entry cost, low flexibility, equity building, full control but management burden</li>
            <li><strong>Shared space:</strong> very low entry cost, good flexibility, no equity building, high quality, minimal management burden</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-3">None of these options is inherently superior. The right choice depends on your career stage, financial situation, location stability and personal priorities.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Common mistakes to avoid</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Buying too early — before your practice and location are confirmed</li>
            <li>Treating property purchase as automatically superior to renting</li>
            <li>Comparing monthly rent to mortgage payment without accounting for total ownership costs</li>
            <li>Underestimating the management burden and costs of property ownership</li>
            <li>Making the decision based on property market speculation rather than professional needs</li>
            <li>Dismissing shared spaces without understanding the actual offering</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Frequently asked questions</h2>
          <div className="space-y-6">
            <div><p className="font-semibold mb-1">Is renting a waste of money?</p><p className="text-muted-foreground leading-relaxed">No. Renting preserves your capital, offers flexibility and avoids the risks of property ownership. The capital you don't invest in property can work for you elsewhere. Many highly successful practitioners rent throughout their entire career.</p></div>
            <div><p className="font-semibold mb-1">When is the right time to buy?</p><p className="text-muted-foreground leading-relaxed">When your practice is stable (typically 3–5+ years), your location is confirmed, and you have the financial capacity to invest without compromising your activity or cash reserves.</p></div>
            <div><p className="font-semibold mb-1">Can I buy through a company structure?</p><p className="text-muted-foreground leading-relaxed">Yes. Purchasing through an SCI or other structure can offer tax and estate planning advantages. This is a complex decision that merits professional advice from an accountant or notary.</p></div>
            <div><p className="font-semibold mb-1">Are shared spaces a viable long-term option?</p><p className="text-muted-foreground leading-relaxed">Yes. Many practitioners use shared spaces throughout their career, benefiting from quality premises, shared costs, a professional environment and zero property management burden. It's not just a stepping stone — for many, it's the optimal permanent solution.</p></div>
            <div><p className="font-semibold mb-1">How do I decide?</p><p className="text-muted-foreground leading-relaxed">Start from your professional situation: career stage, patient / client base stability, financial reserves, and location certainty. The property decision should serve your practice, not the other way around.</p></div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
          <p className="text-muted-foreground leading-relaxed">The rent-or-buy decision should serve your professional project, not the other way around. Start with the option that preserves your flexibility, consider shared spaces as a serious alternative, and focus on what matters most: building a practice that is sustainable, professional and centred on the quality of care you provide.</p>
        </section>
      </InsightLayout>
    );
  }

  return (
    <InsightLayout
      title="Faut-il louer ou acheter son cabinet médical | I‑CA.RE"
      description="Souplesse, patrimoine, maturité professionnelle, espaces mutualisés : les critères concrets pour choisir entre location et achat d'un cabinet."
      path="/insights/louer-ou-acheter-cabinet"
      relatedLinks={relatedLinks}
    >
      <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">Faut-il louer ou acheter son cabinet médical ou paramédical</h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-4">Louer ou acheter&nbsp;? C'est l'une des questions les plus posées lors d'une installation. Il n'y a pas de réponse universelle — le meilleur choix dépend de votre stade de carrière, de votre situation financière et de votre vision à long terme. L'important est de prendre une décision fondée sur vos besoins professionnels, pas sur la pression du marché immobilier ou les idées reçues.</p>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold mb-4">Ce qu'il faut retenir</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>La location offre un maximum de flexibilité — idéal en début de carrière</li>
          <li>L'achat permet de constituer un patrimoine professionnel mais mobilise un capital important et réduit la mobilité</li>
          <li>Les espaces mutualisés combinent la flexibilité de la location avec une qualité d'environnement renforcée</li>
          <li>La décision doit suivre votre stratégie professionnelle, pas la spéculation immobilière</li>
          <li>De nombreux praticiens confirmés louent ou exercent en mutualisé tout au long de leur carrière</li>
          <li>Considérez le coût total de propriété, pas seulement la mensualité</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">La location&nbsp;: flexibilité et concentration sur l'essentiel</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">La location nécessite un investissement initial plus faible et préserve votre flexibilité financière. Vous pouvez changer de lieu au fil de l'évolution de votre activité, tester un quartier, ajuster votre espace selon vos besoins, et concentrer votre énergie et votre capital sur ce qui compte le plus — développer votre patientèle et vos compétences.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Avantages concrets de la location&nbsp;:</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
          <li>Ticket d'entrée réduit — dépôt de 1 à 3 mois de loyer vs capital important pour un achat</li>
          <li>Mobilité géographique — possibilité de déménager si votre bassin de patient / clients évolue</li>
          <li>Coûts prévisibles — loyer et charges connus à l'avance</li>
          <li>Pas de charge de gestion immobilière — le bailleur assure l'entretien structurel</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les vraies limites de la location</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Le loyer est une charge récurrente qui ne constitue pas de patrimoine. Vous pouvez subir des hausses, un non-renouvellement ou des restrictions de personnalisation. Vous dépendez aussi du bailleur pour l'état et l'entretien du local.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Cependant, ces limites sont souvent surestimées. Un bail bien négocié avec une durée raisonnable assure une stabilité. Et le capital que vous n'investissez pas dans la pierre peut travailler ailleurs — formation, équipement, communication ou réserve financière.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">L'achat&nbsp;: stabilité et patrimoine</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">L'achat permet de constituer un patrimoine professionnel dans le temps. Les mensualités de crédit peuvent être comparables à un loyer, et vous bénéficiez d'un contrôle total sur le local — agencement, travaux, signalétique. À long terme, la propriété élimine l'exposition au loyer et crée un actif.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Avantages concrets de l'achat&nbsp;:</p>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
          <li>Constitution de patrimoine — chaque paiement contribue à votre patrimoine professionnel</li>
          <li>Contrôle total — rénovation, personnalisation et adaptation sans restriction</li>
          <li>Pas de hausse de loyer — mensualités fixes (pour les crédits à taux fixe)</li>
          <li>Avantages fiscaux potentiels — selon votre structure (SCI, propriété personnelle)</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les vraies limites de l'achat</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">L'achat immobilise un capital important — apport (généralement 10–20&nbsp;%), frais de notaire (7–8&nbsp;%), travaux éventuels. Il réduit votre mobilité et ajoute des responsabilités de gestion&nbsp;: entretien, charges de copropriété, assurances, et vacance potentielle en cas de revente.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Le coût total de propriété — prix d'achat, intérêts, entretien, taxes, frais de revente — est souvent plus élevé qu'il n'y paraît lorsqu'on compare à un loyer mensuel. Une comparaison honnête nécessite de prendre en compte tous ces éléments.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Début de carrière&nbsp;: privilégier la souplesse</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Pour les praticiens en début de carrière, la location ou l'espace mutualisé est presque toujours le choix le plus sage. Cela limite le risque financier, permet de tester son modèle d'exercice, et préserve le capital pour le développement de la patientèle et la formation.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">S'engager dans un achat immobilier avant que votre activité ne soit établie et votre localisation confirmée est l'une des erreurs financières les plus fréquentes des praticiens en début de carrière.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Exercice établi&nbsp;: envisager l'achat si les conditions sont réunies</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Lorsque votre activité est stable, votre patientèle installée et votre emplacement confirmé depuis plusieurs années, l'achat devient une option légitime. La visibilité à long terme dans un même lieu renforce votre notoriété, et les mensualités de crédit constituent un actif plutôt qu'une charge pure.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Le bon moment pour acheter est celui où vous pouvez le faire sans compromettre votre trésorerie d'exercice ni votre capacité d'investissement professionnel.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les espaces mutualisés&nbsp;: la troisième voie</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les espaces de soins mutualisés offrent une alternative convaincante qui combine la flexibilité de la location avec une qualité d'environnement très difficile à atteindre individuellement. Ils partagent les coûts de rénovation, de parties communes, d'entretien et d'administration — vous permettant de vous concentrer sur votre pratique plutôt que sur la gestion immobilière.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Pour de nombreux praticiens — à chaque étape de leur carrière — les espaces mutualisés représentent l'équilibre optimal entre coût, qualité, flexibilité et professionnalisme. Ils éliminent le dilemme location/achat pour ceux qui privilégient la qualité de l'exercice sur la propriété immobilière.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Un cadre de comparaison</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
          <li><strong>Location&nbsp;:</strong> coût d'entrée faible, grande flexibilité, pas de patrimoine, dépendance au bailleur</li>
          <li><strong>Achat&nbsp;:</strong> coût d'entrée élevé, faible flexibilité, constitution de patrimoine, contrôle total mais charge de gestion</li>
          <li><strong>Espace mutualisé&nbsp;:</strong> coût d'entrée très faible, bonne flexibilité, pas de patrimoine, haute qualité, charge de gestion minimale</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mb-3">Aucune de ces options n'est intrinsèquement supérieure. Le bon choix dépend de votre stade de carrière, de votre situation financière, de la stabilité de votre localisation et de vos priorités personnelles.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les erreurs fréquentes à éviter</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Acheter trop tôt — avant que votre activité et votre emplacement ne soient confirmés</li>
          <li>Considérer l'achat comme automatiquement supérieur à la location</li>
          <li>Comparer loyer mensuel et mensualité de crédit sans tenir compte du coût total de propriété</li>
          <li>Sous-estimer la charge de gestion et les coûts liés à la propriété immobilière</li>
          <li>Fonder la décision sur la spéculation immobilière plutôt que sur les besoins professionnels</li>
          <li>Écarter les espaces mutualisés sans comprendre l'offre réelle</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Questions fréquentes</h2>
        <div className="space-y-6">
          <div><p className="font-semibold mb-1">Louer, c'est jeter de l'argent par les fenêtres&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Non. La location préserve votre capital, offre de la flexibilité et évite les risques de la propriété. Le capital non investi dans la pierre peut travailler pour vous ailleurs. De nombreux praticiens très performants louent tout au long de leur carrière.</p></div>
          <div><p className="font-semibold mb-1">Quand est-ce le bon moment pour acheter&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Lorsque votre activité est stable (généralement 3 à 5+ ans), votre emplacement confirmé, et que vous avez la capacité financière d'investir sans compromettre votre exercice ou vos réserves.</p></div>
          <div><p className="font-semibold mb-1">Peut-on acheter via une structure&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Oui. L'achat via une SCI ou une autre structure peut offrir des avantages fiscaux et patrimoniaux. C'est une décision complexe qui mérite un conseil professionnel auprès d'un comptable ou d'un notaire.</p></div>
          <div><p className="font-semibold mb-1">Les espaces mutualisés sont-ils une option viable à long terme&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Oui. De nombreux praticiens exercent en mutualisé tout au long de leur carrière, bénéficiant de locaux de qualité, de coûts partagés, d'un cadre professionnel et de zéro charge de gestion immobilière. Ce n'est pas qu'un tremplin — pour beaucoup, c'est la solution optimale permanente.</p></div>
          <div><p className="font-semibold mb-1">Comment décider&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Partez de votre situation professionnelle&nbsp;: stade de carrière, stabilité de la patientèle, réserves financières et certitude géographique. La décision immobilière doit servir votre exercice, pas l'inverse.</p></div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
        <p className="text-muted-foreground leading-relaxed">La décision de louer ou d'acheter doit servir votre projet professionnel, et non l'inverse. Commencez par l'option qui préserve votre flexibilité, considérez les espaces mutualisés comme une vraie alternative, et concentrez-vous sur l'essentiel&nbsp;: bâtir une pratique pérenne, professionnelle et centrée sur la qualité du soin que vous apportez.</p>
      </section>
    </InsightLayout>
  );
}
