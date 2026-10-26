/**
 * Confirmation d'une reservation a partir d'une session Stripe payee.
 * Partage entre la page succes (api/booking/confirm) et le webhook Stripe.
 * Idempotent : confirmer deux fois ne change rien.
 */

import { sbSelect, sbUpdate } from './supabase.js';

/**
 * @param {object} session  session Checkout RE-RECUPEREE depuis Stripe
 * @returns {Promise<{ok:boolean, status:string, booking?:object}>}
 */
export async function confirmBookingFromSession(session) {
  const bookingId = session && session.metadata && session.metadata.booking_id;
  if (!bookingId) return { ok: false, status: 'no_booking' };

  const rows = await sbSelect('bookings?id=eq.' + bookingId + '&select=*');
  const booking = rows[0];
  if (!booking) return { ok: false, status: 'not_found' };

  if (booking.status === 'confirmed') return { ok: true, status: 'confirmed', booking: booking, already: true };
  if (booking.status === 'cancelled') return { ok: false, status: 'cancelled', booking: booking };

  if (session.payment_status !== 'paid') return { ok: false, status: 'pending', booking: booking };

  const updated = await sbUpdate('bookings', 'id=eq.' + bookingId, {
    status: 'confirmed',
    stripe_payment_intent_id: session.payment_intent || null,
    hold_expires_at: null,
    updated_at: new Date().toISOString(),
  });
  return { ok: true, status: 'confirmed', booking: updated[0] || booking };
}
