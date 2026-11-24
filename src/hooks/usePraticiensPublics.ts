import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PraticienPublic {
  slug: string;
  prenom: string;
  nom: string;
  profession: string;
  photo_url: string | null;
  specialites: string[];
  problematiques: string[];
  specialites_derivees: string[];
  problematiques_derivees: string[];
  problematiques_manuelles: string[];
  publics_derives: string[];
  cabinet_slug: string;
}

type RequetePublique = (debut: number, fin: number, head: boolean, signal: AbortSignal) => PromiseLike<unknown>;
type RecuPublic = { data: unknown; error: unknown; status: number; count: number | null };
const texte = (v: unknown) => typeof v === "string" && v.trim().length > 0;
const tableauTexte = (v: unknown) => Array.isArray(v) && v.every(x => typeof x === "string");

/** Lecture publique bornée, complète ou explicitement inconnue, sans livrer de page partielle. */
export function useLecturePubliqueComplete<T extends { slug: string }>(requete: RequetePublique, valide: (ligne: Record<string, unknown>) => boolean) {
  const [tentative, setTentative] = useState(0);
  const [lecture, setLecture] = useState<{ tentative: number; data: T[]; loading: boolean; error: boolean }>({ tentative: -1, data: [], loading: true, error: false });
  const generation = useRef(0);
  const retry = useCallback(() => { generation.current++; setTentative(n => n + 1); }, []);
  useEffect(() => {
    let annulee = false;
    let expiree = false;
    const version = ++generation.current;
    const echeance = Date.now() + 15_000;
    const transport = new AbortController();
    let borne: ReturnType<typeof setTimeout> | null = null;
    const expirer = () => {
      if (annulee || expiree || generation.current !== version) return;
      expiree = true;
      transport.abort();
      if (borne !== null) clearTimeout(borne);
      setLecture({ tentative, data: [], loading: false, error: true });
    };
    const estCourante = () => {
      if (annulee || expiree || generation.current !== version) return false;
      if (Date.now() >= echeance) { expirer(); return false; }
      return true;
    };
    setLecture({ tentative, data: [], loading: true, error: false });
    borne = setTimeout(expirer, 15_000);
    (async () => {
      try {
        const rows: T[] = [], slugs = new Set<string>();
        let total: number | null = null;
        for (let page = 0; ; page++) {
          if (!estCourante()) return;
          if (page >= 100) throw Error("Lecture publique trop volumineuse.");
          const recu = await requete(rows.length, rows.length + 199, false, transport.signal) as RecuPublic;
          if (!estCourante()) return;
          if (!recu || recu.error !== null || ![200, 206].includes(recu.status) || !Array.isArray(recu.data)
            || !Number.isSafeInteger(recu.count) || recu.count === null || recu.count < 0 || recu.count > 20000 || (recu.count === 0 && recu.status !== 200)
            || (total !== null && total !== recu.count) || recu.data.length > 200 || rows.length + recu.data.length > recu.count) throw Error("Lecture publique non confirmée.");
          total = recu.count;
          for (const value of recu.data) {
            if (!value || typeof value !== "object" || Array.isArray(value) || !texte(value.slug) || slugs.has(value.slug) || !valide(value)) throw Error("Fiche publique non confirmée.");
            slugs.add(value.slug); rows.push(value as T);
          }
          if (rows.length === total) break;
          if (recu.data.length === 0) throw Error("Lecture publique interrompue.");
        }
        if (!estCourante()) return;
        const fin = await requete(0, 0, true, transport.signal) as RecuPublic;
        if (!estCourante()) return;
        if (!fin || fin.error !== null || ![200, 206].includes(fin.status) || fin.data !== null || fin.count !== total || (total === 0 && fin.status !== 200)) throw Error("Compte public final non confirmé.");
        setLecture({ tentative, data: rows, loading: false, error: false });
      } catch {
        if (estCourante()) setLecture({ tentative, data: [], loading: false, error: true });
      } finally { if (borne !== null) clearTimeout(borne); transport.abort(); }
    })();
    return () => { annulee = true; if (borne !== null) clearTimeout(borne); transport.abort(); };
  }, [tentative, requete, valide]);
  const courante = lecture.tentative === tentative;
  return { data: courante ? lecture.data : [] as T[], loading: !courante || lecture.loading, error: courante && lecture.error, retry };
}

const colonnes = "slug, prenom, nom, profession, photo_url, specialites, problematiques, specialites_derivees, problematiques_derivees, problematiques_manuelles, publics_derives, cabinet_slug";
const requetePraticiens: RequetePublique = (debut, fin, head, signal) => {
  const q = supabase.from("praticiens").select(colonnes, { count: "exact", head })
    .eq("statut_validation", "validee").eq("actif", true).order("nom", { ascending: true }).order("slug", { ascending: true }).abortSignal(signal);
  return head ? q : q.range(debut, fin);
};
const praticienValide = (p: Record<string, unknown>) => ["prenom", "nom", "profession", "cabinet_slug"].every(k => typeof p[k] === "string")
  && (p.photo_url === null || typeof p.photo_url === "string")
  && ["specialites", "problematiques", "specialites_derivees", "problematiques_derivees", "problematiques_manuelles", "publics_derives"].every(k => tableauTexte(p[k]));

/** Tous les praticiens publics validés et actifs, triés par nom puis slug unique. */
export function usePraticiensPublics() {
  return useLecturePubliqueComplete<PraticienPublic>(requetePraticiens, praticienValide);
}
