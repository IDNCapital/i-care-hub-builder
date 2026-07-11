import type { PraticienPublic } from "@/hooks/usePraticiensPublics";
import { CABINETS_LABEL } from "@/lib/taxonomy";

export function CartePraticien({ p }: { p: PraticienPublic }) {
  return (
    <a
      href={`/praticien/${p.slug}`}
      className="group flex flex-col bg-background border border-border rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
    >
      <div className="aspect-square w-full overflow-hidden bg-secondary rounded-2xl">
        {p.photo_url ? (
          <img
            src={p.photo_url}
            alt={`Portrait de ${p.prenom} ${p.nom}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            Photo à venir
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-1">
        <h3 className="font-heading font-normal text-[22px] leading-tight text-anthracite">
          {p.prenom} {p.nom}
        </h3>
        <p className="font-sans text-sm text-[#6B6B6B]">
          {p.specialites?.[0] ?? p.profession}
        </p>
        <p className="font-sans text-[13px] text-[#B89B6F] flex items-center gap-1.5 mt-0.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-sage" />
          {CABINETS_LABEL[p.cabinet_slug] ?? p.cabinet_slug}
        </p>
      </div>
    </a>
  );
}

export default CartePraticien;