# Routes déclarées dans App.tsx et non servies en statique · 2026-08-30

Mission `[XS] [2]` de `nuit/MISSIONS.md`. Une entrée ajoutée à la table des écarts
d'absence de `scripts/checkRoutesConcordance.mjs`.

## Un chiffre de la mission à corriger

La mission demande « une quatrième entrée ». **La table en portait déjà quatre** avant ce
geste : deux d'absence dans `App.tsx`, une d'absence du prérendu, une d'absence du sitemap.
Celle qui est ajoutée est donc la **cinquième**. Le geste demandé ne change pas, le compte
si : ce périmètre chiffré était une hypothèse, elle est fausse et je la corrige ici sans
m'arrêter dessus.

## Le geste

Une ligne ajoutée à la table `absences`, dans le bloc B, celui qui avertit :

    ["prerendu", "declare dans App.tsx, ni prerendu ni redirige", app.fixes,
     (p) => pre.routes.has(p) || pre.redirections.has(p)],

C'est le sens inverse exact de la troisième entrée, qui lit `routeMap`. La source est
`app.fixes`, déjà produite par `lireApp` et déjà en main dans `main()` sous le nom `app` :
**aucun second lecteur de routes n'est créé**, `src/App.tsx` reste lu une seule fois.

La sévérité ne bouge pas. Ces absences vont dans `avertissements`, comme les quatre autres
entrées de la table, et ne sont jamais poussées dans `bloquants`. Le code de sortie du
script ne dépend que de `bloquants.length`, qui n'est pas touché : le build ne rougit pas.

## Sortie avant

    $ node scripts/checkRoutesConcordance.mjs
    [concordance] routeMap 54 | App 80 fixes dont 36 Navigate, 8 parametrees | prerendu 63 + 20 redirections | sitemap 52 | ecarts declares 8 | interdits robots 5
    [concordance] 0 incoherence(s) bloquante(s), 0 absence(s) signalee(s).
    rc=0

## Sortie après

    $ node scripts/checkRoutesConcordance.mjs
    [concordance] routeMap 54 | App 80 fixes dont 36 Navigate, 8 parametrees | prerendu 63 + 20 redirections | sitemap 52 | ecarts declares 8 | interdits robots 5
    [concordance] ⚠ declare dans App.tsx, ni prerendu ni redirige : /admin
    [concordance] ⚠ declare dans App.tsx, ni prerendu ni redirige : /admin/demandes
    [concordance] ⚠ declare dans App.tsx, ni prerendu ni redirige : /admin/demandes-installation
    [concordance] ⚠ declare dans App.tsx, ni prerendu ni redirige : /admin/extractions
    [concordance] ⚠ declare dans App.tsx, ni prerendu ni redirige : /admin/idn-os-webhooks
    [concordance] ⚠ declare dans App.tsx, ni prerendu ni redirige : /admin/login
    [concordance] ⚠ declare dans App.tsx, ni prerendu ni redirige : /admin/praticiens
    [concordance] ⚠ declare dans App.tsx, ni prerendu ni redirige : /preview-carte-cabinets
    [concordance] ⚠ declare dans App.tsx, ni prerendu ni redirige : /preview-footer-idn
    [concordance] ⚠ declare dans App.tsx, ni prerendu ni redirige : /preview-footer-idn-v3
    rc=0

**Les compteurs de la première ligne sont identiques avant et après.** Le second nombre de
la dernière ligne passe de 0 à 10, le premier reste à 0.

## Lecture des dix routes signalées

Les dix sont des routes que le routeur sert au client mais qu'aucun HTML statique ne rend :
les sept routes d'administration, `/admin` compris, et les trois pages d'aperçu. **Les dix
sont couvertes par `Disallow` dans `public/robots.txt`** : `/admin/`, `/preview-footer-idn`,
`/preview-footer-idn-v3`, `/preview-carte-cabinets`.

Deux remarques de lecture, sans geste :

- `/admin` sans barre finale n'est pas couvert par `Disallow: /admin/`, qui porte sur le
  préfixe avec barre. Le signalement le fait apparaître.
- Le bloc C, celui des redirections clientes, tait déjà les chemins interdits aux robots.
  La nouvelle entrée ne fait pas ce tri, la mission ne le demandant pas. Aucun chemin n'est
  pourtant signalé deux fois : les seuls chemins `Navigate` que le bloc C aurait pu nommer
  sont précisément ceux que `interditAuxRobots` lui fait taire.

**Faut-il déclarer ces dix chemins dans `ECARTS_DECLARES` pour rendre le contrôle
silencieux ?** C'est un arbitrage, et il n'est pas de nuit. Ces dix avertissements sont
posés tels quels, à lire de jour.

## Ce qui n'a pas été fait, et pourquoi

Aucun build, aucun prérendu, aucune preuve prise sur `dist`. Cette mission ne touche pas au
rendu, et l'environnement de nuit n'a ni navigateur ni variables Supabase : un vert de nuit
ne vaudrait pas preuve de prérendu.

## Diff

Deux fichiers : `scripts/checkRoutesConcordance.mjs`, une entrée de table plus son
commentaire, et le présent rapport.
