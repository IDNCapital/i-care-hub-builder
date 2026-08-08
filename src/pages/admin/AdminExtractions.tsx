import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, RefreshCw, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { callAdminFunction, getAdminToken } from "@/lib/adminAuth";
import type { Praticien } from "./AdminPraticiens";

type LogEntry = {
  ts?: string;
  status?: string;
  reason?: string;
  error?: string;
  confiance?: string;
  specialites_count?: number;
  problematiques_count?: number;
};

type Status = "success" | "review" | "error" | "skipped" | "pending";

const STATUS_META: Record<Status, { label: string; className: string }> = {
  success: { label: "Succès", className: "bg-green-100 text-green-900 border-green-300" },
  review: { label: "À vérifier", className: "bg-amber-100 text-amber-900 border-amber-300" },
  error: { label: "Erreur", className: "bg-red-100 text-red-900 border-red-300" },
  skipped: { label: "Ignoré", className: "bg-muted text-muted-foreground" },
  pending: { label: "En attente", className: "bg-sky-100 text-sky-900 border-sky-300" },
};

function lastLog(p: Praticien): LogEntry | null {
  const log = (p as unknown as { tags_extraction_log?: LogEntry[] }).tags_extraction_log;
  if (!Array.isArray(log) || log.length === 0) return null;
  return log[log.length - 1];
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function summarizeLog(entry: LogEntry | null): string {
  if (!entry) return "—";
  const bits: string[] = [];
  if (entry.reason) bits.push(entry.reason);
  if (entry.error) bits.push(entry.error);
  if (entry.confiance) bits.push(`confiance ${entry.confiance}`);
  if (typeof entry.specialites_count === "number" || typeof entry.problematiques_count === "number") {
    bits.push(
      `${entry.specialites_count ?? 0} spé · ${entry.problematiques_count ?? 0} pb`,
    );
  }
  return bits.length ? bits.join(", ") : entry.status ?? "—";
}

export default function AdminExtractions() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [praticiens, setPraticiens] = useState<Praticien[]>([]);
  const [tab, setTab] = useState<Status>("error");
  const [reExtractingId, setReExtractingId] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    if (!getAdminToken()) {
      navigate("/admin/login");
      return;
    }
    try {
      const result = await callAdminFunction<{ praticiens: Praticien[] }>(
        "admin-list-praticiens",
        {},
      );
      setPraticiens(result.praticiens ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur de chargement");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groups = useMemo(() => {
    const g: Record<Status, Praticien[]> = {
      success: [],
      review: [],
      error: [],
      skipped: [],
      pending: [],
    };
    for (const p of praticiens) {
      const s = (p.tags_extraction_status as Status) || "pending";
      (g[s] ?? g.pending).push(p);
    }
    return g;
  }, [praticiens]);

  const counts = useMemo(
    () => ({
      success: groups.success.length,
      review: groups.review.length,
      error: groups.error.length,
      skipped: groups.skipped.length,
      pending: groups.pending.length,
    }),
    [groups],
  );

  const handleReExtract = async (p: Praticien) => {
    setReExtractingId(p.id);
    try {
      await callAdminFunction("admin-reextract-tags", { praticien_id: p.id });
      toast.success(`Extraction relancée, ${p.prenom} ${p.nom}`);
      await fetchAll();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Échec de relance");
    } finally {
      setReExtractingId(null);
    }
  };

  const renderRows = (rows: Praticien[]) => {
    if (loading) {
      return (
        <div className="p-12 text-center text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
          Chargement…
        </div>
      );
    }
    if (rows.length === 0) {
      return (
        <div className="p-12 text-center text-muted-foreground text-sm">
          Aucune fiche dans cet état.
        </div>
      );
    }
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-4 py-3">Praticien</th>
              <th className="text-left font-medium px-4 py-3">Statut</th>
              <th className="text-left font-medium px-4 py-3">Dernière extraction</th>
              <th className="text-left font-medium px-4 py-3">Dernier message</th>
              <th className="text-right font-medium px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const entry = lastLog(p);
              const status = (p.tags_extraction_status as Status) || "pending";
              const meta = STATUS_META[status] ?? STATUS_META.pending;
              return (
                <tr key={p.id} className="border-t hover:bg-muted/30 transition">
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {p.prenom} {p.nom}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {p.profession} · {p.cabinet_slug}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={meta.className}>
                      {meta.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(p.tags_extracted_at)}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div className="max-w-md">{summarizeLog(entry)}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReExtract(p)}
                        disabled={reExtractingId === p.id}
                      >
                        {reExtractingId === p.id ? (
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                        )}
                        Relancer
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/praticiens?focus=${p.slug}`)
                        }
                      >
                        Voir fiche
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Extractions | Admin I‑CA.RE</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="min-h-screen bg-background">
        <header className="border-b bg-card sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Suivi des extractions de tags</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                <Sparkles className="w-3 h-3 inline-block mr-1" />
                {counts.success} succès · {counts.review} à vérifier · {counts.error} erreurs · {counts.skipped} ignorés · {counts.pending} en attente
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAll}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-1.5" />
                )}
                Rafraîchir
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/praticiens")}
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Retour praticiens
              </Button>
            </div>
          </div>
        </header>

        <section className="max-w-7xl mx-auto px-6 py-6">
          <Tabs value={tab} onValueChange={(v) => setTab(v as Status)}>
            <TabsList>
              <TabsTrigger value="error">Erreurs ({counts.error})</TabsTrigger>
              <TabsTrigger value="review">À vérifier ({counts.review})</TabsTrigger>
              <TabsTrigger value="success">Succès ({counts.success})</TabsTrigger>
              <TabsTrigger value="skipped">Ignorés ({counts.skipped})</TabsTrigger>
              <TabsTrigger value="pending">En attente ({counts.pending})</TabsTrigger>
            </TabsList>
            {(["error", "review", "success", "skipped", "pending"] as Status[]).map((s) => (
              <TabsContent key={s} value={s} className="mt-4">
                <Card className="overflow-hidden">{renderRows(groups[s])}</Card>
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </main>
    </>
  );
}