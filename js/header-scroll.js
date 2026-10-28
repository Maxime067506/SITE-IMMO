/* =====================================================================
   header-scroll.js — Bandeau du haut toujours lisible
   Pour les pages qui ne chargent pas app.js (réserver, à propos, blog,
   pages légales) : même logique que app.js -> texte clair au-dessus du
   film d'accueil, fond crème flouté dès qu'on fait défiler la page.
   ===================================================================== */
(function () {
  'use strict';
  var header = document.getElementById('siteHeader');
  if (!header) return;
  var heroFilm = document.querySelector('.hero-film');
  function update() {
    var heroBottom = heroFilm ? heroFilm.getBoundingClientRect().bottom : 0;
    var overHero = heroBottom > 90;
    header.classList.toggle('on-dark', overHero);
    header.classList.toggle('is-scrolled', window.scrollY > 10 && !overHero);
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
