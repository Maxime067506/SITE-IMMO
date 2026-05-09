/* Delfosse Properties — interactions */

/* Helper : retourne la version .webp d'une URL .jpg/.jpeg/.png en preservant le ?v= eventuel.
   Utilise dans <picture><source type="image/webp" srcset="${_dpToWebp(src)}"><img src="${src}"></picture>
   pour servir le webp si dispo (gain Core Web Vitals / SEO), avec fallback jpg automatique. */
const _dpToWebp = (src) => src.replace(/\.(jpg|jpeg|png)(\?.*)?$/i, '.webp$2');

const header = document.getElementById('siteHeader');
const heroFilm = document.querySelector('.hero-film');

/* Header: transparent sur hero film, solide après */
const updateHeader = () => {
  const heroBottom = heroFilm ? heroFilm.getBoundingClientRect().bottom : 0;
  const overHero = heroBottom > 90;
  header.classList.toggle('on-dark', overHero);
  header.classList.toggle('is-scrolled', window.scrollY > 10 && !overHero);
};
window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('resize', updateHeader);
updateHeader();

/* Burger menu mobile — tolérant aux pages sans burger (fiches sans bouton, etc.) */
(() => {
  const burger = document.getElementById('burger');
  const nav = document.querySelector('.nav');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    document.body.classList.toggle('nav-open', open);
  });
  nav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      document.body.classList.remove('nav-open');
      burger.setAttribute('aria-expanded', 'false');
    })
  );
  // Fermeture sur Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      document.body.classList.remove('nav-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.focus();
    }
  });
})();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============== SÉJOURS — ACCORDÉON ÉDITORIAL ============== */
(() => {
  const acc = document.getElementById('sejAcc');
  if (!acc) return;

  const panels = [...acc.querySelectorAll('.sej-panel')];
  if (!panels.length) return;

  const TOTAL    = panels.length;
  const AUTOPLAY = 5500;
  const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mqMobile = window.matchMedia('(max-width: 820px)');

  let active = panels.findIndex(p => p.classList.contains('is-active'));
  if (active < 0) active = 0;

  let hoverTimer = null;
  let autoplayTimer = null;
  let paused = false;

  // Haptic léger (vibration API si dispo)
  const haptic = () => {
    if ('vibrate' in navigator) {
      try { navigator.vibrate(8); } catch(_) {}
    }
  };

  function setActive(i, { fromUser = false, viaScroll = false } = {}) {
    i = ((i % TOTAL) + TOTAL) % TOTAL;
    if (i === active) return;
    panels[active].classList.remove('is-active');
    panels[active].setAttribute('aria-selected', 'false');
    panels[active].setAttribute('tabindex', '-1');
    active = i;
    panels[active].classList.add('is-active');
    panels[active].setAttribute('aria-selected', 'true');
    panels[active].setAttribute('tabindex', '0');
    if (fromUser && !viaScroll) scheduleAutoplay();
    if (fromUser) haptic();
  }

  function scheduleAutoplay() {
    clearTimeout(autoplayTimer);
    if (paused || reduced) return;
    autoplayTimer = setTimeout(() => setActive(active + 1), AUTOPLAY);
  }

  /* Click / tap : SEULEMENT expand. La navigation passe UNIQUEMENT par le CTA « Découvrir la fiche → » */
  panels.forEach((panel, i) => {
    const href = panel.dataset.href;

    panel.addEventListener('click', (e) => {
      // Laisse passer les clics directs sur le CTA <a> (lui se charge de naviguer)
      if (e.target.closest('.sej-cta')) return;
      // Sinon : simple expand, jamais de navigation automatique
      e.preventDefault();
      if (i !== active) setActive(i, { fromUser: true });
    });

    /* Hover (desktop) : expand après 120ms */
    panel.addEventListener('mouseenter', () => {
      if (mqMobile.matches) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => setActive(i, { fromUser: true }), 120);
    });
    panel.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
    });

    /* Focus clavier : expand immédiatement (action explicite) */
    panel.addEventListener('focus', () => {
      setActive(i, { fromUser: true });
    });

    /* Keyboard : ←/→/↑/↓ entre panneaux, Enter/Espace navigue (action explicite) */
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        panels[(i + 1) % TOTAL].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        panels[(i - 1 + TOTAL) % TOTAL].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        panels[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        panels[TOTAL - 1].focus();
      } else if ((e.key === 'Enter' || e.key === ' ') && href) {
        e.preventDefault();
        window.location.href = href;
      }
    });
  });

  /* Pause autoplay sur survol / focus de l'accordéon entier */
  acc.addEventListener('mouseenter', () => { paused = true;  clearTimeout(autoplayTimer); });
  acc.addEventListener('mouseleave', () => { paused = false; scheduleAutoplay(); });
  acc.addEventListener('focusin',    () => { paused = true;  clearTimeout(autoplayTimer); });
  acc.addEventListener('focusout',   () => { paused = false; scheduleAutoplay(); });

  /* Reveal au scroll : démarre l'autoplay seulement quand l'accordéon entre dans la vue */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        scheduleAutoplay();
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.35 });
  io.observe(acc);

  /* Mobile : « effleurement » au scroll — le panneau le plus visible s'ouvre automatiquement.
     Pas besoin de taper ; le panneau sous l'œil s'expose tout seul.
     Protégé contre la boucle (layout shift causé par expand → re-observation). */
  if (mqMobile.matches || ('ontouchstart' in window)) {
    let scrollRaf = null;
    let lockUntil = 0;
    const updateMostVisible = () => {
      scrollRaf = null;
      if (!mqMobile.matches && !('ontouchstart' in window)) return;
      if (Date.now() < lockUntil) return; // blocage post-expand pour éviter la boucle
      const vh = window.innerHeight;
      const vmid = vh * 0.45; // légèrement au-dessus du centre — l'œil tombe là
      let best = -1;
      let bestScore = -Infinity;
      panels.forEach((p, i) => {
        const r = p.getBoundingClientRect();
        if (r.bottom < 80 || r.top > vh - 80) return; // hors zone utile
        const pmid = r.top + r.height / 2;
        const distance = Math.abs(pmid - vmid);
        const score = -distance;
        if (score > bestScore) {
          bestScore = score;
          best = i;
        }
      });
      if (best >= 0 && best !== active) {
        setActive(best, { fromUser: true, viaScroll: true });
        // Blocage 680ms = durée de la transition height (650ms + marge), pour que le layout se stabilise
        lockUntil = Date.now() + 680;
      }
    };
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(updateMostVisible);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Pass initial après render
    setTimeout(updateMostVisible, 400);
  }
})();

