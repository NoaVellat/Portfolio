# Portfolio — Noa Vellat

Portfolio « 1 contenu, 5 récits » : un seul contenu, cinq Directions Artistiques
(terminal, mise en place, compile, fluid, atelier), avec fonds animés WebGL.
Site 100 % statique (HTML/CSS/JS vanilla), hébergé sur Netlify.

## Structure

```
Portfolio/
├── index.html                  # squelette : head, nav, <main> vide (rendu par JS)
├── css/
│   ├── base.css                # variables par DA, reset, layout commun
│   ├── da-switcher.css         # sélecteur d'ambiance + contraste par DA
│   ├── portrait.css            # forme du portrait par thème
│   ├── responsive.css          # nav compacte, adaptations mobiles, reduced-motion
│   └── themes/                 # 2 fichiers par DA : base du thème + sa « scène »
│       ├── mise-en-place.css / mise-en-place-menu.css
│       ├── compile.css       / compile-repo.css
│       ├── fluid.css         / fluid-galerie.css
│       └── atelier.css       / atelier-revue.css
├── js/
│   ├── background/engine.js    # moteur WebGL des fonds + bascule de DA (IIFE autonome)
│   └── app/
│       ├── core.js             # constantes partagées (main, root, reduce, __PHOTO)
│       ├── content.js          # CONTENT + VOICE : la source de vérité du contenu
│       ├── renderers/          # un renderer par DA (terminal, atelier, fluid, compile, mise-en-place)
│       ├── enhancers.js        # table des renderers + effets re-runnables (typed, reveal, vidéos…)
│       └── main.js             # orchestrateur de rendu + boot
├── assets/
│   ├── videos/                 # démos projets en mp4 H.264 1080p (lazy-load, preload="none")
│   ├── images/                 # photo (optimisée 800px) + vignettes
│   └── docs/                   # CV pdf
└── _sources/                   # originaux lourds (.mov 3420px, photo brute) — ignoré par git
```

## ⚠️ L'ordre de chargement compte

- **CSS** : les `<link>` de `index.html` reproduisent l'ordre de la cascade d'origine.
  Ne pas réordonner, ne pas fusionner deux fichiers sans vérifier les 5 thèmes.
- **JS** : les scripts de `js/app/` sont des scripts classiques qui partagent la portée
  globale (l'ancienne IIFE a été découpée). `core.js` → `content.js` → renderers →
  `enhancers.js` → `main.js` (le boot est dans main.js, il doit rester dernier).

## Tester en local

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

À vérifier après toute modification : les 5 ambiances via le bouton « Ambiance »,
les vidéos des projets, le téléchargement du CV.
