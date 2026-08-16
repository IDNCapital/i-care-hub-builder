import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { InlineBrand } from "@/components/BrandName";
import { localePath } from "@/lib/routes";
import { deontologie, resoudreSources } from "@/lib/deontologie";
import type { NiveauInstance, StatutJuridique } from "@/lib/deontologie";
import { Armchair, CalendarCheck, DoorClosed, Signpost, Volume2 } from "lucide-react";

/**
 * Ressources : exercer en bureau privé dans un lieu pluridisciplinaire.
 *
 * Route publique depuis le lot 3 du sprint 12 : indexable, au sitemap, liee
 * depuis les fiches projet francaises et depuis /professionnels.
 * Page monolingue française, montée dans le seul groupe de routes FR : la langue
 * des cibles de lien est donc fixée à "fr" plutôt que lue de i18n.
 *
 * Toute donnée juridique vient de src/lib/deontologie.ts. Les blocs juridiques y
 * sont encore vides, donc masqués : ils attendent la validation du conseil.
 * Une entrée non renseignée masque son bloc, titre compris. Aucun texte de repli.
 *
 * La copie vit en constantes et non en texte JSX : le retour à la ligne du source
 * avalerait les espaces insécables de la typographie française.
 */

const CANONICAL_PATH = "/ressources/exercer-en-lieu-pluridisciplinaire";

const TITLE = "Exercer en bureau privé dans un lieu pluridisciplinaire | I-CA.RE";

/** Description definitive, arretee hors developpement. */
const DESCRIPTION =
  "Bureaux privés en lieu de soin pluriprofessionnel : ce que nous séparons, ce que prévoit notre bail, et les questions à poser avant de signer.";

const SURTITRE = "Ressources";

const H1 = "Exercer en bureau privé dans un lieu pluridisciplinaire";

const CHAPO =
  "L’objection revient à chaque visite : « je ne peux pas m’installer ici, il y a des praticiens non réglementés, mon ordre refusera ». Elle est sérieuse, et nous ne la contredisons pas. Cette page ne tranche pas la question déontologique, qui appartient à votre ordre. Elle expose ce que nous séparons dans nos lieux, ce que prévoit notre bail, et les textes et contacts utiles pour poser vous-même la question.";

const MENTION_COURTE =
  "Cette page décrit notre offre et renvoie à des textes publics. Elle ne constitue ni un conseil juridique ni un avis déontologique.";

const STATUTS_TITRE = "Trois statuts sous un seul mot";

const STATUTS_PROSE =
  "Un même mot, « thérapeute », sert à désigner des situations juridiques qui n’ont rien de commun. Ce mot n’est pas une catégorie du droit, et c’est de cette imprécision que naît le malentendu sur le partage de locaux. Trois ensembles se distinguent, et ils n’obéissent pas aux mêmes règles.";

const STATUTS_CLOTURE =
  "Aucune hiérarchie de valeur n’est ici en cause. Ces trois ensembles n’obéissent simplement pas aux mêmes règles, et c’est la règle de votre profession qui décide, pas la nôtre.";

const STATUTS: { cle: StatutJuridique["cle"]; titre: string; prose: string }[] = [
  {
    cle: "professions-de-sante",
    titre: "Les professions de santé au sens du code de la santé publique",
    prose:
      "Leur exercice est encadré par le code, leurs obligations déontologiques y sont inscrites, et plusieurs d’entre elles relèvent d’un ordre professionnel qui apprécie les situations individuelles.",
  },
  {
    cle: "titres-reglementes",
    titre: "Les titres réglementés hors du champ des professions de santé",
    prose:
      "Le titre est protégé et son usage est encadré, parfois subordonné à un enregistrement. Pour autant, la profession n’appartient pas aux professions de santé du code : un titre réglementé n’est pas synonyme de profession de santé, et cette nuance change la lecture.",
  },
  {
    cle: "pratiques-non-reglementees",
    titre: "Les activités qui ne constituent pas une profession de santé réglementée",
    prose:
      "Leur exercice n’est généralement pas subordonné à la possession d’un diplôme d’État spécifique, sous réserve des autres qualifications que le praticien détient par ailleurs. Leur présentation au public doit rester exacte quant à la qualification réellement détenue, à la nature non médicale de la prestation et aux bénéfices qui peuvent raisonnablement en être attendus.",
  },
];