/* ============== STRIP HORIZONTAL (legacy) — purgé au profit de .sej-acc ============== */
(() => {
  const track = document.getElementById('stripTrack');
  const prev  = document.querySelector('.strip-prev');
  const next  = document.querySelector('.strip-next');
  const cur   = document.getElementById('stripCur');
  const bar   = document.getElementById('stripBar');
  const dotsWrap = document.getElementById('stripDots');
  if (!track || !prev || !next) return;

  const slides = [...track.querySelectorAll('.strip-slide')];
  const TOTAL  = slides.length;

  // Dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'strip-dot';
    b.setAttribute('aria-label', `Appartement ${i + 1}`);
    b.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(b);
  });
  const dots = [...dotsWrap.children];

  const slideWidth = () => slides[0]?.getBoundingClientRect().width || track.clientWidth;
  const getIndex = () => {
    const w = slideWidth();
    if (!w) return 0;
    return Math.max(0, Math.min(TOTAL - 1, Math.round(track.scrollLeft / w)));
  };

  // Empêcher la navigation par ancre de scroll le track
  track.addEventListener('focus', (e) => {
    if (track.scrollLeft === 0 || track.scrollLeft % slideWidth() < 5) return;
  });

  const goTo = (i) => {
    i = Math.max(0, Math.min(TOTAL - 1, i));
    track.scrollTo({ left: i * slideWidth(), behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const updateUI = () => {
    const i = getIndex();
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
    slides.forEach((s, k) => s.classList.toggle('is-current', k === i));
    const newCur = String(i + 1).padStart(2, '0');
    if (cur.textContent !== newCur) {
      cur.textContent = newCur;
      // force re-animation cur-pop
      cur.style.animation = 'none';
      void cur.offsetWidth;
      cur.style.animation = '';
    }
    prev.classList.toggle('is-disabled', i <= 0);
    next.classList.toggle('is-disabled', i >= TOTAL - 1);
    if (bar) bar.style.width = `${((i + 1) / TOTAL) * 100}%`;
  };

  prev.addEventListener('click', () => goTo(getIndex() - 1));
  next.addEventListener('click', () => goTo(getIndex() + 1));

  // Scroll event (throttled via timeout)
  let sT;
  track.addEventListener('scroll', () => {
    clearTimeout(sT);
    sT = setTimeout(updateUI, 60);
  }, { passive: true });
  window.addEventListener('resize', () => { goTo(getIndex()); updateUI(); });

  // Clavier
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(getIndex() + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(getIndex() - 1); }
  });

  // Empêche le focus auto-scroll : quand un bouton caché prend le focus,
  // on reste sur la slide courante.
  track.addEventListener('focusin', () => {
    const idx = getIndex();
    requestAnimationFrame(() => {
      const target = idx * slideWidth();
      if (Math.abs(track.scrollLeft - target) > 5) {
        const prev = track.style.scrollBehavior;
        track.style.scrollBehavior = 'auto';
        track.scrollLeft = target;
        track.style.scrollBehavior = prev;
      }
    });
  });

  // Reset au départ
  const resetToStart = () => {
    const prev = track.style.scrollBehavior;
    track.style.scrollBehavior = 'auto';
    track.scrollLeft = 0;
    track.style.scrollBehavior = prev;
    updateUI();
  };
  resetToStart();
  window.addEventListener('load', () => setTimeout(resetToStart, 100));

  /* ---------- MOBILE : peek + parallax + haptic ---------- */
  const mqMobile = window.matchMedia('(max-width: 760px)');
  let lastHapticIdx = 0;

  const haptic = () => {
    if (!('vibrate' in navigator)) return;
    try { navigator.vibrate(8); } catch (_) {}
  };

  const parallax = () => {
    if (!mqMobile.matches) return;
    const vw = window.innerWidth;
    const centerX = vw / 2;
    slides.forEach((slide) => {
      const media = slide.querySelector('.stay-img');
      if (!media) return;
      const r = slide.getBoundingClientRect();
      const slideCenter = r.left + r.width / 2;
      const delta = (slideCenter - centerX) / vw; // -1 .. +1
      // Parallax 60% — l'image se déplace moins vite que la slide
      const shift = (delta * -40).toFixed(2); // px
      media.style.transform = `translate3d(${shift}px, 0, 0)`;
    });
  };

  // Sur mobile : détecter le changement d'index pour haptic
  const onMobileScroll = () => {
    parallax();
    const i = getIndex();
    if (i !== lastHapticIdx && mqMobile.matches) {
      lastHapticIdx = i;
      haptic();
    }
  };

  track.addEventListener('scroll', onMobileScroll, { passive: true });
  window.addEventListener('resize', () => {
    // Reset transforms when switching between mobile/desktop
    if (!mqMobile.matches) {
      slides.forEach(s => {
        const m = s.querySelector('.stay-img');
        if (m) m.style.transform = '';
      });
    } else {
      parallax();
    }
  });
  // Initial parallax pass
  requestAnimationFrame(parallax);

  if (reduceMotion) return;

  // Tilt 3D mouse-tracking sur l'image de chaque slide actif (desktop seulement)
  slides.forEach(slide => {
    const media = slide.querySelector('.stay-img');
    if (!media) return;
    let lastE = null, raf = null;
    const isReverse = slide.classList.contains('is-reverse');
    const update = () => {
      if (!lastE || mqMobile.matches) return;
      const r = media.getBoundingClientRect();
      const x = ((lastE.clientX - r.left) / r.width - 0.5) * 2;
      const y = ((lastE.clientY - r.top)  / r.height - 0.5) * 2;
      const rx = (-y * 5).toFixed(2);
      const ry = (x * 7 * (isReverse ? -1 : 1)).toFixed(2);
      media.style.transform =
        `perspective(1600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px) translateZ(20px)`;
    };
    slide.addEventListener('mousemove', (e) => {
      if (mqMobile.matches) return; // parallax mobile prime
      lastE = e;
      slide.classList.add('tilting');
      if (!raf) raf = requestAnimationFrame(() => { update(); raf = null; });
    });
    slide.addEventListener('mouseleave', () => {
      if (mqMobile.matches) return;
      lastE = null;
      slide.classList.remove('tilting');
      media.style.transform = '';
    });
  });
})();

