"""Génère les 7 pages sejour-XX.html V2 éditorial (Aman / Cereal).

Template V2 :
 - Hero split (text + slideshow Ken Burns + progress bars)
 - Stats band cream-warm avec chiffres Cormorant italic
 - Description 2-col éditorial
 - Galerie mosaïque asymétrique maîtrisée
 - Lightbox premium navy profond + thumbnails + compteur
 - Plan Leaflet monochrome 3D tilt
 - CTA finale navy

Numérotation affichée = ordre strip. Chaque appartement rattaché à son dossier
d'images (via `dir`) et à son lien Airbnb propre.
"""
import os
import sys

SITE = os.path.dirname(os.path.abspath(__file__))

# Roman numerals map (N°01 → I, N°02 → II, etc.)
ROMAN = {
    "01": "I", "02": "II", "03": "III", "04": "IV",
    "05": "V", "06": "VI", "07": "VII",
}

APTS = [
    {
        "no": "01", "dir": "01-amiral",
        "name_first": "Notre appartement ", "name_italic": "du port.",
        "name": "Notre appartement du port",
        "sub": "Vue sur les toits de Nice",
        "address": "5 rue Barla, Nice",
        "address_short": "5 rue Barla — Port Lympia",
        "loc_eye": "Port de Nice · 4 voyageurs",
        "lede": "Balcon plein sud face au port, à deux pas de Garibaldi et du Vieux-Nice. Lumière dorée toute l'après-midi.",
        "desc_title_pre": "Un balcon,", "desc_title_em": "la Riviera.",
        "desc_intro": "Idéalement situé à une minute du tramway, cet appartement au design soigné offre un emplacement de rêve à deux pas du port de Nice, de la place Garibaldi, de la Coulée Verte du Vieux-Nice et des plages.",
        "desc_body": "Profitez d'une literie française de qualité, d'un équipement complet et d'un grand balcon exposé plein sud avec vue sur les toits de Nice. L'espace optimisé accueille jusqu'à 4 voyageurs dans une ambiance moderne et lumineuse.",
        "guests": 4, "bedrooms": 1, "beds": 2, "bathrooms": 1,
        "rating": "4,87", "reviews": 75,
        "lat": 43.70150, "lon": 7.28010,
        "airbnb": "https://www.airbnb.fr/rooms/1361669686960380718",
        "photos": 8,
        "cta_pre": "Réservez", "cta_em": "L'appartement du port.",
        "map_title_pre": "5 rue Barla", "map_title_em": "— Port.",
        "nearby": [
            ("Tramway", "1 min à pied"),
            ("Port de Nice", "Face à l'appartement"),
            ("Place Garibaldi", "3 min à pied"),
            ("Vieux Nice", "5 min à pied"),
            ("Gare de Nice", "7 min en tram"),
            ("Aéroport", "25 min en tram"),
        ],
    },
    {
        "no": "02", "dir": "02-commodore",
        "name_first": "Son jumeau ", "name_italic": "du port.",
        "name": "Son jumeau du port",
        "sub": "Vue sur les toits de Nice",
        "address": "5 rue Barla, Nice",
        "address_short": "5 rue Barla — Port Lympia",
        "loc_eye": "Port de Nice · 4 voyageurs",
        "lede": "Le pendant de notre premier appartement : même emplacement rêvé au port, même balcon plein sud, atmosphère distincte.",
        "desc_title_pre": "Même port,", "desc_title_em": "autre esprit.",
        "desc_intro": "Cet appartement au design soigné offre un emplacement de rêve à deux pas du port de Nice, de la place Garibaldi, de la Coulée Verte du Vieux-Nice et des plages.",
        "desc_body": "Profitez d'une literie française de qualité, d'un équipement complet et d'un grand balcon exposé plein sud avec vue sur les toits.",
        "guests": 4, "bedrooms": 1, "beds": 2, "bathrooms": 1,
        "rating": "4,88", "reviews": 64,
        "lat": 43.70160, "lon": 7.28020,
        "airbnb": "https://www.airbnb.fr/rooms/1361686663866337495",
        "photos": 8,
        "cta_pre": "Réservez", "cta_em": "Son jumeau.",
        "map_title_pre": "5 rue Barla", "map_title_em": "— Port.",
        "nearby": [
            ("Tramway", "1 min à pied"),
            ("Port de Nice", "À deux pas"),
            ("Place Garibaldi", "3 min à pied"),
            ("Vieux Nice", "5 min à pied"),
            ("Gare de Nice", "7 min en tram"),
            ("Aéroport", "25 min en tram"),
        ],
    },
    {
        "no": "03", "dir": "03-basilique",
        "name_first": "Notre appartement ", "name_italic": "avenue Notre-Dame.",
        "name": "Notre appartement avenue Notre-Dame",
        "sub": "Famille · 6 voyageurs · mezzanine",
        "address": "27 avenue Notre-Dame, Nice",
        "address_short": "27 avenue Notre-Dame",
        "loc_eye": "Hyper centre · 6 voyageurs",
        "lede": "Appartement familial moderne avec mezzanine, en plein cœur de Nice, à une minute du tramway et de l'avenue Jean Médecin.",
        "desc_title_pre": "Au cœur", "desc_title_em": "de Nice.",
        "desc_intro": "Bienvenue dans cet appartement moderne et confortable, en plein cœur de Nice. À seulement une minute du tramway et de l'avenue Jean Médecin.",
        "desc_body": "Un espace optimisé pour 6 personnes : une chambre avec lit double, une mezzanine avec lit double, un canapé-lit dans le salon. Commerces, restaurants et attractions à quelques pas.",
        "guests": 6, "bedrooms": 2, "beds": 3, "bathrooms": 1,
        "rating": "4,84", "reviews": 25,
        "lat": 43.70410, "lon": 7.26530,
        "airbnb": "https://www.airbnb.fr/rooms/1563266584925477319",
        "photos": 8,
        "cta_pre": "Réservez", "cta_em": "Avenue Notre-Dame.",
        "map_title_pre": "27 avenue Notre-Dame", "map_title_em": "— Hyper centre.",
        "nearby": [
            ("Tramway L1", "1 min à pied"),
            ("Basilique Notre-Dame", "À côté"),
            ("Vieux Nice & Masséna", "5 min à pied"),
            ("Gare de Nice", "5 min à pied"),
            ("Avenue Jean Médecin", "1 min à pied"),
            ("Aéroport par tram", "25 min"),
        ],
    },
    {
        "no": "04", "dir": "04-transatlantique",
        "name_first": "Notre appartement ", "name_italic": "Art Déco.",
        "name": "Notre appartement Art Déco",
        "sub": "Quartier de la Gare · studio Art Déco",
        "address": "Face à la gare, Nice",
        "address_short": "Face à la gare",
        "loc_eye": "Quartier Gare · 4 voyageurs",
        "lede": "Grand studio Art Déco rénové, face à la gare de Nice, baigné de lumière plein sud.",
        "desc_title_pre": "Charme", "desc_title_em": "Art Déco.",
        "desc_intro": "Superbe studio rénové, idéalement situé face à la gare de Nice, à 3 min des transports et 10 min de la place Masséna.",
        "desc_body": "Spacieux et tout équipé, il offre jusqu'à 4 couchages avec un véritable lit escamotable. Exposé plein sud, il est baigné de lumière toute la journée.",
        "guests": 4, "bedrooms": "Studio", "beds": 2, "bathrooms": 1,
        "rating": "4,86", "reviews": 43,
        "lat": 43.7039, "lon": 7.2618,
        "airbnb": "https://www.airbnb.fr/rooms/1361628609886141688",
        "photos": 7,
        "cta_pre": "Réservez", "cta_em": "L'Art Déco.",
        "map_title_pre": "Face à la gare", "map_title_em": "— Nice.",
        "nearby": [
            ("Gare de Nice", "Face à l'appartement"),
            ("Transports", "3 min à pied"),
            ("Place Masséna", "10 min à pied"),
            ("Vieux Nice", "12 min à pied"),
            ("Promenade des Anglais", "15 min à pied"),
            ("Aéroport", "25 min en tram"),
        ],
    },
    {
        "no": "05", "dir": "06-scherzo",
        "name_first": "Notre appartement ", "name_italic": "ultra design.",
        "name": "Notre appartement ultra design",
        "sub": "Quartier des Musiciens · T2 design",
        "address": "41 avenue Georges Clemenceau, Nice",
        "address_short": "41 av. Georges Clemenceau",
        "loc_eye": "Musiciens · 4 voyageurs · ultra design",
        "lede": "T2 ultra design, décoration poussée au maximum. Note exceptionnelle de 4,94.",
        "desc_title_pre": "Ultra", "desc_title_em": "design.",
        "desc_intro": "T2 ultra design, entièrement neuf, en plein centre de Nice. Mobilier moderne haut de gamme, déco soignée jusqu'aux derniers détails.",
        "desc_body": "Climatisation, TV écran plat, cuisine équipée. Chambre séparée avec literie premium. À 2 min de Jean Médecin et du tram, 5 min de la gare, 15 min des plages.",
        "guests": 4, "bedrooms": 1, "beds": 2, "bathrooms": 1,
        "rating": "4,94", "reviews": 16,
        "lat": 43.70060, "lon": 7.26180,
        "airbnb": "https://www.airbnb.fr/rooms/1446914329011561138",
        "photos": 8,
        "cta_pre": "Réservez", "cta_em": "L'ultra design.",
        "map_title_pre": "41 avenue Georges Clemenceau", "map_title_em": "— Musiciens.",
        "nearby": [
            ("Tramway & Jean Médecin", "2 min à pied"),
            ("Gare SNCF", "5 min à pied"),
            ("Place Masséna", "10 min à pied"),
            ("Vieux Nice", "10 min à pied"),
            ("Place Garibaldi", "10 min à pied"),
            ("Plage", "15 min à pied"),
        ],
    },
    {
        "no": "06", "dir": "07-crescendo",
        "name_first": "Notre dernier ", "name_italic": "appartement.",
        "name": "Notre dernier appartement",
        "sub": "Quartier des Musiciens · rénové",
        "address": "24D rue Gounod, Nice",
        "address_short": "24D rue Gounod",
        "loc_eye": "Musiciens · 4 voyageurs · rénové",
        "lede": "Appartement entièrement rénové, tout confort, à 5 minutes à pied de la gare et 10 des plages.",
        "desc_title_pre": "Tout", "desc_title_em": "Nice à pied.",
        "desc_intro": "Séjournez dans ce superbe appartement entièrement rénové, idéalement situé à 5 min à pied de la gare, des transports, du centre.",
        "desc_body": "Climatisé et tout équipé, il peut accueillir jusqu'à 4 personnes. Son emplacement parfait vous permet de profiter pleinement de Nice entre promenades, restaurants et boutiques.",
        "guests": 4, "bedrooms": 1, "beds": 1, "bathrooms": 1,
        "rating": "4,69", "reviews": 52,
        "lat": 43.70100, "lon": 7.25900,
        "airbnb": "https://www.airbnb.fr/rooms/1361447215596892211",
        "photos": 7,
        "cta_pre": "Réservez", "cta_em": "Notre dernier-né.",
        "map_title_pre": "24D rue Gounod", "map_title_em": "— Musiciens.",
        "nearby": [
            ("Gare de Nice", "5 min à pied"),
            ("Transports", "5 min à pied"),
            ("Avenue Jean Médecin", "5 min à pied"),
            ("Place Masséna", "10 min à pied"),
            ("Vieux Nice", "10 min à pied"),
            ("Plage", "10 min à pied"),
            ("Aéroport", "20 min en tram"),
        ],
    },
    {
        "no": "07", "dir": "05-adagio",
        "name_first": "Notre appartement ", "name_italic": "design.",
        "name": "Notre appartement design",
        "sub": "Quartier des Musiciens · T2 design",
        "address": "41 avenue Georges Clemenceau, Nice",
        "address_short": "41 av. Georges Clemenceau",
        "loc_eye": "Musiciens · 4 voyageurs · design",
        "lede": "T2 design entièrement neuf, mobilier moderne et déco soignée, entre Jean Médecin et la gare.",
        "desc_title_pre": "Design", "desc_title_em": "neuf.",
        "desc_intro": "T2 super design, entièrement neuf, en plein centre de Nice. Mobilier moderne, déco soignée, climatisation, cuisine équipée.",
        "desc_body": "Chambre séparée avec literie haut de gamme. À 2 min de Jean Médecin et du tram, 5 min de la gare SNCF, 15 min des plages.",
        "guests": 4, "bedrooms": 1, "beds": 2, "bathrooms": 1,
        "rating": "4,81", "reviews": 21,
        "lat": 43.70050, "lon": 7.26170,
        "airbnb": "https://www.airbnb.fr/rooms/1447097634568506909",
        "photos": 8,
        "cta_pre": "Réservez", "cta_em": "L'appartement design.",
        "map_title_pre": "41 avenue Georges Clemenceau", "map_title_em": "— Musiciens.",
        "nearby": [
            ("Tramway & Jean Médecin", "2 min à pied"),
            ("Gare SNCF", "5 min à pied"),
            ("Place Masséna", "10 min à pied"),
            ("Vieux Nice", "10 min à pied"),
            ("Plage", "15 min à pied"),
            ("Aéroport", "25 min en tram"),
        ],
    },
]

