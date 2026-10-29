# Fiches Google Business, prêtes à coller

Lots ENTRANT-GOOGLE-PAGES-1 (28/10/2026) et 1B (29/10/2026). Décision de Nicolas du 27/10/2026 : une fiche Google Business par adresse (canal « demande entrante ») ; réponses de Nicolas du 29/10/2026 11:5x appliquées (mentions de loyer, Le Bouscat fin mars 2027, 5ter rue Mirepoix, Floirac 12 à 20 m², Jardin Public retiré car complet, grille à temps partiel, professions élargies). Fichier préparé par un agent : **aucune fiche n'est créée**, c'est Nicolas qui crée chaque fiche. À relire par Nicolas avant toute mise en ligne ; aucune publication par un agent.

Sources : base IDN OS (tables `projects` et `project_units`, SELECT du 28/10/2026, détail ligne par ligne dans `src/lib/cabinetsALouer.ts`), annonces relues `Acquisition/JOURNAL/ANNONCES_ET_PARRAINAGE_2026-10-27.md`, grille à temps partiel du même fichier (point 8, d'après `PRETS_A_ENVOYER_2026-10-08.md` : 190, 340, 460 € par mois charges comprises pour 1, 2, 3 jours par semaine) et réponses de Nicolas du 29/10/2026. Le parrainage n'apparaît dans aucune fiche (décision du 27/10 : message privé seulement).

## Champs communs

- **Catégorie** : proposition à discuter ; le libellé exact se choisit dans la liste de Google, non vérifiée ici.
- **Téléphone** : 07 81 24 05 15 (source : `src/lib/contact.ts`, numéro déjà publié sur le site).
- **Courriel affiché sur le site** : contact@i-ca.re.
- **Horaires** : aucune source (ni la base, ni les annonces, ni le dépôt ne portent d'horaires).
- **Mentions de loyer** : temps plein « loyer hors charges, non assujetti à la TVA » ; temps partiel « charges comprises » (réponse 1 du 29/10).
- **Paramètre source** : chaque lien porte `?source=fiche-google-<lieu>` ; la page le transmet au formulaire de contact dans `utm_campaign`, et la page elle même s'identifie par `source=page-cabinet-<lieu>` (rangé dans `utm_source`).
- **Hypothèse non vérifiée, à contrôler par Nicolas** : Google n'accepte en principe une fiche avant ouverture que si l'ouverture est proche ; Le Bouscat, Toulouse Capitole et Floirac pourraient devoir attendre.
- **Jardin Public** : pas de fiche (complet, bail Viaud à partir de mars, réponse 5 du 29/10).

## I-CA.RE Chartrons

- **Nom** : I-CA.RE Chartrons
- **Catégorie principale proposée** : Agence de location de bureaux (secondaire possible : Centre médical), à choisir dans la liste de Google.
- **Adresse** : 20 cours Saint Louis, 33300 Bordeaux
- **État** : Lieu livré (base : livraison 01/10/2026).
- **Horaires proposés** : aucun horaire en source ; proposition « sur rendez vous » si Google le permet, sinon horaires à fixer par Nicolas.
- **Téléphone** : 07 81 24 05 15 (`src/lib/contact.ts`)
- **Lien** : https://i-ca.re/cabinet-a-louer/bordeaux-chartrons/?source=fiche-google-chartrons
- **Description** (692 caractères sur 750) :

```
I-CA.RE Chartrons est un lieu partagé pour praticiens du médical et du paramédical au 20 cours Saint Louis, dans le quartier des Chartrons à Bordeaux. Deux cabinets sont disponibles à la location à temps plein : le cabinet 1 de 11,1 m² à 690 € par mois et le cabinet 5 de 13,1 m² à 790 € par mois, loyer hors charges, non assujetti à la TVA. À temps partiel, un cabinet partagé à la journée : 190, 340 ou 460 € par mois, charges comprises, pour un, deux ou trois jours fixes par semaine. Médecins, kinésithérapeutes, ostéopathes, psychologues, orthophonistes, infirmiers, sages femmes, diététiciens et autres praticiens de santé y exercent sans investir dans un local. Visite sur rendez vous.
```

Variantes de titre et de méta par recherche visée (une section par profession sur la page, pas de page dupliquée) :

| Recherche visée | Titre | Méta description |
|---|---|---|
| cabinet psychologue à louer Bordeaux Chartrons | Cabinet de psychologue à louer aux Chartrons, Bordeaux | I-CA.RE | Cabinet de 11,1 ou 13,1 m² pour psychologue au 20 cours Saint Louis, Bordeaux Chartrons, à 690 ou 790 € par mois hors charges. Visite sur rendez vous. |
| cabinet kiné à louer Bordeaux Chartrons | Cabinet de kinésithérapeute à louer aux Chartrons, Bordeaux | I-CA.RE | Cabinet pour kinésithérapeute au 20 cours Saint Louis, Bordeaux : 11,1 m² à 690 € et 13,1 m² à 790 € par mois hors charges, non assujetti à la TVA. |
| cabinet ostéopathe à louer Bordeaux Chartrons | Cabinet d'ostéopathe à louer aux Chartrons, Bordeaux | I-CA.RE | Deux cabinets libres aux Chartrons pour ostéopathe : 11,1 m² à 690 € et 13,1 m² à 790 € par mois hors charges, dans un lieu partagé entre praticiens. |
| cabinet médical à louer Bordeaux Chartrons | Cabinet médical à louer aux Chartrons, Bordeaux : dès 690 € | I-CA.RE | Cabinet pour médecin ou praticien de santé, 20 cours Saint Louis, Bordeaux : 11,1 à 13,1 m², de 690 à 790 € par mois hors charges. |
| cabinet paramédical temps partiel Bordeaux | Cabinet paramédical à la journée aux Chartrons, Bordeaux | I-CA.RE | Orthophoniste, infirmier, diététicien : cabinet partagé aux Chartrons, 190, 340 ou 460 € par mois charges comprises pour 1, 2 ou 3 jours fixes. |

## I-CA.RE Le Bouscat

- **Nom** : I-CA.RE Le Bouscat
- **Catégorie principale proposée** : Agence de location de bureaux (secondaire possible : Centre médical), à choisir dans la liste de Google.
- **Adresse** : 212 avenue de la Libération Charles de Gaulle, 33110 Le Bouscat
- **État** : Non ouvert : livraison de l'ensemble fin mars 2027 (réponse 2 du 29/10).
- **Horaires proposés** : aucun horaire en source ; proposition « sur rendez vous » si Google le permet, sinon horaires à fixer par Nicolas.
- **Téléphone** : 07 81 24 05 15 (`src/lib/contact.ts`)
- **Lien** : https://i-ca.re/cabinet-a-louer/le-bouscat/?source=fiche-google-le-bouscat
- **Description** (556 caractères sur 750) :

```
I-CA.RE Le Bouscat est un nouveau lieu de santé au 212 avenue de la Libération Charles de Gaulle, au Bouscat. Neuf bureaux de praticien sont proposés à temps plein, de 10,4 à 19,8 m², de 700 à 910 € par mois, loyer hors charges, non assujetti à la TVA ; livraison de l'ensemble fin mars 2027. À temps partiel : 190, 340 ou 460 € par mois, charges comprises, pour un, deux ou trois jours fixes par semaine. Le lieu comprend un espace détente partagé. Ouvert aux professionnels du médical et du paramédical, kinésithérapeutes compris. Visite sur rendez vous.
```

Variantes de titre et de méta par recherche visée (une section par profession sur la page, pas de page dupliquée) :

| Recherche visée | Titre | Méta description |
|---|---|---|
| cabinet psychologue à louer Le Bouscat | Bureau de psychologue à louer au Bouscat : 10 à 20 m² | I-CA.RE | Bureaux pour psychologue au 212 avenue de la Libération Charles de Gaulle, Le Bouscat : 10,4 à 19,8 m², de 700 à 910 € par mois hors charges. |
| cabinet kiné à louer Le Bouscat | Bureau de kinésithérapeute à louer au Bouscat | I-CA.RE | Neuf bureaux de 10,4 à 19,8 m² au Bouscat pour kinésithérapeute, de 700 à 910 € par mois hors charges. Livraison de l'ensemble fin mars 2027. |
| cabinet médecin à louer Le Bouscat | Bureau de médecin à louer au Bouscat, fin mars 2027 | I-CA.RE | Neuf bureaux de praticien au Bouscat, de 700 à 910 € par mois hors charges, espace détente partagé. Livraison de l'ensemble fin mars 2027. |
| cabinet paramédical à louer Le Bouscat | Bureau paramédical à louer au Bouscat | I-CA.RE | Orthophoniste, infirmier, sage femme, ergothérapeute : bureaux de 10,4 à 19,8 m² au Bouscat, ou temps partiel dès 190 € par mois charges comprises. |

## I-CA.RE Toulouse Capitole

- **Nom** : I-CA.RE Toulouse Capitole
- **Catégorie principale proposée** : Agence de location de bureaux (secondaire possible : Centre médical), à choisir dans la liste de Google.
- **Adresse** : 5ter rue Mirepoix, 31000 Toulouse (réponse 3 du 29/10)
- **État** : Non ouvert : ouverture en mars 2027 (décision de Nicolas), disponibilité 01/03/2027 en base.
- **Horaires proposés** : aucun horaire en source ; proposition « sur rendez vous » si Google le permet, sinon horaires à fixer par Nicolas.
- **Téléphone** : 07 81 24 05 15 (`src/lib/contact.ts`)
- **Lien** : https://i-ca.re/cabinet-a-louer/toulouse-capitole/?source=fiche-google-toulouse-capitole
- **Description** (593 caractères sur 750) :

```
I-CA.RE Toulouse Capitole ouvre en mars 2027 un lieu partagé pour praticiens du médical et du paramédical au 5ter rue Mirepoix, dans le secteur Capitole à Toulouse. Cinq cabinets au rez de chaussée, de 11,32 à 14,39 m², sont proposés à temps plein de 700 à 800 € par mois selon la surface, loyer hors charges, non assujetti à la TVA, disponibles le 01/03/2027. À temps partiel : 190, 340 ou 460 € par mois, charges comprises, pour un, deux ou trois jours fixes par semaine. Ouvert aux professionnels du médical et du paramédical, kinésithérapeutes compris. Réservation possible dès maintenant.
```

Variantes de titre et de méta par recherche visée (une section par profession sur la page, pas de page dupliquée) :

| Recherche visée | Titre | Méta description |
|---|---|---|
| cabinet psychologue à louer Toulouse Capitole | Cabinet de psychologue à louer à Toulouse Capitole | I-CA.RE | Cinq cabinets pour psychologue au 5ter rue Mirepoix, Toulouse Capitole : 11,32 à 14,39 m², de 700 à 800 € par mois hors charges, dès le 01/03/2027. |
| cabinet kiné à louer Toulouse centre | Cabinet de kinésithérapeute à louer à Toulouse Capitole | I-CA.RE | Cabinets de 11,32 à 14,39 m² au 5ter rue Mirepoix, Toulouse, pour kinésithérapeute : de 700 à 800 € par mois hors charges. Ouverture en mars 2027. |
| cabinet sophrologue à louer Toulouse centre | Cabinet de sophrologue à louer à Toulouse centre | I-CA.RE | Cabinets de 11 à 14 m² au 5ter rue Mirepoix, Toulouse Capitole, de 700 à 800 € par mois hors charges. Ouverture en mars 2027, réservation possible. |
| cabinet médical à louer Toulouse Capitole | Cabinet médical à louer à Toulouse Capitole, mars 2027 | I-CA.RE | Médecin, orthophoniste, infirmier : cinq cabinets au rez de chaussée, 5ter rue Mirepoix, de 700 à 800 € par mois hors charges, ou dès 190 € charges comprises. |

## I-CA.RE Floirac

- **Nom** : I-CA.RE Floirac
- **Catégorie principale proposée** : Agence de location de bureaux (secondaire possible : Centre médical), à choisir dans la liste de Google.
- **Adresse** : 23 avenue de la Libération, 33270 Floirac
- **État** : Non ouvert : ouverture prévue en 2027.
- **Horaires proposés** : aucun horaire en source ; proposition « sur rendez vous » si Google le permet, sinon horaires à fixer par Nicolas.
- **Téléphone** : 07 81 24 05 15 (`src/lib/contact.ts`)
- **Lien** : https://i-ca.re/cabinet-a-louer/floirac/?source=fiche-google-floirac
- **Description** (585 caractères sur 750) :

```
I-CA.RE Floirac prépare un lieu partagé pour praticiens du médical et du paramédical au 23 avenue de la Libération, à Floirac, aux portes de Bordeaux. Quinze cabinets de 12 à 20 m² seront proposés à temps plein à 580 € par mois, loyer hors charges, non assujetti à la TVA. À temps partiel : 190, 340 ou 460 € par mois, charges comprises, pour un, deux ou trois jours fixes par semaine. Ouvert aux médecins, kinésithérapeutes, ostéopathes, psychologues, orthophonistes, infirmiers et autres praticiens de santé. Ouverture prévue en 2027 : les premiers inscrits choisissent leur cabinet.
```

Variantes de titre et de méta par recherche visée (une section par profession sur la page, pas de page dupliquée) :

| Recherche visée | Titre | Méta description |
|---|---|---|
| cabinet psychologue à louer Floirac | Cabinet de psychologue à louer à Floirac : 580 € par mois | I-CA.RE | Quinze cabinets de 12 à 20 m² au 23 avenue de la Libération, Floirac, à 580 € par mois hors charges. Ouverture prévue en 2027, inscription ouverte. |
| cabinet kiné à louer Floirac | Cabinet de kinésithérapeute à louer à Floirac | I-CA.RE | Cabinets de 12 à 20 m² pour kinésithérapeute à Floirac, aux portes de Bordeaux, à 580 € par mois hors charges, non assujetti à la TVA. |
| cabinet à louer rive droite Bordeaux | Cabinet de praticien à louer rive droite, Floirac | I-CA.RE | Aux portes de Bordeaux, quinze cabinets de 12 à 20 m² à 580 € par mois hors charges dans un lieu partagé entre praticiens. Ouverture prévue en 2027. |
| cabinet paramédical à louer Floirac | Cabinet paramédical à louer à Floirac | I-CA.RE | Orthophoniste, infirmier, sage femme, podologue : cabinets de 12 à 20 m² à Floirac, 580 € par mois hors charges, ou temps partiel dès 190 € charges comprises. |
