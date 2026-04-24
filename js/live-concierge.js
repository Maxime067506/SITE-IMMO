/* ============================================================
   Delfosse Properties — Live Concierge Band (FR / EN)
   ------------------------------------------------------------
   Bande « Aujourd'hui à Nice » / « Today in Nice » injectée
   en haut de l'espace privé. Quatre signaux temps réel +
   un moment du jour curé, traduits FR/EN.

     • Météo / Weather           (Open-Meteo forecast)
     • Coucher soleil / Sunset    (Open-Meteo daily)
     • Mer / Sea                  (Open-Meteo marine)
     • Moment du jour / Today's moment (20 moments, FR + EN)

   API Open-Meteo — gratuit, sans clé, CORS ok.
   Fallback dégradé si l'API ne répond pas.

   Déclencheurs de rendu :
     • Init au chargement
     • Re-render toutes les 5 min (countdown + bascule moment)
     • Re-render sur changement de langue (MutationObserver
       sur <html lang>)

   Animation :
     • Cellules : stagger fade+rise à l'entrée
     • Chiffres : count-up tween (0 → valeur) en 900 ms
     • Glyphs : micro-motion (soleil rotation lente, vagues
       qui ondulent, lune halo qui respire)
     • Dot bronze clignotant sur le countdown sunset
   ============================================================ */
