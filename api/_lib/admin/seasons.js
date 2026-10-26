/**
 * /api/admin/seasons  (protege)
 * =============================
 * GET -> liste des saisons tarifaires.
 * POST { action:'create', apartment_code|null, date_start, date_end, price_cents, label }
 * POST { action:'delete', id }
 *
 * Une saison ecrase le prix de base sur une plage de dates. apartment_code
 * null = s'applique a tous les apparts (une saison appart-specifique est
 * prioritaire).
 */

import { sbSelect, sbInsert, sbDelete, supabaseConfigured, SupabaseError } from '../supabase.js';
import { requireAdmin } from '../admin-auth.js';
import { parseDate } from '../pricing.js';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (!supabaseConfigured()) return res.status(503).json({ ok: false, error: 'Base non configuree.' });

  try {
    if (req.method === 'GET') {
      const rows = await sbSelect('pricing_seasons?select=*&order=date_start');
      return res.status(200).json({ ok: true, seasons: rows });
    }
    if (req.method === 'POST') {
      const action = (req.body && req.body.action) || 'create';
      if (action === 'delete') {
        const id = req.body && req.body.id;
        if (!id || !/^\d+$/.test(String(id))) return res.status(400).json({ ok: false, error: 'id invalide.' });
        await sbDelete('pricing_seasons', 'id=eq.' + id);
        return res.status(200).json({ ok: true });
      }
      // create
      const p = req.body || {};
      let apt = p.apartment_code == null || p.apartment_code === '' ? null : String(p.apartment_code).padStart(2, '0');
      if (apt != null && !/^0[1-8]$/.test(apt)) return res.status(400).json({ ok: false, error: 'apartment_code invalide.' });
      if (!parseDate(p.date_start) || !parseDate(p.date_end) || p.date_end < p.date_start) {
        return res.status(400).json({ ok: false, error: 'Dates de saison invalides.' });
      }
      const price = Math.round(Number(p.price_cents));
      if (!Number.isFinite(price) || price < 1000) {
        return res.status(400).json({ ok: false, error: 'price_cents invalide (>= 10 EUR).' });
      }
      const rows = await sbInsert('pricing_seasons', {
        apartment_code: apt,
        date_start: p.date_start,
        date_end: p.date_end,
        price_cents: price,
        label: typeof p.label === 'string' ? p.label.slice(0, 120) : null,
      });
      return res.status(201).json({ ok: true, season: rows[0] });
    }
    return res.status(405).json({ ok: false, error: 'Methode non supportee.' });
  } catch (err) {
    const status = err instanceof SupabaseError ? 502 : 500;
    return res.status(status).json({ ok: false, error: err.message });
  }
}
