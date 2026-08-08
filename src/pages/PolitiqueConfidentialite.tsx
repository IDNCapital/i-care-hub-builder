import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { BrandName } from "@/components/BrandName";
import { ICARE_TELEPHONE_E164, ICARE_TELEPHONE_AFFICHAGE, ICARE_TELEPHONE_AFFICHAGE_INTL } from "@/lib/contact";

export default function PolitiqueConfidentialite() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  if (lang === "en") return <EnVersion />;
  return <FrVersion />;
}

function FrVersion() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  return (
    <Layout>
      <SeoHead
        title="Politique de confidentialité | I‑CA.RE"
        description="Politique de confidentialité et protection des données personnelles d'I‑CA.RE, conforme au RGPD."
        path="/confidentialite"
        noIndex
      />

      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Politique de confidentialité</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container max-w-3xl prose prose-lg">

          <h2 className="text-2xl font-semibold mt-10 mb-4">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            La présente Politique de confidentialité décrit la manière dont la société <strong className="text-foreground"><BrandName /></strong> collecte, utilise et protège les données personnelles des utilisateurs du site internet.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <BrandName /> accorde une importance particulière à la protection des données personnelles et s'engage à traiter celles-ci conformément au Règlement (UE) 2016/679 du 27 avril 2016 (RGPD) et à la loi Informatique et Libertés.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">2. Responsable du traitement</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">Les données personnelles collectées sur le site sont traitées par :</p>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground"><BrandName /></strong></li>
            <li>SAS au capital de 1 000 €</li>
            <li>Siège social : 106 Bis rue Bertrand de Goth, 33800 Bordeaux</li>
            <li>RCS Bordeaux : 942 176 884</li>
            <li>Email : <a href="mailto:contact@i-ca.re" className="text-primary hover:underline">contact@i-ca.re</a></li>
            <li>Téléphone : <a href={`tel:${ICARE_TELEPHONE_E164}`} className="text-primary hover:underline">{ICARE_TELEPHONE_AFFICHAGE}</a></li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">3. Données collectées</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">Les données susceptibles d'être collectées via le site sont :</p>

          <h3 className="text-xl font-semibold mt-8 mb-3">a) Formulaire de contact</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Prénom, nom</li>
            <li>• Adresse email</li>
            <li>• Téléphone (le cas échéant)</li>
            <li>• Contenu du message</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-3">b) Formulaire d'intérêt investisseur</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Prénom, nom</li>
            <li>• Adresse email</li>
            <li>• Téléphone (le cas échéant)</li>
            <li>• Profil investisseur</li>
            <li>• Ticket d'investissement envisagé</li>
            <li>• Zone d'intérêt</li>
            <li>• Message libre</li>
            <li>• Consentement RGPD</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-3">c) Données techniques</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Adresse IP</li>
            <li>• Données de navigation</li>
            <li>• Cookies techniques ou statistiques (selon consentement)</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">Aucune donnée sensible (santé, opinions, etc.) n'est collectée via le site.</p>

          <h3 className="text-xl font-semibold mt-8 mb-3">d) Formulaire « Décrire mon besoin » (Espace Patients)</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Prénom, nom</li>
            <li>• Adresse email</li>
            <li>• Téléphone (le cas échéant)</li>
            <li>• Spécialité ou problématique recherchée</li>
            <li>• Localisation préférentielle (quartier, cabinet)</li>
            <li>• Description libre du besoin</li>
            <li>• Consentement RGPD</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-3">e) Fiches praticien</h3>
          <p className="text-muted-foreground leading-relaxed">
            Les fiches des praticiennes et praticiens locataires des cabinets <BrandName /> sont publiées exclusivement après validation explicite et écrite de la personne concernée. Elles peuvent contenir : prénom, nom, photographie professionnelle, spécialité, biographie rédigée par la praticienne ou le praticien, ou validée par cette personne, problématiques traitées, lien externe de prise de rendez-vous (Doctolib, Crénolibre ou site personnel de la praticienne ou du praticien). Toute praticienne ou tout praticien peut à tout moment demander le retrait de sa fiche par simple email à <a href="mailto:contact@i-ca.re" className="text-primary hover:underline">contact@i-ca.re</a> ; le retrait est effectif sous 30 jours maximum.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">f) Avis Google</h3>
          <p className="text-muted-foreground leading-relaxed">
            Pour les praticiennes et praticiens disposant d'une fiche Google Business Profile publique et l'ayant signalé à <BrandName />, leur fiche Espace Patients peut afficher la note moyenne et les derniers avis publics récupérés depuis l'API Google Places. Ces avis sont la propriété de leurs auteurs et de Google ; ils sont reproduits avec mention de la source, lien direct vers la fiche Google originale, et date de dernière synchronisation. Aucune modération ni filtrage n'est opéré par <BrandName /> sur ces avis.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">4. Finalités du traitement</h2>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Répondre aux demandes envoyées via le formulaire de contact</li>
            <li>• Recontacter les personnes ayant manifesté un intérêt investisseur</li>
            <li>• Assurer le suivi des prospects investisseurs</li>
            <li>• Améliorer le fonctionnement du site</li>
            <li>• Produire des statistiques de fréquentation (si consentement)</li>
            <li>• Mettre en relation les personnes qui le souhaitent avec une praticienne ou un praticien du réseau <BrandName /> adapté à leur besoin</li>
            <li>• Présenter publiquement les praticiennes et praticiens locataires des cabinets <BrandName /> ayant validé leur fiche</li>
            <li>• Afficher les avis Google publics des praticiennes et praticiens concernés, à titre d'information vérifiable par la personne reçue</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">Aucune donnée personnelle n'est vendue ni cédée à des tiers.</p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">5. Base légale du traitement</h2>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Le consentement de la personne utilisatrice (formulaires, cookies)</li>
            <li>• L'intérêt légitime de <BrandName /> pour assurer le suivi des demandes et prospects</li>
            <li>• Le consentement explicite de la praticienne ou du praticien pour la publication de sa fiche</li>
            <li>• Le consentement de la personne reçue pour la transmission de sa demande à une ou plusieurs praticiennes ou praticiens du réseau (formulaire « Décrire mon besoin »)</li>
            <li>• L'intérêt légitime de <BrandName /> pour la mise en relation entre patientèle et réseau, et pour la présentation du réseau de locataires</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">6. Durée de conservation</h2>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">Demandes de contact :</strong> 3 ans à compter du dernier échange</li>
            <li><strong className="text-foreground">Prospects investisseurs :</strong> 5 ans à compter du dernier contact</li>
            <li><strong className="text-foreground">Données de navigation :</strong> selon la durée légale applicable aux cookies</li>
            <li><strong className="text-foreground">Demandes via le formulaire « Décrire mon besoin » :</strong> 2 ans à compter du dernier échange, ou suppression sur simple demande</li>
            <li><strong className="text-foreground">Fiches praticien :</strong> maintenues tant que la personne est locataire d'un cabinet <BrandName /> et qu'elle n'a pas demandé le retrait</li>
            <li><strong className="text-foreground">Cache local des avis Google :</strong> rafraîchi automatiquement chaque semaine, archivé 30 jours après le départ de la personne locataire puis supprimé</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">7. Hébergement et sécurité</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">Le site est hébergé par :</p>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">INFOMANIAK NETWORK SA</strong></li>
            <li>Rue Eugène-Marziano 25</li>
            <li>1227 Les Acacias (Genève), Suisse</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            <BrandName /> met en œuvre des mesures techniques et organisationnelles appropriées afin d'assurer la sécurité et la confidentialité des données.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">8. Destinataires des données</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Les données sont exclusivement destinées à <BrandName />. Elles peuvent être traitées par les sous-traitants suivants, agissant pour le compte de <BrandName /> et conformément au RGPD :
          </p>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">Hébergement et infrastructure :</strong> INFOMANIAK NETWORK SA (Suisse), Lovable (Suède), Supabase (États-Unis, clauses contractuelles types)</li>
            <li><strong className="text-foreground">API Google Places :</strong> Google Ireland Limited, pour la récupération des avis Google publics des praticiens du réseau</li>
            <li><strong className="text-foreground">Outil de routage des demandes patient :</strong> à confirmer avant la mise en ligne du formulaire conciergerie (Brevo, HubSpot ou équivalent)</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Aucune donnée patient n'est cédée à des tiers à des fins commerciales.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">9. Droits des utilisateurs</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Droit d'accès</li>
            <li>• Droit de rectification</li>
            <li>• Droit d'effacement</li>
            <li>• Droit d'opposition</li>
            <li>• Droit à la limitation du traitement</li>
            <li>• Droit à la portabilité des données</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Vous pouvez exercer ces droits en adressant votre demande à : <a href="mailto:contact@i-ca.re" className="text-primary hover:underline">contact@i-ca.re</a>
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Une réponse vous sera apportée dans un délai maximum d'un mois. Vous disposez également du droit d'introduire une réclamation auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CNIL</a>.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">10. Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            Le site peut utiliser des cookies techniques nécessaires à son fonctionnement ainsi que, le cas échéant, des cookies statistiques. L'utilisateur peut accepter ou refuser les cookies non essentiels via le bandeau de gestion des cookies affiché lors de la première visite.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-2">
            Pour plus de détails, consultez notre <Link to={localePath(lang, "cookies")} className="text-primary hover:underline">Politique de cookies</Link>.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">11. Modification de la politique</h2>
          <p className="text-muted-foreground leading-relaxed">
            <BrandName /> se réserve le droit de modifier la présente Politique de confidentialité à tout moment afin d'assurer sa conformité avec la législation en vigueur. La version en vigueur est celle publiée sur le site.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
            <em>Dernière mise à jour : à la date de mise en ligne de l'Espace Patients. Version 2, extension Espace Patients.</em>
          </p>
        </div>
      </section>
    </Layout>
  );
}

