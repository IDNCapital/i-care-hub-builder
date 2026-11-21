import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, LogOut, ArrowLeft, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminLogout, callAdminFunction, getAdminToken } from "@/lib/adminAuth";

interface AuditRow {
  id: string;
  created_at: string;
  event_type: string;
  function_name: string | null;
  description: string;
  payload_json: unknown;
}

type Lecture = { etat: "chargement" | "recu" | "erreur"; rows: AuditRow[] };
const TYPES = ["webhook_sent", "webhook_failed", "webhook_config_missing"];
function rowsValides(value: unknown, limit: number, since?: string): AuditRow[] {
  if (!value || typeof value !== "object" || !("rows" in value)) throw new Error("Reçu absent");
  const rows = (value as { rows: unknown }).rows;
  if (!Array.isArray(rows) || rows.length > limit) throw new Error("Extrait invalide");
  const ids = new Set<string>();
  for (const r of rows) {
    if (!r || typeof r !== "object" || typeof r.id !== "string" || !r.id.trim() || ids.has(r.id) ||
      typeof r.created_at !== "string" || !Number.isFinite(Date.parse(r.created_at)) ||
      !TYPES.slice(0, limit === 500 ? 2 : 3).includes(r.event_type) ||
      (r.function_name !== null && typeof r.function_name !== "string") || typeof r.description !== "string" ||
      !("payload_json" in r) ||
      (since && Date.parse(r.created_at) < Date.parse(since))) throw new Error("Extrait incohérent");
    ids.add(r.id);
  }
  return rows as AuditRow[];
}
function useLecture(limit: 50 | 500, token: string, sessionChange: () => void) {
  const [lecture, setLecture] = useState<Lecture>({ etat: "chargement", rows: [] });
  const generation = useRef(0);
  const monte = useRef(false);
  const charger = useCallback(async () => {
    const courante = ++generation.current;
    const active = () => {
      if (!monte.current || courante !== generation.current) return false;
      if (getAdminToken() !== token) { sessionChange(); return false; }
      return true;
    };
    if (!active()) return;
    setLecture({ etat: "chargement", rows: [] });
    const since = limit === 500 ? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() : undefined;
    try {
      const res = await callAdminFunction<unknown>("admin-get-audit-log", {
        limit, event_types: TYPES.slice(0, limit === 500 ? 2 : 3), ...(since ? { since } : {}),
      });
      if (!active()) return;
      setLecture({ etat: "recu", rows: rowsValides(res, limit, since) });
    } catch { if (active()) setLecture({ etat: "erreur", rows: [] }); }
  }, [limit, token, sessionChange]);
  useEffect(() => {
    monte.current = true;
    void charger();
    const invalider = () => { ++generation.current; };
    return () => { monte.current = false; invalider(); };
  }, [charger]);
  return { ...lecture, charger };
}
export default function AdminWebhooks() {
  const [token, setToken] = useState(getAdminToken);
  const sessionChange = useCallback(() => setToken(getAdminToken()), []);
  useEffect(() => {
    window.addEventListener("storage", sessionChange);
    window.addEventListener("focus", sessionChange);
    return () => { window.removeEventListener("storage", sessionChange); window.removeEventListener("focus", sessionChange); };
  }, [sessionChange]);
  if (!token) return <main className="p-6"><p role="status">Session admin absente ou expirée.</p><a href="/admin/login">Se reconnecter</a></main>;
  return <JournalCourant key={token} token={token} sessionChange={sessionChange} />;
}
function JournalCourant({ token, sessionChange }: { token: string; sessionChange: () => void }) {
  const navigate = useNavigate();
  const journal = useLecture(50, token, sessionChange);
  const statistiques = useLecture(500, token, sessionChange);
  const rows = journal.rows;
  const loading = journal.etat === "chargement";
  const sent = statistiques.rows.filter(r => r.event_type === "webhook_sent").length;
  const failed = statistiques.rows.length - sent;
  const stats = { sent, failed, rate: statistiques.rows.length ? `${Math.round(sent / statistiques.rows.length * 100)}%` : "-" };

  const badgeForType = (type: string) => {
    switch (type) {
      case "webhook_sent":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200"><CheckCircle className="w-3 h-3 mr-1" />Envoyé</Badge>;
      case "webhook_failed":
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="w-3 h-3 mr-1" />Échec</Badge>;
      case "webhook_config_missing":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200"><AlertTriangle className="w-3 h-3 mr-1" />Config manquante</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <>
      <title>Webhooks IDN OS | Admin I-CA.RE</title>
      <meta name="robots" content="noindex,nofollow" />
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin/praticiens")}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Admin
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Webhooks IDN OS</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Lecture seule, désactivation via secrets Lovable Cloud</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await adminLogout();
                window.location.href = "/admin/login";
              }}
            >
              <LogOut className="w-4 h-4 mr-1.5" /> Se déconnecter
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          <section aria-label="Statistiques des webhooks" className="space-y-3">
            {statistiques.etat === "chargement" ? <p role="status">Lecture des statistiques…</p> : statistiques.etat === "erreur" ? <p role="status">Statistiques indisponibles. Aucun compteur confirmé.</p> : <>
              <p>Statistiques reçues : {statistiques.rows.length} événements dans l'extrait, 500 événements au plus sur les dernières 24 heures.</p>
              {statistiques.rows.length === 0 && <p>Aucun événement envoyé ou échoué dans cet extrait reçu.</p>}
          {/* Stats 24h */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Envoyés dans l’extrait (24h)</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.sent}</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Échecs dans l’extrait (24h)</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Taux sur cet extrait</p>
              <p className="text-2xl font-bold">{stats.rate}</p>
            </Card>
          </div>

            </>}
            {statistiques.etat !== "chargement" && <Button variant="outline" onClick={() => void statistiques.charger()}>{statistiques.etat === "erreur" ? "Réessayer les statistiques" : "Actualiser les statistiques"}</Button>}
          </section>

          <section aria-label="Journal des webhooks" className="space-y-3">
          {journal.etat === "recu" && <p>Extrait du journal : {rows.length} événements reçus, 50 événements au plus.</p>}
          {journal.etat !== "chargement" && <Button variant="outline" onClick={() => void journal.charger()}>{journal.etat === "erreur" ? "Réessayer le journal" : "Actualiser le journal"}</Button>}
          {/* Log table */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : journal.etat === "erreur" ? <p role="status">Journal indisponible. Aucun événement confirmé.</p> : rows.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              Aucun événement webhook dans cet extrait reçu.
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4">Date</th>
                    <th className="pb-2 pr-4">Statut</th>
                    <th className="pb-2 pr-4">Function</th>
                    <th className="pb-2 pr-4">Description</th>
                    <th className="pb-2">Détails</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2 pr-4 whitespace-nowrap font-mono text-xs">
                        {new Date(row.created_at).toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}
                      </td>
                      <td className="py-2 pr-4">{badgeForType(row.event_type)}</td>
                      <td className="py-2 pr-4 font-mono text-xs">{row.function_name || "-"}</td>
                      <td className="py-2 pr-4 max-w-[300px] truncate">{row.description}</td>
                      <td className="py-2 text-xs text-muted-foreground max-w-[200px] truncate">
                        {row.payload_json !== null ? JSON.stringify(row.payload_json) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </section>
        </main>
      </div>
    </>
  );
}
