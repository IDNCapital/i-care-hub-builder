# Installation : raccord et langue du formulaire, REV2

Demande manager du 11/11/2026 a 08:12 Paris. Reservation ecrite a 08:39 dans COORDINATION_CODEX.md. Claude reste integrateur. Base autonome : bundle local i-care-hub-builder, refs/remotes/origin/main, 939c0eca669cb092b33ec9e5700c2240b9a54ccc. La remise precedente dde080f5 ne contenait que le composant : erreurs anglaises mais formulaire francais, sans test ni notice livres.

## Resultat

Le composant choisit les textes FR/EN selon la langue resolue de la page, y compris les variantes en-GB. Libelles, aide autre profession, choix de cabinet, placeholder, compteur, consentement, lien de confidentialite, bouton, attente, refus serveur, confirmation et statut de retrait suivent cette langue. Le lien utilise localePath : /confidentialite en FR et /en/privacy en EN. Le changement de langue conserve la saisie et retraduit les refus deja affiches.

Les descriptions d'erreur restent liees aux champs par aria-describedby, avec focus apres rendu du refus. Le bouton, les conditions de validation, la garde d'offre publique, le filtrage des deux identites Floirac, la charge de submit-demande-installation, le honeypot et la branche Analytics sont conserves.

Le dictionnaire local couvre les 14 slugs des deux migrations de professions disponibles, plus autre-profession. Les noms propres des cabinets ne sont pas traduits. Un futur slug non connu conserve son libelle source pour ne pas perdre sa precision : son contenu anglais devra etre qualifie au moment de son ajout. Aucun catalogue reel n'a ete consulte. Les fichiers de traduction Professionnels ne sont pas touches.

## Verification locale du 11/11/2026

N1 reproduit d'abord le refus manager sur la remise precedente : le libelle Name est absent. REV2 : 12 cas DOM verts (FR/EN, variante et bascule, refus et focus, autre profession, deux alias Floirac, options filtrees, attente et succes simules, refus serveur et rejet simules). Les transports sont des substituts locaux explicites et aucune requete ne sort du banc.

Rejouer avec les dependances deja disponibles, sans installation :

```sh
python3 .ci/installation-feedback-1111/run.py dom --tools-dir=/chemin/local/node_modules
python3 .ci/installation-feedback-1111/run.py types-product
python3 .ci/installation-feedback-1111/run.py types-qa
python3 .ci/installation-feedback-1111/run.py types-project-explicit
python3 .ci/installation-feedback-1111/invariants.py
```

Le banc interdit le chargement du SDK natif, des hooks producteurs et Analytics natif. Les primitives fetch, XHR, WebSocket, EventSource, beacon et clic de lien sont fermees ; leur identite et l'absence d'appel sont verifiees. Le repertoire d'environnement est vide. Le lanceur passe un environnement minimal, epingle les fichiers et versions deja disponibles, puis compare les empreintes avant/apres. Il exige exactement 12 cas actifs verts.

Typecheck produit borne et QA verts. Le projet complet est vert avec --types react,react-dom. La commande brute du projet rencontre TS2688 sur mapbox__point-geometry dans le cache local de dependances ; cette limite d'outillage est conservee dans les preuves, sans installation ni modification du projet pour la masquer. Aucun test n'a ete ajoute sous src.

## Livraison et limites

La remise autonome contient PATCH.patch, MANIFEST.json (avant/apres SHA256 pour chaque fichier et SHA256 du patch), NOTICE.md et logs dates. Le causal et les executions finales sont remis a Claude pour revue puis integration. Aucun commit du depot partage, reseau, acces aux secrets, envoi, installation, relais, publication ou parcours metier n'a ete effectue. Le rendu DOM simule ne prouve ni envoi reel ni usage en production. Prochain responsable : Claude, apres revue independante Root.
