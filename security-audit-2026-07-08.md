# Security Audit Report — Portfolio Noa Vellat

**Date :** 2026-07-08
**Périmètre :** site statique complet (`index.html`, `js/` ~1 840 lignes, `css/`), fichiers commités dans le dépôt, dépendances chargées via CDN. Hébergement : Netlify (https://noa-vellat.netlify.app/).
**Langages/stacks détectés :** HTML, CSS, JavaScript vanilla (aucun framework, aucun back-end, aucun manifeste de dépendances — pas de `package.json`).

## Executive Summary

| Sévérité | Nombre |
|---|---|
| Critical | 0 |
| High | 0 |
| Medium | 2 |
| Low | 2 |
| Info | 1 |

**Top priorités :**
1. Épingler la version de `devicon` (actuellement `@latest` sur jsDelivr) et ajouter un hash SRI — c'est le seul vrai risque supply-chain du site.
2. Ajouter un fichier `_headers` (ou `netlify.toml`) avec une Content-Security-Policy : sur un site statique, c'est la couche de défense qui neutralise précisément le risque CDN ci-dessus.
3. Ajouter les attributs `integrity` + `crossorigin` sur Font Awesome (cdnjs), déjà épinglé en 6.4.0.

**Bilan global : très sain.** Aucune vulnérabilité critique ou haute. Le site n'a aucune surface d'injection : pas de formulaire, pas de back-end, pas de paramètre d'URL exploité, et tout le contenu dynamique injecté dans le DOM passe par le helper d'échappement `esc()` ([content.js:272](js/app/content.js#L272)) ou par des valeurs validées contre une allowlist. Les seules faiblesses relèvent de la chaîne d'approvisionnement CDN et du durcissement (headers).

### Points positifs relevés (bonnes pratiques en place)
- Échappement HTML systématique via `esc()` dans les 5 renderers (`&`, `<`, `>`, `"`).
- Les valeurs lues depuis `localStorage` (`noa-da`, `noa-lang`) sont **validées contre une allowlist** avant usage ([index.html:10-11](index.html#L10-L11), [engine.js:216](js/background/engine.js#L216), [main.js:5](js/app/main.js#L5)) — pas de DOM XSS possible via un localStorage empoisonné.
- Aucun secret, clé d'API ou token dans le code ou l'historique visible.
- `.claude/settings.local.json` et `_sources/` correctement exclus du dépôt (`.gitignore`).
- Pas d'`eval`, `new Function`, `document.write`, ni lecture de `location.hash`/`location.search`.
- HTTPS par défaut via Netlify.

## Findings — Code Patterns

| # | Sévérité | Titre | Localisation |
|---|---|---|---|
| 1 | Medium | Dépendance CDN non épinglée (`devicon@latest`) sans SRI | `index.html:13` |
| 2 | Medium | Aucun en-tête de sécurité HTTP (pas de CSP, XFO, Referrer-Policy) | config Netlify absente |
| 3 | Low | Font Awesome (cdnjs) et Google Fonts chargés sans SRI | `index.html:9,12` |
| 4 | Low | `rel="noopener"` absent sur les liens `target="_blank"` du renderer terminal | `js/app/renderers/terminal.js:141,167,215-216,220` |
| 5 | Info | Téléphone personnel et email publiés en clair (moisson par bots) | `js/app/content.js:236-237` |

### [MEDIUM] 1. Dépendance CDN non épinglée : `devicon@latest` sans Subresource Integrity
- **Catégorie :** A06:2021 Vulnerable and Outdated Components / CWE-829 (inclusion de fonctionnalité d'une sphère non maîtrisée)
- **Localisation :** [index.html:13](index.html#L13) — `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css`
- **Description :** la feuille de style est tirée directement du dépôt GitHub `devicons/devicon` au tag flottant `@latest`. Aucun contrôle de version, aucun hash d'intégrité : ce que jsDelivr sert aujourd'hui peut être différent demain sans aucune action de ta part.
- **Scénario d'attaque :** si le dépôt devicon est compromis (compte mainteneur, PR malveillante mergée) ou si la résolution `@latest` de jsDelivr est détournée, du CSS arbitraire est servi instantanément à 100 % de tes visiteurs. Du CSS seul suffit pour défigurer le site, superposer un faux contenu (`::before { content: ... }` par-dessus tes coordonnées de contact — un recruteur pourrait voir un email attaquant à la place du tien), ou exfiltrer des données via sélecteurs d'attributs. L'incident polyfill.io (juin 2024, ~100 000 sites touchés) a montré que ce vecteur est activement exploité. La probabilité reste faible (d'où Medium et pas High), mais l'exposition est totale et permanente tant que le tag est flottant.
- **Remédiation :** épingler une version et ajouter l'intégrité. Idéalement, passer par cdnjs qui fournit le hash :
  ```html
  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/devicons/devicon@2.16.0/devicon.min.css"
        crossorigin="anonymous"/>
  ```
  (générer le hash `integrity` via https://www.srihash.org/ une fois la version choisie, ou télécharger le fichier et l'auto-héberger dans `css/vendor/` — option la plus robuste : zéro dépendance externe, et ~40 icônes utilisées seulement).

### [MEDIUM] 2. Aucun en-tête de sécurité HTTP (CSP, X-Frame-Options, Referrer-Policy…)
- **Catégorie :** A05:2021 Security Misconfiguration / CWE-693
- **Localisation :** absence de fichier `_headers` ou `netlify.toml` à la racine du dépôt
- **Description :** le site est servi par Netlify sans aucun en-tête de sécurité personnalisé. Pas de Content-Security-Policy, pas de `X-Frame-Options`/`frame-ancestors`, pas de `Referrer-Policy`, pas de `Permissions-Policy`.
- **Scénario d'attaque :** pris isolément, l'impact est mineur sur un site vitrine sans authentification ni données utilisateur. Mais la CSP est ici la **contre-mesure directe du finding #1** : avec une CSP limitant `style-src` et `font-src` aux origines attendues et interdisant tout `script-src` externe, un CDN compromis ne pourrait pas charger de ressources vers des domaines attaquants, et le site devient effectivement immunisé contre l'injection de contenu tiers. C'est ce couplage qui justifie le niveau Medium.
- **Remédiation :** créer un fichier `_headers` à la racine (déployé tel quel par Netlify) :
  ```
  /*
    Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; font-src https://fonts.gstatic.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; img-src 'self' data:; media-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'
    X-Frame-Options: DENY
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Permissions-Policy: camera=(), microphone=(), geolocation=()
  ```
  Notes : `'unsafe-inline'` est requis pour les scripts anti-FOUC du `<head>` et les styles inline des renderers (alternative plus stricte : déplacer les scripts inline dans un fichier ou utiliser un nonce — non trivial en statique pur, acceptable de garder `'unsafe-inline'` pour `style-src`). Tester avec l'onglet Console après déploiement : la CSP casse silencieusement ce qu'elle bloque.

### [LOW] 3. Font Awesome 6.4.0 (cdnjs) et Google Fonts sans Subresource Integrity
- **Catégorie :** A06:2021 / CWE-353 (absence de vérification d'intégrité)
- **Localisation :** [index.html:9](index.html#L9) (Google Fonts), [index.html:12](index.html#L12) (Font Awesome)
- **Description :** Font Awesome est correctement **épinglé** en 6.4.0 (bien), mais chargé sans attribut `integrity` : une compromission de cdnjs servirait du CSS modifié sans détection. Google Fonts ne peut pas utiliser SRI (le CSS varie selon le navigateur) — le risque résiduel repose sur la confiance en Google.
- **Scénario d'attaque :** identique au finding #1 mais nettement moins probable : il faudrait compromettre cdnjs (Cloudflare) lui-même et remplacer un fichier versionné, plutôt qu'un simple dépôt GitHub communautaire.
- **Remédiation :** ajouter le hash SRI publié par cdnjs :
  ```html
  <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossorigin="anonymous" referrerpolicy="no-referrer"/>
  ```
  (hash officiel publié sur la page cdnjs de font-awesome 6.4.0 — à vérifier au moment de l'ajout). Pour les fonts Google, l'option maximaliste est l'auto-hébergement (via google-webfonts-helper) — bonus RGPD au passage : plus d'appel vers Google.

### [LOW] 4. `rel="noopener"` manquant sur les liens `target="_blank"` du thème Terminal
- **Catégorie :** CWE-1022 (reverse tabnabbing)
- **Localisation :** [terminal.js:141](js/app/renderers/terminal.js#L141), [terminal.js:167](js/app/renderers/terminal.js#L167), [terminal.js:215-216](js/app/renderers/terminal.js#L215-L216), [terminal.js:220](js/app/renderers/terminal.js#L220)
- **Description :** les cartes projets et liens de contact du renderer `terminal` ouvrent des sites externes (GitHub Pages, Vercel) en `target="_blank"` sans `rel="noopener"`. Les 4 autres renderers (`atelier`, `fluid`, `compile`, `mise-en-place`) le mettent systématiquement — c'est une incohérence du seul thème terminal.
- **Scénario d'attaque :** historiquement, la page ouverte pouvait rediriger l'onglet d'origine via `window.opener.location` (tabnabbing). Tous les navigateurs modernes (depuis ~2021) appliquent `noopener` implicitement sur `target="_blank"`, donc l'impact réel est quasi nul aujourd'hui — flaggé surtout pour la cohérence et les vieux navigateurs.
- **Remédiation :** ajouter `rel="noopener"` aux 5 liens concernés, comme dans les autres renderers.

### [INFO] 5. Téléphone personnel et email en clair dans le code source
- **Catégorie :** exposition de données personnelles (pas une vulnérabilité)
- **Localisation :** [content.js:236-237](js/app/content.js#L236-L237)
- **Description :** `06 29 62 66 89` et `noa.vellat@epitech.eu` sont dans le JS servi publiquement — trivialement moissonnables par les bots de spam/démarchage. Pour un portfolio dont le but est d'être contacté par des recruteurs, c'est un **choix assumé et raisonnable** ; simplement, sois conscient que le numéro finira dans des bases de démarchage. Alternative si le spam téléphonique devient pénible : ne garder que l'email, ou obfusquer légèrement le numéro (assemblage JS au clic).

## Findings — Dependency CVEs

Pas de manifeste de dépendances (`package.json`, etc.) — le site n'a aucune dépendance npm. Les trois ressources CDN ont été vérifiées :

| # | Sévérité | Package | Version installée | CVE | Corrigé en |
|---|---|---|---|---|---|
| — | — | font-awesome (CSS, cdnjs) | 6.4.0 | aucune applicable | — |
| — | — | devicon (CSS, jsDelivr) | `@latest` (flottant) | aucune connue | — |
| — | — | Google Fonts (CSS) | n/a | aucune | — |

- **Font Awesome 6.4.0 :** la recherche remonte uniquement des CVE visant le **plugin WordPress** Font Awesome (ex. CVE-2022-4478, stored XSS ≤ 4.3.1) — non applicables ici, où seule la feuille de style/icônes est consommée. Aucun avis de sécurité ne vise le CSS 6.4.0. À noter : 6.4.0 date de 2023, des versions 6.7.x existent — mise à jour de confort, pas de sécurité.
- **devicon :** aucune CVE ni GHSA publiée pour la bibliothèque elle-même. Le risque est le mode de chargement (`@latest`, finding #1), pas une vulnérabilité connue du paquet.

Sources consultées : [cvedetails — Font Awesome](https://www.cvedetails.com/product/132456/Fontawesome-Font-Awesome.html?vendor_id=29441), [NVD CVE-2022-4478](https://nvd.nist.gov/vuln/detail/CVE-2022-4478), [cdnjs — devicon](https://cdnjs.com/libraries/devicon), [jsDelivr](https://www.jsdelivr.com/).

## Not Checked / Out of Scope

- **Configuration Netlify côté dashboard** (redirections, variables d'environnement, protection du panneau) — non accessible depuis le dépôt.
- **Les 6 projets liés** (Jeux_Videops, Klivio, My Video Club, Générateur CV, My Notion, Core_Lab) sont des applications distinctes hébergées ailleurs — hors périmètre. My Notion (Next.js/Prisma/PostgreSQL) et Core_Lab (MERN) ont un vrai back-end et mériteraient chacun leur propre audit.
- **Fichiers binaires** (vidéos MP4, PDF, images) — non analysés au-delà de leur présence.
- **`_sources/`** — exclu du dépôt par `.gitignore`, non déployé, non audité.

## Methodology

Revue statique par motifs (OWASP Top 10 2021 + checklist spécifique JavaScript : prototype pollution, sinks DOM XSS, `eval`, ReDoS, supply chain) appliquée à l'intégralité des fichiers HTML/JS, combinée à une recherche d'avis CVE/GHSA en ligne pour chaque ressource tierce chargée. Ceci ne remplace pas un test d'intrusion complet ni un outil SCA dédié (Snyk, Dependabot, Trivy) — mais pour un site statique sans dépendances npm, la couverture est ici quasi exhaustive.
