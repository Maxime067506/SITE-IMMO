/**
 * Jeton de la fiche voyageur
 * ==========================
 * Le lien envoye au voyageur (fiche-voyageur.html?booking=<id>&token=<t>)
 * porte un jeton HMAC derive de l'id de reservation + la cle service_role.
 * Il n'ajoute aucun secret a gerer et empeche l'enumeration des reservations.
 */
import crypto from 'crypto';

const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dev-secret';

/** Jeton (32 hex) pour une reservation donnee. */
export function ficheToken(bookingId) {
  return crypto.createHmac('sha256', SECRET).update('fiche:' + String(bookingId)).digest('hex').slice(0, 32);
}

/** Verifie le jeton en temps constant. */
export function verifyFicheToken(bookingId, token) {
  if (typeof token !== 'string' || token.length !== 32) return false;
  const expected = ficheToken(bookingId);
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch (_) {
    return false;
  }
}