const SEPARATIONS_TITRE = "Ce que nous séparons, dans nos lieux";

const SEPARATIONS_PROSE = "Voici ce qui existe matériellement dans nos lieux, au présent.";

const SEPARATIONS = [
  {
    icone: DoorClosed,
    texte: "Chaque praticien dispose d’un bureau privé qui lui est réservé.",
  },
  {
    icone: Armchair,
    texte:
      "Les salles d’attente peuvent être sectorisées, avec des espaces distincts et fléchés par praticien. L’affectation des espaces dépend du site et figure au plan annexé au bail.",
  },
  {
    icone: Signpost,
    texte:
      "L’affichage, la signalétique intérieure et les plaques sont individuels. Aucune dénomination commune n’agrège les professions présentes.",
  },
  {
    icone: Volume2,
    texte:
      "Les bureaux sont séparés par des cloisons à isolement acoustique renforcé, et les rangements permettent la fermeture des dossiers. Les dispositions constructives retenues figurent sur la fiche du lieu concerné, remise avec le bail.",
  },
  {
    icone: CalendarCheck,
    texte:
      "L’accueil et la prise de rendez-vous restent neutres : aucune orientation automatique, aucun accès généralisé aux agendas ou aux dossiers.",
  },
];

const SEPARATIONS_CITATION =
  "Ces aménagements relèvent de l’organisation d’un lieu. Ils ne préjugent pas de l’appréciation que portera un ordre professionnel.";

const BAIL_TITRE = "Ce que prévoit notre bail";

const BAIL_INTRO =
  "Ce qui suit décrit notre modèle contractuel. Ce n’est pas l’énoncé d’interdictions légales qui s’imposeraient à toutes les professions.";

const BAIL_COURANT = [
  "Un bail individuel par praticien, à son nom propre ou à celui de sa structure d’exercice. Pas de convention d’exercice, pas de sous-location en cascade.",
  "Un loyer fixe, indépendant du chiffre d’affaires. Aucune redevance assise sur les honoraires, à aucun moment du contrat.",
  "Aucune société d’exercice commune, aucun partage d’honoraires, aucune recette mutualisée. Sont mutualisés des charges de fonctionnement et des espaces communs.",
  "Aucune orientation organisée des patients entre praticiens du lieu, aucune prime liée à l’orientation ou au remplissage.",
];

const BAIL_MIS_EN_VALEUR = [
  "Une destination contractuelle précise : un cabinet professionnel autonome, et non une destination générique autorisant toute activité commerciale.",
  "Un bail écrit, remis suffisamment tôt pour que vous puissiez accomplir vos propres démarches avant de signer. Lorsque les textes applicables à votre profession prévoient la communication du contrat ou permettent l’examen préalable d’un projet, nous vous remettons les documents nécessaires afin que vous accomplissiez personnellement cette démarche auprès de l’instance compétente.",
];

const BAIL_CLOTURE =
  "Nous remettons un contrat transmissible. Nous ne le transmettons pas et nous ne sollicitons aucun avis en votre nom.";

const VERIFICATIONS_TITRE = "Ce que vous vérifiez de votre côté";

const VERIFICATIONS_PROSE =
  "Trois vérifications vous appartiennent. Elles ne se délèguent pas, et nous ne les faisons pas à votre place.";

const PALIERS_PROSE =
  "L’appréciation ne porte pas sur la proximité physique en elle-même, mais sur le degré d’intégration du lieu et sur ce qu’il donne à voir. Les configurations se lisent par paliers, de la simple adresse commune au dossier ou au parcours commun.";

