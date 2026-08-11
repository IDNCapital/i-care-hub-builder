import { useMemo, useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { PraticienPublic } from "@/hooks/usePraticiensPublics";
import {
  SPECIALITY_GROUPS,
  PROBLEMATIQUE_GROUPS,
  PUBLIC_CIBLE_GROUPS,
  CABINETS_LABEL,
  norm,
  matchSpecialite,
  getPraticienProblematiqueTags,
} from "@/lib/taxonomy";
import { CartePraticien } from "@/components/patients/CartePraticien";
import { useSpecialites } from "@/hooks/useSpecialites";

interface Props {
  praticiens: PraticienPublic[];
}

const groupMatches = (
  values: string[] | undefined,
  groupItems: string[],
): boolean => {
  if (!values?.length) return false;
  const normItems = groupItems.map(norm);
  return values.some((v) => normItems.includes(norm(v)));
};

interface FiltersProps {
  query: string;
  setQuery: (q: string) => void;
  cabinets: Set<string>;
  toggleCabinet: (c: string) => void;
  cabinetOptions: string[];
  types: Set<string>;
  toggleType: (t: string) => void;
  besoins: Set<string>;
  toggleBesoin: (b: string) => void;
  publics: Set<string>;
  togglePublic: (p: string) => void;
  activeCount: number;
  reset: () => void;
}

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[13px] font-sans px-3 py-1.5 rounded-full border transition-colors text-left ${
        active
          ? "bg-sage text-cream border-sage"
          : "bg-cream text-anthracite border-[#BFBFBF] hover:border-sage"
      }`}
    >
      {label}
    </button>
  );
}

function FiltersPanel(props: FiltersProps) {
  const {
    query,
    setQuery,
    cabinets,
    toggleCabinet,
    cabinetOptions,
    types,
    toggleType,
    besoins,
    toggleBesoin,
    publics,
    togglePublic,
    activeCount,
    reset,
  } = props;

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-3">
      <h3 className="font-sans font-bold uppercase text-[11px] tracking-[0.15em] text-sage">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par nom…"
          aria-label="Rechercher par nom"
          className="pl-9 bg-background border-[#BFBFBF] focus-visible:ring-sage focus-visible:ring-2 focus-visible:ring-offset-0"
        />
      </div>

      <Section title="Cabinet">
        {cabinetOptions.map((c) => (
          <Pill
            key={c}
            label={CABINETS_LABEL[c] ?? c}
            active={cabinets.has(c)}
            onClick={() => toggleCabinet(c)}
          />
        ))}
      </Section>

      <Section title="Type de soin">
        {Object.keys(SPECIALITY_GROUPS).map((t) => (
          <Pill
            key={t}
            label={t}
            active={types.has(t)}
            onClick={() => toggleType(t)}
          />
        ))}
      </Section>

      <Section title="Besoin">
        {Object.keys(PROBLEMATIQUE_GROUPS).map((b) => (
          <Pill
            key={b}
            label={b}
            active={besoins.has(b)}
            onClick={() => toggleBesoin(b)}
          />
        ))}
      </Section>

      <Section title="Public">
        {Object.keys(PUBLIC_CIBLE_GROUPS).map((p) => (
          <Pill
            key={p}
            label={p}
            active={publics.has(p)}
            onClick={() => togglePublic(p)}
          />
        ))}
      </Section>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={reset}
          className="text-sm text-sage hover:underline font-sans"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}

export function PatientsOuvert({ praticiens }: Props) {
  const [query, setQuery] = useState("");
  const [cabinets, setCabinets] = useState<Set<string>>(new Set());
  const [types, setTypes] = useState<Set<string>>(new Set());
  const [besoins, setBesoins] = useState<Set<string>>(new Set());
  const [publics, setPublics] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: specialites } = useSpecialites();

  const specialitesAvecPraticiens = useMemo(
    () =>
      specialites
        .filter((s) => !s.cabinet_slug)
        .filter((s) => praticiens.some((pr) => matchSpecialite(pr, s))),
    [specialites, praticiens],
  );

  const cabinetOptions = useMemo(
    () => Array.from(new Set(praticiens.map((p) => p.cabinet_slug))).sort(),
    [praticiens],
  );

  const toggle = (
    set: Set<string>,
    value: string,
    setter: (s: Set<string>) => void,
  ) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const reset = () => {
    setQuery("");
    setCabinets(new Set());
    setTypes(new Set());
    setBesoins(new Set());
    setPublics(new Set());
  };

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    const selectedTypes = Array.from(types);
    const selectedBesoins = Array.from(besoins);
    const selectedPublics = Array.from(publics);
    return praticiens.filter((p) => {
      // Recherche par nom (insensible casse + accents)
      if (q) {
        const full = norm(`${p.prenom} ${p.nom}`);
        if (!full.includes(q)) return false;
      }
      // Bloc Cabinet (OR interne)
      if (cabinets.size && !cabinets.has(p.cabinet_slug)) return false;
      // Bloc Type de soin : match si AU MOINS UNE specialité du praticien
      // appartient à AU MOINS UN groupe sélectionné. Source = specialites_derivees
      // (extraites par IA depuis la bio), avec fallback sur l'array brut.
      if (selectedTypes.length) {
        const specs =
          (p.specialites_derivees && p.specialites_derivees.length > 0
            ? p.specialites_derivees
            : p.specialites) ?? [];
        const ok = specs.some((spe) =>
          selectedTypes.some((group) =>
            (SPECIALITY_GROUPS[group] ?? []).map(norm).includes(norm(spe)),
          ),
        );
        if (!ok) return false;
      }
      // Bloc Besoin : fusion dérivés + manuels via helper centralisé (lot 16.0-bis).
      if (selectedBesoins.length) {
        const pbs = getPraticienProblematiqueTags(p);
        const ok = pbs.some((pb) =>
          selectedBesoins.some((group) =>
            (PROBLEMATIQUE_GROUPS[group] ?? []).map(norm).includes(norm(pb)),
          ),
        );
        if (!ok) return false;
      }
      // Bloc Public : match si AU MOINS UN public_derive du praticien
      // appartient à AU MOINS UN groupe sélectionné.
      if (selectedPublics.length) {
        const pubs = p.publics_derives ?? [];
        const ok = pubs.some((pu) =>
          selectedPublics.some((group) =>
            (PUBLIC_CIBLE_GROUPS[group] ?? []).map(norm).includes(norm(pu)),
          ),
        );
        if (!ok) return false;
      }
      return true;
    });
  }, [praticiens, query, cabinets, types, besoins, publics]);

  const activeCount =
    cabinets.size + types.size + besoins.size + publics.size + (query ? 1 : 0);

  const filtersProps: FiltersProps = {
    query,
    setQuery,
    cabinets,
    toggleCabinet: (c) => toggle(cabinets, c, setCabinets),
    cabinetOptions,
    types,
    toggleType: (t) => toggle(types, t, setTypes),
    besoins,
    toggleBesoin: (b) => toggle(besoins, b, setBesoins),
    publics,
    togglePublic: (p) => toggle(publics, p, setPublics),
    activeCount,
    reset,
  };

  return (
    <>
      {/* Hero compact */}
      <section className="pt-28 pb-8 md:pt-32 md:pb-10 bg-cream">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <p className="font-sans font-bold uppercase text-[11px] tracking-[0.2em] text-sage mb-4">
            Espace Patients
          </p>
          <h1 className="font-heading font-normal text-3xl md:text-5xl text-anthracite leading-tight mb-3 text-balance">
            Trouvez un praticien à Bordeaux
          </h1>
          <p className="font-heading italic text-[18px] md:text-[20px] text-[#6B6B6B]">
            {praticiens.length} praticiennes et praticiens du soin et du bien-être
          </p>
        </div>
      </section>

      {/* Layout 2 colonnes */}
      <section className="bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex gap-8">
            {/* Sidebar desktop */}
            <aside className="hidden lg:block w-[280px] shrink-0">
              <div className="sticky top-24 bg-cream rounded-2xl p-6">
                <FiltersPanel {...filtersProps} />
              </div>
            </aside>

            {/* Grille principale */}
            <div className="flex-1 min-w-0 lg:pl-2">
              {/* Barre top : compteur + filtre mobile */}
              <div className="flex items-center justify-between mb-6 gap-3">
                <p className="font-sans text-sm text-[#6B6B6B]">
                  {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
                </p>
                <div className="lg:hidden">
                  <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-sage hover:bg-sage/90 text-cream gap-2"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filtrer
                        {activeCount > 0 && (
                          <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gold text-anthracite text-[11px] font-bold">
                            {activeCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-full sm:max-w-full p-0 bg-cream flex flex-col"
                    >
                      <div className="flex-1 overflow-y-auto p-6 pt-12">
                        <FiltersPanel {...filtersProps} />
                      </div>
                      <div className="border-t border-border bg-cream p-4">
                        <Button
                          onClick={() => setDrawerOpen(false)}
                          className="w-full bg-sage hover:bg-sage/90 text-cream font-sans font-bold uppercase tracking-[0.1em]"
                          size="lg"
                        >
                          Voir les {filtered.length} résultat
                          {filtered.length > 1 ? "s" : ""}
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="bg-cream rounded-2xl p-10 text-center">
                  <p className="font-heading italic text-xl text-[#6B6B6B] mb-5">
                    Aucun praticien ne correspond à ces filtres.
                  </p>
                  <Button
                    onClick={reset}
                    variant="outline"
                    className="border-sage text-anthracite hover:bg-sage hover:text-cream"
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((p) => (
                    <CartePraticien key={p.slug} p={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Passerelle problématiques (Lot 11.2b) */}
      <section className="pt-12 pb-4 bg-cream border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <p className="font-sans text-sm md:text-base text-[#6B6B6B]">
            Vous ne savez pas quel type d'accompagnement chercher&nbsp;?{" "}
            <a
              href="/patients/problematiques"
              className="text-sage hover:underline font-sans font-medium whitespace-nowrap"
            >
              Explorer par problématique →
            </a>
          </p>
        </div>
      </section>

      {/* Recherches fréquentes (Lot 11.3b) */}
      {specialitesAvecPraticiens.length > 0 && (
        <section className="pt-4 pb-8 bg-cream">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
            <h3 className="font-sans font-bold uppercase text-[11px] tracking-[0.15em] text-sage mb-4">
              Recherches fréquentes
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {specialitesAvecPraticiens.map((s) => (
                <a
                  key={s.slug}
                  href={`/patients/specialite/${s.slug}`}
                  className="text-[13px] font-sans px-3 py-1.5 rounded-full border bg-cream text-anthracite border-[#BFBFBF] hover:border-sage hover:text-sage transition-colors"
                >
                  {s.nom}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA conciergerie */}
      <section className="py-20 bg-cream border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <p className="font-sans font-bold uppercase text-[11px] tracking-[0.2em] text-sage mb-6">
            Conciergerie patients
          </p>
          <h2 className="font-heading font-normal text-3xl md:text-4xl text-anthracite mb-6 text-balance">
            Vous cherchez la bonne personne pour vous accompagner&nbsp;?
          </h2>
          <p className="font-sans text-base md:text-lg text-[#6B6B6B] leading-relaxed mb-10 max-w-2xl mx-auto">
            Décrivez-nous votre besoin en quelques lignes. Nous vous
            orienterons vers la praticienne ou le praticien I-CA.RE le plus
            adapté.
          </p>
          <Button variant="gold" size="lg" asChild>
            <a href="/patients/decrire-mon-besoin">Décrire mon besoin</a>
          </Button>
        </div>
      </section>
    </>
  );
}

export default PatientsOuvert;
