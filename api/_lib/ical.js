/**
 * Parseur iCal minimal (partage)
 * ===============================
 * Meme logique que api/calendar.js, isolee ici pour etre reutilisee par
 * l'endpoint de disponibilite. On ne lit que DTSTART / DTEND des VEVENT.
 * Le jour "end" est EXCLUSIF (RFC 5545), ce qui tombe bien : c'est aussi
 * notre convention pour check_out.
 */

export function parseICS(ics) {
  const events = [];
  const lines = String(ics || '').split(/\r\n|\n|\r/);
  let current = null;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    if (line === 'BEGIN:VEVENT') {
      current = {};
    } else if (line === 'END:VEVENT') {
      if (current && current.start && current.end) events.push(current);
      current = null;
    } else if (current) {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;
      const key = line.slice(0, colonIdx).split(';')[0];
      const value = line.slice(colonIdx + 1);
      if (key === 'DTSTART') current.start = formatICSDate(value);
      else if (key === 'DTEND') current.end = formatICSDate(value);
      else if (key === 'SUMMARY') current.summary = value;
      else if (key === 'UID') current.uid = value;
    }
  }
  return events;
}

export function formatICSDate(raw) {
  if (/^\d{8}/.test(raw)) {
    return raw.slice(0, 4) + '-' + raw.slice(4, 6) + '-' + raw.slice(6, 8);
  }
  return raw;
}

/**
 * Recupere le calendrier Airbnb d'un appartement (si une URL iCal est
 * configuree) et renvoie ses plages reservees. Ne jette pas : en cas
 * d'echec reseau on renvoie [] (Airbnb peut etre lent/indispo) -- la
 * dispo cote Supabase reste, elle, fiable.
 */
export async function fetchAirbnbBlocked(icalUrl) {
  if (!icalUrl) return [];
  try {
    const res = await fetch(icalUrl, {
      headers: { 'User-Agent': 'DelfossePropertiesBot/1.0' },
    });
    if (!res.ok) return [];
    const ics = await res.text();
    return parseICS(ics).map((e) => ({
      start: e.start,
      end: e.end,
      source: 'airbnb_ical',
    }));
  } catch (_) {
    return [];
  }
}
