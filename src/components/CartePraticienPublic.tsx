import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export interface CartePraticienPublicProps {
  nom: string;
  photoUrl: string | null;
  specialite: string;
  problematiquesPrincipales: string[];
  href: string;
}

/**
 * Carte publique d'un praticien — utilisée sur les pages /projets/[cabinet]
 * et l'index /patients. Photo carrée 1:1, nom Playfair, spécialité Inter,
 * 1-2 badges de problématiques principales en sauge clair.
 */
export function CartePraticienPublic({
  nom,
  photoUrl,
  specialite,
  problematiquesPrincipales,
  href,
}: CartePraticienPublicProps) {
  const badges = problematiquesPrincipales.slice(0, 3);
  return (
    <Link
      to={href}
      className="group flex flex-col bg-background border border-border rounded-2xl overflow-hidden transition-all hover:shadow-md hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="aspect-square w-full overflow-hidden bg-secondary">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`Portrait de ${nom}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            Photo à venir
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading text-[18px] text-foreground leading-tight">{nom}</h3>
        <p className="font-sans text-sm text-muted-foreground mt-1 leading-snug">{specialite}</p>
        {badges.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 mt-3 list-none p-0 m-0">
            {badges.map((p) => (
              <li
                key={p}
                className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/15 text-foreground"
              >
                {p}
              </li>
            ))}
          </ul>
        )}
        <span className="inline-flex items-center gap-1 mt-4 text-xs font-medium text-primary group-hover:underline">
          Voir la fiche <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

export default CartePraticienPublic;