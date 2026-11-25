/**
 * /api/cron/fiche-reminders — Rappels automatiques de fiche voyageur
 * ==================================================================
 * Cron quotidien (vercel.json). Repere les reservations confirmees dont
 * l'arrivee est dans 7, 3 ou 1 jour et dont la fiche n'est PAS complete
 * (nb de voyageurs saisis < nb attendu), et envoie un rappel — une seule
 * fois par palier (suivi dans bookings.fiche_reminders).
 *
 * Protege : Vercel Cron envoie « Authorization: Bearer <CRON_SECRET> ».
 * Si CRON_SECRET est defini, toute requete sans ce jeton est refusee (401).
 *
 * L'ANNULATION reste manuelle (admin) : ce cron n'annule ni n'encaisse rien.
 */
import { sbSelect, sbUpdate, supabaseConfigured } from '../_lib/supabase.js';
import { sendFicheReminder } from '../_lib/email.js';

const WINDOWS = [7, 3, 1];

function dayStr(offset) {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers['authorization'] || '';
  if (secret && auth !== 'Bearer ' + secret) return res.status(401).json({ ok: false, error: 'unauthorized' });
  if (!supabaseConfigured()) return res.status(503).json({ ok: false, error: 'db_not_configured' });

  const report = [];
  try {
    for (let i = 0; i < WINDOWS.length; i++) {
      const d = WINDOWS[i];
      const target = dayStr(d);
      const bookings = await sbSelect('bookings?status=eq.confirmed&source=eq.direct&check_in=eq.' + target +
        '&select=id,apartment_code,check_in,check_out,guests_count,guest_name,guest_email,fiche_reminders');
      for (let j = 0; j < bookings.length; j++) {
        const b = bookings[j];
        if (!b.guest_email) continue;
        const sent = String(b.fiche_reminders || '').split(',').filter(Boolean);
        if (sent.indexOf(String(d)) !== -1) continue; // palier deja envoye
        const travelers = await sbSelect('booking_travelers?booking_id=eq.' + b.id + '&select=id');
        const need = b.guests_count || 1;
        if (travelers.length >= need) continue; // fiche complete -> pas de rappel
        const r = await sendFicheReminder(b, d, 'fr');
        if (r && r.sent) {
          sent.push(String(d));
          await sbUpdate('bookings', 'id=eq.' + b.id, { fiche_reminders: sent.join(','), updated_at: new Date().toISOString() });
          report.push({ id: b.id, days: d });
        }
      }
    }
    return res.status(200).json({ ok: true, sent: report.length, report });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