const PALIERS_TITRE = "Les paliers d’intégration";

const PALIERS_CLOTURE =
  "Plus le degré d’intégration est élevé, plus la question mérite d’être posée avant de signer.";

const REGLE_TITRE = "La règle propre à votre profession";

const REGLE_PROSE =
  "Chaque profession a ses propres textes, et toutes ne relèvent pas d’un ordre professionnel : certaines relèvent d’une autre autorité, d’autres d’aucune. Les positions publiées, lorsqu’elles existent, diffèrent sensiblement de l’une à l’autre, et certaines ont été modifiées récemment. Une position publiée par un ordre porte une date : elle peut évoluer, et c’est sa version en vigueur au moment de votre installation qui compte. Elle éclaire la pratique de l’instance concernée, elle ne vaut pas règle générale.";

const CONTRAT_TITRE = "Le contrat";

const CONTRAT_PROSE =
  "Selon votre profession, votre contrat ou votre projet d’installation peut devoir être communiqué à un ordre professionnel ou à une autre autorité compétente. Certaines professions ne relèvent d’aucun ordre. Les textes, l’autorité destinataire et les délais diffèrent d’une profession à l’autre.";

/** Phrase deictique : elle ne s'affiche que si obligationsContrat est renseigne. */
const CONTRAT_PROSE_LISTE =
  "Ils figurent ci-dessous, profession par profession.";

const CONTRAT_PROSE_FIN = "Cette démarche vous appartient.";

const APPRECIATION_TITRE = "L’appréciation locale";

const APPRECIATION_PROSE =
  "Elle appartient à l’instance compétente pour votre profession, lorsqu’il en existe une. Selon les professions, cette instance est départementale, régionale ou interrégionale.";

/** Phrase deictique : elle ne s'affiche que si instancesCompetentes est renseigne. */
const APPRECIATION_PROSE_LISTE =
  "Les coordonnées ci-dessous sont celles des instances compétentes pour la Gironde et la Haute-Garonne, avec leur niveau et leur date de vérification.";

const CHECKLIST_TITRE = "Avant de signer";

const CHECKLIST_PROSE = "Les questions à poser, dans l’ordre où elles se posent.";

const VERIFICATIONS_CLOTURE =
  "Nous ne demandons à personne de passer outre l’avis de l’autorité dont il relève. Si une réserve est formulée sur une clause de notre bail, nous en étudions l’ajustement avant signature.";

const FAQ_TITRE = "Questions fréquentes";

