/**
 * POST /api/admin/pricing  (protege)
 * ==================================
 * Met a jour la grille de prix d'UN appartement.
 * Corps JSON : { apartment_code, base_price_cents, weekend_price_cents|null, min_nights }
 */

import { sbUpdate, supabaseConfigured, SupabaseError } from '../supabase.js';
import { requireAdmin } from '../admin-auth.js';

function cents(v) {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= 0 && n <= 100000000 ? n : null;
}

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'POST requis.' });
  if (!supabaseConfigured()) return res.status(503).json({ ok: false, error: 'Base non configuree.' });

  const p = req.body || {};
  const apt = String(p.apartment_code || '').padStart(2, '0');
  if (!/^0[1-8]$/.test(apt)) return res.status(400).json({ ok: false, error: 'apartment_code invalide.' });

  const base = cents(p.base_price_cents);
  if (base == null || base < 1000) {
    return res.status(400).json({ ok: false, error: 'base_price_cents invalide (>= 10 EUR).' });
  }
  const patch = { base_price_cents: base, updated_at: new Date().toISOString() };

  if ('weekend_price_cents' in p) {
    if (p.weekend_price_cents == null || p.weekend_price_cents === '') {
      patch.weekend_price_cents = null;
    } else {
      const w = cents(p.weekend_price_cents);
      if (w == null) return res.status(400).json({ ok: false, error: 'weekend_price_cents invalide.' });
      patch.weekend_price_cents = w;
    }
  }
  if ('min_nights' in p) {
    const m = parseInt(p.min_nights, 10);
    if (!Number.isFinite(m) || m < 1 || m > 90) {
      return res.status(400).json({ ok: false, error: 'min_nights invalide (1-90).' });
    }
    patch.min_nights = m;
  }

  try {
    const rows = await sbUpdate('pricing', 'apartment_code=eq.' + apt, patch);
    return res.status(200).json({ ok: true, pricing: rows[0] || null });
  } catch (err) {
    const status = err instanceof SupabaseError ? 502 : 500;
    return res.status(status).json({ ok: false, error: err.message });
  }
}
