/* =====================================================================
   guest-validate.js — Coordonnées du voyageur (formulaire de réservation)
   ---------------------------------------------------------------------
   1. Prénom, nom, e-mail et téléphone obligatoires et valides (indicatif
      choisi dans une liste avec drapeaux).
   2. Code à 6 chiffres envoyé par e-mail (/api/booking/verify) : il faut le
      saisir pour pouvoir payer.
   Mêmes règles que le serveur (api/_lib/guest.js + checkout.js), qui refuse
   de toute façon une saisie invalide ou un e-mail non confirmé.
   Usage : DPGuest.mount(container, { lang, button, buttonClass, onInvalid(msg), onSubmit(values, btn) })
   ===================================================================== */
(function () {
  'use strict';

  var NAME_RE = /^\p{L}[\p{L}\p{M}' .-]*$/u;
  var EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i;

  function cleanName(v) {
    var s = String(v == null ? '' : v).trim().replace(/\s+/g, ' ');
    return s.length >= 2 && s.length <= 60 && NAME_RE.test(s) ? s : null;
  }
  function cleanEmail(v) {
    var s = String(v == null ? '' : v).trim().toLowerCase();
    return s.length <= 200 && EMAIL_RE.test(s) ? s : null;
  }
  function cleanPhone(v) {
    var s = String(v == null ? '' : v).trim().replace(/[\s.\-()/]/g, '');
    if (s.indexOf('00') === 0) s = '+' + s.slice(2);
    if (/^0[1-9]\d{8}$/.test(s)) s = '+33' + s.slice(1);
    if (!/^\+[1-9]\d{7,14}$/.test(s)) return null;
    if (s.indexOf('+33') === 0 && !/^\+33[1-9]\d{8}$/.test(s)) return null;
    return s;
  }
  // Indicatif + numéro national (le 0 initial est retiré : 06… -> +33 6…)
  function fullPhone(dial, national) {
    var n = String(national || '').replace(/[\s.\-()/]/g, '');
    if (n.charAt(0) === '+' || n.indexOf('00') === 0) return cleanPhone(n); // numéro complet collé
    n = n.replace(/^0+/, '');
    return n ? cleanPhone(dial + n) : null;
  }

  // [code ISO, indicatif, nom FR, nom EN]
  var COUNTRIES = [
    ['fr', '+33', 'France', 'France'], ['be', '+32', 'Belgique', 'Belgium'], ['ch', '+41', 'Suisse', 'Switzerland'],
    ['lu', '+352', 'Luxembourg', 'Luxembourg'], ['mc', '+377', 'Monaco', 'Monaco'], ['gb', '+44', 'Royaume-Uni', 'United Kingdom'],
    ['ie', '+353', 'Irlande', 'Ireland'], ['de', '+49', 'Allemagne', 'Germany'], ['it', '+39', 'Italie', 'Italy'],
    ['es', '+34', 'Espagne', 'Spain'], ['pt', '+351', 'Portugal', 'Portugal'], ['nl', '+31', 'Pays-Bas', 'Netherlands'],
    ['at', '+43', 'Autriche', 'Austria'], ['dk', '+45', 'Danemark', 'Denmark'], ['se', '+46', 'Suède', 'Sweden'],
    ['no', '+47', 'Norvège', 'Norway'], ['fi', '+358', 'Finlande', 'Finland'], ['pl', '+48', 'Pologne', 'Poland'],
    ['cz', '+420', 'Tchéquie', 'Czechia'], ['gr', '+30', 'Grèce', 'Greece'], ['ro', '+40', 'Roumanie', 'Romania'],
    ['hu', '+36', 'Hongrie', 'Hungary'], ['us', '+1', 'États-Unis', 'United States'], ['ca', '+1', 'Canada', 'Canada'],
    ['br', '+55', 'Brésil', 'Brazil'], ['mx', '+52', 'Mexique', 'Mexico'], ['ar', '+54', 'Argentine', 'Argentina'],
    ['au', '+61', 'Australie', 'Australia'], ['nz', '+64', 'Nouvelle-Zélande', 'New Zealand'], ['jp', '+81', 'Japon', 'Japan'],
    ['cn', '+86', 'Chine', 'China'], ['kr', '+82', 'Corée du Sud', 'South Korea'], ['in', '+91', 'Inde', 'India'],
    ['sg', '+65', 'Singapour', 'Singapore'], ['il', '+972', 'Israël', 'Israel'], ['ae', '+971', 'Émirats arabes unis', 'United Arab Emirates'],
    ['sa', '+966', 'Arabie saoudite', 'Saudi Arabia'], ['qa', '+974', 'Qatar', 'Qatar'], ['ma', '+212', 'Maroc', 'Morocco'],
    ['dz', '+213', 'Algérie', 'Algeria'], ['tn', '+216', 'Tunisie', 'Tunisia'], ['tr', '+90', 'Turquie', 'Türkiye'],
    ['za', '+27', 'Afrique du Sud', 'South Africa'], ['ua', '+380', 'Ukraine', 'Ukraine'], ['ru', '+7', 'Russie', 'Russia']
  ];
  function flagUrl(iso) { return 'https://flagcdn.com/w40/' + iso + '.png'; }

  var TXT = {
    fr: {
      first: 'Prénom', last: 'Nom', email: 'E-mail', phone: 'Téléphone', phonePh: '6 12 34 56 78',
      search: 'Rechercher un pays…', country: 'Indicatif du pays',
      errFirst: 'Indiquez votre prénom.', errLast: 'Indiquez votre nom.',
      errEmail: 'Adresse e-mail invalide (ex. nom@exemple.fr).',
      errPhone: 'Numéro invalide pour ce pays.',
      hint: 'Complétez vos coordonnées pour continuer.',
      send: 'Recevoir mon code par e-mail', sending: 'Envoi…',
      sent: 'Un code à 6 chiffres vient d\'être envoyé à {email}. Pensez à regarder dans vos spams.',
      code: 'Code reçu par e-mail', codeErr: 'Saisissez les 6 chiffres du code.',
      resend: 'Renvoyer le code', resendIn: 'Renvoyer le code ({s} s)', change: 'Modifier l\'e-mail',
      note: 'Nous vérifions votre adresse : votre confirmation de réservation y sera envoyée.'
    },
    en: {
      first: 'First name', last: 'Last name', email: 'Email', phone: 'Phone', phonePh: '7911 123456',
      search: 'Search a country…', country: 'Country code',
      errFirst: 'Please enter your first name.', errLast: 'Please enter your last name.',
      errEmail: 'Invalid email address (e.g. name@example.com).',
      errPhone: 'Invalid number for this country.',
      hint: 'Please complete your details to continue.',
      send: 'Email me a code', sending: 'Sending…',
      sent: 'A 6-digit code has just been sent to {email}. Please check your spam folder.',
      code: 'Code received by email', codeErr: 'Enter the 6-digit code.',
      resend: 'Resend code', resendIn: 'Resend code ({s} s)', change: 'Change email',
      note: 'We verify your address: your booking confirmation will be sent there.'
    }
  };

  var CSS =
    '.dpg{display:grid;gap:12px;margin-top:16px}' +
    '.dpg-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '@media(max-width:420px){.dpg-row{grid-template-columns:1fr}}' +
    '.dpg-f label{display:block;font-family:var(--f-sans,sans-serif);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-muted,#8C7F72);margin-bottom:6px}' +
    '.dpg-f input{width:100%;box-sizing:border-box;background:#fff;border:1px solid rgba(26,21,18,.18);border-radius:4px;font-family:var(--f-sans,sans-serif);font-size:15px;color:var(--ink,#1a1512);padding:11px 12px;transition:border-color .2s ease,box-shadow .2s ease}' +
    '.dpg-f input:focus{outline:none;border-color:var(--accent,#B69368);box-shadow:0 0 0 3px rgba(182,147,104,.18)}' +
    '.dpg-f.is-bad input,.dpg-f.is-bad .dpg-cc{border-color:#b5574d;box-shadow:0 0 0 3px rgba(181,87,77,.12)}' +
    '.dpg-f.is-ok input{border-color:rgba(63,107,67,.55)}' +
    '.dpg-err{font-family:var(--f-sans,sans-serif);font-size:12px;color:#9c4a42;margin-top:5px;line-height:1.4;display:none}' +
    '.dpg-f.is-bad .dpg-err{display:block}' +
    '.dpg-tel{display:flex;gap:8px;position:relative}' +
    '.dpg-cc{flex:0 0 auto;display:flex;align-items:center;gap:7px;background:#fff;border:1px solid rgba(26,21,18,.18);border-radius:4px;padding:0 10px;cursor:pointer;font-family:var(--f-sans,sans-serif);font-size:15px;color:var(--ink,#1a1512);transition:border-color .2s ease}' +
    '.dpg-cc:hover,.dpg-cc[aria-expanded="true"]{border-color:var(--accent,#B69368)}' +
    '.dpg-cc img,.dpg-opt img{width:22px;height:16px;object-fit:cover;border-radius:2px;box-shadow:0 0 0 1px rgba(0,0,0,.08)}' +
    '.dpg-cc .car{font-size:10px;opacity:.6;transition:transform .2s ease}' +
    '.dpg-cc[aria-expanded="true"] .car{transform:rotate(180deg)}' +
    '.dpg-menu{position:absolute;left:0;top:calc(100% + 6px);z-index:30;width:min(320px,100%);background:#fff;border:1px solid rgba(26,21,18,.14);border-radius:8px;box-shadow:0 22px 50px -20px rgba(26,21,18,.45);padding:8px;display:none;animation:dpgIn .18s ease}' +
    '.dpg-menu.open{display:block}' +
    '@keyframes dpgIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}' +
    '.dpg-menu input{width:100%;box-sizing:border-box;border:1px solid rgba(26,21,18,.16);border-radius:6px;padding:9px 10px;font-family:var(--f-sans,sans-serif);font-size:14px;margin-bottom:6px}' +
    '.dpg-list{max-height:240px;overflow-y:auto;margin:0;padding:0;list-style:none}' +
    '.dpg-opt{display:flex;align-items:center;gap:10px;padding:8px 9px;border-radius:5px;cursor:pointer;font-family:var(--f-sans,sans-serif);font-size:14px;color:var(--ink,#1a1512)}' +
    '.dpg-opt:hover,.dpg-opt.is-cur{background:rgba(182,147,104,.14)}' +
    '.dpg-opt .d{margin-left:auto;color:var(--ink-muted,#8C7F72);font-family:var(--f-mono,monospace);font-size:13px}' +
    '.dpg-code{display:none;gap:10px}' +
    '.dpg.step-code .dpg-code{display:grid}' +
    '.dpg-sent{font-family:var(--f-sans,sans-serif);font-size:13px;line-height:1.5;color:#3f6b43;background:rgba(63,107,67,.08);border-radius:6px;padding:10px 12px;margin:0}' +
    '.dpg-f input.dpg-otp{font-family:var(--f-mono,monospace);font-size:24px;letter-spacing:.5em;text-align:center;padding:12px}' +
    '.dpg-links{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}' +
    '.dpg-link{background:none;border:none;padding:0;cursor:pointer;font-family:var(--f-sans,sans-serif);font-size:12.5px;color:var(--accent-dk,#7A5A28);text-decoration:underline;text-underline-offset:3px}' +
    '.dpg-link:disabled{color:var(--ink-muted,#8C7F72);text-decoration:none;cursor:default}' +
    '.dpg-note{font-family:var(--f-sans,sans-serif);font-size:11.5px;color:var(--ink-muted,#8C7F72);font-style:italic;margin:0;line-height:1.45}' +
    '.dpg-btn[aria-disabled="true"]{opacity:.45;cursor:not-allowed}';

  function injectCss() {
    if (document.getElementById('dpgCss')) return;
    var st = document.createElement('style'); st.id = 'dpgCss'; st.textContent = CSS;
    document.head.appendChild(st);
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  function mount(box, opts) {
    injectCss();
    var lang = opts.lang === 'en' ? 'en' : 'fr';
    var t = TXT[lang];
    var NAME_I = lang === 'en' ? 3 : 2;
    var country = COUNTRIES.filter(function (c) { return c[0] === (lang === 'en' ? 'gb' : 'fr'); })[0];
    var token = null, sentTo = null, cooldown = 0, timer = null;

    function field(k, label, inner, err) {
      return '<div class="dpg-f" data-f="' + k + '"><label for="dpg-' + k + '">' + esc(label) + ' *</label>' + inner +
        '<div class="dpg-err" role="alert">' + esc(err) + '</div></div>';
    }
    function input(k, type, ac, extra) {
      return '<input id="dpg-' + k + '" type="' + type + '" autocomplete="' + ac + '" required aria-required="true"' + (extra || '') + '>';
    }
    box.innerHTML =
      '<div class="dpg">' +
        '<div class="dpg-row">' +
          field('first', t.first, input('first', 'text', 'given-name'), t.errFirst) +
          field('last', t.last, input('last', 'text', 'family-name'), t.errLast) +
        '</div>' +
        field('email', t.email, input('email', 'email', 'email'), t.errEmail) +
        field('phone', t.phone,
          '<div class="dpg-tel">' +
            '<button type="button" class="dpg-cc" aria-haspopup="listbox" aria-expanded="false" aria-label="' + esc(t.country) + '"></button>' +
            input('phone', 'tel', 'tel-national', ' inputmode="tel" placeholder="' + esc(t.phonePh) + '"') +
            '<div class="dpg-menu" role="dialog"><input type="search" placeholder="' + esc(t.search) + '" aria-label="' + esc(t.search) + '"><ul class="dpg-list" role="listbox"></ul></div>' +
          '</div>', t.errPhone) +
        '<div class="dpg-code">' +
          '<p class="dpg-sent"></p>' +
          field('code', t.code, input('code', 'text', 'one-time-code', ' class="dpg-otp" inputmode="numeric" maxlength="6" pattern="[0-9]*"'), t.codeErr) +
          '<div class="dpg-links"><button type="button" class="dpg-link" data-resend></button><button type="button" class="dpg-link" data-change>' + esc(t.change) + '</button></div>' +
        '</div>' +
        '<p class="dpg-note">' + esc(t.note) + '</p>' +
        '<button type="button" class="dpg-btn ' + esc(opts.buttonClass || '') + '"></button>' +
      '</div>';

    var root = box.querySelector('.dpg');
    var btn = box.querySelector('.dpg-btn');
    var cc = box.querySelector('.dpg-cc'), menu = box.querySelector('.dpg-menu');
    var search = menu.querySelector('input'), list = menu.querySelector('.dpg-list');
    var $ = function (k) { return box.querySelector('#dpg-' + k); };

    // ---- Indicatif pays (liste avec drapeaux) ----
    function renderCc() {
      cc.innerHTML = '<img src="' + flagUrl(country[0]) + '" alt="" width="22" height="16"><span>' + country[1] + '</span><span class="car">▾</span>';
      cc.title = country[NAME_I] + ' ' + country[1];
    }
    function renderList(q) {
      var nq = norm(q || '');
      list.innerHTML = COUNTRIES.filter(function (c) {
        return !nq || norm(c[NAME_I]).indexOf(nq) !== -1 || c[1].indexOf(nq.replace(/^\+?/, '+')) === 0;
      }).map(function (c) {
        return '<li class="dpg-opt' + (c === country ? ' is-cur' : '') + '" role="option" data-iso="' + c[0] + '">' +
          '<img src="' + flagUrl(c[0]) + '" alt="" width="22" height="16" loading="lazy"><span>' + esc(c[NAME_I]) + '</span><span class="d">' + c[1] + '</span></li>';
      }).join('');
    }
    function openMenu(on) {
      menu.classList.toggle('open', on); cc.setAttribute('aria-expanded', on ? 'true' : 'false');
      if (on) { search.value = ''; renderList(''); setTimeout(function () { search.focus(); }, 0); }
    }
    cc.addEventListener('click', function () { openMenu(!menu.classList.contains('open')); });
    search.addEventListener('input', function () { renderList(search.value); });
    search.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { openMenu(false); cc.focus(); }
      if (e.key === 'Enter') { e.preventDefault(); var first = list.querySelector('.dpg-opt'); if (first) first.click(); }
    });
    list.addEventListener('click', function (e) {
      var li = e.target.closest('.dpg-opt'); if (!li) return;
      country = COUNTRIES.filter(function (c) { return c[0] === li.getAttribute('data-iso'); })[0];
      renderCc(); openMenu(false); touched.phone = !!$('phone').value; paint(false); $('phone').focus();
    });
    document.addEventListener('click', function (e) { if (!e.target.closest || !e.target.closest('.dpg-tel')) openMenu(false); });
    renderCc();

    // ---- Validation ----
    var CHECK = {
      first: function (v) { return cleanName(v); },
      last: function (v) { return cleanName(v); },
      email: function (v) { return cleanEmail(v); },
      phone: function (v) { return fullPhone(country[1], v); }
    };
    var touched = {};
    function values() { var v = {}; Object.keys(CHECK).forEach(function (k) { v[k] = $(k).value; }); return v; }
    function detailsOk(showAll) {
      var v = values(), allOk = true;
      Object.keys(CHECK).forEach(function (k) {
        var ok = !!CHECK[k](v[k]), f = box.querySelector('[data-f="' + k + '"]');
        if (!ok) allOk = false;
        f.classList.toggle('is-bad', !ok && !!(showAll || touched[k]));
        f.classList.toggle('is-ok', ok && !!v[k]);
      });
      return allOk;
    }
    function codeOk() { return /^\d{6}$/.test($('code').value); }
    function paint(showAll) {
      var ok = detailsOk(showAll);
      var codeStep = !!token;
      btn.textContent = codeStep ? opts.button : t.send;
      btn.setAttribute('aria-disabled', ok && (!codeStep || codeOk()) ? 'false' : 'true');
      return ok;
    }
    Object.keys(CHECK).forEach(function (k) {
      var inp = $(k);
      inp.addEventListener('blur', function () { if (inp.value) touched[k] = true; paint(false); });
      inp.addEventListener('input', function () {
        // E-mail modifié après l'envoi du code : il faut un nouveau code.
        if (k === 'email' && token && cleanEmail(inp.value) !== sentTo) resetCode();
        paint(false);
      });
    });
    $('code').addEventListener('input', function () {
      $('code').value = $('code').value.replace(/\D/g, '').slice(0, 6);
      box.querySelector('[data-f="code"]').classList.remove('is-bad');
      paint(false);
      if (codeOk()) btn.focus();
    });

    // ---- Code par e-mail ----
    function tick() {
      var b = box.querySelector('[data-resend]');
      if (cooldown > 0) { b.disabled = true; b.textContent = t.resendIn.replace('{s}', cooldown); cooldown--; timer = setTimeout(tick, 1000); }
      else { b.disabled = false; b.textContent = t.resend; }
    }
    function resetCode() {
      token = null; sentTo = null; clearTimeout(timer); root.classList.remove('step-code'); $('code').value = '';
    }
    function sendCode() {
      var email = cleanEmail($('email').value);
      btn.disabled = true; var label = btn.textContent; btn.textContent = t.sending;
      return fetch('/api/booking/verify/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, lang: lang }) })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (j) {
          btn.disabled = false; btn.textContent = label;
          if (!j.ok) { if (opts.onInvalid) opts.onInvalid(j.error || t.hint); return; }
          token = j.token; sentTo = email;
          root.classList.add('step-code');
          box.querySelector('.dpg-sent').textContent = t.sent.replace('{email}', email);
          cooldown = 60; clearTimeout(timer); tick();
          if (opts.onInvalid) opts.onInvalid('');
          paint(false); $('code').focus();
        })
        .catch(function (e) { btn.disabled = false; btn.textContent = label; if (opts.onInvalid) opts.onInvalid(String(e.message || e)); });
    }
    box.querySelector('[data-resend]').addEventListener('click', sendCode);
    box.querySelector('[data-change]').addEventListener('click', function () { resetCode(); paint(false); $('email').focus(); });

    btn.addEventListener('click', function () {
      if (btn.disabled) return;
      if (!paint(true)) {
        if (opts.onInvalid) opts.onInvalid(t.hint);
        var bad = box.querySelector('.dpg-f.is-bad input'); if (bad) bad.focus();
        return;
      }
      if (!token) { sendCode(); return; }
      if (!codeOk()) { box.querySelector('[data-f="code"]').classList.add('is-bad'); $('code').focus(); return; }
      var v = values();
      opts.onSubmit({
        guest_first_name: cleanName(v.first), guest_last_name: cleanName(v.last),
        guest_email: cleanEmail(v.email), guest_phone: fullPhone(country[1], v.phone),
        email_code: $('code').value, email_token: token
      }, btn);
    });
    paint(false);

    return {
      button: btn,
      // Le serveur a refusé : on signale les champs (ou le code) en cause.
      markInvalid: function (fields) {
        var map = { first_name: 'first', last_name: 'last', email: 'email', phone: 'phone', code: 'code' };
        (fields || []).forEach(function (f) { var el = box.querySelector('[data-f="' + (map[f] || f) + '"]'); if (el) el.classList.add('is-bad'); });
      },
      codeRejected: function (expired) {
        if (expired) { resetCode(); paint(false); return; }
        box.querySelector('[data-f="code"]').classList.add('is-bad'); $('code').select();
      }
    };
  }

  window.DPGuest = { mount: mount, cleanName: cleanName, cleanEmail: cleanEmail, cleanPhone: cleanPhone, fullPhone: fullPhone };
})();
