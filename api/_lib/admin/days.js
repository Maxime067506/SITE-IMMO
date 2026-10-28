/**
 * /api/admin/?resource=days  (protege)
 * ====================================
 * Calendrier des prix au jour, comme sur Airbnb.
 *
 * GET  ?apt=01&from=YYYY-MM-DD&to=YYYY-MM-DD
 *      -> { days: [{ date, price_cents, kind }] }
 *         kind = 'day' (prix fixe a la main) | 'season' | 'weekend' | 'base'
 * POST { action:'set',   apartment_code, dates:[...], price_cents }
 * POST { action:'clear', apartment_code, dates:[...] }   (revient au prix habituel)
 *
 * Un prix au jour est prioritaire sur les saisons, le week-end et la base.
 */

import { sbSelect, sbUpsert, sbDelete, supabaseConfigured, SupabaseError } from '../supabase.js';
import { requireAdmin } from '../admin-auth.js';
import { parseDate, eachNight, priceForNight, dayPriceMap } from '../pricing.js';

const MAX_DAYS = 400;

function cleanDates(list) {
  if (!Array.isArray(list)) return null;
  const out = [];
  for (const d of list) {
    if (!parseDate(d)) return null;
    if (!out.includes(d)) out.push(d);
  }
  return out.length && out.length <= MAX_DAYS ? out : null;
}

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (!supabaseConfigured()) return res.status(503).json({ ok: false, error: 'Base non configuree.' });

  try {
    if (req.method === 'GET') {
      const q = req.query || {};
      const apt = String(q.apt || '').padStart(2, '0');
      if (!/^0[1-8]$/.test(apt)) return res.status(400).json({ ok: false, error: 'apt invalide.' });
      const from = parseDate(q.from), to = parseDate(q.to);
      if (!from || !to || to <= from || to - from > MAX_DAYS * 86400000) {
        return res.status(400).json({ ok: false, error: 'Plage de dates invalide.' });
      }
      const [pricingRows, seasons, dayRows] = await Promise.all([
        sbSelect('pricing?apartment_code=eq.' + apt + '&select=*'),
        sbSelect('pricing_seasons?or=(apartment_code.eq.' + apt + ',apartment_code.is.null)&select=*'),
        sbSelect('pricing_days?apartment_code=eq.' + apt + '&date=gte.' + q.from + '&date=lt.' + q.to + '&select=date,price_cents'),
      ]);
      const pricing = pricingRows[0];
      if (!pricing) return res.status(404).json({ ok: false, error: 'Tarifs introuvables.' });
      const dayPrices = dayPriceMap(dayRows);

      const days = eachNight(q.from, q.to).map((night) => {
        const price = priceForNight(night, pricing, seasons, apt, dayPrices);
        let kind = 'base';
        if (dayPrices[night.date] != null) kind = 'day';
        else if (seasons.some((s) => s.date_start <= night.date && s.date_end >= night.date &&
          (s.apartment_code === apt || s.apartment_code == null))) kind = 'season';
        else if (price !== pricing.base_price_cents) kind = 'weekend';
        return { date: night.date, price_cents: price, kind };
      });
      return res.status(200).json({ ok: true, apt, days });
    }

    if (req.method === 'POST') {
      const p = req.body || {};
      const apt = String(p.apartment_code || '').padStart(2, '0');
      if (!/^0[1-8]$/.test(apt)) return res.status(400).json({ ok: false, error: 'apartment_code invalide.' });
      const dates = cleanDates(p.dates);
      if (!dates) return res.status(400).json({ ok: false, error: 'Dates invalides (1 a ' + MAX_DAYS + ').' });

      if (p.action === 'clear') {
        await sbDelete('pricing_days', 'apartment_code=eq.' + apt + '&date=in.(' + dates.join(',') + ')');
        return res.status(200).json({ ok: true, cleared: dates.length });
      }
      if (p.action === 'set') {
        const price = Math.round(Number(p.price_cents));
        if (!Number.isFinite(price) || price < 1000 || price > 10000000) {
          return res.status(400).json({ ok: false, error: 'Prix invalide (>= 10 EUR).' });
        }
        const now = new Date().toISOString();
        await sbUpsert(
          'pricing_days',
          dates.map((date) => ({ apartment_code: apt, date, price_cents: price, updated_at: now })),
          'apartment_code,date'
        );
        return res.status(200).json({ ok: true, saved: dates.length });
      }
      return res.status(400).json({ ok: false, error: 'action inconnue (set|clear).' });
    }
    return res.status(405).json({ ok: false, error: 'Methode non supportee.' });
  } catch (err) {
    const status = err instanceof SupabaseError ? 502 : 500;
    const missing = err instanceof SupabaseError && /pricing_days/.test(err.body || '') && /exist|find/i.test(err.body || '');
    return res.status(status).json({
      ok: false,
      error: missing ? 'Table pricing_days absente : lancez db/pricing-days.sql dans Supabase.' : err.message,
    });
  }
}
