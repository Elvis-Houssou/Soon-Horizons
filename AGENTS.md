<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Plugins et skills obligatoires

Ce projet se travaille avec sept plugins Claude Code. Plusieurs se recouvrent (planification, revue de code, design) : le tableau fixe **qui fait quoi** pour éviter les doublons.

| Plugin | Ce qu'il est | Son rôle sur Soon Horizons |
| --- | --- | --- |
| **superpowers** ([obra/superpowers](https://github.com/obra/superpowers)) | Méthode de développement : brainstorming, plan, exécution, TDD, débogage, vérification | **Cadre de travail principal.** Toute fonctionnalité passe par `brainstorming` → `writing-plans` → `executing-plans`. `systematic-debugging` pour tout bug, `verification-before-completion` avant d'annoncer qu'une tâche est finie. |
| **Agent skills** ([addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)) | 25 skills d'ingénierie couvrant tout le cycle (spec → livraison) | **Compétences spécialisées** que superpowers ne couvre pas. Ne pas utiliser ses skills de planification (superpowers s'en charge). |
| **UI UX Pro Max** ([nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)) | Base de connaissances design : styles, palettes, couples de polices, règles par secteur, motifs de landing pages, règles UX | **Référentiel** consulté avant de concevoir : règles du secteur architecture / immobilier haut de gamme, motifs de pages, règles UX et accessibilité. |
| **frontend-design** (plugin officiel Anthropic) | Skill de création d'interfaces soignées, non génériques | **Construction** des nouvelles pages, sections et composants. |
| **impeccable** ([pbakaus/impeccable](https://github.com/pbakaus/impeccable)) | Langage de design + 24 commandes + détecteur de motifs « faits par une IA » | **Contrôle qualité du design** : critique, audit, polish avant de considérer une interface terminée. |
| **Marketing skills** | Skills marketing | **Contenu et conversion** : textes FR/EN, SEO, appels à l'action, formulaire de contact. |
| **Ponytail** ([dietrichgebert/ponytail](https://github.com/dietrichgebert/ponytail)) | Pousse vers la solution correcte la plus petite (réutiliser, plateforme, dépendances déjà installées) | **Sobriété du code et revue des changements** : garde une base de code légère, sans dépendance superflue. |

### Quand utiliser quoi

**Nouvelle fonctionnalité** (ex. envoi des emails, intégration du CMS, prise de rendez-vous) :

1. superpowers `brainstorming` puis `writing-plans`.
2. Agent skills `source-driven-development` : vérifier chaque API dans `node_modules/next/dist/docs/` et la doc officielle des librairies (Next 16.4 diffère de ce que l'on connaît).
3. superpowers `executing-plans`, avec Ponytail actif (ne rien ajouter qui existe déjà dans le projet, la plateforme ou les dépendances installées).
4. superpowers `verification-before-completion` : `npm run build`, `npm run lint`, et vérification réelle dans le navigateur.

**Interface** (nouvelle page, section ou refonte) :

1. UI UX Pro Max : consulter les règles du secteur et les motifs de pages pertinents. La charte Soon Horizons (tokens de `globals.css`, polices Syne / Instrument Sans / IBM Plex Mono, sable `#C9A26B`) reste la référence : ne pas générer un autre design system.
2. impeccable `shape` pour cadrer l'UX avant de coder, puis frontend-design pour construire.
3. impeccable `critique` puis `audit` (accessibilité, performance, responsive), puis `polish`. Selon le besoin : `adapt` (mobile), `harden` (FR/EN, débordements de texte, états d'erreur), `typeset`, `layout`, `animate` (animations sobres, `prefers-reduced-motion` respecté).
4. Agent skills `browser-testing-with-devtools` pour vérifier dans le navigateur, en thème clair **et** sombre, sur ordinateur **et** mobile (360–390 px).

**Textes et SEO** : Marketing skills, puis impeccable `clarify` pour les libellés d'interface. Toujours livrer le français et l'anglais ensemble (dictionnaires `fr.ts` / `en.ts`).

**Revue avant de considérer un changement terminé** : `/ponytail-review` sur le diff (bugs, sécurité, code à retirer). En complément :

- Agent skills `security-and-hardening` pour tout ce qui touche au formulaire, aux Server Actions, aux pièces jointes, aux clés d'API et au CMS ;
- Agent skills `performance-optimization` pour les pages riches en images (Core Web Vitals).

**Mise en ligne** : Agent skills `shipping-and-launch` (check-list, retour arrière) et `ci-cd-and-automation`, puis `observability-and-instrumentation` une fois le site en production.

**Ponctuellement** : `/ponytail-audit` sur tout le dépôt, `/ponytail-debt` pour lister les raccourcis temporaires (`shortcut:`), impeccable `document` pour régénérer `DESIGN.md` à partir du code.

### Règles

1. Avant chaque tâche, identifier les skills qui s'appliquent d'après la section ci-dessus et les charger **avant** d'écrire du code ou du contenu.
2. Si un plugin n'est pas installé ou pas chargé dans la session, le dire clairement au lieu de faire comme s'il avait été utilisé.
3. En cas de conflit entre plugins : superpowers décide de la méthode, la charte Soon Horizons décide du design, Ponytail décide de la quantité de code. Ponytail ne justifie jamais de retirer de la validation, de la sécurité ou de l'accessibilité.
4. Les plugins complètent `CLAUDE.md` sans le remplacer : la règle d'or (un seul canal de contact) et les conventions du projet restent prioritaires.
5. superpowers impose des tests (TDD) et des branches git : le projet n'a encore ni dépôt git ni outil de test. Les mettre en place au premier chantier (tests de la logique : validation du formulaire, choix de la langue dans `proxy.ts`, helpers de contenu). Pour l'interface pure, la vérification se fait dans le navigateur.
