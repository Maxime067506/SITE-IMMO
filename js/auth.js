/* ============================================================
   Delfosse Properties — Authentification voyageurs
   7 séjours = 7 comptes. Les données reflètent les vraies
   informations collectées sur chaque annonce Airbnb.
   (Démo : identifiants en clair. En prod → backend + bcrypt.)
   ============================================================ */

const DP_USERS = {

  /* N°01 — Notre appartement du port (ex L'Amiral) */
  "martin": {
    password: "port2026",
    name: "Famille Martin", firstname: "Claire",
    property: "Notre appartement du port", property_no: "N°01",
    property_sub: "Vue sur les toits de Nice",
    location: "5 rue Barla · Port de Nice",
    dates_in: "12 juillet 2026", dates_out: "19 juillet 2026",
    nights: 7, guests: 4, total: "2 380 €", status: "Confirmé",
    wifi_ssid: "Delfosse-Amiral", wifi_pass: "portbarla06",
    arrival_code: "2847",
    concierge_name: "Sophie Laurent",
    concierge_phone: "+33 6 12 34 56 78",
    concierge_mail:  "sophie@delfosse-properties.fr",
    airbnb: "https://www.airbnb.fr/rooms/1361669686960380718",
    rating: "4,87", reviews: 75,
    image: "img/airbnb/01-amiral/photo-01.jpg",
    nearby: "Tramway 1 min · Port face · Garibaldi 3 min · Vieux Nice 5 min",
    extras: [
      { label: "Dégustation huîtres au port",   status: "Réservé — 13 juillet, 12 h 30" },
      { label: "Transfert aéroport Nice",       status: "Confirmé — 12 juillet, 15 h 30" },
      { label: "Ménage intermédiaire",          status: "Planifié — 16 juillet" }
    ]
  },

  /* N°02 — Son jumeau du port (ex Le Commodore) */
  "nguyen": {
    password: "jumeau2026",
    name: "Famille Nguyen", firstname: "Linh",
    property: "Son jumeau du port", property_no: "N°02",
    property_sub: "Vue sur les toits de Nice",
    location: "5 rue Barla · Port de Nice",
    dates_in: "22 août 2026", dates_out: "29 août 2026",
    nights: 7, guests: 4, total: "2 450 €", status: "En préparation",
    wifi_ssid: "Delfosse-Commodore", wifi_pass: "commodore06",
    arrival_code: "7103",
    concierge_name: "Antoine Perez",
    concierge_phone: "+33 6 55 44 33 22",
    concierge_mail:  "antoine@delfosse-properties.fr",
    airbnb: "https://www.airbnb.fr/rooms/1361686663866337495",
    rating: "4,88", reviews: 64,
    image: "img/airbnb/02-commodore/photo-01.jpg?v=c1",
    nearby: "Tramway 1 min · Port face · Garibaldi 3 min · Vieux Nice 5 min",
    extras: [
      { label: "Sortie bateau avec skipper",    status: "Confirmé — 24 août" },
      { label: "Location vélos électriques",    status: "Réservé — 23 août" }
    ]
  },

  /* N°03 — Notre appartement avenue Notre-Dame */
  "dupont": {
    password: "notredame2026",
    name: "M. Dupont", firstname: "Jean",
    property: "Notre appartement avenue Notre-Dame", property_no: "N°03",
    property_sub: "Famille · 6 voyageurs",
    location: "27 avenue Notre-Dame · Hyper centre",
    dates_in: "3 mai 2026", dates_out: "7 mai 2026",
    nights: 4, guests: 6, total: "1 980 €", status: "Confirmé",
    wifi_ssid: "Delfosse-Basilique", wifi_pass: "notredame27",
    arrival_code: "5912",
    concierge_name: "Marc Dubois",
    concierge_phone: "+33 6 98 76 54 32",
    concierge_mail:  "marc@delfosse-properties.fr",
    airbnb: "https://www.airbnb.fr/rooms/1563266584925477319",
    rating: "4,84", reviews: 25,
    image: "img/airbnb/03-basilique/photo-01.jpg",
    nearby: "Tramway 1 min · Vieux Nice 5 min · Gare 5 min · Jean Médecin 1 min",
    extras: [
      { label: "Table étoilée Le Chantecler",   status: "Réservé — 4 mai, 20 h 30" },
      { label: "Visite privée du MAMAC",        status: "Confirmé — 5 mai, 10 h" }
    ]
  },

  /* N°04 — Notre appartement Art Déco (ex Le Transatlantique) */
  "rousseau": {
    password: "artdeco2026",
    name: "Famille Rousseau", firstname: "Émilie",
    property: "Notre appartement Art Déco", property_no: "N°04",
    property_sub: "Quartier de la Gare",
    location: "Face à la gare · Nice",
    dates_in: "10 juin 2026", dates_out: "17 juin 2026",
    nights: 7, guests: 4, total: "2 180 €", status: "Confirmé",
    wifi_ssid: "Delfosse-ArtDeco", wifi_pass: "transat1930",
    arrival_code: "4621",
    concierge_name: "Julien Morel",
    concierge_phone: "+33 6 78 90 12 34",
    concierge_mail:  "julien@delfosse-properties.fr",
    airbnb: "https://www.airbnb.fr/rooms/1361628609886141688",
    rating: "4,86", reviews: 43,
    image: "img/airbnb/04-transatlantique/photo-01.jpg",
    nearby: "Gare face · Transports 3 min · Masséna 10 min · Vieux Nice 12 min",
    extras: [
      { label: "Cours de cuisine niçoise",      status: "Réservé — 12 juin, 15 h" },
      { label: "Visite Villa Masséna",          status: "Confirmé — 14 juin, 11 h" }
    ]
  },

  /* N°05 — Notre appartement ultra design (ex Le Scherzo) */
  "bernard": {
    password: "ultra2026",
    name: "Famille Bernard", firstname: "Alexandre",
    property: "Notre appartement ultra design", property_no: "N°05",
    property_sub: "Quartier des Musiciens",
    location: "41 avenue Georges Clemenceau · Musiciens",
    dates_in: "26 décembre 2026", dates_out: "2 janvier 2027",
    nights: 7, guests: 4, total: "2 840 €", status: "Confirmé",
    wifi_ssid: "Delfosse-Ultra", wifi_pass: "clemenceau41",
    arrival_code: "9384",
    concierge_name: "Camille Richard",
    concierge_phone: "+33 6 45 67 89 01",
    concierge_mail:  "camille@delfosse-properties.fr",
    airbnb: "https://www.airbnb.fr/rooms/1446914329011561138",
    rating: "4,94", reviews: 16,
    image: "img/airbnb/06-scherzo/photo-01.jpg?v=e3",
    nearby: "Tramway 2 min · Jean Médecin 2 min · Gare 5 min · Plage 15 min",
    extras: [
      { label: "Réveillon traiteur privé",      status: "Menu validé" },
      { label: "Brunch du 1er janvier",         status: "Réservé — 10 h 30" },
      { label: "Spa à domicile",                status: "Planifié — 28 déc." }
    ]
  },

  /* N°06 — Notre dernier appartement (ex Le Crescendo) */
  "lefevre": {
    password: "dernier2026",
    name: "M. & Mme Lefèvre", firstname: "Hélène",
    property: "Notre dernier appartement", property_no: "N°06",
    property_sub: "Quartier des Musiciens",
    location: "24D rue Gounod · Musiciens",
    dates_in: "18 septembre 2026", dates_out: "22 septembre 2026",
    nights: 4, guests: 4, total: "1 240 €", status: "En préparation",
    wifi_ssid: "Delfosse-Gounod", wifi_pass: "gounod24",
    arrival_code: "1275",
    concierge_name: "Philippe Marchand",
    concierge_phone: "+33 6 23 45 67 89",
    concierge_mail:  "philippe@delfosse-properties.fr",
    airbnb: "https://www.airbnb.fr/rooms/1361447215596892211",
    rating: "4,69", reviews: 52,
    image: "img/airbnb/07-crescendo/photo-01.jpg",
    nearby: "Gare 5 min · Jean Médecin 5 min · Masséna 10 min · Plage 10 min",
    extras: [
      { label: "Dégustation vins de Bellet",    status: "Confirmé — 19 sept. 17 h" },
      { label: "Dîner chez JAN (1*)",           status: "Réservé — 20 sept. 20 h" }
    ]
  },

  /* N°07 — Notre appartement design (ex L'Adagio, déplacé en fin) */
  "garnier": {
    password: "design2026",
    name: "Famille Garnier", firstname: "Thomas",
    property: "Notre appartement design", property_no: "N°07",
    property_sub: "Quartier des Musiciens",
    location: "41 avenue Georges Clemenceau · Musiciens",
    dates_in: "5 août 2026", dates_out: "12 août 2026",
    nights: 7, guests: 4, total: "2 140 €", status: "Confirmé",
    wifi_ssid: "Delfosse-Design", wifi_pass: "clemenceau2024",
    arrival_code: "6408",
    concierge_name: "Laure Vidal",
    concierge_phone: "+33 6 34 56 78 90",
    concierge_mail:  "laure@delfosse-properties.fr",
    airbnb: "https://www.airbnb.fr/rooms/1447097634568506909",
    rating: "4,81", reviews: 21,
    image: "img/airbnb/05-adagio/photo-01.jpg?v=d1",
    nearby: "Tramway 2 min · Jean Médecin 2 min · Gare 5 min · Plage 15 min",
    extras: [
      { label: "Location vélos premium",        status: "Livré — 5 août" },
      { label: "Cours de voile baie des Anges", status: "Réservé — 7 août" },
      { label: "Panier marché Saleya",          status: "Chaque matin" }
    ]
  }
};

const DP_SESSION_KEY = "dp_session_user";

const DP = {
  login(login, password) {
    const key = (login || "").trim().toLowerCase();
    const user = DP_USERS[key];
    if (!user || user.password !== password) {
      return { ok: false, error: "Identifiant ou mot de passe incorrect." };
    }
    sessionStorage.setItem(DP_SESSION_KEY, key);
    return { ok: true, user: { ...user, login: key } };
  },

  current() {
    const key = sessionStorage.getItem(DP_SESSION_KEY);
    if (!key) return null;
    const user = DP_USERS[key];
    return user ? { ...user, login: key } : null;
  },

  logout() { sessionStorage.removeItem(DP_SESSION_KEY); },

  requireAuth(redirect = "login.html") {
    const u = DP.current();
    if (!u) { window.location.href = redirect; return null; }
    return u;
  }
};

window.DP = DP;
