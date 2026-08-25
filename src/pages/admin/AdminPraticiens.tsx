import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import {
  AlertTriangle,
  Copy,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Star,
  Webhook,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { adminLogout, callAdminFunction, getAdminToken } from "@/lib/adminAuth";
import { PraticienDrawer } from "@/components/admin/PraticienDrawer";
import { BASE_URL } from "@/lib/siteUrl";

export type Praticien = {
  id: string;
  slug: string;
  cabinet_slug: string;
  prenom: string;
  nom: string;
  genre: string | null;
  profession: string;
  specialites: string[];
  problematiques: string[];
  specialites_derivees: string[];
  problematiques_derivees: string[];
  tags_extraction_status: string;
  tags_extracted_at: string | null;
  tags_bio_hash: string | null;
  bio_courte: string | null;
  bio_courte_en: string | null;
  bio_longue: string | null;
  bio_longue_en: string | null;
  photo_url: string | null;
  lien_rdv: string | null;
  google_place_id: string | null;
  google_kgmid: string | null;
  google_cid: string | null;
  statut_validation: string;
  preview_token: string;
  date_envoi_preview: string | null;
  date_validation: string | null;
  notes_internes: string | null;
  actif: boolean;
  ordre_affichage: number;
  created_at: string;
  updated_at: string;
};

export type AvisCache = {
  place_id: string;
  rating: number | null;
  user_ratings_total: number | null;
  google_display_name: string | null;
  last_updated_at: string;
};

export type Cabinet = {
  slug: string;
  name: string;
  city: string;
  status: string;
};

const STATUTS = [
  { value: "brouillon", label: "Brouillon", color: "bg-muted text-muted-foreground" },
  { value: "preview_envoyee", label: "Preview envoyée", color: "bg-yellow-100 text-yellow-900 border-yellow-300" },
  { value: "validee", label: "Validée", color: "bg-green-100 text-green-900 border-green-300" },
  { value: "refusee", label: "Refusée", color: "bg-red-100 text-red-900 border-red-300" },
  { value: "non_repondeuse", label: "Non répondeuse", color: "bg-orange-100 text-orange-900 border-orange-300" },
  { value: "en_attente_infos", label: "En attente infos", color: "bg-sky-100 text-sky-900 border-sky-300" },
  { value: "en_attente_resolution", label: "En attente résolution", color: "bg-purple-100 text-purple-900 border-purple-300" },
] as const;

function statutLabel(value: string) {
  return STATUTS.find((s) => s.value === value) ?? STATUTS[0];
}

function statutSortOrder(value: string): number {
  // brouillon en haut, validée en bas
  const order = [
    "brouillon",
    "en_attente_infos",
    "en_attente_resolution",
    "preview_envoyee",
    "non_repondeuse",
    "refusee",
    "validee",
  ];
  const i = order.indexOf(value);
  return i === -1 ? 999 : i;
}

function initiales(prenom: string, nom: string) {
  return `${(prenom[0] ?? "").toUpperCase()}${(nom[0] ?? "").toUpperCase()}`;
}

function isIncomplete(p: Praticien): { incomplete: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (!p.bio_courte) reasons.push("bio courte manquante");
  if (!p.photo_url) reasons.push("photo manquante");
  if (!p.lien_rdv) reasons.push("lien RDV manquant");
  return { incomplete: reasons.length > 0, reasons };
}

export default function AdminPraticiens() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [praticiens, setPraticiens] = useState<Praticien[]>([]);
  const [cache, setCache] = useState<Map<string, AvisCache>>(new Map());
  const [cabinets, setCabinets] = useState<Cabinet[]>([]);
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState<string[]>([]);
  const [cabinetFilter, setCabinetFilter] = useState<string>("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Praticien | null>(null);
  const [batchExtracting, setBatchExtracting] = useState(false);
  const [refreshingAvis, setRefreshingAvis] = useState(false);
  const tagsReviewFilter = searchParams.get("filter") === "tags-review";

  const fetchAll = async () => {
    setLoading(true);
    const token = getAdminToken();
    if (!token) {
      navigate("/admin/login");
      return;
    }

    // Note: RLS publique ne montre que validee+actif. On utilise une RPC dédiée admin
    // côté backend pour tout voir. Faute d'RPC, on passe par une lecture limitée :
    // on appelle une edge function qui renvoie tout. Pour l'instant on lit ce qui est
    // visible côté public + on requête via un appel admin via service role.
    try {
      const result = await callAdminFunction<{ praticiens: Praticien[] }>(
        "admin-list-praticiens",
        {},
      );
      setPraticiens(result.praticiens ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur de chargement");
    }

    // Cache avis : lecture publique
    const { data: cacheRows } = await supabase
      .from("avis_google_cache")
      .select("place_id,rating,user_ratings_total,google_display_name,last_updated_at");
    const m = new Map<string, AvisCache>();
    (cacheRows ?? []).forEach((r) => m.set(r.place_id, r as AvisCache));
    setCache(m);

    // Cabinets : projets exploite + en_construction
    const { data: projetsRows } = await supabase
      .from("projets")
      .select("slug,name,city,status")
      .in("status", ["en_exploitation", "en_travaux"]);
    setCabinets((projetsRows ?? []) as Cabinet[]);

    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let arr = [...praticiens];
    if (tagsReviewFilter) {
      arr = arr.filter((p) =>
        ["review", "error"].includes(p.tags_extraction_status),
      );
    }
    if (q) {
      arr = arr.filter(
        (p) =>
          p.prenom.toLowerCase().includes(q) ||
          p.nom.toLowerCase().includes(q) ||
          p.profession.toLowerCase().includes(q),
      );
    }
    if (statutFilter.length > 0) {
      arr = arr.filter((p) => statutFilter.includes(p.statut_validation));
    }
    if (cabinetFilter !== "all") {
      arr = arr.filter((p) => p.cabinet_slug === cabinetFilter);
    }
    arr.sort((a, b) => {
      const sa = statutSortOrder(a.statut_validation);
      const sb = statutSortOrder(b.statut_validation);
      if (sa !== sb) return sa - sb;
      return `${a.nom} ${a.prenom}`.localeCompare(`${b.nom} ${b.prenom}`);
    });
    return arr;
  }, [praticiens, search, statutFilter, cabinetFilter, tagsReviewFilter]);

  const counts = useMemo(() => {
    const total = praticiens.length;
    const validees = praticiens.filter((p) => p.statut_validation === "validee").length;
    const enAttente = praticiens.filter((p) =>
      ["preview_envoyee", "en_attente_infos", "en_attente_resolution"].includes(
        p.statut_validation,
      ),
    ).length;
    return { total, validees, enAttente };
  }, [praticiens]);

  /**
   * Indicateur de fraîcheur : date du plus ancien last_updated_at du cache
   * d'avis. C'est la ligne la plus en retard qui donne l'état réel du cache.
   */
  const avisPlusAncien = useMemo(() => {
    let min: number | null = null;
    cache.forEach((row) => {
      const t = new Date(row.last_updated_at).getTime();
      if (Number.isNaN(t)) return;
      if (min === null || t < min) min = t;
    });
    if (min === null) return null;
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(min));
  }, [cache]);

  const handleLogout = async () => {
    await adminLogout();
    toast.success("Déconnecté");
    navigate("/admin/login");
  };

  /**
   * Rafraîchissement manuel du cache d'avis Google.
   *
   * Appelle l'Edge Function refresh-google-reviews avec le token HMAC admin
   * (header x-admin-token posé par callAdminFunction). Sans place_id dans le
   * corps, la fonction traite l'ensemble des cibles, praticiennes, praticiens
   * et cabinets, en respectant son TTL de cache.
   */
  const handleRefreshAvis = async () => {
    setRefreshingAvis(true);
    try {
      const res = await callAdminFunction<{
        summary?: {
          total_cibles?: number;
          refreshed?: number;
          skipped_cache_fresh?: number;
          errors?: number;
        };
      }>("refresh-google-reviews", {});
      const s = res?.summary;
      toast.success(
        `Avis rafraîchis · ${s?.refreshed ?? 0} mis à jour · ${s?.skipped_cache_fresh ?? 0} déjà frais · ${s?.errors ?? 0} erreurs`,
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur de rafraîchissement");
    }
    setRefreshingAvis(false);
    await fetchAll();
  };

  const handleBatchExtract = async () => {
    const targets = praticiens.filter(
      (p) => p.statut_validation === "validee" && p.actif,
    );
    if (!targets.length) {
      toast.message("Aucune fiche validée à traiter");
      return;
    }
    setBatchExtracting(true);
    let ok = 0;
    let ko = 0;
    for (const p of targets) {
      try {
        await callAdminFunction("admin-reextract-tags", { praticien_id: p.id });
        ok += 1;
      } catch (e) {
        console.error("backfill", p.slug, e);
        ko += 1;
      }
    }
    setBatchExtracting(false);
    toast.success(`Backfill terminé · ${ok} OK · ${ko} erreurs`);
    await fetchAll();
  };

  const openEdit = (p: Praticien | null) => {
    setEditing(p);
    setDrawerOpen(true);
  };

  const handleSaved = async () => {
    setDrawerOpen(false);
    setEditing(null);
    await fetchAll();
  };

  const copyPreviewLink = (p: Praticien) => {
    const url = `${BASE_URL}/preview/${p.slug}/${p.preview_token}`;
    navigator.clipboard.writeText(url).then(
      () => toast.success("Lien copié"),
      () => toast.error("Impossible de copier"),
    );
  };

  const toggleStatutFilter = (value: string) => {
    setStatutFilter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  return (
    <>
      <title>Praticiens | Admin I‑CA.RE</title>
      <meta name="robots" content="noindex, nofollow" />
      <TooltipProvider>
        <main className="min-h-screen bg-background">
          {/* Header */}
          <header className="border-b bg-card sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">Praticiens</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {counts.total} fiches · {counts.validees} validées · {counts.enAttente} en attente de retour
                  {tagsReviewFilter && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-[#D9C7A1]/30 text-anthracite">
                      Vue : tags à vérifier
                      <button
                        type="button"
                        onClick={() => setSearchParams({})}
                        className="ml-1.5 underline hover:no-underline"
                      >
                        retirer
                      </button>
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => openEdit(null)} size="sm">
                  <Plus className="w-4 h-4 mr-1.5" /> Nouveau praticien
                </Button>
                <Button
                  onClick={handleBatchExtract}
                  variant="outline"
                  size="sm"
                  disabled={batchExtracting}
                  title="Réextrait les tags depuis la bio pour toutes les fiches validées"
                >
                  {batchExtracting ? (
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-1.5" />
                  )}
                  Réextraire les tags
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleRefreshAvis}
                    variant="outline"
                    size="sm"
                    disabled={refreshingAvis}
                    title="Rappelle refresh-google-reviews pour les praticiennes, praticiens et cabinets"
                  >
                    {refreshingAvis ? (
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-1.5" />
                    )}
                    Rafraîchir les avis
                  </Button>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {avisPlusAncien
                      ? `Cache le plus ancien : ${avisPlusAncien}`
                      : "Cache vide"}
                  </span>
                </div>
                <Button onClick={() => navigate("/admin/idn-os-webhooks")} variant="outline" size="sm">
                  <Webhook className="w-4 h-4 mr-1.5" /> Webhooks IDN OS
                </Button>
                <Button onClick={() => navigate("/admin/demandes-installation")} variant="outline" size="sm">
                  Demandes installation
                </Button>
                <Button onClick={() => navigate("/admin/extractions")} variant="outline" size="sm">
                  <Sparkles className="w-4 h-4 mr-1.5" /> Suivi extractions
                </Button>
                <Button onClick={handleLogout} variant="ghost" size="sm">
                  <LogOut className="w-4 h-4 mr-1.5" /> Se déconnecter
                </Button>
              </div>
            </div>
          </header>

          {/* Filtres */}
          <section className="max-w-7xl mx-auto px-6 py-4 space-y-3">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[240px] max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher prénom, nom, profession…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={cabinetFilter} onValueChange={setCabinetFilter}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Tous les cabinets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les cabinets</SelectItem>
                  {cabinets.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-muted-foreground mr-1">Statut :</span>
              {STATUTS.map((s) => (
                <label
                  key={s.value}
                  className="flex items-center gap-1.5 text-xs cursor-pointer select-none"
                >
                  <Checkbox
                    checked={statutFilter.includes(s.value)}
                    onCheckedChange={() => toggleStatutFilter(s.value)}
                  />
                  {s.label}
                </label>
              ))}
              {statutFilter.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setStatutFilter([])}
                >
                  Réinitialiser
                </Button>
              )}
            </div>
          </section>

          {/* Liste */}
          <section className="max-w-7xl mx-auto px-6 pb-12">
            <Card className="overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                  Chargement…
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  Aucun praticien ne correspond aux filtres.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="text-left font-medium px-4 py-3">Photo</th>
                        <th className="text-left font-medium px-4 py-3">Praticien</th>
                        <th className="text-left font-medium px-4 py-3">Profession</th>
                        <th className="text-left font-medium px-4 py-3">Statut</th>
                        <th className="text-left font-medium px-4 py-3">Avis Google</th>
                        <th className="text-left font-medium px-4 py-3">Preview</th>
                        <th className="text-right font-medium px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p) => {
                        const c = p.google_place_id ? cache.get(p.google_place_id) : undefined;
                        const cabinet = cabinets.find((cab) => cab.slug === p.cabinet_slug);
                        const inc = isIncomplete(p);
                        const sl = statutLabel(p.statut_validation);
                        return (
                          <tr key={p.id} className="border-t hover:bg-muted/30 transition">
                            <td className="px-4 py-3">
                              {p.photo_url ? (
                                <img
                                  src={p.photo_url}
                                  alt=""
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div
                                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium text-white"
                                  style={{ backgroundColor: "#1E392B" }}
                                >
                                  {initiales(p.prenom, p.nom)}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div>
                                  <div className="font-medium">
                                    {p.prenom} {p.nom}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {cabinet?.name ?? p.cabinet_slug}
                                  </div>
                                </div>
                                {inc.incomplete && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Fiche incomplète : {inc.reasons.join(", ")}
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                                {!p.actif && (
                                  <Badge variant="outline" className="text-xs">inactif</Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">{p.profession}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${sl.color}`}
                              >
                                {sl.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs">
                              {c && c.rating ? (
                                <span className="inline-flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  {c.rating} · {c.user_ratings_total ?? 0}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">, </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => copyPreviewLink(p)}
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Copier le lien preview</TooltipContent>
                              </Tooltip>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEdit(p)}
                              >
                                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                                Modifier
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </section>

          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetContent side="right" className="w-full sm:max-w-[600px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                  {editing ? `${editing.prenom} ${editing.nom}` : "Nouveau praticien"}
                </SheetTitle>
              </SheetHeader>
              <PraticienDrawer
                praticien={editing}
                cabinets={cabinets}
                cache={cache}
                onSaved={handleSaved}
                onCancel={() => setDrawerOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </main>
      </TooltipProvider>
    </>
  );
}