import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { pageUrl } from "@/lib/siteUrl";
import type { ArticleCardData } from "@/components/ArticleCard";

export interface Problematique {
  slug: string;
  nom: string;
  description_courte: string;
  description_longue: string | null;
  synonymes: string[];
}

type RequeteGuide = (cle: string, debut: number, fin: number, head: boolean, signal: AbortSignal) => PromiseLike<unknown>;
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
    let expiree = false;
    const version = ++generation.current;
    if (cle === undefined) return;
    const echeance = Date.now() + 15_000;
    const transport = new AbortController();
    let borne: ReturnType<typeof setTimeout> | null = null;
    const expirer = () => {
      if (annulee || expiree || generation.current !== version) return;
      expiree = true;
      transport.abort();
      if (borne !== null) clearTimeout(borne);
      setLecture({ cle, tentative, data: [], loading: false, error: true });
    };
    const estCourante = () => {
      if (annulee || expiree || generation.current !== version) return false;
      if (Date.now() >= echeance) { expirer(); return false; }
      return true;
    };
    setLecture({ cle, tentative, data: [], loading: true, error: false });
    borne = setTimeout(expirer, 15_000);
    (async () => {
      try {
        const rows: T[] = [], slugs = new Set<string>();
        let total: number | null = null;
        for (let page = 0; ; page++) {
          if (!estCourante()) return;
          if (page >= MAX_PAGES) throw Error("Lecture des guides trop volumineuse.");
          const recu = await requete(cle, rows.length, rows.length + TAILLE_PAGE - 1, false, transport.signal) as RecuGuide;
          if (!estCourante()) return;
          if (!recu || recu.error !== null || ![200, 206].includes(recu.status) || !Array.isArray(recu.data)
            || !Number.isSafeInteger(recu.count) || recu.count === null || recu.count < 0 || recu.count > MAX_LIGNES
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
        const fin = await requete(cle, 0, 0, true, transport.signal) as RecuGuide;
        if (!estCourante()) return;
        if (!fin || fin.error !== null || ![200, 206].includes(fin.status) || fin.data !== null || fin.count !== total || (total === 0 && fin.status !== 200)) throw Error("Compte final des guides non confirmé.");
        setLecture({ cle, tentative, data: rows, loading: false, error: false });
      } catch {
        if (estCourante()) setLecture({ cle, tentative, data: [], loading: false, error: true });
      } finally { if (borne !== null) clearTimeout(borne); transport.abort(); }
    })();
    return () => { annulee = true; if (borne !== null) clearTimeout(borne); transport.abort(); };
  }, [cle, tentative, requete, valide]);

  const courante = lecture.cle === cle && lecture.tentative === tentative;
  return { data: courante ? lecture.data : [] as T[], loading: cle !== undefined && (!courante || lecture.loading), error: courante && lecture.error, retry };
}

const requeteProblematiques: RequeteGuide = (_cle, debut, fin, head, signal) => {
  const q = supabase.from("problematiques")
    .select("slug, nom, description_courte, description_longue, synonymes", { count: "exact", head })
    .eq("actif", true).order("nom", { ascending: true }).order("slug", { ascending: true }).abortSignal(signal);
  return head ? q : q.range(debut, fin);
};
const problematiqueValide = (p: Record<string, unknown>) => texte(p.nom) && typeof p.description_courte === "string"
  && (p.description_longue === null || typeof p.description_longue === "string")
  && Array.isArray(p.synonymes) && p.synonymes.every(s => typeof s === "string");

/** Taxonomie active selon RLS, triée par nom puis slug unique, sans page partielle. */
export function useProblematiques() {
  return useLectureGuides<Problematique>("problematiques", requeteProblematiques, problematiqueValide);
}

const requeteArticles: RequeteGuide = (slug, debut, fin, head, signal) => {
  // La visibilité des articles reste celle de la RLS existante.
  const q = supabase.from("articles").select("slug, titre, chapo, published_at", { count: "exact", head })
    .eq("statut", "publie").contains("problematiques_associees", [slug])
    .order("published_at", { ascending: false }).order("slug", { ascending: true }).abortSignal(signal);
  return head ? q : q.range(debut, fin);
};
const articleValide = (a: Record<string, unknown>) => texte(a.titre) && typeof a.chapo === "string"
  && (a.published_at === null || typeof a.published_at === "string");

/** Les articles appartiennent à la visite du slug reçu, y compris pendant un retry. */
export function useArticlesProblematiques(slug: string | undefined) {
  return useLectureGuides<ArticleCardData>(slug, requeteArticles, articleValide);
}

// Le site remonte le corps avec createRoot. Une fiche peut hériter de la tête
// du document pré-rendu avant que les deux sources publiques ne répondent.
export function useTeteGuide(chemin: string, conserverPendantLecture: boolean) {
  const [initial] = useState(() => {
    if (typeof document === "undefined") return { canonique: null, balises: [] };
    const canonique = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
    const selecteur = canonique
      ? 'title,meta[name="description"],meta[name="robots"][content="noindex, nofollow"],link[rel="canonical"],link[rel="alternate"],meta[property^="og:"],meta[name^="twitter:"]'
      : 'title,meta[name="description"]';
    return { canonique, balises: Array.from(document.head.querySelectorAll(selecteur), noeud => ({ noeud, html: noeud.outerHTML })) };
  });
  useLayoutEffect(() => {
    const retirer = () => {
      for (const { noeud, html } of initial.balises) {
        if (noeud.parentNode === document.head && noeud.outerHTML === html) noeud.remove();
      }
    };
    if (!conserverPendantLecture || initial.canonique !== pageUrl(chemin)) retirer();
    return retirer;
  }, [initial, chemin, conserverPendantLecture]);
}
