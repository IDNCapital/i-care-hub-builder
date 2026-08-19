/**
 * Graphie d'affichage de la marque.
 *
 * La marque s'affiche `I‑CA.RE` avec un trait d'union insecable U+2011 partout
 * ou elle est lue par une personne, et garde le trait d'union ordinaire U+002D
 * partout ou elle est comparee a une source externe. La graphie se decide a la
 * destination, jamais a la source : un meme champ peut legitimement s'afficher
 * en insecable et s'ecrire en ordinaire dans un `name` de JSON-LD sur la meme
 * page. Ce helper ne sert donc qu'aux destinations d'affichage, et c'est a
 * l'appelant de ne pas l'appeler ailleurs.
 *
 * La base n'est pas touchee : elle garde U+002D, qui est la bonne graphie pour
 * une valeur comparee. La normalisation est un fait d'affichage.
 *
 * ── Pourquoi une chaine fonctionnelle ne peut pas etre atteinte ──────────
 *
 * Trois protections superposees, aucune ne reposant sur la chance.
 *
 * 1. La casse. Le motif est sensible a la casse et exige un point litteral.
 *    Les formes fonctionnelles de la marque sont toutes en minuscules : le
 *    domaine `i-ca.re` des URL et des adresses electroniques, et le slug
 *    `i-ca-re-...`, qui n'a d'ailleurs pas de point. Aucune n'est appariable.
 *
 * 2. Le jeton. La casse ne suffit pas : une URL peut porter la forme majuscule
 *    dans un parametre. Le cas existe dans ce depot, les liens Google Maps
 *    construits par `googleMapsPlaceUrl` produisent
 *    `...?api=1&query=I-CA.RE+Pey-Berland&query_place_id=...`. On borne donc le
 *    jeton non blanc qui contient l'occurrence, et on refuse le remplacement
 *    des que ce jeton ressemble a une URL ou a une adresse electronique.
 *
 * 3. Le point d'appel. Le helper n'est invoque qu'aux points d'affichage. Il
 *    n'est importe ni par `SectionAvisGoogle`, ni pour le texte des avis
 *    Google, qui est du contenu tiers cite : on ne retouche pas une citation,
 *    fut-ce d'un point de code.
 */

/** Forme comparee, U+002D. Sensible a la casse, point litteral. */
const FORME_COMPAREE = /I-CA\.RE/g;

/** Forme affichee, U+2011. */
const FORME_AFFICHEE = "I‑CA.RE";

/** Un jeton qui porte l'une de ces marques est une URL ou une adresse. */
const JETON_FONCTIONNEL = /:\/\/|^mailto:|^www\.|@/;

/**
 * Rend le meme texte avec la marque en trait d'union insecable, sans toucher
 * aux chaines fonctionnelles. Aucun effet de bord, aucune dependance.
 */
export function marqueAffichee(texte: string): string {
  return texte.replace(FORME_COMPAREE, (occurrence, index: number, source: string) => {
    // Borne du jeton non blanc contenant l'occurrence.
    let debut = index;
    while (debut > 0 && !/\s/.test(source[debut - 1])) debut -= 1;
    let fin = index + occurrence.length;
    while (fin < source.length && !/\s/.test(source[fin])) fin += 1;

    if (JETON_FONCTIONNEL.test(source.slice(debut, fin))) return occurrence;
    // Un chemin suit toujours une barre oblique : jamais un texte lu.
    if (source[index + occurrence.length] === "/") return occurrence;

    return FORME_AFFICHEE;
  });
}