const QUESTIONS: {
  cle: string;
  question: string;
  reponse: string;
  /** Phrase deictique : elle ne s'affiche que si la liste nommee est renseignee. */
  reponseSi?: { liste: "positionsOrdinales" | "obligationsContrat"; texte: string };
  /** Suite de la reponse, toujours affichee, apres la phrase conditionnelle. */
  reponseFin?: string;
}[] = [
  {
    cle: "installation-praticiens-non-reglementes",
    question:
      "Puis-je m’installer dans un lieu où exercent des praticiens non réglementés ?",
    reponse:
      "Il n’existe pas de régime juridique unique applicable à toutes les professions et à toutes les formes de partage de locaux. La compatibilité d’une installation dépend des textes propres à chaque profession, de la configuration des espaces et, le cas échéant, de l’appréciation de l’autorité compétente. Nous vous remettons le bail et les plans pour que vous puissiez lui poser la question.",
  },
  {
    cle: "regle-identique-toutes-professions",
    question: "La règle est-elle la même pour toutes les professions de santé ?",
    reponse:
      "Non. Chaque profession a ses propres textes, et toutes ne relèvent pas d’un ordre. Les obligations, l’autorité destinataire et les délais diffèrent d’une profession à l’autre, et certains ont changé récemment.",
    reponseSi: {
      liste: "positionsOrdinales",
      texte:
        "Les textes applicables et les positions publiées, avec leur date, figurent dans la section « Ce que vous vérifiez de votre côté ».",
    },
  },
  {
    cle: "salles-attente-separees",
    question: "Les salles d’attente sont-elles séparées ?",
    reponse:
      "Nos lieux permettent des espaces d’attente distincts et fléchés par praticien, et la possibilité de réaffecter une zone lorsque l’exigence d’un nouvel occupant le demande. L’affectation des espaces dépend du site : elle se lit sur le plan annexé au bail du lieu concerné, que nous remettons avant signature.",
  },
  {
    cle: "separation-suffit-question-deontologique",
    question: "Cette séparation suffit-elle à lever la question déontologique ?",
    reponse:
      "Non. La sectorisation des attentes et des affichages est une mesure d’organisation, prudente et utile, mais elle ne neutralise pas les règles propres à chaque profession. La compatibilité d’une installation s’apprécie sur l’ensemble de la configuration, sur ce que le lieu donne à voir et sur les textes applicables à votre profession. Cette appréciation appartient à l’autorité dont vous relevez, pas à nous, et elle ne se déduit pas d’un plan.",
  },
  {
    cle: "ordre-examen-bail",
    question: "Mon ordre doit-il examiner mon bail ?",
    reponse:
      "Cela dépend de votre profession. Selon les textes qui vous sont applicables, votre contrat peut devoir être communiqué à un ordre ou à une autre autorité, et un projet peut parfois être soumis avant signature.",
    reponseSi: {
      liste: "obligationsContrat",
      texte:
        "Les textes, l’autorité destinataire et les délais figurent plus haut, profession par profession.",
    },
    reponseFin:
      "La démarche vous appartient : nous ne saisissons aucune instance en votre nom.",
  },
  {
    cle: "bail-commercial-local-commercial",
    question:
      "Un bail commercial fait-il de mon cabinet un « local commercial » au sens déontologique ?",
    reponse:
      "Ce sont deux notions distinctes. Le bail commercial décrit un régime contractuel, tandis que le « local commercial » des codes de déontologie vise la nature du lieu et ses conditions d’exploitation. Le régime du bail ne détermine donc pas à lui seul la lecture déontologique, qui s’attache à la destination écrite, à l’activité réellement exercée et à ce que le lieu donne à voir. Cette lecture appartient à votre ordre.",
  },
  {
    cle: "loyer-niveau-activite",
    question: "Le loyer peut-il dépendre de mon niveau d’activité ?",
    reponse:
      "Non, et notre bail l’exclut. Le loyer est fixe, déterminé par la surface, la durée d’occupation et les services immobiliers. Aucune redevance assise sur les honoraires, le chiffre d’affaires ou le nombre de patients n’est prévue, à aucun moment du contrat.",
  },
  {
    cle: "plaque-signaletique-commune",
    question: "Y a-t-il une plaque ou une signalétique commune ?",
    reponse:
      "L’affichage, la signalétique intérieure et les plaques sont individuels : nom, titre exact et qualité de chaque praticien. Le lieu porte un nom d’adresse, jamais une dénomination qui agrégerait les professions présentes ou laisserait croire à une équipe constituée. Avant toute signalétique ou mention publique vous concernant, nous vérifions le titre employé, les justificatifs de qualification lorsqu’ils sont requis, l’inscription ou l’enregistrement applicable, l’assurance de responsabilité civile professionnelle, et la cohérence entre l’activité annoncée et la destination du bail. Cette vérification ne fait de nous ni une autorité professionnelle ni un garant : elle limite le risque d’une présentation inexacte.",
  },
  {
    cle: "lien-juridique-entre-praticiens",
    question: "Suis-je juridiquement lié aux autres praticiens du lieu ?",
    reponse:
      "La seule occupation d’un même site ne crée pas, par elle-même, une association professionnelle, une société d’exercice ou une responsabilité commune entre praticiens. Chaque praticien signe un bail individuel, à son nom propre ou à celui de sa structure d’exercice, et il n’existe ni société d’exercice commune, ni partage d’honoraires, ni recette mutualisée. Chaque occupant demeure toutefois tenu par son propre contrat et par les règles applicables aux espaces communs, aux charges et au règlement intérieur.",
  },
];

