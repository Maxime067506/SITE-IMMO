/**
 * Vercel Serverless Function — /api/calendar?id=01
 * ====================================================
 * Fetch le calendrier iCal Airbnb d'un appartement et retourne
 * les dates reservees en JSON pour affichage cote client.
 *
 * Configuration : les URLs iCal Airbnb sont stockees comme
 * variables d'environnement Vercel (AIRBNB_ICAL_01 ... AIRBNB_ICAL_07).
 *
 * Cache : 1h CDN + 24h stale-while-revalidate (evite de hammer Airbnb).
 */

// Map appartement id -> URL iCal Airbnb (via env vars)
const ICAL_URLS = {
  '01': process.env.AIRBNB_ICAL_01,
  '02': process.env.AIRBNB_ICAL_02,
  '03': process.env.AIRBNB_ICAL_03,
  '04': process.env.AIRBNB_ICAL_04,
  '05': process.env.AIRBNB_ICAL_05,
  '06': process.env.AIRBNB_ICAL_06,
  '07': process.env.AIRBNB_ICAL_07,
};

export default async function handler(req, res) {
  // CORS : permet l'appel depuis delfosseproperties.com
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const id = String(req.query.id || '').padStart(2, '0');

  if (!ICAL_URLS[id]) {
    return res.status(400).json({
      error: 'Invalid apartment id. Expected 01-07.',
      id,
    });
  }

  const url = ICAL_URLS[id];
  if (!url) {
    return res.status(503).json({
      error: 'No iCal URL configured for this apartment.',
      hint: 'Set AIRBNB_ICAL_' + id + ' in Vercel environment variables.',
      id,
    });
  }

  try {
    const fetchRes = await fetch(url, {
      headers: { 'User-Agent': 'DelfossePropertiesBot/1.0' },
    });
    if (!fetchRes.ok) {
      throw new Error('Upstream fetch failed: ' + fetchRes.status);
    }
    const ics = await fetchRes.text();
    const events = parseICS(ics);

    // Cache CDN 1h + 24h stale-while-revalidate
    res.setHeader(
      'Cache-Control',
      'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
    );
    return res.status(200).json({
      id,
      events,
      count: events.length,
      fetched: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      id,
    });
  }
}

/**
 * Parse un fichier ICS minimal (VEVENT avec DTSTART/DTEND).
 * Retourne un array de { start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }.
 * Les jours "end" sont EXCLUSIFS dans le format iCal (selon RFC 5545).
 */
function parseICS(ics) {
  const events = [];
  const lines = ics.split(/\r\n|\n|\r/);
  let current = null;

  for (let line of lines) {
    // Unfold (les lignes ICS peuvent etre repliees avec un espace au debut)
    line = line.trim();
    if (!line) continue;

    if (line === 'BEGIN:VEVENT') {
      current = {};
    } else if (line === 'END:VEVENT') {
      if (current && current.start && current.end) {
        events.push(current);
      }
      current = null;
    } else if (current) {
      // Parse key:value (la cle peut avoir des params apres ;)
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;
      const keyPart = line.slice(0, colonIdx);
      const value = line.slice(colonIdx + 1);
      const key = keyPart.split(';')[0];

      if (key === 'DTSTART') {
        current.start = formatICSDate(value);
      } else if (key === 'DTEND') {
        current.end = formatICSDate(value);
      } else if (key === 'SUMMARY') {
        current.summary = value;
      } else if (key === 'UID') {
        current.uid = value;
      }
    }
  }

  return events;
}

/**
 * Convertit une date ICS (YYYYMMDD ou YYYYMMDDTHHMMSSZ) en YYYY-MM-DD.
 */
function formatICSDate(raw) {
  // Date simple : "20260615"
  if (/^\d{8}$/.test(raw)) {
    return raw.slice(0, 4) + '-' + raw.slice(4, 6) + '-' + raw.slice(6, 8);
  }
  // Date-time : "20260615T120000Z" ou variantes
  if (/^\d{8}T/.test(raw)) {
    return raw.slice(0, 4) + '-' + raw.slice(4, 6) + '-' + raw.slice(6, 8);
  }
  return raw;
}
