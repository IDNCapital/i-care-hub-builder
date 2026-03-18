import { SeoHead } from "@/components/SeoHead";
import { useTranslation } from "react-i18next";

export default function InsightsCabinetMedicalBordeaux() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  return (
    <>
      <SeoHead
        title="Comment trouver un cabinet médical ou paramédical à Bordeaux | I‑CA.RE"
        description="Guide pour trouver un cabinet médical ou paramédical à Bordeaux : emplacement, surface, budget, normes, lieux mutualisés."
        path={lang === "fr" ? "/insights/cabinet-medical-bordeaux" : "/en/insights/medical-office-bordeaux"}
      />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px", fontFamily: "system-ui, sans-serif", color: "#1a1a1a", lineHeight: 1.8 }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: 24 }}>
          Comment trouver un cabinet médical ou paramédical à Bordeaux
        </h1>

        <p>
          Trouver un cabinet médical à Bordeaux nécessite d'anticiper plusieurs paramètres&nbsp;: emplacement, surface, budget global et contraintes réglementaires.
        </p>

        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: 40, marginBottom: 12 }}>
          Pourquoi le marché est tendu à Bordeaux
        </h2>

        <p>
          Le marché bordelais est tendu sur les petites surfaces adaptées aux professions de santé. Les biens disponibles entre 10 et 25&nbsp;m² sont rares, et les locaux existants nécessitent souvent des travaux pour répondre aux normes.
        </p>

        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: 40, marginBottom: 12 }}>
          Quel emplacement choisir
        </h2>

        <p>
          Un bon emplacement doit être cohérent avec votre activité. Une rue très passante n'est pas toujours pertinente. Il est souvent préférable de s'implanter à proximité d'autres professionnels de santé, de transports ou de zones résidentielles.
        </p>

        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: 40, marginBottom: 12 }}>
          Quelle surface pour un cabinet
        </h2>

        <p>
          La surface idéale pour un cabinet se situe généralement entre 12 et 20&nbsp;m². L'optimisation des espaces et l'accès à des parties communes permettent de travailler efficacement sans surdimensionner les coûts.
        </p>

        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: 40, marginBottom: 12 }}>
          Accessibilité et normes ERP
        </h2>

        <p>
          Les normes d'accessibilité sont un point structurant. Un local non conforme peut générer des travaux importants. Il est donc essentiel d'intégrer cette contrainte dès le départ.
        </p>

        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: 40, marginBottom: 12 }}>
          Quel budget prévoir
        </h2>

        <p>
          Le budget global ne se limite pas au loyer ou au prix d'acquisition. Il faut intégrer les travaux, les charges, la fiscalité et les périodes éventuelles de vacance.
        </p>

        <p>
          À Bordeaux, les ordres de grandeur observés sont les suivants&nbsp;: surface moyenne de 12 à 18&nbsp;m², loyer mensuel entre 400 et 900&nbsp;euros, coût de travaux entre 500 et 1&nbsp;500&nbsp;euros par mètre carré.
        </p>

        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: 40, marginBottom: 12 }}>
          L'intérêt des lieux mutualisés
        </h2>

        <p>
          Les lieux de soins mutualisés constituent une alternative pertinente. Ils permettent de réduire les coûts, d'améliorer l'expérience patient et de créer des synergies entre praticiens.
        </p>

        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: 40, marginBottom: 12 }}>
          Les erreurs à éviter
        </h2>

        <p>
          Certaines erreurs doivent être évitées&nbsp;: choisir un local uniquement sur un coup de cœur, sous-estimer les travaux, ignorer les contraintes réglementaires ou surdimensionner la surface.
        </p>

        <p>
          Une approche structurée permet de sécuriser son installation et d'assurer la pérennité de son activité.
        </p>

        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: 40, marginBottom: 12 }}>
          I‑CA.RE et les praticiens
        </h2>

        <p>
          I‑CA.RE développe et structure des espaces adaptés aux praticiens, en intégrant les contraintes immobilières, réglementaires et économiques.
        </p>

        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: 48, marginBottom: 16 }}>
          Questions fréquentes
        </h2>

        <p style={{ fontWeight: 600 }}>Quelle surface pour un cabinet médical&nbsp;?</p>
        <p>
          En pratique, une surface de 12 à 15&nbsp;m² est souvent suffisante pour de nombreuses professions, à condition d'avoir accès à des espaces communs (salle d'attente, sanitaires).
        </p>

        <p style={{ fontWeight: 600, marginTop: 24 }}>Quel budget prévoir à Bordeaux&nbsp;?</p>
        <p>
          Le budget dépend du type de local et de son état. Il faut généralement anticiper un coût global intégrant loyer (400 à 900&nbsp;€), travaux (500 à 1&nbsp;500&nbsp;€/m²) et charges.
        </p>

        <p style={{ fontWeight: 600, marginTop: 24 }}>Peut-on transformer un local commercial en cabinet&nbsp;?</p>
        <p>
          Oui, mais cela nécessite de vérifier les règles d'urbanisme, la destination du local et les normes ERP applicables.
        </p>

        <p style={{ fontWeight: 600, marginTop: 24 }}>Faut-il acheter ou louer son cabinet&nbsp;?</p>
        <p>
          Les deux approches ont leurs avantages. La location offre plus de flexibilité, l'achat permet de constituer un patrimoine. Les lieux mutualisés offrent souvent un bon compromis.
        </p>

        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: 48, marginBottom: 16 }}>
          Points clés à retenir
        </h2>

        <ul style={{ paddingLeft: 20, listStyleType: "disc" }}>
          <li>Surface optimale&nbsp;: 12 à 20&nbsp;m²</li>
          <li>Loyer&nbsp;: 400 à 900&nbsp;€</li>
          <li>Travaux&nbsp;: 500 à 1&nbsp;500&nbsp;€/m²</li>
          <li>Privilégier les lieux mutualisés</li>
          <li>Anticiper les normes ERP</li>
        </ul>
      </main>
    </>
  );
}