const MENTION_PIED =
  "Cette page décrit l’offre immobilière d’I-CA.RE et renvoie à des textes publics ainsi qu’à des positions professionnelles publiées, reproduits avec leur date. Elle ne constitue ni un conseil juridique, ni un avis déontologique, ni une garantie de conformité. I-CA.RE est bailleur : nous ne sommes partie à aucune relation ordinale, nous ne saisissons aucun ordre au nom de qui que ce soit, et l’appréciation de votre situation appartient à l’autorité compétente pour votre profession, lorsqu’il en existe une.";

const CTA_CONTACT = "Nous écrire";

const CTA_LIEUX = "Voir les lieux disponibles";

/** Libellé du niveau d'une instance. Vocabulaire repris de la copie de la section. */
const LIBELLE_NIVEAU: Record<NiveauInstance, string> = {
  national: "instance nationale",
  regional: "instance régionale",
  interregional: "instance interrégionale",
  departemental: "instance départementale",
};

/** Références discrètes en pied de bloc. Rien ne s'affiche si la liste est vide. */
function Sources({ ids }: { ids: string[] }) {
  const sources = resoudreSources(ids);
  if (sources.length === 0) return null;

  return (
    <ul className="mt-4 space-y-1 text-sm text-[#6B6B6B]">
      {sources.map((source) => (
        <li key={source.id}>
          <a
            href={source.url}
            className="text-foreground underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            {source.intitule}
          </a>
          {source.date ? `, ${source.date}` : null}
        </li>
      ))}
    </ul>
  );
}

/** Un des trois statuts. Titre et prose toujours affichés, données masquées si vides. */
function BlocStatut({
  cle,
  titre,
  prose,
}: {
  cle: StatutJuridique["cle"];
  titre: string;
  prose: string;
}) {
  const statut = deontologie.statuts.find((s) => s.cle === cle);
  const professions = statut?.professions ?? [];
  const sources = statut?.sources ?? [];

  return (
    <div className="rounded-2xl bg-background p-6 md:p-8">
      <h3 className="font-heading font-normal text-xl md:text-2xl text-foreground mb-3">
        {titre}
      </h3>
      <p className="text-foreground leading-relaxed">{prose}</p>
      {professions.length > 0 && (
        <ul className="mt-4 space-y-1 text-foreground">
          {professions.map((profession) => (
            <li key={profession}>{profession}</li>
          ))}
        </ul>
      )}
      <Sources ids={sources} />
    </div>
  );
}

