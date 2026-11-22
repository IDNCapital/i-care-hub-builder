/** Le serveur SMTP accepte chaque destinataire à part. Aucun identifiant de boîte ne sort de ce contrôle. */
function adresse(valeur: unknown): string | null {
  if (typeof valeur === "object" && valeur !== null && "address" in valeur) valeur = valeur.address;
  if (typeof valeur !== "string") return null;
  const texte = valeur.trim();
  // Les deux options du site désignent chacune une boîte, éventuellement précédée d'un nom.
  const nommee = /^[^<>]*<([^<>]+)>$/.exec(texte);
  const boite = (nommee ? nommee[1] : texte).trim().toLowerCase();
  return /^[^\s@,;<>]+@[^\s@,;<>]+$/.test(boite) ? boite : null;
}

export function verifierAcceptationInstallation(info: unknown, attendus: { to: string; cc?: string }): void {
  if (!info || typeof info !== "object" || !("accepted" in info) || !Array.isArray(info.accepted) ||
      !("rejected" in info) || !Array.isArray(info.rejected)) {
    throw new Error("smtp_acceptation_non_confirmee");
  }
  if (info.rejected.length) throw new Error("smtp_destinataire_refuse");
  if ("pending" in info && (!Array.isArray(info.pending) || info.pending.length)) {
    throw new Error("smtp_acceptation_non_confirmee");
  }
  const acceptes = new Set(info.accepted.map(adresse));
  const attendues = (attendus.cc === undefined ? [attendus.to] : [attendus.to, attendus.cc]).map(adresse);
  if (acceptes.has(null) || acceptes.size !== new Set(attendues).size || attendues.some(boite => !boite || !acceptes.has(boite))) {
    throw new Error("smtp_acceptation_non_confirmee");
  }
}
