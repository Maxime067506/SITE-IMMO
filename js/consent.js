/* ============================================================
   Delfosse Properties — Gestion du consentement cookies (RGPD)
   Google Consent Mode v2. Bilingue FR/EN.
   -----------------------------------------------------------
   >>> POUR ACTIVER GOOGLE ANALYTICS :
       Renseignez votre identifiant GA4 ci-dessous (ex : 'G-ABCD1234').
       Tant que GA_ID est vide : AUCUN traceur, AUCUN bandeau ne s'affiche
       (le site reste sans cookie de mesure d'audience, conforme par défaut).
       Dès qu'un identifiant est présent : bandeau de consentement + GA
       chargé uniquement APRÈS acceptation.
   ============================================================ */
(function () {
  'use strict';

  var GA_ID = ''; // <<< METTRE ICI 'G-XXXXXXXXXX' POUR ACTIVER LA MESURE D'AUDIENCE
  var LSKEY = 'dp_consent'; // valeurs : 'granted' | 'denied'

  /* ---------- langue ---------- */
  function detectLang() {
    try { var l = localStorage.getItem('dp_lang'); if (l) return l.slice(0, 2); } catch (e) {}
    var h = (document.documentElement.lang || '').slice(0, 2).toLowerCase();
    return h === 'en' ? 'en' : 'fr';
  }
  var EN = detectLang() === 'en';
  var T = EN ? {
    msg: 'We use audience-measurement cookies (Google Analytics) to improve the site.',
    accept: 'Accept', decline: 'Decline', manage: 'Manage', save: 'Save my choice', close: 'Close',
    title: 'Cookie preferences',
    essential: 'Strictly necessary', essentialTxt: 'Required for the site to work (language, secure session). Always on.',
    analytics: 'Audience measurement', analyticsTxt: 'Anonymous statistics (Google Analytics) to understand how the site is used.',
    on: 'On', off: 'Off',
    none: 'This site currently uses only strictly necessary cookies (language, secure session). No audience-measurement or advertising cookie is active.',
    privacy: 'Privacy policy', privHref: '/en/privacy.html'
  } : {
    msg: 'Nous utilisons des cookies de mesure d’audience (Google Analytics) pour améliorer le site.',
    accept: 'Accepter', decline: 'Refuser', manage: 'Gérer', save: 'Enregistrer mon choix', close: 'Fermer',
    title: 'Préférences cookies',
    essential: 'Strictement nécessaires', essentialTxt: 'Indispensables au fonctionnement du site (langue, session sécurisée). Toujours actifs.',
    analytics: 'Mesure d’audience', analyticsTxt: 'Statistiques anonymes (Google Analytics) pour comprendre l’usage du site.',
    on: 'Activé', off: 'Désactivé',
    none: 'Ce site n’utilise actuellement que des cookies strictement nécessaires (langue, session sécurisée). Aucun cookie de mesure d’audience ou publicitaire n’est actif.',
    privacy: 'Politique de confidentialité', privHref: '/politique-confidentialite.html'
  };

  /* ---------- Consent Mode v2 : tout refusé par défaut ---------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted'
  });

  function getConsent() { try { return localStorage.getItem(LSKEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(LSKEY, v); } catch (e) {} }

  function loadGA() {
    if (!GA_ID || window.__dpGAloaded) return;
    window.__dpGAloaded = true;
    gtag('consent', 'update', { analytics_storage: 'granted' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  /* ---------- styles ---------- */
  function injectCSS() {
    if (document.getElementById('dp-consent-css')) return;
    var st = document.createElement('style');
    st.id = 'dp-consent-css';
    st.textContent = [
      '.dp-cc{position:fixed !important;left:50% !important;bottom:16px !important;z-index:9999 !important;',
      'width:min(560px,calc(100% - 24px));background:#0A1628;color:#F5EDE0;',
      'border:1px solid rgba(201,169,97,.35);border-radius:14px;padding:18px 20px;',
      'box-shadow:0 18px 48px rgba(0,0,0,.45);font-family:inherit;line-height:1.55;',
      'opacity:0;transform:translateX(-50%) translateY(10px) !important;transition:opacity .35s ease,transform .35s ease}',
      '.dp-cc.in{opacity:1;transform:translateX(-50%) translateY(0) !important}',
      '.dp-cc p{margin:0 0 14px;font-size:13.5px;color:rgba(245,237,224,.85)}',
      '.dp-cc a{color:#D9BE7E;border-bottom:1px solid rgba(217,190,126,.4)}',
      '.dp-cc-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}',
      '.dp-cc-btn{font:inherit;font-size:13px;letter-spacing:.04em;cursor:pointer;border-radius:9px;',
      'padding:10px 18px;border:1px solid rgba(201,169,97,.5);background:transparent;color:#F5EDE0;transition:all .2s ease}',
      '.dp-cc-btn:hover{border-color:#C9A961}',
      '.dp-cc-btn.primary{background:#C9A961;border-color:#C9A961;color:#0A1628;font-weight:600}',
      '.dp-cc-btn.primary:hover{background:#D9BE7E;border-color:#D9BE7E}',
      '.dp-cc-btn.link{border:0;padding:10px 4px;color:rgba(245,237,224,.7);text-decoration:underline}',
      '.dp-cc-ov{position:fixed !important;inset:0 !important;z-index:10000 !important;background:rgba(6,14,26,.6);backdrop-filter:blur(4px);',
      'display:flex !important;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity .25s ease}',
      '.dp-cc-ov.in{opacity:1}',
      '.dp-cc-modal{width:min(480px,100%);background:#0A1628;color:#F5EDE0;border:1px solid rgba(201,169,97,.3);',
      'border-radius:16px;padding:26px;box-shadow:0 24px 60px rgba(0,0,0,.5);max-height:88vh;overflow:auto}',
      '.dp-cc-modal h2{margin:0 0 16px;font-size:18px;letter-spacing:.02em;color:#F5EDE0;font-weight:500}',
      '.dp-cc-item{padding:14px 0;border-top:1px solid rgba(201,169,97,.18)}',
      '.dp-cc-item:first-of-type{border-top:0}',
      '.dp-cc-item h3{margin:0 0 4px;font-size:14px;font-weight:600;display:flex;justify-content:space-between;align-items:center;gap:12px}',
      '.dp-cc-item p{margin:0;font-size:12.5px;color:rgba(245,237,224,.7)}',
      '.dp-cc-pill{font-size:11px;letter-spacing:.06em;text-transform:uppercase;padding:3px 10px;border-radius:999px;',
      'border:1px solid rgba(245,237,224,.3);color:rgba(245,237,224,.6);white-space:nowrap}',
      '.dp-cc-sw{position:relative;width:46px;height:26px;border-radius:999px;background:rgba(245,237,224,.18);',
      'border:0;cursor:pointer;flex:0 0 auto;transition:background .2s ease}',
      '.dp-cc-sw[aria-checked="true"]{background:#C9A961}',
      '.dp-cc-sw::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;',
      'background:#fff;transition:transform .2s ease}',
      '.dp-cc-sw[aria-checked="true"]::after{transform:translateX(20px)}',
      '.dp-cc-modal .dp-cc-row{margin-top:20px;justify-content:flex-end}',
      '@media (max-width:520px){.dp-cc .dp-cc-row{flex-direction:column;align-items:stretch}.dp-cc-btn{text-align:center}}'
    ].join('');
    document.head.appendChild(st);
  }

  /* ---------- bandeau ---------- */
  var banner = null;
  function showBanner() {
    if (banner || !GA_ID) return;
    injectCSS();
    banner = document.createElement('div');
    banner.className = 'dp-cc';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', T.title);
    banner.innerHTML =
      '<p>' + T.msg + ' <a href="' + T.privHref + '">' + T.privacy + '</a></p>' +
      '<div class="dp-cc-row">' +
        '<button class="dp-cc-btn primary" data-a="accept">' + T.accept + '</button>' +
        '<button class="dp-cc-btn" data-a="decline">' + T.decline + '</button>' +
        '<button class="dp-cc-btn link" data-a="manage">' + T.manage + '</button>' +
      '</div>';
    document.body.appendChild(banner);
    requestAnimationFrame(function () { banner.classList.add('in'); });
    banner.addEventListener('click', function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-a');
      if (a === 'accept') { setConsent('granted'); loadGA(); hideBanner(); }
      else if (a === 'decline') { setConsent('denied'); gtag('consent', 'update', { analytics_storage: 'denied' }); hideBanner(); }
      else if (a === 'manage') { openPanel(); }
    });
  }
  function hideBanner() {
    if (!banner) return;
    banner.classList.remove('in');
    var b = banner; banner = null;
    setTimeout(function () { if (b && b.parentNode) b.parentNode.removeChild(b); }, 350);
  }

  /* ---------- panneau de préférences ---------- */
  function openPanel() {
    injectCSS();
    var consent = getConsent();
    var analyticsOn = GA_ID && consent === 'granted';
    var ov = document.createElement('div');
    ov.className = 'dp-cc-ov';
    var analyticsRow = GA_ID
      ? '<div class="dp-cc-item"><h3>' + T.analytics +
          '<button class="dp-cc-sw" role="switch" aria-checked="' + (analyticsOn ? 'true' : 'false') + '" data-sw="analytics" aria-label="' + T.analytics + '"></button>' +
        '</h3><p>' + T.analyticsTxt + '</p></div>'
      : '<div class="dp-cc-item"><h3>' + T.analytics + '<span class="dp-cc-pill">' + T.off + '</span></h3><p>' + T.none + '</p></div>';
    ov.innerHTML =
      '<div class="dp-cc-modal" role="dialog" aria-modal="true" aria-label="' + T.title + '">' +
        '<h2>' + T.title + '</h2>' +
        '<div class="dp-cc-item"><h3>' + T.essential + '<span class="dp-cc-pill">' + T.on + '</span></h3><p>' + T.essentialTxt + '</p></div>' +
        analyticsRow +
        '<div class="dp-cc-row">' +
          (GA_ID ? '<button class="dp-cc-btn primary" data-a="save">' + T.save + '</button>' : '') +
          '<button class="dp-cc-btn" data-a="close">' + (GA_ID ? T.close : T.close) + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
    requestAnimationFrame(function () { ov.classList.add('in'); });

    function close() { ov.classList.remove('in'); setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 250); }

    ov.addEventListener('click', function (e) {
      if (e.target === ov) { close(); return; }
      var sw = e.target.getAttribute && e.target.getAttribute('data-sw');
      if (sw === 'analytics') {
        var on = e.target.getAttribute('aria-checked') === 'true';
        e.target.setAttribute('aria-checked', on ? 'false' : 'true');
        return;
      }
      var a = e.target.getAttribute && e.target.getAttribute('data-a');
      if (a === 'close') { close(); }
      else if (a === 'save') {
        var swEl = ov.querySelector('[data-sw="analytics"]');
        var want = swEl && swEl.getAttribute('aria-checked') === 'true';
        if (want) { setConsent('granted'); loadGA(); }
        else { setConsent('denied'); gtag('consent', 'update', { analytics_storage: 'denied' }); }
        hideBanner();
        close();
      }
    });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });
  }

  /* ---------- API publique + câblage ---------- */
  window.dpConsent = { open: openPanel, accept: function () { setConsent('granted'); loadGA(); hideBanner(); }, decline: function () { setConsent('denied'); hideBanner(); } };

  function wire() {
    var btn = document.getElementById('dp-cookies-btn');
    if (btn) btn.addEventListener('click', function (e) { e.preventDefault(); openPanel(); });

    if (GA_ID) {
      var c = getConsent();
      if (c === 'granted') loadGA();
      else if (c === 'denied') gtag('consent', 'update', { analytics_storage: 'denied' });
      else showBanner();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
})();
