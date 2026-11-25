/**
 * /api/booking/fiche — Fiche voyageur (fiche individuelle de police)
 * ==================================================================
 *  GET  ?booking=<id>&token=<t>            -> reservation + voyageurs (pre-remplissage)
 *  POST { booking, token, action:'save', travelers:[...] }
 *  POST { booking, token, action:'upload', traveler_id, content_type, data(base64) }
 *
 * Donnees (CESEDA R814-1 a R814-3) conservees 6 mois. La COPIE de piece
 * d'identite est stockee dans le bucket prive 'guest-ids' et SUPPRIMEE
 * automatiquement apres le depart (voir api/_lib/admin/data.js).
 */
import {
  sbSelect, sbInsert, sbDelete, sbUpdate, sbStorageUpload, sbStorageDelete,
  supabaseConfigured, SupabaseError,
} from '../_lib/supabase.js';
import { verifyFicheToken } from '../_lib/fiche-token.js';

const UUID = /^[0-9a-f-]{36}$/i;
const MAX_TRAVELERS = 12;
const BUCKET = 'guest-ids';
const TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'application/pdf': 'pdf' };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Cache-Control', 'no-store');
  if (!supabaseConfigured()) return res.status(503).json({ ok: false, error: 'Service non configuré.' });

  const q = req.query || {};
  const body = req.body || {};
  const bookingId = String((req.method === 'GET' ? q.booking : body.booking) || '');
  const token = String((req.method === 'GET' ? q.token : body.token) || '');
  if (!UUID.test(bookingId)) return res.status(400).json({ ok: false, error: 'Réservation invalide.' });
  if (!verifyFicheToken(bookingId, token)) return res.status(403).json({ ok: false, error: 'Lien invalide.' });

  try {
    const rows = await sbSelect('bookings?id=eq.' + bookingId + '&select=id,apartment_code,check_in,check_out,guests_count,guest_name,status');
    const booking = rows[0];
    if (!booking) return res.status(404).json({ ok: false, error: 'Réservation introuvable.' });
    if (booking.status === 'cancelled' || booking.status === 'expired') {
      return res.status(410).json({ ok: false, error: 'Cette réservation n\'est plus active.' });
    }

    if (req.method === 'GET') {
      const travelers = await sbSelect('booking_travelers?booking_id=eq.' + bookingId + '&select=id,first_name,last_name,birth_date,birth_place,nationality,home_address,id_document_number,is_lead,id_doc_path&order=created_at');
      return res.status(200).json({
        ok: true,
        booking: {
          apartment_code: booking.apartment_code, check_in: booking.check_in,
          check_out: booking.check_out, guests_count: booking.guests_count, guest_name: booking.guest_name,
        },
        travelers: travelers.map(function (t) {
          return {
            id: t.id, first_name: t.first_name, last_name: t.last_name, birth_date: t.birth_date,
            birth_place: t.birth_place, nationality: t.nationality, home_address: t.home_address,
            id_document_number: t.id_document_number,
            is_lead: t.is_lead, has_id: Boolean(t.id_doc_path),
          };
        }),
      });
    }

    if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Méthode non supportée.' });
    const action = body.action || 'save';

    if (action === 'save') {
      const list = Array.isArray(body.travelers) ? body.travelers.slice(0, MAX_TRAVELERS) : [];
      const clean = [];
      for (let i = 0; i < list.length; i++) {
        const t = list[i] || {};
        const fn = str(t.first_name, 100), ln = str(t.last_name, 100);
        if (!fn || !ln) continue;
        clean.push({
          booking_id: bookingId, first_name: fn, last_name: ln,
          birth_date: isDate(t.birth_date) ? t.birth_date : null,
          birth_place: str(t.birth_place, 200), nationality: str(t.nationality, 100),
          home_address: str(t.home_address, 300), id_document_number: str(t.id_document_number, 50),
          is_lead: clean.length === 0,
        });
      }
      if (!clean.length) return res.status(400).json({ ok: false, error: 'Renseignez au moins un voyageur (nom et prénom).' });
      if (clean.some(function (c) { return !c.id_document_number; })) {
        return res.status(400).json({ ok: false, error: 'Numéro de pièce d\'identité obligatoire pour chaque voyageur.' });
      }
      // Remplace les anciennes fiches + supprime leurs pieces d'identite stockees.
      const old = await sbSelect('booking_travelers?booking_id=eq.' + bookingId + '&select=id_doc_path');
      for (const o of old) { if (o && o.id_doc_path) { try { await sbStorageDelete(BUCKET, o.id_doc_path); } catch (_) {} } }
      await sbDelete('booking_travelers', 'booking_id=eq.' + bookingId);
      const inserted = await sbInsert('booking_travelers', clean);
      return res.status(200).json({
        ok: true, saved: inserted.length,
        travelers: inserted.map(function (t) { return { id: t.id, first_name: t.first_name, last_name: t.last_name, is_lead: t.is_lead }; }),
      });
    }

    if (action === 'upload') {
      const travelerId = String(body.traveler_id || '');
      if (!UUID.test(travelerId)) return res.status(400).json({ ok: false, error: 'Voyageur invalide.' });
      const trows = await sbSelect('booking_travelers?id=eq.' + travelerId + '&booking_id=eq.' + bookingId + '&select=id');
      if (!trows[0]) return res.status(404).json({ ok: false, error: 'Voyageur introuvable.' });
      const ct = String(body.content_type || '');
      if (!TYPES[ct]) return res.status(400).json({ ok: false, error: 'Format non accepté (JPEG, PNG ou PDF).' });
      let bytes;
      try { bytes = Buffer.from(String(body.data || '').replace(/^data:[^,]+,/, ''), 'base64'); } catch (_) { bytes = null; }
      if (!bytes || !bytes.length) return res.status(400).json({ ok: false, error: 'Fichier vide.' });
      if (bytes.length > 5 * 1024 * 1024) return res.status(413).json({ ok: false, error: 'Fichier trop volumineux (5 Mo max).' });
      const path = bookingId + '/' + travelerId + '.' + TYPES[ct];
      await sbStorageUpload(BUCKET, path, bytes, ct);
      await sbUpdate('booking_travelers', 'id=eq.' + travelerId, { id_doc_path: path, id_doc_deleted_at: null });
      return res.status(200).json({ ok: true, uploaded: true });
    }

    return res.status(400).json({ ok: false, error: 'Action inconnue.' });
  } catch (err) {
    const status = err instanceof SupabaseError ? 502 : 500;
    return res.status(status).json({ ok: false, error: err.message });
  }
}

function str(v, n) { return typeof v === 'string' && v.trim() ? v.trim().slice(0, n) : null; }
function isDate(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s); }
