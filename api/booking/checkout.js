/**
 * POST /api/booking/checkout
 * ==========================
 * Cree un VERROU puis une session de paiement Stripe Checkout.
 * Corps JSON : apt, check_in, check_out, guests, guest_name, guest_email,
 * guest_phone, lang ('fr'|'en').
 * Retour : { ok, url } -> le client redirige vers Stripe.
 *
 * Le montant est recalcule cote serveur (jamais le client). Le verrou dure
 * 35 min (le minimum Stripe pour l'expiration d'une session est 30 min).
 * Si le paiement aboutit, le webhook (ou la page succes) confirme la resa.
 */

import { sbSelect, sbInsert, sbUpdate, supabaseConfigured, SupabaseError } from '../_lib/supabase.js';
import { fetchAirbnbBlocked } from '../_lib/ical.js';
import { loadDayPrices } from '../_lib/day-prices.js';
import { computeQuote, parseDate } from '../_lib/pricing.js';
import { createCheckoutSession, stripeConfigured } from '../_lib/stripe.js';

const HOLD_MIN = 35;
const ICAL_URLS = {
  '01': process.env.AIRBNB_ICAL_01, '02': process.env.AIRBNB_ICAL_02,
  '03': process.env.AIRBNB_ICAL_03, '04': process.env.AIRBNB_ICAL_04,
  '05': process.env.AIRBNB_ICAL_05, '06': process.env.AIRBNB_ICAL_06,
  '07': process.env.AIRBNB_ICAL_07, '08': process.env.AIRBNB_ICAL_08,
};

