/**
 * POST /api/booking/hold
 * ======================
 * Pose un VERROU temporaire sur des dates pendant que le voyageur paie.
 * Corps JSON : apt, check_in, check_out, guests, [guest_name, guest_email,
 * guest_phone].
 *
 * Anti-double-reservation : on s'appuie sur la contrainte d'exclusion
 * Postgres (bookings_no_overlap). Deux verrous qui se chevauchent sont
 * physiquement impossibles -> le 2e INSERT echoue en 409, meme en cas de
 * clic simultane. Le montant est TOUJOURS recalcule cote serveur (jamais
 * fait confiance au client).
 *
 * Les verrous perimes (hold_expires_at depasse) sont passes en 'expired'
 * juste avant, pour liberer le creneau aupres de la contrainte.
 */

import {
  sbSelect,
  sbInsert,
  sbUpdate,
  supabaseConfigured,
  SupabaseError,
} from '../_lib/supabase.js';
import { fetchAirbnbBlocked } from '../_lib/ical.js';
import { loadDayPrices } from '../_lib/day-prices.js';
import { computeQuote, parseDate, nightsBetween } from '../_lib/pricing.js';
import { validateGuest } from '../_lib/guest.js';

const ICAL_URLS = {
  '01': process.env.AIRBNB_ICAL_01, '02': process.env.AIRBNB_ICAL_02,
  '03': process.env.AIRBNB_ICAL_03, '04': process.env.AIRBNB_ICAL_04,
  '05': process.env.AIRBNB_ICAL_05, '06': process.env.AIRBNB_ICAL_06,
  '07': process.env.AIRBNB_ICAL_07, '08': process.env.AIRBNB_ICAL_08,
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'POST requis.' });
  }
  if (!supabaseConfigured()) {
    return res.status(503).json({ ok: false, code: 'config', error: 'Base non configuree.' });
  }

  const p = req.body || {};
  const apt = String(p.apt || '').padStart(2, '0');
  const checkIn = typeof p.check_in === 'string' ? p.check_in : null;
  const checkOut = typeof p.check_out === 'string' ? p.check_out : null;
  const guests = parseInt(p.guests, 10) || 1;

  if (!/^0[1-8]$/.test(apt)) {
    return res.status(400).json({ ok: false, code: 'bad_apt', error: 'apt invalide.' });
  }
  if (!parseDate(checkIn) || !parseDate(checkOut)) {
    return res.status(400).json({ ok: false, code: 'bad_dates', error: 'Dates invalides.' });
  }
  const check = validateGuest(p);
  if (!check.ok) {
    return res.status(400).json({ ok: false, code: 'guest_invalid', fields: check.fields, error: 'Coordonnees incompletes.' });
  }

  try {
    const nowISO = new Date().toISOString();

    // 1) Libere les verrous perimes de cet appart.
    await sbUpdate(
      'bookings',
      'apartment_code=eq.' + apt + '&status=eq.hold&hold_expires_at=lt.' + encodeURIComponent(nowISO),
      { status: 'expired', updated_at: nowISO }
    );

    // 2) Charge tarifs/reglages/saisons.
    const [pricingRows, settingsRows, seasonRows] = await Promise.all([
      sbSelect('pricing?apartment_code=eq.' + apt + '&select=*'),
      sbSelect('settings?id=eq.1&select=*'),
      sbSelect('pricing_seasons?or=(apartment_code.eq.' + apt + ',apartment_code.is.null)&select=*'),
    ]);
    const pricing = pricingRows[0];
    const settings = settingsRows[0];
    if (!pricing || !settings) {
      return res.status(500).json({ ok: false, code: 'config', error: 'Tarifs/reglages introuvables.' });
    }

    // 3) Delai mini avant arrivee.
    const lead = settings.min_lead_days || 0;
    const t = new Date();
    const minArrival = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate() + lead, 12));
    if (parseDate(checkIn) < minArrival) {
      return res.status(200).json({ ok: false, code: 'too_soon', error: 'Arrivee trop proche (' + lead + 'j mini).' });
    }

    // 4) Clash Airbnb (le clash Supabase est gere par la contrainte a l'INSERT).
    const airbnb = await fetchAirbnbBlocked(ICAL_URLS[apt]);
    if (airbnb.some((r) => r.start < checkOut && r.end > checkIn)) {
      return res.status(200).json({ ok: false, code: 'unavailable', error: 'Dates prises sur Airbnb.' });
    }

    // 5) Devis serveur (source de verite des montants).
    const quote = computeQuote({ pricing, settings, seasons: seasonRows, dayPrices: await loadDayPrices(apt, checkIn, checkOut), checkIn, checkOut, guests });
    if (!quote.ok) {
      return res.status(200).json(quote);
    }

    // 6) INSERT du verrou. La contrainte d'exclusion fait l'arbitrage.
    const expiresAt = new Date(Date.now() + (settings.hold_minutes || 15) * 60000).toISOString();
    let rows;
    try {
      rows = await sbInsert('bookings', {
        apartment_code: apt,
        check_in: checkIn,
        check_out: checkOut,
        status: 'hold',
        source: 'direct',
        guest_name: check.guest.name,
        guest_email: check.guest.email,
        guest_phone: check.guest.phone,
        guests_count: quote.guests,
        nights: quote.nights,
        nightly_total_cents: quote.nightly_total_cents,
        cleaning_fee_cents: quote.cleaning_fee_cents,
        tourist_tax_cents: quote.tourist_tax_cents,
        total_cents: quote.total_cents,
        deposit_cents: quote.deposit_cents,
        hold_expires_at: expiresAt,
      });
    } catch (e) {
      if (e instanceof SupabaseError && e.isOverlap) {
        return res.status(409).json({ ok: false, code: 'unavailable', error: 'Ces dates viennent d etre prises.' });
      }
      throw e;
    }

    const hold = rows[0];
    return res.status(201).json({
      ok: true,
      hold_id: hold.id,
      expires_at: expiresAt,
      hold_minutes: settings.hold_minutes || 15,
      quote,
    });
  } catch (err) {
    const status = err instanceof SupabaseError ? 502 : 500;
    return res.status(status).json({ ok: false, code: 'server', error: err.message });
  }
}
