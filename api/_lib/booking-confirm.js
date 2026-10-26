/**
 * Confirmation d'une reservation a partir d'une session Stripe payee.
 * Partage entre la page succes (api/booking/confirm) et le webhook Stripe.
 *
 * La transition hold -> confirmed est ATOMIQUE (update filtre sur status=hold)
 * : seul le premier appelant (page succes OU webhook) gagne, declenche les
 * e-mails, et evite tout doublon. Idempotent.
 */

import { sbSelect, sbUpdate } from './supabase.js';
import { sendBookingEmails } from './email.js';

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

  // Transition atomique : seul l'appel qui trouve encore status=hold gagne.
  const updated = await sbUpdate('bookings', 'id=eq.' + bookingId + '&status=eq.hold', {
    status: 'confirmed',
    stripe_payment_intent_id: session.payment_intent || null,
    hold_expires_at: null,
    updated_at: new Date().toISOString(),
  });

  if (!updated.length) {
    // Un autre appel a confirme entre-temps : pas de 2e e-mail.
    const fresh = await sbSelect('bookings?id=eq.' + bookingId + '&select=*');
    return { ok: true, status: (fresh[0] && fresh[0].status) || 'confirmed', booking: fresh[0] || booking, already: true };
  }

  const confirmed = updated[0];
  // E-mails (voyageur + hote), une seule fois. N'empeche jamais la confirmation.
  const lang = session.metadata && session.metadata.lang;
  try { await sendBookingEmails(confirmed, lang); } catch (_) { /* no-op */ }

  return { ok: true, status: 'confirmed', booking: confirmed };
}
