// DOUBLE DE FRONTIERE NAVIGATEUR, explicitement qualifie comme tel.
//
// Le vrai puppeteer n'est pas installable hors reseau dans ce bac a sable.
// launch() leve un marqueur reconnaissable : ATTEINDRE cette frontiere prouve
// que la passe de prerender a depasse le point de garde des donnees et allait
// commencer a capturer, ce que les tests utilisent comme temoin de continuite.
export default {
  executablePath() {
    throw new Error("double de frontiere navigateur : executablePath() indisponible");
  },
  launch() {
    throw new Error("FRONTIERE_NAVIGATEUR_ATTEINTE (double de test, pas un vrai navigateur)");
  },
};
