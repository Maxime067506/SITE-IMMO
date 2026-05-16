/* ============================================================
   Delfosse Properties — Lazy Leaflet loader
   ============================================================
   Charge la lib Leaflet (CSS + JS, ~162 KB) UNIQUEMENT quand
   le conteneur de carte (#niceMap ou #ficheMap) entre dans le
   viewport — gain LCP ~300-500ms sur les pages avec carte.

   Le code dans app.js attend window.L avec un setTimeout
   automatique, donc compatible : on injecte Leaflet et il
   prend le relais sans modification.
   ============================================================ */
(function lazyLeaflet() {
  'use strict';

  // Conteneurs possibles : carte interactive home, mini-carte fiche séjour
  const selectors = ['#niceMap', '#ficheMap', '.leaflet-target'];
  const targets = selectors
    .map(s => document.querySelector(s))
    .filter(Boolean);

  if (!targets.length) return;        // Aucune carte sur la page → rien à charger
  if (window.L) return;               // Leaflet déjà chargé

  const CSS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  const JS_URL  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  const CSS_INTEGRITY = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
  const JS_INTEGRITY  = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';

  let loaded = false;
  function loadLeaflet() {
    if (loaded || window.L) return;
    loaded = true;

    // CSS
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = CSS_URL;
    css.setAttribute('integrity', CSS_INTEGRITY);
    css.setAttribute('crossorigin', '');
    document.head.appendChild(css);

    // JS
    const js = document.createElement('script');
    js.src = JS_URL;
    js.async = true;
    js.setAttribute('integrity', JS_INTEGRITY);
    js.setAttribute('crossorigin', '');
    document.head.appendChild(js);
  }

  // Si IntersectionObserver dispo : lazy load avec marge de 400px
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          loadLeaflet();
          io.disconnect();
        }
      });
    }, { rootMargin: '400px 0px' });   // déclenche 400px avant que la carte ne soit visible
    targets.forEach(t => io.observe(t));
  } else {
    // Fallback navigateur ancien : charge après 2s
    setTimeout(loadLeaflet, 2000);
  }
})();
