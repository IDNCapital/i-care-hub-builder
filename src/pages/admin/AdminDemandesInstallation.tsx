import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
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
import { adminLogout, callAdminFunction } from "@/lib/adminAuth";

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

export default function AdminDemandesInstallation() {
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filterStatut, setFilterStatut] = useState<string>("actifs");
  const [selected, setSelected] = useState<Demande | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [draftStatut, setDraftStatut] = useState<Demande["statut"]>("nouvelle");
  const [draftNotes, setDraftNotes] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await callAdminFunction<{ demandes: Demande[] }>(
        "admin-list-demandes-installation",
        {},
      );
      setDemandes(data.demandes ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

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
      <Helmet>
        <title>Demandes installation — Admin I-CA.RE</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-normal text-foreground">Demandes installation</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} / {demandes.length} demandes</p>
          </div>
          <div className="flex items-center gap-2">
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
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
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
                    <td className="px-4 py-3 text-muted-foreground">{d.telephone ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.profession_slug}</td>
                    <td className="px-4 py-3 text-muted-foreground">{d.ville_slug ?? "—"}</td>
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
        <SheetContent className="sm:max-w-xl overflow-y-auto">
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
                      href={`https://i-ca.re${selected.source_path}`}
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