# Soon Horizons — Vue d'ensemble du produit

## 1. Résumé

Soon Horizons est conçu comme un **site vitrine bilingue de présentation de projets d'architecture**. Il s'adresse à une clientèle internationale : particuliers, diaspora, promoteurs et institutions.

Le site doit présenter le savoir-faire et les réalisations de la marque, aider les visiteurs à explorer les projets et convertir leur intérêt en demandes de renseignements ou de devis.

Le dépôt est un frontend Next.js. Aucun backend métier séparé ni CMS connecté n'est présent dans l'arborescence analysée.

## 2. Proposition de valeur

- Présenter les projets d'architecture avec une narration visuelle et des informations techniques.
- Permettre de parcourir et filtrer un portfolio.
- Rassurer les prospects avec une démarche de travail, des chiffres clés et des informations de projet.
- Permettre un premier contact à distance.
- Servir des visiteurs francophones et anglophones.

## 3. Publics visés

Les publics explicitement mentionnés dans `CLAUDE.md` sont :
- les particuliers ;
- la diaspora ;
- les promoteurs immobiliers ;
- les institutions.

Le site met également en avant un accompagnement à distance.

## 4. Parcours et pages

### Accueil — `/[lang]`

La page d'accueil présente :
- une scène visuelle principale et un projet mis en avant ;
- le positionnement du studio et des indicateurs clés ;
- un bandeau de mots-clés ;
- une sélection de projets récents ;
- les étapes de la démarche de travail ;
- une section dédiée à l'accompagnement à distance ;
- des appels à l'action vers le formulaire, WhatsApp et la prise de rendez-vous (qui renvoie actuellement au formulaire si aucune URL de réservation n'est configurée).

### Catalogue — `/[lang]/projects`

Le catalogue présente les projets sous forme de cartes. Les filtres côté client combinent :
- catégorie ;
- statut (concept, en construction, livré) ;
- type de média disponible (rendus, chantier, plans, avant/après).

Le nombre de résultats est mis à jour et un état vide permet de réinitialiser les filtres.

### Fiche projet — `/[lang]/projects/[slug]`

Chaque fiche peut présenter :
- localisation, période, surface et caractéristiques ;
- statut et année ;
- résumé et explication du concept ;
- onglets de médias : rendus, étapes de construction, plans et avant/après selon les données ;
- noms et rôles des concepteurs ;
- liens vers le formulaire et WhatsApp ;
- navigation vers le projet suivant.

Les plans sont décrits comme des aperçus non téléchargeables dans les règles métier. Le composant de média empêche notamment le menu contextuel sur la zone des plans, mais cela ne constitue pas une protection absolue contre la copie d'un contenu affiché dans un navigateur.

### Contact — `/[lang]/contact`

La page présente les canaux de contact de la marque et un formulaire de qualification du projet. Les champs couvrent notamment le type de projet, le pays, la situation foncière, le budget, le délai, le message et les coordonnées du prospect. Des fichiers peuvent être joints.

## 5. Règle métier centrale : relation commerciale

Le propriétaire du site est défini comme **l'interlocuteur commercial unique**.

Les architectes et concepteurs peuvent être crédités par leur nom et leur rôle, mais ne doivent pas être joignables directement depuis le site. Les coordonnées, réseaux sociaux, sites personnels et noms de cabinets des architectes ne doivent pas apparaître dans le code ou les contenus.

Les liens de contact doivent pointer vers les coordonnées de la marque, centralisées dans `src/content/site.ts`.

Cette règle est importante pour préserver la relation client et éviter le contournement commercial.

## 6. Contenus et médias

Les projets sont actuellement stockés en dur dans `src/content/projects.ts`. Le modèle prévoit :
- un identifiant d'URL (`slug`) et un numéro ;
- un nom, une ville et un pays ;
- une catégorie et un statut ;
- une année, une période et une surface ;
- un résumé et un concept en français et en anglais ;
- des faits/caractéristiques ;
- des rendus, étapes de chantier, plans et indicateur avant/après ;
- les membres de l'équipe crédités.

Le code utilise actuellement des illustrations SVG générées par les composants (`ProjectVisual`, `PlanDrawing`, etc.) comme visuels provisoires. Les vrais rendus et documents de projet restent à intégrer.

## 7. Langues et présentation

Les langues prises en charge sont le français (`fr`) et l'anglais (`en`). Les contenus de projet et les dictionnaires d'interface sont bilingues.

Le site dispose :
- d'un thème clair/sombre, avec préférence système par défaut ;
- d'une interface responsive ;
- d'animations et de transitions ;
- de contrôles d'accessibilité tels que le lien d'évitement, les libellés ARIA et la navigation clavier des onglets médias.

## 8. Limites à garder en tête

Les consignes du dépôt signalent que les données actuelles sont fictives ou provisoires : six projets de démonstration, chiffres de présentation, coordonnées et identité d'architecte. Elles doivent être remplacées et validées avant une communication commerciale réelle.

Le formulaire valide la demande et renvoie un état de succès, mais son implémentation actuelle journalise les informations côté serveur : elle ne les envoie pas encore par email et ne les enregistre pas dans une base de données.
