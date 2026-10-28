# Dates source du sitemap I-CA.RE

[D] Lot ICARE-SITEMAP-DATES-SOURCE-1. Exécuter depuis la racine du dépôt :

```sh
node --test .ci/sitemap-source-dates/generator.test.mjs
```

Le test lance le vrai `scripts/generate-sitemap.mjs` dans des répertoires temporaires nettoyés, avec ses vrais helpers `publishedRoutes.mjs`, `siteUrl.mjs` et `norm.js`, le package et le sitemap statique copiés. Le preload remplace exclusivement fetch et l'horloge ; seuls des objets de fixture sont reçus. Toute URL autre que `https://sitemap-fixture.invalid` est refusée avant transport. Aucun service réel, aucune installation et aucun fichier dist du dépôt n'est écrit.

[M] Contrat couvert : les quatre familles dynamiques conservent une date source civile YYYY-MM-DD ou un horodatage ISO à secondes et fuseau (fraction de 1 à 6 chiffres). La sortie est une date UTC sur quatre chiffres d'année. Les calendriers impossibles, les horloges invalides, les années hors 0001 à 9999 en UTC, les types non chaîne et les formes ambiguës restent inconnus. Aucun champ lastmod n'est émis pour une date inconnue. Les dates statiques sont conservées byte pour byte.

[M] Seize tests natifs couvrent dates valides/invalides/nulles/absentes et mélangées, indépendance de l'horloge, ordre, matching négatif et portée cabinet, déduplication statique/dynamique, échappement XML, matrice installation, refus réseau requis/optionnel, garde éditoriale, deux gardes de données avant réseau optionnel, et refus de sortie sur XML statique invalide/doublons/dist absent. Les tests conservent les vrais matchers et les vrais gardes.

[M] Qualification locale : Node v24.15.0. Les neuf premiers tests étaient acquis le28/10 ; sept nouveaux tests ont été acquis le29/10 par delta, sans rejeu intégral des neuf verts. Les journaux détaillés et contrepreuves sont dans la copie de livraison, pas une qualification CI ou Node20.

[H] La validité formelle de updated_at ne prouve pas qu'il correspond à une modification significative de la page. La source métier de ce champ et le rendu réellement publié restent hors de ce lot. La règle évite uniquement d'inventer une modification à la date du build.
