/**
 * POST /api/contact — Formulaire de contact du site.
 * ==================================================
 * Corps JSON : { name, email, phone?, apartment?, message, lang? }
 * Envoie un e-mail a l'hote (HOST_EMAIL), avec reply-to = e-mail du visiteur,
 * et l'appartement concerne si choisi. Ne stocke rien.
 */
import { sendContactMessage } from './_lib/email.js';

const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i;
function str(v, n) { return typeof v === 'string' ? v.trim().slice(0, n) : ''; }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'POST requis.' });

  const p = req.body || {};
  const name = str(p.name, 80);
  const email = str(p.email, 120).toLowerCase();
  const message = str(p.message, 4000);
  const phone = str(p.phone, 30);
  const apartment = /^0[1-9]$/.test(String(p.apartment || '')) ? String(p.apartment) : '';

  if (name.length < 2 || !EMAIL.test(email) || message.length < 5) {
    return res.status(400).json({ ok: false, error: 'Nom, e-mail valide et message requis.' });
  }

  try {
    const r = await sendContactMessage({ name, email, phone, apartment, message });
    if (!r || !r.sent) return res.status(502).json({ ok: false, error: 'Envoi impossible pour le moment.' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'Erreur serveur.' });
  }
}
