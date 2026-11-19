/**
 * Lot SITE-DISPO-PRIX-1 : section de la page d'accueil qui montre, pour chaque
 * lieu ouvert a la location, les cabinets disponibles et leur prix, puis un
 * formulaire de demande de visite (source declaree et creneau souhaite).
 * Donnees et envoi : voir src/lib/demandeVisite.ts.
 */
import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Loader2, MapPin, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { InlineBrand } from "@/components/BrandName";
import { supabase } from "@/integrations/supabase/client";
import { Analytics } from "@/lib/analytics";
import { localePath } from "@/lib/routes";
import { marqueAffichee } from "@/lib/brand";
import {
  DATE_RELEVE_DISPONIBILITES,
  GRILLE_TEMPS_PARTIEL,
  MENTION_TEMPS_PARTIEL,
  MENTION_TEMPS_PLEIN,
  cheminCabinetALouer,
  formatDate,
  formatLoyer,
  libelleFormule,
  surfaceLot,
  type CabinetALouer,
  type LotALouer,
} from "@/lib/cabinetsALouer";
import {
  LIEU_A_CONSEILLER,
  MOMENTS_VISITE,
  ORDRE_CHAMPS,
  SOURCES_CONNAISSANCE,
  corpsDemandeVisite,
  lieuxAccueil,
  premiereDateVisite,
  verifierSaisie,
  type ChampVisite,
  type SaisieVisite,
} from "@/lib/demandeVisite";

export const ANCRE_DEMANDE_VISITE = "demande-visite";

/** Mention de statut d'un lot, mêmes règles que la page /cabinet-a-louer/<site>. */
function statutLot(l: LotALouer, c: CabinetALouer): string {
  if (c.disponibiliteLots) return c.disponibiliteLots;
  if (l.disponibleLe) return `Disponible le ${formatDate(l.disponibleLe)}`;
  if (l.statut === "libre") return c.ouvert ? "Libre" : "Libre, date à confirmer";
  if (l.statut === "en_travaux") return "En travaux, date à confirmer";
  return "Date à confirmer";
}

// Classes reprises de src/components/ui/input.tsx pour les listes natives.
const CLASSES_LISTE =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

