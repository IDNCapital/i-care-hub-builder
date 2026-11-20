// Destinataires des notifications internes d'une demande reçue sur le site.
// La boîte contact@i-ca.re (vue par Jazmin) reçoit toujours la notification,
// avec le destinataire configuré (INTERNAL_NOTIFICATION_EMAIL) en plus.
// Aucun doublon : comparaison insensible à la casse.

export const CONTACT_MAILBOX = "contact@i-ca.re";

export function buildInternalRecipients(
  configured: string | null | undefined,
  mailFromEmail: string | null | undefined,
): { to: string; cc?: string } {
  const primary = (configured ?? "").trim() || (mailFromEmail ?? "").trim() || CONTACT_MAILBOX;
  if (primary.toLowerCase() === CONTACT_MAILBOX) return { to: primary };
  return { to: primary, cc: CONTACT_MAILBOX };
}
