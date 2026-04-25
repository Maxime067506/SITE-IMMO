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
  /* Logos officiels des points de remise des clés.
     - Keynest (APPT5/6/7) : SVG officiel téléchargé depuis keynest.com
     - Laverie La Fête du Slip (APPT1/2) : crop de l'enseigne du magasin
       (1 rue Badat, 06300 Nice) — boîte à clés dans la laverie. */
  const KEYNEST_LOGO_URL = "img/keynest-logo.svg";
  const LAVERIE_LOGO_URL = "img/laverie-fete-du-slip-logo.png";

  /* L2 — 15 stations Aéroport T1 → Garibaldi/Le Château.
     Coordonnées GPS officielles d'OpenStreetMap (relation 11087383,
     "Tram L2 : Aéroport Terminal 2 => Port Lympia") — noms et ordre
     vérifiés contre Lignes d'Azur (Lenval-Hôpital avant Magnan en
     direction est, contrairement à ce que je croyais). */
  const L2_STATIONS = [
    { name: "Aéroport Terminal 1",                       lat: 43.66527, lng: 7.21085 },
    { name: "Grand Arénas",                              lat: 43.66994, lng: 7.21238 },
    { name: "Parc Phoenix",                              lat: 43.66941, lng: 7.21913 },
    { name: "Cassin / Kirchner",                         lat: 43.67228, lng: 7.22412 },
    { name: "Ferber",                                    lat: 43.67690, lng: 7.22836 },
    { name: "Carras",                                    lat: 43.68073, lng: 7.23063 },
    { name: "Sainte-Hélène",                             lat: 43.68359, lng: 7.23360 },
    { name: "Fabron",                                    lat: 43.68682, lng: 7.23710 },
    { name: "Lenval - Hôpital",                          lat: 43.68954, lng: 7.24123 },
    { name: "Magnan",                                    lat: 43.69165, lng: 7.24578 },
    { name: "Centre Universitaire Méditerranéen",        lat: 43.69301, lng: 7.24953 },
    { name: "Alsace-Lorraine",                           lat: 43.69771, lng: 7.25700 },
    { name: "Jean Médecin",                              lat: 43.70007, lng: 7.26673 },
    { name: "Durandy",                                   lat: 43.70143, lng: 7.27235 },
    { name: "Garibaldi / Le Château",                    lat: 43.70021, lng: 7.28060 }
  ];
  const L2_STOPS = L2_STATIONS.map(s => s.name);

  /* L1 — section centre-ville : Gare Thiers → Garibaldi (6 arrêts).
     Coordonnées GPS officielles OpenStreetMap (relation 7173149,
     "Tram L1 : Hôpital Pasteur => Henri Sappia"). */
  const L1_STATIONS = [
    { name: "Gare Thiers",                lat: 43.70553, lng: 7.26491 },
    { name: "Jean Médecin",               lat: 43.70170, lng: 7.26734 },
    { name: "Masséna",                    lat: 43.69837, lng: 7.26944 },
    { name: "Opéra - Vieille Ville",      lat: 43.69729, lng: 7.27295 },
    { name: "Cathédrale - Vieille Ville", lat: 43.69845, lng: 7.27651 },
    { name: "Garibaldi / Le Château",     lat: 43.70153, lng: 7.28049 }
  ];
  const L1_STOPS = L1_STATIONS.map(s => s.name);

  /* Tracés piétons RÉELS — calculés via Valhalla (moteur de routage
     piéton OpenStreetMap, instance valhalla1.openstreetmap.de).
     Chaque polyline suit les trottoirs/rues piétonnes telles que
     cartographiées dans OSM. Distances et durées indiquées sont
     celles renvoyées par Valhalla (vitesse ~5 km/h sur sol urbain). */
  const WALK_PATHS = {
    /* APPT1/2 — Garibaldi L2 (sud) → LAVERIE "La Fête du Slip" (1 rue Badat,
       boîte à clés) → 5 rue Barla. 411 m, 5 min. */
    GARIBALDI_L2_LAVERIE_VERONESE: [[43.70022,7.28062],[43.70028,7.28058],[43.70028,7.28066],[43.70061,7.28085],[43.70066,7.28088],[43.70069,7.2809],[43.70074,7.28093],[43.70109,7.28112],[43.70128,7.28048],[43.7013,7.28041],[43.7013,7.28039],[43.70193,7.28075],[43.70235,7.28098],[43.70236,7.28099],[43.70242,7.28103],[43.70242,7.28105],[43.7024,7.28111],[43.70239,7.28113],[43.70237,7.28119],[43.70228,7.28151],[43.70232,7.28153],[43.70234,7.28154],[43.70256,7.28167],[43.70236,7.28155]],

    /* APPT1/2 — Garibaldi L1 (nord) → LAVERIE → 5 rue Barla. 209 m, 3 min. */
    GARIBALDI_L1_LAVERIE_VERONESE: [[43.70152,7.28051],[43.70193,7.28075],[43.70235,7.28098],[43.70236,7.28099],[43.70242,7.28103],[43.70242,7.28105],[43.7024,7.28111],[43.70239,7.28113],[43.70237,7.28119],[43.70228,7.28151],[43.70232,7.28153],[43.70234,7.28154],[43.70256,7.28167],[43.70236,7.28155]],

    /* Gare de Nice-Ville → Jean Médecin tram — 882 m, 10 min
       (Conservé pour fallback ; APPT1/2 utilise désormais Gare Thiers.) */
    NICEVILLE_JEAN_MEDECIN: [[43.70451,7.26158],[43.7045,7.26159],[43.70453,7.26164],[43.70454,7.26165],[43.70459,7.26176],[43.70459,7.2618],[43.70462,7.26187],[43.70459,7.26189],[43.70455,7.26193],[43.7045,7.26197],[43.70447,7.262],[43.70431,7.26216],[43.70428,7.2622],[43.70422,7.26224],[43.70414,7.26231],[43.70413,7.26233],[43.70407,7.26237],[43.70404,7.26238],[43.70382,7.26239],[43.70382,7.26244],[43.70378,7.26245],[43.70376,7.26245],[43.70339,7.26248],[43.70329,7.26248],[43.70294,7.26251],[43.70267,7.26252],[43.7026,7.26252],[43.70253,7.26253],[43.70217,7.26253],[43.70175,7.26256],[43.70168,7.26255],[43.70168,7.26259],[43.70168,7.26264],[43.70162,7.26306],[43.70155,7.26353],[43.70154,7.26357],[43.7015,7.26368],[43.70142,7.26373],[43.70138,7.26376],[43.70105,7.26399],[43.70069,7.26423],[43.70061,7.26426],[43.70057,7.26428],[43.70014,7.26445],[43.70007,7.26446],[43.70004,7.26452],[43.7,7.26457],[43.69977,7.26482],[43.69965,7.26494],[43.69958,7.26502],[43.69961,7.26511],[43.69962,7.26516],[43.69988,7.26593],[43.69996,7.26614],[43.69998,7.26623],[43.70005,7.26627],[43.70007,7.26635],[43.7,7.26646],[43.70004,7.26649],[43.70011,7.2667],[43.70016,7.26686],[43.70016,7.26694]],

    /* Gare de Nice-Ville (parvis sud) → Gare Thiers (L1, av. Malausséna côté
       nord du quai SNCF) — 391 m, 5 min. Le passage sous voies fait que la
       distance est plus longue qu'on ne le croit (la station L1 est en
       souterrain au nord, pas sur av. Thiers au sud). */
    NICEVILLE_GARE_THIERS: [[43.70451,7.26158],[43.7045,7.26159],[43.70453,7.26164],[43.70454,7.26165],[43.70459,7.26176],[43.70459,7.2618],[43.70462,7.26187],[43.70459,7.26189],[43.70455,7.26193],[43.7045,7.26197],[43.70447,7.262],[43.70431,7.26216],[43.70466,7.26298],[43.70463,7.26301],[43.70498,7.26377],[43.70493,7.26382],[43.70509,7.2642],[43.70522,7.26451],[43.70524,7.26456],[43.70524,7.26463],[43.70524,7.26474],[43.70524,7.26495],[43.70524,7.26499],[43.70523,7.26505],[43.70524,7.26507],[43.70524,7.26509],[43.70528,7.26522],[43.70531,7.2652],[43.70529,7.26515],[43.70555,7.26498]],

    /* Gare Thiers (L1, côté nord) → 38 av Auber (APPT4) — 371 m, 4 min.
       Passage souterrain sous voies SNCF puis bref segment av. Auber. */
    GARE_THIERS_AUBER38: [[43.70555,7.26498],[43.70529,7.26515],[43.70531,7.2652],[43.70528,7.26522],[43.70524,7.26509],[43.70524,7.26507],[43.70523,7.26505],[43.70524,7.26499],[43.70524,7.26495],[43.70524,7.26474],[43.70524,7.26463],[43.70524,7.26456],[43.70522,7.26451],[43.70509,7.2642],[43.70493,7.26382],[43.70486,7.26369],[43.70442,7.26269],[43.70422,7.26224],[43.70414,7.26231],[43.70391,7.26179]],

    /* Jean Médecin (tram) → 27 av Notre-Dame (APPT3) — 526 m, 7 min */
    JEAN_MEDECIN_NOTREDAME27: [[43.70016,7.26694],[43.70018,7.26702],[43.70021,7.26711],[43.70036,7.26711],[43.7004,7.26722],[43.70044,7.26736],[43.70043,7.2674],[43.70048,7.26759],[43.70052,7.26776],[43.70056,7.2679],[43.70058,7.26789],[43.70115,7.26752],[43.70197,7.26699],[43.70208,7.26692],[43.7025,7.26665],[43.70253,7.26664],[43.70255,7.26662],[43.70315,7.26624],[43.70317,7.26627],[43.70319,7.26628],[43.70321,7.26627],[43.70338,7.26616],[43.70339,7.26619],[43.7034,7.26621],[43.7034,7.26623],[43.70341,7.26624],[43.70342,7.26627],[43.70344,7.26633],[43.70346,7.26639],[43.70346,7.26641],[43.70349,7.2665],[43.70368,7.26705]],

    /* Gare de Nice-Ville → 27 av Notre-Dame (APPT3) — 588 m, 7 min */
    NICEVILLE_NOTREDAME27: [[43.70451,7.26158],[43.7045,7.26159],[43.70453,7.26164],[43.70454,7.26165],[43.70459,7.26176],[43.70459,7.2618],[43.70462,7.26187],[43.70459,7.26189],[43.70455,7.26193],[43.7045,7.26197],[43.70447,7.262],[43.70431,7.26216],[43.70428,7.2622],[43.70422,7.26224],[43.70414,7.26231],[43.70413,7.26233],[43.70407,7.26237],[43.70404,7.26238],[43.70382,7.26239],[43.70382,7.26244],[43.70378,7.26245],[43.70376,7.26245],[43.70376,7.26249],[43.70377,7.26253],[43.70383,7.26323],[43.70388,7.26386],[43.70389,7.26389],[43.70394,7.26436],[43.70396,7.26454],[43.704,7.26476],[43.70426,7.26554],[43.70428,7.2656],[43.70429,7.26565],[43.7043,7.26566],[43.7043,7.26568],[43.70432,7.26576],[43.70431,7.26577],[43.70344,7.26633],[43.70346,7.26639],[43.70346,7.26641],[43.70349,7.2665],[43.70368,7.26705]],

    /* Jean Médecin (tram) → 38 av Auber (APPT4 fallback) — 834 m, 10 min */
    JEAN_MEDECIN_AUBER38: [[43.70016,7.26694],[43.70016,7.26686],[43.70011,7.2667],[43.70004,7.26649],[43.7,7.26646],[43.70007,7.26635],[43.70005,7.26627],[43.69998,7.26623],[43.69996,7.26614],[43.69988,7.26593],[43.69962,7.26516],[43.69961,7.26511],[43.69958,7.26502],[43.69965,7.26494],[43.69977,7.26482],[43.7,7.26457],[43.70004,7.26452],[43.70007,7.26446],[43.70014,7.26445],[43.70057,7.26428],[43.70061,7.26426],[43.70069,7.26423],[43.70105,7.26399],[43.70138,7.26376],[43.70142,7.26373],[43.7015,7.26368],[43.70155,7.26353],[43.70154,7.26357],[43.70162,7.26306],[43.70168,7.26264],[43.70168,7.26259],[43.70168,7.26255],[43.70169,7.26247],[43.70171,7.26179],[43.70172,7.26171],[43.7022,7.26172],[43.70258,7.26171],[43.70292,7.2617],[43.70345,7.2617],[43.70381,7.26169],[43.70385,7.26169],[43.70391,7.26165],[43.7039,7.26178],[43.70391,7.26179]],

    /* Gare de Nice-Ville → 38 av Auber (APPT4) — 140 m, 2 min */
    NICEVILLE_AUBER38: [[43.70451,7.26158],[43.7045,7.26159],[43.70453,7.26164],[43.70454,7.26165],[43.70459,7.26176],[43.70459,7.2618],[43.70462,7.26187],[43.70459,7.26189],[43.70455,7.26193],[43.7045,7.26197],[43.70447,7.262],[43.70431,7.26216],[43.70428,7.2622],[43.70422,7.26224],[43.70414,7.26231],[43.70391,7.26179]],

    /* APPT3 — Jean Médecin (L2) → KEYNEST (4ter av. Durante) → 27 av Notre-Dame
       1065 m, 13 min — détour léger pour la récupération des clés. */
    JEAN_MEDECIN_KEYNEST_NOTREDAME27: [[43.70016,7.26694],[43.70016,7.26686],[43.70011,7.2667],[43.70004,7.26649],[43.7,7.26646],[43.70007,7.26635],[43.70005,7.26627],[43.69998,7.26623],[43.69996,7.26614],[43.69988,7.26593],[43.69962,7.26516],[43.69961,7.26511],[43.69958,7.26502],[43.69965,7.26494],[43.69977,7.26482],[43.7,7.26457],[43.70004,7.26452],[43.70007,7.26446],[43.70014,7.26445],[43.70057,7.26428],[43.70061,7.26426],[43.70069,7.26423],[43.70105,7.26399],[43.70138,7.26376],[43.70142,7.26373],[43.7015,7.26368],[43.70154,7.26357],[43.70155,7.26353],[43.70162,7.26306],[43.70168,7.26264],[43.70168,7.26259],[43.70168,7.26255],[43.70162,7.26255],[43.70154,7.26253],[43.70162,7.26255],[43.70168,7.26255],[43.70168,7.26259],[43.70168,7.26264],[43.70162,7.26306],[43.70155,7.26353],[43.70154,7.26357],[43.7015,7.26368],[43.70154,7.26381],[43.70159,7.26394],[43.70163,7.26406],[43.70177,7.26451],[43.70186,7.26475],[43.70188,7.26484],[43.70196,7.26482],[43.70259,7.26471],[43.70262,7.26471],[43.70264,7.26478],[43.70284,7.26537],[43.70286,7.26542],[43.70312,7.26617],[43.70314,7.26622],[43.70315,7.26624],[43.70317,7.26627],[43.70319,7.26628],[43.70321,7.26627],[43.70338,7.26616],[43.70339,7.26619],[43.7034,7.26621],[43.7034,7.26623],[43.70341,7.26624],[43.70342,7.26627],[43.70344,7.26633],[43.70346,7.26639],[43.70346,7.26641],[43.70349,7.2665],[43.70368,7.26705]],

    /* APPT3 — Gare Nice-Ville → KEYNEST (4ter av. Durante) → 27 av Notre-Dame
       926 m, 11 min */
    NICEVILLE_KEYNEST_NOTREDAME27: [[43.70451,7.26158],[43.7045,7.26159],[43.70453,7.26164],[43.70454,7.26165],[43.70459,7.26176],[43.70459,7.2618],[43.70462,7.26187],[43.70459,7.26189],[43.70455,7.26193],[43.7045,7.26197],[43.70447,7.262],[43.70431,7.26216],[43.70428,7.2622],[43.70422,7.26224],[43.70414,7.26231],[43.70413,7.26233],[43.70407,7.26237],[43.70404,7.26238],[43.70382,7.26239],[43.70382,7.26244],[43.70378,7.26245],[43.70376,7.26245],[43.70339,7.26248],[43.70329,7.26248],[43.70294,7.26251],[43.70267,7.26252],[43.7026,7.26252],[43.70253,7.26253],[43.70217,7.26253],[43.70175,7.26256],[43.70168,7.26255],[43.70162,7.26255],[43.70154,7.26253],[43.70162,7.26255],[43.70168,7.26255],[43.70168,7.26259],[43.70168,7.26264],[43.70162,7.26306],[43.70155,7.26353],[43.70154,7.26357],[43.7015,7.26368],[43.70154,7.26381],[43.70159,7.26394],[43.70163,7.26406],[43.70177,7.26451],[43.70186,7.26475],[43.70188,7.26484],[43.70196,7.26482],[43.70259,7.26471],[43.70262,7.26471],[43.70264,7.26478],[43.70284,7.26537],[43.70286,7.26542],[43.70312,7.26617],[43.70314,7.26622],[43.70315,7.26624],[43.70317,7.26627],[43.70319,7.26628],[43.70321,7.26627],[43.70338,7.26616],[43.70339,7.26619],[43.7034,7.26621],[43.7034,7.26623],[43.70341,7.26624],[43.70342,7.26627],[43.70344,7.26633],[43.70346,7.26639],[43.70346,7.26641],[43.70349,7.2665],[43.70368,7.26705]],

    /* APPT4 — Gare Thiers (après transfert L2/L1) → KEYNEST → 38 av Auber
       959 m, 11 min */
    GARE_THIERS_KEYNEST_AUBER38: [[43.70555,7.26498],[43.70529,7.26515],[43.70531,7.2652],[43.70528,7.26522],[43.70524,7.26509],[43.70524,7.26507],[43.70523,7.26505],[43.70524,7.26499],[43.70524,7.26495],[43.70524,7.26474],[43.70524,7.26463],[43.70524,7.26456],[43.70522,7.26451],[43.70509,7.2642],[43.70493,7.26382],[43.70486,7.26369],[43.70442,7.26269],[43.70422,7.26224],[43.70414,7.26231],[43.70413,7.26233],[43.70407,7.26237],[43.70404,7.26238],[43.70382,7.26239],[43.70382,7.26244],[43.70378,7.26245],[43.70376,7.26245],[43.70339,7.26248],[43.70329,7.26248],[43.70294,7.26251],[43.70267,7.26252],[43.7026,7.26252],[43.70253,7.26253],[43.70217,7.26253],[43.70175,7.26256],[43.70168,7.26255],[43.70162,7.26255],[43.70154,7.26253],[43.70162,7.26255],[43.70168,7.26255],[43.70169,7.26247],[43.70171,7.26179],[43.70172,7.26171],[43.7022,7.26172],[43.70258,7.26171],[43.70292,7.2617],[43.70345,7.2617],[43.70381,7.26169],[43.70385,7.26169],[43.70391,7.26165],[43.7039,7.26178],[43.70391,7.26179]],

    /* APPT4 — Gare Nice-Ville → KEYNEST (4ter av. Durante) → 38 av Auber
       728 m, 9 min */
    NICEVILLE_KEYNEST_AUBER38: [[43.70451,7.26158],[43.7045,7.26159],[43.70453,7.26164],[43.70454,7.26165],[43.70459,7.26176],[43.70459,7.2618],[43.70462,7.26187],[43.70459,7.26189],[43.70455,7.26193],[43.7045,7.26197],[43.70447,7.262],[43.70431,7.26216],[43.70428,7.2622],[43.70422,7.26224],[43.70414,7.26231],[43.70413,7.26233],[43.70407,7.26237],[43.70404,7.26238],[43.70382,7.26239],[43.70382,7.26244],[43.70378,7.26245],[43.70376,7.26245],[43.70339,7.26248],[43.70329,7.26248],[43.70294,7.26251],[43.70267,7.26252],[43.7026,7.26252],[43.70253,7.26253],[43.70217,7.26253],[43.70175,7.26256],[43.70168,7.26255],[43.70162,7.26255],[43.70154,7.26253],[43.70162,7.26255],[43.70168,7.26255],[43.70169,7.26247],[43.70171,7.26179],[43.70172,7.26171],[43.7022,7.26172],[43.70258,7.26171],[43.70292,7.2617],[43.70345,7.2617],[43.70381,7.26169],[43.70385,7.26169],[43.70391,7.26165],[43.7039,7.26178],[43.70391,7.26179]],

    /* APPT5/7 — Alsace-Lorraine → KEYNEST (38 rue Berlioz) → 41 av Clemenceau
       718 m, 9 min. Le voyageur récupère ses clés au point Keynest avant
       de rejoindre l'appartement. */
    ALSACE_KEYNEST_CLEMENCEAU41: [[43.69783,7.25717],[43.6979,7.25751],[43.69782,7.25754],[43.69785,7.25771],[43.69788,7.25784],[43.69796,7.25815],[43.69815,7.25894],[43.69817,7.25903],[43.69825,7.25905],[43.69832,7.25906],[43.69881,7.25914],[43.69952,7.25924],[43.6996,7.25925],[43.69964,7.25926],[43.69967,7.25926],[43.70056,7.25941],[43.70062,7.25942],[43.70065,7.25943],[43.70068,7.25943],[43.70194,7.25961],[43.702,7.25962],[43.702,7.25964],[43.70205,7.25971],[43.70208,7.25975],[43.70211,7.25976],[43.70208,7.25975],[43.70205,7.25971],[43.702,7.25964],[43.70199,7.25968],[43.7019,7.26026],[43.7019,7.2603],[43.70184,7.26065],[43.70178,7.26063]],

    /* APPT6 — Alsace-Lorraine → KEYNEST → 24D rue Gounod — 836 m, 11 min */
    ALSACE_KEYNEST_GOUNOD24: [[43.69783,7.25717],[43.6979,7.25751],[43.69782,7.25754],[43.69785,7.25771],[43.69788,7.25784],[43.69796,7.25815],[43.69815,7.25894],[43.69817,7.25903],[43.69825,7.25905],[43.69832,7.25906],[43.69881,7.25914],[43.69952,7.25924],[43.6996,7.25925],[43.69964,7.25926],[43.69967,7.25926],[43.70056,7.25941],[43.70062,7.25942],[43.70065,7.25943],[43.70068,7.25943],[43.70194,7.25961],[43.702,7.25962],[43.702,7.25964],[43.70205,7.25971],[43.70208,7.25975],[43.70211,7.25976],[43.70208,7.25975],[43.70205,7.25971],[43.702,7.25964],[43.70199,7.25968],[43.7019,7.26026],[43.7019,7.2603],[43.70184,7.26065],[43.70183,7.26074],[43.70182,7.26082],[43.70178,7.26082],[43.70114,7.26067],[43.70096,7.26063],[43.70095,7.26071],[43.70094,7.2608]],

    /* APPT5/7 — Gare Nice-Ville → KEYNEST → 41 av Clemenceau — 542 m, 7 min */
    NICEVILLE_KEYNEST_CLEMENCEAU41: [[43.70451,7.26158],[43.70455,7.26155],[43.70456,7.26157],[43.70461,7.26167],[43.70462,7.26166],[43.70447,7.26132],[43.70443,7.26136],[43.70436,7.26141],[43.70433,7.26144],[43.7043,7.26137],[43.70428,7.26139],[43.70424,7.26142],[43.70417,7.26141],[43.70413,7.2614],[43.70405,7.26134],[43.70402,7.26126],[43.70393,7.26105],[43.70391,7.26101],[43.7038,7.2611],[43.70377,7.26103],[43.70375,7.26105],[43.7037,7.26108],[43.70368,7.26104],[43.70359,7.26085],[43.70334,7.26028],[43.70327,7.26013],[43.70315,7.25983],[43.7031,7.25971],[43.70303,7.25977],[43.7028,7.25974],[43.70255,7.2597],[43.70205,7.25962],[43.702,7.25962],[43.702,7.25964],[43.70205,7.25971],[43.70208,7.25975],[43.70211,7.25976],[43.70208,7.25975],[43.70205,7.25971],[43.702,7.25964],[43.70199,7.25968],[43.7019,7.26026],[43.7019,7.2603],[43.70184,7.26065],[43.70178,7.26063]],

    /* APPT6 — Gare Nice-Ville → KEYNEST → 24D rue Gounod — 659 m, 8 min */
    NICEVILLE_KEYNEST_GOUNOD24: [[43.70451,7.26158],[43.70455,7.26155],[43.70456,7.26157],[43.70461,7.26167],[43.70462,7.26166],[43.70447,7.26132],[43.70443,7.26136],[43.70436,7.26141],[43.70433,7.26144],[43.7043,7.26137],[43.70428,7.26139],[43.70424,7.26142],[43.70417,7.26141],[43.70413,7.2614],[43.70405,7.26134],[43.70402,7.26126],[43.70393,7.26105],[43.70391,7.26101],[43.7038,7.2611],[43.70377,7.26103],[43.70375,7.26105],[43.7037,7.26108],[43.70368,7.26104],[43.70359,7.26085],[43.70334,7.26028],[43.70327,7.26013],[43.70315,7.25983],[43.7031,7.25971],[43.70303,7.25977],[43.7028,7.25974],[43.70255,7.2597],[43.70205,7.25962],[43.702,7.25962],[43.702,7.25964],[43.70205,7.25971],[43.70208,7.25975],[43.70211,7.25976],[43.70208,7.25975],[43.70205,7.25971],[43.702,7.25964],[43.70199,7.25968],[43.7019,7.26026],[43.7019,7.2603],[43.70184,7.26065],[43.70183,7.26074],[43.70182,7.26082],[43.70178,7.26082],[43.70114,7.26067],[43.70096,7.26063],[43.70095,7.26071],[43.70094,7.2608]]
  };

  /* Métadonnées des arrêts intermédiaires de remise des clés.
     - kind="keynest" : APPT5/6/7, point Keynest 38 rue Berlioz
     - kind="laverie" : APPT1/2, laverie "La Fête du Slip" 1 rue Badat
     idx = position du via-point dans la polyline du walk correspondant. */
  const WALK_VIA = {
    /* Keynest 38 rue Berlioz — APPT5/6/7 (Musiciens) */
    ALSACE_KEYNEST_CLEMENCEAU41:    { idx: 24, kind: "keynest", label: { fr: "Keynest — 38 rue Berlioz", en: "Keynest — 38 rue Berlioz" } },
    ALSACE_KEYNEST_GOUNOD24:        { idx: 24, kind: "keynest", label: { fr: "Keynest — 38 rue Berlioz", en: "Keynest — 38 rue Berlioz" } },
    NICEVILLE_KEYNEST_CLEMENCEAU41: { idx: 36, kind: "keynest", label: { fr: "Keynest — 38 rue Berlioz", en: "Keynest — 38 rue Berlioz" } },
    NICEVILLE_KEYNEST_GOUNOD24:     { idx: 36, kind: "keynest", label: { fr: "Keynest — 38 rue Berlioz", en: "Keynest — 38 rue Berlioz" } },
    /* Keynest 4ter av. Durante — APPT3/APPT4 (centre / quartier gare) */
    JEAN_MEDECIN_KEYNEST_NOTREDAME27: { idx: 33, kind: "keynest", label: { fr: "Keynest — 4ter av. Durante", en: "Keynest — 4ter av. Durante" } },
    NICEVILLE_KEYNEST_NOTREDAME27:    { idx: 32, kind: "keynest", label: { fr: "Keynest — 4ter av. Durante", en: "Keynest — 4ter av. Durante" } },
    GARE_THIERS_KEYNEST_AUBER38:      { idx: 36, kind: "keynest", label: { fr: "Keynest — 4ter av. Durante", en: "Keynest — 4ter av. Durante" } },
    NICEVILLE_KEYNEST_AUBER38:        { idx: 32, kind: "keynest", label: { fr: "Keynest — 4ter av. Durante", en: "Keynest — 4ter av. Durante" } },
    /* Laverie La Fête du Slip — APPT1/2 (boîte à clés sur place) */
    GARIBALDI_L2_LAVERIE_VERONESE:  { idx: 22, kind: "laverie", label: { fr: "Laverie — 1 rue Badat", en: "Laundromat — 1 rue Badat" } },
    GARIBALDI_L1_LAVERIE_VERONESE:  { idx: 12, kind: "laverie", label: { fr: "Laverie — 1 rue Badat", en: "Laundromat — 1 rue Badat" } }
  };

  /* Labels affichés sur les pins de chaque mini-carte piétonne. */
  const WALK_LABELS = {
    GARIBALDI_L2_LAVERIE_VERONESE: { start: "Garibaldi / Le Château (L2)",
                                     end:   { fr: "Le Véronese — 5 rue Barla", en: "Le Véronese — 5 rue Barla" } },
    GARIBALDI_L1_LAVERIE_VERONESE: { start: "Garibaldi / Le Château (L1)",
                                     end:   { fr: "Le Véronese — 5 rue Barla", en: "Le Véronese — 5 rue Barla" } },
    NICEVILLE_JEAN_MEDECIN:   { start: { fr: "Gare de Nice-Ville", en: "Nice-Ville" },
                                end:   "Jean Médecin" },
    NICEVILLE_GARE_THIERS:    { start: { fr: "Gare de Nice-Ville", en: "Nice-Ville" },
                                end:   "Gare Thiers" },
    GARE_THIERS_AUBER38:      { start: "Gare Thiers",
                                end:   { fr: "38 av. Auber", en: "38 av. Auber" } },
    JEAN_MEDECIN_NOTREDAME27: { start: "Jean Médecin",
                                end:   { fr: "27 av. Notre-Dame", en: "27 av. Notre-Dame" } },
    JEAN_MEDECIN_KEYNEST_NOTREDAME27: { start: "Jean Médecin",
                                        end:   { fr: "27 av. Notre-Dame", en: "27 av. Notre-Dame" } },
    NICEVILLE_NOTREDAME27:    { start: { fr: "Gare de Nice-Ville", en: "Nice-Ville" },
                                end:   { fr: "27 av. Notre-Dame", en: "27 av. Notre-Dame" } },
    NICEVILLE_KEYNEST_NOTREDAME27: { start: { fr: "Gare de Nice-Ville", en: "Nice-Ville" },
                                     end:   { fr: "27 av. Notre-Dame", en: "27 av. Notre-Dame" } },
    JEAN_MEDECIN_AUBER38:     { start: "Jean Médecin",
                                end:   { fr: "38 av. Auber", en: "38 av. Auber" } },
    NICEVILLE_AUBER38:        { start: { fr: "Gare de Nice-Ville", en: "Nice-Ville" },
                                end:   { fr: "38 av. Auber", en: "38 av. Auber" } },
    NICEVILLE_KEYNEST_AUBER38: { start: { fr: "Gare de Nice-Ville", en: "Nice-Ville" },
                                 end:   { fr: "38 av. Auber", en: "38 av. Auber" } },
    GARE_THIERS_KEYNEST_AUBER38: { start: "Gare Thiers",
                                   end:   { fr: "38 av. Auber", en: "38 av. Auber" } },
    ALSACE_KEYNEST_CLEMENCEAU41:    { start: "Alsace-Lorraine",
                                      end:   { fr: "41 av. G. Clemenceau", en: "41 av. G. Clemenceau" } },
    ALSACE_KEYNEST_GOUNOD24:        { start: "Alsace-Lorraine",
                                      end:   { fr: "24D rue Gounod", en: "24D rue Gounod" } },
    NICEVILLE_KEYNEST_CLEMENCEAU41: { start: { fr: "Gare de Nice-Ville", en: "Nice-Ville" },
                                      end:   { fr: "41 av. G. Clemenceau", en: "41 av. G. Clemenceau" } },
    NICEVILLE_KEYNEST_GOUNOD24:     { start: { fr: "Gare de Nice-Ville", en: "Nice-Ville" },
                                      end:   { fr: "24D rue Gounod", en: "24D rue Gounod" } }
  };

  /* ----- Tracés réels OSM (relation Tram L2 / L1 — Lignes d'Azur) ----- */
  /* L2 polyline : 232 points GPS du tracé réel du tramway
     entre l'arrêt Aéroport Terminal 1 et Garibaldi/Le Château. */
  const L2_POLY = [[43.66527,7.21085],[43.66533,7.21133],[43.66536,7.21162],[43.66537,7.21168],[43.66539,7.21175],[43.6654,7.21177],[43.66542,7.21181],[43.66544,7.21182],[43.66545,7.21184],[43.66547,7.21186],[43.66549,7.21188],[43.66551,7.21189],[43.66553,7.21191],[43.66556,7.21192],[43.66558,7.21192],[43.6656,7.21192],[43.66562,7.21192],[43.66565,7.21192],[43.66567,7.21192],[43.66622,7.21179],[43.66651,7.21173],[43.66683,7.21166],[43.6679,7.21149],[43.66842,7.21141],[43.66851,7.2114],[43.66869,7.21138],[43.66926,7.21133],[43.66933,7.21132],[43.66939,7.21133],[43.66942,7.21133],[43.66944,7.21134],[43.66946,7.21135],[43.66949,7.21136],[43.66951,7.21138],[43.66953,7.2114],[43.66956,7.21143],[43.66958,7.21145],[43.66959,7.21148],[43.66961,7.21151],[43.66963,7.21156],[43.66968,7.2117],[43.66994,7.21238],[43.67013,7.21286],[43.67014,7.21291],[43.67015,7.21296],[43.67016,7.21301],[43.67016,7.21307],[43.67016,7.21314],[43.67015,7.21325],[43.67005,7.21397],[43.67001,7.21431],[43.66993,7.21498],[43.66991,7.21509],[43.6699,7.21523],[43.66986,7.2155],[43.66976,7.21633],[43.66973,7.21658],[43.66966,7.21711],[43.66964,7.21728],[43.66946,7.21874],[43.66941,7.21913],[43.66937,7.2195],[43.66936,7.21957],[43.66936,7.21963],[43.66936,7.21967],[43.66936,7.2197],[43.66936,7.21975],[43.66936,7.2198],[43.66937,7.21985],[43.66938,7.2199],[43.66939,7.21995],[43.66942,7.22005],[43.66944,7.22009],[43.66945,7.22013],[43.66948,7.22017],[43.66951,7.22023],[43.66961,7.22038],[43.67041,7.2215],[43.67046,7.22158],[43.67052,7.22167],[43.6715,7.22303],[43.67194,7.22365],[43.672,7.22373],[43.67205,7.22381],[43.67228,7.22412],[43.67252,7.22446],[43.67323,7.22546],[43.67328,7.22554],[43.67333,7.22561],[43.67354,7.22591],[43.67378,7.22623],[43.67393,7.22641],[43.67415,7.22665],[43.67419,7.2267],[43.67424,7.22674],[43.67449,7.22695],[43.67458,7.22702],[43.67468,7.22709],[43.67511,7.22733],[43.67523,7.22741],[43.67534,7.22747],[43.67541,7.22752],[43.6758,7.22774],[43.67609,7.2279],[43.67644,7.2281],[43.67665,7.22822],[43.6769,7.22836],[43.67715,7.2285],[43.67782,7.22888],[43.67792,7.22894],[43.67807,7.22901],[43.6783,7.22911],[43.67832,7.22912],[43.67842,7.22916],[43.67864,7.22927],[43.67882,7.22936],[43.67933,7.22965],[43.67964,7.22983],[43.6798,7.22992],[43.67998,7.23002],[43.68011,7.23012],[43.68027,7.23023],[43.68035,7.2303],[43.68046,7.23039],[43.68073,7.23063],[43.68096,7.23083],[43.6813,7.23114],[43.68143,7.23126],[43.6815,7.23133],[43.6816,7.23142],[43.6821,7.23188],[43.6822,7.23198],[43.68226,7.23205],[43.68232,7.23212],[43.68261,7.23247],[43.68302,7.23302],[43.68315,7.23317],[43.68326,7.23329],[43.68359,7.2336],[43.68386,7.23387],[43.68495,7.23494],[43.68532,7.23532],[43.68539,7.23539],[43.68546,7.23547],[43.68567,7.23571],[43.68639,7.23657],[43.68658,7.2368],[43.68682,7.2371],[43.6871,7.23745],[43.68717,7.23755],[43.68725,7.23766],[43.68798,7.23879],[43.68899,7.24036],[43.68904,7.24045],[43.68936,7.24095],[43.68954,7.24123],[43.68972,7.24152],[43.68978,7.24161],[43.68984,7.24171],[43.69006,7.24204],[43.69041,7.2426],[43.69047,7.24269],[43.69052,7.24277],[43.69056,7.24287],[43.69061,7.24298],[43.69088,7.24373],[43.69125,7.24474],[43.69129,7.24486],[43.6914,7.24512],[43.69147,7.24528],[43.69165,7.24578],[43.69179,7.24617],[43.69207,7.24692],[43.6925,7.24811],[43.69255,7.24826],[43.69259,7.24836],[43.6929,7.24923],[43.69301,7.24953],[43.69342,7.25064],[43.69405,7.25246],[43.69429,7.25315],[43.6944,7.25338],[43.69456,7.25366],[43.69476,7.25393],[43.69494,7.25411],[43.69508,7.25422],[43.69527,7.25434],[43.69645,7.2549],[43.69662,7.25502],[43.6968,7.2552],[43.69701,7.25543],[43.69719,7.25568],[43.69742,7.25608],[43.69752,7.25631],[43.69762,7.25663],[43.69771,7.257],[43.69782,7.25752],[43.69818,7.2591],[43.69872,7.26138],[43.69896,7.26239],[43.69904,7.26272],[43.6994,7.26437],[43.69959,7.26515],[43.69973,7.26569],[43.70007,7.26673],[43.70039,7.26769],[43.70098,7.26947],[43.70141,7.27082],[43.70143,7.27235],[43.70147,7.27382],[43.70148,7.27397],[43.70149,7.27409],[43.70151,7.2742],[43.70171,7.27512],[43.70174,7.27525],[43.70178,7.27537],[43.70209,7.27628],[43.70212,7.27642],[43.70215,7.27656],[43.70217,7.27673],[43.70218,7.27688],[43.70218,7.27756],[43.70218,7.27764],[43.70216,7.27772],[43.70183,7.27882],[43.7018,7.27888],[43.70162,7.27919],[43.70139,7.27956],[43.70131,7.27966],[43.70101,7.27998],[43.70093,7.28005],[43.70021,7.2806]];

  /* L1 polyline : Gare Thiers → Garibaldi/Le Château (74 points).
     Tracé OSM officiel (relation 7173149) — passe par le tunnel
     Gare Thiers / Jean Médecin puis boucle Masséna → Opéra-Vieille Ville
     → Cathédrale-Vieille Ville → Garibaldi (Vieux-Nice). */
  const L1_POLY = [[43.70524,7.26509],[43.70475,7.2654],[43.7043,7.26568],[43.70341,7.26624],[43.70258,7.26678],[43.70213,7.26707],[43.7017,7.26734],[43.70119,7.26766],[43.7006,7.26803],[43.69985,7.26851],[43.69911,7.26897],[43.69881,7.26916],[43.69879,7.26918],[43.69837,7.26944],[43.69812,7.2696],[43.69804,7.26965],[43.69738,7.27007],[43.69735,7.27009],[43.69733,7.27011],[43.69729,7.27013],[43.69727,7.27014],[43.6969,7.27038],[43.69682,7.27044],[43.69677,7.2705],[43.69673,7.27057],[43.69672,7.2706],[43.69671,7.27064],[43.6967,7.27069],[43.69669,7.2708],[43.6967,7.27087],[43.69671,7.27093],[43.69672,7.27098],[43.69673,7.27103],[43.69712,7.27234],[43.69714,7.27241],[43.69719,7.27258],[43.69729,7.27295],[43.69739,7.27329],[43.6974,7.27331],[43.69766,7.27422],[43.69767,7.27426],[43.69768,7.27428],[43.69772,7.27444],[43.69774,7.27451],[43.6978,7.2747],[43.6979,7.27505],[43.69809,7.27568],[43.69816,7.27593],[43.69819,7.276],[43.69822,7.27607],[43.69825,7.27614],[43.69829,7.27623],[43.69845,7.27651],[43.69861,7.27682],[43.6987,7.27699],[43.69877,7.27708],[43.69887,7.27719],[43.69916,7.2775],[43.69935,7.27769],[43.69969,7.27804],[43.69992,7.27826],[43.7001,7.27843],[43.70021,7.27854],[43.70027,7.2786],[43.70041,7.27878],[43.70053,7.27897],[43.70066,7.27923],[43.70079,7.27948],[43.70096,7.27987],[43.70096,7.27988],[43.70099,7.27993],[43.70101,7.27997],[43.70107,7.28009],[43.70112,7.28019]];

  /* Tracés SVG fallback (utilisés si Leaflet absent) */
  const L2_PATH = "M 80 530 L 130 510 L 175 480 L 215 460 L 245 445 L 285 430 L 330 410 L 380 380 L 430 345 L 485 305 L 540 270 L 600 245 L 660 230 L 720 220 L 780 215 L 840 215 L 880 220 L 905 235 L 920 255";
  const L1_PATH = "M 480 320 L 540 295 L 620 265 L 720 235 L 820 220";

  /* Configurations par appartement — itinéraires authentiques Lignes d'Azur.
     Chaque config définit deux onglets ("airport" et "train") qui peuvent
     contenir : walkPre → wait → tram → walk (séquence complète) OU walkOnly
     (étape unique de marche, lorsque le tramway n'apporte rien). */

  /* APPT1 + APPT2 — jumeaux Le Véronese, 5 rue Barla (Port de Nice).
     Depuis la gare : L1 directe Gare Thiers → Garibaldi (Gare Thiers L1
     se trouve juste à côté de la gare SNCF, côté nord/av. Malausséna).
     Récupération des clés à la laverie "La Fête du Slip" au 1 rue Badat
     (boîte à clés sur place, code envoyé par message Airbnb). */
  const APPT1_2 = {
    label:   { fr: "Le Véronese — 5 rue Barla", en: "Le Véronese — 5 rue Barla" },
    address: { fr: "5 rue Barla, 06300 Nice", en: "5 rue Barla, 06300 Nice" },
    arrival: { lat: 43.70238, lng: 7.28148 },
    /* Bloc "Réception des clés" affiché dans la carte de marche.
       laverie = boîte à clés dans la laverie "La Fête du Slip" 1 rue Badat.
       Le code de la boîte est envoyé via Airbnb avant l'arrivée et est
       aussi consultable sur delfosseproperties.com (espace privé). */
    laverie: {
      name: "La Fête du Slip",
      address: { fr: "1 rue Badat, 06300 Nice", en: "1 rue Badat, 06300 Nice" },
      link: "https://www.delfosseproperties.com/",
      note: { fr: "Code de la boîte à clés envoyé avant votre arrivée par message Airbnb (consultable aussi dans votre espace privé Delfosse Properties).",
              en: "Key-safe code sent before your arrival via Airbnb message (also available in your Delfosse Properties private space)." }
    },
    airport: {
      wait: { line: "L2", stop: "Aéroport Terminal 1", direction: "Port Lympia", waitText: { fr: "≈ 1 min", en: "≈ 1 min" } },
      tram: { line: "L2", from: "Aéroport Terminal 1", to: "Garibaldi / Le Château", duration: 29 },
      walk: { from: "Garibaldi / Le Château", duration: 5, distanceM: 411, walkKey: "GARIBALDI_L2_LAVERIE_VERONESE" }
    },
    train: {
      walkPre: { from: { fr: "Gare de Nice-Ville", en: "Nice-Ville train station" }, to: "Gare Thiers", duration: 5, distanceM: 391, walkKey: "NICEVILLE_GARE_THIERS" },
      wait: { line: "L1", stop: "Gare Thiers", direction: "Hôpital Pasteur", waitText: { fr: "≈ 2 min", en: "≈ 2 min" } },
      tram: { line: "L1", from: "Gare Thiers", to: "Garibaldi / Le Château", duration: 7 },
      walk: { from: "Garibaldi / Le Château", duration: 3, distanceM: 209, walkKey: "GARIBALDI_L1_LAVERIE_VERONESE" }
    }
  };

  /* APPT3 — 27 avenue Notre-Dame (Hyper centre, près de la basilique).
     Récupération des clés au point Keynest 4ter av. Durante avant
     d'arriver à l'appartement. */
  const APPT3 = {
    label:   { fr: "27 avenue Notre-Dame", en: "27 avenue Notre-Dame" },
    address: { fr: "27 avenue Notre-Dame, 06000 Nice", en: "27 avenue Notre-Dame, 06000 Nice" },
    arrival: { lat: 43.70362, lng: 7.26709 },
    keynest: {
      address: { fr: "4ter avenue Durante, 06000 Nice", en: "4ter avenue Durante, 06000 Nice" },
      link: "https://keynest.com",
      note: { fr: "Code de retrait communiqué avant votre arrivée par message (Airbnb).",
              en: "Pickup code shared before your arrival via Airbnb message." }
    },
    airport: {
      wait: { line: "L2", stop: "Aéroport Terminal 1", direction: "Port Lympia", waitText: { fr: "≈ 1 min", en: "≈ 1 min" } },
      tram: { line: "L2", from: "Aéroport Terminal 1", to: "Jean Médecin", duration: 22 },
      walk: { from: "Jean Médecin", duration: 13, distanceM: 1065, walkKey: "JEAN_MEDECIN_KEYNEST_NOTREDAME27" }
    },
    train: {
      walkOnly: { from: { fr: "Gare de Nice-Ville", en: "Nice-Ville train station" }, duration: 11, distanceM: 926, walkKey: "NICEVILLE_KEYNEST_NOTREDAME27" }
    }
  };

  /* APPT4 — 38 avenue Auber (Quartier gare).
     Récupération des clés au point Keynest 4ter av. Durante avant
     d'arriver à l'appartement. Depuis l'aéroport : L2 → Jean Médecin,
     correspondance L1 → Gare Thiers, puis marche via Keynest. */
  const APPT4 = {
    label:   { fr: "38 avenue Auber", en: "38 avenue Auber" },
    address: { fr: "38 avenue Auber, 06000 Nice", en: "38 avenue Auber, 06000 Nice" },
    arrival: { lat: 43.70378, lng: 7.26190 },
    keynest: {
      address: { fr: "4ter avenue Durante, 06000 Nice", en: "4ter avenue Durante, 06000 Nice" },
      link: "https://keynest.com",
      note: { fr: "Code de retrait communiqué avant votre arrivée par message (Airbnb).",
              en: "Pickup code shared before your arrival via Airbnb message." }
    },
    airport: {
      wait:  { line: "L2", stop: "Aéroport Terminal 1", direction: "Port Lympia", waitText: { fr: "≈ 1 min", en: "≈ 1 min" } },
      tram:  { line: "L2", from: "Aéroport Terminal 1", to: "Jean Médecin", duration: 22 },
      wait2: { line: "L1", stop: "Jean Médecin", direction: "Henri Sappia", waitText: { fr: "≈ 3 min", en: "≈ 3 min" }, transfer: true },
      tram2: { line: "L1", from: "Jean Médecin", to: "Gare Thiers", direction: "Henri Sappia", duration: 2 },
      walk:  { from: "Gare Thiers", duration: 11, distanceM: 959, walkKey: "GARE_THIERS_KEYNEST_AUBER38" }
    },
    train: {
      walkOnly: { from: { fr: "Gare de Nice-Ville", en: "Nice-Ville train station" }, duration: 9, distanceM: 728, walkKey: "NICEVILLE_KEYNEST_AUBER38" }
    }
  };

  /* APPT5 + APPT7 — 41 avenue Georges Clemenceau (Musiciens).
     Récupération des clés au point Keynest (38 rue Berlioz) avant
     l'appartement, dans les deux sens (aéroport et gare). */
  const APPT5_7 = {
    label:   { fr: "41 avenue Georges Clemenceau", en: "41 avenue Georges Clemenceau" },
    address: { fr: "41 avenue Georges Clemenceau, 06000 Nice", en: "41 avenue Georges Clemenceau, 06000 Nice" },
    arrival: { lat: 43.70179, lng: 7.26055 },
    /* Bloc "Réception des clés" affiché dans la carte de marche.
       keynestLink est le lien Keynest spécifique à l'appartement (à
       remplir par appart côté hôte) — par défaut keynest.com. Le code
       PIN/QR est communiqué au voyageur avant arrivée via Airbnb. */
    keynest: {
      address: { fr: "38 rue Berlioz, 06000 Nice", en: "38 rue Berlioz, 06000 Nice" },
      link: "https://keynest.com",
      note: { fr: "Code de retrait communiqué avant votre arrivée par message (Airbnb).",
              en: "Pickup code shared before your arrival via Airbnb message." }
    },
    airport: {
      wait: { line: "L2", stop: "Aéroport Terminal 1", direction: "Port Lympia", waitText: { fr: "≈ 1 min", en: "≈ 1 min" } },
      tram: { line: "L2", from: "Aéroport Terminal 1", to: "Alsace-Lorraine", duration: 20 },
      walk: { from: "Alsace-Lorraine", duration: 9, distanceM: 718, walkKey: "ALSACE_KEYNEST_CLEMENCEAU41" }
    },
    train: {
      walkOnly: { from: { fr: "Gare de Nice-Ville", en: "Nice-Ville train station" }, duration: 7, distanceM: 542, walkKey: "NICEVILLE_KEYNEST_CLEMENCEAU41" }
    }
  };

  /* APPT6 — 24D rue Gounod (Musiciens).
     Mêmes scénarios via Keynest (38 rue Berlioz) avant l'appartement. */
  const APPT6 = {
    label:   { fr: "24D rue Gounod", en: "24D rue Gounod" },
    address: { fr: "24D rue Gounod, 06000 Nice", en: "24D rue Gounod, 06000 Nice" },
    arrival: { lat: 43.70098, lng: 7.26081 },
    keynest: {
      address: { fr: "38 rue Berlioz, 06000 Nice", en: "38 rue Berlioz, 06000 Nice" },
      link: "https://keynest.com",
      note: { fr: "Code de retrait communiqué avant votre arrivée par message (Airbnb).",
              en: "Pickup code shared before your arrival via Airbnb message." }
    },
    airport: {
      wait: { line: "L2", stop: "Aéroport Terminal 1", direction: "Port Lympia", waitText: { fr: "≈ 1 min", en: "≈ 1 min" } },
      tram: { line: "L2", from: "Aéroport Terminal 1", to: "Alsace-Lorraine", duration: 20 },
      walk: { from: "Alsace-Lorraine", duration: 11, distanceM: 836, walkKey: "ALSACE_KEYNEST_GOUNOD24" }
    },
    train: {
      walkOnly: { from: { fr: "Gare de Nice-Ville", en: "Nice-Ville train station" }, duration: 8, distanceM: 659, walkKey: "NICEVILLE_KEYNEST_GOUNOD24" }
    }
  };

  const ROUTES = {
    "appt1": APPT1_2, "appt2": APPT1_2,
    "appt3": APPT3,
    "appt4": APPT4,
    "appt5": APPT5_7, "appt7": APPT5_7,
    "appt6": APPT6
  };

  /* Cfg actuellement rendue (utilisée par les fonctions Leaflet pour
     accéder à la coordonnée d'arrivée et au label de l'appartement). */
  let _activeCfg = null;

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
      stepTransfer: "Correspondance",
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
      stepTransfer: "Transfer",
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
    // Pas de navigation pour une étape unique (mode walkOnly).
    if (total <= 1) return "";
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
     le SVG par une vraie carte de Nice (CartoDB Voyager) avec arrêts
     épinglés et ligne tramway animée.
     fromStop / toStop : noms d'arrêts utilisés pour cropper la polyline
     réelle (Aéroport→Garibaldi peut être réduit à Aéroport→Jean Médecin
     ou Aéroport→Alsace-Lorraine selon l'appartement de destination). */
  function renderMap(stops, pathD, lineId, fromStop, toStop) {
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
        '<div class="dp-tr-leaflet" data-line="' + esc(lineId) +
          '" data-from="' + esc(fromStop || "") + '" data-to="' + esc(toStop || "") +
          '" aria-hidden="true"></div>' +
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
    const isTransfer = !!w.transfer;
    const title = isTransfer ? tt("stepTransfer") : tt("stepWait");
    const cardCls = "dp-tr-card" + (isTransfer ? " dp-tr-card-transfer" : "");
    return (
      '<article class="' + cardCls + '" data-step="0">' +
        renderStepNav(idx, total) +
        '<header class="dp-tr-card-head">' +
          '<div class="dp-tr-time"><span class="dp-tr-time-ring">' + CLOCK_GLYPH + '</span><span class="dp-tr-time-val">—:—</span></div>' +
          '<h3 class="dp-tr-card-title">' + esc(title) + '</h3>' +
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
    const iTo   = allStops.indexOf(t.to);
    // Slice + inversion si on remonte la ligne (ex. L1 Jean Médecin → Gare Thiers)
    const i0 = Math.max(0, Math.min(iFrom, iTo));
    const i1 = Math.max(iFrom, iTo);
    let stops = allStops.slice(i0, i1 + 1);
    if (iFrom > iTo) stops = stops.slice().reverse();
    const pathD = t.line === "L2" ? L2_PATH : L1_PATH;
    const middleCount = Math.max(0, stops.length - 2);
    const middleLabel = middleCount === 1 ? tt("stopsBetween1") : tt("stopsBetween");
    // Direction explicite si fournie, sinon valeur par défaut par ligne.
    // (L1 Sud→Nord = "Henri Sappia", L1 Nord→Sud = "Hôpital Pasteur",
    //  L2 Ouest→Est = "Port Lympia", L2 Est→Ouest = "Aéroport T2".)
    const direction = t.direction || (t.line === "L2" ? "Port Lympia" : "Hôpital Pasteur");
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
              '<span class="dp-tr-meta-v">' + esc(direction) + '</span>' +
            '</div>' +
          '</div>' +
          renderMap(stops, pathD, t.line, t.from, t.to) +
          '<div class="dp-tr-stops-summary">' +
            '<span class="dp-tr-summary-pill">' + middleCount + ' ' + esc(middleLabel) + '</span>' +
          '</div>' +
          renderStopsList(stops, { startTime: "—:—", endTime: "—:—" }) +
        '</div>' +
      '</article>'
    );
  }

  /* renderWalkCard
     mode :
       - "pre"  → marche avant le tramway (Gare → arrêt). Affiche from→to.
       - "final"→ marche après le tramway (arrêt → adresse). Affiche l'adresse.
       - "only" → seul mode pour cet onglet (gare proche de l'appart). Affiche from→to. */
  function renderWalkCard(w, idx, total, mode) {
    const isPre = mode === "pre";
    const isOnly = mode === "only";
    const isFinal = !isPre && !isOnly;
    const headTitle = isPre ? tt("stepWalkPre") : tt("stepWalk");
    const walkKey = w.walkKey || (isPre ? "NICEVILLE_JEAN_MEDECIN" : "GARIBALDI_L2_LAVERIE_VERONESE");
    const dataStep = isPre ? "pre" : (isOnly ? "only" : "2");

    // Bloc "Réception des clés" : affiché quand le tracé passe par un point
    // de remise (WALK_VIA présent) ET que l'appartement a la config associée.
    // Deux variantes : Keynest (APPT5/6/7) ou Laverie La Fête du Slip (APPT1/2).
    const viaMeta = WALK_VIA[walkKey];
    let keynestBlock = "";
    if (viaMeta && _activeCfg) {
      let kp = null;       // config { name, address, link, note }
      let logoUrl = null;
      let logoAlt = null;
      let titleFr = null, titleEn = null;
      let linkFr = null, linkEn = null;
      let variantCls = "";

      if (viaMeta.kind === "keynest" && _activeCfg.keynest) {
        kp = _activeCfg.keynest;
        logoUrl = KEYNEST_LOGO_URL;
        logoAlt = "Keynest";
        titleFr = "Réception des clés — Keynest";
        titleEn = "Key pickup — Keynest";
        linkFr = "Ouvrir le point Keynest";
        linkEn = "Open Keynest pickup point";
      } else if (viaMeta.kind === "laverie" && _activeCfg.laverie) {
        kp = _activeCfg.laverie;
        logoUrl = LAVERIE_LOGO_URL;
        logoAlt = kp.name || "Laverie";
        const lavName = kp.name || "Laverie";
        titleFr = "Réception des clés — Laverie « " + lavName + " »";
        titleEn = "Key pickup — Laundromat \"" + lavName + "\"";
        linkFr = "Voir les détails de la boîte à clés";
        linkEn = "See key-safe details";
        variantCls = " is-laverie";
      }

      if (kp) {
        const keyAddr = tx(kp.address) || "";
        const keyNote = tx(kp.note) || "";
        const keyLink = kp.link || "#";
        // Le logo Keynest s'affiche dans le bloc description (à gauche du
        // texte). Pour la laverie, on reste en mode texte seul (le logo
        // photo est moins propre dans le bloc — la marque est dans le titre).
        const showLogo = viaMeta.kind === "keynest";
        keynestBlock =
          '<aside class="dp-tr-keynest-notice' + variantCls + (showLogo ? " has-logo" : "") + '" role="note">' +
            (showLogo
              ? '<div class="dp-tr-keynest-notice-logo">' +
                  '<img src="' + esc(logoUrl) + '" alt="' + esc(logoAlt) + '" />' +
                '</div>'
              : "") +
            '<div class="dp-tr-keynest-notice-text">' +
              '<div class="dp-tr-keynest-notice-title">' +
                esc(lang() === "en" ? titleEn : titleFr) +
              '</div>' +
              (keyAddr ? '<div class="dp-tr-keynest-notice-addr">' + esc(keyAddr) + '</div>' : "") +
              (keyNote ? '<div class="dp-tr-keynest-notice-note">' + esc(keyNote) + '</div>' : "") +
              '<a class="dp-tr-keynest-notice-link" href="' + esc(keyLink) + '" target="_blank" rel="noopener">' +
                esc(lang() === "en" ? linkEn : linkFr) +
                ' <span aria-hidden="true">→</span>' +
              '</a>' +
            '</div>' +
          '</aside>';
      }
    }

    return (
      '<article class="dp-tr-card dp-tr-card-walk" data-step="' + dataStep + '">' +
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
              (isFinal
                ? '<span class="dp-tr-meta-k">' + esc(tt("address")) + '</span><span class="dp-tr-meta-v" data-final-addr></span>'
                : isOnly
                  ? '<span class="dp-tr-meta-k">' + esc(tt("foot")) + '</span><span class="dp-tr-meta-v">' + esc(tx(w.from)) + ' → <span data-final-addr></span></span>'
                  : '<span class="dp-tr-meta-k">' + esc(tt("foot")) + '</span><span class="dp-tr-meta-v">' + esc(tx(w.from)) + ' → ' + esc(tx(w.to)) + '</span>') +
            '</div>' +
          '</div>' +
          // Mini carte Leaflet sur le tracé piéton réel (rues exactes)
          '<div class="dp-tr-map dp-tr-map-walk" aria-label="' + esc(tt("mapsAlt")) + '">' +
            '<div class="dp-tr-leaflet" data-line="WALK" data-walk-key="' + esc(walkKey) + '" aria-hidden="true"></div>' +
          '</div>' +
          keynestBlock +
        '</div>' +
      '</article>'
    );
  }

  /* ----- Build full section content ----- */
  function buildSteps(routeKey, cfg) {
    const r = cfg[routeKey];
    if (!r) return [];

    // Mode "walkOnly" : la gare est si proche de l'appartement que prendre
    // le tramway n'a pas de sens. On rend une seule carte "Marchez vers".
    if (r.walkOnly) {
      return [renderWalkCard(r.walkOnly, 0, 1, "only")];
    }

    const arr = [];
    if (r.walkPre) arr.push({ kind: "walkPre", data: r.walkPre });
    if (r.wait)    arr.push({ kind: "wait", data: r.wait });
    if (r.tram)    arr.push({ kind: "tram", data: r.tram });
    // Correspondance optionnelle (tram → tram via Jean Médecin) :
    // wait2 = attente à l'arrêt de correspondance, tram2 = trajet suivant
    if (r.wait2)   arr.push({ kind: "wait", data: r.wait2 });
    if (r.tram2)   arr.push({ kind: "tram", data: r.tram2 });
    if (r.walk)    arr.push({ kind: "walk", data: r.walk });
    const total = arr.length;
    return arr.map((step, i) => {
      if (step.kind === "wait") return renderWaitCard(step.data, i, total);
      if (step.kind === "tram") return renderTramCard(step.data, i, total);
      if (step.kind === "walkPre") return renderWalkCard(step.data, i, total, "pre");
      return renderWalkCard(step.data, i, total, "final");
    });
  }

  function buildContent(user) {
    const cfg = (user && user.transit) || ROUTES[user && user.login] || APPT1_2;
    _activeCfg = cfg;
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
    // Lecture du tracé via data-walk-key (référence dans WALK_PATHS)
    const walkKey = container.getAttribute("data-walk-key") || "GARIBALDI_L2_LAVERIE_VERONESE";
    const path = WALK_PATHS[walkKey];
    const labels = WALK_LABELS[walkKey] || { start: "", end: "" };
    if (!path || path.length < 2) return null;

    let map;
    try {
      // Carte interactive : on active le zoom (boutons + molette + double-clic)
      // pour que l'utilisateur puisse explorer le détail du tracé piéton —
      // surtout utile sur APPT5/6/7 où le marqueur Keynest et les pins
      // de départ/arrivée se chevauchent à zoom faible.
      map = L.map(container, {
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        boxZoom: false,
        dragging: true,
        attributionControl: false,
        keyboard: true,
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

      // Numéros d'étape : 1 (départ), 2 (Keynest si présent), 2 ou 3 (arrivée)
      const hasVia = WALK_VIA[walkKey] && path[WALK_VIA[walkKey].idx];
      const startNum = 1;
      const viaNum = hasVia ? 2 : null;
      const endNum = hasVia ? 3 : 2;

      // Pin de départ (cercle navy + or, badge numéroté)
      const startIcon = L.divIcon({
        className: "dp-tr-mk-wrap",
        html: '<div class="dp-tr-mk is-start" style="--sz:22px"></div>' +
              '<span class="dp-tr-mk-num">' + startNum + '</span>',
        iconSize: [22, 22], iconAnchor: [11, 11]
      });
      L.marker(path[0], { icon: startIcon, keyboard: false, riseOnHover: true })
        .addTo(map)
        .bindTooltip(tx(labels.start), {
          direction: "top", permanent: true,
          className: "dp-tr-tt dp-tr-tt-perm",
          offset: [0, -8]
        });

      // Pin d'arrivée (gros pin or, badge numéroté)
      const arrivalIcon = L.divIcon({
        className: "dp-tr-arrival-wrap",
        html: '<div class="dp-tr-arrival">' + PIN_GLYPH + '</div>' +
              '<span class="dp-tr-mk-num is-end">' + endNum + '</span>',
        iconSize: [28, 36], iconAnchor: [14, 32]
      });
      L.marker(path[path.length - 1], { icon: arrivalIcon, keyboard: false })
        .addTo(map)
        .bindTooltip(tx(labels.end), {
          direction: "top", permanent: true,
          className: "dp-tr-tt dp-tr-tt-arrival",
          offset: [0, -8]
        });

      // Arrêt intermédiaire (point de remise des clés). Deux variantes :
      // - kind="keynest" : badge avec logo officiel Keynest (trampette
      //   horizontale 80×36, suffisamment éloignée de l'appartement pour
      //   ne pas se superposer au pin d'arrivée).
      // - kind="laverie" : petit marqueur numéroté simple (la laverie 1
      //   rue Badat est à seulement 25 m de 5 rue Barla, le badge logo
      //   se superposerait au pin d'arrivée).
      const viaMeta = WALK_VIA[walkKey];
      if (viaMeta && path[viaMeta.idx]) {
        let viaIcon, tooltipCls, offsetY;
        if (viaMeta.kind === "keynest") {
          viaIcon = L.divIcon({
            className: "dp-tr-keynest-wrap",
            html:
              '<div class="dp-tr-keynest-mk">' +
                '<div class="dp-tr-keynest-pulse" aria-hidden="true"></div>' +
                '<div class="dp-tr-keynest-badge">' +
                  '<img src="' + KEYNEST_LOGO_URL + '" alt="Keynest" />' +
                '</div>' +
                '<span class="dp-tr-mk-num is-via">' + viaNum + '</span>' +
              '</div>',
            iconSize: [80, 36], iconAnchor: [40, 18]
          });
          tooltipCls = "dp-tr-tt dp-tr-tt-keynest";
          offsetY = -22;
        } else {
          // Variante laverie ou autre : marqueur simple numéroté
          viaIcon = L.divIcon({
            className: "dp-tr-mk-wrap dp-tr-mk-via-wrap",
            html:
              '<div class="dp-tr-via-pulse" aria-hidden="true"></div>' +
              '<div class="dp-tr-mk is-via" style="--sz:22px"></div>' +
              '<span class="dp-tr-mk-num is-via">' + viaNum + '</span>',
            iconSize: [22, 22], iconAnchor: [11, 11]
          });
          tooltipCls = "dp-tr-tt dp-tr-tt-perm dp-tr-tt-via";
          offsetY = -8;
        }
        L.marker(path[viaMeta.idx], { icon: viaIcon, keyboard: false, riseOnHover: true })
          .addTo(map)
          .bindTooltip(tx(viaMeta.label), {
            direction: "top", permanent: true,
            className: tooltipCls,
            offset: [0, offsetY]
          });
      }

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

      // Bounds initiaux (totalité du tracé) — mémorisés pour pouvoir
      // dézoomer après un zoom de fin.
      const initialBounds = bounds;
      const endLatLng = L.latLng(path[path.length - 1][0], path[path.length - 1][1]);

      function animateWalker() {
        // Reset au point de départ
        walker.setLatLng(path[0]);
        const wel0 = walker.getElement();
        if (wel0) wel0.classList.remove("is-arrived");
        // Vue d'ensemble pour relancer la séquence depuis zéro
        try { map.fitBounds(initialBounds, { padding: [40, 40], maxZoom: 18, animate: true, duration: 0.6 }); } catch (e) {}

        const startTs = performance.now();
        const dur = 4200;
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
            // Auto-zoom sur la zone d'arrivée pour bien voir l'étape finale
            try { map.flyTo(endLatLng, 18, { duration: 1.4 }); } catch (e) {}
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

    const allStations = lineId === "L2" ? L2_STATIONS : L1_STATIONS;
    const fullPoly = lineId === "L2" ? L2_POLY : L1_POLY;
    if (!allStations || allStations.length < 2) return null;

    // Filtrer les stations affichées selon les arrêts from/to déclarés
    // sur le container (data-from / data-to). Si aucun n'est précisé, on
    // affiche la totalité de la ligne.
    const fromName = container.getAttribute("data-from") || "";
    const toName   = container.getAttribute("data-to") || "";
    const findStop = (n) => {
      if (!n) return -1;
      for (let i = 0; i < allStations.length; i++) if (allStations[i].name === n) return i;
      return -1;
    };
    let iFromStn = findStop(fromName);
    let iToStn   = findStop(toName);
    if (iFromStn < 0) iFromStn = 0;
    if (iToStn < 0)   iToStn = allStations.length - 1;
    let stations = allStations.slice(Math.min(iFromStn, iToStn), Math.max(iFromStn, iToStn) + 1);
    if (iFromStn > iToStn) stations = stations.slice().reverse();

    // Cropper le polyline OSM aux index les plus proches des stops
    // from/to (le tracé suit les rues, on slice par indice GPS).
    function nearestPolyIdx(lat, lng) {
      let best = 0, bestD = Infinity;
      for (let i = 0; i < fullPoly.length; i++) {
        const dLat = fullPoly[i][0] - lat;
        const dLng = fullPoly[i][1] - lng;
        const d = dLat * dLat + dLng * dLng;
        if (d < bestD) { bestD = d; best = i; }
      }
      return best;
    }
    let iFromPoly = 0;
    let iToPoly   = fullPoly.length - 1;
    if (iFromStn >= 0 && iFromStn < allStations.length) {
      iFromPoly = nearestPolyIdx(allStations[iFromStn].lat, allStations[iFromStn].lng);
    }
    if (iToStn >= 0 && iToStn < allStations.length) {
      iToPoly = nearestPolyIdx(allStations[iToStn].lat, allStations[iToStn].lng);
    }
    let realPath = fullPoly.slice(Math.min(iFromPoly, iToPoly), Math.max(iFromPoly, iToPoly) + 1);
    if (iFromPoly > iToPoly) realPath = realPath.slice().reverse();

    let map;
    try {
    // Carte tramway interactive — boutons zoom + molette + double-clic actifs
    // pour explorer en détail le tracé sur Nice (long itinéraire, beaucoup
    // d'arrêts intermédiaires sur la L2 de l'aéroport).
    map = L.map(container, {
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: false,
      dragging: true,
      attributionControl: false,
      keyboard: true,
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
    // Ajoute le pin de l'appartement aux bounds pour qu'il soit visible
    if (_activeCfg && _activeCfg.arrival) {
      bounds.extend([_activeCfg.arrival.lat, _activeCfg.arrival.lng]);
    }
    map.fitBounds(bounds, { padding: [22, 22] });

    // Tracé tramway : on utilise le polyline RÉEL OSM cropé aux indices
    // calculés ci-dessus (suit les rues et les tunnels, pas une ligne
    // droite entre arrêts). realPath est défini avant le try.
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

    // Marqueurs des arrêts. Le départ et l'arrivée portent un numéro
     // d'étape (1 = départ tram, N = arrivée tram) pour repérage visuel.
    stations.forEach((s, i) => {
      const isStart = i === 0;
      const isEnd = i === stations.length - 1;
      const cls = "dp-tr-mk" + (isStart ? " is-start" : "") + (isEnd ? " is-end" : "");
      const sz = (isStart || isEnd) ? 22 : 10;
      let html = '<div class="' + cls + '" style="--sz:' + sz + 'px;animation-delay:' + (400 + i * 90) + 'ms"></div>';
      if (isStart) html += '<span class="dp-tr-mk-num">1</span>';
      else if (isEnd) html += '<span class="dp-tr-mk-num is-end">' + stations.length + '</span>';
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

    // Pin d'arrivée — coordonnées de l'appartement (lue depuis _activeCfg)
    if ((lineId === "L2" || lineId === "L1") && _activeCfg && _activeCfg.arrival) {
      const arrivalIcon = L.divIcon({
        className: "dp-tr-arrival-wrap",
        html: '<div class="dp-tr-arrival">' + PIN_GLYPH + '</div>',
        iconSize: [28, 36],
        iconAnchor: [14, 32]
      });
      const apartLabel = tx(_activeCfg.label);
      const ttLabel = (lang() === "en" ? "Your apartment" : "Votre appartement") + (apartLabel ? " — " + apartLabel : "");
      L.marker([_activeCfg.arrival.lat, _activeCfg.arrival.lng], { icon: arrivalIcon, keyboard: false })
        .addTo(map)
        .bindTooltip(ttLabel, {
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

    // Bounds initiaux + dernier point du tracé pour zoom de fin
    const initialTramBounds = bounds;
    const tramEndLatLng = L.latLng(realPath[realPath.length - 1][0], realPath[realPath.length - 1][1]);

    function animateTram() {
      if (!tramMarker) return;
      // Reset au début pour les replays successifs
      tramMarker.setLatLng(realPath[0]);
      const tel0 = tramMarker.getElement();
      if (tel0) tel0.classList.remove("is-arrived");
      try { map.fitBounds(initialTramBounds, { padding: [22, 22], animate: true, duration: 0.6 }); } catch (e) {}

      const startTs = performance.now();
      const dur = 4000;
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
        tramMarker.setLatLng([lat, lng]);
        if (p < 1) requestAnimationFrame(tick);
        else {
          const el = tramMarker.getElement();
          if (el) el.classList.add("is-arrived");
          // Auto-zoom sur la zone d'arrivée pour voir l'appart final
          try { map.flyTo(tramEndLatLng, 16, { duration: 1.4 }); } catch (e) {}
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

  /* Timer global pour le replay automatique de l'animation active toutes
     les 15 secondes. Une seule animation tourne à la fois (celle de l'étape
     actuellement visible) — on annule la précédente à chaque changement. */
  let _replayTimer = null;
  function clearReplayTimer() {
    if (_replayTimer) { clearInterval(_replayTimer); _replayTimer = null; }
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
      if (fb) fb.style.display = "none";
    } else {
      setTimeout(() => map.invalidateSize(true), 30);
    }

    // Annule tout replay programmé pour une autre étape avant d'en lancer
    // un nouveau pour celle-ci.
    clearReplayTimer();

    if (typeof lf._dpAnimateTram === "function") {
      // Premier passage avec léger délai (laisse le tracé se redessiner)
      setTimeout(lf._dpAnimateTram, 700);
      // Replay automatique toutes les 15 s tant que l'étape reste active
      _replayTimer = setInterval(() => {
        if (typeof lf._dpAnimateTram === "function") lf._dpAnimateTram();
      }, 15000);
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
