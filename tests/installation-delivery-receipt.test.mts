import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { after, test } from "node:test";
import { verifierAcceptationInstallation } from "../supabase/functions/_shared/installationDeliveryReceipt.ts";
import { CONTACT_MAILBOX } from "../supabase/functions/_shared/notificationRecipients.ts";

const principal = "gestion@example.invalid";
const candidat = "candidat@example.invalid";
const destinataires = { to: principal, cc: CONTACT_MAILBOX };
const accepte = (...accepted: string[]) => ({ accepted, rejected: [] });

test("nom affiché, casse, doublon et anciennes adresses simples", () => {
  verifierAcceptationInstallation({ accepted: [{ address: principal.toUpperCase() }, CONTACT_MAILBOX], rejected: [] },
    { to: "Équipe <" + principal + ">", cc: CONTACT_MAILBOX });
  verifierAcceptationInstallation(accepte(principal), { to: principal, cc: principal.toUpperCase() });
});
for (const [nom, valeur] of Object.entries({
  "principal seul": accepte(principal), "copie seule": accepte(CONTACT_MAILBOX),
  "autre boîte": accepte("autre@example.invalid", principal),
  "boîte en plus": accepte(principal, CONTACT_MAILBOX, "autre@example.invalid"),
  "liste absente": {}, "refus non lu": { accepted: [principal, CONTACT_MAILBOX] },
  "acceptation partielle": { accepted: [principal], rejected: [CONTACT_MAILBOX] },
  "reçu contradictoire": { accepted: [principal, CONTACT_MAILBOX], rejected: [principal] },
  "en attente": { ...accepte(principal, CONTACT_MAILBOX), pending: [CONTACT_MAILBOX] },
  "adresse illisible": { accepted: [null, principal], rejected: [] },
})) {
  test(nom + " ne confirme pas la notification", () => {
    assert.throws(() => verifierAcceptationInstallation(valeur, destinataires), err =>
      err instanceof Error && /^smtp_/.test(err.message) && !err.message.includes("@"));
  });
}

// Monter le vrai point d'entrée Deno, en remplaçant ses deux imports de transport avant leur résolution.
const fixtures = { recus: [] as unknown[], appels: [] as { to: string; cc?: string }[], suivi: {} as Record<string, unknown> };
let handler: (req: Request) => Promise<Response>;
const sdk = {
  from(table: string) {
    const q = {
      select: () => q, eq: () => q, insert: () => q,
      gte: async () => ({ count: 0 }),
      maybeSingle: async () => ({ data: { slug: "test", actif: true }, error: null }),
      single: async () => ({ data: { id: "id-fictif", created_at: "2026-11-21T10:00:00Z" }, error: null }),
      update: (champs: Record<string, unknown>) => {
        assert.equal(table, "demandes_installation"); fixtures.suivi = champs;
        return { eq: async () => ({ error: null }) };
      },
    }; return q;
  },
};
const mail = { createTransport: () => ({ sendMail: async (message: { to: string; cc?: string }) => {
  fixtures.appels.push({ to: message.to, cc: message.cc }); return fixtures.recus.shift();
} }) };
const cle = Symbol.for("icare.installation.test.transports");
const avantDeno = Object.getOwnPropertyDescriptor(globalThis, "Deno");
const avantFetch = globalThis.fetch;
Object.assign(globalThis, { [cle]: { sdk, mail }, Deno: {
  serve: (fn: typeof handler) => { handler = fn; },
  env: { get: (nom: string) => ({ IDN_OS_WEBHOOK_ENABLED: "false", INTERNAL_NOTIFICATION_EMAIL: principal,
    MAIL_FROM_EMAIL: principal, INFOMANIAK_SMTP_PORT: "465" }[nom] ?? "fixture") },
} });
globalThis.fetch = () => { throw new Error("Transport externe fermé"); };
const hooks = registerHooks({ resolve(specifier, context, next) {
  const source = specifier === "npm:nodemailer@6.9.16" ? "export default globalThis[Symbol.for('icare.installation.test.transports')].mail" :
    specifier === "https://esm.sh/@supabase/supabase-js@2.49.1" ? "export const createClient = () => globalThis[Symbol.for('icare.installation.test.transports')].sdk" : null;
  if (source) return { shortCircuit: true, url: "data:text/javascript," + encodeURIComponent(source) };
  if (/^(?:https?:|npm:)/.test(specifier)) throw new Error("Import externe fermé");
  return next(specifier, context);
} });
await import("../supabase/functions/submit-demande-installation/index.ts");
after(() => {
  hooks.deregister(); Reflect.deleteProperty(globalThis, cle); globalThis.fetch = avantFetch;
  if (avantDeno) Object.defineProperty(globalThis, "Deno", avantDeno); else Reflect.deleteProperty(globalThis, "Deno");
});

async function soumettre(recuCandidat: unknown, recuEquipe: unknown) {
  fixtures.recus = [recuCandidat, recuEquipe]; fixtures.appels = []; fixtures.suivi = {};
  const response = await handler(new Request("https://site.invalid/demande", { method: "POST",
    body: JSON.stringify({ profession_slug: "test", nom: "Test", email: candidat, consentement_rgpd: true }) }));
  assert.equal(response.status, 200); assert.deepEqual(await response.json(), { ok: true, id: "id-fictif" });
  assert.deepEqual(fixtures.appels, [{ to: candidat, cc: undefined }, destinataires]);
  return fixtures.suivi;
}
test("une seule boîte acceptée conserve le dépôt et l'accusé candidat, sans second envoi", async () => {
  const suivi = await soumettre(accepte(candidat), { accepted: [principal], rejected: [CONTACT_MAILBOX] });
  assert.ok(suivi.ack_sent_at); assert.equal(suivi.notified_at, undefined);
  assert.equal(suivi.email_send_error, "notification: smtp_destinataire_refuse");
});
test("un accusé candidat non confirmé ne masque pas les deux destinataires équipe acceptés", async () => {
  const suivi = await soumettre(null, accepte(CONTACT_MAILBOX, principal));
  assert.equal(suivi.ack_sent_at, undefined); assert.ok(suivi.notified_at);
  assert.equal(suivi.email_send_error, "ack: smtp_acceptation_non_confirmee");
});
test("tous les destinataires acceptés renseignent les deux dates indépendantes", async () => {
  const suivi = await soumettre(accepte(candidat), accepte(principal, CONTACT_MAILBOX));
  assert.ok(suivi.ack_sent_at); assert.ok(suivi.notified_at); assert.equal(suivi.email_send_error, undefined);
});
