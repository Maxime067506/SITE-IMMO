/**
 * Routeur admin — UNE seule fonction serverless pour toutes les routes
 * /api/admin/* (plan Vercel Hobby limite a 12 fonctions).
 * La route dynamique [resource] capte data|pricing|settings|bookings|
 * seasons|deposit et delegue au handler correspondant.
 */

import data from '../_lib/admin/data.js';
import pricing from '../_lib/admin/pricing.js';
import settings from '../_lib/admin/settings.js';
import bookings from '../_lib/admin/bookings.js';
import seasons from '../_lib/admin/seasons.js';
import deposit from '../_lib/admin/deposit.js';

const HANDLERS = { data, pricing, settings, bookings, seasons, deposit };

export default function handler(req, res) {
  const resource = String((req.query && req.query.resource) || '');
  const h = HANDLERS[resource];
  if (!h) return res.status(404).json({ ok: false, error: 'Ressource admin inconnue : ' + resource });
  return h(req, res);
}
