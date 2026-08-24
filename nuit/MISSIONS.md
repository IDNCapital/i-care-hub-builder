# MISSIONS DE NUIT · i-care-hub-builder · mis à jour le 2026-08-23 par l'assistant Websites
# Une ligne par mission. Format : [classe] [priorité] objectif | critère d'arrêt | test de réussite | rollback
# Interdits : aucune écriture hors de la branche nuit/<date>, aucune base, aucun Lovable, aucun secret, aucune mise en ligne.
# L'environnement de nuit n'a ni variables Supabase ni navigateur : generate-sitemap et prerender y sortent en skip.
# Aucune mission dont la preuve dépend du rendu ne doit être inscrite ici, et un vert de nuit ne vaut jamais preuve de prérendu.
# Faites et fusionnées le 23/08, ne pas réinscrire : inventaire méta des pages, liste des secrets par nom.
# Refusée en relecture le 23/08 et reprise en lot de jour : centralisation de norm().
[S] [1] Normaliser les liens internes qui n'ont pas de slash final et les URLs absolues du domaine écrites en dur, sans toucher aux textes ni aux redirections | checkRoutesConcordance.mjs signale un écart après la modification | concordance des routes inchangée, lint au niveau de la référence, diff limité aux fichiers portant ces liens | git revert
[XS] [2] Retirer package-lock.json, désynchronisé de package.json et inutilisé puisque l'intégration installe depuis bun.lock, après avoir vérifié qu'aucun script ni aucun workflow ne le référence | une référence à package-lock.json existe dans package.json, un script ou un workflow | lint et typage au niveau de la référence, aucune référence résiduelle | git revert
[XS] [3] Descendre les 26 erreurs eslint par lots de 30 fichiers maximum, sans aucun changement de comportement | un correctif exigerait de modifier un comportement | le compte d'erreurs baisse, le compte d'avertissements ne monte pas, typage propre | git revert
