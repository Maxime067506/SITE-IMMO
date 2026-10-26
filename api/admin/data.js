/**
 * GET /api/admin/data  (protege)
 * ==============================
 * Renvoie tout ce dont le tableau de bord admin a besoin en un appel :
 * appartements, grille de prix, reglages, saisons, et les reservations
 * actives/a venir. Les verrous perimes sont nettoyes au passage.
 */

import { sbSelect, sbUpdate, supabaseConfigured, SupabaseError } from '../_lib/supabase.js';
import { requireAdmin } from '../_lib/admin-auth.js';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (!supabaseConfigured()) {
    return res.status(503).json({ ok: false, error: 'Base non configuree.' });
  }
  try {
    const nowISO = new Date().toISOString();
    // Nettoie les verrous perimes pour une vue honnete.
    await sbUpdate(
      'bookings',
      'status=eq.hold&hold_expires_at=lt.' + encodeURIComponent(nowISO),
      { status: 'expired', updated_at: nowISO }
    );

    const [apartments, pricing, settings, seasons, bookings] = await Promise.all([
      sbSelect('apartments?select=*&order=code'),
      sbSelect('pricing?select=*&order=apartment_code'),
      sbSelect('settings?id=eq.1&select=*'),
      sbSelect('pricing_seasons?select=*&order=date_start'),
      sbSelect(
        'bookings?status=in.(hold,confirmed)&check_out=gte.' +
          nowISO.slice(0, 10) +
          '&select=*&order=check_in'
      ),
    ]);

    return res.status(200).json({
      ok: true,
      apartments,
      pricing,
      settings: settings[0] || null,
      seasons,
      bookings,
      now: nowISO,
    });
  } catch (err) {
    const status = err instanceof SupabaseError ? 502 : 500;
    return res.status(status).json({ ok: false, error: err.message });
  }
}
