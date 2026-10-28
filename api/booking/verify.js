/**
 * POST /api/booking/verify
 * ========================
 * Envoie un code a 6 chiffres a l'adresse e-mail du voyageur.
 * Corps JSON : { email, lang }
 * Retour : { ok:true, token, expires_in_min }  -> le navigateur renvoie
 * token + code saisi a /api/booking/checkout, qui verifie avant de payer.
 */

import { cleanEmail } from '../_lib/guest.js';
import { issueCode } from '../_lib/email-verify.js';
import { sendVerificationCode, emailConfigured } from '../_lib/email.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'POST requis.' });

  const p = req.body || {};
  const lang = p.lang === 'en' ? 'en' : 'fr';
  const email = cleanEmail(p.email);
  if (!email) {
    return res.status(400).json({ ok: false, code: 'bad_email', error: lang === 'en' ? 'Invalid email address.' : 'Adresse e-mail invalide.' });
  }
  if (!emailConfigured()) {
    return res.status(503).json({ ok: false, code: 'config', error: 'Envoi d e-mail indisponible.' });
  }
  try {
    const { code, token, expires_in_min } = issueCode(email);
    await sendVerificationCode(email, code, lang);
    return res.status(200).json({ ok: true, token, expires_in_min });
  } catch (err) {
    console.error('[verify]', err.message);
    return res.status(502).json({
      ok: false, code: 'send_failed',
      error: lang === 'en' ? 'We could not send the code. Please check the address and try again.' : 'Impossible d\'envoyer le code. Vérifiez l\'adresse et réessayez.',
    });
  }
}
