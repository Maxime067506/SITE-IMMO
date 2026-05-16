# Photos des articles blog

Ce dossier contient les photos intégrées dans les 2 articles blog.

## État actuel

Les photos actuelles sont des **placeholders premium** issus des photos d'appartements
Delfosse Properties + nice-sunset (déjà watermarkés et optimisés).

Elles fonctionnent visuellement mais sont **thématiquement génériques**. Pour un
rendu Vogue / Condé Nast Traveler optimal, les remplacer par des photos
spécifiques au sujet (récupérables sur Unsplash, droits commerciaux gratuits).

## Comment remplacer une photo

1. Cherche sur Unsplash le sujet précis (voir liste ci-dessous)
2. Télécharge en **résolution Large** ou **Original** (≥ 1920×1080)
3. Renomme le fichier en respectant le naming existant (ex: `01-vieux-nice.jpg`)
4. Place-le dans le bon dossier (`quartiers/` ou `3-jours/`)
5. Pour générer la version WebP : lance `py convert-webp.py` à la racine du projet
6. Hard refresh sur le site et c'est intégré automatiquement (le HTML pointe sur ces noms)

---

## Liste des photos à remplacer

### `/img/blog/quartiers/`

| Fichier | Sujet idéal | Recherche Unsplash |
|---|---|---|
| `01-vieux-nice.jpg` | Ruelles ocres du Vieux-Nice au coucher du soleil | `vieux-nice` / `nice-old-town` |
| `02-carre-or.jpg` | Hôtel Negresco / Carré d'Or Belle Époque | `negresco-hotel` / `nice-belle-epoque` |
| `03-musiciens.jpg` | Façade Belle Époque rue calme | `nice-apartment-building` |
| `04-port-lympia.jpg` | Port de Nice crépuscule, yachts | `port-lympia` / `nice-harbor-sunset` |
| `05-promenade.jpg` | Vue aérienne baie des Anges golden hour | `promenade-des-anglais` |
| `06-cimiez.jpg` | Villas Belle Époque verdure Cimiez | `cimiez-nice` |
| `07-liberation.jpg` | Marché Libération étals colorés | `nice-market` |
| `08-gare.jpg` | Tramway Nice / avenue Jean Médecin élégant | `nice-tramway` |

### `/img/blog/3-jours/`

| Fichier | Sujet idéal | Recherche Unsplash |
|---|---|---|
| `j1-hero-colline.jpg` | Vue depuis Colline du Château au sunset | `nice-castle-hill` |
| `j1-cours-saleya.jpg` | Marché aux fleurs Cours Saleya | `cours-saleya` |
| `j1-vieux-nice.jpg` | Ruelles Vieux-Nice scène vie | `nice-old-town-alley` |
| `j1-apero-port.jpg` | Aperol Spritz terrasse port Nice | `aperol-spritz-mediterranean` |
| `j2-hero-promenade.jpg` | Promenade des Anglais blue hour | `promenade-des-anglais-evening` |
| `j2-negresco.jpg` | Hôtel Negresco façade rose | `hotel-negresco` |
| `j2-massena.jpg` | Place Masséna fontaine du Soleil | `place-massena` |
| `j3-hero-eze.jpg` | Èze village médiéval perché Méditerranée | `eze-village` |
| `j3-monaco.jpg` | Port Hercule Monaco / Monte-Carlo | `monaco-port-hercule` |
| `j3-matisse.jpg` | Musée Matisse Cimiez | `matisse-museum-nice` |
| `eat-hero.jpg` | Table niçoise / socca / pissaladière | `socca-nice` / `french-riviera-food` |
| `eat-classics.jpg` | Salade niçoise authentique | `salade-nicoise` |

---

## Critères de sélection (style Vogue / Condé Nast Traveler)

- ✅ Lumière dorée (golden hour, blue hour)
- ✅ Compositions architecturales (lignes, perspectives)
- ✅ Détails luxueux (textures, finitions)
- ✅ Éviter les selfies / portraits centraux
- ✅ Éviter les touristes massivement visibles
- ✅ Préférer 16/9 paysage (sauf rares cas portrait)
- ✅ Résolution minimum 1920 × 1080
