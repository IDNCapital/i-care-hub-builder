import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ArticleCardData } from "@/components/ArticleCard";

export interface Problematique {
  slug: string;
  nom: string;
  description_courte: string;
  description_longue: string | null;
  synonymes: string[];
}

type RequeteGuide = (cle: string, debut: number, fin: number, head: boolean) => PromiseLike<unknown>;
type RecuGuide = { data: unknown; error: unknown; status: number; count: number | null };
const TAILLE_PAGE = 200;
const MAX_PAGES = 100;
const MAX_LIGNES = TAILLE_PAGE * MAX_PAGES;
const texte = (v: unknown) => typeof v === "string" && v.trim().length > 0;

/** Une lecture complète à compte confirmé, sinon aucune liste partielle. */
function useLectureGuides<T extends { slug: string }>(cle: string | undefined, requete: RequeteGuide, valide: (ligne: Record<string, unknown>) => boolean) {
  const [tentative, setTentative] = useState(0);
  const [lecture, setLecture] = useState<{ cle: string | undefined; tentative: number; data: T[]; loading: boolean; error: boolean }>({ cle, tentative: -1, data: [], loading: cle !== undefined, error: false });
  const generation = useRef(0);
  const retry = useCallback(() => { generation.current++; setTentative(n => n + 1); }, []);

  useEffect(() => {
    let annulee = false;
    const version = ++generation.current;
    const estCourante = () => !annulee && version === generation.current;
    if (cle === undefined) return;
    setLecture({ cle, tentative, data: [], loading: true, error: false });
    (async () => {
      try {
        const rows: T[] = [], slugs = new Set<string>();
        let total: number | null = null;
        for (let page = 0; ; page++) {
          if (!estCourante()) return;
          if (page >= MAX_PAGES) throw Error("Lecture des guides trop volumineuse.");
          const recu = await requete(cle, rows.length, rows.length + TAILLE_PAGE - 1, false) as RecuGuide;
          if (!estCourante()) return;
          if (!recu || recu.error !== null || ![200, 206].includes(recu.status) || !Array.isArray(recu.data)
            || !Number.isSafeInteger(recu.count) || recu.count < 0 || recu.count > MAX_LIGNES
            || (recu.count === 0 && recu.status !== 200) || (total !== null && total !== recu.count)
            || recu.data.length > TAILLE_PAGE || rows.length + recu.data.length > recu.count) throw Error("Lecture des guides non confirmée.");
          total = recu.count;
          for (const value of recu.data) {
            if (!value || typeof value !== "object" || Array.isArray(value) || !texte(value.slug) || slugs.has(value.slug) || !valide(value)) throw Error("Guide non confirmé.");
            slugs.add(value.slug); rows.push(value as T);
          }
          if (rows.length === total) break;
          if (recu.data.length === 0) throw Error("Lecture des guides interrompue.");
        }
        if (!estCourante()) return;
        const fin = await requete(cle, 0, 0, true) as RecuGuide;
        if (!estCourante()) return;
        if (!fin || fin.error !== null || ![200, 206].includes(fin.status) || fin.data !== null || fin.count !== total || (total === 0 && fin.status !== 200)) throw Error("Compte final des guides non confirmé.");
        setLecture({ cle, tentative, data: rows, loading: false, error: false });
      } catch {
        if (estCourante()) setLecture({ cle, tentative, data: [], loading: false, error: true });
      }
    })();
    return () => { annulee = true; };
  }, [cle, tentative, requete, valide]);

  const courante = lecture.cle === cle && lecture.tentative === tentative;
  return { data: courante ? lecture.data : [] as T[], loading: cle !== undefined && (!courante || lecture.loading), error: courante && lecture.error, retry };
}

const requeteProblematiques: RequeteGuide = (_cle, debut, fin, head) => {
  const q = supabase.from("problematiques")
    .select("slug, nom, description_courte, description_longue, synonymes", { count: "exact", head })
    .order("nom", { ascending: true }).order("slug", { ascending: true });
  return head ? q : q.range(debut, fin);
};
const problematiqueValide = (p: Record<string, unknown>) => texte(p.nom) && typeof p.description_courte === "string"
  && (p.description_longue === null || typeof p.description_longue === "string")
  && Array.isArray(p.synonymes) && p.synonymes.every(s => typeof s === "string");

/** Taxonomie active selon RLS, triée par nom puis slug unique, sans page partielle. */
export function useProblematiques() {
  return useLectureGuides<Problematique>("problematiques", requeteProblematiques, problematiqueValide);
}

const requeteArticles: RequeteGuide = (slug, debut, fin, head) => {
  // La visibilité des articles reste celle de la RLS existante.
  const q = supabase.from("articles").select("slug, titre, chapo, published_at", { count: "exact", head })
    .contains("problematiques_associees", [slug])
    .order("published_at", { ascending: false }).order("slug", { ascending: true });
  return head ? q : q.range(debut, fin);
};
const articleValide = (a: Record<string, unknown>) => texte(a.titre) && typeof a.chapo === "string"
  && (a.published_at === null || typeof a.published_at === "string");

/** Les articles appartiennent à la visite du slug reçu, y compris pendant un retry. */
export function useArticlesProblematiques(slug: string | undefined) {
  return useLectureGuides<ArticleCardData>(slug, requeteArticles, articleValide);
}
