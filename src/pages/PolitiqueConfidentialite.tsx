import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";

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
        title="Politique de confidentialité — I-CA.RE"
        description="Politique de confidentialité et protection des données personnelles d'I-CA.RE, conforme au RGPD."
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
            La présente Politique de confidentialité décrit la manière dont la société <strong className="text-foreground">I-CA.RE</strong> collecte, utilise et protège les données personnelles des utilisateurs du site internet.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            I-CA.RE accorde une importance particulière à la protection des données personnelles et s'engage à traiter celles-ci conformément au Règlement (UE) 2016/679 du 27 avril 2016 (RGPD) et à la loi Informatique et Libertés.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">2. Responsable du traitement</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">Les données personnelles collectées sur le site sont traitées par :</p>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">I-CA.RE</strong></li>
            <li>SAS au capital de 1 000 €</li>
            <li>Siège social : 106 B rue Bertrand de Goth, 33800 Bordeaux</li>
            <li>RCS Bordeaux : 942 176 884</li>
            <li>Email : <a href="mailto:contact@i-ca.re" className="text-primary hover:underline">contact@i-ca.re</a></li>
            <li>Téléphone : <a href="tel:+33649808097" className="text-primary hover:underline">06 49 80 80 97</a></li>
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

          <h2 className="text-2xl font-semibold mt-10 mb-4">4. Finalités du traitement</h2>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Répondre aux demandes envoyées via le formulaire de contact</li>
            <li>• Recontacter les personnes ayant manifesté un intérêt investisseur</li>
            <li>• Assurer le suivi des prospects investisseurs</li>
            <li>• Améliorer le fonctionnement du site</li>
            <li>• Produire des statistiques de fréquentation (si consentement)</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">Aucune donnée personnelle n'est vendue ni cédée à des tiers.</p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">5. Base légale du traitement</h2>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Le consentement de l'utilisateur (formulaires, cookies)</li>
            <li>• L'intérêt légitime de I-CA.RE pour assurer le suivi des demandes et prospects</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">6. Durée de conservation</h2>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">Demandes de contact :</strong> 3 ans à compter du dernier échange</li>
            <li><strong className="text-foreground">Prospects investisseurs :</strong> 5 ans à compter du dernier contact</li>
            <li><strong className="text-foreground">Données de navigation :</strong> selon la durée légale applicable aux cookies</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">7. Hébergement et sécurité</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">Le site est hébergé par :</p>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">INFOMANIAK NETWORK SA</strong></li>
            <li>Rue Eugène-Marziano 25</li>
            <li>1227 Les Acacias (Genève), Suisse</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            I-CA.RE met en œuvre des mesures techniques et organisationnelles appropriées afin d'assurer la sécurité et la confidentialité des données.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">8. Destinataires des données</h2>
          <p className="text-muted-foreground leading-relaxed">
            Les données sont exclusivement destinées à I-CA.RE. Elles peuvent être traitées par des prestataires techniques intervenant dans l'hébergement ou la maintenance du site, agissant en qualité de sous-traitants.
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
            I-CA.RE se réserve le droit de modifier la présente Politique de confidentialité à tout moment afin d'assurer sa conformité avec la législation en vigueur. La version en vigueur est celle publiée sur le site.
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
      <Helmet>
        <title>Privacy Policy — I-CA.RE</title>
        <meta name="description" content="I-CA.RE privacy policy and personal data protection, compliant with GDPR." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container max-w-3xl prose prose-lg">

          <h2 className="text-2xl font-semibold mt-10 mb-4">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            This Privacy Policy describes how <strong className="text-foreground">I-CA.RE</strong> collects, uses and protects the personal data of website users.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            I-CA.RE attaches particular importance to the protection of personal data and is committed to processing it in accordance with Regulation (EU) 2016/679 of 27 April 2016 (GDPR) and the French Data Protection Act.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">2. Data Controller</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">Personal data collected on the website is processed by:</p>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">I-CA.RE</strong></li>
            <li>SAS with share capital of €1,000</li>
            <li>Registered office: 106 B rue Bertrand de Goth, 33800 Bordeaux, France</li>
            <li>RCS Bordeaux: 942 176 884</li>
            <li>Email: <a href="mailto:contact@i-ca.re" className="text-primary hover:underline">contact@i-ca.re</a></li>
            <li>Phone: <a href="tel:+33649808097" className="text-primary hover:underline">+33 6 49 80 80 97</a></li>
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

          <h2 className="text-2xl font-semibold mt-10 mb-4">4. Purpose of Processing</h2>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Responding to enquiries sent via the contact form</li>
            <li>• Following up with persons who have expressed investor interest</li>
            <li>• Managing investor prospect tracking</li>
            <li>• Improving website functionality</li>
            <li>• Producing visitor statistics (if consented)</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">No personal data is sold or transferred to third parties.</p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">5. Legal Basis</h2>
          <ul className="space-y-1 text-muted-foreground">
            <li>• User consent (forms, cookies)</li>
            <li>• Legitimate interest of I-CA.RE for enquiry and prospect follow-up</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">6. Data Retention</h2>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">Contact enquiries:</strong> up to 3 years from last exchange</li>
            <li><strong className="text-foreground">Investor prospects:</strong> up to 5 years from last contact</li>
            <li><strong className="text-foreground">Browsing data:</strong> in accordance with applicable cookie legislation</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-10 mb-4">7. Hosting and Security</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">The website is hosted by:</p>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">INFOMANIAK NETWORK SA</strong></li>
            <li>Rue Eugène-Marziano 25</li>
            <li>1227 Les Acacias (Geneva), Switzerland</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-4">
            I-CA.RE implements appropriate technical and organisational measures to ensure data security and confidentiality.
          </p>

          <h2 className="text-2xl font-semibold mt-10 mb-4">8. Data Recipients</h2>
          <p className="text-muted-foreground leading-relaxed">
            Data is intended exclusively for I-CA.RE. It may be processed by technical service providers involved in hosting or website maintenance, acting as sub-processors.
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
            I-CA.RE reserves the right to amend this Privacy Policy at any time to ensure compliance with applicable legislation. The current version is that published on the website.
          </p>
        </div>
      </section>
    </Layout>
  );
}
