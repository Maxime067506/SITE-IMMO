/* ============================================================
   Delfosse Properties — Transit (Comment venir)
   Section dédiée APPT1 / APPT2 (5 rue Barla, Le Véronese).
   Deux onglets : Aéroport (T2) et Gare Nice-Ville (marche + T1).
   Trois étapes navigables : Attendez → Tramway → Marchez.
   Carte SVG animée + liste verticale d'arrêts.
   Style éditorial Delfosse : navy profond + or champagne.
   ============================================================ */
(function () {
  "use strict";

  const TRAM_GLYPH = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M7 4h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-1l1.4 2.4-.86.6L15 18.5h-6L7.46 21l-.86-.6L8 18H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v4h12V7a1 1 0 0 0-1-1H7zm-1 7v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2H6zm2 1.6a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8zm8 0a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8z"/></svg>';
  const WALK_GLYPH = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13" cy="4" r="2"/><path d="M9 20l1.5-5L8 12l1-4 4 1 3 4"/><path d="m13 16 3-1 2 4"/></svg>';
  const CLOCK_GLYPH = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
  const PLANE_GLYPH = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 16l20-7-9 13-2-7-9-1z"/></svg>';
  const TRAIN_GLYPH = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="14" rx="3"/><circle cx="8" cy="13" r="1.2" fill="currentColor"/><circle cx="16" cy="13" r="1.2" fill="currentColor"/><path d="M9 17l-2 4M15 17l2 4M5 9h14"/></svg>';
  const PIN_GLYPH = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 22s8-7.6 8-13a8 8 0 1 0-16 0c0 5.4 8 13 8 13zm0-10.7a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6z"/></svg>';

  /* L2 — 15 stations Aéroport T1 → Garibaldi/Le Château.
     Coordonnées GPS officielles extraites d'OpenStreetMap
     (relation Tram L2 : Aéroport T2 → Port Lympia, ref OSM 11087383)
     puis croppé au segment T1 → Garibaldi. */
  const L2_STATIONS = [
    { name: "Aéroport Terminal 1",                       lat: 43.66524, lng: 7.21081 },
    { name: "Grand Arénas",                              lat: 43.66994, lng: 7.21245 },
    { name: "Parc Phoenix",                              lat: 43.66938, lng: 7.21918 },
    { name: "Cassin / Kirchner",                         lat: 43.67224, lng: 7.22413 },
    { name: "Ferber",                                    lat: 43.67686, lng: 7.22839 },
    { name: "Carras",                                    lat: 43.68069, lng: 7.23065 },
    { name: "Sainte-Hélène",                             lat: 43.68359, lng: 7.23365 },
    { name: "Fabron",                                    lat: 43.68682, lng: 7.23715 },
    { name: "Magnan",                                    lat: 43.68954, lng: 7.24128 },
    { name: "Lenval Hôpital",                            lat: 43.69161, lng: 7.24576 },
    { name: "Centre Universitaire Méditerranéen",        lat: 43.69297, lng: 7.24951 },
    { name: "Alsace-Lorraine",                           lat: 43.69771, lng: 7.25695 },
    { name: "Jean Médecin",                              lat: 43.70004, lng: 7.26669 },
    { name: "Durandy",                                   lat: 43.70146, lng: 7.27230 },
    { name: "Garibaldi / Le Château",                    lat: 43.70024, lng: 7.28061 }
  ];
  const L2_STOPS = L2_STATIONS.map(s => s.name);

  /* L1 — segment Jean Médecin → Garibaldi (3 stations) */
  const L1_STATIONS = [
    { name: "Jean Médecin",            lat: 43.70004, lng: 7.26669 },
    { name: "Durandy",                 lat: 43.70146, lng: 7.27230 },
    { name: "Garibaldi / Le Château",  lat: 43.70024, lng: 7.28061 }
  ];
  const L1_STOPS = L1_STATIONS.map(s => s.name);

  /* Coordonnées de l'arrivée — Le Véronese, 5 rue Barla */
  const VERONESE = { lat: 43.70238, lng: 7.28148 };

  /* Tracé piéton Garibaldi → Le Véronese (5 rue Barla)
     Itinéraire direct d'environ 380 m, ~5 min :
     Garibaldi → Place Garibaldi (côté Nord) → rue Cassini → rue Barla → 5 rue Barla. */
  const WALK_GARIBALDI_VERONESE = [
    [43.70024, 7.28061],  // Arrêt tram Garibaldi / Le Château
    [43.70054, 7.28078],  // Place Garibaldi NE
    [43.70094, 7.28095],  // Bd Risso (entrée Cassini)
    [43.70140, 7.28108],  // Rue Cassini début
    [43.70180, 7.28125],  // Rue Cassini milieu
    [43.70210, 7.28140],  // Angle rue Barla
    [43.70238, 7.28148]   // 5 rue Barla — Le Véronese
  ];

  /* Tracé piéton Gare Nice-Ville → Jean Médecin (T1)
     Sortie sud de la gare, av. Thiers vers l'est, av. Jean Médecin vers le sud. */
  const WALK_NICEVILLE_JEAN_MEDECIN = [
    [43.70449, 7.26154],  // Gare de Nice-Ville (sortie sud)
    [43.70435, 7.26240],  // Av. Thiers
    [43.70420, 7.26340],  // Continuation Thiers
    [43.70395, 7.26460],  // Carrefour av. Jean Médecin
    [43.70300, 7.26535],  // Av. Jean Médecin sud
    [43.70180, 7.26605],  // Continuation
    [43.70080, 7.26645],  // Approche tram
    [43.70004, 7.26669]   // Arrêt tram Jean Médecin
  ];

  /* ----- Tracés réels OSM (relation Tram L2 / L1 — Lignes d'Azur) ----- */
  /* L2 polyline : 232 points GPS du tracé réel du tramway
     entre l'arrêt Aéroport Terminal 1 et Garibaldi/Le Château. */
  const L2_POLY = [[43.66527,7.21085],[43.66533,7.21133],[43.66536,7.21162],[43.66537,7.21168],[43.66539,7.21175],[43.6654,7.21177],[43.66542,7.21181],[43.66544,7.21182],[43.66545,7.21184],[43.66547,7.21186],[43.66549,7.21188],[43.66551,7.21189],[43.66553,7.21191],[43.66556,7.21192],[43.66558,7.21192],[43.6656,7.21192],[43.66562,7.21192],[43.66565,7.21192],[43.66567,7.21192],[43.66622,7.21179],[43.66651,7.21173],[43.66683,7.21166],[43.6679,7.21149],[43.66842,7.21141],[43.66851,7.2114],[43.66869,7.21138],[43.66926,7.21133],[43.66933,7.21132],[43.66939,7.21133],[43.66942,7.21133],[43.66944,7.21134],[43.66946,7.21135],[43.66949,7.21136],[43.66951,7.21138],[43.66953,7.2114],[43.66956,7.21143],[43.66958,7.21145],[43.66959,7.21148],[43.66961,7.21151],[43.66963,7.21156],[43.66968,7.2117],[43.66994,7.21238],[43.67013,7.21286],[43.67014,7.21291],[43.67015,7.21296],[43.67016,7.21301],[43.67016,7.21307],[43.67016,7.21314],[43.67015,7.21325],[43.67005,7.21397],[43.67001,7.21431],[43.66993,7.21498],[43.66991,7.21509],[43.6699,7.21523],[43.66986,7.2155],[43.66976,7.21633],[43.66973,7.21658],[43.66966,7.21711],[43.66964,7.21728],[43.66946,7.21874],[43.66941,7.21913],[43.66937,7.2195],[43.66936,7.21957],[43.66936,7.21963],[43.66936,7.21967],[43.66936,7.2197],[43.66936,7.21975],[43.66936,7.2198],[43.66937,7.21985],[43.66938,7.2199],[43.66939,7.21995],[43.66942,7.22005],[43.66944,7.22009],[43.66945,7.22013],[43.66948,7.22017],[43.66951,7.22023],[43.66961,7.22038],[43.67041,7.2215],[43.67046,7.22158],[43.67052,7.22167],[43.6715,7.22303],[43.67194,7.22365],[43.672,7.22373],[43.67205,7.22381],[43.67228,7.22412],[43.67252,7.22446],[43.67323,7.22546],[43.67328,7.22554],[43.67333,7.22561],[43.67354,7.22591],[43.67378,7.22623],[43.67393,7.22641],[43.67415,7.22665],[43.67419,7.2267],[43.67424,7.22674],[43.67449,7.22695],[43.67458,7.22702],[43.67468,7.22709],[43.67511,7.22733],[43.67523,7.22741],[43.67534,7.22747],[43.67541,7.22752],[43.6758,7.22774],[43.67609,7.2279],[43.67644,7.2281],[43.67665,7.22822],[43.6769,7.22836],[43.67715,7.2285],[43.67782,7.22888],[43.67792,7.22894],[43.67807,7.22901],[43.6783,7.22911],[43.67832,7.22912],[43.67842,7.22916],[43.67864,7.22927],[43.67882,7.22936],[43.67933,7.22965],[43.67964,7.22983],[43.6798,7.22992],[43.67998,7.23002],[43.68011,7.23012],[43.68027,7.23023],[43.68035,7.2303],[43.68046,7.23039],[43.68073,7.23063],[43.68096,7.23083],[43.6813,7.23114],[43.68143,7.23126],[43.6815,7.23133],[43.6816,7.23142],[43.6821,7.23188],[43.6822,7.23198],[43.68226,7.23205],[43.68232,7.23212],[43.68261,7.23247],[43.68302,7.23302],[43.68315,7.23317],[43.68326,7.23329],[43.68359,7.2336],[43.68386,7.23387],[43.68495,7.23494],[43.68532,7.23532],[43.68539,7.23539],[43.68546,7.23547],[43.68567,7.23571],[43.68639,7.23657],[43.68658,7.2368],[43.68682,7.2371],[43.6871,7.23745],[43.68717,7.23755],[43.68725,7.23766],[43.68798,7.23879],[43.68899,7.24036],[43.68904,7.24045],[43.68936,7.24095],[43.68954,7.24123],[43.68972,7.24152],[43.68978,7.24161],[43.68984,7.24171],[43.69006,7.24204],[43.69041,7.2426],[43.69047,7.24269],[43.69052,7.24277],[43.69056,7.24287],[43.69061,7.24298],[43.69088,7.24373],[43.69125,7.24474],[43.69129,7.24486],[43.6914,7.24512],[43.69147,7.24528],[43.69165,7.24578],[43.69179,7.24617],[43.69207,7.24692],[43.6925,7.24811],[43.69255,7.24826],[43.69259,7.24836],[43.6929,7.24923],[43.69301,7.24953],[43.69342,7.25064],[43.69405,7.25246],[43.69429,7.25315],[43.6944,7.25338],[43.69456,7.25366],[43.69476,7.25393],[43.69494,7.25411],[43.69508,7.25422],[43.69527,7.25434],[43.69645,7.2549],[43.69662,7.25502],[43.6968,7.2552],[43.69701,7.25543],[43.69719,7.25568],[43.69742,7.25608],[43.69752,7.25631],[43.69762,7.25663],[43.69771,7.257],[43.69782,7.25752],[43.69818,7.2591],[43.69872,7.26138],[43.69896,7.26239],[43.69904,7.26272],[43.6994,7.26437],[43.69959,7.26515],[43.69973,7.26569],[43.70007,7.26673],[43.70039,7.26769],[43.70098,7.26947],[43.70141,7.27082],[43.70143,7.27235],[43.70147,7.27382],[43.70148,7.27397],[43.70149,7.27409],[43.70151,7.2742],[43.70171,7.27512],[43.70174,7.27525],[43.70178,7.27537],[43.70209,7.27628],[43.70212,7.27642],[43.70215,7.27656],[43.70217,7.27673],[43.70218,7.27688],[43.70218,7.27756],[43.70218,7.27764],[43.70216,7.27772],[43.70183,7.27882],[43.7018,7.27888],[43.70162,7.27919],[43.70139,7.27956],[43.70131,7.27966],[43.70101,7.27998],[43.70093,7.28005],[43.70021,7.2806]];

  /* L1 polyline : 66 points GPS — segment Jean Médecin → Garibaldi/Le Château
     extrait de la relation OSM 7173149 (Tram L1 : Hôpital Pasteur → Henri Sappia). */
  const L1_POLY = [[43.7006,7.26803],[43.69985,7.26851],[43.69911,7.26897],[43.69881,7.26916],[43.69879,7.26918],[43.69837,7.26944],[43.69812,7.2696],[43.69804,7.26965],[43.69738,7.27007],[43.69735,7.27009],[43.69733,7.27011],[43.69729,7.27013],[43.69727,7.27014],[43.6969,7.27038],[43.69682,7.27044],[43.69677,7.2705],[43.69673,7.27057],[43.69672,7.2706],[43.69671,7.27064],[43.6967,7.27069],[43.69669,7.2708],[43.6967,7.27087],[43.69671,7.27093],[43.69672,7.27098],[43.69673,7.27103],[43.69712,7.27234],[43.69714,7.27241],[43.69719,7.27258],[43.69729,7.27295],[43.69739,7.27329],[43.6974,7.27331],[43.69766,7.27422],[43.69767,7.27426],[43.69768,7.27428],[43.69772,7.27444],[43.69774,7.27451],[43.6978,7.2747],[43.6979,7.27505],[43.69809,7.27568],[43.69816,7.27593],[43.69819,7.276],[43.69822,7.27607],[43.69825,7.27614],[43.69829,7.27623],[43.69845,7.27651],[43.69861,7.27682],[43.6987,7.27699],[43.69877,7.27708],[43.69887,7.27719],[43.69916,7.2775],[43.69935,7.27769],[43.69969,7.27804],[43.69992,7.27826],[43.7001,7.27843],[43.70021,7.27854],[43.70027,7.2786],[43.70041,7.27878],[43.70053,7.27897],[43.70066,7.27923],[43.70079,7.27948],[43.70096,7.27987],[43.70096,7.27988],[43.70099,7.27993],[43.70101,7.27997],[43.70107,7.28009],[43.70112,7.28019]];

  /* Tracés SVG fallback (utilisés si Leaflet absent) */
  const L2_PATH = "M 80 530 L 130 510 L 175 480 L 215 460 L 245 445 L 285 430 L 330 410 L 380 380 L 430 345 L 485 305 L 540 270 L 600 245 L 660 230 L 720 220 L 780 215 L 840 215 L 880 220 L 905 235 L 920 255";
  const L1_PATH = "M 480 320 L 540 295 L 620 265 L 720 235 L 820 220";

  /* Configuration par appartement.
     Override possible via user.transit dans la donnée chiffrée. */
  const LE_VERONESE = {
    label: { fr: "Le Véronese — 5 rue Barla", en: "Le Véronese — 5 rue Barla" },
    address: { fr: "5 rue Barla, 06300 Nice", en: "5 rue Barla, 06300 Nice" },
    airport: {
      wait: { line: "L2", stop: "Aéroport Terminal 1", direction: "Port Lympia", waitText: { fr: "≈ 1 min", en: "≈ 1 min" } },
      tram: { line: "L2", from: "Aéroport Terminal 1", to: "Garibaldi / Le Château", duration: 29 },
      walk: { from: "Garibaldi / Le Château", duration: 5, distanceM: 379 }
    },
    train: {
      walkPre: { from: { fr: "Gare de Nice-Ville", en: "Nice-Ville train station" }, to: "Jean Médecin", duration: 5, distanceM: 350 },
      wait: { line: "L1", stop: "Jean Médecin", direction: "Hôpital Pasteur", waitText: { fr: "≈ 2 min", en: "≈ 2 min" } },
      tram: { line: "L1", from: "Jean Médecin", to: "Garibaldi / Le Château", duration: 4 },
      walk: { from: "Garibaldi / Le Château", duration: 3, distanceM: 250 }
    }
  };
  const ROUTES = { "appt1": LE_VERONESE, "appt2": LE_VERONESE };

  /* ----- Petits utilitaires ----- */
  const lang = () => (window.DP_I18N && typeof DP_I18N.lang === "function" ? DP_I18N.lang() : "fr");
  const tx = v => (v == null ? "" : (typeof v === "string" ? v : v[lang()] || v.fr || v.en || ""));
  const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const fmtTime = d => d.getHours() + "h" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();

  const STRINGS = {
    fr: {
      tabAirport: "Depuis l'Aéroport",
      tabTrain: "Depuis Nice-Ville",
      stepWait: "Attendez à l'arrêt",
      stepTram: "Trajet en Tramway",
      stepWalk: "Marchez vers",
      stepWalkPre: "Marchez vers l'arrêt",
      stop: "Arrêt",
      direction: "Direction",
      duration: "min",
      address: "Adresse",
      stopsBetween: "arrêts intermédiaires",
      stopsBetween1: "arrêt intermédiaire",
      open: "Ouvrir",
      prev: "Précédent",
      next: "Suivant",
      lignesAzur: "Lignes d'Azur",
      foot: "À pied",
      towards: "Vers",
      mapsAlt: "Tracé du tramway sur la carte de Nice",
      from: "Depuis",
      to: "vers"
    },
    en: {
      tabAirport: "From the Airport",
      tabTrain: "From Nice-Ville",
      stepWait: "Wait at the stop",
      stepTram: "Tramway journey",
      stepWalk: "Walk to",
      stepWalkPre: "Walk to the stop",
      stop: "Stop",
      direction: "Direction",
      duration: "min",
      address: "Address",
      stopsBetween: "stops in between",
      stopsBetween1: "stop in between",
      open: "Open",
      prev: "Previous",
      next: "Next",
      lignesAzur: "Lignes d'Azur",
      foot: "On foot",
      towards: "Towards",
      mapsAlt: "Tramway route on the Nice map",
      from: "From",
      to: "to"
    }
  };
  const tt = k => (STRINGS[lang()] && STRINGS[lang()][k]) || STRINGS.fr[k] || k;

  /* ----- Sub-renderers ----- */
  function lineBadge(line) {
    return '<span class="dp-tr-line dp-tr-line-' + esc(line.toLowerCase()) + '">' + esc(line) + '</span>';
  }

  function renderStepNav(idx, total) {
    let dots = "";
    for (let i = 0; i < total; i++) {
      dots += '<span class="dp-tr-dot' + (i === idx ? " is-on" : "") + '"></span>';
    }
    return (
      '<nav class="dp-tr-stepnav">' +
        '<button class="dp-tr-nav-btn" data-act="prev"' + (idx === 0 ? ' disabled' : '') + ' aria-label="' + esc(tt("prev")) + '">' +
          '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>' +
          '<span>' + esc(tt("prev")) + '</span>' +
        '</button>' +
        '<span class="dp-tr-stepdots" aria-hidden="true">' + dots + '</span>' +
        '<button class="dp-tr-nav-btn" data-act="next"' + (idx === total - 1 ? ' disabled' : '') + ' aria-label="' + esc(tt("next")) + '">' +
          '<span>' + esc(tt("next")) + '</span>' +
          '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>' +
        '</button>' +
      '</nav>'
    );
  }

  /* renderMap — Leaflet container avec fallback SVG.
     Si Leaflet est chargé, mountLeafletMap() prend le relais et remplace
     le SVG par une vraie carte de Nice (CartoDB Dark Matter) avec arrêts
     épinglés et ligne tramway animée. */
  function renderMap(stops, pathD, lineId) {
    let dotsSvg = "";
    for (let i = 0; i < stops.length; i++) {
      dotsSvg += '<circle class="dp-tr-dotc" data-i="' + i + '" cx="0" cy="0" r="6" style="animation-delay:' + (300 + i * 70) + 'ms"></circle>';
    }
    const fallbackSvg =
      '<svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" class="dp-tr-map-svg" data-line="' + esc(lineId) + '" role="img">' +
        '<defs>' +
          '<linearGradient id="dpTrLand-' + esc(lineId) + '" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="rgba(212,183,126,.05)"/>' +
            '<stop offset="1" stop-color="rgba(12,26,43,.04)"/>' +
          '</linearGradient>' +
          '<linearGradient id="dpTrSea-' + esc(lineId) + '" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="rgba(31,68,109,.18)"/>' +
            '<stop offset="1" stop-color="rgba(12,26,43,.32)"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<rect width="1000" height="600" fill="url(#dpTrLand-' + esc(lineId) + ')"/>' +
        '<path d="M 0 540 Q 250 580 600 530 T 1000 540 L 1000 600 L 0 600 Z" fill="url(#dpTrSea-' + esc(lineId) + ')"/>' +
        '<path class="dp-tr-line-ghost" d="' + pathD + '" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity=".15"/>' +
        '<path class="dp-tr-line-draw" d="' + pathD + '" fill="none" stroke="currentColor" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<g class="dp-tr-mapdots">' + dotsSvg + '</g>' +
        '<g class="dp-tr-tram"><circle r="11" fill="currentColor"/><circle r="5" fill="#0C1A2B"/></g>' +
        '<g class="dp-tr-pin dp-tr-pin-start"><circle r="10" fill="#0C1A2B" stroke="currentColor" stroke-width="3"/></g>' +
        '<g class="dp-tr-pin dp-tr-pin-end"><circle r="14" fill="currentColor"/><circle r="6" fill="#0C1A2B"/></g>' +
      '</svg>';
    return (
      '<div class="dp-tr-map" aria-label="' + esc(tt("mapsAlt")) + '" data-line="' + esc(lineId) + '">' +
        '<div class="dp-tr-leaflet" data-line="' + esc(lineId) + '" aria-hidden="true"></div>' +
        '<div class="dp-tr-map-fallback">' + fallbackSvg + '</div>' +
      '</div>'
    );
  }

  function renderStopsList(stops, opts) {
    opts = opts || {};
    let html = '<ol class="dp-tr-stops" role="list">';
    stops.forEach((s, i) => {
      const first = i === 0;
      const last = i === stops.length - 1;
      let cls = "dp-tr-stop";
      if (first) cls += " is-start";
      if (last) cls += " is-end";
      let timeHTML = "";
      if (first && opts.startTime) timeHTML = '<span class="dp-tr-stop-time">' + esc(opts.startTime) + '</span>';
      if (last && opts.endTime) timeHTML = '<span class="dp-tr-stop-time">' + esc(opts.endTime) + '</span>';
      html +=
        '<li class="' + cls + '" style="animation-delay:' + (i * 50) + 'ms">' +
          '<span class="dp-tr-stop-marker"></span>' +
          '<div class="dp-tr-stop-body">' +
            '<div class="dp-tr-stop-name">' + esc(s) + '</div>' +
            '<div class="dp-tr-stop-meta">Nice</div>' +
          '</div>' +
          timeHTML +
        '</li>';
    });
    html += '</ol>';
    return html;
  }

  function renderWaitCard(w, idx, total) {
    return (
      '<article class="dp-tr-card" data-step="0">' +
        renderStepNav(idx, total) +
        '<header class="dp-tr-card-head">' +
          '<div class="dp-tr-time"><span class="dp-tr-time-ring">' + CLOCK_GLYPH + '</span><span class="dp-tr-time-val">—:—</span></div>' +
          '<h3 class="dp-tr-card-title">' + esc(tt("stepWait")) + '</h3>' +
          '<div class="dp-tr-card-eta">' + esc(tx(w.waitText)) + '</div>' +
        '</header>' +
        '<div class="dp-tr-card-body">' +
          '<div class="dp-tr-route">' +
            '<span class="dp-tr-pill">' + TRAM_GLYPH + '</span>' +
            lineBadge(w.line) +
            '<div class="dp-tr-route-stop">' +
              '<span class="dp-tr-meta-k">' + esc(tt("stop")) + '</span>' +
              '<span class="dp-tr-meta-v">' + esc(w.stop) + '</span>' +
              '<span class="dp-tr-meta-city">Nice</span>' +
            '</div>' +
          '</div>' +
          '<div class="dp-tr-passings">' +
            '<div class="dp-tr-pass"><span>' + esc(tt("towards")) + ' <strong>' + esc(w.direction) + '</strong></span><span class="dp-tr-pass-time dp-tr-pass-now">—:—</span></div>' +
            '<div class="dp-tr-pass"><span>' + esc(tt("towards")) + ' <strong>' + esc(w.direction) + '</strong></span><span class="dp-tr-pass-time dp-tr-pass-soon"><span class="dp-tr-soondot"></span><span class="dp-tr-pass-num">—:—</span></span></div>' +
            '<div class="dp-tr-pass"><span>' + esc(tt("towards")) + ' <strong>' + esc(w.direction) + '</strong></span><span class="dp-tr-pass-time">—:—</span></div>' +
          '</div>' +
          '<div class="dp-tr-foot">' + esc(tt("lignesAzur")) + '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function renderTramCard(t, idx, total) {
    const allStops = t.line === "L2" ? L2_STOPS : L1_STOPS;
    const iFrom = allStops.indexOf(t.from);
    const iTo = allStops.indexOf(t.to);
    const stops = allStops.slice(iFrom, iTo + 1);
    const pathD = t.line === "L2" ? L2_PATH : L1_PATH;
    const middleCount = Math.max(0, stops.length - 2);
    const middleLabel = middleCount === 1 ? tt("stopsBetween1") : tt("stopsBetween");
    return (
      '<article class="dp-tr-card dp-tr-card-tram" data-step="1" data-line="' + esc(t.line) + '">' +
        renderStepNav(idx, total) +
        '<header class="dp-tr-card-head">' +
          '<div class="dp-tr-time"><span class="dp-tr-time-ring">' + CLOCK_GLYPH + '</span><span class="dp-tr-time-val">—:—</span></div>' +
          '<h3 class="dp-tr-card-title">' + esc(tt("stepTram")) + '</h3>' +
          '<div class="dp-tr-card-eta">' + esc(t.duration) + ' ' + esc(tt("duration")) + '</div>' +
        '</header>' +
        '<div class="dp-tr-card-body">' +
          '<div class="dp-tr-route">' +
            '<span class="dp-tr-pill">' + TRAM_GLYPH + '</span>' +
            lineBadge(t.line) +
            '<div class="dp-tr-route-stop">' +
              '<span class="dp-tr-meta-k">' + esc(tt("direction")) + '</span>' +
              '<span class="dp-tr-meta-v">' + esc(t.line === "L2" ? "Port Lympia" : "Hôpital Pasteur") + '</span>' +
            '</div>' +
          '</div>' +
          renderMap(stops, pathD, t.line) +
          '<div class="dp-tr-stops-summary">' +
            '<span class="dp-tr-summary-pill">' + middleCount + ' ' + esc(middleLabel) + '</span>' +
          '</div>' +
          renderStopsList(stops, { startTime: "—:—", endTime: "—:—" }) +
        '</div>' +
      '</article>'
    );
  }

  function renderWalkCard(w, idx, total, isPre) {
    const headTitle = isPre ? tt("stepWalkPre") : tt("stepWalk");
    // Type de tracé piéton à afficher sur la mini carte :
    // - WALK_PRE      = Gare Nice-Ville → Jean Médecin (avant tram)
    // - WALK_FINAL    = Garibaldi / Le Château → Le Véronese (après tram)
    const walkKind = isPre ? "WALK_PRE" : "WALK_FINAL";
    return (
      '<article class="dp-tr-card dp-tr-card-walk" data-step="' + (isPre ? "pre" : "2") + '">' +
        renderStepNav(idx, total) +
        '<header class="dp-tr-card-head">' +
          '<div class="dp-tr-time"><span class="dp-tr-time-ring">' + CLOCK_GLYPH + '</span><span class="dp-tr-time-val">—:—</span></div>' +
          '<h3 class="dp-tr-card-title">' + esc(headTitle) + '</h3>' +
          '<div class="dp-tr-card-eta">' + esc(w.duration) + ' ' + esc(tt("duration")) +
            (w.distanceM ? ' <span class="dp-tr-eta-sub">— ' + esc(w.distanceM) + ' m</span>' : "") +
          '</div>' +
        '</header>' +
        '<div class="dp-tr-card-body">' +
          '<div class="dp-tr-walk-row">' +
            '<span class="dp-tr-walk-icon">' + WALK_GLYPH + '</span>' +
            '<div class="dp-tr-walk-text">' +
              (isPre
                ? '<span class="dp-tr-meta-k">' + esc(tt("foot")) + '</span><span class="dp-tr-meta-v">' + esc(tx(w.from)) + ' → ' + esc(w.to) + '</span>'
                : '<span class="dp-tr-meta-k">' + esc(tt("address")) + '</span><span class="dp-tr-meta-v" data-final-addr></span>') +
            '</div>' +
          '</div>' +
          // Mini carte Leaflet sur le tracé piéton réel (rues exactes)
          '<div class="dp-tr-map dp-tr-map-walk" aria-label="' + esc(tt("mapsAlt")) + '">' +
            '<div class="dp-tr-leaflet" data-line="WALK" data-walk="' + walkKind + '" aria-hidden="true"></div>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  /* ----- Build full section content ----- */
  function buildSteps(routeKey, cfg) {
    const r = cfg[routeKey];
    if (!r) return [];
    const arr = [];
    if (r.walkPre) arr.push({ kind: "walkPre", data: r.walkPre });
    arr.push({ kind: "wait", data: r.wait });
    arr.push({ kind: "tram", data: r.tram });
    arr.push({ kind: "walk", data: r.walk });
    const total = arr.length;
    return arr.map((step, i) => {
      if (step.kind === "wait") return renderWaitCard(step.data, i, total);
      if (step.kind === "tram") return renderTramCard(step.data, i, total);
      if (step.kind === "walkPre") return renderWalkCard(step.data, i, total, true);
      return renderWalkCard(step.data, i, total, false);
    });
  }

  function buildContent(user) {
    const cfg = (user && user.transit) || ROUTES[user && user.login] || LE_VERONESE;
    const airportSteps = buildSteps("airport", cfg);
    const trainSteps = buildSteps("train", cfg);
    const addr = (user && user.address) || tx(cfg.address);
    return (
      '<div class="dp-tr-wrap">' +
        '<div class="dp-tr-tabs" role="tablist">' +
          '<button class="dp-tr-tab is-active" data-tab="airport" role="tab" aria-selected="true">' +
            '<span class="dp-tr-tab-ic">' + PLANE_GLYPH + '</span>' +
            '<span>' + esc(tt("tabAirport")) + '</span>' +
          '</button>' +
          '<button class="dp-tr-tab" data-tab="train" role="tab" aria-selected="false">' +
            '<span class="dp-tr-tab-ic">' + TRAIN_GLYPH + '</span>' +
            '<span>' + esc(tt("tabTrain")) + '</span>' +
          '</button>' +
          '<span class="dp-tr-tab-pill" aria-hidden="true"></span>' +
        '</div>' +

        '<div class="dp-tr-panel" data-panel="airport">' +
          airportSteps.map((s, i) => '<div class="dp-tr-host' + (i === 0 ? " is-active" : "") + '" data-idx="' + i + '">' + s + '</div>').join("") +
        '</div>' +
        '<div class="dp-tr-panel is-hidden" data-panel="train">' +
          trainSteps.map((s, i) => '<div class="dp-tr-host' + (i === 0 ? " is-active" : "") + '" data-idx="' + i + '">' + s + '</div>').join("") +
        '</div>' +

        (addr ?
          '<div class="dp-tr-actions">' +
            '<a class="btn btn-link-light" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(addr) + '">' +
              esc(tt("open")) + ' Google Maps →' +
            '</a>' +
          '</div>'
        : "") +
      '</div>'
    );
  }

  /* ----- Leaflet (mini carte piétonne pour les étapes "Marchez vers") ----- */
  function mountWalkMap(container) {
    if (!container || !window.L) return null;
    const kind = container.getAttribute("data-walk") || "WALK_FINAL";
    const path = kind === "WALK_PRE" ? WALK_NICEVILLE_JEAN_MEDECIN : WALK_GARIBALDI_VERONESE;
    if (!path || path.length < 2) return null;

    let map;
    try {
      map = L.map(container, {
        zoomControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        dragging: true,
        attributionControl: false,
        keyboard: false,
        tap: false,
        zoomSnap: 0.25
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        subdomains: "abcd",
        detectRetina: true,
        crossOrigin: true
      }).addTo(map);

      const bounds = L.latLngBounds(path);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 17 });

      // Halo blanc + ligne or champagne pointillée (signal "à pied")
      L.polyline(path, {
        color: "#FFFFFF", weight: 8, opacity: 0.85, lineCap: "round", interactive: false
      }).addTo(map);
      const linePoly = L.polyline(path, {
        color: "#B69368", weight: 4, opacity: 1, lineCap: "round", lineJoin: "round",
        dashArray: "1 9", interactive: false, className: "dp-tr-walk-line"
      }).addTo(map);

      // Animation : on dessine la ligne progressivement (stroke-dashoffset)
      try {
        const lineEl = linePoly.getElement();
        if (lineEl && typeof lineEl.getTotalLength === "function") {
          const totalLen = lineEl.getTotalLength();
          lineEl.style.strokeDasharray = totalLen;
          lineEl.style.strokeDashoffset = totalLen;
          void lineEl.getBoundingClientRect();
          lineEl.style.transition = "stroke-dashoffset 1400ms cubic-bezier(.45,.05,.25,1)";
          lineEl.style.strokeDashoffset = 0;
          // Restaurer le pointillé une fois la ligne dessinée
          setTimeout(() => {
            lineEl.style.strokeDasharray = "1 9";
            lineEl.style.strokeDashoffset = 0;
            lineEl.style.transition = "";
          }, 1500);
        }
      } catch (e) { /* ok */ }

      // Pin de départ (cercle navy + or)
      const startIcon = L.divIcon({
        className: "dp-tr-mk-wrap",
        html: '<div class="dp-tr-mk is-start" style="--sz:18px"></div>',
        iconSize: [18, 18], iconAnchor: [9, 9]
      });
      L.marker(path[0], { icon: startIcon, keyboard: false, riseOnHover: true })
        .addTo(map)
        .bindTooltip(kind === "WALK_PRE" ? "Gare de Nice-Ville" : "Garibaldi / Le Château", {
          direction: "top", permanent: true,
          className: "dp-tr-tt dp-tr-tt-perm",
          offset: [0, -6]
        });

      // Pin d'arrivée (gros pin or)
      const arrivalIcon = L.divIcon({
        className: "dp-tr-arrival-wrap",
        html: '<div class="dp-tr-arrival">' + PIN_GLYPH + '</div>',
        iconSize: [28, 36], iconAnchor: [14, 32]
      });
      const arrivalLabel = kind === "WALK_PRE" ? "Jean Médecin" : "Le Véronese — 5 rue Barla";
      L.marker(path[path.length - 1], { icon: arrivalIcon, keyboard: false })
        .addTo(map)
        .bindTooltip(arrivalLabel, {
          direction: "top", permanent: true,
          className: "dp-tr-tt dp-tr-tt-arrival",
          offset: [0, -8]
        });

      // Marcheur animé qui parcourt le tracé
      const walkerIcon = L.divIcon({
        className: "dp-tr-walker-wrap",
        html: '<div class="dp-tr-walker-mk">' + WALK_GLYPH + '</div>',
        iconSize: [24, 24], iconAnchor: [12, 12]
      });
      const walker = L.marker(path[0], { icon: walkerIcon, keyboard: false, interactive: false }).addTo(map);

      // Distances cumulées le long de la polyline
      const segments = [];
      let cumDist = 0;
      for (let i = 0; i < path.length - 1; i++) {
        const a = L.latLng(path[i][0], path[i][1]);
        const b = L.latLng(path[i + 1][0], path[i + 1][1]);
        const d = a.distanceTo(b);
        segments.push({ from: a, to: b, dist: d, start: cumDist });
        cumDist += d;
      }
      const totalDist = cumDist;

      function animateWalker() {
        const startTs = performance.now();
        const dur = 3400;
        function tick(now) {
          const elapsed = now - startTs;
          const p = Math.min(1, elapsed / dur);
          const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          const target = eased * totalDist;
          let seg = segments[segments.length - 1];
          for (let k = 0; k < segments.length; k++) {
            if (target <= segments[k].start + segments[k].dist) { seg = segments[k]; break; }
          }
          const localT = (target - seg.start) / seg.dist;
          const lat = seg.from.lat + (seg.to.lat - seg.from.lat) * localT;
          const lng = seg.from.lng + (seg.to.lng - seg.from.lng) * localT;
          walker.setLatLng([lat, lng]);
          if (p < 1) requestAnimationFrame(tick);
          else {
            const el = walker.getElement();
            if (el) el.classList.add("is-arrived");
          }
        }
        const el = walker.getElement();
        if (el) el.classList.remove("is-arrived");
        requestAnimationFrame(tick);
      }

      container._dpMap = map;
      container._dpAnimateTram = animateWalker; // même hook que pour les tram steps
      return map;
    } catch (err) {
      return null;
    }
  }

  /* ----- Leaflet (vraie carte de Nice) ----- */
  function mountLeafletMap(container, lineId) {
    if (!container || !window.L) return null;
    if (container._dpMap) return container._dpMap; // déjà monté
    if (container._leaflet_id) return null; // garde-fou : déjà initialisé

    // Type WALK : on affiche un tracé piéton (pas un tracé tramway)
    if (lineId === "WALK") {
      return mountWalkMap(container);
    }

    const stations = lineId === "L2" ? L2_STATIONS : L1_STATIONS;
    if (!stations || stations.length < 2) return null;

    let map;
    try {
    // Init carte sans contrôles superflus, scroll-zoom OFF (UX dans une carte d'étape)
    map = L.map(container, {
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      dragging: true,
      attributionControl: false,
      keyboard: false,
      tap: false,
      fadeAnimation: true,
      zoomAnimation: true,
      zoomSnap: 0.25
    });

    // Tile layer clair et éditorial — CartoDB Voyager (gratuit, sans clé)
    // Pastel doux : on lit les rues, le port, les noms de quartiers,
    // pendant que la ligne de tram en or champagne reste le focus.
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
      detectRetina: true,
      crossOrigin: true
    }).addTo(map);

    // Fit bounds sur tous les arrêts (avec un peu de padding)
    const bounds = L.latLngBounds(stations.map(s => [s.lat, s.lng]));
    // Ajoute le pin Le Véronese aux bounds pour qu'il soit visible
    bounds.extend([VERONESE.lat, VERONESE.lng]);
    map.fitBounds(bounds, { padding: [22, 22] });

    // Tracé tramway : on prend le polyline RÉEL (issu d'OSM, suit les rues
    // et les tunnels), pas une ligne droite entre arrêts. Sinon le tracé
    // passerait à travers les bâtiments — ou pire, dans la mer.
    const realPath = lineId === "L2" ? L2_POLY : L1_POLY;
    // halo blanc sous la ligne pour la rendre visible quoi qu'il y ait
    L.polyline(realPath, {
      color: "#FFFFFF",
      weight: 9,
      opacity: 0.85,
      lineCap: "round",
      lineJoin: "round",
      interactive: false
    }).addTo(map);

    const linePoly = L.polyline(realPath, {
      color: "#B69368",   // or champagne soutenu — contraste fort sur fond clair
      weight: 5,
      opacity: 1,
      lineCap: "round",
      lineJoin: "round",
      interactive: false,
      className: "dp-tr-leaflet-line"
    }).addTo(map);

    // Animer le tracé : on commence avec dashOffset = total length, on progresse vers 0
    try {
      const lineEl = linePoly.getElement();
      if (lineEl && typeof lineEl.getTotalLength === "function") {
        const totalLen = lineEl.getTotalLength();
        lineEl.style.strokeDasharray = totalLen;
        lineEl.style.strokeDashoffset = totalLen;
        // reflow
        void lineEl.getBoundingClientRect();
        lineEl.style.transition = "stroke-dashoffset 1500ms cubic-bezier(.45,.05,.25,1)";
        lineEl.style.strokeDashoffset = 0;
      }
    } catch (e) { /* pas grave si pas dispo */ }

    // Marqueurs des arrêts (cercles épinglés or sur fond navy)
    stations.forEach((s, i) => {
      const isStart = i === 0;
      const isEnd = i === stations.length - 1;
      const cls = "dp-tr-mk" + (isStart ? " is-start" : "") + (isEnd ? " is-end" : "");
      const sz = (isStart || isEnd) ? 16 : 10;
      const html = '<div class="' + cls + '" style="--sz:' + sz + 'px;animation-delay:' + (400 + i * 90) + 'ms"></div>';
      const icon = L.divIcon({
        className: "dp-tr-mk-wrap",
        html: html,
        iconSize: [sz, sz],
        iconAnchor: [sz / 2, sz / 2]
      });
      const m = L.marker([s.lat, s.lng], { icon, keyboard: false, riseOnHover: true })
        .addTo(map)
        .bindTooltip(s.name + '<span class="dp-tr-tt-meta">Nice</span>', {
          direction: (i < stations.length / 2) ? "right" : "left",
          offset: [0, 0],
          className: "dp-tr-tt",
          permanent: false,
          opacity: 1
        });
      // Affiche les noms des arrêts terminus en permanence (start + end)
      if (isStart || isEnd) {
        m.bindTooltip(s.name, {
          direction: isStart ? "right" : "left",
          permanent: true,
          className: "dp-tr-tt dp-tr-tt-perm",
          offset: [isStart ? 10 : -10, 0]
        }).openTooltip();
      }
    });

    // Pin d'arrivée — Le Véronese (5 rue Barla)
    if (lineId === "L2" || lineId === "L1") {
      const arrivalIcon = L.divIcon({
        className: "dp-tr-arrival-wrap",
        html: '<div class="dp-tr-arrival">' + PIN_GLYPH + '</div>',
        iconSize: [28, 36],
        iconAnchor: [14, 32]
      });
      L.marker([VERONESE.lat, VERONESE.lng], { icon: arrivalIcon, keyboard: false })
        .addTo(map)
        .bindTooltip(lang() === "en" ? "Le Véronese — your apartment" : "Le Véronese — votre appartement", {
          direction: "top",
          permanent: false,
          className: "dp-tr-tt dp-tr-tt-arrival",
          offset: [0, -8]
        });
    }

    // Tram en mouvement le long du tracé : marker animé sur la VRAIE polyline
    const tramIcon = L.divIcon({
      className: "dp-tr-tram-wrap",
      html: '<div class="dp-tr-tram-mk"><span></span></div>',
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
    const tramStart = realPath[0];
    const tramMarker = L.marker(tramStart, { icon: tramIcon, keyboard: false, interactive: false }).addTo(map);

    // Calcule les distances cumulées sur tous les sommets de la polyline
    // pour que le tram suive fidèlement les courbes (et non les diagonales).
    const segments = [];
    let cumDist = 0;
    for (let i = 0; i < realPath.length - 1; i++) {
      const a = L.latLng(realPath[i][0], realPath[i][1]);
      const b = L.latLng(realPath[i + 1][0], realPath[i + 1][1]);
      const d = a.distanceTo(b);
      segments.push({ from: a, to: b, dist: d, start: cumDist });
      cumDist += d;
    }
    const totalDist = cumDist;

    function animateTram() {
      if (!tramMarker) return;
      const startTs = performance.now();
      const dur = 3200;
      function tick(now) {
        const elapsed = now - startTs;
        const p = Math.min(1, elapsed / dur);
        const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        const target = eased * totalDist;
        // Cherche le segment courant
        let seg = segments[segments.length - 1];
        for (let k = 0; k < segments.length; k++) {
          if (target <= segments[k].start + segments[k].dist) { seg = segments[k]; break; }
        }
        const localT = (target - seg.start) / seg.dist;
        const lat = seg.from.lat + (seg.to.lat - seg.from.lat) * localT;
        const lng = seg.from.lng + (seg.to.lng - seg.from.lng) * localT;
        tramMarker.setLatLng([lat, lng]);
        if (p < 1) requestAnimationFrame(tick);
        else {
          // pulse à l'arrivée
          const el = tramMarker.getElement();
          if (el) el.classList.add("is-arrived");
        }
      }
      const el = tramMarker.getElement();
      if (el) el.classList.remove("is-arrived");
      requestAnimationFrame(tick);
    }

    container._dpMap = map;
    container._dpAnimateTram = animateTram;
    return map;
    } catch (err) {
      // Fallback silencieux sur le SVG si Leaflet plante
      return null;
    }
  }

  function showLeafletFor(host) {
    if (!host || !window.L) return false;
    const lf = host.querySelector(".dp-tr-leaflet");
    if (!lf) return false;
    const fb = host.querySelector(".dp-tr-map-fallback");
    let map = lf._dpMap;
    if (!map) {
      map = mountLeafletMap(lf, lf.getAttribute("data-line") || "L2");
      if (!map) return false;
      // Cache le fallback SVG une fois Leaflet monté
      if (fb) fb.style.display = "none";
    } else {
      // Forcer Leaflet à recalculer la taille (utile si le host vient d'être révélé)
      setTimeout(() => map.invalidateSize(true), 30);
    }
    if (typeof lf._dpAnimateTram === "function") {
      // léger délai pour laisser le tracé se redessiner avant le tram
      setTimeout(lf._dpAnimateTram, 700);
    }
    return true;
  }

  /* ----- Animation + interaction wiring ----- */
  function animateMap(svg) {
    if (!svg) return;
    const pathDraw = svg.querySelector(".dp-tr-line-draw");
    const dotsG = svg.querySelector(".dp-tr-mapdots");
    const tram = svg.querySelector(".dp-tr-tram");
    const pinStart = svg.querySelector(".dp-tr-pin-start");
    const pinEnd = svg.querySelector(".dp-tr-pin-end");
    if (!pathDraw) return;

    const len = pathDraw.getTotalLength();
    pathDraw.style.strokeDasharray = len;
    pathDraw.style.strokeDashoffset = len;
    void pathDraw.getBoundingClientRect();
    pathDraw.style.transition = "stroke-dashoffset 1500ms cubic-bezier(.45,.05,.25,1)";
    pathDraw.style.strokeDashoffset = 0;

    if (dotsG) {
      const dots = dotsG.querySelectorAll(".dp-tr-dotc");
      const n = dots.length;
      for (let i = 0; i < n; i++) {
        const pt = pathDraw.getPointAtLength((i / (n - 1)) * len);
        dots[i].setAttribute("cx", pt.x);
        dots[i].setAttribute("cy", pt.y);
      }
    }

    if (pinStart) {
      const ps = pathDraw.getPointAtLength(0);
      pinStart.setAttribute("transform", "translate(" + ps.x + " " + ps.y + ")");
    }
    if (pinEnd) {
      const pe = pathDraw.getPointAtLength(len);
      pinEnd.setAttribute("transform", "translate(" + pe.x + " " + pe.y + ")");
    }

    if (tram) {
      const start = performance.now();
      const dur = 2800;
      function tick(now) {
        const elapsed = now - start;
        const p = Math.min(1, elapsed / dur);
        const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        const pt = pathDraw.getPointAtLength(eased * len);
        tram.setAttribute("transform", "translate(" + pt.x + " " + pt.y + ")");
        if (p < 1) requestAnimationFrame(tick);
        else tram.classList.add("is-arrived");
      }
      tram.classList.remove("is-arrived");
      requestAnimationFrame(tick);
    }
  }

  function preposition(svg) {
    const pathDraw = svg.querySelector(".dp-tr-line-draw");
    if (!pathDraw) return;
    const len = pathDraw.getTotalLength();
    pathDraw.style.strokeDasharray = len;
    pathDraw.style.strokeDashoffset = len;
    const dotsG = svg.querySelector(".dp-tr-mapdots");
    if (dotsG) {
      const dots = dotsG.querySelectorAll(".dp-tr-dotc");
      const n = dots.length;
      for (let i = 0; i < n; i++) {
        const pt = pathDraw.getPointAtLength((i / (n - 1)) * len);
        dots[i].setAttribute("cx", pt.x);
        dots[i].setAttribute("cy", pt.y);
      }
    }
    const pinStart = svg.querySelector(".dp-tr-pin-start");
    if (pinStart) {
      const ps = pathDraw.getPointAtLength(0);
      pinStart.setAttribute("transform", "translate(" + ps.x + " " + ps.y + ")");
    }
    const pinEnd = svg.querySelector(".dp-tr-pin-end");
    if (pinEnd) {
      const pe = pathDraw.getPointAtLength(len);
      pinEnd.setAttribute("transform", "translate(" + pe.x + " " + pe.y + ")");
    }
  }

  function wireInteractions(root, user) {
    if (!root) return;
    const addr = (user && user.address) || (ROUTES[user && user.login] && tx(ROUTES[user.login].address));

    // Fill final address
    root.querySelectorAll("[data-final-addr]").forEach(el => { el.textContent = addr || ""; });

    // Compute wall-clock times per panel timeline
    root.querySelectorAll(".dp-tr-panel").forEach(panel => {
      let cursor = new Date();
      const hosts = panel.querySelectorAll(".dp-tr-host");
      hosts.forEach(host => {
        const card = host.querySelector(".dp-tr-card");
        if (!card) return;
        const stepKind = card.getAttribute("data-step");
        const head = card.querySelector(".dp-tr-time-val");
        if (head) head.textContent = fmtTime(cursor);

        if (stepKind === "0") {
          // wait — populate 3 passings
          const passings = card.querySelectorAll(".dp-tr-pass-time");
          const base = cursor.getTime();
          const offsets = [0, 8, 18];
          passings.forEach((p, i) => {
            const d = new Date(base + offsets[i] * 60000);
            const num = p.querySelector(".dp-tr-pass-num");
            if (num) num.textContent = fmtTime(d);
            else p.textContent = fmtTime(d);
          });
          cursor = new Date(cursor.getTime() + 60000);
        } else if (stepKind === "1") {
          const eta = card.querySelector(".dp-tr-card-eta");
          const dur = parseInt(eta && eta.textContent, 10) || 29;
          const stops = card.querySelectorAll(".dp-tr-stop");
          if (stops.length) {
            const first = stops[0].querySelector(".dp-tr-stop-time");
            if (first) first.textContent = fmtTime(cursor);
          }
          cursor = new Date(cursor.getTime() + dur * 60000);
          if (stops.length) {
            const last = stops[stops.length - 1].querySelector(".dp-tr-stop-time");
            if (last) last.textContent = fmtTime(cursor);
          }
        } else {
          const eta = card.querySelector(".dp-tr-card-eta");
          const dur = parseInt(eta && eta.textContent, 10) || 5;
          cursor = new Date(cursor.getTime() + dur * 60000);
        }
      });
    });

    // Tabs
    const tabs = root.querySelectorAll(".dp-tr-tab");
    const pill = root.querySelector(".dp-tr-tab-pill");
    function syncPill() {
      const active = root.querySelector(".dp-tr-tab.is-active");
      if (active && pill) {
        pill.style.width = active.offsetWidth + "px";
        pill.style.transform = "translateX(" + active.offsetLeft + "px)";
      }
    }
    tabs.forEach(b => {
      b.addEventListener("click", () => {
        tabs.forEach(t => { t.classList.remove("is-active"); t.setAttribute("aria-selected", "false"); });
        b.classList.add("is-active");
        b.setAttribute("aria-selected", "true");
        const key = b.getAttribute("data-tab");
        root.querySelectorAll(".dp-tr-panel").forEach(p => {
          p.classList.toggle("is-hidden", p.getAttribute("data-panel") !== key);
        });
        syncPill();
        const panel = root.querySelector('.dp-tr-panel[data-panel="' + key + '"]');
        if (panel) {
          panel.querySelectorAll(".dp-tr-host").forEach((h, i) => h.classList.toggle("is-active", i === 0));
          replayActiveMap(panel);
        }
      });
    });
    setTimeout(syncPill, 30);
    window.addEventListener("resize", syncPill);

    // Step navigation
    function activeIdx(panel) {
      const hosts = panel.querySelectorAll(".dp-tr-host");
      for (let i = 0; i < hosts.length; i++) if (hosts[i].classList.contains("is-active")) return i;
      return 0;
    }
    function setActive(panel, idx) {
      const hosts = panel.querySelectorAll(".dp-tr-host");
      hosts.forEach((h, i) => h.classList.toggle("is-active", i === idx));
      replayActiveMap(panel);
    }
    function replayActiveMap(panel) {
      const active = panel.querySelector(".dp-tr-host.is-active");
      if (!active) return;
      // Tente d'abord la vraie carte Leaflet — fallback sur le SVG si Leaflet absent
      if (showLeafletFor(active)) return;
      const svg = active.querySelector(".dp-tr-map-svg");
      if (svg) animateMap(svg);
    }
    root.addEventListener("click", e => {
      const btn = e.target.closest(".dp-tr-nav-btn");
      if (!btn) return;
      const panel = btn.closest(".dp-tr-panel");
      if (!panel) return;
      const hosts = panel.querySelectorAll(".dp-tr-host");
      const cur = activeIdx(panel);
      let nx = cur;
      if (btn.getAttribute("data-act") === "prev") nx = Math.max(0, cur - 1);
      else if (btn.getAttribute("data-act") === "next") nx = Math.min(hosts.length - 1, cur + 1);
      setActive(panel, nx);
    });

    // Initial animation pass on visible panel — Leaflet sur l'étape Tramway active
    root.querySelectorAll(".dp-tr-panel:not(.is-hidden) .dp-tr-host.is-active").forEach(host => {
      if (!showLeafletFor(host)) {
        const svg = host.querySelector(".dp-tr-map-svg");
        if (svg) animateMap(svg);
      }
    });
    // Pre-position SVG fallback sur les panneaux cachés (au cas où Leaflet absent)
    root.querySelectorAll(".dp-tr-panel.is-hidden .dp-tr-map-svg").forEach(preposition);
  }

  /* ----- Public API ----- */
  function init(user) {
    const section = document.getElementById("transit");
    if (!section) return;
    const host = section.querySelector(".dp-tr-host-mount") || section;
    if (!user) user = (window.DP && DP.requireAuth) ? DP.requireAuth() : null;
    if (!user) return;
    if (!ROUTES[user.login] && !user.transit) {
      // not appt1/appt2 → ensure section is hidden
      section.hidden = true;
      const chip = document.getElementById("tocTransit");
      if (chip) chip.hidden = true;
      return;
    }
    section.hidden = false;
    const chip = document.getElementById("tocTransit");
    if (chip) chip.hidden = false;

    host.innerHTML = buildContent(user);
    // NB: tous les textes sont déjà résolus via tt() au moment du build.
    // On n'appelle PAS DP_I18N.apply ici — la signature attend un code de
    // langue (chaîne), pas un élément racine. L'API reste celle du site.
    wireInteractions(host, user);

    // Re-render on language change so all i18n strings + step times refresh.
    // We watch <html lang> changes but guard against re-entry (DP_I18N.apply
    // also updates documentElement.lang, so naïve observation = infinite loop).
    if (!init._langWired) {
      init._langWired = true;
      let lastLang = document.documentElement.lang || lang();
      const obs = new MutationObserver(() => {
        const cur = document.documentElement.lang || lang();
        if (cur === lastLang) return;
        lastLang = cur;
        init(user);
      });
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    }
  }

  window.DelfosseTransit = { init: init, ROUTES: ROUTES };
})();