TPL = """<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#0A1628" />
  <meta name="description" content="{name} — {loc_eye}. {address}." />
  <title>Fiche N° {roman} · {name} — Delfosse Properties</title>

  <link rel="preload" as="image" href="img/airbnb/01-amiral/photo-01.jpg" fetchpriority="high" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Jost:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  <link rel="stylesheet" href="css/style.css?v=b8" />
  <link rel="stylesheet" href="css/sejour.css?v=b5" />
</head>
<body class="sejour-page">

  <header class="site-header is-scrolled" id="siteHeader">
    <a href="index.html" class="brand-word">
      <span class="brand-mono">Delfosse</span>
      <span class="brand-sub">Properties</span>
    </a>
    <nav class="nav" aria-label="Principal">
      <a href="index.html#sejours" data-i18n="nav.allStays">Tous les séjours</a>
      <a href="index.html#carte" data-i18n="nav.map">Carte</a>
      <a href="index.html#avis" data-i18n="nav.reviews">Avis</a>
      <a href="index.html#carousel" class="nav-cta" data-i18n="carousel.eyebrow">Réserver</a>
      <span class="nice-clock nice-clock--nav" aria-hidden="true" title="Heure locale de Nice">Nice · --:--</span>
    </nav>
    <div class="header-cta">
      <span class="nice-clock nice-clock--header" aria-hidden="true" title="Heure locale de Nice">Nice · --:--</span>
      <div class="lang-switch" role="group" aria-label="Langue">
        <button type="button" data-lang="fr" class="is-active">FR</button>
        <span class="lang-sep">·</span>
        <button type="button" data-lang="en">EN</button>
      </div>
      <a href="login.html" class="login-link">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
        </svg>
        <span data-i18n="nav.space">Espace</span>
      </a>
      <button class="burger" id="burger" aria-label="Menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <section class="sejour-top" data-overlay="1">
    <a href="index.html#sejours" class="back-link" data-i18n="fiche.backLink">← Retour aux séjours</a>
    <div class="top-meta">
      <span class="top-num">Fiche N° {roman} — MMXXVI</span>
      <span class="top-rating">★ {rating} · {reviews} <span data-i18n="fiche.reviews">avis</span></span>
    </div>
  </section>

  <section class="sejour-hero" data-overlay="1">
    <div class="hero-title">
      <p class="eyebrow"><span class="eyebrow-num">{roman}</span> <span data-i18n="stay.{no_int}.loc">{loc_eye}</span></p>
      <h1 class="display" data-i18n="apt.{no_int}.heroTitle" data-i18n-html="true">{name_first}<em>{name_italic}</em></h1>
      <p class="sub" data-i18n="stay.{no_int}.sub">{sub}</p>
      <p class="addr">{address_short} · Nice</p>
      <p class="lede" data-i18n="stay.{no_int}.lede">{lede}</p>
      <div class="hero-cta">
        <a href="{airbnb}" target="_blank" rel="noopener" class="btn btn-gold" data-i18n="cta.bookAirbnb">Réserver sur Airbnb</a>
        <span class="rating-row">★ {rating} · {reviews} <span data-i18n="fiche.reviews">avis</span></span>
      </div>
    </div>

    <div class="hero-image" id="heroImage">
      <div class="hero-progress" aria-hidden="true">
{progress_bars}
      </div>
{hero_slides}
    </div>
  </section>

  <section class="sejour-stats" data-overlay="2">
    <div class="stats-inner">
      <div class="stat-cell"><span class="stat-label" data-i18n="stat.guests">Voyageurs</span><strong class="stat-value">{guests}</strong></div>
      <div class="stat-cell"><span class="stat-label" data-i18n="{bedroom_key}">{bedroom_label}</span><strong class="stat-value">{bedrooms}</strong></div>
      <div class="stat-cell"><span class="stat-label" data-i18n="stat.beds">Lits</span><strong class="stat-value">{beds}</strong></div>
      <div class="stat-cell"><span class="stat-label" data-i18n="{bath_key}">{bath_label}</span><strong class="stat-value">{bathrooms}</strong></div>
      <div class="stat-cell"><span class="stat-label" data-i18n="stat.rating">Note Airbnb</span><strong class="stat-value">{rating}<em>/5</em></strong></div>
    </div>
  </section>

  <section class="sejour-desc" data-overlay="1">
    <div>
      <p class="eyebrow"><span class="eyebrow-num">II</span> <span data-i18n="sec.desc">Description</span></p>
      <h2 class="h-display" data-i18n="apt.{no_int}.title" data-i18n-html="true">{desc_title_pre}<br/><em>{desc_title_em}</em></h2>
    </div>
    <div>
      <p class="intro" data-i18n="apt.{no_int}.intro">{desc_intro}</p>
      <p data-i18n="apt.{no_int}.body">{desc_body}</p>

      <h3 data-i18n="desc.nearby">À proximité — tout est à pied</h3>
      <ul>
{nearby_html}
      </ul>
    </div>
  </section>

  <section class="sejour-coverflow" data-overlay="2">
    <header class="section-head">
      <p class="eyebrow light"><span class="eyebrow-num">III</span> <span data-i18n="sec.gallery">Galerie</span></p>
      <h2 class="h-display" data-i18n="sec.galleryTitle" data-i18n-html="true">Le lieu <em>en images.</em></h2>
    </header>

    <div class="cf-track" id="ficheCfTrack" tabindex="0" role="group" aria-label="Galerie photos de l'appartement">
      <div class="cf-stage" id="ficheCfStage"
           data-photo-dir="{photo_dir}"
           data-photo-count="{total_photos}"
           data-photo-version="{photo_version}"
           aria-live="polite"></div>
    </div>

    <div class="cf-controls">
      <div class="cf-counter">
        <span id="ficheCfCur">01</span>
        <span class="cf-sep">/</span>
        <span class="cf-tot">{total_photos_padded}</span>
      </div>

      <div class="cf-dots" id="ficheCfDots" role="tablist" aria-label="Sélection photo"></div>

      <div class="cf-arrows">
        <button type="button" class="cf-arrow cf-prev-fiche" aria-label="Photo précédente">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M15 6l-6 6 6 6"/>
          </svg>
        </button>
        <button type="button" class="cf-arrow cf-next-fiche" aria-label="Photo suivante">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 6l6 6-6 6"/>
          </svg>
        </button>
      </div>
    </div>
  </section>

  <section class="sejour-map" data-overlay="2">
    <header class="section-head">
      <p class="eyebrow"><span class="eyebrow-num">IV</span> <span data-i18n="sec.location">Localisation</span></p>
      <h2 class="h-display">{map_title_pre} <em>{map_title_em}</em></h2>
    </header>
    <div class="carte-3d" id="carte3d">
      <div class="carte-meta" aria-hidden="true">
        <span class="rec"></span>
        <span>Plan · {address_short}, Nice</span>
      </div>
      <div id="niceMap" class="carte-canvas" data-lat="{lat}" data-lon="{lon}" data-label="{name}"></div>
      <div class="carte-compass" aria-hidden="true">
        <span>N</span>
        <svg viewBox="0 0 40 40" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
          <circle cx="20" cy="20" r="18"/>
          <path d="M20 4 L23 18 L20 16 L17 18 Z" fill="currentColor"/>
          <path d="M20 36 L23 22 L20 24 L17 22 Z"/>
        </svg>
      </div>
    </div>
    <div class="map-legend">
{map_legend}
    </div>
  </section>

  <section class="sejour-cta" data-overlay="3">
    <div class="cta-wrap">
      <p class="eyebrow light"><span class="eyebrow-num">V</span> <span data-i18n="sec.cta">Disponible sur Airbnb</span></p>
      <h2 class="h-display" data-i18n="apt.{no_int}.cta" data-i18n-html="true">{cta_pre}<br/><em>{cta_em}</em></h2>
      <p class="rating">★ {rating} · {reviews} <span data-i18n="fiche.reviews">avis</span></p>
      <a href="{airbnb}" target="_blank" rel="noopener" class="btn btn-gold btn-big" data-i18n="cta.seeDates">Voir les disponibilités</a>
    </div>
  </section>

  <footer class="site-footer">
    <div class="foot-grid">
      <div>
        <div class="brand-word brand-footer">
          <span class="brand-mono">Delfosse</span>
          <span class="brand-sub">Properties</span>
        </div>
        <p class="foot-tag" data-i18n="foot.tag">Séjours d'exception, à Nice sur la French Riviera.</p>
      </div>
      <div>
        <h4 data-i18n="foot.navTitle">Navigation</h4>
        <ul>
          <li><a href="index.html#sejours" data-i18n="nav.allStays">Tous les séjours</a></li>
          <li><a href="index.html#carte" data-i18n="nav.map">Carte</a></li>
          <li><a href="index.html#avis" data-i18n="nav.reviews">Avis</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© MMXXVI Delfosse Properties · <span data-i18n="foot.city">Nice, French Riviera</span></span>
      <span><a href="#" data-i18n="foot.legal">Mentions légales</a> · <a href="#" data-i18n="foot.tos">CGV</a> · <a href="#" data-i18n="foot.privacy">Confidentialité</a></span>
    </div>
  </footer>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
  <script src="js/i18n.js?v=b3"></script>
  <script src="js/app.js?v=b9"></script>
  <script src="js/video-bg.js?v=b9"></script>
  <script>
    /* Hero slideshow Ken Burns + progress bars */
    (() => {{
      const root = document.getElementById('heroImage');
      if (!root) return;
      const slides = [...root.querySelectorAll('.slide')];
      const bars = [...root.querySelectorAll('.hero-progress .bar')];
      if (slides.length < 2) return;
      let idx = 0, timer = null, paused = false;
      const DUR = 5000;
      const show = (i) => {{
        slides[idx].classList.remove('is-active');
        bars[idx]?.classList.remove('is-active');
        bars[idx]?.classList.add('is-done');
        idx = (i + slides.length) % slides.length;
        if (idx === 0) bars.forEach(b => b.classList.remove('is-done', 'is-active'));
        slides[idx].classList.add('is-active');
        bars[idx]?.classList.add('is-active');
        clearTimeout(timer);
        if (!paused) timer = setTimeout(() => show(idx + 1), DUR);
      }};
      root.addEventListener('mouseenter', () => {{ paused = true; clearTimeout(timer); }});
      root.addEventListener('mouseleave', () => {{ paused = false; timer = setTimeout(() => show(idx + 1), DUR); }});
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {{
        timer = setTimeout(() => show(1), DUR);
      }}
    }})();
  </script>
  <script>
    /* Carte Leaflet */
    (() => {{
      const canvas = document.getElementById('niceMap');
      if (!canvas || !window.L) return;
      const lat = parseFloat(canvas.dataset.lat);
      const lon = parseFloat(canvas.dataset.lon);
      const map = L.map(canvas, {{
        center: [lat, lon], zoom: 16,
        zoomControl: true, scrollWheelZoom: false, attributionControl: false,
      }});
      L.tileLayer('https://{{s}}.tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png').addTo(map);
      const icon = L.divIcon({{
        className: 'dp-marker-wrap',
        html: '<div class="dp-marker is-active">{no}</div>',
        iconSize: [44, 44], iconAnchor: [22, 22],
      }});
      L.marker([lat, lon], {{ icon }}).addTo(map);
      setTimeout(() => map.invalidateSize(), 200);
    }})();
  </script>
  <script>
    /* Lightbox premium */
    (() => {{
      const items = [...document.querySelectorAll('.gallery-item')];
      if (!items.length) return;
      const lb = document.getElementById('lightbox');
      const lbImg = document.getElementById('lbImg');
      const lbCounter = document.getElementById('lbCounter');
      const lbClose = document.getElementById('lbClose');
      const lbPrev = document.getElementById('lbPrev');
      const lbNext = document.getElementById('lbNext');
      const thumbs = document.getElementById('lbThumbs');
      const total = items.length;
      const roman = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];

      items.forEach((item, i) => {{
        const img = item.querySelector('img');
        const t = document.createElement('img');
        t.className = 'lightbox-thumb';
        t.src = img.src;
        t.alt = '';
        t.addEventListener('click', () => show(i));
        thumbs.appendChild(t);
      }});
      const thumbEls = [...thumbs.children];

      let idx = 0;
      const preloadAround = (i) => {{
        for (let k = 1; k <= 2; k++) {{
          [(i + k) % total, (i - k + total) % total].forEach((n) => {{
            const href = items[n].getAttribute('href');
            if (href) new Image().src = href;
          }});
        }}
      }};
      const show = (i) => {{
        idx = (i + total) % total;
        lbImg.classList.add('swapping');
        setTimeout(() => {{
          lbImg.src = items[idx].getAttribute('href');
          lbImg.classList.remove('swapping');
        }}, 150);
        lbCounter.textContent = `${{String(idx + 1).padStart(2, '0')}} / ${{String(total).padStart(2, '0')}}`;
        document.getElementById('lbNum').textContent = `N° ${{roman[idx] || idx + 1}}`;
        thumbEls.forEach((t, k) => t.classList.toggle('is-active', k === idx));
        const active = thumbEls[idx];
        if (active) active.scrollIntoView({{ behavior: 'smooth', inline: 'center', block: 'nearest' }});
        preloadAround(idx);
      }};

      const open = (i) => {{
        show(i);
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }};
      const close = () => {{
        lb.classList.remove('open');
        lb.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }};

      items.forEach((a, i) => a.addEventListener('click', (e) => {{ e.preventDefault(); open(i); }}));
      // Bind des cellules visibles (Airbnb layout) + strip mobile + bouton "Voir toutes les photos"
      document.querySelectorAll('.ab-cell, .ab-strip-cell, .ab-showall').forEach((btn) => {{
        btn.addEventListener('click', (e) => {{
          e.preventDefault();
          const i = parseInt(btn.dataset.i || '0', 10);
          open(i);
        }});
      }});
      lbClose.addEventListener('click', close);
      lbPrev.addEventListener('click', () => show(idx - 1));
      lbNext.addEventListener('click', () => show(idx + 1));
      lb.addEventListener('click', (e) => {{ if (e.target === lb) close(); }});

      // Swipe-down close (mobile)
      let swipeStart = null;
      lb.addEventListener('touchstart', (e) => {{
        swipeStart = {{ x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() }};
      }}, {{ passive: true }});
      lb.addEventListener('touchend', (e) => {{
        if (!swipeStart) return;
        const dx = e.changedTouches[0].clientX - swipeStart.x;
        const dy = e.changedTouches[0].clientY - swipeStart.y;
        const dt = Date.now() - swipeStart.t;
        if (Math.abs(dy) > Math.abs(dx) && dy > 80 && dt < 450) {{
          close();
        }} else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {{
          show(idx + (dx < 0 ? 1 : -1));
        }}
        swipeStart = null;
      }});

      document.addEventListener('keydown', (e) => {{
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') show(idx + 1);
        if (e.key === 'ArrowLeft')  show(idx - 1);
      }});

      let touchX = 0;
      lb.addEventListener('touchstart', (e) => {{ touchX = e.touches[0].clientX; }}, {{ passive: true }});
      lb.addEventListener('touchend', (e) => {{
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      }});
    }})();
  </script>
</body>
</html>
"""

