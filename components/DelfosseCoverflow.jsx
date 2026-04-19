import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Delfosse Properties — Coverflow 3D
 * -----------------------------------
 * Un diaporama 3D façon Apple Cover Flow avec overlay holographique
 * iridescent, conçu pour la charte Delfosse (navy profond, crème, or).
 *
 * • Dispositif éventail : carte active frontale, voisines inclinées ~35°,
 *   externes ~55° avec opacité dégressive. Perspective 2000px.
 * • Overlay "reflet de pellicule" : linear-gradient animé multicolore
 *   en `mix-blend-mode: overlay`, subtil et continu.
 * • Transitions 1s en `cubic-bezier(.22,1,.36,1)`, décalage d'entrée 80ms.
 * • Autoplay 6s, pause au hover / focus / swipe, boucle infinie.
 * • Accessibilité : aria, focus visible, Flèches ←/→, Entrée sur la carte.
 * • Responsive : mobile réduit angles, échelle et nombre de voisines.
 *
 * Dépendances : React + Tailwind uniquement.
 * Polices attendues : Cormorant Garamond (italic) + Jost, chargées depuis
 * le document hôte (<link> Google Fonts).
 */

/* -------------------------------- DATA --------------------------------- */

const DEFAULT_APARTMENTS = [
  {
    no: "01",
    name: "L'Amiral",
    tag: "PORT",
    loc: "Port · 4 voyageurs",
    rating: "4,87",
    image: "img/airbnb/01-amiral/photo-01.jpg",
    href: "sejour-01.html",
  },
  {
    no: "02",
    name: "Le Commodore",
    tag: "JUMEAU",
    loc: "Port · 4 voyageurs",
    rating: "4,88",
    image: "img/airbnb/02-commodore/photo-01.jpg",
    href: "sejour-02.html",
  },
  {
    no: "03",
    name: "La Basilique",
    tag: "FAMILLE",
    loc: "Notre-Dame · 6 voyageurs",
    rating: "4,84",
    image: "img/airbnb/03-basilique/photo-01.jpg",
    href: "sejour-03.html",
  },
  {
    no: "04",
    name: "Le Transatlantique",
    tag: "ART DÉCO",
    loc: "Gare · 4 voyageurs",
    rating: "4,86",
    image: "img/airbnb/04-transatlantique/photo-01.jpg",
    href: "sejour-04.html",
  },
  {
    no: "05",
    name: "L'Adagio",
    tag: "DESIGN",
    loc: "Musiciens · 4 voyageurs",
    rating: "4,81",
    image: "img/airbnb/05-adagio/photo-01.jpg",
    href: "sejour-05.html",
  },
  {
    no: "06",
    name: "Le Scherzo",
    tag: "ULTRA DESIGN",
    loc: "Musiciens · 4 voyageurs",
    rating: "4,94",
    image: "img/airbnb/06-scherzo/photo-01.jpg",
    href: "sejour-06.html",
  },
  {
    no: "07",
    name: "Le Crescendo",
    tag: "RÉNOVÉ",
    loc: "Musiciens · 4 voyageurs",
    rating: "4,69",
    image: "img/airbnb/07-crescendo/photo-01.jpg",
    href: "sejour-07.html",
  },
];

/* ------------------------------ TOKENS 3D ------------------------------ */
// Couche 0 = carte active. Abs(delta) croissant pour les voisines.
const LAYERS_DESKTOP = [
  { tx: 0,    tz: 0,    ry: 0,  scale: 1.0,  opacity: 1,    blur: 0,   haloIntensity: 0.28 },
  { tx: 230,  tz: -160, ry: 34, scale: 0.85, opacity: 0.88, blur: 0,   haloIntensity: 0.15 },
  { tx: 420,  tz: -340, ry: 54, scale: 0.70, opacity: 0.45, blur: 0.4, haloIntensity: 0.08 },
  { tx: 580,  tz: -520, ry: 58, scale: 0.55, opacity: 0.14, blur: 1.2, haloIntensity: 0.04 },
];

const AUTOPLAY_MS = 6000;
const DURATION_MS = 1000;
const EASE = "cubic-bezier(.22,1,.36,1)";

/* ------------------------------ COMPOSANT ------------------------------ */