function EnVersion() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  return (
    <Layout>
      <SeoHead
        title="Privacy Policy | I‑CA.RE"
        description="I‑CA.RE privacy policy and personal data protection, compliant with GDPR."
        path="/en/privacy"
        noIndex
      />

      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container max-w-3xl prose prose-lg">

          <h2 className="text-2xl font-semibold mt-10 mb-4">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            This Privacy Policy describes how <strong className="text-foreground"><BrandName /></strong> collects, uses and protects the personal data of website users.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <BrandName /> attaches particular importance to the protection of personal data and is committed to processing it in accordance with Regulation (EU) 2016/679 of 27 April 2016 (GDPR) and the French Data Protection Act.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">2. Data Controller</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">Personal data collected on the website is processed by:</p>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground"><BrandName /></strong></li>
            <li>SAS with share capital of €1,000</li>
            <li>Registered office: 106 Bis rue Bertrand de Goth, 33800 Bordeaux, France</li>
            <li>RCS Bordeaux: 942 176 884</li>
            <li>Email: <a href="mailto:contact@i-ca.re" className="text-primary hover:underline">contact@i-ca.re</a></li>
            <li>Phone: <a href={`tel:${ICARE_TELEPHONE_E164}`} className="text-primary hover:underline">{ICARE_TELEPHONE_AFFICHAGE_INTL}</a></li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">3. Data Collected</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">Data that may be collected via the website includes:</p>

          <h3 className="text-xl font-semibold mt-8 mb-3">a) Contact form</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>• First name, last name</li>
            <li>• Email address</li>
            <li>• Phone number (where applicable)</li>
            <li>• Message content</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-3">b) Investor interest form</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>• First name, last name</li>
            <li>• Email address</li>
            <li>• Phone number (where applicable)</li>
            <li>• Investor profile</li>
            <li>• Anticipated investment ticket</li>
            <li>• Area of interest</li>
            <li>• Free-text message</li>
            <li>• GDPR consent</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-3">c) Technical data</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>• IP address</li>
            <li>• Browsing data</li>
            <li>• Technical or statistical cookies (subject to consent)</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">No sensitive data (health, opinions, etc.) is collected via the website.</p>

          <h3 className="text-xl font-semibold mt-8 mb-3">d) "Describe my need" form (Patient Space)</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>• First name, last name</li>
            <li>• Email address</li>
            <li>• Phone (if applicable)</li>
            <li>• Specialty or topic sought</li>
            <li>• Preferred location (district, practice)</li>
            <li>• Free-text description of the need</li>
            <li>• GDPR consent</li>
          </ul>

          <h3 className="text-xl font-semibold mt-8 mb-3">e) Practitioner profiles</h3>
          <p className="text-muted-foreground leading-relaxed">
            Profiles of practitioners renting <BrandName /> offices are published exclusively after the practitioner's explicit written validation. Profiles may include: first name, last name, professional photograph, specialty, biography written or validated by the practitioner, topics addressed, external booking link (Doctolib, Crénolibre or the practitioner's personal website). Practitioners may request the removal of their profile at any time by email to <a href="mailto:contact@i-ca.re" className="text-primary hover:underline">contact@i-ca.re</a>; removal is effective within 30 days.
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">f) Google Reviews</h3>
          <p className="text-muted-foreground leading-relaxed">
            For practitioners with a public Google Business Profile who have notified <BrandName />, their Patient Space profile may display the average rating and latest public reviews retrieved from the Google Places API. These reviews remain the property of their authors and Google; they are reproduced with source attribution, a direct link to the original Google profile, and the date of last synchronisation. No moderation or filtering is performed by <BrandName /> on these reviews.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">4. Purpose of Processing</h2>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Responding to enquiries sent via the contact form</li>
            <li>• Following up with persons who have expressed investor interest</li>
            <li>• Managing investor prospect tracking</li>
            <li>• Improving website functionality</li>
            <li>• Producing visitor statistics (if consented)</li>
            <li>• Connecting patients who wish to be matched with a <BrandName /> network practitioner suited to their need</li>
            <li>• Publicly presenting practitioners renting <BrandName /> offices who have validated their profile</li>
            <li>• Displaying public Google reviews of the practitioners concerned, as verifiable information for patients</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">No personal data is sold or transferred to third parties.</p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">5. Legal Basis</h2>
          <ul className="space-y-1 text-muted-foreground">
            <li>• User consent (forms, cookies)</li>
            <li>• Legitimate interest of <BrandName /> for enquiry and prospect follow-up</li>
            <li>• Explicit consent of the practitioner for the publication of their profile</li>
            <li>• Patient consent for the transmission of their request to one or more network practitioners ("Describe my need" form)</li>
            <li>• Legitimate interest of <BrandName /> for patient-practitioner matching and for presenting the network of tenant practitioners</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">6. Data Retention</h2>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">Contact enquiries:</strong> up to 3 years from last exchange</li>
            <li><strong className="text-foreground">Investor prospects:</strong> up to 5 years from last contact</li>
            <li><strong className="text-foreground">Browsing data:</strong> in accordance with applicable cookie legislation</li>
            <li><strong className="text-foreground">"Describe my need" form requests:</strong> 2 years from last exchange, or deletion on request</li>
            <li><strong className="text-foreground">Practitioner profiles:</strong> retained as long as the practitioner rents an <BrandName /> office and has not requested removal</li>
            <li><strong className="text-foreground">Local cache of Google Reviews:</strong> automatically refreshed weekly, archived for 30 days after a practitioner leaves, then deleted</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">7. Hosting and Security</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">The website is hosted by:</p>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">INFOMANIAK NETWORK SA</strong></li>
            <li>Rue Eugène-Marziano 25</li>
            <li>1227 Les Acacias (Geneva), Switzerland</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            <BrandName /> implements appropriate technical and organisational measures to ensure data security and confidentiality.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">8. Data Recipients</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Data is intended exclusively for <BrandName />. It may be processed by the following sub-processors, acting on behalf of <BrandName /> and in compliance with the GDPR:
          </p>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">Hosting and infrastructure:</strong> INFOMANIAK NETWORK SA (Switzerland), Lovable (Sweden), Supabase (United States, Standard Contractual Clauses)</li>
            <li><strong className="text-foreground">Google Places API:</strong> Google Ireland Limited, for retrieval of public Google reviews of network practitioners</li>
            <li><strong className="text-foreground">Patient request routing tool:</strong> to be confirmed before the concierge form goes live (Brevo, HubSpot or equivalent)</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            No patient data is sold or transferred to third parties for commercial purposes.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">9. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">Under the GDPR, you have the following rights:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Right of access</li>
            <li>• Right to rectification</li>
            <li>• Right to erasure</li>
            <li>• Right to object</li>
            <li>• Right to restriction of processing</li>
            <li>• Right to data portability</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            You may exercise these rights by sending your request to: <a href="mailto:contact@i-ca.re" className="text-primary hover:underline">contact@i-ca.re</a>
          </p>
          <p className="text-muted-foreground leading-relaxed">
            A response will be provided within one month. You also have the right to lodge a complaint with the <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CNIL</a>.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">10. Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            The website may use technical cookies necessary for its operation and, where applicable, statistical cookies. Users may accept or refuse non-essential cookies via the cookie management banner displayed on first visit.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-2">
            For more details, see our <Link to={localePath(lang, "cookies")} className="text-primary hover:underline">Cookie Policy</Link>.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">11. Policy Updates</h2>
          <p className="text-muted-foreground leading-relaxed">
            <BrandName /> reserves the right to amend this Privacy Policy at any time to ensure compliance with applicable legislation. The current version is that published on the website.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
            <em>Last updated: as of the Patient Space launch date. Version 2, Patient Space extension.</em>
          </p>
        </div>
      </section>
    </Layout>
  );
}