ROMAN_CHAPTER = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"]

for apt in APTS:
    apt_map = dict(apt)
    apt_map["roman"] = ROMAN[apt["no"]]
    apt_map["no_int"] = str(int(apt["no"]))
    apt_map["total_photos"] = f'{apt["photos"]:02d}'

    # i18n singular/plural for bedroom & bathroom stats
    br = apt["bedrooms"]
    br_plural = isinstance(br, int) and br > 1
    apt_map["bedroom_key"]   = "stat.bedrooms" if br_plural else "stat.bedroom"
    apt_map["bedroom_label"] = "Chambres"      if br_plural else "Chambre"
    ba = apt["bathrooms"]
    ba_plural = isinstance(ba, int) and ba > 1
    apt_map["bath_key"]      = "stat.baths"     if ba_plural else "stat.bath"
    apt_map["bath_label"]    = "Salles de bain" if ba_plural else "Salle de bain"

    # 4 progress bars (pour les 4 premières narratives : salon → vue → chambre → cuisine)
    apt_map["progress_bars"] = "\n".join(
        f'        <span class="bar{" is-active" if i == 0 else ""}"></span>'
        for i in range(min(4, apt["photos"]))
    )

    # Hero slides (les 4 premières photos narratives)
    hero_items = []
    for i in range(1, min(5, apt["photos"] + 1)):
        nn = f"{i:02d}"
        cls = "slide is-active" if i == 1 else "slide"
        lz = "" if i == 1 else 'loading="lazy"'
        hero_items.append(
            f'      <div class="{cls}"><img src="img/airbnb/{apt["dir"]}/photo-{nn}.jpg" alt="" {lz} /></div>'
        )
    apt_map["hero_slides"] = "\n".join(hero_items)

    # Nearby list
    apt_map["nearby_html"] = "\n".join(
        f"        <li><span>{n}</span> {d}</li>" for n, d in apt["nearby"]
    )

    # Map legend (4 premières entrées nearby)
    legend_items = []
    for n, d in apt["nearby"][:4]:
        legend_items.append(f"      <div><span>{n}</span><span>{d}</span></div>")
    apt_map["map_legend"] = "\n".join(legend_items)

    # === Galerie coverflow : infos brutes pour le JS ===
    apt_map["photo_dir"] = apt["dir"]
    apt_map["total_photos_padded"] = f'{apt["photos"]:02d}'
    # Version de cache-bust par apart (aligné avec les photos effectivement remplacées)
    PHOTO_VERSIONS = {
        "02-commodore": "c1",   # N°02 — replaced 2026-04-18
        "05-adagio":    "d1",   # N°07 appart design — replaced 2026-04-18
        "06-scherzo":   "e3",   # N°05 ultra design — replaced 2026-04-18 (+ swap hero)
    }
    apt_map["photo_version"] = PHOTO_VERSIONS.get(apt["dir"], "")

    html = TPL.format(**apt_map)
    out = os.path.join(SITE, f'sejour-{apt["no"]}.html')
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    sys.stdout.write(f'OK sejour-{apt["no"]}.html - {apt["name"]}\n')

sys.stdout.write("Done.\n")
