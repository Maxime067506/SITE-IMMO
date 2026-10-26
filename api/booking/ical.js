/**
 * GET /api/booking/ical?apt=NN
 * ============================
 * Exporte les reservations DIRECTES d'un appartement au format iCal, pour
 * que tu l'ajoutes dans Airbnb (Calendrier > Importer un calendrier). Ainsi
 * une resa faite sur le site bloque aussi les dates sur Airbnb -> plus de
 * double-reservation entre les deux canaux.
 *
 * Ne publie QUE des dates bloquees (aucune donnee voyageur). Les verrous
 * perimes sont ignores.
 */

import { sbSelect, supabaseConfigured } from '../_lib/supabase.js';

function icalDate(d) {
  return String(d).slice(0, 10).replace(/-/g, '');
}
function fold(line) {
  // Repli RFC 5545 a 75 octets (simple, suffisant ici).
  return line.length <= 73 ? line : line.replace(/(.{73})/g, '$1\r\n ');
}

export default async function handler(req, res) {
  const apt = String((req.query && (req.query.apt || req.query.id)) || '').padStart(2, '0');
  if (!/^0[1-8]$/.test(apt)) {
    res.status(400);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('apt invalide (01-08).');
  }
  if (!supabaseConfigured()) {
    res.status(503);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('Base non configuree.');
  }

  const nowISO = new Date().toISOString();
  // confirmees, OU verrous encore valides (non perimes), source directe/manuelle.
  const q =
    'bookings?apartment_code=eq.' + apt +
    '&source=in.(direct,manual)' +
    '&or=(status.eq.confirmed,and(status.eq.hold,hold_expires_at.gt.' + encodeURIComponent(nowISO) + '))' +
    '&select=id,check_in,check_out,status,updated_at,created_at&order=check_in';

  let rows = [];
  try {
    rows = await sbSelect(q);
  } catch (err) {
    res.status(502);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('Erreur: ' + err.message);
  }

  const stamp = nowISO.replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Delfosse Properties//Reservation directe//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Delfosse Direct ' + apt,
  ];
  for (const b of rows) {
    lines.push('BEGIN:VEVENT');
    lines.push('UID:' + b.id + '@delfosseproperties.com');
    lines.push('DTSTAMP:' + stamp);
    lines.push('DTSTART;VALUE=DATE:' + icalDate(b.check_in));
    lines.push('DTEND;VALUE=DATE:' + icalDate(b.check_out));
    lines.push(fold('SUMMARY:Indisponible (reservation directe)'));
    lines.push('TRANSP:OPAQUE');
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');

  res.status(200);
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'inline; filename="delfosse-' + apt + '.ics"');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=1800');
  return res.end(lines.join('\r\n') + '\r\n');
}