/* Reveal au scroll */
const targets = document.querySelectorAll('.section, .card, .feature, blockquote');
targets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

targets.forEach(el => io.observe(el));

/* ============== CARTE INTERACTIVE 3D (Leaflet) ============== */
(() => {
  const wrap   = document.getElementById('carte3d');
  const canvas = document.getElementById('niceMap');
  if (!wrap || !canvas) return;

  // Coordonnées GPS réelles (OpenStreetMap). Les jumeaux (01/02 et 05/07)
  // partagent la même adresse : un léger offset (~30 m) les rend lisibles.
  const APTS_MAP = [
    { no:'01', name:"Notre appartement du port",           address:'5 rue Barla, Nice',         loc:'Port de Nice',   lat:43.70238, lon:7.28148, img:'img/airbnb/01-amiral/photo-01.jpg',    meta:'4 voyageurs · ★ 4,87', airbnb:'https://www.airbnb.fr/rooms/1361669686960380718', detail:'sejour-01.html' },
    { no:'02', name:'Son jumeau du port',                  address:'5 rue Barla, Nice',         loc:'Port de Nice',   lat:43.70268, lon:7.28178, img:'img/airbnb/02-commodore/photo-01.jpg?v=c1', meta:'4 voyageurs · ★ 4,88', airbnb:'https://www.airbnb.fr/rooms/1361686663866337495', detail:'sejour-02.html' },
    { no:'03', name:'Notre appartement avenue Notre-Dame', address:'27 avenue Notre-Dame, Nice', loc:'Hyper centre', lat:43.70362, lon:7.26709, img:'img/airbnb/03-basilique/photo-01.jpg',    meta:'6 voyageurs · ★ 4,84',  airbnb:'https://www.airbnb.fr/rooms/1563266584925477319', detail:'sejour-03.html' },
    { no:'04', name:'Notre appartement Art Déco',          address:'Face à la gare, Nice',      loc:'Quartier gare',  lat:43.70378, lon:7.26190, img:'img/airbnb/04-transatlantique/photo-01.jpg', meta:'4 voyageurs · ★ 4,86', airbnb:'https://www.airbnb.fr/rooms/1361628609886141688', detail:'sejour-04.html' },
    { no:'05', name:'Notre appartement ultra design',      address:'41 av. G. Clemenceau, Nice',loc:'Musiciens',      lat:43.70179, lon:7.26055, img:'img/airbnb/06-scherzo/photo-01.jpg?v=e3',   meta:'4 voyageurs · ★ 4,94', airbnb:'https://www.airbnb.fr/rooms/1446914329011561138', detail:'sejour-05.html' },
    { no:'06', name:'Notre dernier appartement',           address:'24D rue Gounod, Nice',      loc:'Musiciens',      lat:43.70098, lon:7.26081, img:'img/airbnb/07-crescendo/photo-01.jpg', meta:'4 voyageurs · ★ 4,69', airbnb:'https://www.airbnb.fr/rooms/1361447215596892211', detail:'sejour-06.html' },
    { no:'07', name:'Notre appartement design',            address:'41 av. G. Clemenceau, Nice',loc:'Musiciens',      lat:43.70149, lon:7.26015, img:'img/airbnb/05-adagio/photo-01.jpg?v=d1',    meta:'4 voyageurs · ★ 4,81', airbnb:'https://www.airbnb.fr/rooms/1447097634568506909', detail:'sejour-07.html' },
  ];

  // Si on est sur une fiche séjour (sejour-0X.html), ne conserver que
  // l'appartement correspondant → carte focus sur un seul marqueur.
  // Sinon (home), on garde les 7 appartements.
  const path = (window.location.pathname || '').toLowerCase();
  const sejourMatch = path.match(/sejour-(\d+)\.html/);
  let aptList = APTS_MAP;
  let isSingleApt = false;
  if (sejourMatch) {
    const target = sejourMatch[1].padStart(2, '0');
    const one = APTS_MAP.find(a => a.no === target);
    if (one) { aptList = [one]; isSingleApt = true; }
  }

  // Wait for Leaflet
  const init = () => {
    if (!window.L) { setTimeout(init, 200); return; }

    const map = L.map(canvas, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false,
      fadeAnimation: true,
      zoomAnimation: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    if (isSingleApt) {
      // Fiche séjour : on centre sur l'appartement unique à un zoom rue (17)
      map.setView([aptList[0].lat, aptList[0].lon], 17);
    } else {
      // Home : vue d'ensemble sur tous les appartements
      const bounds = L.latLngBounds(aptList.map(a => [a.lat, a.lon]));
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 15 });
    }

    // Refs UI
    const panel    = document.getElementById('cartePanel');
    const panelImg = document.getElementById('panelImg');
    const panelNum = document.getElementById('panelNum');
    const panelName= document.getElementById('panelName');
    const panelLoc = document.getElementById('panelLoc');
    const panelCta = document.getElementById('panelCta');
    const panelPho = document.getElementById('panelPhoto');
    let activeEl = null;

    const select = (apt, el) => {
      if (activeEl) activeEl.classList.remove('is-active');
      activeEl = el;
      el.classList.add('is-active');
      // Recentre la carte sur le marqueur sélectionné
      map.panTo([apt.lat, apt.lon], { animate:true, duration:.8 });

      // Annonce ARIA : panneau en cours de mise à jour
      if (panel) panel.setAttribute('aria-busy', 'true');

      panelPho.classList.add('changing');
      setTimeout(() => {
        panelImg.src = apt.img;
        panelImg.alt = apt.name;
        panelPho.classList.remove('changing');
        if (panel) panel.setAttribute('aria-busy', 'false');
      }, 200);

      panelNum.textContent = `N°${apt.no}`;
      panelName.textContent = apt.name;
      panelLoc.textContent  = `${apt.address} · ${apt.meta}`;
      panelCta.textContent  = 'Voir la fiche →';
      panelCta.href = apt.detail;
    };

    aptList.forEach((apt) => {
      const html = `<div class="dp-marker" data-no="${apt.no}">${apt.no}</div>`;
      const icon = L.divIcon({
        className: 'dp-marker-wrap',
        html,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });
      const marker = L.marker([apt.lat, apt.lon], { icon }).addTo(map);

      // Sur fiche séjour : on sélectionne automatiquement l'unique marqueur
      if (isSingleApt) {
        setTimeout(() => {
          const el = marker.getElement()?.querySelector('.dp-marker');
          if (el) select(apt, el);
        }, 80);
      }

      // Bind events once the marker element is in the DOM
      setTimeout(() => {
        const el = marker.getElement()?.querySelector('.dp-marker');
        if (!el) return;
        if (!isSingleApt) {
          // Home : hover + clic = sélection + navigation
          el.addEventListener('mouseenter', () => select(apt, el));
          el.addEventListener('focus',      () => select(apt, el));
          el.addEventListener('click', (e) => { e.preventDefault(); select(apt, el); window.location.href = apt.detail; });
        }
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', `${apt.name} — ${apt.loc}`);
      }, 50);
    });

    // Invalide la taille (au cas où le container a été rendu avant l'init)
    setTimeout(() => map.invalidateSize(), 200);

    /* === 3D tilt du container au mouvement de souris === */
    if (!reduceMotion) {
      let rafC;
      let lastE = null;
      const tick = () => {
        if (!lastE) return;
        const r = wrap.getBoundingClientRect();
        const x = ((lastE.clientX - r.left) / r.width - 0.5) * 2;
        const y = ((lastE.clientY - r.top)  / r.height - 0.5) * 2;
        wrap.style.transform =
          `perspective(1800px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
      };
      wrap.addEventListener('mousemove', (e) => {
        lastE = e;
        if (!rafC) rafC = requestAnimationFrame(() => { tick(); rafC = null; });
      });
      wrap.addEventListener('mouseleave', () => {
        lastE = null;
        wrap.style.transform = 'perspective(1800px) rotateX(0) rotateY(0)';
      });
    }
  };

  init();
})();

/* ============== COVERFLOW 3D (éventail Apple Cover Flow) ============== */
(() => {
  const track = document.getElementById('cfTrack');
  const stage = document.getElementById('cfStage');
  if (!track || !stage) return;

  const cur      = document.getElementById('cfCur');
  const dotsWrap = document.getElementById('cfDots');
  const btnPrev  = document.querySelector('.cf-prev');
  const btnNext  = document.querySelector('.cf-next');

  // Données : 7 appartements — noms éditoriaux + URL Airbnb directe (clic = réservation)
  // Les champs name et loc sont stockés comme clés i18n (apt.X.short / apt.X.loc)
  // pour que le coverflow puisse basculer FR<->EN. Le tag reste hardcodé car c'est
  // un mot court (PORT, JUMEAU, …) qui est aussi localisé via keys tag.cf.X.
  const ITEMS = [
    { no:'01', nameKey:'apt.1.short', tagKey:'tag.cf.1', locKey:'apt.1.loc', rating:'4,87', image:'img/airbnb/01-amiral/photo-01.jpg',          airbnb:'https://www.airbnb.fr/rooms/1361669686960380718' },
    { no:'02', nameKey:'apt.2.short', tagKey:'tag.cf.2', locKey:'apt.2.loc', rating:'4,88', image:'img/airbnb/02-commodore/photo-01.jpg?v=c1',       airbnb:'https://www.airbnb.fr/rooms/1361686663866337495' },
    { no:'03', nameKey:'apt.3.short', tagKey:'tag.cf.3', locKey:'apt.3.loc', rating:'4,84', image:'img/airbnb/03-basilique/photo-01.jpg',       airbnb:'https://www.airbnb.fr/rooms/1563266584925477319' },
    { no:'04', nameKey:'apt.4.short', tagKey:'tag.cf.4', locKey:'apt.4.loc', rating:'4,86', image:'img/airbnb/04-transatlantique/photo-01.jpg', airbnb:'https://www.airbnb.fr/rooms/1361628609886141688' },
    { no:'05', nameKey:'apt.5.short', tagKey:'tag.cf.5', locKey:'apt.5.loc', rating:'4,94', image:'img/airbnb/06-scherzo/photo-01.jpg?v=e3',         airbnb:'https://www.airbnb.fr/rooms/1446914329011561138' },
    { no:'06', nameKey:'apt.6.short', tagKey:'tag.cf.6', locKey:'apt.6.loc', rating:'4,69', image:'img/airbnb/07-crescendo/photo-01.jpg',       airbnb:'https://www.airbnb.fr/rooms/1361447215596892211' },
    { no:'07', nameKey:'apt.7.short', tagKey:'tag.cf.7', locKey:'apt.7.loc', rating:'4,81', image:'img/airbnb/05-adagio/photo-01.jpg?v=d1',          airbnb:'https://www.airbnb.fr/rooms/1447097634568506909' },
  ];
  // Helper : traduction via DP_I18N avec fallback FR
  const tr = (key, fallback) => {
    if (window.DP_I18N && window.DP_I18N.t) {
      const v = window.DP_I18N.t(key);
      if (v && v !== key) return v;
    }
    return fallback || key;
  };
  // Hydrate chaque ITEM avec name/loc/tag résolus (recalculés à chaque refresh)
  const resolveItems = () => ITEMS.forEach(it => {
    it.name = tr(it.nameKey, it.name || '');
    it.tag  = tr(it.tagKey,  it.tag  || '');
    it.loc  = tr(it.locKey,  it.loc  || '');
  });
  resolveItems();

  const TOTAL = ITEMS.length;
  const AUTOPLAY = 6000;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mqMobile = window.matchMedia('(max-width: 760px)');

  // Couches 3D : active → voisines → externes
  const LAYERS_DESKTOP = [
    { tx: 0,    tz: 0,     ry: 0,  scale: 1.00, opacity: 1.00, blur: 0   },
    { tx: 230,  tz: -160,  ry: 34, scale: 0.85, opacity: 0.88, blur: 0   },
    { tx: 420,  tz: -340,  ry: 54, scale: 0.70, opacity: 0.45, blur: 0.4 },
    { tx: 580,  tz: -520,  ry: 58, scale: 0.55, opacity: 0.14, blur: 1.2 },
  ];
  // Mobile : cards 82vw = plus grandes, donc on écarte davantage les voisines
  // et on réduit leur scale pour qu'elles soient juste entrevues en bordure.
  const LAYERS_MOBILE = LAYERS_DESKTOP.map((l, i) => ({
    ...l,
    tx: l.tx * 0.92, tz: l.tz * 0.5, ry: l.ry * 0.55,
    scale: i === 0 ? 1.0 : (i === 1 ? 0.78 : l.scale * 0.7),
    opacity: i === 0 ? 1 : (i === 1 ? 0.55 : 0),
    blur: 0,
  }));
  const getLayers = () => (mqMobile.matches ? LAYERS_MOBILE : LAYERS_DESKTOP);

  // Build DOM : 7 cartes + 7 dots
  const cards = ITEMS.map((it, i) => {
    const a = document.createElement('article');
    a.className = 'cf-card';
    a.dataset.i = i;
    a.setAttribute('aria-label', `${it.name} — ${it.loc}`);
    a.innerHTML = `
      <div class="cf-card-top"><span>N°${it.no}</span><span>${it.tag}</span></div>
      <picture>
        <source type="image/webp" srcset="${_dpToWebp(it.image)}" />
        <img src="${it.image}" alt="" draggable="false" loading="lazy" decoding="async" />
      </picture>
      <div class="cf-card-bot">
        <h3 class="cf-card-name">${it.name}</h3>
        <p class="cf-card-meta"><span>${it.loc.toUpperCase()}</span><span class="sep">·</span><span>★ ${it.rating}</span></p>
      </div>`;
    a.addEventListener('click', () => onCardClick(i));
    stage.appendChild(a);
    return a;
  });

  const dots = ITEMS.map((it, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'cf-dot';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `Aller à ${it.name}`);
    b.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(b);
    return b;
  });

  // Refresh les libellés des cartes (name/loc/tag/aria) au changement de langue
  function refreshCoverflowLabels(){
    resolveItems();
    cards.forEach((c, i) => {
      const it = ITEMS[i];
      c.setAttribute('aria-label', `${it.name} — ${it.loc}`);
      const tag = c.querySelector('.cf-card-top span:last-child');
      if (tag) tag.textContent = it.tag;
      const nm = c.querySelector('.cf-card-name');
      if (nm) nm.textContent = it.name;
      const locEl = c.querySelector('.cf-card-meta span:first-child');
      if (locEl) locEl.textContent = (it.loc || '').toUpperCase();
    });
    dots.forEach((d, i) => d.setAttribute('aria-label', `Aller à ${ITEMS[i].name}`));
  }
  document.querySelectorAll('.lang-switch [data-lang]').forEach(btn => {
    btn.addEventListener('click', () => setTimeout(refreshCoverflowLabels, 0));
  });
  // Premier passage après DOMContentLoaded : i18n vient de s'appliquer
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', refreshCoverflowLabels, { once:true });
  } else {
    setTimeout(refreshCoverflowLabels, 0);
  }

  // État
  let active = 0;
  let timer = null;
  let paused = false;

  // Distance signée la plus courte (boucle infinie)
  const signedDelta = (i) => {
    let d = i - active;
    const half = TOTAL / 2;
    if (d >  half) d -= TOTAL;
    if (d < -half) d += TOTAL;
    return d;
  };

  function applyLayout() {
    const layers = getLayers();
    cards.forEach((card, i) => {
      const d = signedDelta(i);
      const absD = Math.abs(d);
      const sign = d === 0 ? 0 : (d > 0 ? 1 : -1);
      const layer = layers[Math.min(absD, layers.length - 1)];
      const tx = sign * layer.tx;
      const ty = 0;
      const tz = layer.tz;
      const ry = -sign * layer.ry;
      const opacity = absD > 3 ? 0 : layer.opacity;
      const zIndex = 100 - absD;

      card.style.transform =
        `translate(-50%, -50%) translate3d(${tx}px, ${ty}px, ${tz}px) rotateY(${ry}deg) scale(${layer.scale})`;
      card.style.opacity = opacity;
      card.style.filter  = layer.blur ? `blur(${layer.blur}px)` : 'none';
      card.style.zIndex  = zIndex;
      card.classList.toggle('is-current', d === 0);
      card.setAttribute('aria-hidden', d !== 0 ? 'true' : 'false');
    });

    // Dots
    dots.forEach((b, i) => {
      const on = i === active;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    // Compteur avec petite animation
    const v = String(active + 1).padStart(2, '0');
    if (cur.textContent !== v) {
      cur.textContent = v;
      cur.classList.remove('cf-pop');
      void cur.offsetWidth; // reflow
      cur.classList.add('cf-pop');
    }

    // aria-label du track
    track.setAttribute('aria-label',
      `${ITEMS[active].name}, ${active + 1} sur ${TOTAL}. Sept adresses Delfosse Properties.`);
  }

  function goTo(i) {
    active = ((i % TOTAL) + TOTAL) % TOTAL;
    applyLayout();
    scheduleAutoplay();
  }
  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);

  // Autoplay avec pause sur hover/focus/interaction
  function scheduleAutoplay() {
    clearTimeout(timer);
    if (paused || reduced) return;
    timer = setTimeout(next, AUTOPLAY);
  }

  // Interactions
  // Clic sur carte active = lien Airbnb direct (nouvel onglet).
  // Clic sur carte latérale = on la recentre d'abord.
  function onCardClick(i) {
    if (i === active) {
      const url = ITEMS[active].airbnb;
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      goTo(i);
    }
  }

  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);

  // Pause hover / focus
  const doPause  = () => { paused = true;  clearTimeout(timer); };
  const doResume = () => { paused = false; scheduleAutoplay(); };
  track.addEventListener('mouseenter', doPause);
  track.addEventListener('mouseleave', doResume);
  track.addEventListener('focusin',    doPause);
  track.addEventListener('focusout',   doResume);

  // Clavier
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); onCardClick(active);
    }
  });

  // Swipe tactile
  let touchStart = { x: 0, y: 0, t: 0 };
  track.addEventListener('touchstart', (e) => {
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
    doPause();
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    const dt = Date.now() - touchStart.t;
    const horizontal = Math.abs(dx) > Math.abs(dy);
    const swipe = horizontal && (Math.abs(dx) > 40 || (Math.abs(dx) > 20 && dt < 250));
    if (swipe) {
      (dx < 0 ? next : prev)();
      // Haptic léger sur swipe validé
      if ('vibrate' in navigator) {
        try { navigator.vibrate(10); } catch(_) {}
      }
    }
    setTimeout(doResume, 1000);
  });

  // Scroll horizontal (molette / trackpad)
  let wheelLock = false;
  track.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    if (wheelLock) return;
    (e.deltaX > 0 ? next : prev)();
    wheelLock = true;
    setTimeout(() => (wheelLock = false), 550);
  }, { passive: false });

  // Breakpoint change → réapplique la disposition
  mqMobile.addEventListener?.('change', applyLayout);
  window.addEventListener('resize', () => { applyLayout(); }, { passive: true });

  // Apparition initiale : cartes reviennent de -80z avec décalage
  if (!reduced) {
    cards.forEach((card, i) => {
      const order = Math.abs(signedDelta(i));
      card.style.transitionDelay = `${120 + order * 80}ms`;
    });
    requestAnimationFrame(applyLayout);
    // Remove staggered delays after first layout settles
    setTimeout(() => cards.forEach(c => (c.style.transitionDelay = '')), 1400);
  } else {
    applyLayout();
  }

  // Démarre l'autoplay
  scheduleAutoplay();
})();

/* ============================================================
   FICHE COVERFLOW — galerie photos d'un appartement
   Reprend la mécanique du home coverflow mais avec des photos pures
   (pas d'overlay numéro/tag/meta). 1 seul appart, 8 photos.
   ============================================================ */
(() => {
  const stage = document.getElementById('ficheCfStage');
  if (!stage) return; // pas sur une fiche → on skip

  const track    = document.getElementById('ficheCfTrack');
  const cur      = document.getElementById('ficheCfCur');
  const dotsWrap = document.getElementById('ficheCfDots');
  const btnPrev  = document.querySelector('.cf-prev-fiche');
  const btnNext  = document.querySelector('.cf-next-fiche');

  const dir   = stage.dataset.photoDir;
  const count = parseInt(stage.dataset.photoCount || '8', 10);
  const ver   = stage.dataset.photoVersion || '';
  const verQs = ver ? `?v=${ver}` : '';

  if (!dir || !count) return;

  const TOTAL    = count;
  const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mqMobile = window.matchMedia('(max-width: 760px)');

  const LAYERS_DESKTOP = [
    { tx: 0,    tz: 0,     ry: 0,  scale: 1.00, opacity: 1.00 },
    { tx: 230,  tz: -160,  ry: 30, scale: 0.84, opacity: 0.82 },
    { tx: 420,  tz: -340,  ry: 46, scale: 0.68, opacity: 0.38 },
    { tx: 580,  tz: -520,  ry: 54, scale: 0.54, opacity: 0.10 },
  ];
  const LAYERS_MOBILE = LAYERS_DESKTOP.map((l, i) => ({
    ...l,
    tx: l.tx * 0.88, tz: l.tz * 0.55, ry: l.ry * 0.55,
    scale: i === 0 ? 1 : (i === 1 ? 0.78 : l.scale * 0.7),
    opacity: i === 0 ? 1 : (i === 1 ? 0.52 : 0),
  }));
  const getLayers = () => (mqMobile.matches ? LAYERS_MOBILE : LAYERS_DESKTOP);

  // Build cards : simple <article class="cf-card fcf-card"><img></article>
  const cards = [];
  for (let i = 1; i <= count; i++) {
    const a = document.createElement('article');
    a.className = 'cf-card fcf-card';
    a.dataset.i = i - 1;
    a.setAttribute('aria-label', `Photo ${i} sur ${count}`);
    const pad = String(i).padStart(2, '0');
    const _jpg = `img/airbnb/${dir}/photo-${pad}.jpg${verQs}`;
    a.innerHTML = `<picture><source type="image/webp" srcset="${_dpToWebp(_jpg)}" /><img src="${_jpg}" alt="" draggable="false" loading="lazy" decoding="async" /></picture>`;
    a.addEventListener('click', () => {
      const idx = cards.indexOf(a);
      if (idx === active) return; // tap sur active = no-op (pas de lightbox pour l'instant)
      goTo(idx);
    });
    stage.appendChild(a);
    cards.push(a);
  }

  // Dots
  const dots = cards.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'cf-dot';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', `Photo ${i + 1}`);
    b.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(b);
    return b;
  });

  let active = 0;

  const signedDelta = (i) => {
    let d = i - active;
    const half = TOTAL / 2;
    if (d >  half) d -= TOTAL;
    if (d < -half) d += TOTAL;
    return d;
  };

  function applyLayout() {
    const layers = getLayers();
    cards.forEach((card, i) => {
      const d = signedDelta(i);
      const absD = Math.abs(d);
      const sign = d === 0 ? 0 : (d > 0 ? 1 : -1);
      const layer = layers[Math.min(absD, layers.length - 1)];
      const tx = sign * layer.tx;
      const tz = layer.tz;
      const ry = -sign * layer.ry;
      const opacity = absD > 3 ? 0 : layer.opacity;
      const zIndex = 100 - absD;
      card.style.transform =
        `translate(-50%, -50%) translate3d(${tx}px, 0, ${tz}px) rotateY(${ry}deg) scale(${layer.scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = zIndex;
      card.classList.toggle('is-current', d === 0);
      card.setAttribute('aria-hidden', d !== 0 ? 'true' : 'false');
    });
    dots.forEach((b, i) => b.classList.toggle('is-active', i === active));
    if (cur) cur.textContent = String(active + 1).padStart(2, '0');
  }

  function goTo(i) {
    active = ((i % TOTAL) + TOTAL) % TOTAL;
    applyLayout();
  }
  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);

  btnPrev?.addEventListener('click', prev);
  btnNext?.addEventListener('click', next);

  track?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
  });

  // Swipe tactile
  let touchStart = { x: 0, y: 0, t: 0 };
  track?.addEventListener('touchstart', (e) => {
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
  }, { passive: true });
  track?.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    const dt = Date.now() - touchStart.t;
    const horizontal = Math.abs(dx) > Math.abs(dy);
    const swipe = horizontal && (Math.abs(dx) > 40 || (Math.abs(dx) > 20 && dt < 250));
    if (swipe) {
      (dx < 0 ? next : prev)();
      if ('vibrate' in navigator) { try { navigator.vibrate(10); } catch(_) {} }
    }
  });

  // Wheel horizontal
  let wheelLock = false;
  track?.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    if (wheelLock) return;
    (e.deltaX > 0 ? next : prev)();
    wheelLock = true;
    setTimeout(() => (wheelLock = false), 550);
  }, { passive: false });

  mqMobile.addEventListener?.('change', applyLayout);
  window.addEventListener('resize', applyLayout, { passive: true });

  applyLayout();
})();
