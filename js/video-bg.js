/* ============================================================
   Delfosse Properties — Video Background + Overlay Manager
   Direction B « Verre fumé de Rolls »
   ============================================================

   Rôle : vidéo YouTube en fond permanent (position:fixed) +
   overlay navy glacé piloté selon la section visible.

   Niveaux :
     0 → Fenêtre ouverte (overlay 0, blur 0, grain .04)
     1 → Voile léger   (overlay navy 28, blur 12px, grain .04)
     2 → Vitre teintée (overlay navy 58 glacé, blur 22px, grain .04)
     3 → Panneau opaque (navy 92, blur 0, grain .04)

   Pas de dépendance. IIFE safe, injecte la DOM au chargement.
   ============================================================ */

(() => {
  const YOUTUBE_ID = 'PvgCx1C5wK0';
  const POSTER_URL = 'img/nice-sunset.jpg'; // LCP fallback si iframe lente / reduced-motion
  const STORAGE_KEY = 'dp_video_paused';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none)').matches;

  // Détection iOS Safari — fixed + iframe peut poser problème historique.
  // On détecte précisément iPhone/iPad non-Chrome pour activer le fallback sticky.
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua) && !window.MSStream;
  const isIOSSafari = isIOS && !/CriOS|FxiOS|EdgiOS/.test(ua);
  if (isIOSSafari) {
    document.documentElement.classList.add('ios-safari');
  }

  /* ------------------ Niveaux B — IDENTIQUES desktop ↔ mobile ------------------ */
  // Règle du brief : « Les overlays glassmorphism et leurs niveaux » ne changent jamais
  // entre desktop et mobile. La lisibilité vient du text-shadow, jamais d'un overlay plus opaque.
  const LEVELS = {
    0: { ov: 'rgba(10,22,40,0)',     blur: 0,   grain: 0.04 },
    1: { ov: 'rgba(10,22,40,.28)',   blur: 12,  grain: 0.04 },
    2: { ov: 'rgba(15,36,56,.58)',   blur: 22,  grain: 0.04 },
    3: { ov: 'rgba(10,22,40,.92)',   blur: 0,   grain: 0.04 },
  };
  const getLevels = () => LEVELS;

  /* ============================================================
     1. INJECTION DE LA DOM (idempotent — 1 seule fois)
     ============================================================ */
  function inject() {
    if (document.querySelector('.vbg-wrap')) return;

    document.body.classList.add('has-video-bg');

    // Poster (LCP, toujours présent) — responsive srcset + fetchPriority high
    const wrap = document.createElement('div');
    wrap.className = 'vbg-wrap';
    wrap.setAttribute('aria-hidden', 'true');

    const poster = document.createElement('img');
    poster.className = 'vbg-poster';
    // Srcset : 3 tailles (mobile/tablet/desktop), toutes basées sur la même photo
    poster.srcset = [
      `${POSTER_URL} 1200w`,
    ].join(', ');
    poster.sizes = '100vw';
    poster.src = POSTER_URL;
    poster.alt = '';
    poster.decoding = 'async';
    poster.loading = 'eager';
    // fetchPriority (compatible Chrome, ignored ailleurs)
    poster.setAttribute('fetchpriority', 'high');
    wrap.appendChild(poster);

    // Ken Burns sur le poster : garde un mouvement cinématique tant que la vidéo charge.
    if (!reducedMotion) {
      poster.classList.add('is-kenburns');
    }

    // Iframe vidéo YouTube (sauf reduced-motion)
    if (!reducedMotion) {
      const frame = document.createElement('iframe');
      frame.className = 'vbg-frame';
      frame.title = 'Ambiance Nice — Delfosse Properties';
      frame.setAttribute('aria-hidden', 'true');
      frame.setAttribute('tabindex', '-1');
      frame.loading = 'eager';
      frame.allow = 'autoplay; encrypted-media';
      const params = [
        'autoplay=1', 'mute=1', 'loop=1',
        `playlist=${YOUTUBE_ID}`,
        'controls=0', 'showinfo=0', 'rel=0',
        'iv_load_policy=3', 'modestbranding=1',
        'playsinline=1', 'disablekb=1', 'fs=0',
        'enablejsapi=1',
      ].join('&');
      frame.src = `https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?${params}`;
      frame.addEventListener('load', () => {
        // Fade out poster quand l'iframe a répondu
        setTimeout(() => poster.classList.add('is-hidden'), 1400);
      });
      wrap.appendChild(frame);
    }

    // Overlay piloté + grain
    const overlay = document.createElement('div');
    overlay.className = 'vbg-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    const grain = document.createElement('div');
    grain.className = 'vbg-grain';
    grain.setAttribute('aria-hidden', 'true');

    // Bouton pause / play
    const ctrl = document.createElement('button');
    ctrl.type = 'button';
    ctrl.className = 'vbg-control';
    ctrl.setAttribute('aria-label', 'Mettre la vidéo en pause');
    ctrl.setAttribute('title', 'Vidéo d\u2019ambiance · Pause');
    ctrl.innerHTML = `
      <span class="pulse" aria-hidden="true"></span>
      <svg viewBox="0 0 24 24" aria-hidden="true" class="ico-pause"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>
      <svg viewBox="0 0 24 24" aria-hidden="true" class="ico-play" style="display:none"><path d="M7 4l14 8-14 8V4z"/></svg>
    `;

    // Sticky booking bar (mobile uniquement, cachée desktop via CSS)
    // Pointe vers la section carousel (réservation Airbnb)
    const stickyBar = document.createElement('a');
    stickyBar.className = 'vbg-booking';
    stickyBar.href = '#carousel';
    stickyBar.setAttribute('aria-label', 'Réserver sur Airbnb');
    stickyBar.innerHTML = `
      <span class="vbg-booking-mark"></span>
      <span class="vbg-booking-label" data-i18n="book.stickyCta">Réserver sur Airbnb</span>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
    `;

    // Sur iOS Safari, toutes les couches doivent être prepend pour que sticky fonctionne.
    // Desktop (position:fixed) : peu importe l'emplacement DOM.
    if (isIOSSafari) {
      document.body.prepend(grain);
      document.body.prepend(overlay);
      document.body.prepend(wrap);
    } else {
      document.body.prepend(wrap);
      document.body.appendChild(overlay);
      document.body.appendChild(grain);
    }
    document.body.appendChild(ctrl);
    document.body.appendChild(stickyBar);

    // Masque la sticky bar quand la section carousel est visible (conversion déjà en vue)
    const carouselSection = document.getElementById('carousel');
    if (carouselSection) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          document.body.classList.toggle('booking-in-view', e.isIntersecting);
        });
      }, { threshold: 0.15 });
      obs.observe(carouselSection);
    }

    // Restore état pause / play persistant
    const paused = localStorage.getItem(STORAGE_KEY) === '1';
    if (paused) setPaused(true);

    ctrl.addEventListener('click', () => togglePause());

    // Default state : niveau 0 (tout à 0)
    setLevel(0, /*instant*/ true);
  }

  /* ============================================================
     2. CONTRÔLE PAUSE / PLAY (via YouTube postMessage)
     ============================================================ */
  function postYT(cmd) {
    const frame = document.querySelector('.vbg-frame');
    if (!frame || !frame.contentWindow) return;
    try {
      frame.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: cmd,
        args: [],
      }), '*');
    } catch (_) {}
  }
  function setPaused(paused) {
    const ctrl = document.querySelector('.vbg-control');
    if (!ctrl) return;
    const ico1 = ctrl.querySelector('.ico-pause');
    const ico2 = ctrl.querySelector('.ico-play');
    if (paused) {
      postYT('pauseVideo');
      ctrl.classList.add('is-paused');
      ctrl.setAttribute('aria-label', 'Lire la vidéo');
      ico1.style.display = 'none';
      ico2.style.display = 'block';
    } else {
      postYT('playVideo');
      ctrl.classList.remove('is-paused');
      ctrl.setAttribute('aria-label', 'Mettre la vidéo en pause');
      ico1.style.display = 'block';
      ico2.style.display = 'none';
    }
    localStorage.setItem(STORAGE_KEY, paused ? '1' : '0');
  }
  function togglePause() {
    const ctrl = document.querySelector('.vbg-control');
    if (!ctrl) return;
    setPaused(!ctrl.classList.contains('is-paused'));
  }

  /* ============================================================
     3. OVERLAY MANAGER : suit la section visible
     ============================================================ */
  let currentLevel = 0;

  function setLevel(level, instant = false) {
    if (level === currentLevel && !instant) return;
    currentLevel = level;
    const def = getLevels()[level] || LEVELS[0];
    const root = document.documentElement;
    if (instant) {
      root.style.setProperty('--video-ov', def.ov);
      root.style.setProperty('--video-blur', `${def.blur}px`);
      root.style.setProperty('--video-grain', String(def.grain));
    } else {
      // Transition via CSS (déjà gérée par .vbg-overlay)
      root.style.setProperty('--video-ov', def.ov);
      root.style.setProperty('--video-blur', `${def.blur}px`);
      root.style.setProperty('--video-grain', String(def.grain));
    }
  }

  function attachObservers() {
    const sections = document.querySelectorAll('[data-overlay]');
    if (!sections.length) return;

    // On veut la section la plus centrée dans le viewport
    const io = new IntersectionObserver((entries) => {
      // Trouver celle avec le plus grand ratio
      let best = null;
      let bestR = 0;
      entries.forEach((e) => {
        if (e.isIntersecting && e.intersectionRatio > bestR) {
          best = e.target;
          bestR = e.intersectionRatio;
        }
      });
      if (best) {
        const lvl = parseInt(best.dataset.overlay || '0', 10);
        setLevel(Number.isNaN(lvl) ? 0 : lvl);
      }
    }, {
      // Considère une section "active" quand son centre est dans la moitié centrale
      rootMargin: '-30% 0px -30% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    sections.forEach((s) => io.observe(s));
  }

  /* Réapplique le niveau au changement de breakpoint (mobile vs desktop) */
  function watchBreakpoint() {
    const mq = window.matchMedia('(max-width: 760px)');
    mq.addEventListener?.('change', () => setLevel(currentLevel, true));
  }

  /* ============================================================
     4. LABEL POUR DES ZONES DE RESPIRATION
     ============================================================ */
  function decorateBreathZones() {
    document.querySelectorAll('.breath-zone:not(.is-labeled)').forEach((z) => {
      if (!z.querySelector('.breath-zone-label')) {
        const label = z.getAttribute('data-label') || '';
        if (label) {
          const span = document.createElement('span');
          span.className = 'breath-zone-label';
          span.textContent = label;
          z.appendChild(span);
        }
      }
      z.classList.add('is-labeled');
    });
  }

  /* ============================================================
     5. HORLOGE NICE (heure locale, mono)
     ============================================================ */
  function initNiceClock() {
    const els = document.querySelectorAll('.nice-clock');
    if (!els.length) return;
    const fmt = new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit', minute: '2-digit',
      timeZone: 'Europe/Paris', hour12: false,
    });
    const tick = () => {
      const text = `Nice · ${fmt.format(new Date())}`;
      els.forEach((el) => { el.textContent = text; });
    };
    tick();
    setInterval(tick, 30000);
  }

  /* ============================================================
     BOOT
     ============================================================ */
  /* ============================================================
     6. KINETIC TITLES — révélation mot par mot au scroll-reveal
     Cible : tout élément avec data-kinetic (y compris .display, .h-display,
     ou les titres à bold italic signature). Utilisé par le hero + manifesto.
     ============================================================ */
  function initKinetic() {
    const titles = document.querySelectorAll('[data-kinetic]');
    if (!titles.length) return;

    titles.forEach((el) => {
      if (el.dataset.kineticDone === '1') return;
      el.dataset.kineticDone = '1';

      // Split en mots tout en préservant les <br/> et <em>
      const splitText = (node) => {
        const out = [];
        node.childNodes.forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            const words = child.textContent.split(/(\s+)/);
            words.forEach((w) => {
              if (!w) return;
              if (/^\s+$/.test(w)) {
                out.push(document.createTextNode(w));
              } else {
                const span = document.createElement('span');
                span.className = 'kw';
                span.textContent = w;
                out.push(span);
              }
            });
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const tag = child.tagName.toLowerCase();
            if (tag === 'br') {
              out.push(document.createElement('br'));
            } else {
              // <em>...</em> : récursif, garde le tag mais split le texte à l'intérieur
              const clone = document.createElement(tag);
              for (const attr of child.attributes) {
                clone.setAttribute(attr.name, attr.value);
              }
              const childSplit = splitText(child);
              childSplit.forEach(c => clone.appendChild(c));
              out.push(clone);
            }
          }
        });
        return out;
      };

      const split = splitText(el);
      el.innerHTML = '';
      split.forEach(n => el.appendChild(n));
      el.classList.add('kinetic-ready');
    });

    // Reveal on intersection
    const reveal = (target, delay = 0) => {
      const words = target.querySelectorAll('.kw');
      words.forEach((w, i) => {
        w.style.transitionDelay = `${delay + i * 65}ms`;
      });
      target.classList.add('kinetic-in');
    };

    if (reducedMotion) {
      titles.forEach(t => t.classList.add('kinetic-in'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const delay = parseInt(e.target.dataset.kineticDelay || '0', 10);
          reveal(e.target, delay);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3, rootMargin: '-5% 0px' });

    titles.forEach(t => io.observe(t));

    // Safari iOS — filet de sécurité 2.5s.
    // Si un titre déjà visible n'a pas reçu kinetic-in (bug IO parfois sur Safari
    // pour les éléments déjà en viewport au load), on force la révélation.
    setTimeout(() => {
      titles.forEach((t) => {
        if (!t.classList.contains('kinetic-in')) {
          const rect = t.getBoundingClientRect();
          const inView = rect.top < window.innerHeight && rect.bottom > 0;
          if (inView) {
            const delay = parseInt(t.dataset.kineticDelay || '0', 10);
            reveal(t, delay);
            io.unobserve(t);
          }
        }
      });
    }, 2500);
  }

  /* ============================================================
     7. SCORE TABULAR ROLL — compteur aéroport pour le score Airbnb
     ============================================================ */
  function initScoreRoll() {
    const score = document.getElementById('revScore');
    if (!score) return;
    const digits = [...score.querySelectorAll('.rev-digit')];
    if (!digits.length) return;

    // Convertit chaque .rev-digit en colonne déroulable 0→target
    digits.forEach((d) => {
      const target = parseInt(d.dataset.target || '0', 10);
      const roll = document.createElement('span');
      roll.className = 'roll';
      for (let i = 0; i <= target; i++) {
        const s = document.createElement('span');
        s.textContent = String(i);
        roll.appendChild(s);
      }
      d.textContent = '';
      d.appendChild(roll);
    });

    const run = () => {
      digits.forEach((d, i) => {
        const target = parseInt(d.dataset.target || '0', 10);
        const roll = d.querySelector('.roll');
        // Décalage de 150ms entre chaque chiffre pour effet séquentiel
        setTimeout(() => {
          roll.style.transform = `translateY(-${target}em)`;
        }, 400 + i * 180);
      });
    };

    if (reducedMotion) {
      digits.forEach((d) => {
        const target = parseInt(d.dataset.target || '0', 10);
        d.textContent = String(target);
      });
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          run();
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    io.observe(score);
  }

  /* ============================================================
     8. MANIFESTO — slide-up au reveal
     ============================================================ */
  function initManifesto() {
    const mf = document.querySelector('.manifesto');
    if (!mf) return;
    if (reducedMotion) {
      mf.classList.add('is-visible');
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.25 });
    io.observe(mf);
  }

  /* ============================================================
     9. REVIEWS CAROUSEL (mobile) — 1 slide visible, autoplay 7s
     ============================================================ */
  function initReviewsCarousel() {
    const track = document.getElementById('reviewsGrid');
    const dotsWrap = document.getElementById('reviewsDots');
    if (!track || !dotsWrap) return;
    const slides = [...track.querySelectorAll('.rev-slide')];
    if (!slides.length) return;

    const mqMobile = window.matchMedia('(max-width: 820px)');
    const AUTOPLAY = 7000;

    // Build dots
    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rev-dot-btn';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Avis ${i + 1}`);
      dotsWrap.appendChild(b);
      return b;
    });

    let active = 0;
    let timer = null;
    let paused = false;

    const setActive = (i) => {
      active = ((i % slides.length) + slides.length) % slides.length;
      dots.forEach((d, k) => {
        d.classList.toggle('is-active', k === active);
        d.setAttribute('aria-selected', k === active ? 'true' : 'false');
      });
    };

    const goTo = (i) => {
      if (!mqMobile.matches) return;
      const target = slides[((i % slides.length) + slides.length) % slides.length];
      track.scrollTo({ left: target.offsetLeft - 24, behavior: 'smooth' });
    };

    const scheduleAutoplay = () => {
      clearTimeout(timer);
      if (paused || reducedMotion || !mqMobile.matches) return;
      timer = setTimeout(() => goTo(active + 1), AUTOPLAY);
    };

    dots.forEach((d, i) => {
      d.addEventListener('click', () => {
        goTo(i);
        scheduleAutoplay();
      });
    });

    // Sync active on scroll (mobile only)
    let scrollRaf = null;
    const onScroll = () => {
      if (!mqMobile.matches) return;
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null;
        const center = track.scrollLeft + track.clientWidth / 2;
        let best = 0, bestD = Infinity;
        slides.forEach((s, i) => {
          const mid = s.offsetLeft + s.offsetWidth / 2;
          const d = Math.abs(mid - center);
          if (d < bestD) { bestD = d; best = i; }
        });
        if (best !== active) setActive(best);
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });

    track.addEventListener('touchstart', () => { paused = true; clearTimeout(timer); }, { passive: true });
    track.addEventListener('touchend',   () => { setTimeout(() => { paused = false; scheduleAutoplay(); }, 1000); });
    track.addEventListener('mouseenter', () => { paused = true; clearTimeout(timer); });
    track.addEventListener('mouseleave', () => { paused = false; scheduleAutoplay(); });

    // Desktop reveal staggered
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          track.classList.add('is-in');
          revealIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    revealIO.observe(track);

    // Autoplay kickoff on intersection (mobile only)
    const autoplayIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          scheduleAutoplay();
          autoplayIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.35 });
    autoplayIO.observe(track);

    // Initial
    setActive(0);

    // Reset autoplay quand breakpoint change
    mqMobile.addEventListener?.('change', () => {
      clearTimeout(timer);
      if (mqMobile.matches) scheduleAutoplay();
    });
  }

  function boot() {
    inject();
    attachObservers();
    watchBreakpoint();
    decorateBreathZones();
    initNiceClock();
    initKinetic();
    initScoreRoll();
    initManifesto();
    initReviewsCarousel();
    initHeroSafetyNet();
  }

  // Safari iOS — si l'animation CSS 'hero-in' ne s'applique pas (bug occasionnel
  // avec fill-mode 'forwards' + keyframe 'to'-only), on force la visibilité après 2s.
  function initHeroSafetyNet() {
    setTimeout(() => {
      const items = document.querySelectorAll('.hero-film-content > *');
      items.forEach((el) => {
        const cs = getComputedStyle(el);
        if (parseFloat(cs.opacity) < 0.05) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
    }, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
