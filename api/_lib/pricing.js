/**
 * Moteur de tarification (pur, testable sans reseau)
 * ===================================================
 * computeQuote() prend une grille de prix + les reglages + d'eventuelles
 * saisons, et renvoie un devis chiffre pour un sejour. AUCUN acces reseau
 * ici : on passe les donnees deja chargees depuis Supabase. Ca rend la
 * logique monetaire testable au centime pres (voir tools/test-pricing.mjs).
 *
 * Tous les montants sont en CENTIMES entiers.
 *
 * Taxe de sejour (Nice, meuble non classe) -- source officielle Metropole
 * Nice Cote d'Azur, tarifs 2026 (deliberation 21.19 du 10/07/2024) :
 *   - taxe metropolitaine        = tax_percent % (5 %)
 *   - taxe additionnelle (LNPCA) = tax_additional_percent % de la metropolitaine (34 %)
 *   - total                      = 5 % x 1,34 = 6,70 % du cout HT/personne/nuit
 *   - PLAFOND                    = tax_cap_cents_per_night sur le TOTAL (6,43 EUR/pers/nuit)
 * => total/pers/nuit = min( prix_pers x 6,70 % , 6,43 EUR ).
 */

const MS_DAY = 86400000;

/** 'YYYY-MM-DD' -> Date UTC a midi (evite les surprises de fuseau/DST). */
export function parseDate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== m - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null; // date impossible (ex: 2026-02-30)
  }
  return dt;
}

/** Date UTC -> 'YYYY-MM-DD'. */
export function fmtDate(dt) {
  return dt.toISOString().slice(0, 10);
}

/** Nombre de nuits entre deux 'YYYY-MM-DD' (depart exclusif). */
export function nightsBetween(checkIn, checkOut) {
  const a = parseDate(checkIn);
  const b = parseDate(checkOut);
  if (!a || !b) return null;
  return Math.round((b - a) / MS_DAY);
}

/** Itere chaque nuit du sejour : [{ date:'YYYY-MM-DD', dow:0..6 }]. */
export function eachNight(checkIn, checkOut) {
  const a = parseDate(checkIn);
  const b = parseDate(checkOut);
  const out = [];
  if (!a || !b) return out;
  for (let t = a.getTime(); t < b.getTime(); t += MS_DAY) {
    const d = new Date(t);
    out.push({ date: fmtDate(d), dow: d.getUTCDay() }); // 0=dim ... 5=ven 6=sam
  }
  return out;
}

/**
 * Prix d'UNE nuit donnee, en appliquant la priorite :
 *   saison appartement > saison globale > week-end > base.
 * @param {{date:string,dow:number}} night
 */
function priceForNight(night, pricing, seasons, aptCode) {
  // Saisons applicables a cette date (apart specifique OU globale)
  let best = null; // { price, specific:boolean }
  for (const s of seasons) {
    if (s.date_start > night.date || s.date_end < night.date) continue;
    const specific = s.apartment_code === aptCode;
    const global = s.apartment_code == null;
    if (!specific && !global) continue;
    if (!best || (specific && !best.specific)) {
      best = { price: s.price_cents, specific };
    }
  }
  if (best) return best.price;

  // Week-end : vendredi (5) et samedi (6)
  if ((night.dow === 5 || night.dow === 6) && pricing.weekend_price_cents) {
    return pricing.weekend_price_cents;
  }
  return pricing.base_price_cents;
}

/**
 * Calcule le devis complet.
 * @returns { ok:true, ... } ou { ok:false, error, code }
 */
export function computeQuote({
  pricing,
  settings,
  seasons = [],
  checkIn,
  checkOut,
  guests = 1,
}) {
  if (!pricing || !settings) {
    return { ok: false, code: 'config', error: 'Tarifs ou reglages manquants.' };
  }
  const nights = nightsBetween(checkIn, checkOut);
  if (nights == null) {
    return { ok: false, code: 'bad_dates', error: 'Dates invalides.' };
  }
  if (nights < 1) {
    return { ok: false, code: 'bad_range', error: 'La date de depart doit suivre la date d arrivee.' };
  }
  const minNights = pricing.min_nights || 1;
  if (nights < minNights) {
    return {
      ok: false,
      code: 'min_nights',
      error: 'Sejour minimum de ' + minNights + ' nuit(s).',
      min_nights: minNights,
      nights,
    };
  }
  const g = Math.max(1, parseInt(guests, 10) || 1);

  // --- Total des nuits (avec detail week-end / saison) ---
  const aptCode = pricing.apartment_code;
  const breakdown = [];
  let nightlyTotal = 0;
  for (const night of eachNight(checkIn, checkOut)) {
    const price = priceForNight(night, pricing, seasons, aptCode);
    nightlyTotal += price;
    breakdown.push({ date: night.date, price_cents: price });
  }

  // --- Frais de menage (forfait) ---
  const cleaning = settings.cleaning_fee_cents || 0;

  // --- Taxe de sejour ---
  const taxPct = Number(settings.tax_percent || 0) / 100;
  const addPct = Number(settings.tax_additional_percent || 0) / 100;
  const cap = settings.tax_cap_cents_per_night || Infinity;
  let touristTax = 0;
  for (const night of breakdown) {
    const perPerson = night.price_cents / g;
    // Taux total (metropolitaine + additionnelle), PUIS plafond sur le total.
    const perPersonTotal = perPerson * taxPct * (1 + addPct);
    touristTax += Math.min(perPersonTotal, cap) * g;
  }
  touristTax = Math.round(touristTax);

  // --- Caution (pre-autorisation separee, non additionnee au total a payer) ---
  const deposit = settings.deposit_cents || 0;

  const total = nightlyTotal + cleaning + touristTax;

  return {
    ok: true,
    apartment_code: aptCode,
    check_in: checkIn,
    check_out: checkOut,
    nights,
    guests: g,
    currency: 'EUR',
    nightly_total_cents: nightlyTotal,
    cleaning_fee_cents: cleaning,
    tourist_tax_cents: touristTax,
    total_cents: total, // montant a encaisser
    deposit_cents: deposit, // caution pre-autorisee a part
    breakdown,
  };
}
