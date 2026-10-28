/* =====================================================================
   guest-validate.js — Coordonnées du voyageur (formulaire de réservation)
   ---------------------------------------------------------------------
   Prénom, nom, e-mail et téléphone obligatoires et valides : le bouton de
   paiement reste bloqué tant que ce n'est pas le cas. Mêmes règles que le
   serveur (api/_lib/guest.js), qui refuse de toute façon une saisie invalide.
   Usage : var form = DPGuest.mount(container, { lang:'fr', button:'Payer', onSubmit:fn(values) })
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

  var TXT = {
    fr: {
      first: 'Prénom', last: 'Nom', email: 'E-mail', phone: 'Téléphone',
      phonePh: '06 12 34 56 78 ou +44 …',
      errFirst: 'Indiquez votre prénom.', errLast: 'Indiquez votre nom.',
      errEmail: 'Adresse e-mail invalide (ex. nom@exemple.fr).',
      errPhone: 'Numéro invalide. Pour un numéro étranger, ajoutez l\'indicatif (ex. +44).',
      hint: 'Complétez vos coordonnées pour continuer.',
      note: 'Votre confirmation de réservation sera envoyée à cette adresse.'
    },
    en: {
      first: 'First name', last: 'Last name', email: 'Email', phone: 'Phone',
      phonePh: '+44 7911 123456',
      errFirst: 'Please enter your first name.', errLast: 'Please enter your last name.',
      errEmail: 'Invalid email address (e.g. name@example.com).',
      errPhone: 'Invalid number. Please include the country code (e.g. +44).',
      hint: 'Please complete your details to continue.',
      note: 'Your booking confirmation will be sent to this address.'
    }
  };

  var CSS =
    '.dpg{display:grid;gap:12px;margin-top:16px}' +
    '.dpg-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '@media(max-width:420px){.dpg-row{grid-template-columns:1fr}}' +
    '.dpg-f label{display:block;font-family:var(--f-sans,sans-serif);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-muted,#8C7F72);margin-bottom:6px}' +
    '.dpg-f input{width:100%;box-sizing:border-box;background:#fff;border:1px solid rgba(26,21,18,.18);border-radius:4px;font-family:var(--f-sans,sans-serif);font-size:15px;color:var(--ink,#1a1512);padding:11px 12px;transition:border-color .2s ease,box-shadow .2s ease}' +
    '.dpg-f input:focus{outline:none;border-color:var(--accent,#B69368);box-shadow:0 0 0 3px rgba(182,147,104,.18)}' +
    '.dpg-f.is-bad input{border-color:#b5574d;box-shadow:0 0 0 3px rgba(181,87,77,.12)}' +
    '.dpg-f.is-ok input{border-color:rgba(63,107,67,.55)}' +
    '.dpg-err{font-family:var(--f-sans,sans-serif);font-size:12px;color:#9c4a42;margin-top:5px;line-height:1.4;display:none}' +
    '.dpg-f.is-bad .dpg-err{display:block}' +
    '.dpg-note{font-family:var(--f-sans,sans-serif);font-size:11.5px;color:var(--ink-muted,#8C7F72);font-style:italic;margin:0;line-height:1.45}' +
    '.dpg-btn[aria-disabled="true"]{opacity:.45;cursor:not-allowed}';

  function injectCss() {
    if (document.getElementById('dpgCss')) return;
    var st = document.createElement('style'); st.id = 'dpgCss'; st.textContent = CSS;
    document.head.appendChild(st);
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  function mount(box, opts) {
    injectCss();
    var t = TXT[opts.lang === 'en' ? 'en' : 'fr'];
    var btnClass = opts.buttonClass || '';
    function field(k, label, type, ac, ph, err) {
      return '<div class="dpg-f" data-f="' + k + '"><label for="dpg-' + k + '">' + esc(label) + ' *</label>' +
        '<input id="dpg-' + k + '" type="' + type + '" autocomplete="' + ac + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') +
        (type === 'tel' ? ' inputmode="tel"' : '') + ' required aria-required="true">' +
        '<div class="dpg-err" role="alert">' + esc(err) + '</div></div>';
    }
    box.innerHTML =
      '<div class="dpg">' +
        '<div class="dpg-row">' +
          field('first', t.first, 'text', 'given-name', '', t.errFirst) +
          field('last', t.last, 'text', 'family-name', '', t.errLast) +
        '</div>' +
        field('email', t.email, 'email', 'email', '', t.errEmail) +
        field('phone', t.phone, 'tel', 'tel', t.phonePh, t.errPhone) +
        '<p class="dpg-note">' + esc(t.note) + '</p>' +
        '<button type="button" class="dpg-btn ' + esc(btnClass) + '">' + esc(opts.button) + '</button>' +
      '</div>';

    var CHECK = { first: cleanName, last: cleanName, email: cleanEmail, phone: cleanPhone };
    var touched = {};
    var btn = box.querySelector('.dpg-btn');

    function values() {
      var v = {};
      Object.keys(CHECK).forEach(function (k) { v[k] = box.querySelector('#dpg-' + k).value; });
      return v;
    }
    function paint(showAll) {
      var v = values(), allOk = true;
      Object.keys(CHECK).forEach(function (k) {
        var ok = !!CHECK[k](v[k]), f = box.querySelector('[data-f="' + k + '"]');
        if (!ok) allOk = false;
        var show = showAll || touched[k];
        f.classList.toggle('is-bad', !ok && !!show);
        f.classList.toggle('is-ok', ok && !!v[k]);
      });
      btn.setAttribute('aria-disabled', allOk ? 'false' : 'true');
      return allOk;
    }
    Object.keys(CHECK).forEach(function (k) {
      var inp = box.querySelector('#dpg-' + k);
      inp.addEventListener('blur', function () { if (inp.value) touched[k] = true; paint(false); });
      inp.addEventListener('input', function () { paint(false); });
    });
    btn.addEventListener('click', function () {
      if (!paint(true)) {
        if (opts.onInvalid) opts.onInvalid(t.hint);
        var bad = box.querySelector('.dpg-f.is-bad input'); if (bad) bad.focus();
        return;
      }
      var v = values();
      opts.onSubmit({
        guest_first_name: cleanName(v.first), guest_last_name: cleanName(v.last),
        guest_email: cleanEmail(v.email), guest_phone: cleanPhone(v.phone)
      }, btn);
    });
    paint(false);
    return {
      button: btn,
      // Le serveur a refusé certains champs : on les signale.
      markInvalid: function (fields) {
        var map = { first_name: 'first', last_name: 'last', email: 'email', phone: 'phone' };
        (fields || []).forEach(function (f) { var el = box.querySelector('[data-f="' + (map[f] || f) + '"]'); if (el) el.classList.add('is-bad'); });
      }
    };
  }

  window.DPGuest = { mount: mount, cleanName: cleanName, cleanEmail: cleanEmail, cleanPhone: cleanPhone };
})();
