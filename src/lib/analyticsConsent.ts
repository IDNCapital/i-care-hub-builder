export type ChoixMesure = "accepted" | "refused";
export type EtatChoixMesure = {
  choix: ChoixMesure | null;
  stockage: "confirme" | "absent" | "illisible" | "inconnu" | "non-confirme";
};

// Un geste non memorise reste prioritaire jusqu'au rechargement.
// Aucune autre persistance ou transmission n'est ajoutee.
let choixVisite: EtatChoixMesure | null = null;

export function lireChoixMesure(): EtatChoixMesure {
  if (choixVisite?.stockage === "non-confirme") return choixVisite;
  try {
    const valeur = localStorage.getItem("cookie-consent");
    if (valeur === "accepted" || valeur === "refused") {
      const etat: EtatChoixMesure = { choix: valeur, stockage: "confirme" };
      if (choixVisite) choixVisite = etat;
      return etat;
    }
    const etat: EtatChoixMesure = { choix: null, stockage: valeur === null ? "absent" : "inconnu" };
    if (choixVisite) choixVisite = etat;
    return etat;
  } catch {
    return choixVisite ?? { choix: null, stockage: "illisible" };
  }
}

export function choisirMesure(choix: ChoixMesure): EtatChoixMesure {
  choixVisite = { choix, stockage: "non-confirme" };
  try {
    localStorage.setItem("cookie-consent", choix);
    if (localStorage.getItem("cookie-consent") === choix) {
      choixVisite = { choix, stockage: "confirme" };
    }
  } catch {
    // Le choix courant est applique meme si sa persistance n'est pas recue.
  }
  return choixVisite;
}
