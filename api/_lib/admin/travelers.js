/**
 * GET /api/admin/?resource=travelers&booking=<id>  (protege)
 * ==========================================================
 * Vue hote de la fiche voyageur (fiche individuelle de police) : liste des
 * voyageurs d'une reservation, avec une URL signee temporaire (5 min) vers
 * la copie de piece d'identite lorsqu'elle est encore stockee.
 *
 * Sert a presenter la liste des occupants aux autorites en cas de controle.
 * La copie de piece d'identite est supprimee automatiquement apres le depart
 * (voir api/_lib/admin/data.js) : au-dela, seules les donnees restent (6 mois).
 */

import { sbSelect, sbStorageSignedUrl, supabaseConfigured, SupabaseError } from '../supabase.js';
import { requireAdmin } from '../admin-auth.js';

const UUID = /^[0-9a-f-]{36}$/i;
const BUCKET = 'guest-ids';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (!supabaseConfigured()) return res.status(503).json({ ok: false, error: 'Base non configuree.' });
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Methode non supportee.' });

  const bookingId = String((req.query && req.query.booking) || '');
  if (!UUID.test(bookingId)) return res.status(400).json({ ok: false, error: 'Reservation invalide.' });

  try {
    const travelers = await sbSelect(
      'booking_travelers?booking_id=eq.' + bookingId +
      '&select=id,first_name,last_name,birth_date,birth_place,nationality,home_address,is_lead,id_doc_path,id_doc_deleted_at' +
      '&order=is_lead.desc,created_at.asc'
    );
    const out = [];
    for (const t of travelers) {
      let idUrl = null;
      if (t.id_doc_path) {
        try { idUrl = await sbStorageSignedUrl(BUCKET, t.id_doc_path, 300); } catch (_) { idUrl = null; }
      }
      out.push({
        id: t.id,
        first_name: t.first_name,
        last_name: t.last_name,
        birth_date: t.birth_date,
        birth_place: t.birth_place,
        nationality: t.nationality,
        home_address: t.home_address,
        is_lead: t.is_lead,
        has_id: Boolean(t.id_doc_path),
        id_url: idUrl,
        id_deleted: Boolean(t.id_doc_deleted_at),
      });
    }
    return res.status(200).json({ ok: true, booking_id: bookingId, travelers: out });
  } catch (err) {
    // Table pas encore creee (db/travelers.sql non applique) -> message clair.
    if (/relation .*booking_travelers.* does not exist|PGRST205|42P01/i.test(String(err && err.body || err && err.message || ''))) {
      return res.status(200).json({ ok: true, booking_id: bookingId, travelers: [], uninitialized: true });
    }
    const status = err instanceof SupabaseError ? 502 : 500;
    return res.status(status).json({ ok: false, error: err.message });
  }
}
