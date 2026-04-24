## Plan : validation curl des pages légales

Exécuter les deux commandes ci-dessous en mode default et retourner la sortie brute :

```bash
curl -sL https://i-ca.re/politique-confidentialite | grep -i "bertrand de goth"
curl -sL https://i-ca.re/mentions-legales | grep -i "bertrand de goth"
```

**Critère d'acceptation** : les deux sorties contiennent `106 Bis Rue Bertrand de Goth` (B majuscule).

Aucune modification de fichier, lecture seule sur la prod.