/**
 * Supabase PostgREST helper (sans dependance npm)
 * ================================================
 * Toutes les fonctions serverless parlent a Supabase via son API REST
 * (PostgREST), avec la cle service_role -> bypass RLS. La cle ne quitte
 * JAMAIS le serveur : elle vit uniquement dans les variables
 * d'environnement Vercel (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).
 *
 * On reste volontairement en fetch brut, comme api/calendar.js, pour
 * garder zero dependance et zero etape de build.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function supabaseConfigured() {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

function baseHeaders(extra) {
  return Object.assign(
    {
      apikey: SERVICE_KEY,
      Authorization: 'Bearer ' + SERVICE_KEY,
      'Content-Type': 'application/json',
    },
    extra || {}
  );
}

function restUrl(path) {
  // path commence par le nom de table, ex: 'pricing?apartment_code=eq.01'
  return SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/' + path;
}

/**
 * GET generique sur une table. Retourne un array de lignes.
 * @param {string} path  ex: "settings?id=eq.1&select=*"
 */
export async function sbSelect(path) {
  const res = await fetch(restUrl(path), { headers: baseHeaders() });
  if (!res.ok) {
    const body = await res.text();
    throw new SupabaseError('select', res.status, body);
  }
  return res.json();
}

/**
 * INSERT. Retourne la (les) ligne(s) creee(s) si return=representation.
 * Leve une SupabaseError avec .status pour que l'appelant distingue
 * notamment le 409 (conflit = chevauchement de dates refuse par la
 * contrainte d'exclusion bookings_no_overlap).
 */
export async function sbInsert(table, row, { returning = true } = {}) {
  const res = await fetch(restUrl(table), {
    method: 'POST',
    headers: baseHeaders({
      Prefer: returning ? 'return=representation' : 'return=minimal',
    }),
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new SupabaseError('insert', res.status, body);
  }
  return returning ? res.json() : null;
}

/**
 * PATCH (update) sur un filtre. Retourne les lignes modifiees.
 * @param {string} table  ex: "pricing"
 * @param {string} filter ex: "apartment_code=eq.01"
 */
export async function sbUpdate(table, filter, patch) {
  const res = await fetch(restUrl(table + '?' + filter), {
    method: 'PATCH',
    headers: baseHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new SupabaseError('update', res.status, body);
  }
  return res.json();
}

/**
 * UPSERT (insert ou merge sur conflit de cle). Utile pour les saisons /
 * la grille de prix depuis l'admin.
 */
export async function sbUpsert(table, row, onConflict) {
  const q = onConflict ? '?on_conflict=' + encodeURIComponent(onConflict) : '';
  const res = await fetch(restUrl(table + q), {
    method: 'POST',
    headers: baseHeaders({
      Prefer: 'return=representation,resolution=merge-duplicates',
    }),
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new SupabaseError('upsert', res.status, body);
  }
  return res.json();
}

/**
 * DELETE sur un filtre.
 */
export async function sbDelete(table, filter) {
  const res = await fetch(restUrl(table + '?' + filter), {
    method: 'DELETE',
    headers: baseHeaders({ Prefer: 'return=minimal' }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new SupabaseError('delete', res.status, body);
  }
  return true;
}

export class SupabaseError extends Error {
  constructor(op, status, body) {
    super('Supabase ' + op + ' failed (' + status + '): ' + body);
    this.name = 'SupabaseError';
    this.status = status;
    this.body = body;
  }
  /** true si le refus vient de la contrainte anti-chevauchement. */
  get isOverlap() {
    return (
      this.status === 409 ||
      /bookings_no_overlap|exclusion|23P01/i.test(this.body || '')
    );
  }
}
