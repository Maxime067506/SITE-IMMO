# Delfosse Properties

Site éditorial de 7 appartements d'exception à Nice — French Riviera.

**Stack** : HTML / CSS / JS vanilla · statique · aucun build step
**Design** : Direction B « Verre fumé de Rolls » · navy `#0A1628` + crème `#F5EDE0` + or `#C9A961`
**Typos** : Cormorant Garamond (serif) + Jost (sans)

---

## Structure

```
SITE IMMO/
├── index.html                  Accueil — hero + about + séjours + carte + avis + coverflow
├── login.html                  Espace voyageur (auth simple)
├── espace.html                 Dashboard voyageur (guide, wifi, inventaire, contacts, règlement, vidéos)
├── sejour-01.html … 07.html    7 fiches séjours
├── css/
│   ├── style.css               Design global
│   ├── sejour.css              Fiches séjours
│   └── auth.css                Espace voyageur
├── js/
│   ├── app.js                  Accordéon, coverflow, carte Leaflet, carrousel avis
│   ├── auth.js                 Login local (démo) + gestion session
│   ├── i18n.js                 FR / EN
│   └── video-bg.js             Fond vidéo YouTube + overlay 4 niveaux
├── img/
│   ├── airbnb/01-amiral → 07-crescendo/   Photos par apart
│   ├── nice-sunset.jpg         Poster hero
│   ├── grain.png               Texture cinéma 4 %
│   └── delfosse-mark.png       Logo
├── doc/
│   ├── guide-nice.pdf          Guide voyageur 50 lieux
│   └── videos/                 Tutoriels (canapé-lit, etc.)
├── vercel.json                 Config headers + redirects pour Vercel
├── netlify.toml + _redirects   Config Netlify (legacy, peut être supprimée après migration Vercel)
└── gen-sejours.py              Générateur des 7 fiches depuis TPL + APTS
```

## URLs courtes (rewrites)

| URL | Cible |
|---|---|
| `/login` | `/login.html` |
| `/espace` | `/espace.html` |
| `/port` | `/sejour-01.html` |
| `/jumeau` | `/sejour-02.html` |
| `/notre-dame` | `/sejour-03.html` |
| `/art-deco` | `/sejour-04.html` |
| `/ultra-design` | `/sejour-05.html` |
| `/dernier` | `/sejour-06.html` |
| `/design` | `/sejour-07.html` |

## Développement local

```bash
# Serveur statique rapide (Python 3)
py -3 -m http.server 8001

# Regénérer les 7 fiches depuis gen-sejours.py
py -3 gen-sejours.py

# Regénérer le grain pellicule
py -3 gen-grain.py
```

Ouvrir : `http://localhost:8001`

## Déploiement

### Vercel (recommandé)
1. Push sur GitHub
2. Importer le repo sur [vercel.com/new](https://vercel.com/new)
3. Aucune config de build — Vercel détecte le site statique auto
4. `vercel.json` gère : headers sécurité, cache `immutable` CSS/JS/IMG, rewrites, redirects

### Netlify (alternative)
- Upload `DELFOSSE_netlify.zip` (généré via `py -3 make-netlify-zip.py`)
- Ou brancher le repo GitHub → deploy auto

## Cache-busting

Chaque asset CSS/JS critique est versionné via query-string :
- `style.css?v=b4`
- `app.js?v=b8`
- `video-bg.js?v=b5`
- `auth.js?v=b8`
- Photos spécifiques : `photo-01.jpg?v=c1` / `?v=d1` / `?v=e3`

Quand tu modifies un asset, incrémente le `v=` pour forcer le refetch client malgré le `Cache-Control: immutable`.

## Crédits

© 2026 Delfosse Properties · Design + dev éditorial sur-mesure.
