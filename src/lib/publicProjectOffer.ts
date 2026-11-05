// Floirac is archived after the withdrawal decision of 4 November 2026.
// Match project identities only: the city remains a valid geographic reference.
export function isPublicProjectOffer(slug: string | null | undefined): boolean {
  return slug !== "i-ca-re-floirac" && slug !== "floirac";
}
