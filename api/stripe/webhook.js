/**
 * POST /api/stripe/webhook
 * ========================
 * Recoit les evenements Stripe. Pour chaque evenement traite, on RE-RECUPERE
 * la session depuis Stripe (avec notre cle secrete) : c'est la source de
 * verite, donc un faux webhook ne peut rien confirmer ni annuler.
 *
 *  - checkout.session.completed -> confirme la reservation
 *  - checkout.session.expired   -> libere le verrou (statut 'expired')
 *
 * On repond toujours 200 (sauf erreur serveur) pour que Stripe n'empile pas
 * les relances.
 */

import { getCheckoutSession, stripeConfigured } from '../_lib/stripe.js';
import { sbSelect, sbUpdate, supabaseConfigured } from '../_lib/supabase.js';
import { confirmBookingFromSession } from '../_lib/booking-confirm.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST requis.' });
  if (!stripeConfigured() || !supabaseConfigured()) return res.status(503).json({ error: 'Non configure.' });

  const event = req.body || {};
  const type = event.type;
  const obj = (event.data && event.data.object) || {};

  try {
    if (type === 'checkout.session.completed' || type === 'checkout.session.async_payment_succeeded') {
      const session = await getCheckoutSession(obj.id);
      await confirmBookingFromSession(session);
    } else if (type === 'checkout.session.expired') {
      const session = await getCheckoutSession(obj.id);
      const bid = session.metadata && session.metadata.booking_id;
      if (bid && session.payment_status !== 'paid') {
        const rows = await sbSelect('bookings?id=eq.' + bid + '&select=status');
        if (rows[0] && rows[0].status === 'hold') {
          await sbUpdate('bookings', 'id=eq.' + bid, { status: 'expired', updated_at: new Date().toISOString() });
        }
      }
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    // 500 -> Stripe reessaiera plus tard.
    return res.status(500).json({ error: err.message });
  }
}
