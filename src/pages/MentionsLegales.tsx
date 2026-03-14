import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { localePath } from "@/lib/routes";
import { BrandName } from "@/components/BrandName";

export default function MentionsLegales() {
  const { i18n } = useTranslation();
  const lang = (i18n.language === "en" ? "en" : "fr") as "fr" | "en";

  return (
    <Layout>
      <SeoHead
        title={lang === "en" ? "Legal Notice — I-CA.RE" : "Mentions légales — I-CA.RE"}
        description={lang === "en" ? "Legal notice for the I-CA.RE website: publisher, host and director of publication." : "Mentions légales du site I-CA.RE : éditeur, hébergeur et directeur de publication."}
        path={lang === "fr" ? "/mentions-legales" : "/en/legal"}
        noIndex
      />

      <section className="pt-32 pb-16 bg-secondary">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{lang === "en" ? "Legal Notice" : "Mentions légales"}</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container max-w-3xl prose prose-lg">

          {/* 1. Éditeur */}
          <h2 className="text-2xl font-semibold mt-10 mb-4">{lang === "en" ? "1. Website Publisher" : "1. Éditeur du site"}</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {lang === "en" ? "This website is published by:" : "Le présent site est édité par :"}
          </p>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">I-CA.RE</strong></li>
            <li><strong className="text-foreground">{lang === "en" ? "Legal form:" : "Forme juridique :"}</strong> {lang === "en" ? "Simplified Joint Stock Company (SAS)" : "Société par Actions Simplifiée (SAS)"}</li>
            <li><strong className="text-foreground">{lang === "en" ? "Share capital:" : "Capital social :"}</strong> 1 000 €</li>
            <li><strong className="text-foreground">{lang === "en" ? "Registered office:" : "Siège social :"}</strong> 106 B rue Bertrand de Goth, 33800 Bordeaux</li>
            <li><strong className="text-foreground">RCS Bordeaux :</strong> 942 176 884</li>
            <li><strong className="text-foreground">{lang === "en" ? "EU VAT number:" : "Numéro de TVA intracommunautaire :"}</strong> FR37942176884</li>
            <li><strong className="text-foreground">Code APE :</strong> 68.20B — {lang === "en" ? "Leasing of land and other real property" : "Location de terrains et autres biens immobiliers"}</li>
            <li><strong className="text-foreground">{lang === "en" ? "Chair:" : "Président :"}</strong> IDN CAPITAL</li>
            <li><strong className="text-foreground">{lang === "en" ? "Managing Director:" : "Directeur Général :"}</strong> Jazmin Cousins</li>
          </ul>
          <div className="mt-4 space-y-2 text-muted-foreground">
            <p><strong className="text-foreground">Email :</strong> <a href="mailto:contact@i-ca.re" className="text-primary hover:underline">contact@i-ca.re</a></p>
            <p><strong className="text-foreground">{lang === "en" ? "Phone:" : "Téléphone :"}</strong> <a href="tel:+33649808097" className="text-primary hover:underline">06 49 80 80 97</a></p>
          </div>

          {/* 2. Directeur de publication */}
          <h2 className="text-2xl font-semibold mt-10 mb-4">{lang === "en" ? "2. Director of Publication" : "2. Directeur de la publication"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {lang === "en"
              ? "The director of publication is the legal representative of I-CA.RE."
              : "Le directeur de la publication est le représentant légal de la société I-CA.RE."}
          </p>

          {/* 3. Hébergement */}
          <h2 className="text-2xl font-semibold mt-10 mb-4">{lang === "en" ? "3. Hosting" : "3. Hébergement"}</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {lang === "en" ? "The website is hosted by:" : "Le site est hébergé par :"}
          </p>
          <ul className="space-y-2 text-muted-foreground list-none pl-0">
            <li><strong className="text-foreground">INFOMANIAK NETWORK SA</strong></li>
            <li><strong className="text-foreground">{lang === "en" ? "Address:" : "Adresse :"}</strong> Rue Eugène-Marziano 25, 1227 Les Acacias (Genève), {lang === "en" ? "Switzerland" : "Suisse"}</li>
            <li><strong className="text-foreground">{lang === "en" ? "Website:" : "Site internet :"}</strong> <a href="https://www.infomaniak.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.infomaniak.com</a></li>
          </ul>

          {/* 4. Propriété intellectuelle */}
          <h2 className="text-2xl font-semibold mt-10 mb-4">{lang === "en" ? "4. Intellectual Property" : "4. Propriété intellectuelle"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {lang === "en"
              ? "All elements composing the website (text, images, graphics, logo, architecture, structure, source code, database) are the exclusive property of I-CA.RE or are subject to a right of use. Any reproduction, representation, modification, publication or adaptation, in whole or in part, of the website elements, by any means or process, is prohibited without prior written authorisation from I-CA.RE."
              : "L'ensemble des éléments composant le site (textes, images, graphismes, logo, architecture, structure, code source, base de données) est la propriété exclusive de I-CA.RE ou fait l'objet d'un droit d'utilisation. Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable de I-CA.RE."}
          </p>

          {/* 5. Responsabilité */}
          <h2 className="text-2xl font-semibold mt-10 mb-4">{lang === "en" ? "5. Liability" : "5. Responsabilité"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {lang === "en"
              ? "I-CA.RE endeavours to ensure the accuracy and currency of information published on the website. However, the company cannot guarantee the accuracy, precision or completeness of the information provided. The use of the information and content available on the website cannot under any circumstances engage the liability of I-CA.RE."
              : "I-CA.RE s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site. Toutefois, la société ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition. L'utilisation des informations et contenus disponibles sur l'ensemble du site ne saurait en aucun cas engager la responsabilité de I-CA.RE."}
          </p>

          {/* 6. Données personnelles */}
          <h2 className="text-2xl font-semibold mt-10 mb-4">{lang === "en" ? "6. Personal Data" : "6. Données personnelles"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {lang === "en"
              ? "Information relating to the processing of personal data is detailed in the "
              : "Les informations relatives au traitement des données personnelles sont détaillées dans la "}
            <Link to={localePath(lang, "privacy")} className="text-primary hover:underline">
              {lang === "en" ? "Privacy Policy" : "Politique de confidentialité"}
            </Link>
            {lang === "en" ? " available on the website." : " accessible sur le site."}
          </p>

          {/* 7. Droit applicable */}
          <h2 className="text-2xl font-semibold mt-10 mb-4">{lang === "en" ? "7. Applicable Law" : "7. Droit applicable"}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {lang === "en"
              ? "This website is subject to French law. Any dispute relating to its use shall fall within the jurisdiction of the competent French courts."
              : "Le présent site est soumis au droit français. Tout litige relatif à son utilisation relève de la compétence des juridictions françaises compétentes."}
          </p>
        </div>
      </section>
    </Layout>
  );
}