export default function RessourcesLieuPluridisciplinaire() {
  const { dateMiseAJour, mentionTransparence } = deontologie;
  const niveaux = deontologie.niveauxIntegration;
  const positions = deontologie.positionsOrdinales;
  const obligations = deontologie.obligationsContrat;
  const instances = deontologie.instancesCompetentes.filter((i) => i.dateVerification);
  const checklist = deontologie.checklistAvantSignature;

  /** Une phrase deictique ne s'affiche que si la liste vers laquelle elle pointe est remplie. */
  const listeRenseignee = (liste: "positionsOrdinales" | "obligationsContrat") =>
    liste === "positionsOrdinales" ? positions.length > 0 : obligations.length > 0;

  const sourcesFaq = (cle: string) =>
    deontologie.referencesFaq.find((r) => r.cle === cle)?.sources ?? [];

  return (
    <Layout>
      <SeoHead title={TITLE} description={DESCRIPTION} path={CANONICAL_PATH} />

      {/* D.1 En-tête */}
      <section id="entete" className="pt-28 pb-12 md:pt-32 md:pb-16 bg-background">
        <div className="container">
          <div className="max-w-3xl">
            {/* Surtitre : anthracite pour tenir 4,5:1 sur creme, sauge porte par le filet */}
            <span className="flex items-center font-sans font-bold uppercase tracking-[0.15em] text-xs text-foreground mb-6">
              <span aria-hidden="true" className="mr-3 h-[2px] w-6 bg-primary" />
              {SURTITRE}
            </span>
            <h1 className="font-heading font-normal text-[40px] md:text-[48px] leading-[1.15] text-foreground mb-6">
              {H1}
            </h1>
            <p className="font-heading italic text-[20px] md:text-[22px] leading-relaxed text-foreground mb-8">
              {CHAPO}
            </p>
            <div className="text-sm text-[#6B6B6B]">
              <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-4">
                {dateMiseAJour && <span>Mis à jour le {dateMiseAJour}</span>}
                <span>{MENTION_COURTE}</span>
              </div>
              {mentionTransparence && <p className="mt-2 italic">{mentionTransparence}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* D.2 Trois statuts sous un seul mot */}
      <section id="statuts" className="py-16 md:py-20 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="font-heading font-normal text-3xl md:text-4xl text-foreground mb-6">
              {STATUTS_TITRE}
            </h2>
            <p className="text-foreground leading-relaxed mb-10">{STATUTS_PROSE}</p>
            <div className="space-y-6">
              {STATUTS.map((statut) => (
                <BlocStatut
                  key={statut.cle}
                  cle={statut.cle}
                  titre={statut.titre}
                  prose={statut.prose}
                />
              ))}
            </div>
            <p className="text-foreground leading-relaxed mt-10">{STATUTS_CLOTURE}</p>
          </div>
        </div>
      </section>

      {/* D.3 Ce que nous séparons, dans nos lieux */}
      <section id="separations" className="py-16 md:py-20 bg-background">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="font-heading font-normal text-3xl md:text-4xl text-foreground mb-6">
              {SEPARATIONS_TITRE}
            </h2>
            <p className="text-foreground leading-relaxed mb-10">{SEPARATIONS_PROSE}</p>
            <ul className="space-y-5">
              {SEPARATIONS.map(({ icone: Icone, texte }) => (
                <li key={texte} className="flex gap-4">
                  <span
                    className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-[#E2EAE5]"
                    aria-hidden="true"
                  >
                    <Icone className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  </span>
                  <span className="text-foreground leading-relaxed pt-2">{texte}</span>
                </li>
              ))}
            </ul>
            <blockquote className="mt-10 border-l-[3px] border-primary pl-6 font-heading italic text-2xl leading-[1.5] text-foreground">
              {SEPARATIONS_CITATION}
            </blockquote>
          </div>
        </div>
      </section>

      {/* D.4 Ce que prévoit notre bail */}
      <section id="bail" className="py-16 md:py-20 bg-secondary">
        <div className="container">
          <div className="max-w-4xl">
            <h2 className="font-heading font-normal text-3xl md:text-4xl text-foreground mb-6">
              {BAIL_TITRE}
            </h2>
            <p className="text-foreground leading-relaxed mb-10">{BAIL_INTRO}</p>
            <div className="grid gap-6 md:grid-cols-2">
              {BAIL_COURANT.map((point) => (
                <p key={point} className="text-foreground leading-relaxed">
                  {point}
                </p>
              ))}
              {BAIL_MIS_EN_VALEUR.map((point) => (
                <p
                  key={point}
                  className="md:col-span-2 rounded-2xl bg-[#E2EAE5] p-6 text-foreground leading-relaxed"
                >
                  {point}
                </p>
              ))}
            </div>
            <p className="text-foreground leading-relaxed mt-10">{BAIL_CLOTURE}</p>
          </div>
        </div>
      </section>

      {/* D.5 Ce que vous vérifiez de votre côté */}
      <section
        id="verifications"
        className="py-16 md:py-20 bg-secondary border-t border-border"
      >
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="font-heading font-normal text-3xl md:text-4xl text-foreground mb-6">
              {VERIFICATIONS_TITRE}
            </h2>
            <p className="text-foreground leading-relaxed mb-10">{VERIFICATIONS_PROSE}</p>

            {niveaux.length > 0 && (
              <div className="mb-12">
                <p className="text-foreground leading-relaxed mb-6">{PALIERS_PROSE}</p>
                <h3 className="font-heading font-normal text-xl md:text-2xl text-foreground mb-4">
                  {PALIERS_TITRE}
                </h3>
                <ul className="space-y-4">
                  {niveaux.map((niveau) => (
                    <li
                      key={niveau.rang}
                      className="rounded-2xl bg-background p-5 md:grid md:grid-cols-[12rem_1fr] md:gap-6"
                    >
                      <span className="block font-sans font-bold text-foreground">
                        {niveau.intitule}
                      </span>
                      <span className="block text-foreground leading-relaxed">
                        {niveau.lecture}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-foreground leading-relaxed mt-6">{PALIERS_CLOTURE}</p>
              </div>
            )}

            <div className="space-y-12">
              <div>
                <h3 className="font-heading font-normal text-xl md:text-2xl text-foreground mb-3">
                  {REGLE_TITRE}
                </h3>
                <p className="text-foreground leading-relaxed">{REGLE_PROSE}</p>
                {positions.length > 0 && (
                  <ul className="mt-6 space-y-4">
                    {positions.map((position) => (
                      <li key={`${position.ordre}-${position.intitule}`}>
                        <span className="block font-sans font-bold text-foreground">
                          {position.ordre}
                        </span>
                        <a
                          href={position.url}
                          className="text-foreground underline underline-offset-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {position.intitule}
                        </a>
                        <span className="block text-sm text-[#6B6B6B]">
                          {position.date}
                          {position.portee === "departementale"
                            ? ", position départementale"
                            : ", position nationale"}
                        </span>
                        <Sources ids={position.sources} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h3 className="font-heading font-normal text-xl md:text-2xl text-foreground mb-3">
                  {CONTRAT_TITRE}
                </h3>
                <p className="text-foreground leading-relaxed">
                  {[CONTRAT_PROSE, obligations.length > 0 ? CONTRAT_PROSE_LISTE : null, CONTRAT_PROSE_FIN]
                    .filter(Boolean)
                    .join(" ")}
                </p>
                {obligations.length > 0 && (
                  <ul className="mt-6 space-y-4">
                    {obligations.map((obligation) => (
                      <li key={obligation.intitule}>
                        <a
                          href={obligation.url}
                          className="text-foreground underline underline-offset-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {obligation.intitule}
                        </a>
                        {obligation.profession && (
                          <span className="block text-sm text-[#6B6B6B]">
                            {obligation.profession}
                          </span>
                        )}
                        {obligation.autorite && (
                          <span className="block text-sm text-[#6B6B6B]">
                            {obligation.autorite}
                          </span>
                        )}
                        {obligation.delai && (
                          <span className="block text-sm text-[#6B6B6B]">
                            {obligation.delai}
                          </span>
                        )}
                        {obligation.avisAvantSignature && (
                          <span className="block text-sm text-[#6B6B6B]">
                            {obligation.avisAvantSignature}
                          </span>
                        )}
                        <Sources ids={obligation.sources} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h3 className="font-heading font-normal text-xl md:text-2xl text-foreground mb-3">
                  {APPRECIATION_TITRE}
                </h3>
                <p className="text-foreground leading-relaxed">
                  {[APPRECIATION_PROSE, instances.length > 0 ? APPRECIATION_PROSE_LISTE : null]
                    .filter(Boolean)
                    .join(" ")}
                </p>
                {instances.length > 0 && (
                  <ul className="mt-6 space-y-4">
                    {instances.map((instance) => (
                      <li key={`${instance.ordre}-${instance.departement}`}>
                        <span className="block font-sans font-bold text-foreground">
                          {instance.ordre}, {instance.departement}
                        </span>
                        <span className="block text-sm text-[#6B6B6B]">
                          {LIBELLE_NIVEAU[instance.niveau]}
                        </span>
                        {instance.professions.length > 0 && (
                          <span className="block text-sm text-[#6B6B6B]">
                            {instance.professions.join(", ")}
                          </span>
                        )}
                        {instance.adresse && (
                          <span className="block text-foreground">{instance.adresse}</span>
                        )}
                        {instance.telephone && (
                          <span className="block text-foreground">{instance.telephone}</span>
                        )}
                        {instance.email && (
                          <a
                            href={`mailto:${instance.email}`}
                            className="block text-foreground underline underline-offset-2"
                          >
                            {instance.email}
                          </a>
                        )}
                        {instance.url && (
                          <a
                            href={instance.url}
                            className="block text-foreground underline underline-offset-2"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {instance.url}
                          </a>
                        )}
                        <span className="block text-sm text-[#6B6B6B]">
                          Coordonnées vérifiées le {instance.dateVerification}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {checklist.length > 0 && (
              <div className="mt-12 rounded-2xl bg-cream border-l-[3px] border-primary p-6 md:p-8">
                <h3 className="font-heading font-normal text-xl md:text-2xl text-foreground mb-3">
                  {CHECKLIST_TITRE}
                </h3>
                <p className="text-foreground leading-relaxed mb-4">{CHECKLIST_PROSE}</p>
                {/* Marqueur discret et filet entre les items : une liste de verification
                    se parcourt du regard. Pas de numero, le compte ne s'affiche pas. */}
                <ol className="text-foreground">
                  {checklist.map((question) => (
                    <li
                      key={question.rang}
                      className="flex gap-3 border-t border-primary/25 py-3 first:border-t-0 first:pt-0"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-[1px] bg-primary"
                      />
                      <span className="leading-relaxed">{question.intitule}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <p className="text-foreground leading-relaxed mt-12">{VERIFICATIONS_CLOTURE}</p>
          </div>
        </div>
      </section>

      {/* D.6 Questions fréquentes */}
      <section id="faq" className="py-16 md:py-20 bg-background">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="font-heading font-normal text-3xl md:text-4xl text-foreground mb-10">
              {FAQ_TITRE}
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              {QUESTIONS.map((item) => (
                <AccordionItem
                  key={item.cle}
                  value={item.cle}
                  className="bg-secondary rounded-2xl px-6 border-none"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline py-5">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent
                    forceMount
                    className="text-foreground leading-relaxed pb-5"
                  >
                    {[
                      item.reponse,
                      item.reponseSi && listeRenseignee(item.reponseSi.liste)
                        ? item.reponseSi.texte
                        : null,
                      item.reponseFin,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    <Sources ids={sourcesFaq(item.cle)} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* D.7 Pied de page de la page */}
      <section id="pied" className="py-14 md:py-16 bg-[#E2EAE5]">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-foreground leading-relaxed">
              <InlineBrand>{MENTION_PIED}</InlineBrand>
            </p>
            {dateMiseAJour && (
              <p className="mt-4 text-sm text-foreground">Mis à jour le {dateMiseAJour}</p>
            )}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to={localePath("fr", "contact")}
                className="inline-flex items-center justify-center rounded-md bg-foreground px-8 py-4 font-sans font-bold text-background transition-colors hover:bg-foreground/90"
              >
                {CTA_CONTACT}
              </Link>
              <Link
                to={localePath("fr", "projects")}
                className="inline-flex items-center justify-center rounded-md border border-foreground/40 px-8 py-4 font-sans font-bold text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                {CTA_LIEUX}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
