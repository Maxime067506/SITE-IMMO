/**
 * Code de verification par e-mail (sans base de donnees)
 * ======================================================
 * issueCode(email)  -> { code:'123456', token }   (le code part par e-mail,
 *                      le jeton va au navigateur)
 * checkCode(email, code, token) -> 'ok' | 'invalid' | 'expired'
 *
 * Le jeton contient l'expiration + une signature HMAC(email|code|exp) avec
 * un secret serveur : le navigateur ne peut ni lire le code ni fabriquer un
 * jeton. Secret : EMAIL_VERIFY_SECRET, sinon derive de la cle Supabase serveur.
 */

import crypto from 'node:crypto';

const TTL_MIN = 15;

function secret() {
  const base = process.env.EMAIL_VERIFY_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!base) throw new Error('Secret de verification absent.');
  return crypto.createHash('sha256').update('email-verify|' + base).digest();
}

function sign(email, code, exp) {
  return crypto.createHmac('sha256', secret()).update('v1|' + email + '|' + code + '|' + exp).digest('base64url');
}

export function issueCode(email, now = Date.now()) {
  const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  const exp = Math.floor(now / 1000) + TTL_MIN * 60;
  return { code, token: exp + '.' + sign(email, code, exp), expires_in_min: TTL_MIN };
}

export function checkCode(email, code, token, now = Date.now()) {
  const m = /^(\d{10})\.([A-Za-z0-9_-]{20,})$/.exec(String(token || ''));
  if (!m || !/^\d{6}$/.test(String(code || ''))) return 'invalid';
  const exp = Number(m[1]);
  if (Math.floor(now / 1000) > exp) return 'expired';
  const expected = Buffer.from(sign(email, String(code), exp));
  const got = Buffer.from(m[2]);
  return expected.length === got.length && crypto.timingSafeEqual(expected, got) ? 'ok' : 'invalid';
}