export default function DelfosseCoverflow({
  items = DEFAULT_APARTMENTS,
  onSelect,
  className = "",
}) {
  const total = items.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [enteredCards, setEntered] = useState(new Set());
  const trackRef = useRef(null);
  const timerRef = useRef(null);
  const reduceMotion = usePrefersReducedMotion();
  const isMobile = useMedia("(max-width: 760px)");

  // Couches ajustées selon la taille : mobile = 3 cartes visibles, angles adoucis
  const layers = useMemo(() => {
    if (!isMobile) return LAYERS_DESKTOP;
    return LAYERS_DESKTOP.map((l, i) => ({
      ...l,
      tx: l.tx * 0.5,
      tz: l.tz * 0.6,
      ry: l.ry * 0.7,
      scale: i === 0 ? 0.95 : l.scale * 0.88,
      opacity: i >= 2 ? 0 : l.opacity, // seules active + 2 voisines visibles
      blur: 0,
    }));
  }, [isMobile]);

  /* Distance signée la plus courte → boucle infinie sans saut */
  const signedDelta = useCallback(
    (i) => {
      let d = i - active;
      const half = total / 2;
      if (d > half) d -= total;
      if (d < -half) d += total;
      return d;
    },
    [active, total]
  );

  const goTo = useCallback(
    (i) => setActive(((i % total) + total) % total),
    [total]
  );
  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  /* Autoplay */
  useEffect(() => {
    if (paused || reduceMotion) return;
    timerRef.current = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(timerRef.current);
  }, [active, paused, reduceMotion, next]);

  /* Apparition initiale avec décalage 80ms entre cartes */
  useEffect(() => {
    const timers = [];
    items.forEach((_, i) => {
      const order = Math.abs(signedDelta(i));
      const t = setTimeout(() => {
        setEntered((prev) => {
          const s = new Set(prev);
          s.add(i);
          return s;
        });
      }, 120 + order * 80);
      timers.push(t);
    });
    const m = setTimeout(() => setMounted(true), 40);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(m);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Clavier */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect?.(items[active], active);
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [next, prev, active, items, onSelect]);

  /* Swipe tactile */
  const touchStart = useRef({ x: 0, y: 0, t: 0 });
  const onTouchStart = (e) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      t: Date.now(),
    };
    setPaused(true);
  };
  const onTouchEnd = (e) => {
    const { x, y, t } = touchStart.current;
    const dx = e.changedTouches[0].clientX - x;
    const dy = e.changedTouches[0].clientY - y;
    const dt = Date.now() - t;
    const isSwipe = Math.abs(dx) > Math.abs(dy) && (Math.abs(dx) > 40 || (Math.abs(dx) > 20 && dt < 250));
    if (isSwipe) (dx < 0 ? next : prev)();
    setTimeout(() => setPaused(false), 1200);
  };

  /* Scroll horizontal (molette / trackpad) */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let lock = false;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // scroll vertical classique
      e.preventDefault();
      if (lock) return;
      (e.deltaX > 0 ? next : prev)();
      lock = true;
      setTimeout(() => (lock = false), 550);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  const handleCardClick = (i) => {
    if (i === active) onSelect?.(items[i], i);
    else goTo(i);
  };

  const activeItem = items[active];

  return (
    <section
      className={`dp-coverflow relative w-full overflow-hidden bg-[#0A1628] ${className}`}
      aria-roledescription="carousel"
      aria-label="Sept adresses Delfosse Properties"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <style>{HOLO_CSS}</style>

      {/* Vignette ambiance */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 25%, rgba(10,22,40,0.92) 92%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-16 pb-24 md:pt-24 md:pb-28">
        {/* Eyebrow */}
        <div
          className="mb-4 flex items-center gap-3 text-[11px] tracking-[0.3em] text-[#C9A961]"
          style={{ fontFamily: "Jost, sans-serif", fontWeight: 500 }}
        >
          <span className="inline-block h-px w-10 bg-[#C9A961]" />
          N° II — VII ADRESSES
        </div>

        {/* Titre */}
        <h2
          className="mb-12 max-w-4xl text-[clamp(40px,6vw,88px)] leading-[1.05] text-[#F5EDE0] md:mb-16"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
        >
          Sept adresses,{" "}
          <em style={{ fontWeight: 400 }}>une seule Riviera.</em>
        </h2>

        {/* Track 3D */}
        <div
          ref={trackRef}
          tabIndex={0}
          role="group"
          aria-label={`${activeItem.name}, ${active + 1} sur ${total}`}
          aria-live="polite"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative mx-auto h-[min(62vh,540px)] outline-none focus-visible:ring-1 focus-visible:ring-[#C9A961]/50 md:h-[min(68vh,620px)]"
          style={{ perspective: "2000px" }}
        >
          <div
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            {items.map((it, i) => {
              const d = signedDelta(i);
              const absD = Math.abs(d);
              const layer = layers[Math.min(absD, layers.length - 1)];
              const sign = d === 0 ? 0 : d > 0 ? 1 : -1;
              const isActive = d === 0;
              const isEntered = enteredCards.has(i) && mounted;

              const tx = sign * layer.tx;
              const tz = isEntered ? layer.tz : layer.tz - 80;
              const ry = -sign * layer.ry;
              const scale = isEntered ? layer.scale : Math.max(layer.scale - 0.1, 0.5);
              const opacity = !isEntered ? 0 : absD > 3 ? 0 : layer.opacity;
              const zIndex = 100 - absD;

              return (
                <article
                  key={it.no}
                  aria-hidden={!isActive}
                  aria-label={`${it.name} — ${it.loc}`}
                  onClick={() => handleCardClick(i)}
                  className={`group absolute left-1/2 top-1/2 h-[clamp(340px,58vh,540px)] w-[clamp(260px,27vw,400px)] cursor-pointer overflow-hidden rounded-[12px] ${
                    isActive ? "shadow-[0_60px_140px_-40px_rgba(0,0,0,0.7)]" : ""
                  }`}
                  style={{
                    transform: `translate(-50%, -50%) translate3d(${tx}px, 0, ${tz}px) rotateY(${ry}deg) scale(${scale})`,
                    opacity,
                    zIndex,
                    filter: layer.blur ? `blur(${layer.blur}px)` : "none",
                    transition: reduceMotion
                      ? "none"
                      : `transform ${DURATION_MS}ms ${EASE}, opacity 800ms ${EASE}, filter 800ms ${EASE}`,
                    willChange: "transform, opacity, filter",
                    border: "1px solid rgba(245,237,224,0.18)",
                    background: "#0d1b30",
                    boxShadow: isActive
                      ? "0 60px 140px -40px rgba(0,0,0,0.72), 0 0 0 1px rgba(201,169,97,0.22)"
                      : "0 30px 90px -40px rgba(0,0,0,0.55)",
                  }}
                >
                  {/* Numéro + tag gravés en haut */}
                  <div
                    className="absolute left-0 right-0 top-0 z-[4] flex items-start justify-between px-5 pt-4 text-[10px] tracking-[0.32em] text-[#F5EDE0]/85"
                    style={{ fontFamily: "Jost, sans-serif" }}
                  >
                    <span>N°{it.no}</span>
                    <span>{it.tag}</span>
                  </div>

                  {/* Image plein cadre */}
                  <img
                    src={it.image}
                    alt=""
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full select-none object-cover transition-transform duration-[1400ms]"
                    style={{
                      transitionTimingFunction: EASE,
                      transform: isActive ? "scale(1.04)" : "scale(1)",
                    }}
                  />

                  {/* Dégradé bas pour lisibilité */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-2/5"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.6) 55%, transparent 100%)",
                    }}
                  />

                  {/* Overlay holographique — reflet pellicule */}
                  {!reduceMotion && (
                    <div
                      aria-hidden="true"
                      className="dp-holo pointer-events-none absolute inset-0 z-[3]"
                      style={{
                        opacity: isActive ? layer.haloIntensity : layer.haloIntensity * 0.5,
                        mixBlendMode: "overlay",
                      }}
                    />
                  )}

                  {/* Bandeau bas : titre + meta */}
                  <div className="absolute inset-x-0 bottom-0 z-[4] px-5 pb-5 text-[#F5EDE0]">
                    <h3
                      className="text-[clamp(22px,2.2vw,30px)] italic leading-tight"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 400,
                      }}
                    >
                      {it.name}
                    </h3>
                    <p
                      className="mt-1.5 flex items-center gap-2 text-[10px] tracking-[0.22em] text-[#F5EDE0]/80"
                      style={{ fontFamily: "Jost, sans-serif" }}
                    >
                      <span className="inline-block h-px w-5 bg-[#C9A961]" />
                      {it.loc.toUpperCase()}
                      <span className="opacity-50">·</span>
                      <span>★ {it.rating}</span>
                    </p>
                  </div>

                  {/* Halo subtil sur carte active au hover */}
                  {isActive && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        boxShadow:
                          "inset 0 0 80px rgba(201,169,97,0.15), 0 0 60px rgba(201,169,97,0.1)",
                      }}
                    />
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* Contrôles bas */}
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6 md:mt-14">
          {/* Compteur */}
          <div
            className="flex items-baseline gap-2 text-[#F5EDE0]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            aria-live="polite"
          >
            <span
              key={active}
              className="dp-counter text-[clamp(44px,5vw,72px)] italic leading-none text-[#F5EDE0]"
              style={{ fontWeight: 300 }}
            >
              {String(active + 1).padStart(2, "0")}
            </span>
            <span className="text-[22px] text-[#C9A961]/50">/</span>
            <span
              className="text-[12px] tracking-[0.25em] text-[#F5EDE0]/60"
              style={{ fontFamily: "Jost, sans-serif" }}
            >
              {String(total).padStart(2, "0")}
            </span>
          </div>

          {/* Pagination tirets */}
          <div
            className="order-3 flex w-full items-center justify-center gap-[10px] md:order-none md:w-auto"
            role="tablist"
            aria-label="Sélection d'adresse"
          >
            {items.map((it, i) => (
              <button
                key={it.no}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Aller à ${it.name}`}
                onClick={() => goTo(i)}
                className="block h-[2px] border-0 p-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A961]/60"
                style={{
                  width: i === active ? 56 : 22,
                  background: i === active ? "#F5EDE0" : "rgba(245,237,224,0.3)",
                  transition: `width 550ms ${EASE}, background 550ms ${EASE}`,
                }}
              />
            ))}
          </div>

          {/* Flèches */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Adresse précédente"
              className="grid h-11 w-11 place-items-center rounded-full border border-[#F5EDE0]/35 text-[#F5EDE0] transition-all duration-300 hover:border-[#F5EDE0] hover:bg-[#F5EDE0] hover:text-[#0A1628] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A961]/60"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Adresse suivante"
              className="grid h-11 w-11 place-items-center rounded-full border border-[#F5EDE0]/35 text-[#F5EDE0] transition-all duration-300 hover:border-[#F5EDE0] hover:bg-[#F5EDE0] hover:text-[#0A1628] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A961]/60"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ UTILITAIRES ----------------------------- */

function useMedia(query) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(query);
    const h = () => setMatch(mq.matches);
    h();
    mq.addEventListener?.("change", h) ?? mq.addListener(h);
    return () =>
      mq.removeEventListener?.("change", h) ?? mq.removeListener(h);
  }, [query]);
  return match;
}

function usePrefersReducedMotion() {
  return useMedia("(prefers-reduced-motion: reduce)");
}

/* ------------------------- CSS : holo + cur-pop ------------------------- */
// Reflet "pellicule" multicolore en diagonale, animé en continu.
// mix-blend-mode: overlay laisse passer la lumière des photos.

const HOLO_CSS = `
.dp-holo {
  background:
    linear-gradient(
      115deg,
      rgba(255,180,210,0)   0%,
      rgba(255,180,210,1)  12%,
      rgba(180,230,255,1)  26%,
      rgba(200,170,255,1)  40%,
      rgba(170,255,210,1)  55%,
      rgba(255,220,170,1)  70%,
      rgba(255,180,210,1)  84%,
      rgba(255,180,210,0) 100%
    );
  background-size: 260% 100%;
  background-position: 0% 50%;
  animation: dp-holo-shift 11s linear infinite, dp-holo-hue 14s linear infinite;
  will-change: background-position, filter;
}
@keyframes dp-holo-shift {
  from { background-position: 0% 50%; }
  to   { background-position: 260% 50%; }
}
@keyframes dp-holo-hue {
  0%, 100% { filter: hue-rotate(0deg) saturate(1); }
  50%      { filter: hue-rotate(30deg) saturate(1.1); }
}
.dp-counter {
  display: inline-block;
  animation: dp-cur-pop 600ms cubic-bezier(.22,1,.36,1);
}
@keyframes dp-cur-pop {
  0%   { transform: translateY(14px); opacity: 0; }
  60%  { transform: translateY(-2px); opacity: 1; }
  100% { transform: translateY(0); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .dp-holo { animation: none !important; }
  .dp-counter { animation: none !important; }
}
`;
