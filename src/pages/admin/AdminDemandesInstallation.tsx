import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, LogOut, Search, Inbox } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from "@/components/ui/sheet";
import { adminLogout, callAdminFunction, getAdminToken } from "@/lib/adminAuth";
import { BASE_URL } from "@/lib/siteUrl";

type Demande = {
  id: string;
  profession_slug: string;
  ville_slug: string | null;
  nom: string;
  email: string;
  telephone: string | null;
  message: string | null;
  consentement_rgpd: boolean;
  source_path: string | null;
  statut: "nouvelle" | "en_cours" | "traitee" | "fermee";
  notes_internes: string | null;
  created_at: string;
};

const STATUT_LABELS: Record<Demande["statut"], string> = {
  nouvelle: "Nouvelle",
  en_cours: "En cours",
  traitee: "Traitée",
  fermee: "Fermée",
};
const STATUT_COLORS: Record<Demande["statut"], string> = {
  nouvelle: "bg-amber-100 text-amber-900 border-amber-300",
  en_cours: "bg-sky-100 text-sky-900 border-sky-300",
  traitee: "bg-emerald-100 text-emerald-900 border-emerald-300",
  fermee: "bg-zinc-100 text-zinc-700 border-zinc-300",
};

const ACTIFS: Demande["statut"][] = ["nouvelle", "en_cours"];

type Lecture = { etat: "chargement" | "recu" | "erreur"; generation: number; demandes: Demande[]; erreur: string | null };

function demandesRecues(value: unknown): Demande[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Réponse de lecture incomplète");
  const enveloppe = value as Record<string, unknown>;
  const rows = enveloppe.demandes;
  if ((enveloppe.error !== undefined && enveloppe.error !== null) || !Array.isArray(rows) || rows.length > 500) throw new Error("Réponse de lecture incomplète");
  const ids = new Set<string>();
  const nullable = (v: unknown) => v === null || typeof v === "string";
  for (const item of rows) {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error("Demande reçue invalide");
    const row = item as Record<string, unknown>;
    if (typeof row.id !== "string" || !row.id.trim() || ids.has(row.id) ||
      typeof row.profession_slug !== "string" || typeof row.nom !== "string" || typeof row.email !== "string" ||
      !nullable(row.ville_slug) || !nullable(row.telephone) || !nullable(row.message) || !nullable(row.source_path) || !nullable(row.notes_internes) ||
      typeof row.consentement_rgpd !== "boolean" || typeof row.statut !== "string" || !Object.prototype.hasOwnProperty.call(STATUT_LABELS, row.statut) ||
      typeof row.created_at !== "string" || !Number.isFinite(Date.parse(row.created_at))) throw new Error("Demande reçue invalide");
    ids.add(row.id);
  }
  return rows as Demande[];
}

export default function AdminDemandesInstallation() {
  const [lecture, setLecture] = useState<Lecture>({ etat: "chargement", generation: 0, demandes: [], erreur: null });
  const [query, setQuery] = useState("");
  const [filterStatut, setFilterStatut] = useState<string>("actifs");
  // Le verrou appartient à la visite et survit aux remontages de lecture.
  const [savingId, setSavingId] = useState<string | null>(null);
  const visite = useRef({ active: false, generation: 0 });

  const load = useCallback(async () => {
    if (!visite.current.active) return;
    const generation = ++visite.current.generation;
    const active = () => visite.current.active && visite.current.generation === generation;
    const token = getAdminToken();
    setLecture({ etat: "chargement", generation, demandes: [], erreur: null });
    try {
      if (!token) throw new Error("Session admin expirée");
      const data = await callAdminFunction<unknown>("admin-list-demandes-installation", {});
      if (!active()) return;
      if (getAdminToken() !== token) throw new Error("Session admin modifiée pendant la lecture");
      const demandes = demandesRecues(data);
      setLecture({ etat: "recu", generation, demandes, erreur: null });
    } catch (e) {
      if (!active()) return;
      const erreur = e instanceof Error ? e.message : "Erreur de chargement";
      setLecture({ etat: "erreur", generation, demandes: [], erreur });
      toast.error(erreur);
    }
  }, []);

  useEffect(() => {
    const courante = visite.current;
    courante.active = true;
    void load();
    return () => { courante.active = false; ++courante.generation; };
  }, [load]);

  // Une nouvelle lecture ferme l'ancien détail et abandonne ses callbacks locaux.
  // Les filtres restent au niveau de la visite ; les écritures métier restent inchangées.
  return <DemandesCourantes key={`${lecture.generation}:${lecture.etat}`} demandesInitiales={lecture.demandes}
    loading={lecture.etat === "chargement"} erreur={lecture.erreur} load={load}
    query={query} setQuery={setQuery} filterStatut={filterStatut} setFilterStatut={setFilterStatut}
    savingId={savingId} setSavingId={setSavingId} />;
}

