# Soon Horizons — État actuel et feuille de route

## 1. État observé

Cette synthèse décrit le code présent dans la branche `main` au 5 novembre 2026. Elle ne prétend pas remplacer une vérification de build ou un test navigateur.

| Domaine | État dans le dépôt |
| --- | --- |
| Site vitrine et navigation | Pages accueil, catalogue, détail projet et contact présentes |
| Français / anglais | Routage et dictionnaires présents |
| Thème clair / sombre | Préférence système et choix utilisateur implémentés |
| Portfolio | Six projets de démonstration codés en dur |
| Filtres | Catégorie, statut et médias implémentés côté client |
| Fiches projets | Informations, concept, médias, équipe et liens de contact |
| Médias | Illustrations SVG de substitution ; vrais médias à intégrer |
| Formulaire | Interface et validation serveur Zod présentes |
| Anti-spam | Champ honeypot présent |
| Envoi des demandes | Non implémenté : journalisation serveur seulement |
| Persistance des demandes | Aucune base de données ou stockage constaté |
| CMS | Non intégré |
| Rendez-vous | URL de réservation non configurée ; CTA renvoie au formulaire |
| Analytics | Aucun outil identifié dans les dépendances examinées |
| Tests automatisés | Aucun script de test dans package.json |

## 2. Données de démonstration à remplacer

Les fichiers `src/content/projects.ts`, `src/content/team.ts` et `src/content/site.ts` contiennent des exemples explicitement identifiés comme fictifs ou provisoires dans les commentaires et consignes.

Avant toute exploitation commerciale :
- remplacer les six projets de démonstration par les références autorisées ;
- confirmer les statuts, dates, surfaces, descriptions et chiffres clés ;
- remplacer le profil fictif de l'architecte par les crédits réels autorisés ;
- remplacer les coordonnées provisoires par les coordonnées vérifiées de la marque ;
- vérifier le domaine et les liens sociaux ;
- remplacer les visuels SVG par des médias réels, autorisés et optimisés.

Ne pas reprendre les exemples actuels comme preuves de réalisations réelles.

## 3. Priorités recommandées

### P0 — Fiabiliser le contact avant lancement

1. Configurer un fournisseur d'email transactionnel (la feuille de route actuelle cite Resend).
2. Envoyer les demandes vers l'adresse officielle de la marque.
3. Définir une politique de traitement des pièces jointes : contrôle du contenu, limites, stockage sécurisé, durée de conservation et accès.
4. Ajouter une protection anti-abus adaptée (limitation de débit, journalisation utile, contrôle honeypot renforcé).
5. Ne retourner un succès au visiteur qu'après confirmation de la prise en charge réelle de sa demande.
6. Tester les erreurs du fournisseur, les champs invalides, les fichiers refusés et les envois répétés.

### P1 — Mettre en place la gestion de contenu

La feuille de route existante propose Sanity comme CMS headless. Il devra gérer les projets et leurs versions FR/EN.

Prévoir les rôles et validations éditoriales, la gestion des brouillons, les médias et la publication. Les images et plans doivent être traités à l'import : filigrane selon le besoin, suppression des métadonnées EXIF et génération de formats optimisés.

### P2 — Préparer la mise en production

- Confirmer le domaine officiel et le DNS.
- Configurer l'hébergement Vercel et les variables d'environnement.
- Mettre en place l'email professionnel et WhatsApp Business.
- Configurer les métadonnées SEO, sitemap, robots et URLs canoniques avec les vraies informations.
- Ajouter une solution de mesure d'audience respectueuse de la vie privée si nécessaire.
- Prévoir la surveillance des erreurs et des performances.

### P3 — Améliorer le parcours commercial

- Connecter Cal.com ou Calendly pour les rendez-vous, si ce parcours est retenu.
- Définir le suivi interne des prospects et des demandes.
- Mesurer les conversions du catalogue vers le formulaire et WhatsApp.

### P4 — Extensions futures

Les idées citées dans `CLAUDE.md` sont :
- espace client pour le suivi de chantier ;
- visites immersives 360° ;
- blog.

Ces fonctionnalités sont des pistes futures, pas des capacités actuellement implémentées.

## 4. Points d'attention techniques

- Les données de projet étant statiques, leur mise à jour exige actuellement une modification du code et un redéploiement.
- Le statut de succès du formulaire est aujourd'hui plus fort que l'action réellement effectuée : la demande est validée et journalisée, mais elle n'est ni envoyée ni persistée.
- La vérification des types MIME et de la taille ne suffit pas à sécuriser à elle seule des pièces jointes. Il faudra contrôler les fichiers côté serveur et définir leur stockage.
- Empêcher le menu contextuel sur un plan n'empêche pas sa récupération par d'autres moyens. Les plans sensibles doivent être protégés en amont et ne pas être servis comme ressources publiques accessibles.
- Les valeurs de contact sont provisoires ; ne pas envoyer de trafic commercial vers ces coordonnées sans remplacement.
- Les règles de conception doivent continuer à garantir un canal commercial unique pour la marque et l'absence de coordonnées directes des architectes.

## 5. Vérifications avant chaque livraison

D'après les consignes du dépôt :
1. consulter la documentation de la version Next.js installée avant d'utiliser ou modifier ses APIs ;
2. exécuter `npm run lint` ;
3. exécuter `npm run build` ;
4. vérifier le parcours réel dans un navigateur ;
5. tester le thème clair et sombre, le français et l'anglais, et les largeurs mobiles (notamment 360–390 px) ;
6. vérifier le respect de `prefers-reduced-motion` ;
7. revoir le diff pour retirer les changements inutiles et contrôler sécurité, accessibilité et performance.

Aucune de ces commandes ni vérification navigateur n'a été exécutée pendant la rédaction de ces documents.
