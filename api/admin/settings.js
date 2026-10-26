/**
 * POST /api/admin/settings  (protege)
 * ===================================
 * Met a jour les reglages globaux (ligne unique id=1).
 * Champs acceptes : cleaning_fee_cents, deposit_cents, tax_percent,
 * tax_additional_percent, tax_cap_cents_per_night, min_lead_days,
 * hold_minutes, cancellation_policy.
 */

import { sbUpdate, supabaseConfigured, SupabaseError } from '../_lib/supabase.js';
import { requireAdmin } from '../_lib/admin-auth.js';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'POST requis.' });
  if (!supabaseConfigured()) return res.status(503).json({ ok: false, error: 'Base non configuree.' });

  const p = req.body || {};
  const patch = { updated_at: new Date().toISOString() };

  const intFields = {
    cleaning_fee_cents: [0, 100000000],
    deposit_cents: [0, 100000000],
    tax_cap_cents_per_night: [0, 100000000],
    min_lead_days: [0, 365],
    hold_minutes: [5, 240],
  };
  for (const [k, [lo, hi]] of Object.entries(intFields)) {
    if (k in p) {
      const n = Math.round(Number(p[k]));
      if (!Number.isFinite(n) || n < lo || n > hi) {
        return res.status(400).json({ ok: false, error: k + ' invalide (' + lo + '-' + hi + ').' });
      }
      patch[k] = n;
    }
  }

  const numFields = { tax_percent: [0, 100], tax_additional_percent: [0, 200] };
  for (const [k, [lo, hi]] of Object.entries(numFields)) {
    if (k in p) {
      const n = Number(p[k]);
      if (!Number.isFinite(n) || n < lo || n > hi) {
        return res.status(400).json({ ok: false, error: k + ' invalide (' + lo + '-' + hi + ').' });
      }
      patch[k] = n;
    }
  }

  if ('cancellation_policy' in p) {
    patch.cancellation_policy = String(p.cancellation_policy || '').slice(0, 2000);
  }

  try {
    const rows = await sbUpdate('settings', 'id=eq.1', patch);
    return res.status(200).json({ ok: true, settings: rows[0] || null });
  } catch (err) {
    const status = err instanceof SupabaseError ? 502 : 500;
    return res.status(status).json({ ok: false, error: err.message });
  }
}
