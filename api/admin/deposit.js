/**
 * POST /api/admin/deposit  (protege)
 * ==================================
 * Gere l'empreinte de caution d'une reservation confirmee.
 *   { action:'preauth',  booking_id }          -> pre-autorise (empreinte)
 *   { action:'release',  booking_id }          -> libere l'empreinte
 *   { action:'capture',  booking_id, amount? } -> debite (degat), total ou partiel
 *
 * L'empreinte est un PaymentIntent a capture manuelle, cree off_session a
 * partir de la carte enregistree lors du paiement du sejour. A declencher
 * a l'approche de l'arrivee (une pre-autorisation ne tient que ~7 jours).
 */

import { sbSelect, sbUpdate, supabaseConfigured, SupabaseError } from '../_lib/supabase.js';
import { requireAdmin } from '../_lib/admin-auth.js';
import {
  getPaymentIntent, createPaymentIntent, capturePaymentIntent, cancelPaymentIntent, stripeConfigured,
} from '../_lib/stripe.js';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'POST requis.' });
  if (!supabaseConfigured() || !stripeConfigured()) return res.status(503).json({ ok: false, error: 'Service non configure.' });

  const p = req.body || {};
  const action = p.action;
  const id = p.booking_id;
  if (!id || !/^[0-9a-f-]{36}$/i.test(String(id))) return res.status(400).json({ ok: false, error: 'booking_id invalide.' });

  try {
    const rows = await sbSelect('bookings?id=eq.' + id + '&select=*');
    const b = rows[0];
    if (!b) return res.status(404).json({ ok: false, error: 'Reservation introuvable.' });

    if (action === 'preauth') return preauth(res, b);
    if (action === 'release') return release(res, b);
    if (action === 'capture') return capture(res, b, p.amount);
    return res.status(400).json({ ok: false, error: 'action inconnue.' });
  } catch (err) {
    const status = err instanceof SupabaseError ? 502 : 500;
    return res.status(status).json({ ok: false, error: err.message });
  }
}

async function preauth(res, b) {
  if (b.status !== 'confirmed') return res.status(400).json({ ok: false, error: 'Reservation non confirmee.' });
  if (!b.deposit_cents || b.deposit_cents <= 0) return res.status(400).json({ ok: false, error: 'Aucune caution a prendre.' });
  if (b.deposit_status === 'authorized' && b.stripe_deposit_intent_id) {
    return res.status(200).json({ ok: true, status: 'authorized', already: true });
  }
  if (!b.stripe_payment_intent_id) return res.status(400).json({ ok: false, error: 'Paiement initial introuvable.' });

  const rentPI = await getPaymentIntent(b.stripe_payment_intent_id);
  const customer = rentPI.customer;
  const pm = rentPI.payment_method;
  if (!customer || !pm) return res.status(400).json({ ok: false, error: 'Carte non enregistree pour cette reservation.' });

  let pi;
  try {
    pi = await createPaymentIntent({
      amount: b.deposit_cents, currency: 'eur', customer: customer, payment_method: pm,
      capture_method: 'manual', confirm: true, off_session: true,
      description: 'Caution Delfosse Properties — appart ' + b.apartment_code,
      metadata: { booking_id: b.id, kind: 'deposit' },
    });
  } catch (e) {
    return res.status(200).json({ ok: false, status: 'failed', error: 'Empreinte refusee : ' + e.message });
  }
  if (pi.status !== 'requires_capture' && pi.status !== 'succeeded') {
    return res.status(200).json({ ok: false, status: pi.status, error: 'Empreinte non autorisee (' + pi.status + ').' });
  }
  const upd = await sbUpdate('bookings', 'id=eq.' + b.id, {
    stripe_deposit_intent_id: pi.id, deposit_status: 'authorized', updated_at: new Date().toISOString(),
  });
  return res.status(200).json({ ok: true, status: 'authorized', booking: upd[0] });
}

async function release(res, b) {
  if (!b.stripe_deposit_intent_id) return res.status(400).json({ ok: false, error: 'Aucune empreinte a liberer.' });
  try {
    await cancelPaymentIntent(b.stripe_deposit_intent_id);
  } catch (e) {
    // deja annulee / capturee cote Stripe : on refletera quand meme l'etat.
    if (!/already|cannot be canceled|canceled/i.test(e.message)) {
      return res.status(502).json({ ok: false, error: e.message });
    }
  }
  const upd = await sbUpdate('bookings', 'id=eq.' + b.id, { deposit_status: 'released', updated_at: new Date().toISOString() });
  return res.status(200).json({ ok: true, status: 'released', booking: upd[0] });
}

async function capture(res, b, amount) {
  if (!b.stripe_deposit_intent_id) return res.status(400).json({ ok: false, error: 'Aucune empreinte a debiter.' });
  let amt = null;
  if (amount != null && amount !== '') {
    amt = Math.round(Number(amount));
    if (!Number.isFinite(amt) || amt <= 0 || amt > b.deposit_cents) {
      return res.status(400).json({ ok: false, error: 'Montant a debiter invalide.' });
    }
  }
  try {
    await capturePaymentIntent(b.stripe_deposit_intent_id, amt);
  } catch (e) {
    return res.status(502).json({ ok: false, error: e.message });
  }
  const upd = await sbUpdate('bookings', 'id=eq.' + b.id, { deposit_status: 'captured', updated_at: new Date().toISOString() });
  return res.status(200).json({ ok: true, status: 'captured', booking: upd[0] });
}