function siteOrigin(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  if (req.headers.origin) return req.headers.origin;
  const host = req.headers.host || 'localhost:3000';
  const proto = /localhost|127\.0\.0\.1/.test(host) ? 'http' : 'https';
  return proto + '://' + host;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'POST requis.' });
  if (!supabaseConfigured()) return res.status(503).json({ ok: false, code: 'config', error: 'Base non configuree.' });
  if (!stripeConfigured()) return res.status(503).json({ ok: false, code: 'config', error: 'Paiement non configure.' });

  const p = req.body || {};
  const apt = String(p.apt || '').padStart(2, '0');
  const checkIn = typeof p.check_in === 'string' ? p.check_in : null;
  const checkOut = typeof p.check_out === 'string' ? p.check_out : null;
  const guests = parseInt(p.guests, 10) || 1;
  const lang = p.lang === 'en' ? 'en' : 'fr';
  if (!/^0[1-8]$/.test(apt)) return res.status(400).json({ ok: false, error: 'apt invalide.' });
  if (!parseDate(checkIn) || !parseDate(checkOut)) return res.status(400).json({ ok: false, error: 'Dates invalides.' });

  try {
    const nowISO = new Date().toISOString();
    await sbUpdate('bookings',
      'apartment_code=eq.' + apt + '&status=eq.hold&hold_expires_at=lt.' + encodeURIComponent(nowISO),
      { status: 'expired', updated_at: nowISO });

    const [pricingRows, settingsRows, seasonRows] = await Promise.all([
      sbSelect('pricing?apartment_code=eq.' + apt + '&select=*'),
      sbSelect('settings?id=eq.1&select=*'),
      sbSelect('pricing_seasons?or=(apartment_code.eq.' + apt + ',apartment_code.is.null)&select=*'),
    ]);
    const pricing = pricingRows[0], settings = settingsRows[0];
    if (!pricing || !settings) return res.status(500).json({ ok: false, error: 'Tarifs/reglages introuvables.' });

    const lead = settings.min_lead_days || 0;
    const t = new Date();
    const minArrival = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate() + lead, 12));
    if (parseDate(checkIn) < minArrival) {
      return res.status(200).json({ ok: false, code: 'too_soon', error: 'Arrivee trop proche.' });
    }
    const airbnb = await fetchAirbnbBlocked(ICAL_URLS[apt]);
    if (airbnb.some((r) => r.start < checkOut && r.end > checkIn)) {
      return res.status(200).json({ ok: false, code: 'unavailable', error: 'Dates prises sur Airbnb.' });
    }

    const quote = computeQuote({ pricing, settings, seasons: seasonRows, dayPrices: await loadDayPrices(apt, checkIn, checkOut), checkIn, checkOut, guests });
    if (!quote.ok) return res.status(200).json(quote);

    // 1) Verrou
    const expiresAt = new Date(Date.now() + HOLD_MIN * 60000).toISOString();
    let hold;
    try {
      const rows = await sbInsert('bookings', {
        apartment_code: apt, check_in: checkIn, check_out: checkOut,
        status: 'hold', source: 'direct',
        guest_name: str(p.guest_name, 200), guest_email: str(p.guest_email, 200), guest_phone: str(p.guest_phone, 50),
        guests_count: quote.guests, nights: quote.nights,
        nightly_total_cents: quote.nightly_total_cents, cleaning_fee_cents: quote.cleaning_fee_cents,
        tourist_tax_cents: quote.tourist_tax_cents, total_cents: quote.total_cents, deposit_cents: quote.deposit_cents,
        hold_expires_at: expiresAt,
      });
      hold = rows[0];
    } catch (e) {
      if (e instanceof SupabaseError && e.isOverlap) return res.status(409).json({ ok: false, code: 'unavailable', error: 'Dates viennent d etre prises.' });
      throw e;
    }

    // 2) Session Stripe
    const origin = siteOrigin(req);
    const okPage = lang === 'en' ? '/en/booking-confirmed.html' : '/reservation-confirmee.html';
    const koPage = lang === 'en' ? '/en/stay-' + apt + '.html' : '/sejour-' + apt + '.html';
    const aptName = 'Delfosse Properties — ' + (lang === 'en' ? 'Apartment ' : 'Appartement ') + apt;
    const lineItems = [
      lineItem(quote.nightly_total_cents, aptName + ' (' + quote.nights + (lang === 'en' ? ' nights' : ' nuits') + ')'),
    ];
    if (quote.cleaning_fee_cents) lineItems.push(lineItem(quote.cleaning_fee_cents, lang === 'en' ? 'Cleaning fee' : 'Frais de menage'));
    if (quote.tourist_tax_cents) lineItems.push(lineItem(quote.tourist_tax_cents, lang === 'en' ? 'Tourist tax' : 'Taxe de sejour'));

    let session;
    try {
      session = await createCheckoutSession({
        mode: 'payment',
        line_items: lineItems,
        success_url: origin + okPage + '?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: origin + koPage,
        customer_email: str(p.guest_email, 200) || undefined,
        locale: lang,
        expires_at: Math.floor(Date.now() / 1000) + HOLD_MIN * 60,
        // Cree un client + enregistre la carte -> permet l'empreinte de
        // caution (pre-autorisation) plus tard depuis l'admin.
        customer_creation: 'always',
        metadata: { booking_id: hold.id, apt: apt, check_in: checkIn, check_out: checkOut, lang: lang },
        payment_intent_data: { metadata: { booking_id: hold.id }, setup_future_usage: 'off_session' },
      });
    } catch (e) {
      // Libere le verrou si Stripe echoue.
      await sbUpdate('bookings', 'id=eq.' + hold.id, { status: 'expired', updated_at: new Date().toISOString() }).catch(function () {});
      return res.status(502).json({ ok: false, error: 'Stripe: ' + e.message });
    }

    return res.status(200).json({ ok: true, url: session.url, booking_id: hold.id });
  } catch (err) {
    const status = err instanceof SupabaseError ? 502 : 500;
    return res.status(status).json({ ok: false, code: 'server', error: err.message });
  }
}

function str(v, n) { return typeof v === 'string' && v ? v.slice(0, n) : null; }
function lineItem(cents, name) {
  return { price_data: { currency: 'eur', unit_amount: cents, product_data: { name: name } }, quantity: 1 };
}
