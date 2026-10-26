/**
 * /api/admin/bookings  (protege)
 * ==============================
 * GET  ?status=&apt=&from=&to=   -> liste des reservations (defaut: actives & a venir)
 * POST { action:'create'|'block', apt, check_in, check_out, ... } -> resa/blocage manuel
 * POST { action:'cancel', id }   -> annule (statut 'cancelled', pas de suppression)
 *
 * "block" = bloquer des dates a la main (travaux, usage perso...) : cree une
 * ligne source='manual' / status='confirmed' sans montant.
 */

import { sbSelect, sbInsert, sbUpdate, supabaseConfigured, SupabaseError } from '../_lib/supabase.js';
import { requireAdmin } from '../_lib/admin-auth.js';
import { parseDate } from '../_lib/pricing.js';

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return;
  if (!supabaseConfigured()) return res.status(503).json({ ok: false, error: 'Base non configuree.' });

  try {
    if (req.method === 'GET') return listBookings(req, res);
    if (req.method === 'POST') {
      const action = (req.body && req.body.action) || 'create';
      if (action === 'cancel') return cancelBooking(req, res);
      return createBooking(req, res, action);
    }
    return res.status(405).json({ ok: false, error: 'Methode non supportee.' });
  } catch (err) {
    const status = err instanceof SupabaseError ? 502 : 500;
    return res.status(status).json({ ok: false, error: err.message });
  }
}

async function listBookings(req, res) {
  const q = req.query || {};
  const parts = ['select=*', 'order=check_in'];
  if (/^0[1-8]$/.test(String(q.apt || ''))) parts.push('apartment_code=eq.' + q.apt);
  if (typeof q.status === 'string' && q.status) {
    parts.push('status=in.(' + q.status.split(',').filter(Boolean).join(',') + ')');
  } else {
    parts.push('status=in.(hold,confirmed)');
    parts.push('check_out=gte.' + new Date().toISOString().slice(0, 10));
  }
  if (typeof q.from === 'string') parts.push('check_out=gt.' + encodeURIComponent(q.from));
  if (typeof q.to === 'string') parts.push('check_in=lt.' + encodeURIComponent(q.to));
  const rows = await sbSelect('bookings?' + parts.join('&'));
  return res.status(200).json({ ok: true, bookings: rows, count: rows.length });
}

async function createBooking(req, res, action) {
  const p = req.body || {};
  const apt = String(p.apt || p.apartment_code || '').padStart(2, '0');
  const checkIn = p.check_in;
  const checkOut = p.check_out;
  if (!/^0[1-8]$/.test(apt)) return res.status(400).json({ ok: false, error: 'apt invalide.' });
  if (!parseDate(checkIn) || !parseDate(checkOut) || checkOut <= checkIn) {
    return res.status(400).json({ ok: false, error: 'Dates invalides.' });
  }
  const row = {
    apartment_code: apt,
    check_in: checkIn,
    check_out: checkOut,
    status: 'confirmed',
    source: 'manual',
  };
  if (action === 'block') {
    row.guest_name = typeof p.notes === 'string' && p.notes ? p.notes.slice(0, 200) : 'Blocage manuel';
    row.notes = 'block';
  } else {
    row.guest_name = typeof p.guest_name === 'string' ? p.guest_name.slice(0, 200) : null;
    row.guest_email = typeof p.guest_email === 'string' ? p.guest_email.slice(0, 200) : null;
    row.guest_phone = typeof p.guest_phone === 'string' ? p.guest_phone.slice(0, 50) : null;
    row.guests_count = parseInt(p.guests, 10) || null;
    row.total_cents = Number.isFinite(Math.round(Number(p.total_cents))) ? Math.round(Number(p.total_cents)) : null;
    row.notes = typeof p.notes === 'string' ? p.notes.slice(0, 2000) : null;
  }
  try {
    const rows = await sbInsert('bookings', row);
    return res.status(201).json({ ok: true, booking: rows[0] });
  } catch (e) {
    if (e instanceof SupabaseError && e.isOverlap) {
      return res.status(409).json({ ok: false, code: 'overlap', error: 'Chevauchement avec une reservation existante.' });
    }
    throw e;
  }
}

async function cancelBooking(req, res) {
  const id = req.body && req.body.id;
  if (!id || !/^[0-9a-f-]{36}$/i.test(String(id))) {
    return res.status(400).json({ ok: false, error: 'id invalide.' });
  }
  const rows = await sbUpdate('bookings', 'id=eq.' + id, {
    status: 'cancelled',
    updated_at: new Date().toISOString(),
  });
  if (!rows.length) return res.status(404).json({ ok: false, error: 'Reservation introuvable.' });
  return res.status(200).json({ ok: true, booking: rows[0] });
}
