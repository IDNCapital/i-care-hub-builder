import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartePraticienPublic } from "@/components/CartePraticienPublic";
import type { PraticienPublic } from "@/hooks/usePraticiensPublics";

interface Props {
  praticiens: PraticienPublic[];
}

const CABINETS_LABEL: Record<string, string> = {
  "i-ca-re-nansouty": "Nansouty",
  "i-ca-re-pey-berland": "Pey-Berland",
  "i-ca-re-jardin-public": "Jardin Public",
  "i-ca-re-chartrons": "Chartrons",
};

/**
 * Mode OUVERT de l'index /patients (rendu lorsque
 * nbValidées >= SEUIL_OUVERTURE_INDEX_PATIENTS, ou via FORCE_OPEN).
 * Recherche + filtres cabinet / spécialité / problématique.
 */
export function PatientsOuvert({ praticiens }: Props) {
  const [query, setQuery] = useState("");
  const [cabinets, setCabinets] = useState<Set<string>>(new Set());
  const [specialites, setSpecialites] = useState<Set<string>>(new Set());
  const [problematiques, setProblematiques] = useState<Set<string>>(new Set());

  const allCabinets = useMemo(
    () => Array.from(new Set(praticiens.map((p) => p.cabinet_slug))).sort(),
    [praticiens]
  );
  const allSpecialites = useMemo(
    () =>
      Array.from(new Set(praticiens.flatMap((p) => p.specialites ?? []))).sort(),
    [praticiens]
  );
  const allProblematiques = useMemo(
    () =>
      Array.from(new Set(praticiens.flatMap((p) => p.problematiques ?? []))).sort(),
    [praticiens]
  );

  const toggle = (set: Set<string>, value: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const filtres = cabinets.size + specialites.size + problematiques.size + (query ? 1 : 0);

  const reset = () => {
    setQuery("");
    setCabinets(new Set());
    setSpecialites(new Set());
    setProblematiques(new Set());
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return praticiens.filter((p) => {
      if (q) {
        const full = `${p.prenom} ${p.nom}`.toLowerCase();
        if (!full.includes(q)) return false;
      }
      if (cabinets.size && !cabinets.has(p.cabinet_slug)) return false;
      if (specialites.size && !(p.specialites ?? []).some((s) => specialites.has(s))) return false;
      if (problematiques.size && !(p.problematiques ?? []).some((s) => problematiques.has(s))) return false;
      return true;
    });
  }, [praticiens, query, cabinets, specialites, problematiques]);

  const Pill = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background text-foreground border-border hover:border-primary/50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* Hero crème */}
      <section className="pt-32 pb-16 bg-secondary/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <p className="font-body text-xs uppercase font-bold tracking-[0.2em] text-primary mb-6">
            Espace Patients
          </p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-[56px] font-normal text-foreground leading-tight mb-6 text-balance">
            Un réseau de spécialistes du soin et du bien-être à Bordeaux.
          </h1>
          <p className="font-heading italic text-xl md:text-[22px] text-muted-foreground leading-relaxed text-balance">
            <span className="text-foreground not-italic font-medium">{praticiens.length}</span>{" "}
            praticiennes et praticiens validés. Trouvez la personne qui correspond à votre besoin.
          </p>
        </div>
      </section>

      {/* Barre filtres sticky */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par nom…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
                aria-label="Rechercher une praticienne ou un praticien"
              />
            </div>
            {filtres > 0 && (
              <Button variant="ghost" size="sm" onClick={reset} className="gap-1">
                <X className="w-4 h-4" /> Réinitialiser
              </Button>
            )}
          </div>

          {allCabinets.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mr-1">
                Cabinet
              </span>
              {allCabinets.map((c) => (
                <Pill
                  key={c}
                  label={CABINETS_LABEL[c] ?? c}
                  active={cabinets.has(c)}
                  onClick={() => toggle(cabinets, c, setCabinets)}
                />
              ))}
            </div>
          )}

          {allSpecialites.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mr-1">
                Spécialité
              </span>
              {allSpecialites.map((s) => (
                <Pill
                  key={s}
                  label={s}
                  active={specialites.has(s)}
                  onClick={() => toggle(specialites, s, setSpecialites)}
                />
              ))}
            </div>
          )}

          {allProblematiques.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mr-1">
                Problématique
              </span>
              {allProblematiques.map((s) => (
                <Pill
                  key={s}
                  label={s}
                  active={problematiques.has(s)}
                  onClick={() => toggle(problematiques, s, setProblematiques)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Listing */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-heading italic text-xl text-muted-foreground mb-4">
                Aucun résultat ne correspond à votre recherche.
              </p>
              <Button variant="outline" onClick={reset}>
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p) => (
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
            </>
          )}
        </div>
      </section>

      {/* CTA conciergerie */}
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
            vers la praticienne ou le praticien I-CA.RE le plus adapté.
          </p>
          <Button variant="gold" size="lg" asChild>
            <Link to="/patients/decrire-mon-besoin">Décrire mon besoin</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

export default PatientsOuvert;