type DemandesCourantesProps = {
  demandesInitiales: Demande[]; loading: boolean; erreur: string | null; load: () => Promise<void>;
  query: string; setQuery: (value: string) => void; filterStatut: string; setFilterStatut: (value: string) => void;
  savingId: string | null; setSavingId: (id: string | null) => void;
};

function DemandesCourantes({ demandesInitiales, loading, erreur, load, query, setQuery, filterStatut, setFilterStatut, savingId, setSavingId }: DemandesCourantesProps) {
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState<Demande[]>(demandesInitiales);
  const [selected, setSelected] = useState<Demande | null>(null);
  const [draftStatut, setDraftStatut] = useState<Demande["statut"]>("nouvelle");
  const [draftNotes, setDraftNotes] = useState("");

  useEffect(() => {
    if (selected) {
      setDraftStatut(selected.statut);
      setDraftNotes(selected.notes_internes ?? "");
    }
  }, [selected]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return demandes.filter((d) => {
      if (filterStatut === "actifs" && !ACTIFS.includes(d.statut)) return false;
      else if (filterStatut !== "all" && filterStatut !== "actifs" && d.statut !== filterStatut) return false;
      if (q) {
        const hay = `${d.nom} ${d.email} ${d.profession_slug} ${d.ville_slug ?? ""} ${d.message ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [demandes, query, filterStatut]);

  const save = async () => {
    if (!selected) return;
    setSavingId(selected.id);
    try {
      const data = await callAdminFunction<{ demande: Demande }>(
        "admin-update-demande-installation",
        {
          id: selected.id,
          statut: draftStatut,
          notes_internes: draftNotes,
        },
      );
      setDemandes((prev) => prev.map((d) => (d.id === data.demande.id ? data.demande : d)));
      setSelected(data.demande);
      toast.success("Demande mise à jour");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSavingId(null);
    }
  };

  const updateStatutInline = async (d: Demande, newStatut: Demande["statut"]) => {
    setSavingId(d.id);
    try {
      const data = await callAdminFunction<{ demande: Demande }>(
        "admin-update-demande-installation",
        { id: d.id, statut: newStatut },
      );
      setDemandes((prev) => prev.map((x) => (x.id === data.demande.id ? data.demande : x)));
      toast.success("Statut mis à jour");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <title>Demandes installation | Admin I-CA.RE</title>
      <meta name="robots" content="noindex,nofollow" />
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-normal text-foreground">Demandes installation</h1>
            <p className="text-sm text-muted-foreground">{loading ? "Chargement des demandes…" : erreur ? "Nombre de demandes inconnu" : `${filtered.length} affichées / ${demandes.length} reçues`}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/demandes")}>
              <Inbox className="w-4 h-4 mr-1.5" /> Demandes conciergerie
            </Button>
            <Button variant="ghost" size="sm" onClick={async () => { await adminLogout(); window.location.href = "/admin/login"; }}>
              <LogOut className="w-4 h-4 mr-2" /> Déconnexion
            </Button>
          </div>
        </div>
        <div className="container mx-auto px-6 pb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher (nom, email, profession, message)…" className="pl-9" />
          </div>
          <Select value={filterStatut} onValueChange={setFilterStatut}>
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="actifs">Actifs (nouvelle + en cours)</SelectItem>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {(Object.keys(STATUT_LABELS) as Demande["statut"][]).map((s) => (
                <SelectItem key={s} value={s}>{STATUT_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>Actualiser</Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        {!loading && !erreur && <p role="status" className="text-sm text-muted-foreground mb-4">Lecture limitée aux 500 demandes les plus récentes. {demandes.length === 500 ? "Limite atteinte : cet extrait ne prouve pas le nombre total de demandes." : "Le serveur ne fournit pas de total global."}</p>}
        {erreur ? (
          <div role="alert" className="py-10"><p>Impossible de charger les demandes. {erreur}</p><Button className="mt-4" variant="outline" onClick={load}>Réessayer la lecture</Button></div>
        ) : loading ? (
          <div role="status" aria-label="Chargement des demandes" className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">Aucune demande.</p>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Nom</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Téléphone</th>
                  <th className="px-4 py-3 font-medium">Profession</th>
                  <th className="px-4 py-3 font-medium">Ville</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-t hover:bg-secondary/20 cursor-pointer" onClick={() => setSelected(d)}>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(d.created_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</td>
                    <td className="px-4 py-3 font-medium">{d.nom}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.telephone ?? "-"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.profession_slug}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.ville_slug ?? "-"}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={d.statut}
                        onValueChange={(v) => updateStatutInline(d, v as Demande["statut"])}
                        disabled={savingId === d.id}
                      >
                        <SelectTrigger className="h-8 w-[130px]">
                          <SelectValue>
                            <Badge variant="outline" className={STATUT_COLORS[d.statut]}>
                              {STATUT_LABELS[d.statut]}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.keys(STATUT_LABELS) as Demande["statut"][]).map((s) => (
                            <SelectItem key={s} value={s}>{STATUT_LABELS[s]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="sm:max-w-xl overflow-y-auto break-words">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.nom}</SheetTitle>
                <p className="text-xs text-muted-foreground">Reçue le {new Date(selected.created_at).toLocaleString("fr-FR")}</p>
              </SheetHeader>
              <div className="space-y-5 mt-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Contact</p>
                  <p className="text-sm">{selected.email}{selected.telephone ? ` · ${selected.telephone}` : ""}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Profession</p>
                    <p className="text-sm">{selected.profession_slug}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Cabinet visé</p>
                    <p className="text-sm">{selected.ville_slug ?? "Aucun (index)"}</p>
                  </div>
                </div>
                {selected.source_path && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Page source</p>
                    <a
                      href={`${BASE_URL}${selected.source_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary underline break-all"
                    >
                      {selected.source_path}
                    </a>
                  </div>
                )}
                {selected.message && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Message</p>
                    <p className="text-sm whitespace-pre-wrap bg-secondary/40 p-3 rounded-md">{selected.message}</p>
                  </div>
                )}
                <hr />
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Statut</label>
                  <Select value={draftStatut} onValueChange={(v) => setDraftStatut(v as Demande["statut"])}>
                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(STATUT_LABELS) as Demande["statut"][]).map((s) => (
                        <SelectItem key={s} value={s}>{STATUT_LABELS[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Notes internes</label>
                  <Textarea value={draftNotes} onChange={(e) => setDraftNotes(e.target.value)} rows={5} className="mt-2" maxLength={5000} />
                </div>
              </div>
              <SheetFooter className="mt-6">
                <Button variant="outline" onClick={() => setSelected(null)}>Fermer</Button>
                <Button onClick={save} disabled={savingId === selected.id}>
                  {savingId === selected.id ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enregistrement…</> : "Enregistrer"}
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}