import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, LogOut, Search, Webhook, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/components/ui/sheet";
import { adminLogout, callAdminFunction, getAdminToken } from "@/lib/adminAuth";

type Demande = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string | null;
  message: string;
  problematiques_pressenties: string[];
  cabinet_prefere: string | null;
  source: string | null;
  statut: "a_traiter" | "en_cours" | "oriente" | "ferme";
  notes_internes: string | null;
  webhook_status: "pending" | "ok" | "failed" | "skipped" | null;
  webhook_attempts: number;
  webhook_last_error: string | null;
  created_at: string;
};

const STATUT_LABELS: Record<Demande["statut"], string> = {
  a_traiter: "À traiter",
  en_cours: "En cours",
  oriente: "Orienté",
  ferme: "Fermé",
};
const STATUT_COLORS: Record<Demande["statut"], string> = {
  a_traiter: "bg-amber-100 text-amber-900 border-amber-300",
  en_cours: "bg-sky-100 text-sky-900 border-sky-300",
  oriente: "bg-emerald-100 text-emerald-900 border-emerald-300",
  ferme: "bg-zinc-100 text-zinc-700 border-zinc-300",
};

type Lecture = { generation: number; etat: "chargement" | "erreur" | "recu"; demandes: Demande[] };

function demandesRecues(data: unknown): Demande[] {
  const objet = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
  const nullable = (v: unknown) => v === null || typeof v === "string";
  const ids = new Set<string>();
  if (!objet(data) || !Array.isArray(data.demandes) || data.demandes.length > 500) throw new Error("Extrait invalide");
  for (const d of data.demandes) {
    if (!objet(d) || typeof d.id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(d.id) || ids.has(d.id.toLowerCase())
      || ![d.prenom, d.nom, d.email, d.message].every(v => typeof v === "string")
      || !Array.isArray(d.problematiques_pressenties) || !d.problematiques_pressenties.every(v => typeof v === "string")
      || ![d.telephone, d.cabinet_prefere, d.source, d.notes_internes, d.webhook_last_error].every(nullable)
      || typeof d.statut !== "string" || !Object.prototype.hasOwnProperty.call(STATUT_LABELS, d.statut)
      || !(d.webhook_status === null || ["pending", "ok", "failed", "skipped"].includes(String(d.webhook_status)))
      || !Number.isInteger(d.webhook_attempts) || (d.webhook_attempts as number) < 0
      || typeof d.created_at !== "string" || !/^\d{4}-\d{2}-\d{2}T/.test(d.created_at) || !Number.isFinite(Date.parse(d.created_at))) throw new Error("Extrait invalide");
    ids.add(d.id.toLowerCase());
  }
  return data.demandes as Demande[];
}

export default function AdminDemandes() {
  const [query, setQuery] = useState("");
  const [filterStatut, setFilterStatut] = useState<string>("all");
  const [lecture, setLecture] = useState<Lecture>({ generation: 0, etat: "chargement", demandes: [] });
  const generation = useRef(0);
  const active = useRef(false);
  const session = useRef<string | null>(null);
  const invaliderSession = useCallback(() => {
    session.current = null;
    setQuery("");
    setFilterStatut("all");
    setLecture({ generation: ++generation.current, etat: "erreur", demandes: [] });
  }, []);
  const load = useCallback(async () => {
    if (!active.current) return;
    const numero = ++generation.current;
    const token = getAdminToken();
    session.current = token;
    setLecture({ generation: numero, etat: "chargement", demandes: [] });
    try {
      if (!token) throw new Error("Session admin expirée");
      const data = await callAdminFunction<unknown>("admin-list-demandes", {});
      if (!active.current || numero !== generation.current) return;
      if (token !== getAdminToken()) throw new Error("Session admin remplacée");
      setLecture({ generation: numero, etat: "recu", demandes: demandesRecues(data) });
    } catch {
      if (active.current && numero === generation.current) setLecture({ generation: numero, etat: "erreur", demandes: [] });
    }
  }, []);

  useEffect(() => {
    active.current = true;
    void load();
    const verifierSession = () => {
      if (session.current !== getAdminToken()) {
        invaliderSession();
      }
    };
    window.addEventListener("storage", verifierSession);
    window.addEventListener("focus", verifierSession);
    return () => {
      active.current = false;
      window.removeEventListener("storage", verifierSession);
      window.removeEventListener("focus", verifierSession);
    };
  }, [load, invaliderSession]);

  const estCourante = () => {
    if (!active.current || lecture.generation !== generation.current) return false;
    if (session.current === null || session.current !== getAdminToken()) { invaliderSession(); return false; }
    return true;
  };
  // Une nouvelle réception remonte le triage : aucun détail ou brouillon d'un ancien extrait.
  return <DemandesLecture key={`${lecture.generation}:${lecture.etat}`} lecture={lecture} load={load} estCourante={estCourante} query={query} setQuery={setQuery} filterStatut={filterStatut} setFilterStatut={setFilterStatut} />;
}

