/**
 * Garde d'authentification admin (cote serveur)
 * ==============================================
 * Les endpoints /api/admin/* ecrivent en base (prix, reglages, resa) : ils
 * DOIVENT etre proteges cote serveur, pas seulement par du JS client. On
 * compare un mot de passe envoye par l'admin (header Authorization: Bearer
 * <pass>, ou x-admin-password) a ADMIN_PASSWORD (variable d'env Vercel),
 * en temps constant pour ne pas fuiter d'info par le temps de reponse.
 *
 * Simple et suffisant pour un outil mono-admin. On pourra passer a des
 * jetons signes a duree limitee plus tard si besoin.
 */

import { createHash, timingSafeEqual } from 'node:crypto';

function sha256(s) {
  return createHash('sha256').update(String(s), 'utf8').digest();
}

function extractPassword(req) {
  const auth = req.headers['authorization'] || req.headers['Authorization'];
  if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
    return auth.slice(7);
  }
  const x = req.headers['x-admin-password'];
  if (typeof x === 'string') return x;
  return '';
}

/**
 * Renvoie true si la requete est authentifiee. Sinon repond 401/503 et
 * renvoie false (l'appelant fait juste `if (!requireAdmin(req,res)) return;`).
 */
export function requireAdmin(req, res) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    res.status(503).json({ ok: false, error: 'ADMIN_PASSWORD non configure.' });
    return false;
  }
  const given = extractPassword(req);
  const a = sha256(given);
  const b = sha256(expected);
  // a et b font toujours 32 octets -> timingSafeEqual sur, sans fuite de longueur.
  if (!timingSafeEqual(a, b)) {
    res.setHeader('WWW-Authenticate', 'Bearer');
    res.status(401).json({ ok: false, error: 'Mot de passe admin invalide.' });
    return false;
  }
  return true;
}
