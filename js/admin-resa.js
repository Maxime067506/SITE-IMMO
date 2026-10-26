/* =====================================================================
   admin-resa.js — Tableau de bord Reservations (Delfosse Properties)
   ---------------------------------------------------------------------
   Parle aux endpoints proteges /api/admin/* avec le mot de passe admin
   (header Authorization: Bearer <pass>). Le mot de passe vit uniquement
   en sessionStorage (efface a la fermeture de l'onglet) et n'est jamais
   ecrit en dur. Montants saisis en euros, convertis en centimes a l'envoi.
   ===================================================================== */
(function () {
  'use strict';

  var KEY = 'dp_admin_pass';
  var state = { data: null };

  var gate = document.getElementById('gate');
  var shell = document.getElementById('shell');

  // ---- utils ----
  function pass() { try { return sessionStorage.getItem(KEY) || ''; } catch (e) { return ''; } }
  function setPass(p) { try { sessionStorage.setItem(KEY, p); } catch (e) {} }
  function clearPass() { try { sessionStorage.removeItem(KEY); } catch (e) {} }
  function eur(c) { return (Number(c || 0) / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function toCents(v) { var n = parseFloat(String(v).replace(',', '.')); return Number.isFinite(n) ? Math.round(n * 100) : null; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function fmtDate(s) { if (!s) return '—'; var p = String(s).slice(0, 10).split('-'); return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : s; }
  function aptName(code) {
    var a = (state.data && state.data.apartments || []).find(function (x) { return x.code === code; });
    return a ? a.name : 'Appartement ' + code;
  }
  function msg(el, text, kind) {
    var m = document.getElementById(el);
    if (!m) return;
    m.textContent = text || '';
    m.className = 'rz-msg' + (kind ? ' ' + kind : '');
    if (text && kind === 'ok') setTimeout(function () { if (m.textContent === text) { m.textContent = ''; m.className = 'rz-msg'; } }, 4000);
  }

  // ---- fetch wrapper ----
  function api(path, opts) {
    opts = opts || {};
    var headers = { Authorization: 'Bearer ' + pass() };
    if (opts.body) headers['Content-Type'] = 'application/json';
    return fetch(path, {
      method: opts.method || 'GET',
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    }).then(function (r) {
      return r.json().then(function (j) { return { status: r.status, body: j }; },
        function () { return { status: r.status, body: {} }; });
    });
  }

  // ===================================================================
  //  PORTE
  // ===================================================================
  document.getElementById('gateForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var p = document.getElementById('gatePass').value;
    if (!p) return;
    setPass(p);
    msg('gateMsg', 'Connexion…', '');
    load().then(function (ok) {
      if (!ok) { clearPass(); msg('gateMsg', 'Mot de passe incorrect.', 'err'); }
    });
  });

  document.getElementById('btnLogout').addEventListener('click', function () {
    clearPass(); location.reload();
  });
  document.getElementById('btnReload').addEventListener('click', function () { load(); });

  // ===================================================================
  //  CHARGEMENT
  // ===================================================================
  function load() {
    return api('/api/admin/?resource=data').then(function (r) {
      if (r.status === 401) return false;
      if (r.status !== 200 || !r.body.ok) { msg('gateMsg', 'Erreur: ' + (r.body.error || r.status), 'err'); return true; }
      state.data = r.body;
      gate.classList.add('hidden');
      shell.classList.remove('hidden');
      renderAll();
      return true;
    }).catch(function (err) { msg('gateMsg', 'Erreur réseau: ' + err.message, 'err'); return true; });
  }

  function renderAll() {
    fillAptSelects();
    renderPricing();
    renderSettings();
    renderBookings();
    renderSeasons();
  }

  function fillAptSelects() {
    var apts = state.data.apartments || [];
    ['blkApt', 'seaApt'].forEach(function (id) {
      var sel = document.getElementById(id);
      var extra = id === 'seaApt' ? '<option value="">Tous les appartements</option>' : '';
      sel.innerHTML = extra + apts.map(function (a) {
        return '<option value="' + a.code + '">' + a.code + ' — ' + esc(a.name) + '</option>';
      }).join('');
    });
  }

  // ---- TARIFS ----
  function renderPricing() {
    var tb = document.querySelector('#pricingTbl tbody');
    var rows = (state.data.pricing || []).slice().sort(function (a, b) { return a.apartment_code < b.apartment_code ? -1 : 1; });
    tb.innerHTML = rows.map(function (p) {
      var code = p.apartment_code;
      return '<tr data-apt="' + code + '">' +
        '<td data-l="Appartement"><span class="rz-apt">' + esc(aptName(code)) + '<small>N° ' + code + '</small></span></td>' +
        '<td data-l="Base / nuit"><input class="rz-in w-eur" type="number" min="10" step="1" data-f="base" value="' + (p.base_price_cents / 100) + '"> €</td>' +
        '<td data-l="Week-end / nuit"><input class="rz-in w-eur" type="number" min="10" step="1" data-f="weekend" placeholder="= base" value="' + (p.weekend_price_cents != null ? p.weekend_price_cents / 100 : '') + '"> €</td>' +
        '<td data-l="Nuits min."><input class="rz-in w-n" type="number" min="1" max="90" step="1" data-f="min" value="' + (p.min_nights || 1) + '"></td>' +
        '<td data-l=""><button class="rz-btn gold sm" data-save="' + code + '">Enregistrer</button></td>' +
        '</tr>';
    }).join('');
    tb.querySelectorAll('[data-save]').forEach(function (btn) {
      btn.addEventListener('click', function () { savePricing(btn.getAttribute('data-save'), btn); });
    });
  }

  function savePricing(code, btn) {
    var tr = document.querySelector('#pricingTbl tr[data-apt="' + code + '"]');
    var base = toCents(tr.querySelector('[data-f="base"]').value);
    var wkRaw = tr.querySelector('[data-f="weekend"]').value;
    var min = parseInt(tr.querySelector('[data-f="min"]').value, 10);
    if (base == null || base < 1000) { msg('pricingMsg', 'Prix de base invalide (≥ 10 €).', 'err'); return; }
    var body = { apartment_code: code, base_price_cents: base, min_nights: min,
      weekend_price_cents: wkRaw === '' ? null : toCents(wkRaw) };
    btn.disabled = true;
    api('/api/admin/?resource=pricing', { method: 'POST', body: body }).then(function (r) {
      btn.disabled = false;
      if (r.status === 200 && r.body.ok) { msg('pricingMsg', '✓ ' + aptName(code) + ' enregistré.', 'ok'); }
      else msg('pricingMsg', 'Erreur: ' + (r.body.error || r.status), 'err');
    });
  }

  // ---- RÉGLAGES ----
  var SETTINGS_FIELDS = [
    { k: 'cleaning_fee_cents', label: 'Frais de ménage (€)', euro: true },
    { k: 'deposit_cents', label: 'Caution — pré-autorisation (€)', euro: true },
    { k: 'tax_percent', label: 'Taxe de séjour (%)', step: '0.1' },
    { k: 'tax_additional_percent', label: 'Taxe additionnelle (%)', step: '0.1' },
    { k: 'tax_cap_cents_per_night', label: 'Plafond taxe /pers/nuit (€)', euro: true },
    { k: 'min_lead_days', label: 'Délai mini avant arrivée (jours)' },
    { k: 'hold_minutes', label: 'Durée du verrou paiement (min)' },
  ];
  function renderSettings() {
    var s = state.data.settings || {};
    var html = SETTINGS_FIELDS.map(function (f) {
      var val = f.euro ? (s[f.k] != null ? s[f.k] / 100 : '') : (s[f.k] != null ? s[f.k] : '');
      return '<div class="rz-field"><label>' + f.label + '</label>' +
        '<input class="rz-in" type="number" step="' + (f.step || '1') + '" data-sk="' + f.k + '" data-euro="' + (f.euro ? 1 : 0) + '" value="' + val + '"></div>';
    }).join('');
    html += '<div class="rz-field" style="grid-column:1/-1"><label>Politique d\'annulation</label>' +
      '<textarea class="rz-in" rows="2" data-sk="cancellation_policy" style="font-family:var(--f-sans)">' + esc(s.cancellation_policy || '') + '</textarea>' +
      '<div class="hint">La caution est une pré-autorisation (empreinte bancaire), elle n\'est pas encaissée sauf dégât. Taxe de séjour à reconfirmer chaque année auprès de la Métropole.</div></div>';
    document.getElementById('settingsGrid').innerHTML = html;
  }
  document.getElementById('btnSaveSettings').addEventListener('click', function () {
    var body = {};
    document.querySelectorAll('#settingsGrid [data-sk]').forEach(function (el) {
      var k = el.getAttribute('data-sk');
      if (k === 'cancellation_policy') { body[k] = el.value; return; }
      var raw = el.value;
      if (raw === '') return;
      body[k] = el.getAttribute('data-euro') === '1' ? toCents(raw) : Number(raw);
    });
    var btn = this; btn.disabled = true;
    api('/api/admin/?resource=settings', { method: 'POST', body: body }).then(function (r) {
      btn.disabled = false;
      if (r.status === 200 && r.body.ok) { state.data.settings = r.body.settings; msg('settingsMsg', '✓ Réglages enregistrés.', 'ok'); }
      else msg('settingsMsg', 'Erreur: ' + (r.body.error || r.status), 'err');
    });
  });

  // ---- RÉSERVATIONS ----
  function actionsCell(b) {
    var html = '<button class="rz-btn danger sm" data-cancel="' + esc(b.id) + '">Annuler</button>';
    if (b.status === 'confirmed' && b.source === 'direct' && b.deposit_cents > 0) {
      var ds = b.deposit_status;
      html += '<div style="margin-top:9px;display:flex;flex-wrap:wrap;gap:6px;align-items:center">';
      if (ds === 'authorized') {
        html += '<span class="pill hold">Caution bloquée</span>' +
          '<button class="rz-btn ghost sm" data-dep="release" data-id="' + esc(b.id) + '">Libérer</button>' +
          '<button class="rz-btn danger sm" data-dep="capture" data-id="' + esc(b.id) + '">Débiter</button>';
      } else if (ds === 'released') {
        html += '<span class="pill manual">Caution libérée</span>';
      } else if (ds === 'captured') {
        html += '<span class="pill confirmed">Caution débitée</span>';
      } else {
        html += '<button class="rz-btn sm" data-dep="preauth" data-id="' + esc(b.id) + '">Pré-autoriser caution ' + eur(b.deposit_cents) + ' €</button>';
      }
      html += '</div>';
    }
    return html;
  }

  function wireDeposit(tb) {
    tb.querySelectorAll('[data-dep]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var act = btn.getAttribute('data-dep'), id = btn.getAttribute('data-id');
        var body = { action: act, booking_id: id };
        if (act === 'release' && !confirm('Libérer l\'empreinte de caution ?')) return;
        if (act === 'capture') { if (!confirm('Débiter la caution (dégât constaté) ?')) return; }
        if (act === 'preauth') { if (!confirm('Pré-autoriser la caution sur la carte du voyageur ?')) return; }
        btn.disabled = true; msg('bookingsMsg', 'Traitement…', '');
        api('/api/admin/?resource=deposit', { method: 'POST', body: body }).then(function (r) {
          if (r.status === 200 && r.body.ok) {
            msg('bookingsMsg', '✓ Caution : ' + r.body.status + '.', 'ok'); load();
          } else { btn.disabled = false; msg('bookingsMsg', r.body.error || ('Erreur ' + r.status), 'err'); }
        });
      });
    });
  }

  function renderBookings() {
    var tb = document.querySelector('#bookingsTbl tbody');
    var rows = state.data.bookings || [];
    if (!rows.length) { tb.innerHTML = '<tr><td data-l="" colspan="6" style="color:rgba(245,237,224,.4)">Aucune réservation à venir.</td></tr>'; return; }
    tb.innerHTML = rows.map(function (b) {
      var who = b.notes === 'block' ? '<em style="color:rgba(245,237,224,.5)">' + esc(b.guest_name || 'Blocage') + '</em>'
        : (esc(b.guest_name || '—') + (b.guest_email ? '<br><small style="color:rgba(245,237,224,.45)">' + esc(b.guest_email) + '</small>' : ''));
      return '<tr>' +
        '<td data-l="Appart."><span class="rz-apt" style="font-size:15px">N° ' + esc(b.apartment_code) + '</span></td>' +
        '<td data-l="Séjour">' + fmtDate(b.check_in) + ' <span style="color:#D4B77E">→</span> ' + fmtDate(b.check_out) + '</td>' +
        '<td data-l="Statut"><span class="pill ' + esc(b.status) + '">' + esc(b.status) + '</span> <span class="pill ' + esc(b.source) + '">' + esc(b.source) + '</span></td>' +
        '<td data-l="Voyageur">' + who + '</td>' +
        '<td data-l="Total">' + (b.total_cents != null ? eur(b.total_cents) + ' €' : '—') + '</td>' +
        '<td data-l="">' + actionsCell(b) + '</td>' +
        '</tr>';
    }).join('');
    wireDeposit(tb);
    tb.querySelectorAll('[data-cancel]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!confirm('Annuler cette réservation / ce blocage ? Les dates seront libérées.')) return;
        btn.disabled = true;
        api('/api/admin/?resource=bookings', { method: 'POST', body: { action: 'cancel', id: btn.getAttribute('data-cancel') } }).then(function (r) {
          if (r.status === 200 && r.body.ok) { msg('bookingsMsg', '✓ Annulé.', 'ok'); load(); }
          else { btn.disabled = false; msg('bookingsMsg', 'Erreur: ' + (r.body.error || r.status), 'err'); }
        });
      });
    });
  }
  document.getElementById('btnBlock').addEventListener('click', function () {
    var body = { action: 'block', apt: document.getElementById('blkApt').value,
      check_in: document.getElementById('blkIn').value, check_out: document.getElementById('blkOut').value,
      notes: document.getElementById('blkNote').value };
    if (!body.check_in || !body.check_out) { msg('bookingsMsg', 'Renseignez les dates.', 'err'); return; }
    var btn = this; btn.disabled = true;
    api('/api/admin/?resource=bookings', { method: 'POST', body: body }).then(function (r) {
      btn.disabled = false;
      if (r.status === 201 && r.body.ok) { msg('bookingsMsg', '✓ Dates bloquées.', 'ok'); document.getElementById('blkNote').value = ''; load(); }
      else msg('bookingsMsg', 'Erreur: ' + (r.body.error || r.status), 'err');
    });
  });

  // ---- SAISONS ----
  function renderSeasons() {
    var tb = document.querySelector('#seasonsTbl tbody');
    var rows = state.data.seasons || [];
    if (!rows.length) { tb.innerHTML = '<tr><td data-l="" colspan="5" style="color:rgba(245,237,224,.4)">Aucune saison définie.</td></tr>'; return; }
    tb.innerHTML = rows.map(function (s) {
      return '<tr>' +
        '<td data-l="Appart.">' + (s.apartment_code ? 'N° ' + esc(s.apartment_code) : '<em style="color:rgba(245,237,224,.5)">Tous</em>') + '</td>' +
        '<td data-l="Période">' + fmtDate(s.date_start) + ' <span style="color:#D4B77E">→</span> ' + fmtDate(s.date_end) + '</td>' +
        '<td data-l="Prix / nuit">' + eur(s.price_cents) + ' €</td>' +
        '<td data-l="Libellé">' + esc(s.label || '—') + '</td>' +
        '<td data-l=""><button class="rz-btn danger sm" data-dels="' + esc(s.id) + '">Suppr.</button></td>' +
        '</tr>';
    }).join('');
    tb.querySelectorAll('[data-dels]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!confirm('Supprimer cette saison ?')) return;
        btn.disabled = true;
        api('/api/admin/?resource=seasons', { method: 'POST', body: { action: 'delete', id: btn.getAttribute('data-dels') } }).then(function (r) {
          if (r.status === 200 && r.body.ok) { msg('seasonsMsg', '✓ Supprimée.', 'ok'); load(); }
          else { btn.disabled = false; msg('seasonsMsg', 'Erreur: ' + (r.body.error || r.status), 'err'); }
        });
      });
    });
  }
  document.getElementById('btnSeason').addEventListener('click', function () {
    var body = { action: 'create', apartment_code: document.getElementById('seaApt').value || null,
      date_start: document.getElementById('seaIn').value, date_end: document.getElementById('seaOut').value,
      price_cents: toCents(document.getElementById('seaPrice').value), label: document.getElementById('seaLabel').value };
    if (!body.date_start || !body.date_end) { msg('seasonsMsg', 'Renseignez les dates.', 'err'); return; }
    if (body.price_cents == null || body.price_cents < 1000) { msg('seasonsMsg', 'Prix invalide (≥ 10 €).', 'err'); return; }
    var btn = this; btn.disabled = true;
    api('/api/admin/?resource=seasons', { method: 'POST', body: body }).then(function (r) {
      btn.disabled = false;
      if (r.status === 201 && r.body.ok) { msg('seasonsMsg', '✓ Saison ajoutée.', 'ok'); document.getElementById('seaLabel').value = ''; document.getElementById('seaPrice').value = ''; load(); }
      else msg('seasonsMsg', 'Erreur: ' + (r.body.error || r.status), 'err');
    });
  });

  // ---- démarrage : si mot de passe déjà en session, on tente direct ----
  if (pass()) { load().then(function (ok) { if (!ok) { clearPass(); } }); }
})();
