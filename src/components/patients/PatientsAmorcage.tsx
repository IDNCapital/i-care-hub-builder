import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CartePraticienPublic } from "@/components/CartePraticienPublic";
import { SEUIL_OUVERTURE_INDEX_PATIENTS } from "@/config/patientsIndex";
import type { PraticienPublic } from "@/hooks/usePraticiensPublics";

interface Props {
  praticiens: PraticienPublic[];
}

/**
 * Mode AMORÇAGE de l'index /patients (rendu lorsque
 * nbValidées < SEUIL_OUVERTURE_INDEX_PATIENTS).
 * La page parente applique noindex,nofollow.
 */
export function PatientsAmorcage({ praticiens }: Props) {
  const nb = praticiens.length;
  return (
    <>
      {/* Hero crème */}
      <section className="pt-32 pb-20 bg-secondary/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <p className="font-body text-xs uppercase font-bold tracking-[0.2em] text-primary mb-6">
            Espace Patients — En cours de lancement
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-[56px] font-normal text-foreground leading-tight mb-6 text-balance">
            Un annuaire de spécialistes du soin et du bien-être à Bordeaux.
          </h1>
          <p className="font-heading italic text-xl md:text-[22px] text-muted-foreground leading-relaxed text-balance">
            L'annuaire ouvre publiquement quand {SEUIL_OUVERTURE_INDEX_PATIENTS}{" "}
            spécialistes ont validé leur fiche. Aujourd'hui,{" "}
            <span className="text-foreground font-medium not-italic">
              {nb} sur {SEUIL_OUVERTURE_INDEX_PATIENTS}
            </span>
            .
          </p>
        </div>
      </section>

      {/* Bloc Déjà accessibles */}
      {nb > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="font-heading text-3xl md:text-[32px] font-normal text-foreground mb-4">
                Les fiches déjà ouvertes au public
              </h2>
              <p className="font-body text-base text-muted-foreground leading-relaxed">
                Vous pouvez d'ores et déjà découvrir et contacter ces praticiennes.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {praticiens.map((p) => (
                <CartePraticienPublic
                  key={p.slug}
                  nom={`${p.prenom} ${p.nom}`}
                  photoUrl={p.photo_url}
                  specialite={p.profession}
                  problematiquesPrincipales={p.problematiques}
                  href={`/praticien/${p.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bloc Décrire mon besoin */}
      <section className="py-20 bg-secondary/40 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <p className="font-body text-xs uppercase font-bold tracking-[0.2em] text-primary mb-6">
            Conciergerie patients
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-normal text-foreground mb-6 text-balance">
            Vous cherchez la bonne personne pour vous accompagner&nbsp;?
          </h2>
          <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            Décrivez-nous votre besoin en quelques lignes. Nous vous orienterons
            vers la praticienne ou le praticien I-CA.RE le plus adapté, sans
            engagement et en toute confidentialité.
          </p>
          <Button variant="sage" size="lg" asChild>
            <Link to="/patients/decrire-mon-besoin">Décrire mon besoin</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

export default PatientsAmorcage;