/**
 * GET /api/booking/confirm?session_id=cs_...
 * ==========================================
 * Appele par la page de confirmation. Re-recupere la session depuis Stripe
 * (source de verite) et confirme la reservation si le paiement est 'paid'.
 * Idempotent et sans donnee sensible en retour.
 */

import { getCheckoutSession, stripeConfigured } from '../_lib/stripe.js';
import { supabaseConfigured } from '../_lib/supabase.js';
import { confirmBookingFromSession } from '../_lib/booking-confirm.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  const sid = String((req.query && req.query.session_id) || '');
  if (!/^cs_[A-Za-z0-9_]+$/.test(sid)) return res.status(400).json({ ok: false, error: 'session_id invalide.' });
  if (!stripeConfigured() || !supabaseConfigured()) return res.status(503).json({ ok: false, error: 'Service non configure.' });

  try {
    const session = await getCheckoutSession(sid);
    const r = await confirmBookingFromSession(session);
    const b = r.booking || {};
    return res.status(200).json({
      ok: r.ok,
      status: r.status,
      booking: r.ok ? {
        apartment_code: b.apartment_code, check_in: b.check_in, check_out: b.check_out,
        nights: b.nights, guests_count: b.guests_count, total_cents: b.total_cents,
        deposit_cents: b.deposit_cents, guest_name: b.guest_name,
        ref: b.id ? String(b.id).slice(0, 8).toUpperCase() : null,
      } : undefined,
    });
  } catch (err) {
    return res.status(502).json({ ok: false, error: err.message });
  }
}