(function(){
  'use strict';

  const NICE = { lat: 43.7031, lon: 7.2661, tz: 'Europe/Paris' };

  /* ============================================================
     i18n helpers
     ============================================================ */
  function currentLang(){
    const htmlLang = document.documentElement.lang;
    if (htmlLang && (htmlLang === 'fr' || htmlLang === 'en')) return htmlLang;
    if (window.DP_I18N && typeof window.DP_I18N.lang === 'function') return window.DP_I18N.lang();
    return 'fr';
  }
  function tx(obj){
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    return obj[currentLang()] || obj.fr || obj.en || '';
  }

  const UI = {
    fr: {
      eyebrow:       "Aujourd'hui à Nice",
      title:         'Votre <em style="color:var(--accent)">concierge</em> du jour.',
      metLabel:      'Météo',
      sunLabel:      'Coucher du soleil',
      seaLabel:      'Mer Méditerranée',
      momentEyebrow: 'Le moment idéal',
      waveLabel:     (v) => `Houle ${v}\u00a0m`,
      feelsLike:     (v) => `ressenti ${v}°`,
      uv:            (v) => `UV ${v}`,
      countdownIn:   (s) => `dans ${s}`,
      countdownPast: 'passé',
      countdownMin:  'min',
      countdownH:    'h',
      noData:        'Données indisponibles',
      weather: {
        sunny:   'Ensoleillé',
        clear:   'Ciel dégagé',
        partly:  'Partiellement nuageux',
        cloudy:  'Couvert',
        fog:     'Brouillard',
        drizzle: 'Bruine',
        rain:    'Pluie',
        snow:    'Neige',
        showers: 'Averses',
        storm:   'Orage',
        generic: 'Météo',
      },
      mapsApple: 'Plans',
      mapsGoogle: 'Maps',
      mapsWaze: 'Waze',
    },
    en: {
      eyebrow:       'Today in Nice',
      title:         'Your <em style="color:var(--accent)">concierge</em> for today.',
      metLabel:      'Weather',
      sunLabel:      'Sunset',
      seaLabel:      'Mediterranean Sea',
      momentEyebrow: 'The right moment',
      waveLabel:     (v) => `Swell ${v}\u00a0m`,
      feelsLike:     (v) => `feels ${v}°`,
      uv:            (v) => `UV ${v}`,
      countdownIn:   (s) => `in ${s}`,
      countdownPast: 'past',
      countdownMin:  'min',
      countdownH:    'h',
      noData:        'No data available',
      weather: {
        sunny:   'Sunny',
        clear:   'Clear sky',
        partly:  'Partly cloudy',
        cloudy:  'Overcast',
        fog:     'Fog',
        drizzle: 'Drizzle',
        rain:    'Rain',
        snow:    'Snow',
        showers: 'Showers',
        storm:   'Thunderstorm',
        generic: 'Weather',
      },
      mapsApple: 'Plans',
      mapsGoogle: 'Maps',
      mapsWaze: 'Waze',
    },
  };
  function L(){ return UI[currentLang()] || UI.fr; }

  /* ============================================================
     20 moments curés (FR + EN)
     ============================================================ */
  const MOMENTS = [
    // ====== MATIN (7-10h) ======
    {
      id: 'morning-boulangerie',
      title: { fr: 'Un café, un pain frais', en: 'Coffee and a fresh loaf' },
      body:  {
        fr: "Maison Jean-Marc Bordonnat — les viennoiseries feuilletées à la main, à cinq minutes à pied.",
        en: "Maison Jean-Marc Bordonnat — hand-folded pastries, a five-minute walk away.",
      },
      emoji: '🥐',
      trigger: { hours: [6, 10] },
      place: { name: 'Maison Jean-Marc Bordonnat', ll: [43.6995, 7.2720], addr: '7 rue Lépante, Nice' },
      weight: 3,
    },
    {
      id: 'morning-marche-saleya',
      title: { fr: "Le Cours Saleya à l'ouverture", en: 'Cours Saleya at first light' },
      body:  {
        fr: "Les maraîchers déballent à 6h, les fleurs arrivent à 8h. Avant 10h vous l'avez pour vous.",
        en: "Growers arrive at 6am, flowers at 8am. Before 10am, the market is yours.",
      },
      emoji: '🌸',
      trigger: { hours: [6, 10], days: [2, 3, 4, 5, 6, 0] },
      place: { name: 'Cours Saleya', ll: [43.6950, 7.2745], addr: 'Cours Saleya, Nice' },
      weight: 4,
    },
    {
      id: 'monday-brocante-saleya',
      title: { fr: 'Brocante du Cours Saleya', en: 'Cours Saleya antiques market' },
      body:  {
        fr: "Chaque lundi, les antiquaires remplacent les maraîchers. Chine, faïences, vieilles affiches.",
        en: "Every Monday the antique dealers take over from the growers. Bric-à-brac, pottery, vintage posters.",
      },
      emoji: '🏺',
      trigger: { hours: [7, 17], days: [1] },
      place: { name: 'Cours Saleya', ll: [43.6950, 7.2745], addr: 'Cours Saleya, Nice' },
      weight: 5,
    },

    // ====== FIN DE MATINÉE (10-12h) ======
    {
      id: 'late-morning-promenade',
      title: { fr: 'La Promenade des Anglais', en: 'The Promenade des Anglais' },
      body:  {
        fr: "Avant la foule, avant le vent d'après-midi. De la Villa Masséna au Negresco, tout le mythe.",
        en: "Before the crowds, before the afternoon breeze. From Villa Masséna to the Negresco — pure Riviera.",
      },
      emoji: '🌊',
      trigger: { hours: [9, 12] },
      place: { name: 'Villa Masséna', ll: [43.6938, 7.2590], addr: '65 rue de France, Nice' },
      weight: 2,
    },
    {
      id: 'late-morning-castle-hill',
      title: { fr: 'Monter à la Colline du Château', en: 'Climb Castle Hill' },
      body:  {
        fr: "Cent cinquante marches ou l'ascenseur gratuit. La cascade, l'orangerie, et le plus beau panorama de la ville.",
        en: "A hundred and fifty steps — or the free elevator. The waterfall, the orange grove, and the finest view in town.",
      },
      emoji: '🏰',
      trigger: { hours: [10, 17] },
      place: { name: 'Colline du Château', ll: [43.6956, 7.2800], addr: 'Montée Eberlé, Nice' },
      weight: 3,
    },

    // ====== MIDI (12-14h) ======
    {
      id: 'noon-socca',
      title: { fr: 'La socca chez Pipo', en: 'Socca at Chez Pipo' },
      body:  {
        fr: "La socca au feu de bois — la plus ancienne de Nice. On commande au comptoir, on mange debout, on y retourne.",
        en: "Wood-fired socca — the oldest recipe in Nice. Order at the bar, eat standing, come back for more.",
      },
      emoji: '🥞',
      trigger: { hours: [11, 14] },
      place: { name: 'Chez Pipo', ll: [43.6983, 7.2804], addr: '13 rue Bavastro, Nice' },
      weight: 4,
    },
    {
      id: 'noon-rossetti',
      title: { fr: 'Glace Place Rossetti', en: 'Ice cream on Place Rossetti' },
      body:  {
        fr: "Fenocchio ou Azzurro — l'éternel débat niçois. Le pamplemousse rose et la violette tranchent les deux camps.",
        en: "Fenocchio or Azzurro — the eternal Nice debate. Pink grapefruit and violet settle both camps.",
      },
      emoji: '🍨',
      trigger: { hours: [12, 18], months: [4, 5, 6, 7, 8, 9, 10] },
      place: { name: 'Place Rossetti', ll: [43.6979, 7.2766], addr: 'Place Rossetti, Nice' },
      weight: 3,
    },

    // ====== APRÈS-MIDI (14-17h) ======
    {
      id: 'afternoon-mamac',
      title: { fr: 'MAMAC — art moderne', en: 'MAMAC — modern art' },
      body:  {
        fr: "Arman, Klein, Niki de Saint Phalle. Entrée gratuite avec la Carte Musées ou 10 € à l'unité. Fermé le lundi.",
        en: "Arman, Klein, Niki de Saint Phalle. Free with the Museum Pass, or €10 single ticket. Closed Mondays.",
      },
      emoji: '🎨',
      trigger: { hours: [11, 18], days: [2, 3, 4, 5, 6, 0] },
      place: { name: 'MAMAC', ll: [43.7041, 7.2774], addr: 'Place Yves Klein, Nice' },
      weight: 3,
    },
    {
      id: 'afternoon-matisse',
      title: { fr: 'Musée Matisse', en: 'Matisse Museum' },
      body:  {
        fr: "Dans une villa génoise du parc des Arènes de Cimiez. Fermé le mardi. Après, les ruines romaines à côté.",
        en: "Set in a Genoese villa at the Cimiez arena park. Closed Tuesdays. The Roman ruins are right next door.",
      },
      emoji: '🖼',
      trigger: { hours: [10, 17], days: [3, 4, 5, 6, 0, 1] },
      place: { name: 'Musée Matisse', ll: [43.7220, 7.2760], addr: '164 av. des Arènes de Cimiez, Nice' },
      weight: 2,
    },
    {
      id: 'afternoon-beach-summer',
      title: { fr: 'Cap sur la plage', en: 'Head for the beach' },
      body:  {
        fr: "Plage publique Blue Beach à 200 m du Negresco, ou transat au Beau Rivage pour la journée.",
        en: "Free Blue Beach 200 m from the Negresco, or a sunbed at Beau Rivage for the day.",
      },
      emoji: '🏖',
      trigger: { hours: [12, 18], months: [5, 6, 7, 8, 9] },
      place: { name: 'Plage Blue Beach', ll: [43.6908, 7.2609], addr: '32 Prom. des Anglais, Nice' },
      weight: 5,
    },

    // ====== FIN D'APRÈS-MIDI (17-19h) ======
    {
      id: 'late-afternoon-mont-boron',
      title: { fr: 'Tour du Mont Boron', en: 'Mont Boron loop' },
      body:  {
        fr: "La boucle de 3 km sur les hauteurs. La vue bascule entre la baie de Nice et la rade de Villefranche.",
        en: "A 3 km loop on the heights. The view swings between the Bay of Nice and the Villefranche harbour.",
      },
      emoji: '🌲',
      trigger: { hours: [15, 19] },
      place: { name: 'Parc du Mont Boron', ll: [43.6960, 7.3070], addr: 'Route Forestière du Mont Boron, Nice' },
      weight: 3,
    },

    // ====== COUCHER DE SOLEIL (sunset ±90 min) ======
    {
      id: 'sunset-castle',
      title: { fr: 'Coucher de soleil au Château', en: 'Sunset at Castle Hill' },
      body:  {
        fr: "De la plateforme sommitale, la baie se pose dans l'or. Montez trente minutes avant l'heure exacte.",
        en: "From the top terrace, the bay sinks into gold. Head up thirty minutes before the exact time.",
      },
      emoji: '🌅',
      trigger: { custom: 'sunset' },
      place: { name: 'Colline du Château', ll: [43.6956, 7.2800], addr: 'Montée Eberlé, Nice' },
      weight: 10,
    },
    {
      id: 'sunset-plaza-rooftop',
      title: { fr: 'Rooftop du Plaza au coucher', en: 'Plaza rooftop at sundown' },
      body:  {
        fr: "Le toit-terrasse du Boscolo Plaza — cocktail face à la mer, lumière rose sur la Promenade.",
        en: "The Boscolo Plaza rooftop — a cocktail facing the sea, pink light on the Promenade.",
      },
      emoji: '🍸',
      trigger: { custom: 'sunset', months: [4, 5, 6, 7, 8, 9, 10] },
      place: { name: 'Boscolo Plaza Rooftop', ll: [43.6962, 7.2721], addr: '12 av. de Verdun, Nice' },
      weight: 8,
    },

    // ====== SOIR (19-22h) ======
    {
      id: 'evening-vieux-nice',
      title: { fr: 'Dîner dans le Vieux-Nice', en: 'Dinner in Vieux-Nice' },
      body:  {
        fr: "Entre la Place Garibaldi et le port, les tables s'installent dans les ruelles. Essayer Peixes, 42 rue de l'Abbaye.",
        en: "Between Place Garibaldi and the harbour, tables spill into the alleys. Try Peixes, 42 rue de l'Abbaye.",
      },
      emoji: '🍽',
      trigger: { hours: [19, 22] },
      place: { name: 'Peixes', ll: [43.7003, 7.2771], addr: '42 rue de l\'Abbaye, Nice' },
      weight: 4,
    },
    {
      id: 'evening-negresco',
      title: { fr: 'Apéro au Negresco', en: 'Drinks at the Negresco' },
      body:  {
        fr: "Pour une coupe dans le bar Relais — le salon Louis XIV, les tableaux. On s'y sent dans un film des années soixante.",
        en: "A glass at the Relais bar — the Louis XIV lounge, the paintings. Step inside a sixties film.",
      },
      emoji: '🥂',
      trigger: { hours: [18, 22] },
      place: { name: 'Hôtel Negresco — Bar Relais', ll: [43.6945, 7.2582], addr: '37 Prom. des Anglais, Nice' },
      weight: 3,
    },

    // ====== TARD LE SOIR (22h+) ======
    {
      id: 'late-night-bulldog',
      title: { fr: 'Un dernier verre', en: 'One last drink' },
      body:  {
        fr: "Le Bulldog rue Saint-Joseph pour un cocktail fait avec soin, ou Ma Nolan's pour l'ambiance.",
        en: "Le Bulldog on rue Saint-Joseph for a careful cocktail, or Ma Nolan's for the atmosphere.",
      },
      emoji: '🍷',
      trigger: { hours: [21, 26] },
      place: { name: 'Le Bulldog Pub', ll: [43.6984, 7.2768], addr: '9 rue Saint-Joseph, Nice' },
      weight: 3,
    },

    // ====== HIVER — déc + début janvier ======
    {
      id: 'winter-christmas-village',
      title: { fr: 'Village de Noël Place Masséna', en: 'Christmas Village on Place Masséna' },
      body:  {
        fr: "Entre fin novembre et le premier janvier. Chalets, chocolat chaud, grande roue, patinoire éphémère.",
        en: "Late November through New Year. Wooden chalets, hot chocolate, a Ferris wheel, a pop-up ice rink.",
      },
      emoji: '🎄',
      trigger: { hours: [11, 22], months: [12, 1], day_max: 5 },
      place: { name: 'Place Masséna', ll: [43.6968, 7.2711], addr: 'Place Masséna, Nice' },
      weight: 9,
    },

    // ====== FÉVRIER — Carnaval ======
    {
      id: 'carnival',
      title: { fr: 'Carnaval de Nice', en: 'Nice Carnival' },
      body:  {
        fr: "Mi-février à début mars. Défilés de chars le week-end, batailles de fleurs sur la Promenade. Incontournable si vous passez ces jours-là.",
        en: "Mid-February to early March. Float parades on weekends, flower battles on the Promenade. Unmissable if you're here.",
      },
      emoji: '🎭',
      trigger: { hours: [10, 23], months: [2] },
      place: { name: 'Place Masséna', ll: [43.6968, 7.2711], addr: 'Place Masséna, Nice' },
      weight: 10,
    },

    // ====== WEEK-END ======
    {
      id: 'weekend-brunch',
      title: { fr: 'Brunch du week-end', en: 'Weekend brunch' },
      body:  {
        fr: "Les Distilleries Idéales, place Charles Félix — l'heure du brunch commence à 10h, comptez 30 min d'attente.",
        en: "Les Distilleries Idéales on Place Charles Félix — brunch starts at 10am, expect a thirty-minute wait.",
      },
      emoji: '🥞',
      trigger: { hours: [9, 12], days: [0, 6] },
      place: { name: 'Distilleries Idéales', ll: [43.6954, 7.2759], addr: '24 rue de la Préfecture, Nice' },
      weight: 6,
    },

    // ====== FALLBACK ======
    {
      id: 'fallback-generic',
      title: { fr: 'Flâner sans itinéraire', en: 'Wander without a plan' },
      body:  {
        fr: "Prenez l'av. Jean Médecin vers le sud, tournez à gauche dans la première ruelle qui vous attire. C'est comme ça qu'on rencontre Nice.",
        en: "Head south down Jean Médecin, then turn left into the first alley that catches your eye. That's how you meet Nice.",
      },
      emoji: '🚶',
      trigger: { hours: [0, 24] },
      weight: 1,
    },
  ];

  /* ============================================================
     API fetchers
     ============================================================ */
  async function fetchWeather(){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${NICE.lat}&longitude=${NICE.lon}` +
      `&current=temperature_2m,apparent_temperature,is_day,weather_code,relative_humidity_2m,wind_speed_10m` +
      `&daily=sunrise,sunset,uv_index_max` +
      `&timezone=${encodeURIComponent(NICE.tz)}`;
    const r = await fetch(url, { cache:'no-cache' });
    if (!r.ok) throw new Error('weather http '+r.status);
    return r.json();
  }
  async function fetchMarine(){
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${NICE.lat}&longitude=${NICE.lon}` +
      `&current=sea_surface_temperature,wave_height` +
      `&timezone=${encodeURIComponent(NICE.tz)}`;
    try {
      const r = await fetch(url, { cache:'no-cache' });
      if (!r.ok) return null;
      return await r.json();
    } catch (e){ return null; }
  }

  /* ============================================================
     Icônes SVG bronze monochromes
     ============================================================ */
  const SVG_ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"';
  const SVG = {
    sun:      `<svg ${SVG_ATTRS} class="lc-svg lc-svg--sun"><g class="lc-rays"><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></g><circle cx="12" cy="12" r="4.2"/></svg>`,
    moon:     `<svg ${SVG_ATTRS} class="lc-svg lc-svg--moon"><path d="M20 14.5A8 8 0 0 1 9.5 4a.5.5 0 0 0-.7-.5A9 9 0 1 0 20.5 15.2a.5.5 0 0 0-.5-.7z"/></svg>`,
    cloudSun: `<svg ${SVG_ATTRS} class="lc-svg"><circle cx="7" cy="7" r="2.2"/><path d="M7 1.5v1.6M1.5 7h1.6M11 3l-1.2 1.2M3.8 3.8l1.2 1.2M2 13.5h1.5"/><path d="M17 20h-8a4 4 0 1 1 .8-7.9A5 5 0 0 1 19 14a3 3 0 0 1-2 6z"/></svg>`,
    cloud:    `<svg ${SVG_ATTRS} class="lc-svg"><path d="M17 20h-8a4 4 0 1 1 .8-7.9A5 5 0 0 1 19 14a3 3 0 0 1-2 6z"/></svg>`,
    cloudFog: `<svg ${SVG_ATTRS} class="lc-svg"><path d="M17 14h-8a4 4 0 1 1 .8-7.9A5 5 0 0 1 19 8a3 3 0 0 1-2 6z"/><path d="M3 18h18M5 22h14"/></svg>`,
    rain:     `<svg ${SVG_ATTRS} class="lc-svg lc-svg--rain"><path d="M17 14h-8a4 4 0 1 1 .8-7.9A5 5 0 0 1 19 8a3 3 0 0 1-2 6z"/><path d="M8 18l-1 3M13 18l-1 3M18 18l-1 3"/></svg>`,
    snow:     `<svg ${SVG_ATTRS} class="lc-svg"><path d="M17 12h-8a4 4 0 1 1 .8-7.9A5 5 0 0 1 19 6a3 3 0 0 1-2 6z"/><path d="M8 17v4M6 19h4M13 17v4M11 19h4M18 17v4M16 19h4"/></svg>`,
    storm:    `<svg ${SVG_ATTRS} class="lc-svg"><path d="M17 12h-8a4 4 0 1 1 .8-7.9A5 5 0 0 1 19 6a3 3 0 0 1-2 6z"/><path d="M12 15l-3 5h3l-1 3 3-5h-3l1-3z" fill="currentColor"/></svg>`,
    sunset:   `<svg ${SVG_ATTRS} class="lc-svg lc-svg--sunset"><circle cx="12" cy="14" r="4.2"/><g class="lc-rays"><path d="M12 4v2M4.8 8.8l1.4 1.4M17.8 10.2l1.4-1.4M2 14h2M20 14h2"/></g><path d="M2 20h20M8 20l-2 2M18 22l-2-2"/></svg>`,
    wave:     `<svg ${SVG_ATTRS} class="lc-svg lc-svg--wave"><g class="lc-wave-g"><path d="M2 8c2 0 2-2 5-2s3 2 5 2 3-2 5-2 3 2 5 2"/><path d="M2 14c2 0 2-2 5-2s3 2 5 2 3-2 5-2 3 2 5 2"/><path d="M2 20c2 0 2-2 5-2s3 2 5 2 3-2 5-2 3 2 5 2"/></g></svg>`,
  };
  function weatherGlyph(code, isDay){
    const d = !!isDay;
    const w = L().weather;
    if (code === 0)       return { svg: d ? SVG.sun      : SVG.moon, label: d ? w.sunny : w.clear };
    if (code <= 2)        return { svg: d ? SVG.cloudSun : SVG.moon, label: w.partly };
    if (code === 3)       return { svg: SVG.cloud,                   label: w.cloudy };
    if (code >= 45 && code <= 48) return { svg: SVG.cloudFog, label: w.fog };
    if (code >= 51 && code <= 57) return { svg: SVG.rain,     label: w.drizzle };
    if (code >= 61 && code <= 67) return { svg: SVG.rain,     label: w.rain };
    if (code >= 71 && code <= 77) return { svg: SVG.snow,     label: w.snow };
    if (code >= 80 && code <= 86) return { svg: SVG.rain,     label: w.showers };
    if (code >= 95)               return { svg: SVG.storm,    label: w.storm };
    return { svg: SVG.cloud, label: w.generic };
  }

  /* ============================================================
     Sélection du moment
     ============================================================ */
  function scoreMoment(m, ctx){
    const t = m.trigger || {};
    let score = m.weight || 1;
    if (t.hours){
      const [h0, h1] = t.hours;
      const h = ctx.hour + (ctx.hour < 3 ? 24 : 0);
      if (!(h >= h0 && h < h1)) return 0;
    }
    if (t.custom === 'sunset'){
      if (!ctx.sunsetDate) return 0;
      const diffMin = (ctx.sunsetDate - ctx.now) / 60000;
      if (!(diffMin <= 90 && diffMin >= -30)) return 0;
      score += 6;
    }
    if (t.days && !t.days.includes(ctx.dayOfWeek)) return 0;
    if (t.months && !t.months.includes(ctx.month)) return 0;
    if (typeof t.day_max === 'number' && ctx.dayOfMonth > t.day_max) return 0;
    return score;
  }
  function selectMoment(ctx){
    let best = null, bestScore = 0;
    for (const m of MOMENTS){
      const s = scoreMoment(m, ctx);
      if (s > bestScore){ bestScore = s; best = m; }
    }
    return best || MOMENTS[MOMENTS.length-1];
  }

  /* ============================================================
     Maps deep-links
     ============================================================ */
  function mapsUrls(place){
    const q = encodeURIComponent(place.addr || place.name);
    const ll = place.ll ? `${place.ll[0]},${place.ll[1]}` : null;
    return {
      apple:  `https://maps.apple.com/?q=${q}` + (ll ? `&ll=${ll}` : ''),
      google: `https://www.google.com/maps/search/?api=1&query=${ll || q}`,
      waze:   ll ? `https://waze.com/ul?ll=${ll}&navigate=yes` : `https://waze.com/ul?q=${q}&navigate=yes`,
    };
  }

  /* ============================================================
     Formatage / countdown
     ============================================================ */
  function pad2(n){ return String(n).padStart(2, '0'); }
  function fmtTime(d){
    return currentLang() === 'en'
      ? `${d.getHours()}:${pad2(d.getMinutes())}`
      : `${pad2(d.getHours())}h${pad2(d.getMinutes())}`;
  }
  function fmtCountdown(ms){
    const loc = L();
    if (ms <= 0) return loc.countdownPast;
    const m = Math.round(ms / 60000);
    let text;
    if (m < 60) text = `${m} ${loc.countdownMin}`;
    else {
      const h = Math.floor(m / 60), mm = m % 60;
      text = `${h}${loc.countdownH}${mm ? ' ' + mm + ' ' + loc.countdownMin : ''}`;
    }
    return loc.countdownIn(text);
  }

  /* ============================================================
     Number tween (count-up)
     ============================================================ */
  function tweenNumber(el, from, to, dur){
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce){ el.textContent = String(Math.round(to)); return; }
    const start = performance.now();
    const ease = (x) => 1 - Math.pow(1 - x, 3);
    function tick(now){
      const t = Math.min(1, (now - start) / dur);
      const v = from + (to - from) * ease(t);
      el.textContent = String(Math.round(v));
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ============================================================
     RENDER
     ============================================================ */
  function render(section, data){
    const { weather, marine, moment, now } = data;
    const cur = weather && weather.current;
    const daily = weather && weather.daily;
    const loc = L();

    let metCell = `<div class="lc-cell lc-cell--met lc-cell--skeleton"></div>`;
    let sunCell = `<div class="lc-cell lc-cell--sun lc-cell--skeleton"></div>`;
    let seaCell = `<div class="lc-cell lc-cell--sea lc-cell--skeleton"></div>`;
    let metTarget = null, sunTarget = null, seaTarget = null;
    let sunsetDate = null;

    if (cur){
      const g = weatherGlyph(cur.weather_code, cur.is_day);
      const temp = Math.round(cur.temperature_2m);
      const feels = Math.round(cur.apparent_temperature);
      metCell = `
      <div class="lc-cell lc-cell--met">
        <span class="lc-cell-label">${loc.metLabel}</span>
        <div class="lc-cell-main">
          <span class="lc-glyph" aria-hidden="true">${g.svg}</span>
          <span class="lc-temp"><span class="lc-temp-num">0</span><span class="lc-deg">°</span></span>
        </div>
        <div class="lc-cell-sub">${g.label}${feels !== temp ? ` · ${loc.feelsLike(feels)}` : ''}</div>
      </div>`;
      metTarget = temp;
    }

    if (daily && daily.sunset && daily.sunset[0]){
      sunsetDate = new Date(daily.sunset[0]);
      const uv = daily.uv_index_max ? Math.round(daily.uv_index_max[0]) : null;
      const countdown = fmtCountdown(sunsetDate - now);
      sunCell = `
      <div class="lc-cell lc-cell--sun">
        <span class="lc-cell-label">${loc.sunLabel}</span>
        <div class="lc-cell-main">
          <span class="lc-glyph" aria-hidden="true">${SVG.sunset}</span>
          <span class="lc-time">${fmtTime(sunsetDate)}</span>
        </div>
        <div class="lc-cell-sub"><span class="lc-countdown"><span class="lc-countdown-dot" aria-hidden="true"></span>${countdown}</span>${uv ? ` · ${loc.uv(uv)}` : ''}</div>
      </div>`;
    }

    if (marine && marine.current){
      const mc = marine.current;
      const sst = mc.sea_surface_temperature != null ? Math.round(mc.sea_surface_temperature) : null;
      const wave = mc.wave_height != null ? mc.wave_height.toFixed(1).replace('.', ',') : null;
      seaCell = `
      <div class="lc-cell lc-cell--sea">
        <span class="lc-cell-label">${loc.seaLabel}</span>
        <div class="lc-cell-main">
          <span class="lc-glyph" aria-hidden="true">${SVG.wave}</span>
          <span class="lc-temp"><span class="lc-temp-num">0</span><span class="lc-deg">°</span></span>
        </div>
        <div class="lc-cell-sub">${wave != null ? loc.waveLabel(wave) : loc.noData}</div>
      </div>`;
      seaTarget = sst;
    }

    const mapsCta = moment.place ? (() => {
      const u = mapsUrls(moment.place);
      return `
      <div class="lc-moment-cta">
        <a class="lc-maps lc-maps--apple"  href="${u.apple}"  target="_blank" rel="noopener">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s-7-7-7-13a7 7 0 1 1 14 0c0 6-7 13-7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>
          <span>${loc.mapsApple}</span>
        </a>
        <a class="lc-maps lc-maps--google" href="${u.google}" target="_blank" rel="noopener">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s-7-7-7-13a7 7 0 1 1 14 0c0 6-7 13-7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>
          <span>${loc.mapsGoogle}</span>
        </a>
        <a class="lc-maps lc-maps--waze"   href="${u.waze}"   target="_blank" rel="noopener">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="11" r="8"/><path d="M9 10v1M15 10v1M9 15c1 1 2 1.5 3 1.5s2-.5 3-1.5"/><path d="M8 20l-1 2M16 20l1 2"/></svg>
          <span>${loc.mapsWaze}</span>
        </a>
      </div>`;
    })() : '';

    const momentBlock = `
    <div class="lc-moment">
      <div class="lc-moment-head">
        <p class="lc-moment-eyebrow">${loc.momentEyebrow}</p>
        ${moment.emoji ? `<span class="lc-moment-emoji" aria-hidden="true">${moment.emoji}</span>` : ''}
      </div>
      <h3 class="lc-moment-title">${tx(moment.title)}</h3>
      <p class="lc-moment-body">${tx(moment.body)}</p>
      ${mapsCta}
    </div>`;

    section.innerHTML = `
      <header class="lc-head">
        <p class="eyebrow light"><span class="eyebrow-num">01</span> <span>${loc.eyebrow}</span></p>
        <h2 class="h-display" style="color:var(--bg)">${loc.title}</h2>
      </header>
      <div class="lc-grid">
        ${metCell}
        ${sunCell}
        ${seaCell}
        ${momentBlock}
      </div>
    `;

    // Count-up tweens (cible .lc-temp-num, évite de toucher au span ° adjacent)
    const metNumEl = section.querySelector('.lc-cell--met .lc-temp-num');
    if (metNumEl && metTarget != null) tweenNumber(metNumEl, 0, metTarget, 900);
    const seaNumEl = section.querySelector('.lc-cell--sea .lc-temp-num');
    if (seaNumEl && seaTarget != null) tweenNumber(seaNumEl, 0, seaTarget, 900);
  }

  /* ============================================================
     INIT publique
     ============================================================ */
  async function initLiveConcierge(){
    const section = document.getElementById('liveConcierge');
    if (!section) return;

    // Skeleton
    section.innerHTML = `
      <header class="lc-head">
        <p class="eyebrow light"><span class="eyebrow-num">01</span> <span>${L().eyebrow}</span></p>
        <h2 class="h-display" style="color:var(--bg)">${L().title}</h2>
      </header>
      <div class="lc-grid">
        <div class="lc-cell lc-cell--skeleton"></div>
        <div class="lc-cell lc-cell--skeleton"></div>
        <div class="lc-cell lc-cell--skeleton"></div>
        <div class="lc-moment lc-cell--skeleton"></div>
      </div>`;

    let weather = null, marine = null;
    try { weather = await fetchWeather(); } catch (e){ console.warn('[lc] weather', e); }
    try { marine  = await fetchMarine();  } catch (e){ console.warn('[lc] marine',  e); }

    function rerender(){
      const now = new Date();
      const sunsetIso = weather && weather.daily && weather.daily.sunset && weather.daily.sunset[0];
      const sunsetDate = sunsetIso ? new Date(sunsetIso) : null;
      const ctx = {
        now,
        hour: now.getHours(),
        dayOfWeek: now.getDay(),
        dayOfMonth: now.getDate(),
        month: now.getMonth() + 1,
        sunsetDate,
      };
      const moment = selectMoment(ctx);
      render(section, { weather, marine, moment, now });
    }

    rerender();

    // Re-render toutes les 5 min
    setInterval(rerender, 5 * 60 * 1000);

    // Re-render sur changement de langue (observer <html lang>)
    const obs = new MutationObserver(() => rerender());
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  window.DelfosseLiveConcierge = { init: initLiveConcierge };
})();
