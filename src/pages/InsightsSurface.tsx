import { InsightLayout } from "@/components/InsightLayout";
import { useTranslation } from "react-i18next";

export default function InsightsSurface() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  const relatedLinks = [
    { routeKey: "insightsCabinetMedical", labelFr: "Trouver un cabinet médical à Bordeaux", labelEn: "Finding a medical office in Bordeaux" },
    { routeKey: "insightsBudget", labelFr: "Quel budget pour un cabinet à Bordeaux", labelEn: "What budget for an office in Bordeaux" },
    { routeKey: "insightsProfessions", labelFr: "Professions compatibles avec le partage de cabinet", labelEn: "Professions compatible with shared offices" },
  ];

  if (lang === "en") {
    return (
      <InsightLayout
        title="What size for a medical or paramedical office | I‑CA.RE"
        description="Minimum working area, space optimisation, shared areas: how to size your medical or paramedical office without oversizing costs."
        path="/en/insights/medical-office-size"
        relatedLinks={relatedLinks}
      >
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">What size do you need for a medical or paramedical office</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">Choosing the right size for your office is crucial. Too large, and you overspend; too small, and you compromise comfort and functionality. The answer depends on your profession, your mode of practice and the availability of shared spaces.</p>

        <section className="mb-12">
          <h2 className="text-xl font-heading font-bold mb-4">Key takeaways</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>A 12 to 15 sqm private office suits most seated-practice professions</li>
            <li>Shared areas (waiting room, facilities) complement the private space</li>
            <li>Oversizing is a common and costly mistake</li>
            <li>Shared spaces allow for smaller individual offices without sacrificing quality</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Realistic minimum working areas</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">For most seated-practice professions (psychology, osteopathy, dietetics, speech therapy, sophrology, naturopathy), a private space of 11 to 15 sqm is sufficient for comfortable, professional practice.</p>
          <p className="text-muted-foreground leading-relaxed mb-3">Professions requiring specific equipment or a treatment table may need 15 to 18 sqm.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Individual office vs shared space</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A standalone office requires you to fit everything — waiting area, reception, facilities — into your own square metres. In a shared setting, these functions are pooled, so your private office can focus purely on the consultation room.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">The role of shared areas</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">A well-designed waiting room, accessible facilities and a professional entrance significantly enhance the patient experience. In a shared space, these are maintained collectively, which reduces costs and improves quality.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Adapting size to your profession</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Psychologists and psychotherapists typically need 11 to 13 sqm. Osteopaths and manual therapists work comfortably in 14 to 18 sqm. Dietitians, sophrologists and naturopaths generally require 11 to 14 sqm.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">The oversizing trap</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Taking a space that is too large is one of the most common mistakes. It increases rent, charges and maintenance without improving your practice. A well-optimised small space is more effective than a poorly utilised large one.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Comfort and space optimisation</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">Comfort depends on layout quality, natural light, acoustic insulation and furniture choices rather than raw square metres. A thoughtfully designed 13 sqm office can feel more professional and welcoming than a hastily furnished 25 sqm space.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Common mistakes to avoid</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Renting a space that is too large "just in case"</li>
            <li>Ignoring the contribution of shared areas</li>
            <li>Confusing total building area with usable office area</li>
            <li>Underestimating the impact of layout on perceived comfort</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Typical sizes by profession</h2>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Psychology, psychotherapy: 11–13 sqm</li>
            <li>Osteopathy, manual therapy: 14–18 sqm</li>
            <li>Dietetics, nutrition: 11–14 sqm</li>
            <li>Sophrology, naturopathy: 11–14 sqm</li>
            <li>Speech therapy, psychomotor therapy: 12–16 sqm</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2 italic">These ranges assume access to shared areas (waiting room, facilities).</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-heading font-bold mb-3">Frequently asked questions</h2>
          <div className="space-y-6">
            <div><p className="font-semibold mb-1">Can I practise in 11 sqm?</p><p className="text-muted-foreground leading-relaxed">Yes, many seated-practice professions work very well in 11 to 13 sqm, provided you have access to a waiting room and shared facilities.</p></div>
            <div><p className="font-semibold mb-1">How much space does an osteopath need?</p><p className="text-muted-foreground leading-relaxed">A treatment table and room for movement typically require 14 to 18 sqm.</p></div>
            <div><p className="font-semibold mb-1">Does a larger office mean a better practice?</p><p className="text-muted-foreground leading-relaxed">Not necessarily. Quality depends on layout, light and acoustic comfort rather than size alone. A well-designed small space often outperforms a poorly utilised large one.</p></div>
            <div><p className="font-semibold mb-1">Are shared spaces too small?</p><p className="text-muted-foreground leading-relaxed">No. Shared spaces pool common functions, so the private office can focus on the consultation. The result is often more space efficiency and better comfort than standalone offices.</p></div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
          <p className="text-muted-foreground leading-relaxed">Choosing the right size means matching your space to your actual practice needs, not to a theoretical ideal. In a shared setting, a private office of 11 to 18 sqm offers the best balance between comfort, cost and professionalism.</p>
        </section>
      </InsightLayout>
    );
  }

  return (
    <InsightLayout
      title="Quelle surface pour un cabinet médical ou paramédical | I‑CA.RE"
      description="Surface minimale, optimisation de l'espace, parties communes : comment dimensionner votre cabinet médical ou paramédical sans surdimensionner vos coûts."
      path="/insights/surface-cabinet-medical"
      relatedLinks={relatedLinks}
    >
      <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">Quelle surface faut-il pour un cabinet médical ou paramédical</h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-4">Choisir la bonne surface pour son cabinet est un enjeu majeur. Trop grand, vous surpayez. Trop petit, vous compromettez le confort et la fonctionnalité. La réponse dépend de votre métier, de votre mode d'exercice et de l'accès à des espaces partagés.</p>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold mb-4">Ce qu'il faut retenir</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Un cabinet privatif de 12 à 15&nbsp;m² convient à la plupart des exercices en consultation assise</li>
          <li>Les parties communes (salle d'attente, sanitaires) complètent l'espace privatif</li>
          <li>Le surdimensionnement est une erreur fréquente et coûteuse</li>
          <li>Les espaces mutualisés permettent des surfaces individuelles plus réduites sans sacrifier la qualité</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Surfaces minimales de travail réalistes</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Pour la plupart des métiers en consultation assise (psychologie, ostéopathie, diététique, orthophonie, sophrologie, naturopathie), un espace privatif de 11 à 15&nbsp;m² est suffisant pour un exercice confortable et professionnel.</p>
        <p className="text-muted-foreground leading-relaxed mb-3">Les métiers nécessitant un équipement spécifique ou une table de soins peuvent avoir besoin de 15 à 18&nbsp;m².</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Cabinet individuel vs espace mutualisé</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Un cabinet indépendant exige d'intégrer toutes les fonctions — attente, accueil, sanitaires — dans vos propres mètres carrés. Dans un lieu mutualisé, ces fonctions sont partagées, ce qui permet de concentrer votre espace privatif sur la salle de consultation.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">L'importance des parties communes</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Une salle d'attente soignée, des sanitaires accessibles et une entrée professionnelle améliorent significativement l'expérience du patient / client. Dans un espace mutualisé, ces éléments sont entretenus collectivement, ce qui réduit les coûts et améliore la qualité.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Adapter la surface à votre métier</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Les psychologues et psychothérapeutes ont généralement besoin de 11 à 13&nbsp;m². Les ostéopathes et thérapeutes manuels travaillent confortablement dans 14 à 18&nbsp;m². Les diététiciens, sophrologues et naturopathes se situent généralement entre 11 et 14&nbsp;m².</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Le piège du surdimensionnement</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Prendre un local trop grand est l'une des erreurs les plus fréquentes. Cela augmente le loyer, les charges et l'entretien sans améliorer votre exercice. Un petit espace bien optimisé est plus efficace qu'un grand espace mal exploité.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Confort et optimisation de l'espace</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">Le confort dépend de la qualité de l'agencement, de la lumière naturelle, de l'isolation acoustique et du choix du mobilier, plutôt que des mètres carrés bruts. Un cabinet de 13&nbsp;m² bien pensé peut être plus professionnel et accueillant qu'un espace de 25&nbsp;m² aménagé à la hâte.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Les erreurs fréquentes à éviter</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Louer un espace trop grand «&nbsp;au cas où&nbsp;»</li>
          <li>Ignorer l'apport des parties communes</li>
          <li>Confondre surface totale du bâtiment et surface utile du cabinet</li>
          <li>Sous-estimer l'impact de l'agencement sur le confort perçu</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Surfaces types par métier</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>Psychologie, psychothérapie&nbsp;: 11–13&nbsp;m²</li>
          <li>Ostéopathie, thérapie manuelle&nbsp;: 14–18&nbsp;m²</li>
          <li>Diététique, nutrition&nbsp;: 11–14&nbsp;m²</li>
          <li>Sophrologie, naturopathie&nbsp;: 11–14&nbsp;m²</li>
          <li>Orthophonie, psychomotricité&nbsp;: 12–16&nbsp;m²</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-2 italic">Ces fourchettes supposent un accès à des parties communes (salle d'attente, sanitaires).</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-3">Questions fréquentes</h2>
        <div className="space-y-6">
          <div><p className="font-semibold mb-1">Peut-on exercer dans 11&nbsp;m²&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Oui, de nombreuses professions en consultation assise exercent très bien dans 11 à 13&nbsp;m², à condition de disposer d'une salle d'attente et de sanitaires partagés.</p></div>
          <div><p className="font-semibold mb-1">Quelle surface pour un ostéopathe&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Une table de soins et un espace de mouvement nécessitent généralement 14 à 18&nbsp;m².</p></div>
          <div><p className="font-semibold mb-1">Un cabinet plus grand signifie-t-il un meilleur exercice&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Pas nécessairement. La qualité dépend de l'agencement, de la lumière et du confort acoustique, davantage que de la taille seule. Un petit espace bien conçu surpasse souvent un grand espace mal exploité.</p></div>
          <div><p className="font-semibold mb-1">Les espaces mutualisés sont-ils trop petits&nbsp;?</p><p className="text-muted-foreground leading-relaxed">Non. Les espaces mutualisés partagent les fonctions communes, ce qui permet de concentrer le cabinet privatif sur la consultation. Le résultat est souvent une meilleure efficacité spatiale et un meilleur confort qu'en cabinet isolé.</p></div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-heading font-bold mb-3">Conclusion</h2>
        <p className="text-muted-foreground leading-relaxed">Choisir la bonne surface, c'est adapter son espace à ses besoins réels de pratique, pas à un idéal théorique. Dans un cadre mutualisé, un cabinet privatif de 11 à 18&nbsp;m² offre le meilleur équilibre entre confort, coût et professionnalisme.</p>
      </section>
    </InsightLayout>
  );
}
