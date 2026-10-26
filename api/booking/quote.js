/**
 * GET/POST /api/booking/quote
 * ===========================
 * Params (query ou JSON) : apt, check_in, check_out, guests
 * Renvoie un devis chiffre (centimes) SI les dates sont libres et valides,
 * sinon un refus explicite (indispo, delai mini, sejour mini, dates).
 *
 * Lecture seule : ne reserve rien, ne pose aucun verrou. La creation du
 * hold + paiement viendra dans un endpoint dedie (lot 3b/3c).
 */

import { sbSelect, supabaseConfigured, SupabaseError } from '../_lib/supabase.js';
import { fetchAirbnbBlocked } from '../_lib/ical.js';
import { computeQuote, parseDate, nightsBetween } from '../_lib/pricing.js';

const ICAL_URLS = {
  '01': process.env.AIRBNB_ICAL_01,
  '02': process.env.AIRBNB_ICAL_02,
  '03': process.env.AIRBNB_ICAL_03,
  '04': process.env.AIRBNB_ICAL_04,
  '05': process.env.AIRBNB_ICAL_05,
  '06': process.env.AIRBNB_ICAL_06,
  '07': process.env.AIRBNB_ICAL_07,
  '08': process.env.AIRBNB_ICAL_08,
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  const p = req.method === 'POST' ? req.body || {} : req.query || {};
  const apt = String(p.apt || p.id || '').padStart(2, '0');
  const checkIn = typeof p.check_in === 'string' ? p.check_in : null;
  const checkOut = typeof p.check_out === 'string' ? p.check_out : null;
  const guests = parseInt(p.guests, 10) || 1;

  if (!/^0[1-8]$/.test(apt)) {
    return res.status(400).json({ ok: false, code: 'bad_apt', error: 'apt invalide (01-08).' });
  }
  if (!parseDate(checkIn) || !parseDate(checkOut)) {
    return res.status(400).json({ ok: false, code: 'bad_dates', error: 'Dates invalides (format YYYY-MM-DD).' });
  }
  if (!supabaseConfigured()) {
    return res.status(503).json({ ok: false, code: 'config', error: 'Base de donnees non configuree.' });
  }

  try {
    const [pricingRows, settingsRows, seasonRows] = await Promise.all([
      sbSelect('pricing?apartment_code=eq.' + apt + '&select=*'),
      sbSelect('settings?id=eq.1&select=*'),
      sbSelect(
        'pricing_seasons?or=(apartment_code.eq.' +
          apt +
          ',apartment_code.is.null)&select=*'
      ),
    ]);
    const pricing = pricingRows[0];
    const settings = settingsRows[0];
    if (!pricing || !settings) {
      return res.status(500).json({ ok: false, code: 'config', error: 'Tarifs/reglages introuvables pour cet appartement.' });
    }

    // --- Delai mini avant arrivee (resa directe) ---
    const lead = settings.min_lead_days || 0;
    const today = new Date();
    const minArrival = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + lead, 12)
    );
    if (parseDate(checkIn) < minArrival) {
      return res.status(200).json({
        ok: false,
        code: 'too_soon',
        error: 'Arrivee trop proche : reservez au moins ' + lead + ' jour(s) a l avance.',
        min_lead_days: lead,
      });
    }

    // --- Disponibilite (Supabase + Airbnb) ---
    const dbRows = await sbSelect(
      'bookings?apartment_code=eq.' +
        apt +
        '&status=in.(hold,confirmed)&select=check_in,check_out&check_in=lt.' +
        encodeURIComponent(checkOut) +
        '&check_out=gt.' +
        encodeURIComponent(checkIn)
    );
    let taken = dbRows.length > 0;
    let airbnbClash = false;
    if (!taken) {
      const airbnb = await fetchAirbnbBlocked(ICAL_URLS[apt]);
      airbnbClash = airbnb.some((r) => r.start < checkOut && r.end > checkIn);
      taken = airbnbClash;
    }
    if (taken) {
      return res.status(200).json({
        ok: false,
        code: 'unavailable',
        error: 'Ces dates ne sont plus disponibles.',
        nights: nightsBetween(checkIn, checkOut),
      });
    }

    // --- Devis ---
    const quote = computeQuote({
      pricing,
      settings,
      seasons: seasonRows,
      checkIn,
      checkOut,
      guests,
    });
    const code = quote.ok ? 200 : 200; // refus "metier" = 200 avec ok:false
    return res.status(code).json(quote);
  } catch (err) {
    const status = err instanceof SupabaseError ? 502 : 500;
    return res.status(status).json({ ok: false, code: 'server', error: err.message });
  }
}
