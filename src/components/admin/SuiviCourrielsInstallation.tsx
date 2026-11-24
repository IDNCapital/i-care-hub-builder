export type TracesCourrielsInstallation = {
  ack_sent_at?: string | null;
  notified_at?: string | null;
  email_send_error?: string | null;
};

const dateParis = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short", timeStyle: "short", timeZone: "Europe/Paris",
});

function horodatage(valeur: unknown) {
  if (valeur == null) return "Aucune trace d’envoi enregistrée.";
  if (typeof valeur !== "string") return "Horodatage illisible.";
  // PostgREST renvoie un instant ISO avec décalage et parfois des microsecondes.
  const iso = /^(\d{4}-\d{2}-\d{2})T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,6})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.exec(valeur);
  const instant = new Date(valeur);
  if (!iso || !Number.isFinite(instant.getTime())) return "Horodatage illisible.";
  const jour = new Date(iso[1] + "T00:00:00Z");
  if (!Number.isFinite(jour.getTime()) || jour.toISOString().slice(0, 10) !== iso[1]) return "Horodatage illisible.";
  return "Envoi horodaté le " + dateParis.format(instant) + " (Paris).";
}

function incidents(valeur: unknown): string[] {
  if (valeur == null || valeur === "") return [];
  if (valeur === "smtp_not_configured") return ["Service de courriel non configuré au moment de la demande."];
  const generique = ["Un incident de courriel a été enregistré. Le détail est à vérifier."];
  if (typeof valeur !== "string") return generique;
  const etapes = valeur.split(" / ");
  const messages: string[] = [];
  for (const etape of etapes) {
    const code = /^(ack|notification): (smtp_destinataire_refuse|smtp_acceptation_non_confirmee)$/.exec(etape);
    if (!code) return generique;
    const canal = code[1] === "ack" ? "Accusé au candidat" : "Notification à l’équipe";
    const detail = code[2] === "smtp_destinataire_refuse"
      ? "le serveur a refusé au moins un destinataire." : "l’acceptation par le serveur reste à confirmer.";
    messages.push(canal + ", " + detail);
  }
  return [...new Set(messages)];
}

export function SuiviCourrielsInstallation({ traces }: { traces: TracesCourrielsInstallation }) {
  return (
    <section aria-label="Suivi des courriels" className="space-y-2">
      <h3 className="text-sm font-medium">Suivi des courriels</h3>
      <dl className="text-sm">
        <dt className="font-medium">Accusé au candidat</dt>
        <dd>{horodatage(traces.ack_sent_at)}</dd>
        <dt className="font-medium mt-2">Notification à l’équipe</dt>
        <dd>{horodatage(traces.notified_at)}</dd>
      </dl>
      {incidents(traces.email_send_error).map(message => (
        <p className="text-sm text-amber-900" key={message}>{message}</p>
      ))}
      <p className="text-xs text-muted-foreground">La réception dans chaque boîte reste à vérifier séparément.</p>
    </section>
  );
}
