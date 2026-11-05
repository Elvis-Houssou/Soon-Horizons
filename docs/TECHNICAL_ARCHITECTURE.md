# Soon Horizons — Architecture technique

## 1. Stack

D'après `package.json`, la configuration et `CLAUDE.md` :

| Domaine | Technologie |
| --- | --- |
| Framework | Next.js 16.4.1, App Router |
| UI | React 19.3.0 |
| Langage | TypeScript strict |
| CSS | Tailwind CSS v4 |
| Animation | Motion 12 (`motion/react`) |
| Défilement | Lenis |
| Validation | Zod 4 |
| Thèmes | Implémentation locale + next-themes installé |
| Qualité | ESLint 9, TypeScript 5 |

Aucune base de données, couche ORM, API métier distante ou CMS n'est configuré dans le code examiné.

## 2. Structure du dépôt

```text
src/
├── proxy.ts
├── app/
│   ├── globals.css
│   ├── icon.svg
│   ├── robots.ts
│   ├── sitemap.ts
│   └── [lang]/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── not-found.tsx
│       ├── contact/
│       │   ├── page.tsx
│       │   ├── actions.ts
│       │   └── options.ts
│       └── projects/
│           ├── page.tsx
│           └── [slug]/page.tsx
├── components/
│   ├── home/
│   ├── motion/
│   ├── contact-form.tsx
│   ├── project-card.tsx
│   ├── project-filters.tsx
│   ├── project-media.tsx
│   ├── project-visual.tsx
│   ├── plan-drawing.tsx
│   ├── navigation.tsx
│   ├── site-header.tsx
│   ├── site-footer.tsx
│   ├── theme-controls.tsx
│   └── whatsapp-fab.tsx
├── content/
│   ├── projects.ts
│   ├── site.ts
│   └── team.ts
├── i18n/
│   ├── config.ts
│   ├── server.ts
│   └── dictionaries/
│       ├── fr.ts
│       └── en.ts
└── lib/
    ├── format.ts
    ├── intro.ts
    ├── project-view.ts
    └── theme.ts
```

## 3. Routage et internationalisation

Le segment dynamique `[lang]` porte les pages traduites.

`src/proxy.ts` :
1. conserve les routes déjà préfixées par `/fr` ou `/en` ;
2. sinon, lit le cookie `sh-lang` ;
3. à défaut, analyse l'en-tête `Accept-Language` ;
4. utilise le français comme langue par défaut ;
5. redirige vers la route préfixée.

`src/i18n/config.ts` définit les langues et le type `Locale`. `src/i18n/server.ts` charge dynamiquement le dictionnaire correspondant avec `getDictionary()` et récupère la langue de la route avec `getLocale()`.

Convention : toute chaîne d'interface doit être ajoutée dans les deux dictionnaires. Le type anglais est dérivé du dictionnaire français afin de détecter les clés manquantes à la compilation. Le contenu métier des projets est lui aussi localisé avec des objets `{ fr, en }`.

Dans les Server Actions et composants client, ne pas utiliser `next/root-params` : transmettre la langue explicitement, comme le prescrivent les consignes du projet.

## 4. Couche de présentation

Les pages sont des Server Components par défaut. Les composants interactifs portent `"use client"`.

- `ProjectFilters` gère les trois filtres en état React et filtre les projets reçus en props.
- `ProjectMedia` gère les onglets de médias, leur navigation clavier et les panneaux correspondants.
- `ContactForm` utilise `useActionState` pour appeler la Server Action et afficher les états de validation, d'attente et de succès.
- Les composants sous `components/motion/` encapsulent les animations réutilisables.
- `ProjectCard` et `ProjectVisual` structurent l'affichage du portfolio et ses visuels temporaires.

Le layout global charge les polices Syne, Instrument Sans et IBM Plex Mono, les styles globaux, le thème, l'intro, l'en-tête, le pied de page et le bouton WhatsApp.

## 5. Données

### Projets

`src/content/projects.ts` est la source de vérité actuelle du portfolio. Il contient six projets de démonstration et les fonctions `getProject`, `getNextProject` et `projectMedia`.

`src/lib/project-view.ts` transforme les données métier en données prêtes pour les cartes et localise les informations affichées.

### Marque et contact

`src/content/site.ts` centralise le nom, l'URL, l'email, le téléphone, WhatsApp, le lien de réservation et les réseaux sociaux de la marque. Les valeurs sont explicitement provisoires dans les commentaires du fichier.

### Équipe

`src/content/team.ts` contient les noms et rôles uniquement. La règle métier interdit d'y ajouter des coordonnées personnelles ou des liens directs.

## 6. Formulaire et validation

Le formulaire client transmet les données à `submitContact` dans `src/app/[lang]/contact/actions.ts`.

La validation serveur Zod couvre :
- type de projet ;
- pays ;
- situation foncière ;
- budget ;
- délai ;
- message (20 à 4 000 caractères) ;
- nom ;
- email ;
- téléphone facultatif ;
- langue.

Les fichiers sont contrôlés côté serveur : maximum 3 fichiers, 3 Mo par fichier, types PDF/JPEG/PNG/WebP. Le `bodySizeLimit` des Server Actions est fixé à 10 Mo dans `next.config.ts`.

Un champ piège `website` sert de honeypot anti-robot. En cas d'erreur, la Server Action retourne les codes d'erreur et les valeurs pour réafficher le formulaire.

**État réel :** après validation, la fonction écrit les détails dans les logs serveur avec `console.info`, puis retourne un identifiant et un statut de succès. Aucun email, stockage persistant, notification ou traitement effectif des pièces jointes n'est effectué à ce stade.

## 7. Thème et design system

Les tokens sont définis dans `src/app/globals.css`. Le thème clair est la base ; le thème sombre suit `prefers-color-scheme` tant que l'utilisateur n'a pas choisi une préférence explicite.

`src/lib/theme.ts` gère la préférence `system | light | dark`, la persistance dans `localStorage` sous la clé `sh-theme` et la synchronisation entre onglets.

La couleur d'accent de la marque est le sable `#C9A26B`. Les composants doivent utiliser les tokens CSS/Tailwind du projet plutôt que coder des couleurs directement.

## 8. Configuration Next.js

`next.config.ts` active `cacheComponents`, `partialPrefetching` et une règle Turbopack pour Tailwind CSS. La limite du corps des Server Actions est réglée à 10 Mo pour le formulaire et ses pièces jointes.

Les consignes `AGENTS.md` indiquent explicitement que cette version de Next.js comporte des changements importants : consulter la documentation locale livrée avec la version installée avant de modifier les APIs ou conventions Next.js.

## 9. Commandes

```bash
npm install
npm run dev
npm run lint
npm run build
npm run start
```

Les scripts définis dans `package.json` sont `dev`, `build`, `start` et `lint`. Aucun script de test automatisé n'est déclaré dans ce fichier.