function DemandesLecture({ lecture, load, estCourante, query, setQuery, filterStatut, setFilterStatut }: { lecture: Lecture; load: () => Promise<void>; estCourante: () => boolean; query: string; setQuery: (value: string) => void; filterStatut: string; setFilterStatut: (value: string) => void }) {
  const [demandes, setDemandes] = useState<Demande[]>(lecture.demandes);
  const loading = lecture.etat === "chargement";
  const erreur = lecture.etat === "erreur";
  const [selected, setSelected] = useState<Demande | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [draftStatut, setDraftStatut] = useState<Demande["statut"]>("a_traiter");
  const [draftNotes, setDraftNotes] = useState("");
  const ouvrir = (demande: Demande) => { if (estCourante()) setSelected(demande); };

  useEffect(() => {
    if (selected) {
      setDraftStatut(selected.statut);
      setDraftNotes(selected.notes_internes ?? "");
    }
  }, [selected]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return demandes.filter((d) => {
      if (filterStatut !== "all" && d.statut !== filterStatut) return false;
      if (q) {
        const hay = `${d.prenom} ${d.nom} ${d.email} ${d.message}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [demandes, query, filterStatut]);

  const save = async () => {
    if (!selected) return;
    setSavingId(selected.id);
    try {
      const data = await callAdminFunction<{ demande: Demande }>("admin-update-demande", {
        id: selected.id,
        statut: draftStatut,
        notes_internes: draftNotes,
      });
      setDemandes((prev) => prev.map((d) => (d.id === data.demande.id ? data.demande : d)));
      setSelected(data.demande);
      toast.success("Demande mise à jour");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <title>Demandes conciergerie | Admin I-CA.RE</title>
      <meta name="robots" content="noindex,nofollow" />
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-normal text-foreground">Demandes conciergerie</h1>
            <p className="text-sm text-muted-foreground">{loading ? "Chargement des demandes…" : erreur ? "Nombre de demandes indisponible" : `Extrait reçu : ${demandes.length} demande${demandes.length > 1 ? "s" : ""} ; ${filtered.length} affichée${filtered.length > 1 ? "s" : ""}`}</p>
            <p className="text-xs text-muted-foreground">500 demandes au maximum ; total inconnu. Recherche et filtres sur cet extrait uniquement.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => { window.location.href = "/admin/demandes-installation"; }}>
              <Building2 className="w-4 h-4 mr-1.5" /> Demandes installation
            </Button>
            <Button variant="outline" size="sm" onClick={() => { window.location.href = "/admin/idn-os-webhooks"; }}>
              <Webhook className="w-4 h-4 mr-1.5" /> Webhooks IDN OS
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={async () => { await adminLogout(); window.location.href = "/admin/login"; }}>
            <LogOut className="w-4 h-4 mr-2" /> Déconnexion
          </Button>
        </div>
        <div className="container mx-auto px-6 pb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher (nom, email, message)…" className="pl-9" />
          </div>
          <Select value={filterStatut} onValueChange={setFilterStatut}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {(Object.keys(STATUT_LABELS) as Demande["statut"][]).map((s) => (
                <SelectItem key={s} value={s}>{STATUT_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={load} disabled={loading || savingId !== null}>Actualiser</Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        {loading ? (
          <div role="status" className="flex items-center justify-center gap-3 py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />Chargement des demandes…</div>
        ) : erreur ? (
          <div role="alert" className="space-y-3 py-12"><p>Les demandes ne peuvent pas être chargées. La liste et le détail restent indisponibles.</p><Button variant="outline" onClick={load}>Réessayer</Button></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">{demandes.length === 0 ? "Aucune demande dans l'extrait reçu." : "Aucune demande ne correspond aux filtres dans cet extrait."}</p>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Nom</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Cabinet</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Webhook</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-t hover:bg-secondary/20 cursor-pointer" onClick={() => ouvrir(d)}>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(d.created_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</td>
                    <td className="px-4 py-3 font-medium"><button type="button" className="text-left underline underline-offset-4 p-2 -m-2 focus-visible:outline focus-visible:outline-2" onClick={() => ouvrir(d)}>{d.prenom} {d.nom}</button></td>
                    <td className="px-4 py-3 text-muted-foreground">{d.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.cabinet_prefere ?? "-"}</td>
                    <td className="px-4 py-3"><Badge variant="outline" className={STATUT_COLORS[d.statut]}>{STATUT_LABELS[d.statut]}</Badge></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{d.webhook_status ?? "-"}{d.webhook_attempts > 0 ? ` (${d.webhook_attempts})` : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto [overflow-wrap:anywhere]">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.prenom} {selected.nom}</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">Reçue le {new Date(selected.created_at).toLocaleString("fr-FR")}</SheetDescription>
                <Button variant="outline" onClick={load} disabled={savingId !== null}>Actualiser l'extrait</Button>
              </SheetHeader>
              <div className="space-y-5 mt-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Contact</p>
                  <p className="text-sm">{selected.email}{selected.telephone ? ` · ${selected.telephone}` : ""}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Cabinet préféré</p>
                  <p className="text-sm">{selected.cabinet_prefere ?? "Sans préférence"}</p>
                </div>
                {selected.problematiques_pressenties.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Problématiques</p>
                    <div className="flex flex-wrap gap-1.5">{selected.problematiques_pressenties.map((p) => <Badge key={p} variant="secondary">{p}</Badge>)}</div>
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Message</p>
                  <p className="text-sm whitespace-pre-wrap bg-secondary/40 p-3 rounded-md">{selected.message}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Webhook CRM</p>
                  <p className="text-sm">Statut : <strong>{selected.webhook_status ?? "-"}</strong> · {selected.webhook_attempts} tentative(s)</p>
                  {selected.webhook_last_error && <p className="text-xs text-destructive mt-1">{selected.webhook_last_error}</p>}
                </div>
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