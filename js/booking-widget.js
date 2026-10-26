/* =====================================================================
   booking-widget.js — Reservation en direct (pages sejour)
   ---------------------------------------------------------------------
   S'auto-initialise sur chaque <div data-booking-widget="NN">.
   Flux : dates + voyageurs -> devis live (/api/booking/quote) -> coordonnees
   -> paiement. Le devis est TOUJOURS calcule cote serveur. La dispo (resa
   directes + iCal Airbnb) est pre-verifiee cote client pour un retour
   immediat, et re-verifiee cote serveur au devis.

   PAYMENT_READY passe a true quand Stripe est branche (lot suivant).
   ===================================================================== */
(function () {
  'use strict';
  var PAYMENT_READY = true; // Stripe actif (mode test tant que cles test)

  function lang() {
    try { if (window.DP_I18N && window.DP_I18N.lang) return window.DP_I18N.lang(); } catch (e) {}
    return (document.documentElement.lang || 'fr').slice(0, 2);
  }
  var FR = {
    eyebrow: 'Réservation en direct', title: 'Vérifiez vos dates',
    sub: 'Réservez en direct, sans frais de service — paiement sécurisé.',
    in: 'Arrivée', out: 'Départ', guests: 'Voyageurs', see: 'Voir le prix',
    night: 'nuit', nights: 'nuits', cleaning: 'Frais de ménage', tax: 'Taxe de séjour',
    total: 'Total', deposit: 'Caution (pré-autorisation, non débitée) :',
    book: 'Réserver et payer', soon: 'Le paiement en ligne s\'active très bientôt. En attendant, réservez sur Airbnb :',
    airbnb: 'Réserver sur Airbnb', badDates: 'Choisissez vos dates d\'arrivée et de départ.',
    unavail: 'Ces dates ne sont pas disponibles.', minNights: 'Séjour minimum de {n} nuits.',
    tooSoon: 'Réservez un peu plus à l\'avance.', loading: 'Calcul…',
    name: 'Nom complet', email: 'E-mail', phone: 'Téléphone', confirm: 'Continuer vers le paiement',
    back: 'Modifier les dates', perNight: '/ nuit',
  };
  var EN = {
    eyebrow: 'Book direct', title: 'Check your dates',
    sub: 'Book direct, no service fee — secure payment.',
    in: 'Check-in', out: 'Check-out', guests: 'Guests', see: 'See the price',
    night: 'night', nights: 'nights', cleaning: 'Cleaning fee', tax: 'Tourist tax',
    total: 'Total', deposit: 'Deposit (pre-authorisation, not charged):',
    book: 'Book & pay', soon: 'Online payment is going live very soon. In the meantime, book on Airbnb:',
    airbnb: 'Book on Airbnb', badDates: 'Pick your check-in and check-out dates.',
    unavail: 'These dates are not available.', minNights: 'Minimum stay of {n} nights.',
    tooSoon: 'Please book a little further ahead.', loading: 'Calculating…',
    name: 'Full name', email: 'Email', phone: 'Phone', confirm: 'Continue to payment',
    back: 'Change dates', perNight: '/ night',
  };
  function T() { return lang() === 'en' ? EN : FR; }

  function eur(c) {
    return (Number(c || 0) / 100).toLocaleString(lang() === 'en' ? 'en-GB' : 'fr-FR',
      { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function todayISO(off) { var d = new Date(); d.setDate(d.getDate() + (off || 0)); return d.toISOString().slice(0, 10); }

  function api(path, opts) {
    opts = opts || {};
    var headers = {};
    if (opts.body) headers['Content-Type'] = 'application/json';
    return fetch(path, { method: opts.method || 'GET', headers: headers, body: opts.body ? JSON.stringify(opts.body) : undefined })
      .then(function (r) { return r.json().then(function (j) { return { status: r.status, body: j }; }, function () { return { status: r.status, body: {} }; }); });
  }

  function init(el) {
    var apt = String(el.getAttribute('data-booking-widget') || '').padStart(2, '0');
    var maxGuests = parseInt(el.getAttribute('data-max-guests'), 10) || 4;
    var airbnbUrl = el.getAttribute('data-airbnb-url') || '';
    var t = T();
    var state = { unavailable: [], quote: null };

    var guestOpts = '';
    for (var g = 1; g <= maxGuests; g++) guestOpts += '<option value="' + g + '"' + (g === 2 ? ' selected' : '') + '>' + g + '</option>';

    el.classList.add('dpb');
    el.innerHTML =
      '<div class="dpb-card">' +
        '<p class="dpb-eyebrow">' + esc(t.eyebrow) + '</p>' +
        '<h3 class="dpb-title">' + esc(t.title) + '</h3>' +
        '<p class="dpb-sub">' + esc(t.sub) + '</p>' +
        '<div class="dpb-row">' +
          '<div class="dpb-field"><label>' + esc(t.in) + '</label><input type="date" data-in min="' + todayISO(1) + '"></div>' +
          '<div class="dpb-field"><label>' + esc(t.out) + '</label><input type="date" data-out min="' + todayISO(2) + '"></div>' +
          '<div class="dpb-field dpb-guests"><label>' + esc(t.guests) + '</label><select data-guests>' + guestOpts + '</select></div>' +
        '</div>' +
        '<button class="dpb-btn gold" data-quote>' + esc(t.see) + '</button>' +
        '<div class="dpb-result" hidden data-result></div>' +
        '<div class="dpb-guestform hidden" data-guestform></div>' +
        '<div class="dpb-msg" data-msg></div>' +
      '</div>';

    var $ = function (sel) { return el.querySelector(sel); };
    var inEl = $('[data-in]'), outEl = $('[data-out]'), gEl = $('[data-guests]');
    var resEl = $('[data-result]'), msgEl = $('[data-msg]'), gfEl = $('[data-guestform]');

    function setMsg(txt, kind) { msgEl.textContent = txt || ''; msgEl.className = 'dpb-msg' + (kind ? ' ' + kind : ''); }

    // Quand l'arrivee change, le depart mini = arrivee + 1
    inEl.addEventListener('change', function () {
      if (inEl.value) { var d = new Date(inEl.value); d.setDate(d.getDate() + 1); outEl.min = d.toISOString().slice(0, 10);
        if (outEl.value && outEl.value <= inEl.value) outEl.value = ''; }
    });

    // Pre-check client : la plage touche-t-elle une periode indispo ?
    function clientClash(ci, co) {
      return state.unavailable.some(function (r) { return r.start < co && r.end > ci; });
    }

    $('[data-quote]').addEventListener('click', function () {
      var ci = inEl.value, co = outEl.value, guests = gEl.value;
      resEl.hidden = true; gfEl.classList.add('hidden');
      if (!ci || !co || co <= ci) { setMsg(t.badDates, 'err'); return; }
      if (clientClash(ci, co)) { setMsg(t.unavail, 'err'); return; }
      var btn = this; btn.disabled = true; setMsg(t.loading, '');
      api('/api/booking/quote?apt=' + apt + '&check_in=' + ci + '&check_out=' + co + '&guests=' + guests)
        .then(function (r) {
          btn.disabled = false; setMsg('', '');
          var q = r.body || {};
          if (!q.ok) {
            if (q.code === 'min_nights') setMsg(t.minNights.replace('{n}', q.min_nights), 'err');
            else if (q.code === 'too_soon') setMsg(t.tooSoon, 'err');
            else if (q.code === 'unavailable') setMsg(t.unavail, 'err');
            else setMsg(q.error || t.unavail, 'err');
            return;
          }
          state.quote = q;
          renderQuote(q);
        })
        .catch(function (e) { btn.disabled = false; setMsg(String(e.message || e), 'err'); });
    });

    function renderQuote(q) {
      var nightsLabel = q.nights + ' ' + (q.nights > 1 ? t.nights : t.night);
      var avg = Math.round(q.nightly_total_cents / q.nights);
      resEl.innerHTML =
        '<div class="dpb-line"><span class="lbl">' + eur(avg) + ' € <small>' + nightsLabel + ' ' + t.perNight + '</small></span><span class="val">' + eur(q.nightly_total_cents) + ' €</span></div>' +
        (q.cleaning_fee_cents ? '<div class="dpb-line"><span class="lbl">' + esc(t.cleaning) + '</span><span class="val">' + eur(q.cleaning_fee_cents) + ' €</span></div>' : '') +
        (q.tourist_tax_cents ? '<div class="dpb-line"><span class="lbl">' + esc(t.tax) + '</span><span class="val">' + eur(q.tourist_tax_cents) + ' €</span></div>' : '') +
        '<div class="dpb-line dpb-total"><span class="lbl">' + esc(t.total) + '</span><span class="val">' + eur(q.total_cents) + ' €</span></div>' +
        (q.deposit_cents ? '<p class="dpb-deposit">' + esc(t.deposit) + ' ' + eur(q.deposit_cents) + ' €</p>' : '') +
        '<div class="dpb-cta-row"><button class="dpb-btn" data-book>' + esc(t.book) + '</button></div>';
      resEl.hidden = false;
      resEl.querySelector('[data-book]').addEventListener('click', onBook);
    }

    function onBook() {
      if (!PAYMENT_READY) {
        setMsg(t.soon, 'ok');
        if (airbnbUrl) {
          gfEl.innerHTML = '<a class="dpb-btn ghost" href="' + esc(airbnbUrl) + '" target="_blank" rel="noopener" style="text-align:center;text-decoration:none">' + esc(t.airbnb) + '</a>';
          gfEl.classList.remove('hidden');
        }
        return;
      }
      // Etape coordonnees -> paiement (branche au lot Stripe)
      gfEl.innerHTML =
        '<div class="dpb-field"><label>' + esc(t.name) + '</label><input type="text" data-gname autocomplete="name"></div>' +
        '<div class="dpb-field"><label>' + esc(t.email) + '</label><input type="email" data-gemail autocomplete="email"></div>' +
        '<div class="dpb-field"><label>' + esc(t.phone) + '</label><input type="tel" data-gphone autocomplete="tel"></div>' +
        '<button class="dpb-btn gold" data-pay>' + esc(t.confirm) + '</button>';
      gfEl.classList.remove('hidden');
      gfEl.querySelector('[data-pay]').addEventListener('click', startCheckout);
    }

    function startCheckout() {
      var q = state.quote; if (!q) return;
      var body = {
        apt: apt, check_in: q.check_in, check_out: q.check_out, guests: q.guests,
        guest_name: (gfEl.querySelector('[data-gname]') || {}).value,
        guest_email: (gfEl.querySelector('[data-gemail]') || {}).value,
        guest_phone: (gfEl.querySelector('[data-gphone]') || {}).value,
      };
      var btn = gfEl.querySelector('[data-pay]'); btn.disabled = true; btn.innerHTML = '<span class="dpb-spin"></span>' + esc(t.loading);
      // Lot Stripe : POST /api/booking/checkout -> redirection Stripe.
      api('/api/booking/checkout', { method: 'POST', body: body }).then(function (r) {
        if (r.body && r.body.url) { window.location.href = r.body.url; return; }
        btn.disabled = false; btn.textContent = t.confirm;
        setMsg((r.body && r.body.error) || 'Paiement indisponible.', 'err');
      }).catch(function (e) { btn.disabled = false; btn.textContent = t.confirm; setMsg(String(e.message || e), 'err'); });
    }

    // Charge la dispo pour le pre-check client
    api('/api/booking/availability?apt=' + apt).then(function (r) {
      if (r.body && Array.isArray(r.body.unavailable)) state.unavailable = r.body.unavailable;
    }).catch(function () {});
  }

  function boot() {
    var nodes = document.querySelectorAll('[data-booking-widget]');
    for (var i = 0; i < nodes.length; i++) init(nodes[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
