@AGENTS.md

# Soon Horizons — site vitrine d'architecture

Site de présentation des projets d'architecture de la marque **Soon Horizons** (FR / EN, clientèle internationale : particuliers, diaspora, promoteurs, institutions).

- Brief complet : https://claude.ai/code/artifact/265afc6f-95a2-4474-8eb9-4878fd563955
- Maquettes de référence (Claude Design) : https://claude.ai/artifact/LhJG4pRDaSuWEYG6tJgTcE

## Règle d'or métier : un seul canal de contact

Le propriétaire du site est l'interlocuteur commercial unique. Les architectes sont **crédités par leur nom**, mais le site ne doit jamais permettre de les joindre directement.

- Jamais d'email, téléphone, lien de réseau social, site perso ou nom de cabinet d'un architecte dans le code, le contenu ou les métadonnées.
- Tous les appels à l'action (formulaire, WhatsApp, email, rendez-vous) pointent vers les coordonnées de la marque (`src/content/site.ts`).
- Plans affichés en aperçu, non téléchargeables. Visuels filigranés et nettoyés de leurs métadonnées EXIF à l'import (à mettre en place avec le CMS).

## Plugins à utiliser

Pour toute la suite du projet, travailler avec sept plugins. La section « Plugins et skills obligatoires » d'`AGENTS.md` (importé ci-dessus) détaille qui fait quoi et dans quel ordre. En résumé :

- **superpowers** : la méthode (brainstorming → plan → exécution → vérification, débogage systématique).
- **Agent skills** : les compétences pointues que superpowers ne couvre pas. Surtout `source-driven-development` (Next 16.4 : toujours vérifier dans la doc), `security-and-hardening` (formulaire, pièces jointes, CMS), `performance-optimization` (images), `browser-testing-with-devtools`, `shipping-and-launch`.
- **UI UX Pro Max** : le référentiel design (règles du secteur, motifs de pages, UX). Il ne remplace pas la charte Soon Horizons.
- **frontend-design** : la construction des interfaces.
- **impeccable** : le contrôle qualité du design (`shape`, `critique`, `audit`, `polish`, `adapt`, `harden`).
- **Marketing skills** : les textes FR/EN, le SEO et la conversion.
- **Ponytail** : un code minimal et la revue des changements (`/ponytail-review`, `/ponytail-audit`, `/ponytail-debt`).

Charger les skills concernés avant de commencer une tâche. Si un plugin manque dans la session, le signaler.

Installation (dans Claude Code, puis redémarrer la session) :

```text
/plugin install superpowers@claude-plugins-official
/plugin marketplace add addyosmani/agent-skills
/plugin install agent-skills@addy-agent-skills
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
/plugin marketplace add pbakaus/impeccable          # puis l'installer depuis /plugin
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```

frontend-design et Marketing skills s'installent depuis le catalogue `/plugin`. UI UX Pro Max a besoin de Python 3 pour ses scripts de recherche.

## Stack

- Next.js 16.4 (App Router, `cacheComponents`, Turbopack), React 19, TypeScript strict.
- Tailwind CSS v4 (configuration dans `src/app/globals.css`, pas de `tailwind.config`).
- Zod pour la validation du formulaire (Server Action).
- Pas de librairie i18n : dictionnaires typés + segment `[lang]` + `next/root-params`, comme le recommande la doc Next.

## Commandes

```bash
npm run dev     # serveur de dev, http://localhost:3000 (redirige vers /fr ou /en)
npm run build   # build de production (vérifie aussi les types)
npm run lint    # ESLint
```

## Structure

```
src/
  proxy.ts                  # redirige "/" et toute URL sans langue vers /fr ou /en (Accept-Language)
  app/
    globals.css             # tokens de couleur (clair/sombre), polices, utilitaires Tailwind
    icon.svg, robots.ts, sitemap.ts
    [lang]/                 # layout racine : <html>, thème, en-tête, pied de page
      page.tsx              # accueil
      projects/page.tsx     # index filtrable
      projects/[slug]/      # fiche projet
      contact/              # page + Server Action du formulaire
  components/               # composants UI (serveur par défaut, "use client" seulement si interactif)
  content/                  # données du site : projects.ts, site.ts (coordonnées), team.ts
  i18n/                     # config des langues, dictionnaires fr.ts / en.ts, getDictionary()
```

