import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Loader2, LogOut, ArrowLeft, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminLogout, callAdminFunction } from "@/lib/adminAuth";

interface AuditRow {
  id: string;
  created_at: string;
  event_type: string;
  function_name: string | null;
  description: string;
  payload_json: Record<string, unknown> | null;
}

export default function AdminWebhooks() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ sent: 0, failed: 0, rate: "-" });

  useEffect(() => {
    (async () => {
      try {
        // Last 50 webhook events (via admin Edge Function, service_role)
        const listRes = await callAdminFunction<{ rows: AuditRow[] }>("admin-get-audit-log", {
          limit: 50,
          event_types: ["webhook_sent", "webhook_failed", "webhook_config_missing"],
        });
        if (listRes?.rows) setRows(listRes.rows);

        // 24h stats
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const statsRes = await callAdminFunction<{ rows: Array<{ event_type: string }> }>(
          "admin-get-audit-log",
          {
            limit: 500,
            event_types: ["webhook_sent", "webhook_failed"],
            since,
          },
        );
        const recent = statsRes?.rows ?? [];
        const sent = recent.filter((r) => r.event_type === "webhook_sent").length;
        const failed = recent.filter((r) => r.event_type === "webhook_failed").length;
        const total = sent + failed;
        setStats({
          sent,
          failed,
          rate: total > 0 ? `${Math.round((sent / total) * 100)}%` : "-",
        });
      } catch {
        // silent : page reste en état vide
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
      <Helmet>
        <title>Webhooks IDN OS | Admin I-CA.RE</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
          {/* Stats 24h */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Envoyés (24h)</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.sent}</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Échecs (24h)</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Taux de succès</p>
              <p className="text-2xl font-bold">{stats.rate}</p>
            </Card>
          </div>

          {/* Log table */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : rows.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              Aucun événement webhook enregistré.
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
                        {row.payload_json ? JSON.stringify(row.payload_json) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
}