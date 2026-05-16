/* ============================================================
   Delfosse Properties — Curseur custom premium
   ============================================================
   Cercle doré minimaliste qui suit la souris (style Vogue / Monocle).
   - Sur lien / bouton : agrandit + change de couleur
   - Sur image : se transforme en "VIEW" / plus
   - Désactivé sur touch devices (mobile)
   - Désactivé sur prefers-reduced-motion
   ============================================================ */
(function () {
  'use strict';
  try {

  // Pas de curseur custom sur tactile / mobile / reduce-motion / petit ecran
  // Triple-check pour eviter tout cas problematique :
  if (!window.matchMedia) return;
  if (matchMedia('(hover: none)').matches) return;
  if (matchMedia('(pointer: coarse)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 900) return;  // safety net : pas de cursor en dessous de 900px

  // Crée les éléments
  const dot = document.createElement('div');
  dot.className = 'dp-cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'dp-cursor-ring';
  document.documentElement.appendChild(dot);
  document.documentElement.appendChild(ring);
  document.documentElement.classList.add('has-dp-cursor');

  // Suivi de la souris (lerp pour mouvement fluide)
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Le dot suit instantanément
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, { passive: true });

  // Animation frame pour le ring (avec inertie)
  function animate() {
    // Lerp 0.18 = inertie douce
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // États hover : lien, bouton, .blog-card, [data-cursor]
  const HOVERS = 'a, button, .blog-card, [role="button"], [data-cursor]';
  document.addEventListener('mouseover', (e) => {
    const t = e.target;
    if (t && t.closest && t.closest(HOVERS)) {
      ring.classList.add('is-hover');
      dot.classList.add('is-hover');
    }
  }, { passive: true });
  document.addEventListener('mouseout', (e) => {
    const t = e.target;
    if (t && t.closest && t.closest(HOVERS)) {
      ring.classList.remove('is-hover');
      dot.classList.remove('is-hover');
    }
  }, { passive: true });

  // Cache le curseur quand la souris quitte la page
  document.addEventListener('mouseleave', () => {
    ring.style.opacity = '0';
    dot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    ring.style.opacity = '';
    dot.style.opacity = '';
  });

  } catch (e) {
    // Si quoi que ce soit plante, on retire tout et on laisse le curseur natif
    try {
      document.documentElement.classList.remove('has-dp-cursor');
      document.querySelectorAll('.dp-cursor-dot,.dp-cursor-ring').forEach(el => el.remove());
    } catch (_) {}
    console.warn('[dp-cursor] disabled', e);
  }
})();