## Conventions

- **Langues** : toute chaîne visible passe par `src/i18n/dictionaries/fr.ts` et `en.ts`. Le type de `en` est dérivé de `fr`, donc une clé manquante casse le build : toujours modifier les deux. Le contenu des projets est bilingue dans `src/content/projects.ts` (`{ fr, en }`).
- **Langue courante** : côté serveur, `getLocale()` / `getDictionary()` (via `next/root-params`, pas de prop drilling). Dans les Server Actions et composants client, `next/root-params` est interdit : passer la langue en argument ou en champ caché.
- **Thème** : clair/sombre suit le réglage de l'appareil par défaut (`prefers-color-scheme`). Le choix explicite de l'utilisateur est stocké dans `localStorage` (`sh-theme` = `light` | `dark`, absent = automatique) et appliqué via `data-theme` sur `<html>` par un script inline avant le rendu. Ne jamais écrire de couleur en dur dans un composant : utiliser les tokens (`bg-bg`, `text-fg`, `text-muted`, `border-line`, `text-accent-ink`…). Le sable (`accent`) est réservé aux fonds de boutons et aux aplats ; en texte, utiliser `accent-ink` (contraste suffisant dans les deux thèmes).
- **Animations** : `motion` (v12, import `motion/react`) + `lenis` (défilement fluide) + View Transitions natives (React 19.3 `<ViewTransition>`). Les briques réutilisables sont dans `src/components/motion/` : `Reveal`, `Stagger`/`StaggerItem`, `SplitText` (titres mot par mot), `CountUp`, `Parallax`, `HeroScrollOut`, `Marquee`, `Magnetic`, `PageTransition` (à mettre dans chaque `page.tsx`), `Intro` (une fois par session). Courbe commune : `EASE_OUT` (`hooks.ts`). Tout élément révélé en « mount » attend la fin de l'intro (`useIntroDone`). Toujours respecter `prefers-reduced-motion` (géré par `MotionConfig reducedMotion="user"`, Lenis et le CSS). Un élément `position: fixed` ne doit jamais être rendu dans l'en-tête (flou + transformation) : passer par un portail. L'image d'une carte et le hero de sa fiche partagent `ViewTransition name="project-<slug>"` pour la transformation au clic.
- **Tester les animations** : les captures d'Edge sans interface (`--screenshot`, `--virtual-time-budget`) figent les animations. Utiliser un vrai navigateur piloté (Playwright avec `channel: "msedge"`) et de vraies attentes.
- **Visuels** : en attendant les vrais rendus, `ProjectVisual` dessine des illustrations SVG qui suivent le thème. Les remplacer par `next/image` quand les fichiers arriveront.
- **Accessibilité** : vrais `<button>` / `<a>`, cibles de 44 px minimum, `aria-label` sur les boutons-icônes, contraste AA dans les deux thèmes, mise en page fonctionnelle à 360 px de large.

## Contenu provisoire (à remplacer par les vraies données)

Tout est fictif pour l'instant et regroupé dans `src/content/` :

- Coordonnées : `+225 07 00 00 00 00`, `contact@soonhorizons.com` (domaine `soonhorizons.com` pas encore acheté).
- Architecte : « Marc-Olivier Kassi », personnage fictif (l'accord de non-contournement réel est signé).
- 6 projets fictifs et les chiffres clés de l'accueil (48 projets, 7 pays, 32 000 m², 12 ans).
- Le formulaire valide et journalise la demande côté serveur mais n'envoie pas encore d'email (voir Feuille de route).

## Feuille de route

1. Brancher l'envoi des demandes de contact (Resend) vers l'email de la marque.
2. CMS headless (Sanity) pour gérer les projets en FR/EN, avec filigrane et suppression des EXIF à l'import.
3. Domaine + hébergement (Vercel, DNS Cloudflare), email pro, numéro WhatsApp Business.
4. Prise de rendez-vous intégrée (Cal.com ou Calendly), statistiques (Plausible ou Vercel Analytics).
5. Plus tard : espace client (suivi de chantier), visites 360°, blog.
