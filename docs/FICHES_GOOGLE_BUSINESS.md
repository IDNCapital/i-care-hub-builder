# Fiches Google Business, prêtes à coller

Lot ENTRANT-GOOGLE-PAGES-1, 28/10/2026. Décision de Nicolas du 27/10/2026 : une fiche Google Business par adresse (canal « demande entrante »). Fichier préparé par un agent : **aucune fiche n'est créée**, c'est Nicolas qui crée chaque fiche. À relire par Nicolas avant toute mise en ligne ; aucune publication par un agent.

Sources des chiffres : base IDN OS (tables `projects` et `project_units`, lue en SELECT le 28/10/2026) et annonces relues `Acquisition/JOURNAL/ANNONCES_ET_PARRAINAGE_2026-10-27.md`. Le détail ligne par ligne figure dans `src/lib/cabinetsALouer.ts`. Le parrainage n'apparaît dans aucune fiche (décision du 27/10 : message privé seulement).

## Champs communs

- **Catégorie principale proposée** : « Agence de location de bureaux » ; catégorie secondaire possible : « Centre médical ». Proposition à discuter : le libellé exact se choisit dans la liste de Google, non vérifiée ici.
- **Téléphone** : 07 81 24 05 15 (source : `src/lib/contact.ts`, numéro déjà publié sur le site). Point 9 des annonces : confirmer qu'il est le bon numéro de réponse.
- **Courriel affiché sur le site** : contact@i-ca.re (point 9 ouvert : confirmer).
- **Horaires** : aucune source (ni la base ni les annonces ne portent d'horaires). À renseigner par Nicolas, ou choisir « sur rendez vous » si Google le propose.
- **Paramètre source** : chaque lien porte `?source=fiche-google-<lieu>` ; la page le transmet au formulaire de contact dans `utm_campaign`, et la page elle même s'identifie par `source=page-cabinet-<lieu>` (rangé dans `utm_source`).
- **Hypothèse non vérifiée, à contrôler par Nicolas** : Google n'accepte en principe une fiche avant ouverture que si l'ouverture est proche (de l'ordre de quatre vingt dix jours) ; Le Bouscat, Toulouse Capitole et Floirac pourraient devoir attendre.

## I-CA.RE Chartrons

- **Nom** : I-CA.RE Chartrons
- **Adresse** : 20 cours Saint Louis, 33300 Bordeaux
- **État** : Lieu livré (base : livraison 01/10/2026).
- **Horaires** : à renseigner (aucune source).
- **Lien** : https://i-ca.re/cabinet-a-louer/bordeaux-chartrons/?source=fiche-google-chartrons
- **Description** (502 caractères sur 750) :

```
I-CA.RE Chartrons est un lieu partagé pour praticiens indépendants de santé et de bien être, au 20 cours Saint Louis, dans le quartier des Chartrons à Bordeaux. Deux cabinets sont disponibles à la location : le cabinet 1 de 11,1 m² à 690 € par mois et le cabinet 5 de 13,1 m² à 790 € par mois. Psychologues, psychothérapeutes, sophrologues, ostéopathes, diététiciens et médecins y exercent dans un cadre professionnel, aux côtés d'autres praticiens, sans investir dans un local. Visite sur rendez vous.
```

Variantes de titre et de méta par recherche visée (une section par profession sur la page, pas de page dupliquée) :

| Recherche visée | Titre | Méta description |
|---|---|---|
| cabinet psychologue à louer Bordeaux Chartrons | Cabinet de psychologue à louer aux Chartrons, Bordeaux | I-CA.RE | Cabinet de 11,1 ou 13,1 m² pour psychologue au 20 cours Saint Louis, Bordeaux Chartrons, à 690 ou 790 € par mois. Visite sur rendez vous. |
| cabinet ostéopathe à louer Bordeaux Chartrons | Cabinet d'ostéopathe à louer aux Chartrons, Bordeaux | I-CA.RE | Deux cabinets libres aux Chartrons pour ostéopathe : 11,1 m² à 690 € et 13,1 m² à 790 € par mois, dans un lieu partagé entre praticiens. |
| cabinet médical à louer Bordeaux Chartrons | Cabinet médical à louer aux Chartrons, Bordeaux : dès 690 € | I-CA.RE | Cabinet pour médecin ou praticien de santé, 20 cours Saint Louis, Bordeaux : 11,1 à 13,1 m², de 690 à 790 € par mois. |

## I-CA.RE Le Bouscat

- **Nom** : I-CA.RE Le Bouscat
- **Adresse** : 212 avenue de la Libération Charles de Gaulle, 33110 Le Bouscat
- **État** : Non ouvert : premières disponibilités le 18/01/2027 selon la base, projet en phase promesse.
- **Horaires** : à renseigner (aucune source).
- **Lien** : https://i-ca.re/cabinet-a-louer/le-bouscat/?source=fiche-google-le-bouscat
- **Description** (455 caractères sur 750) :

```
I-CA.RE Le Bouscat est un nouveau lieu de santé et de bien être au 212 avenue de la Libération Charles de Gaulle, au Bouscat. Neuf bureaux de praticien sont proposés à la location, de 10,4 à 19,8 m², de 700 à 910 € par mois, avec des disponibilités à partir du 18/01/2027 selon le bureau. Le lieu comprend un espace détente partagé. Un cadre professionnel commun à plusieurs praticiens, sans investissement de départ dans un local. Visite sur rendez vous.
```

Variantes de titre et de méta par recherche visée (une section par profession sur la page, pas de page dupliquée) :

| Recherche visée | Titre | Méta description |
|---|---|---|
| cabinet psychologue à louer Le Bouscat | Bureau de psychologue à louer au Bouscat : 10 à 20 m² | I-CA.RE | Bureaux pour psychologue au 212 avenue de la Libération Charles de Gaulle, Le Bouscat : 10,4 à 19,8 m², de 700 à 910 € par mois, dès 2027. |
| cabinet médecin à louer Le Bouscat | Bureau de médecin à louer au Bouscat, dès 2027 | I-CA.RE | Neuf bureaux de praticien au Bouscat, de 700 à 910 € par mois, espace détente partagé. Disponibilités à partir du 18/01/2027 selon le bureau. |

## I-CA.RE Toulouse Capitole

- **Nom** : I-CA.RE Toulouse Capitole
- **Adresse** : 5t rue Mirepoix, 31000 Toulouse (« 5t » à confirmer, point 5 ; la page publie « rue Mirepoix » sans numéro)
- **État** : Non ouvert : ouverture en mars 2027 (décision de Nicolas), disponibilité 01/03/2027 en base.
- **Horaires** : à renseigner (aucune source).
- **Lien** : https://i-ca.re/cabinet-a-louer/toulouse-capitole/?source=fiche-google-toulouse-capitole
- **Description** (433 caractères sur 750) :

```
I-CA.RE Toulouse Capitole ouvre en mars 2027 un lieu partagé pour praticiens de santé et de bien être, rue Mirepoix, dans le secteur Capitole à Toulouse. Cinq cabinets au rez de chaussée, de 11,32 à 14,39 m², sont proposés de 700 à 800 € par mois selon la surface, disponibles le 01/03/2027. Un cadre professionnel partagé avec d'autres praticiens, en centre ville. Il est possible de réserver dès maintenant le cabinet de son choix.
```

Variantes de titre et de méta par recherche visée (une section par profession sur la page, pas de page dupliquée) :

| Recherche visée | Titre | Méta description |
|---|---|---|
| cabinet psychologue à louer Toulouse Capitole | Cabinet de psychologue à louer à Toulouse Capitole | I-CA.RE | Cinq cabinets pour psychologue rue Mirepoix, Toulouse Capitole : 11,32 à 14,39 m², de 700 à 800 € par mois, disponibles le 01/03/2027. |
| cabinet sophrologue à louer Toulouse centre | Cabinet de sophrologue à louer à Toulouse centre | I-CA.RE | Cabinets de 11 à 14 m² rue Mirepoix, Toulouse Capitole, de 700 à 800 € par mois. Ouverture en mars 2027, réservation possible dès maintenant. |

## I-CA.RE Floirac

- **Nom** : I-CA.RE Floirac
- **Adresse** : 23 avenue de la Libération, 33270 Floirac
- **État** : Non ouvert : ouverture prévue en 2027 (base : disponibilité 30/06/2027, point 6 ouvert).
- **Horaires** : à renseigner (aucune source).
- **Lien** : https://i-ca.re/cabinet-a-louer/floirac/?source=fiche-google-floirac
- **Description** (370 caractères sur 750) :

```
I-CA.RE Floirac prépare un lieu partagé pour praticiens de santé et de bien être au 23 avenue de la Libération, à Floirac, aux portes de Bordeaux. Quinze cabinets seront proposés à 580 € par mois. Un cadre professionnel commun à plusieurs praticiens, sans investissement de départ dans un local. Ouverture prévue en 2027 : les premiers inscrits choisissent leur cabinet.
```

Variantes de titre et de méta par recherche visée (une section par profession sur la page, pas de page dupliquée) :

| Recherche visée | Titre | Méta description |
|---|---|---|
| cabinet psychologue à louer Floirac | Cabinet de psychologue à louer à Floirac : 580 € par mois | I-CA.RE | Quinze cabinets de praticien au 23 avenue de la Libération, Floirac, à 580 € par mois. Ouverture prévue en 2027, inscription ouverte. |
| cabinet à louer rive droite Bordeaux | Cabinet de praticien à louer rive droite, Floirac | I-CA.RE | Aux portes de Bordeaux, quinze cabinets à 580 € par mois dans un lieu partagé entre praticiens. Ouverture prévue en 2027. |

## I-CA.RE Jardin Public

- **Nom** : I-CA.RE Jardin Public
- **Adresse** : 38 cours du Maréchal Foch, 33000 Bordeaux
- **État** : Ouvert (phase Exploitation en base).
- **Horaires** : à renseigner (aucune source).
- **Lien** : https://i-ca.re/cabinet-a-louer/bordeaux-jardin-public/?source=fiche-google-jardin-public
- **Description** (383 caractères sur 750) :

```
I-CA.RE Jardin Public est un lieu partagé pour praticiens de santé et de bien être au 38 cours du Maréchal Foch, à Bordeaux, à proximité du Jardin Public. Un bureau est proposé à temps partiel, à 250 € par mois : une formule adaptée aux praticiens qui gardent un autre lieu d'exercice ou qui démarrent. Un cadre professionnel partagé avec d'autres praticiens. Visite sur rendez vous.
```

Variantes de titre et de méta par recherche visée (une section par profession sur la page, pas de page dupliquée) :

| Recherche visée | Titre | Méta description |
|---|---|---|
| bureau temps partiel psychologue Bordeaux | Bureau à temps partiel pour psychologue, Bordeaux | I-CA.RE | Bureau de praticien à temps partiel au 38 cours du Maréchal Foch, Bordeaux, près du Jardin Public : 250 € par mois. Visite sur rendez vous. |
| cabinet à louer temps partiel Bordeaux centre | Cabinet à temps partiel à louer, Bordeaux centre : 250 € | I-CA.RE | Pour compléter un autre lieu d'exercice : bureau à temps partiel près du Jardin Public, Bordeaux, à 250 € par mois. |

## Recherche « cabinet kiné à louer »

Aucune variante kinésithérapeute : les annonces relues ne citent pas les kinés parmi les professions accueillies (psychologues, psychothérapeutes, sophrologues, ostéopathes, diététiciens, médecins). À trancher par Nicolas avant d'ajouter cette cible.