function CarteLieu({ c, onVisite }: { c: CabinetALouer; onVisite: (slug: string) => void }) {
  const titreId = `lieu-${c.slug}`;
  return (
    <article aria-labelledby={titreId} className="card-premium p-5 flex flex-col">
      <h3 id={titreId} className="text-xl font-heading font-semibold mb-1">
        {marqueAffichee(c.nom)}
      </h3>
      <p className="text-sm text-muted-foreground flex items-start gap-1.5 mb-3">
        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" aria-hidden="true" />
        <span>{`${c.rue}, ${c.codePostal} ${c.ville}`}</span>
      </p>
      <p className="text-sm flex items-start gap-1.5 mb-4">
        <CalendarDays className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" aria-hidden="true" />
        <span>{c.disponibilite}</span>
      </p>
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
        À temps plein, {MENTION_TEMPS_PLEIN}
      </p>
      <ul className="divide-y divide-border border-y border-border mb-4" aria-label={`Cabinets disponibles, ${c.nomCourt}`}>
        {c.lots.map((l) => {
          const surface = surfaceLot(l);
          return (
            <li key={l.libelle} className="py-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <span className="font-medium">
                {l.nombre ? `${l.nombre} cabinets` : l.libelle}
                {surface && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground inline-flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5" aria-hidden="true" />
                    {surface}
                  </span>
                )}
              </span>
              <span className="font-semibold whitespace-nowrap">{formatLoyer(l.loyerMensuelEur)}</span>
              <span className="w-full text-xs text-muted-foreground">{statutLot(l, c)}</span>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto flex flex-col gap-3">
        <Button variant="hero" className="w-full" asChild>
          <a href={`#${ANCRE_DEMANDE_VISITE}`} onClick={() => onVisite(c.slug)}>
            Demander une visite
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </a>
        </Button>
        <Link to={cheminCabinetALouer(c)} className="text-sm font-semibold text-primary inline-flex items-center gap-1.5">
          Voir le détail du lieu <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

const SAISIE_VIDE: SaisieVisite = {
  lieu: "",
  nom: "",
  email: "",
  telephone: "",
  source: "",
  sourcePrecision: "",
  date: "",
  moment: "",
  message: "",
  consentement: false,
};

const ID_CHAMP: Record<ChampVisite, string> = {
  lieu: "visite-lieu",
  nom: "visite-nom",
  email: "visite-email",
  telephone: "visite-telephone",
  source: "visite-source",
  sourcePrecision: "visite-source-precision",
  date: "visite-date",
  moment: "visite-moment",
  consentement: "visite-consentement",
};

const ERREURS_SERVEUR: Record<string, string> = {
  rate_limited: "Une demande vient d'être envoyée avec cette adresse. Réessayez dans une minute.",
  invalid_email: "Indiquez une adresse email valide.",
  invalid_phone: "Indiquez un numéro de téléphone valide.",
};
const ERREUR_GENERIQUE = "L'envoi n'a pas abouti. Réessayez, ou écrivez à contact@i-ca.re.";

export function FormulaireDemandeVisite({
  lieux,
  lieuChoisi,
}: {
  lieux: CabinetALouer[];
  lieuChoisi: string;
}) {
  const [saisie, setSaisie] = useState<SaisieVisite>({ ...SAISIE_VIDE, lieu: lieuChoisi });
  const [honeypot, setHoneypot] = useState("");
  const [dateMin, setDateMin] = useState("");
  const [erreurs, setErreurs] = useState<Partial<Record<ChampVisite, string>>>({});
  const [erreurEnvoi, setErreurEnvoi] = useState<string | null>(null);
  const [etat, setEtat] = useState<"saisie" | "envoi" | "envoye">("saisie");
  const formRef = useRef<HTMLFormElement>(null);
  const prefixe = useId();

  // Calculée après le montage : la page est prérendue, la date du build ne vaut pas.
  useEffect(() => setDateMin(premiereDateVisite(new Date())), []);
  useEffect(() => {
    if (lieuChoisi) setSaisie((s) => ({ ...s, lieu: lieuChoisi }));
  }, [lieuChoisi]);

  const maj = <K extends keyof SaisieVisite>(champ: K, valeur: SaisieVisite[K]) => {
    setSaisie((s) => ({ ...s, [champ]: valeur }));
    if (champ in erreurs) setErreurs((e) => ({ ...e, [champ]: undefined }));
  };

  const aria = (champ: ChampVisite) =>
    erreurs[champ]
      ? ({ "aria-invalid": true, "aria-describedby": `${prefixe}-${champ}` } as const)
      : {};
  const erreur = (champ: ChampVisite) =>
    erreurs[champ] ? (
      <p id={`${prefixe}-${champ}`} className="text-sm text-destructive">
        {marqueAffichee(erreurs[champ] ?? "")}
      </p>
    ) : null;

  const envoyer = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (honeypot) return;
    setErreurEnvoi(null);
    const min = dateMin || premiereDateVisite(new Date());
    const refus = verifierSaisie(saisie, min, lieux);
    setErreurs(refus);
    const premier = ORDRE_CHAMPS.find((c) => refus[c]);
    if (premier) {
      formRef.current?.querySelector<HTMLElement>(`[id="${ID_CHAMP[premier]}"]`)?.focus();
      return;
    }
    setEtat("envoi");
    try {
      const corps = corpsDemandeVisite(
        saisie,
        { sourceUrl: window.location.href, recherche: window.location.search, honeypot },
        lieux,
      );
      const { data, error } = await supabase.functions.invoke("send-contact-lead", { body: corps });
      if (error) throw error;
      if (data?.error) {
        setErreurEnvoi(ERREURS_SERVEUR[data.error] ?? ERREUR_GENERIQUE);
        setEtat("saisie");
        return;
      }
      Analytics.formSubmission("visite-accueil", window.location.pathname);
      setEtat("envoye");
    } catch {
      setErreurEnvoi(ERREUR_GENERIQUE);
      setEtat("saisie");
    }
  };

  if (etat === "envoye") {
    return (
      <div role="status" className="card-premium p-6 text-center">
        <h3 className="text-xl font-heading font-semibold mb-2">Votre demande de visite est enregistrée</h3>
        <p className="text-muted-foreground">
          Nous revenons vers vous pour confirmer le créneau. Un accusé de réception part à l'adresse indiquée.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={envoyer} noValidate className="space-y-5" aria-label="Demande de visite">
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" name="company_url" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor={ID_CHAMP.lieu}>Lieu à visiter *</Label>
        <select
          id={ID_CHAMP.lieu}
          className={CLASSES_LISTE}
          value={saisie.lieu}
          onChange={(e) => maj("lieu", e.target.value)}
          {...aria("lieu")}
        >
          <option value="" disabled>Choisissez un lieu</option>
          {lieux.map((c) => (
            <option key={c.slug} value={c.slug}>{marqueAffichee(c.nom)}</option>
          ))}
          <option value={LIEU_A_CONSEILLER}>Je ne sais pas encore, conseillez moi</option>
        </select>
        {erreur("lieu")}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor={ID_CHAMP.nom}>Nom et prénom *</Label>
          <Input id={ID_CHAMP.nom} autoComplete="name" maxLength={200} value={saisie.nom} onChange={(e) => maj("nom", e.target.value)} {...aria("nom")} />
          {erreur("nom")}
        </div>
        <div className="space-y-2">
          <Label htmlFor={ID_CHAMP.email}>Email *</Label>
          <Input id={ID_CHAMP.email} type="email" autoComplete="email" maxLength={255} value={saisie.email} onChange={(e) => maj("email", e.target.value)} {...aria("email")} />
          {erreur("email")}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor={ID_CHAMP.telephone}>Téléphone</Label>
          <Input id={ID_CHAMP.telephone} type="tel" autoComplete="tel" maxLength={30} value={saisie.telephone} onChange={(e) => maj("telephone", e.target.value)} {...aria("telephone")} />
          {erreur("telephone")}
        </div>
        <div className="space-y-2">
          <Label htmlFor={ID_CHAMP.source}>
            Comment avez vous connu <InlineBrand>I-CA.RE</InlineBrand> ? *
          </Label>
          <select
            id={ID_CHAMP.source}
            className={CLASSES_LISTE}
            value={saisie.source}
            onChange={(e) => maj("source", e.target.value)}
            {...aria("source")}
          >
            <option value="" disabled>Choisissez une réponse</option>
            {SOURCES_CONNAISSANCE.map((o) => (
              <option key={o.code} value={o.code}>{marqueAffichee(o.libelle)}</option>
            ))}
          </select>
          {erreur("source")}
        </div>
      </div>

      {saisie.source === "autre" && (
        <div className="space-y-2">
          <Label htmlFor={ID_CHAMP.sourcePrecision}>Précisez *</Label>
          <Input id={ID_CHAMP.sourcePrecision} maxLength={200} value={saisie.sourcePrecision} onChange={(e) => maj("sourcePrecision", e.target.value)} {...aria("sourcePrecision")} />
          {erreur("sourcePrecision")}
        </div>
      )}

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium leading-none mb-2">Créneau de visite souhaité *</legend>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor={ID_CHAMP.date} className="text-muted-foreground">Date</Label>
            <Input id={ID_CHAMP.date} type="date" min={dateMin || undefined} value={saisie.date} onChange={(e) => maj("date", e.target.value)} {...aria("date")} />
            {erreur("date")}
          </div>
          <div className="space-y-2">
            <Label htmlFor={ID_CHAMP.moment} className="text-muted-foreground">Moment de la journée</Label>
            <select
              id={ID_CHAMP.moment}
              className={CLASSES_LISTE}
              value={saisie.moment}
              onChange={(e) => maj("moment", e.target.value)}
              {...aria("moment")}
            >
              <option value="" disabled>Choisissez un moment</option>
              {MOMENTS_VISITE.map((o) => (
                <option key={o.code} value={o.code}>{o.libelle}</option>
              ))}
            </select>
            {erreur("moment")}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Nous confirmons le créneau avec vous avant la visite.</p>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="visite-message">Votre activité et votre besoin (facultatif)</Label>
        <Textarea
          id="visite-message"
          rows={4}
          maxLength={3000}
          placeholder="Votre profession, le nombre de jours par semaine, la date d'installation envisagée"
          value={saisie.message}
          onChange={(e) => maj("message", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <Checkbox
            id={ID_CHAMP.consentement}
            checked={saisie.consentement}
            onCheckedChange={(v) => maj("consentement", v === true)}
            className="mt-1"
            {...aria("consentement")}
          />
          <Label htmlFor={ID_CHAMP.consentement} className="text-sm leading-relaxed cursor-pointer text-muted-foreground">
            J'accepte que mes informations soient utilisées par <InlineBrand>I-CA.RE</InlineBrand> pour organiser la visite, conformément à la{" "}
            <Link to={localePath("fr", "privacy")} className="text-primary underline underline-offset-4 hover:text-primary/80">
              politique de confidentialité
            </Link>
            . *
          </Label>
        </div>
        {erreur("consentement")}
      </div>

      {erreurEnvoi && (
        <p role="alert" className="text-sm text-destructive">
          {erreurEnvoi}
        </p>
      )}

      <Button type="submit" variant="hero" className="w-full" disabled={etat === "envoi"}>
        {etat === "envoi" ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
            Envoi en cours
          </>
        ) : (
          <>
            Demander la visite
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </>
        )}
      </Button>
    </form>
  );
}

export function SectionDisponibilitesVisite({ lieux = lieuxAccueil() }: { lieux?: CabinetALouer[] }) {
  const [lieuChoisi, setLieuChoisi] = useState("");
  if (lieux.length === 0) return null;
  const grille = GRILLE_TEMPS_PARTIEL.map((g) => `${libelleFormule(g).toLowerCase()} : ${formatLoyer(g.loyerMensuelEur)}`);

  return (
    <section id="disponibilites" className="section-padding bg-secondary" aria-labelledby="disponibilites-titre">
      <div className="container">
        <div className="text-center mb-10">
          <h2 id="disponibilites-titre" className="section-title">Cabinets disponibles et prix</h2>
          <p className="section-subtitle mx-auto">
            Les cabinets libres dans nos lieux ouverts à la location, avec leur loyer. Choisissez un lieu et demandez une visite.
          </p>
          <p className="text-xs text-muted-foreground mt-2" data-releve={DATE_RELEVE_DISPONIBILITES}>
            Disponibilités relevées le {formatDate(DATE_RELEVE_DISPONIBILITES)}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lieux.map((c) => (
            <CarteLieu key={c.slug} c={c} onVisite={setLieuChoisi} />
          ))}
        </div>

        <div className="mt-8 card-premium p-5">
          <h3 className="text-lg font-heading font-semibold mb-1">À temps partiel, dans chacun de ces lieux</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Un cabinet partagé à la journée entière, sur vos jours fixes de la semaine. Tarifs {MENTION_TEMPS_PARTIEL}.
          </p>
          <ul className="grid sm:grid-cols-3 gap-3">
            {GRILLE_TEMPS_PARTIEL.map((g, i) => (
              <li key={g.jours} className="rounded-md border border-border bg-background p-3" aria-label={grille[i]}>
                <p className="text-sm">{libelleFormule(g)}</p>
                <p className="text-xl font-bold">{formatLoyer(g.loyerMensuelEur)}</p>
              </li>
            ))}
          </ul>
        </div>

        <div id={ANCRE_DEMANDE_VISITE} className="mt-12 max-w-3xl mx-auto scroll-mt-28">
          <div className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-heading font-semibold mb-2">Demander une visite</h3>
            <p className="text-muted-foreground">
              Indiquez le lieu, le créneau qui vous convient et comment vous nous avez connus.
            </p>
          </div>
          <FormulaireDemandeVisite lieux={lieux} lieuChoisi={lieuChoisi} />
        </div>
      </div>
    </section>
  );
}
