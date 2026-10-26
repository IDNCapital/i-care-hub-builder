# IndexNow : notification contrôlée des pages modifiées

Ce module prépare une notification IndexNow pour **1 à 20 pages publiques ajoutées ou mises à jour**. Il ne traite ni les suppressions ni les redirections. La simulation est le mode par défaut et ne fait **aucune requête réseau**. Il n'existe ni tâche planifiée ni branchement au déploiement automatique.

## Préparer une publication

La configuration `scripts/indexnow.config.json` et le fichier-clé public sont déjà préparés dans ce dépôt, avec une clé propre au site. Exemple de format :

```json
{"origin":"https://exemple.fr","key":"ClePubliqueUnique-2026"}
```

Publier à la racine du même hôte le fichier `public/<key>.txt` contenant exactement la clé (une seule fin de ligne est acceptée). La clé doit compter 8 à 128 caractères alphanumériques ou tirets. Le fichier de configuration et la clé sont nécessaires avant tout envoi. La clé IndexNow est une preuve publique de contrôle de l'hôte, pas un secret à mettre dans une URL privée ou un cookie.

Après publication effective des pages, créer un fichier texte contenant **uniquement** les URL absolues HTTPS réellement modifiées, une par ligne :

```text
https://exemple.fr/projets/toulouse
https://exemple.fr/actualites
```

Depuis la racine du site :

```sh
node scripts/indexnow.mjs --urls /chemin/vers/urls-modifiees.txt
node scripts/indexnow.mjs --urls /chemin/vers/urls-modifiees.txt --submit
```

La première commande valide la configuration et la liste, puis affiche `simulation` sans accès réseau. La seconde vérifie séquentiellement le fichier-clé public (HTTP 200, sans redirection, contenu exact), `sitemap.xml` (HTTP 200, `<urlset>` contenant **chaque URL exacte**) et chaque page (HTML 200 sans redirection, une seule canonical absolue égale à l'URL, aucune directive `noindex`/`nosnippet` dans les métas robots ou `X-Robots-Tag`). Elle effectue ensuite **un seul POST groupé** vers `https://api.indexnow.org/indexnow`, sans relance automatique. Chaque accès a un délai maximal de 10 secondes.

Une réponse `reçu` (HTTP 200) confirme seulement la réception ; `clé-en-attente` (HTTP 202) signifie que la vérification de la clé reste à faire. Aucune des deux ne prouve le crawl, l'indexation ou la citation dans une réponse IA. En cas d'erreur, corriger la cause puis relancer manuellement seulement si les pages ont réellement changé. Un sitemap existant reste le moyen de présenter l'inventaire complet des URL ; ne pas donner tout le sitemap au module.

## Garde-fous et portée

- Le module refuse les URL d'un autre hôte, les ports explicites, identifiants, paramètres, fragments, doublons, chemins encodés ou normalisés, et les segments privés courants (`admin`, `auth`, `login`, `operator`, `dashboard`, `preview`, ainsi que leurs variantes françaises/anglaises et préfixes de langue). Cette version refuse volontairement les chemins percent-encodés : conserver ces URL dans le sitemap habituel, sans renommer une route pour les besoins de cet outil.
- Le sitemap attendu est un `sitemap.xml` direct de type `<urlset>` ; les index de sitemaps ne sont pas pris en charge. Les pages qui ne figurent que dans un sitemap enfant ne seront pas soumises.
- L'analyse HTML contrôle les balises `<link rel="canonical">` et `<meta name="robots|...bot">` servies dans le HTML reçu. Elle ne remplace pas la vérification de la configuration robots.txt, du pare-feu, ni une inspection d'indexation chez chaque moteur.
- IndexNow diffuse la notification aux **moteurs participants** selon son protocole. Il ne notifie pas directement Claude ou Perplexity et ne garantit aucune citation.

Référence : [documentation officielle IndexNow](https://www.indexnow.org/documentation).

## Intégration et contrôle

Exécution prévue par Claude après revue, levée de la pause de publication et contrôle du site effectivement publié. Aucune clé ni notification n’est active du seul fait de cette PR. Node.js 22 ou 24 ; aucun paquet ni service payant supplémentaire. Vérification hors réseau : `node --test tests/indexnow.test.mjs`. Conserver le reçu daté de soumission dans le registre web existant, puis distinguer ce reçu de l’indexation constatée dans les outils des moteurs.
