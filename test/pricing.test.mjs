/**
 * Tests du moteur de tarification (node --test).
 * Couvre : nuits, week-end, saisons, taxe de sejour plafonnee, sejour mini.
 * Lance : npm test   (ou: node --test test/)
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeQuote,
  nightsBetween,
  eachNight,
  parseDate,
  nightlyPrices,
  dayPriceMap,
} from '../api/_lib/pricing.js';

// Reglages de reference (= seeds du schema)
const settings = {
  cleaning_fee_cents: 6500,
  deposit_cents: 30000,
  tax_percent: 5.0,
  tax_additional_percent: 34.0,
  tax_cap_cents_per_night: 643,
  min_lead_days: 2,
  hold_minutes: 15,
};

const pricing01 = {
  apartment_code: '01',
  base_price_cents: 8000,
  weekend_price_cents: null,
  min_nights: 1,
};

test('parseDate rejette une date impossible', () => {
  assert.equal(parseDate('2026-02-30'), null);
  assert.equal(parseDate('2026-13-01'), null);
  assert.ok(parseDate('2026-06-15'));
});

test('nightsBetween compte le depart comme exclusif', () => {
  assert.equal(nightsBetween('2026-06-15', '2026-06-18'), 3);
  assert.equal(nightsBetween('2026-06-15', '2026-06-15'), 0);
});

test('eachNight renvoie les jours de la semaine', () => {
  const nights = eachNight('2026-06-15', '2026-06-18'); // lun->jeu : 3 nuits
  assert.equal(nights.length, 3);
  assert.deepEqual(nights.map((n) => n.date), [
    '2026-06-15',
    '2026-06-16',
    '2026-06-17',
  ]);
});

test('devis simple 3 nuits a 80e', () => {
  const q = computeQuote({
    pricing: pricing01,
    settings,
    checkIn: '2026-06-15',
    checkOut: '2026-06-18',
    guests: 2,
  });
  assert.equal(q.ok, true);
  assert.equal(q.nights, 3);
  assert.equal(q.nightly_total_cents, 24000); // 3 x 8000
  assert.equal(q.cleaning_fee_cents, 6500);
  // Taxe : 80e/pers ratio 2 pers -> 40e/pers/nuit. 5% = 2e, sous le plafond 6,43e.
  // x1.34 = 2,68e /pers/nuit. x2 pers x3 nuits = 16,08e = 1608 c.
  assert.equal(q.tourist_tax_cents, 1608);
  assert.equal(q.total_cents, 24000 + 6500 + 1608);
  assert.equal(q.deposit_cents, 30000); // caution a part, hors total
});

test('taxe de sejour plafonnee sur un prix eleve', () => {
  // 1 personne, nuit a 300e : 6,70% = 20,10e > plafond 6,43e -> plafond total applique.
  const q = computeQuote({
    pricing: { ...pricing01, base_price_cents: 30000 },
    settings,
    checkIn: '2026-06-15',
    checkOut: '2026-06-16',
    guests: 1,
  });
  // min(300 x 0,067 ; 6,43) = 6,43e = 643 c
  assert.equal(q.tourist_tax_cents, 643);
});

test('taxe de sejour juste sous le plafond', () => {
  // 1 personne, nuit a 90e : 90 x 6,70% = 6,03e < 6,43e -> pas de plafond.
  const q = computeQuote({
    pricing: { ...pricing01, base_price_cents: 9000 },
    settings, checkIn: '2026-06-15', checkOut: '2026-06-16', guests: 1,
  });
  assert.equal(q.tourist_tax_cents, 603);
});

test('tarif week-end applique vendredi et samedi', () => {
  const q = computeQuote({
    pricing: { ...pricing01, weekend_price_cents: 12000 },
    settings,
    checkIn: '2026-06-19', // vendredi
    checkOut: '2026-06-21', // -> nuits ven + sam
    guests: 2,
  });
  assert.equal(q.nights, 2);
  assert.equal(q.nightly_total_cents, 24000); // 2 x 12000 (week-end)
});

test('saison appartement prioritaire sur le prix de base', () => {
  const q = computeQuote({
    pricing: pricing01,
    settings,
    seasons: [
      { apartment_code: null, date_start: '2026-07-01', date_end: '2026-08-31', price_cents: 15000 },
      { apartment_code: '01', date_start: '2026-07-10', date_end: '2026-07-20', price_cents: 20000 },
    ],
    checkIn: '2026-07-14',
    checkOut: '2026-07-16', // 2 nuits dans la saison appart-specifique
    guests: 2,
  });
  assert.equal(q.nightly_total_cents, 40000); // 2 x 20000 (saison appart)
});

test('refus si sous le sejour minimum', () => {
  const q = computeQuote({
    pricing: { ...pricing01, min_nights: 3 },
    settings,
    checkIn: '2026-06-15',
    checkOut: '2026-06-17', // 2 nuits < 3
    guests: 2,
  });
  assert.equal(q.ok, false);
  assert.equal(q.code, 'min_nights');
});

test('prix au jour prioritaire sur saison, week-end et base', () => {
  const q = computeQuote({
    pricing: { ...pricing01, weekend_price_cents: 12000 },
    settings,
    seasons: [
      { apartment_code: '01', date_start: '2026-07-01', date_end: '2026-07-31', price_cents: 20000 },
    ],
    dayPrices: { '2026-07-10': 25000, '2026-07-12': 9000 },
    checkIn: '2026-07-10', // ven, sam, dim
    checkOut: '2026-07-13',
    guests: 2,
  });
  assert.deepEqual(q.breakdown.map((n) => n.price_cents), [25000, 20000, 9000]);
  assert.equal(q.nightly_total_cents, 54000);
});

test('nightlyPrices renvoie le prix de chaque nuit de la plage', () => {
  const prices = nightlyPrices({
    pricing: { ...pricing01, weekend_price_cents: 12000 },
    dayPrices: { '2026-06-15': 7000 },
    from: '2026-06-15', // lun
    to: '2026-06-21',
  });
  assert.deepEqual(prices, {
    '2026-06-15': 7000,
    '2026-06-16': 8000,
    '2026-06-17': 8000,
    '2026-06-18': 8000,
    '2026-06-19': 12000,
    '2026-06-20': 12000,
  });
});

test('dayPriceMap ignore les lignes invalides', () => {
  assert.deepEqual(
    dayPriceMap([{ date: '2026-06-15', price_cents: 9000 }, { date: null, price_cents: 1 }, null]),
    { '2026-06-15': 9000 }
  );
});
