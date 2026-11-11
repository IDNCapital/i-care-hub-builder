# Refus accessibles du formulaire Contact I-CA.RE

Le formulaire associe le motif du refus applicatif au premier contrôle à corriger et lui donne le focus après l'affichage du message. Le type de contact sélectionné est annoncé. Les messages français et anglais réutilisent les traductions du site. Les contraintes natives gardent leur effet bloquant. Leur infobulle cède la place au premier message associé à un champ natif invalide. Une adresse e-mail reste signalée tant qu'elle enfreint l'une des contraintes natives ou applicatives. Les valeurs saisies restent disponibles.

Ce correctif vise le formulaire de la tête main `939c0eca`. Les décisions locales conservent leur ordre et leurs notifications. Le bloc d'envoi, ses données et ses traitements de succès et d'erreur sont identiques à ceux de cette tête.

Avec les dépendances et outils locaux disponibles, lancer `python3 .ci/icare-contact-refus-accessibles-1011/run.py qualification --expected=13 --tools-dir=<outils>/node_modules`. Les phases `types-product` et `types-qa` contrôlent les types du produit et du banc. Le banc ferme les producteurs, les connexions et la télémétrie. La vérification des interactions est effectuée dans jsdom.
