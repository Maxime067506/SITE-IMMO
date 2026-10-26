/**
 * GET /api/booking/availability?apt=01[&from=YYYY-MM-DD&to=YYYY-MM-DD]
 * ====================================================================
 * Renvoie les plages INDISPONIBLES d'un appartement, en fusionnant :
 *   - les reservations Supabase actives (status hold | confirmed)
 *   - le calendrier Airbnb (iCal, lecture seule) si configure
 *
 * Chaque plage : { start:'YYYY-MM-DD', end:'YYYY-MM-DD', source }.
 * "end" est EXCLUSIF (jour de depart libre), comme pour check_out.
 *
 * Lecture publique (le widget de resa l'appelle cote client) -> on
 * n'expose QUE des dates, jamais de donnee client.
 */

import { sbSelect, supabaseConfigured, SupabaseError } from '../_lib/supabase.js';
import { fetchAirbnbBlocked } from '../_lib/ical.js';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const apt = String(req.query.apt || req.query.id || '').padStart(2, '0');
  if (!/^0[1-8]$/.test(apt)) {
    return res.status(400).json({ error: 'apt invalide (01-08).', apt });
  }
  if (!supabaseConfigured()) {
    return res.status(503).json({ error: 'Base de donnees non configuree.' });
  }

  const from = typeof req.query.from === 'string' ? req.query.from : null;
  const to = typeof req.query.to === 'string' ? req.query.to : null;

  try {
    // Reservations directes / manuelles encore actives.
    let q =
      'bookings?apartment_code=eq.' +
      apt +
      '&status=in.(hold,confirmed)&select=check_in,check_out,status,source';
    if (to) q += '&check_in=lt.' + encodeURIComponent(to);
    if (from) q += '&check_out=gt.' + encodeURIComponent(from);
    const rows = await sbSelect(q);

    const dbRanges = rows.map((r) => ({
      start: r.check_in,
      end: r.check_out,
      source: r.source === 'airbnb_ical' ? 'airbnb_ical' : 'direct',
    }));

    // Calendrier Airbnb (si une URL iCal est branchee pour cet appart).
    const airbnbRanges = await fetchAirbnbBlocked(ICAL_URLS[apt]);

    const unavailable = mergeRanges(dbRanges.concat(airbnbRanges));

    res.setHeader(
      'Cache-Control',
      'public, max-age=0, s-maxage=300, stale-while-revalidate=3600'
    );
    return res.status(200).json({
      apt,
      unavailable,
      count: unavailable.length,
      fetched: new Date().toISOString(),
    });
  } catch (err) {
    const status = err instanceof SupabaseError ? 502 : 500;
    return res.status(status).json({ error: err.message, apt });
  }
}

/**
 * Fusionne/trie les plages qui se chevauchent ou se touchent, pour un
 * affichage calendrier propre. Conserve "mixed" si des sources differentes
 * se recouvrent.
 */
function mergeRanges(ranges) {
  const valid = ranges
    .filter((r) => r.start && r.end && r.start < r.end)
    .sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));
  const out = [];
  for (const r of valid) {
    const last = out[out.length - 1];
    if (last && r.start <= last.end) {
      if (r.end > last.end) last.end = r.end;
      if (last.source !== r.source) last.source = 'mixed';
    } else {
      out.push({ start: r.start, end: r.end, source: r.source });
    }
  }
  return out;
}
